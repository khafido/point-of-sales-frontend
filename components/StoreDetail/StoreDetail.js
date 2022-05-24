import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import {
	Button,
	Col,
	Divider,
	Image,
	Popconfirm,
	Row,
	Space,
	Table,
	Tag,
	Input,
	message,
} from 'antd'
import * as api from 'api/Store'
import { useEffect, useState } from 'react'
const { Search } = Input

//nanti role si user ambil setelah dia login
const Role = {
	manager: 'ROLE_MANAGER',
	owner: 'ROLE_OWNER',
}

const StoreDetail = ({ storeId }) => {
	const [store, setStore] = useState(null)
	const [employee, setEmployee] = useState(null)
	const [loading, setLoading] = useState({ store: true, employee: true })

	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)
	const [serachValue, setSearchValue] = useState('')
	const [sortBy, setSortBy] = useState('')
	const [sortDir, setSortDir] = useState('')
	const [totalPage, setTotalPage] = useState(1)

	useEffect(() => {
		if (storeId) {
			fetchStore()
			fetchEmployee()
		}
	}, [storeId, serachValue, page, sortBy, sortDir, pageSize])

	const fetchStore = () => {
		api.getById(storeId)
			.then((res) => {
				if (res) {
					const store = res.data.result
					store.key = res.data.result.id
					store.totalEmployee = '-'
					store.manager = store.manager
						? res.data.result.manager.firstName +
						  ' ' +
						  res.data.result.manager.lastName
						: '-'
					setStore([store])
				}
			})
			.catch((err) => {
				if (err) {
					console.log(err)
					message.error(err.response.data.message)
				}
			})
			.finally(() => {
				setLoading((curr) => {
					return { ...curr, store: false }
				})
			})
	}

	const fetchEmployee = () => {
		let pg = page - 1
		api.getEmployeeById(
			storeId,
			true,
			pg,
			pageSize,
			serachValue,
			sortBy,
			sortDir
		)
			.then((res) => {
				if (res) {
					const employees = res.data.result.currentPageContent.map(
						(val) => {
							return {
								...val,
								key: val.id,
								photo: !val.user.photo
									? 'https://www.nicepng.com/png/detail/933-9332131_profile-picture-default-png.png'
									: val.user.photo,
								name: val.user.firstName + ' ' + val.user.lastName,
							}
						}
					)
					setEmployee(employees)
					setPage(res.data.result.currentPage + 1)
					setTotalPage(res.data.result.totalPages * pageSize)
				}
			})
			.catch((err) => {
				if (err) {
					console.log(err)
					message.error(err.response.data.message)
				}
			})
			.finally(() => {
				setLoading((curr) => {
					return { ...curr, employee: false }
				})
			})
	}

	const onSortAndPagination = (pagination, sorter) => {
		// setSortBy(sorter.field)
		setSortDir(sorter.order == 'ascend' ? 'asc' : 'desc')
		setPage(pagination.current)
		console.log('SortBy', sorter.field, 'SortDir', sorter.order)
	}

	const onRemoveEmployee = (id) => {
		//id == StoreEmployeeId
	}

	const onSearch = (value) => {
		setSearchValue(value)
	}

	const onSizeChange = (current, size) => {
		setPageSize(size)
		setPage(current)
	}

	const storeColumns = [
		{
			title: 'Store Name',
			dataIndex: 'name',
			key: 'name',
			sorter: false,
		},
		{
			title: 'Location',
			dataIndex: 'location',
			key: 'location',
			sorter: false,
		},
		{
			title: 'Total Emlployee',
			dataIndex: 'totalEmployee',
			key: 'totalEmployee',
			sorter: false,
		},
		{
			title: 'Manager',
			dataIndex: 'manager',
			key: 'location',
			sorter: false,
		},
	]

	const employeeColumns = [
		{
			title: 'Photo',
			dataIndex: 'photo',
			key: 'photo',
			render: (t, r) => (
				<Image
					key={r.id}
					width={40}
					preview={false}
					src={`${r.photo}`}
					alt="photo"
				/>
			),
			sorter: false,
		},
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			sorter: true,
		},
		{
			title: 'Roles',
			key: 'roles',
			dataIndex: 'roles',
			render: (t, r) =>
				r.user.roles.map((v, k) => (
					<Space key={k}>
						<Tag
							key={k}
							color="cyan"
							style={{
								textAlign: 'center',
								width: '80px',
								marginTop: '5px',
							}}
						>
							{v.name.replace('ROLE_', '')}
						</Tag>
					</Space>
				)),
		},
		{
			title: 'Action',
			key: 'action',
			width: '20%',
			render: (text, record) => (
				<Space direction="horizontal">
					<Popconfirm
						title={`Confirm to remove ${record.name} from this Store?`}
						onConfirm={(e) => {
							onRemoveEmployee(record.id)
						}}
						okText="Yes"
						okButtonProps={{ danger: true }}
						cancelText="No"
					>
						<Button icon={<DeleteOutlined />} type="primary" danger>
							Delete
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	]

	return (
		<>
			<Divider orientation="left" orientationMargin={0}>
				Store
			</Divider>
			<Table
				columns={storeColumns}
				dataSource={store}
				pagination={false}
				loading={loading.store}
			></Table>

			<br />
			<Divider orientation="left" orientationMargin={0}>
				Employees
			</Divider>
			<Row justify="space-between">
				<Col span={6}>
					<Search
						placeholder="Search employee"
						onSearch={onSearch}
						// onChange={(e) => {
						// 	onSearch(e.target.value)
						// }}
					/>
				</Col>
				<Col>
					<Button
						type="primary"
						onClick={() => {
							setMode('Create')
							setVisible(true)
						}}
						icon={<PlusOutlined />}
					>
						New store
					</Button>
				</Col>
			</Row>
			<br />
			<Table
				columns={employeeColumns}
				dataSource={employee}
				pagination={{
					defaultCurrent: 1,
					current: page,
					pageSize: pageSize,
					total: totalPage,
					showSizeChanger: true,
					onShowSizeChange: onSizeChange,
					onChange: (pageVal) => {
						setPage(pageVal)
					},
				}}
				onChange={(pagination, filter, sorter) => {
					onSortAndPagination(pagination, sorter)
				}}
			></Table>
		</>
	)
}

export default StoreDetail
