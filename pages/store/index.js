import React, { useEffect, useState } from 'react'
import { create, getAll, remove, update, assignManager } from 'api/Store'
import * as role from 'api/Role'
import {
	Form,
	Input,
	Button,
	Radio,
	Row,
	Col,
	Modal,
	Space,
	Tag,
	Table,
	Divider,
	message,
	Popconfirm,
	Select,
	notification,
	Pagination,
} from 'antd'
import Layout from '@components/Layout'
import {
	DeleteOutlined,
	EditOutlined,
	UserAddOutlined,
	UserOutlined,
	UserSwitchOutlined,
} from '@ant-design/icons'
import { duration } from 'moment'

const { Search } = Input
const { Option } = Select

const rules = {
	name: [
		{
			required: true,
			message: 'Store name required',
		},
	],
	location: [
		{
			required: true,
			message: 'Store location required',
		},
	],
}

export default function Index() {
	const [mode, setMode] = useState('Create')
	const [visible, setVisible] = useState(false)
	const [visibleDetail, setVisibleDetail] = useState(false)
	const [visibleAssignManager, setVisibleAssignManager] = useState(false)
	const [storeId, setStoreId] = useState(null)
	const [storeData, setStoreData] = useState(null)
	const [loading, setLoading] = useState(true)
	const [loadingSelectManager, setLoadingSelectManager] = useState(true)
	const [loadingSubmitManager, setLoadingSubmitManager] = useState(false)
	const [roleManagerData , setRoleManagerData] = useState(null)

	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)
	const [serachValue, setSearchValue] = useState('')
	const [sortBy, setSortBy] = useState('')
	const [sortDir, setSortDir] = useState('')
	const [totalPage, setTotalPage] = useState(1)

	const [form] = Form.useForm()
	const [assignEmployeeForm] = Form.useForm()
	const [assignManagerForm] = Form.useForm()

	useEffect(() => {
		fetchStore()
	}, [serachValue, page, sortBy, sortDir])

	useEffect(() => {
		fetchManager()
	}, [])

	const fetchStore = () => {
		let pg = page - 1
		console.log('Fetching page', pg)
		setLoading(true)
		getAll(true, pg, pageSize, serachValue, sortBy, sortDir)
			.then((res) => {
				if (res) {
					const stores = res.data.result.currentPageContent.map((val) => {
						return { ...val, key: val.id }
					})
					setStoreData(stores)
					setPage(res.data.result.currentPage + 1)
					setTotalPage(res.data.result.totalPages * pageSize)
					console.log('Total page fetched', res.data.result.totalPages)
				}
				setLoading(false)
			})
			.catch((err) => {
				if (err) {
					console.log(err)
					message.error(err.response.data.message)
				}
				setLoading(false)
			})
	}

	const fetchManager = () => {
		role.getRoleById(3)
		.then(result=> {
			console.log(result.result)
			setRoleManagerData(result.result)
			setLoadingSelectManager(false)
		})
		.catch((err) => {
			if (err) {
				console.log(err)
				notification.error({
					message: 'Failed to load list of manager',
					duration: 0
				})
			}
		})
	}

	const onSave = (value) => {
		if (mode == 'Create') {
			create(value)
				.then((res) => {
					if (res) {
						message.success(res.data.message)
						fetchStore()
					}
				})
				.catch((err) => {
					if (err) {
						message.error(err.response.data.message)
					}
				})
		} else {
			update(storeId, value)
				.then((res) => {
					if (res) {
						message.success(res.data.message)
						fetchStore()
					}
				})
				.catch((err) => {
					if (err) {
						message.error(err.response.data.message)
					}
				})
		}
		console.log('Received values of form: ', value)
		setStoreId(null)
		setVisible(false)
	}

	const onSearch = (value) => {
		setSearchValue(value)
		console.log(storeData)
	}

	const onCancel = () => {
		setVisible(false)
	}

	const onEdit = (store) => {
		setMode('Edit')
		form.setFieldsValue({ name: store.name, location: store.location })
		setStoreId(store.id)
		setVisible(true)
	}

	const onDelete = (id) => {
		remove(id)
			.then((res) => {
				if (res) {
					message.success(res.data.message)
					fetchStore()
				}
			})
			.catch((err) => {
				if (err) {
					message.error(err.response.data.message)
				}
			})
	}

	const onAssignEmployee = (values) => {
		console.log(values)
	}

	const onShowDetailStore = (store) => {
		setVisibleDetail(true)
		console.log('Showing Detail Store : ', store.id)
	}

	const onAssignManager  = (data) => {
		assignManagerForm.setFieldsValue({
			storeId: data.id,
			storeName: data.name,
			currentManager: data.manager? `${data.manager.firstName} ${data.manager.lastName}` : '-'
		})
		setVisibleAssignManager(true)
	}

	const onSortAndPagination = (pagination, sorter) => {
		setSortBy(sorter.field)
		setSortDir(sorter.order == 'ascend' ? 'asc' : 'desc')
		setPage(pagination.current)
		console.log('SortBy', sorter.field, 'SortDir', sorter.order)
	}

	const StoreForm = () => {
		return (
			<Modal
				visible={visible}
				title={`${mode} Store`}
				okText="Save"
				cancelText="Cancel"
				onCancel={() => {
					form.resetFields()
					onCancel()
				}}
				onOk={() => {
					form
						.validateFields()
						.then((values) => {
							form.resetFields()
							onSave(values)
						})
						.catch((info) => {
							console.log('Validate Failed:', info)
						})
				}}
			>
				<Form
					form={form}
					layout="vertical"
					name="form_in_modal"
					initialValues={{
						name: '',
						location: '',
					}}
				>
					<Form.Item name="name" label="Store Name" rules={rules.name}>
						<Input />
					</Form.Item>
					<Form.Item
						name="location"
						label="Location"
						rules={rules.location}
					>
						<Input type="textarea" />
					</Form.Item>
				</Form>
			</Modal>
		)
	}

	const columns = [
		{
			title: 'Store Name',
			dataIndex: 'name',
			key: 'name',
			sorter: true,
		},
		{
			title: 'Location',
			dataIndex: 'location',
			key: 'location',
			sorter: true,
		},
		{
			title: 'Action',
			key: 'action',
			width: '20%',
			render: (text, record) => (
				<Space split={<Divider type="vertical" />}>
					<Button
						icon={<UserSwitchOutlined />}
						title="Assign Manager"
						size="large"
						onClick={(e) => {
							onAssignManager(record)
						}}
					></Button>
					<Button
						icon={<UserOutlined />}
						size="large"
						onClick={(e) => {
							onShowDetailStore(record)
						}}
					></Button>
					<Button
						icon={<EditOutlined />}
						size="large"
						onClick={(e) => {
							console.log(record)
							onEdit(record)
						}}
					></Button>
					<Popconfirm
						title={`Confirm to delete ${record.name}`}
						onConfirm={(e) => {
							onDelete(record.id)
						}}
						okText="Yes"
						okButtonProps={{ danger: true }}
						cancelText="No"
					>
						<Button
							icon={<DeleteOutlined />}
							danger
							size="large"
						></Button>
					</Popconfirm>
				</Space>
			),
		},
	]

	const storeDetailColumns = [
		{
			title: 'Name',
			key: 'name',
		},
		{
			title: 'Role',
			key: 'role',
		},
		{
			title: 'Action',
			key: 'action',
		},
	]

	const DetailStore = () => {
		return (
			<Modal
				visible={visibleDetail}
				title={`Detail Store`}
				footer={null}
				onCancel={() => {
					setVisibleDetail(false)
					assignEmployeeForm.resetFields()
				}}
				// onOk={() => {
				// 	form
				// 		.validateFields()
				// 		.then((values) => {
				// 			form.resetFields()
				// 			onSave(values)
				// 		})
				// 		.catch((info) => {
				// 			console.log('Validate Failed:', info)
				// 		})
				// }}
			>
				<Form
					form={assignEmployeeForm}
					layout="inline"
					name="assignEmployeeForm"
					initialValues={{
						employee: '',
						role: '',
					}}
					onFinish={(value) => {
						//handle assign store employee
						onAssignEmployee(value)
					}}
				>
					<Form.Item name="employee" rules={[{ required: true }]}>
						<Select
							placeholder="Select an employee"
							showSearch
							style={{ width: 100 }}
						>
							<Option value="employeeid1">Employee 1</Option>
							<Option value="employeeid2">Employee 2</Option>
							<Option value="employeeid3">Employee 3</Option>
						</Select>
					</Form.Item>
					<Form.Item
						name="role"
						rules={[{ required: true }]}
						style={{ width: 100 }}
					>
						<Select placeholder="Select a role">
							<Option value="role2">Cashier</Option>
							<Option value="role">Stockist</Option>
						</Select>
					</Form.Item>
					<Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							icon={<UserAddOutlined />}
							style={{ width: 50 }}
						></Button>
					</Form.Item>
				</Form>
				<br />
				<Table columns={storeDetailColumns} dataSource={null} />
			</Modal>
		)
	}

	const AssignManagerModal = ()=> {
		return (
			<Modal
				visible={visibleAssignManager}
				title='Assign Manager'
				onCancel={()=> setVisibleAssignManager(false)}
				onOk={()=> {
					assignManagerForm.validateFields()
					.then(value=> {
						setLoadingSubmitManager(true)
						assignManager({
							storeId: value.storeId,
							userId: value.manager
						}).then(result=> {
							setVisibleAssignManager(false)
							setLoadingSubmitManager(false)
							if(result.status === 'SUCCESS') {
								notification.success({
									message: result.message,
									duration: 3
								})
							} else {
								notification.error({
									message: result.status,
									description: result.message
								})
							}
							assignManagerForm.resetFields()
							fetchManager()
							fetchStore()
						})
					})
				}}
			>
				<Form
					form={assignManagerForm}
					layout='vertical'
				>
					<Form.Item
						label="Store ID"
						name="storeId"
						hidden
					>
						<Input readOnly />
					</Form.Item>
					<Form.Item
						label="Store Name"
						name="storeName"
					>
						<Input readOnly />
					</Form.Item>
					<Form.Item
						label="Current Manager"
						name="currentManager"
					>
						<Input  readOnly/>
					</Form.Item>
					<Form.Item
						label="Assign New Manager"
						name="manager"
						rules={[{ required: true, message: 'Please select new manager' }]}
					>
						<Select
							showSearch
							loading={loadingSelectManager}
							filterOption={(input, option) =>
								option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
							}
							filterSort={(optionA, optionB) =>
								optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
							}
						>
							{roleManagerData? roleManagerData.users.map(item=> {
								return <Select.Option 
									value={item.id} 
									key={item.id} 
									disabled={item.managerAt}
								>
									{item.managerAt? 
										`${item.firstName} ${item.lastName} (Manager at ${item.managerAt.name})` 
										: 
										`${item.firstName} ${item.lastName}`
									}
								</Select.Option>
							}) : null}
							
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		)
	}

	return (
		<Layout title="Store" subtitle="">
			<Row justify="space-between">
				<Col>
					<Button
						type="primary"
						onClick={() => {
							setMode('Create')
							setVisible(true)
						}}
					>
						New store
					</Button>
				</Col>
				<Col>
					<Search
						placeholder="Search store"
						// onSearch={onSearch}
						onChange={(e) => {
							onSearch(e.target.value)
						}}
						enterButton
					/>
				</Col>
			</Row>
			<br></br>
			<Table
				columns={columns}
				dataSource={storeData}
				loading={loading}
				pagination={{
					defaultCurrent: 1,
					current: page,
					pageSize: pageSize,
					total: totalPage,
					onChange: (pageVal) => {
						setPage(pageVal)
					},
				}}
				onChange={(pagination, filter, sorter) => {
					onSortAndPagination(pagination, sorter)
				}}
			/>
			<StoreForm
				visible={visible}
				onCreate={onSave}
				onCancel={() => {
					setVisible(false)
				}}
				mode={mode}
			/>
			<DetailStore />
			<AssignManagerModal />
		</Layout>
	)
}
