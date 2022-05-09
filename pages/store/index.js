import React, { useEffect, useState } from 'react'
import { getAll } from 'api/Store'
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
} from 'antd'
import Layout from '@components/Layout'
const { Search } = Input
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
	const [storeData, setStoreData] = useState(null)
	const [currPage, setCurrPage] = useState(0)
	const [totalPage, setTotalPage] = useState(1)
	const [loading, setLoading] = useState(true)
	const [form] = Form.useForm()

	const onCreate = (value) => {
		console.log('Received values of form: ', value)
		setVisible(false)
	}

	const onSearch = (value) => {
		alert(value)
	}

	const onCancel = () => {
		setVisible(false)
	}

	const StoreForm = () => {
		return (
			<Modal
				visible={visible}
				title="Create a new store"
				okText="Create"
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
							onCreate(values)
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
		},
		{
			title: 'Location',
			dataIndex: 'location',
			key: 'location',
		},
		{
			title: 'Action',
			key: 'action',
			render: (text, record) => (
				<Space size="middle">
					<a>Invite {record.name}</a>
					<a>Delete</a>
				</Space>
			),
		},
	]

	useEffect(() => {
		getAll()
			.then((res) => {
				if (res) {
					const stores = res.data.result.currentPageContent.map((val) => {
						return { ...val, key: val.id }
					})
					setStoreData(stores)
					setCurrPage(res.data.result.currentPage)
					setTotalPage(res.totalPage)
				}
			})
			.catch((err) => {
				if (err) {
					message.error(JSON.stringify(err.response.data))
				}
			})
	}, [])

	return (
		<Layout title="Store" subtitle="">
			<Row justify="space-between">
				<Col>
					<Button
						type="primary"
						onClick={() => {
							setVisible(true)
						}}
					>
						New store
					</Button>
				</Col>
				<Col>
					<Search
						placeholder="Search store"
						onSearch={onSearch}
						enterButton
					/>
				</Col>
			</Row>
			<br></br>
			<Table
				columns={columns}
				dataSource={storeData}
				pagination={{ current: currPage + 1, pageSize: totalPage }}
			/>
			<StoreForm
				visible={visible}
				onCreate={onCreate}
				onCancel={() => {
					setVisible(false)
				}}
				mode={mode}
			/>
		</Layout>
	)
}
