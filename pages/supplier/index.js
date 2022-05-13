import React, { useEffect, useState } from 'react';
import Layout from '@components/Layout';
import { Button, Col, Row, Space, Table, Input, Modal, Form, notification, Popconfirm } from 'antd';
import * as supplier from 'api/Supplier'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

const { Search } = Input

export default function Index() {

  const [form] = Form.useForm()

  const [searchLoading, setSearchLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [tableLoading, setTableLoading] = useState(false)

  const [modalVisible, setModalVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [modalBody, setModalBody] = useState((<div></div>))
  const [modalFooterConfig, setModalFooterConfig] = useState({submitBtnText: '', submitBtnType: ''})

  const [searchVal, setSearchVal] = useState('')
  const [formData, setFormData] = useState({})
  const [submitDisabled, setSubmitDisabled] = useState(true)
  const [submitParam, setSubmitParam] = useState({type: '', id: ''})

  const [tableData, setTableData] = useState([])
  const [tablePagination, setTablePagination] = useState({page: 1, pageSize: 10})
  const [tableTotalPages, setTableTotalPages] = useState(0)

  const [tableSortBy, setTableSortBy] = useState('name')
  const [tableSortDir, setTableSortDir] = useState('ASC')

  const showModal = (type, id) => {
    setSubmitParam({type, id})
    setModalVisible(true)
    switch(type) {
      case 'add':
        setModalTitle('Add New Supplier')
        setModalBody((
          <div>
            <Form layout='vertical' autoComplete='off' onFieldsChange={onFieldsChange} form={form}>
              <Form.Item label='Name' name='name' hasFeedback required rules={[{required: true, message: 'Please input supplier name'}]}>
                <Input maxLength={255} />
              </Form.Item>
              <Form.Item label='Contact Person' name='cpname' hasFeedback required rules={[{required: true, message: 'Please input contact person supplier name'}]} >
                <Input maxLength={255} />
              </Form.Item>
              <Form.Item label='Email' name='email' hasFeedback required rules={[{required: true, type:'email', message: 'Please input supplier email'}]}>
                <Input maxLength={255} type='email' />
              </Form.Item>
              <Form.Item label='Phone' name='phone' hasFeedback required rules={[{required: true, message: 'Please input supplier phone number'}]}>
                <Input maxLength={255} type='tel' />
              </Form.Item>
              <Form.Item label='Address' name='address' hasFeedback required rules={[{required: true, message: 'Please input supplier address'}]}>
                <Input.TextArea maxLength={255} showCount />
              </Form.Item>
            </Form>
          </div>
        ))
        setModalFooterConfig({
          submitBtnText: 'Add',
          submitBtnType: 'primary',
        })
        setSubmitDisabled(true)
        break
      case 'edit':
        const editIndex = tableData.findIndex((element)=> element.id === id)
        const editData = tableData[editIndex]
        form.setFieldsValue({
          id,
          name: editData.name,
          cpname: editData.cpname,
          email: editData.email,
          phone: editData.phone,
          address:editData.address
        })

        setModalTitle('Edit Supplier')
        setModalBody((
          <div>
            <Form layout='vertical' autoComplete='off' onFieldsChange={onFieldsChange} form={form}>
              <Form.Item label='ID' name='id' initialValue={id}>
                <Input maxLength={255} readOnly />
              </Form.Item>
              <Form.Item label='Name' name='name' hasFeedback required rules={[{required: true, message: 'Please input supplier name'}]}>
                <Input maxLength={255}/>
              </Form.Item>
              <Form.Item label='Contact Person' name='cpname' hasFeedback required rules={[{required: true, message: 'Please input contact person supplier name'}]}>
                <Input maxLength={255} />
              </Form.Item>
              <Form.Item label='Email' name='email' hasFeedback required rules={[{required: true, type:'email', message: 'Please input supplier email'}]}>
                <Input maxLength={255} type='email' />
              </Form.Item>
              <Form.Item label='Phone' name='phone' hasFeedback required rules={[{required: true, message: 'Please input supplier phone number'}]}>
                <Input maxLength={255} type='tel' />
              </Form.Item>
              <Form.Item label='Address' name='address' hasFeedback required rules={[{required: true, message: 'Please input supplier address'}]}>
                <Input.TextArea maxLength={255} showCount />
              </Form.Item>
            </Form>
          </div>
        ))
        setModalFooterConfig({
          submitBtnText: 'Edit',
          submitBtnType: 'primary'
        })
        setSubmitDisabled(true)
        break
      case 'delete':
        const deleteIndex = tableData.findIndex((element)=> element.id === id)
        const deleteData = tableData[deleteIndex]
        
        setModalTitle('Delete Supplier')
        setModalBody((
          `Are you sure want to delete supplier ${deleteData.name}?`
        ))
        setModalFooterConfig({
          submitBtnText: 'Delete',
          submitBtnType: 'danger'
        })
        setSubmitDisabled(false)
        break
    }
  };

  const onFieldsChange = (changedField, allFields)=> {
    let data = {}
    allFields.forEach(element => {
      data[`${element.name[0]}`] = {
        value: element.value,
        errors: element.errors
      }
    });
    setFormData(data)
  }

  const cancelModal = () => {
    setModalVisible(false);
    form.resetFields()
  };

  const handleModalSubmit = () => {
    setSubmitLoading(true);
    switch(submitParam.type) {
      case 'add':
        supplier.addSupplier({
          name: formData.name.value,
          email: formData.email.value,
          phone: formData.phone.value,
          address: formData.address.value,
          cpname: formData.cpname.value
        }).then(result=> {
            setModalVisible(false);
            setSubmitLoading(false);
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
            loadTableData()
        })
        break
      case 'edit':
        supplier.updateSupplier(submitParam.id, {
          name: formData.name.value,
          email: formData.email.value,
          phone: formData.phone.value,
          address: formData.address.value,
          cpname: formData.cpname.value
        }).then(result=> {
          setModalVisible(false);
          setSubmitLoading(false);
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
          loadTableData()
        })
        break
      case 'delete':
        supplier.deleteSupplier(submitParam.id)
        .then(result=> {
          setModalVisible(false);
          setSubmitLoading(false);
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
          loadTableData()
        })
        break
    }
  }

  const validateForm = ()=> {
    if(Object.keys(formData).length>0) {
      let filled = false
      for(var key of Object.keys(formData)) {
        if(Object.keys(formData[key]['errors']).length>0 || !formData[key]['value']) {
          filled = true
          break
        }
      }
      setSubmitDisabled(filled)
    }
  }

  const onChangePagination = (page, pageSize)=> {
    setTablePagination({
      page, 
      pageSize
    })
  }

  const onSearchData = (value , e)=> {
    setSearchLoading(true)
    setSearchVal(value)
    setTablePagination({
      page: 1,
      pageSize: 10
    })
  }

  const loadTableData = (
    searchBy = searchVal,
    page = tablePagination.page-1, 
    pageSize = tablePagination.pageSize,
    sortBy = tableSortBy,
    sortDir = tableSortDir
  )=> {
    setTableLoading(true)
    supplier.listSuppliers(true, page, pageSize, searchBy, sortBy, sortDir)
    .then(result=> {
      if(result.result) {
        setTableData(result.result.currentPageContent)
        setTableTotalPages(result.result.totalPages)
        setTableLoading(false)
      } else {
        notification.error({
          message: result.message? result.message : 'Error loading supplier data',
          duration: 0
        })
      }
    })
  }

  const onTableSort = (sorter) => {
		setTableSortBy(sorter.field)
		setTableSortDir(sorter.order == 'ascend' ? 'ASC' : 'DESC')
		console.log('SortBy', sorter.field, 'SortDir', sorter.order)
	}

  useEffect(()=> {
    validateForm()
  }, [formData])

  useEffect(()=> {
    loadTableData()
    setSearchLoading(false)
  }, [tablePagination, tableSortBy, tableSortDir])

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => null
    },
    {
      title: 'Contact Person',
      dataIndex: 'cpname',
      key: 'cpname',
      sorter: (a, b) => null
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => null
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record, index)=> (
        <Space size="middle">
          <Button type='primary' icon={<EditOutlined/>}  onClick={()=> showModal('edit', record.id)}>Edit</Button>

          <Popconfirm
						title={`Confirm to delete ${record.name}`}
						onConfirm={(e) => {
              console.log(submitParam)
              handleModalSubmit()
						}}
						okText="Yes"
						okButtonProps={{ type: 'danger', loading: submitLoading }}
						cancelText="No"
					>
            <Button type='danger' icon={<DeleteOutlined/>} onClick={()=>{
              setSubmitParam({type: 'delete', id: record.id})}}>
                Delete            
            </Button>
					</Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <Layout title="Supplier" subtitle="">
      <Row>
        <Col span={6}>
          <Search placeholder='Search' onSearch={onSearchData} loading={searchLoading}/>
        </Col>
        <Col span={18}>
          <Button type="primary" icon={<PlusOutlined />} style={{float: 'right'}} onClick={()=> showModal('add')}>Add New</Button>
        </Col>
      </Row>
      <br />
      <Table 
        columns={columns}
        dataSource={tableData}
        loading={tableLoading}
        rowKey={(record)=> record.id}
        pagination={{
          onChange: onChangePagination,
          total: tableTotalPages * tablePagination.pageSize,
          pageSize: tablePagination.pageSize,
          showSizeChanger: true
        }}
        onChange={(pagination, filter, sorter) => {
					onTableSort(sorter)
				}}
      />

      <Modal
        title={modalTitle}
        visible={modalVisible}
        width={600}
        closable={false}
        footer={[
          <Button key="cancel" onClick={cancelModal}>
            Cancel
          </Button>,
          <Button key="submit" type={modalFooterConfig.submitBtnType} loading={submitLoading} onClick={handleModalSubmit} disabled={submitDisabled}>
            {modalFooterConfig.submitBtnText}
          </Button>
        ]}
      >
        {modalBody}
      </Modal>
    </Layout>
  )
}

