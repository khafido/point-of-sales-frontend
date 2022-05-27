import React, { useEffect, useState } from 'react';
import Layout from '@components/Layout';
import { Button, Col, Row, Form, Input, Modal, notification, Table, message, Space, Popconfirm } from 'antd';
import * as parameter from 'api/Parameter';
import { EditOutlined } from '@ant-design/icons';

export default function Index() {
  const [form] = Form.useForm()
  // state for modal
  const [visible, setVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState((<div></div>));
  const [submitParam, setSubmitParam] = useState({ type: '', id: '' })

  const [tableData, setTableData] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  const formRule = {
    name: [
      {
        required: true,
        message: 'Please input parameter',
      },
    ],
    value: [
      {
        required: true,
        message: 'Please input % value'
      }
    ]
  }

  const showModal = (type, id) => {
    setVisible(true);
    setSubmitParam({ type, id })
    switch (type) {
      case 'add':
        break
      case 'edit':
        const editIndex = tableData.findIndex((element) => element.id === id)
        const editData = tableData[editIndex]
        form.setFieldsValue({
          id,
          name: editData.name,
          value: editData.value
        })
        setModalTitle('Edit Parameter')
        setModalBody((
          <div>
            <Form layout='vertical' autoComplete='off' form={form}>
              <Form.Item label='Name' name='name' hasFeedback required rules={formRule.name} >
                <Input maxLength={255} />
              </Form.Item>
              <Form.Item label='Value' name='value' hasFeedback required rules={formRule.value} >
                <Input maxLength={255} />
              </Form.Item>
            </Form>
          </div>
        ))
        break
    }
  };

  const handleOk = (value) => {
    setConfirmLoading(true);
    switch (submitParam.type) {
      case 'add':
        break
      case 'edit':
        parameter.updateParameter(submitParam.id, value)
          .then(result => {
            setVisible(false);
            setConfirmLoading(false);
            if (result.status === 'SUCCESS') {
              notification.success({
                message: result.message,
                duration: 3
              })
            }
            loadTableData()
          })
          .catch(err => {
            console.log(err)
            message.error(err.message)
          })
        break
    }
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    form.resetFields()
    setVisible(false);
  }

  const loadTableData = () => {
    setTableLoading(true)
    parameter.getAllParameter()
      .then(result => {
        if (result.result) {
          setTableData(result.result)
          setTableLoading(false)
        } else {
          notification.error({
            message: result.message ? result.message : 'Error loading parameter data',
            duration: 0
          })
        }
      })
  }

  useEffect(() => {
    loadTableData()
  }, [])

  const columns = [
    {
      title: 'ID',
      key: 'id',
      dataIndex: 'id',
      hidden: true,
    },
    {
      title: 'Parameter Name',
      key: 'name',
      dataIndex: 'name',
      align: 'center',
      width: '30%',
    },
    {
      title: 'Parameter Value (%)',
      key: 'value',
      dataIndex: 'value',
      align: 'center',
      width: '30%',

    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      width: '30%',
      render: (t, r) => (
        <Space size="middle">
          <Button type='primary' icon={<EditOutlined />} onClick={() => showModal('edit', r.id)}>Edit</Button>
        </Space>
      )
    }
  ].filter(item => !item.hidden);



  return (
    <Layout title="Parameter" subtitle="">
      <Row></Row>
      <br />
      <br />
      <Table
        columns={columns}
        dataSource={tableData}
        loading={tableLoading}
        rowKey={(record) => record.id}
      />
      <Modal
        title={modalTitle}
        visible={visible}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields()
              handleOk(values)
            })
            .catch((info) => {
              console.log('Validate Failed:', info)
            })
        }}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        {modalBody}
      </Modal>
    </Layout>
  )
}

