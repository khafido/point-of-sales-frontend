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
	Modal,
	Form,
	Select,
} from 'antd'
import { useForm } from 'antd/lib/form/Form'
import * as api from 'api/Store'
import * as role from 'api/Role'
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

	const [visible, setVisible] = useState(false)

	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)
	const [serachValue, setSearchValue] = useState('')
	const [sortBy, setSortBy] = useState('')
	const [sortDir, setSortDir] = useState('')
	const [totalPage, setTotalPage] = useState(1)

	const [form] = useForm()

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

	const onSave = (value) => {
		const reqData = {
			storeId: storeId,
			userId: value.userId,
		}
		api.adddEmployee(reqData)
			.then((res) => {
				if (res) {
					message.success(res.data.message)
					fetchStore()
					fetchEmployee()
				}
			})
			.catch((err) => {
				if (err) {
					message.error(err.response.data.message)
				}
			})
			.finally(() => {})
		// if (mode == 'Create') {
		// 	create(value)
		// 		.then((res) => {
		// 			if (res) {
		// 				message.success(res.data.message)
		// 				fetchStore()
		// 			}
		// 		})
		// 		.catch((err) => {
		// 			if (err) {
		// 				message.error(err.response.data.message)
		// 			}
		// 		})
		// } else {
		// 	update(storeId, value)
		// 		.then((res) => {
		// 			if (res) {
		// 				message.success(res.data.message)
		// 				fetchStore()
		// 			}
		// 		})
		// 		.catch((err) => {
		// 			if (err) {
		// 				message.error(err.response.data.message)
		// 			}
		// 		})
		// }
		console.log('Received values of form: ', value)
		setVisible(false)
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

	const AddEmployeeModal = () => {
		const [employeeOptionData, setEmployeeOptionData] = useState(null)
		const [loadingEmployeeOption, setLoadingEmployeeOption] = useState(true)

		const fetchEmployeeByRole = (roleId) => {
			role.getRoleById(roleId).then((res) => {
				if (res) {
					setEmployeeOptionData(res.result)
					setLoadingEmployeeOption(false)
				} else {
					message.error('Failed To Get Employees List')
				}
			})
		}

		return (
			<Modal
				visible={visible}
				title={`Add Employee to the Store`}
				okText="Save"
				cancelText="Cancel"
				onCancel={() => {
					form.resetFields()
					setVisible(false)
					setEmployeeOptionData(null)
				}}
				onOk={() => {
					form
						.validateFields()
						.then((values) => {
							form.resetFields()
							onSave(values)
							setEmployeeOptionData(null)
						})
						.catch((info) => {
							console.log('Validate Failed:', info)
						})
				}}
			>
				<Form form={form} layout="vertical" name="add_employee_fom">
					<Form.Item
						label="Select Role"
						name="role"
						rules={[
							{ required: true, message: 'Please select employee role' },
						]}
					>
						<Select onSelect={fetchEmployeeByRole}>
							<Select.Option value="4">Stockist</Select.Option>
							<Select.Option value="5">Cashier</Select.Option>
						</Select>
					</Form.Item>
					<Form.Item
						label="Select Employee"
						name="userId"
						rules={[
							{ required: true, message: 'Please select new manager' },
						]}
					>
						<Select
							showSearch
							loading={loadingEmployeeOption}
							filterOption={(input, option) =>
								option.children
									.toLowerCase()
									.indexOf(input.toLowerCase()) >= 0
							}
							filterSort={(optionA, optionB) =>
								optionA.children
									.toLowerCase()
									.localeCompare(optionB.children.toLowerCase())
							}
						>
							{employeeOptionData
								? employeeOptionData.users.map((item) => {
										return (
											<Select.Option
												value={item.id}
												key={item.id}
												disabled={item.workAt}
											>
												{item.workAt && item.workAt.length > 0
													? `${item.firstName} ${item.lastName} (Work at ${item.workAt[0].store.name})`
													: `${item.firstName} ${item.lastName}`}
											</Select.Option>
										)
								  })
								: null}
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		)
	}

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
							setVisible(true)
						}}
						icon={<PlusOutlined />}
					>
						Add Employee
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
			<AddEmployeeModal />
		</>
	)
}

export default StoreDetail
