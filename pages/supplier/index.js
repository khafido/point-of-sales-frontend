import React, { useEffect, useState } from 'react';
import Layout from '@components/Layout';
import { Button, Col, Row, Space, Table, Input, Modal, Form, notification } from 'antd';
import * as supplier from 'api/Supplier'

const { Search } = Input

export default function Index() {

  const [modalVisible, setModalVisible] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [modalBody, setModalBody] = useState((<div></div>))
  const [formData, setFormData] = useState({})
  const [submitDisabled, setSubmitDisabled] = useState(true)
  const [tableData, setTableData] = useState({})

  const showModal = (type) => {
    setModalVisible(true);
    switch(type) {
      case 'add':
        setModalTitle('Add New Supplier')
        setModalBody((
          <div>
            <Form layout='vertical' autoComplete='off' onFieldsChange={onFieldsChange}>
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
        break
      case 'edit':
        setModalTitle('Edit Supplier')
        break
      case 'delete':
        setModalTitle('Delete Supplier')
        break
    }
  };

  const onFieldsChange = (changedField, allFields)=> {
    console.log(allFields)
    let data = {}
    allFields.forEach(element => {
      data[`${element.name[0]}`] = {
        value: element.value,
        errors: element.errors
      }
    });
    console.log(data)
    setFormData(data)
  }

  const cancelModal = () => {
    setModalVisible(false);
  };

  const handleModalSubmit = () => {
    setSubmitLoading(true);
    supplier.addSupplier({
      name: formData.name.value,
      email: formData.email.value,
      phone: formData.phone.value,
      address: formData.address.value,
      cpname: formData.cpname.value
    }).then(result=> {
      setTimeout(()=> {
        notification.success({
          message: result.message,
          description: JSON.stringify(result.result)
        })
      }, 1000)
    })
    setTimeout(() => {
      setModalVisible(false);
      setSubmitLoading(false);
    }, 1000);
  }

  const validateForm = ()=> {
    let filled = false
    for(var key of Object.keys(formData)) {
      if(Object.keys(formData[key]['errors']).length>0 || !formData[key]['value']) {
        filled = true
        break
      }
    }
    setSubmitDisabled(filled)
  }

  const loadTableData = ()=> {
    setTableLoading(true)
    supplier.listSuppliers(true, 0, 10, '', 'name', 'ASC')
    .then(result=> {
      setTableData(result.result)
      setTableLoading(false)
    })
  }

  useEffect(()=> {
    validateForm()
  }, [formData])

  useEffect(()=> {
    loadTableData()
  }, [])

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Contact Person',
      dataIndex: 'cpname',
      key: 'cpname'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
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
      render: ()=> (
        <Space size="middle">
          <a>Edit</a>
          <a>Delete</a>
        </Space>
      )
    }
  ]

  return (
    <Layout title="Supplier" subtitle="">
      <Row>
        <Col span={6}>
          <Search placeholder='Search'/>
        </Col>
        <Col span={18}>
          <Button type="primary" style={{float: 'right'}} onClick={()=> showModal('add')}>+ Add New</Button>
        </Col>
      </Row>
      <br />
      <Table 
        columns={columns}
        dataSource={tableData.currentPageContent}
        loading={tableLoading}
      />

      <Modal
        title={modalTitle}
        visible={modalVisible}
        width={600}
        footer={
          [
            <Button key="cancel" onClick={cancelModal}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" loading={submitLoading} onClick={handleModalSubmit} disabled={submitDisabled}>
              Submit
            </Button>
          ]
        }
      >
        {modalBody}
      </Modal>
    </Layout>
  )
}

