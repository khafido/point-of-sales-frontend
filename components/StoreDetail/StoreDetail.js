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
} from 'antd'
import { useState } from 'react'
const { Search } = Input

//nanti role si user ambil setelah dia login
const Role = {
	manager: 'ROLE_MANAGER',
	owner: 'ROLE_OWNER',
}

const StoreDetail = ({ store, employee, loading }) => {
	const onRemoveEmployee = (id) => {
		//id == StoreEmployeeId
	}

	const onSearch = (value) => {}

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
				r.roles.map((v, k) => (
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
				loading={loading.store}
			></Table>
			<Divider orientation="left" orientationMargin={0}>
				Employees
			</Divider>
			<Row justify="space-between">
				<Col span={6}>
					<Search
						placeholder="Search store"
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
			<Table columns={employeeColumns}></Table>
		</>
	)
}

export default StoreDetail
