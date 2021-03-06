import React, { useEffect, useState } from 'react';
import Layout from '@components/Layout';
import Search from 'antd/lib/input/Search';
import { Button, Col, Row, Form, Input, Modal, notification, Table, message, Space, Popconfirm, InputNumber, DatePicker } from 'antd';
import * as voucher from 'api/Voucher';
import { DeleteOutlined, EditOutlined, LeftCircleFilled, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import TextArea from 'antd/lib/input/TextArea';


export default function Index() {
  const [form] = Form.useForm()

  // state for modal
  const [visible, setVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState((<div></div>));
  const [submitParam, setSubmitParam] = useState({ type: '', id: '' })

  const [searchLoading, setSearchLoading] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  // state for table and filter search
  const [searchVal, setSearchVal] = useState('');
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('');
  const [sortDir, setSortDir] = useState('');
  const [tablePagination, setTablePagination] = useState({ page: 1, pageSize: 10 });
  const [tableTotalPages, setTableTotalPages] = useState(0);

  const onSearchData = (value, e) => {
    setSearchLoading(true)
    setSearchVal(value)
    setTablePagination({
      page: 1,
      pageSize: 10
    })
  }

  const formRule = {
    name: [
      {
        required: true,
        message: 'Please input voucher name'
      }
    ]
    ,
    code: [
      {
        required: true,
        message: 'Please input voucher code',
      },
      {
        validator: async (rule, value) => {
          let status = await voucher.checkCodeExist(value).then(res => {
            return res;
          });
          console.log('voucher', status);
          if (status) {
            return Promise.reject('Voucher already exist');
          }
          return Promise.resolve();
        }
      }
    ],
    value: [
      {
        required: true,
        message: 'Please input voucher value'
      }
    ],
    quota: [
      {
        required: true,
        message: 'Please input voucher quota'
      }
    ],
    startDate: [
      {
        required: true,
        message: 'Please input start date '
      }
    ],
    endDate: [
      {
        required: true,
        message: 'Please input end date'
      }
    ],
    minimumPurchase: [
      {
        required: true,
        message: 'Please input minimum purchase '
      }
    ],
    description: [
      {
        required: true,
        message: 'Please input description'
      }
    ],
  }

  const showModal = (type, id) => {
    setVisible(true);
    setSubmitParam({ type, id })
    switch (type) {
      case 'add':
        setModalTitle('Add New Voucher')
        setModalBody((
          <div>
            <Form layout='vertical' autoComplete='off' form={form}>
              <Form.Item label='Name' name='name' hasFeedback required rules={formRule.name}>
                <Input maxLength={255} />
              </Form.Item>
              <Form.Item label='Code' name='code' hasFeedback required rules={formRule.code} >
                <Input maxLength={255} />
              </Form.Item>
              <Form.Item label='Value' name='value' hasFeedback required rules={formRule.value}>
                <InputNumber prefix='Rp' min={1} style={{ width: '100%' }}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
              <Form.Item label='Quota' name='quota' hasFeedback required rules={formRule.quota}>
                <InputNumber min={1} style={{ width: '100%' }}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
              <Form.Item label='Start Date' name='startDate' hasFeedback required rules={formRule.startDate}>
                <DatePicker className='' disabledDate={(current) => {
                  let customDate = moment().add(0, 'days');
                  return current && current > moment(customDate, "YYYY-MM-DD");
                }}
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <Form.Item label='End Date' name='endDate' hasFeedback required rules={formRule.endDate}>
                <DatePicker className='' disabledDate={(current) => {
                  let customDate = moment().add(0, 'days');
                  return current && current < moment(customDate, "YYYY-MM-DD");
                }}
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <Form.Item label='Minimum Purchase' name='minimumPurchase' hasFeedback required rules={formRule.minimumPurchase}>
                <InputNumber prefix='Rp' min={1} style={{ width: '100%' }}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
              <Form.Item label='Description' name='description' hasFeedback required rules={formRule.description}>
                <TextArea maxLength={255} />
              </Form.Item>

            </Form>
          </div>
        ))
        break
      case 'edit':
        const editIndex = tableData.findIndex((element) => element.id === id)
        const editData = tableData[editIndex]
        console.log("ed", editData)
        form.setFieldsValue({
          id,
          name: editData.name,
          value: editData.value,
          quota: editData.quota,
          startDate: moment(editData.startDate),
          endDate: moment(editData.endDate),
          minimumPurchase: editData.minimumPurchase,
          description: editData.description

        })
        setModalTitle('Edit Voucher')
        setModalBody((
          <div>
            <Form layout='vertical' autoComplete='off' form={form}>
              <Form.Item label='Name' name='name' hasFeedback required rules={formRule.name}>
                <Input maxLength={255} />
              </Form.Item>
              <Form.Item label='Value' name='value' hasFeedback required rules={formRule.value}>
                <InputNumber prefix='Rp' min={1} style={{ width: '100%' }}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
              <Form.Item label='Quota' name='quota' hasFeedback required rules={formRule.quota}>
                <InputNumber min={1} style={{ width: '100%' }}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
              <Form.Item label='Start Date' name='startDate' hasFeedback required rules={formRule.startDate}>
                <DatePicker className='' disabledDate={(current) => {
                  let customDate = moment().add(0, 'days');
                  return current && current > moment(customDate, "YYYY-MM-DD");
                }}
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <Form.Item label='End Date' name='endDate' hasFeedback required rules={formRule.endDate}>
                <DatePicker className='' disabledDate={(current) => {
                  let customDate = moment().add(0, 'days');
                  return current && current < moment(customDate, "YYYY-MM-DD");
                }}
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <Form.Item label='Minimum Purchase' name='minimumPurchase' hasFeedback required rules={formRule.minimumPurchase}>
                <InputNumber prefix='Rp' min={1} style={{ width: '100%' }}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
              <Form.Item label='Description' name='description' hasFeedback required rules={formRule.description}>
                <TextArea maxLength={255} />
              </Form.Item>

            </Form>
          </div>
        ))
        break
      case 'delete':
        const deleteIndex = tableData.findIndex((element) => element.id === id)
        const deleteData = tableData[deleteIndex]

        setModalTitle('Delete Voucher')
        setModalBody((
          `Are you sure want to delete Voucher ${deleteData.name}?`
        ))
        break
    }
  };

  const handleOk = (value) => {
    console.log("val", value)
    setConfirmLoading(true);
    switch (submitParam.type) {
      case 'add':
        voucher.addVoucher(value)
          .then(result => {
            setVisible(false);
            setConfirmLoading(false);
            if (result.status === 'CREATED') {
              notification.success({
                message: result.message,
                duration: 3
              })
            }
          })
          .catch(err => {
            console.log(err)
            message.error(err.message)
          })
          .finally(() => {
            form.resetFields()
            loadTableData()
          })
        break
      case 'edit':
        voucher.updateVoucher(submitParam.id, value)
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

  const onDelete = (id) => {
    voucher.deleteVoucher(id)
      .then(result => {
        setVisible(false);
        setConfirmLoading(false);
        if (result.status === 'SUCCESS') {
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
  }

  const handleCancel = () => {
    form.resetFields()
    setVisible(false);
  }

  const loadTableData = (
    searchBy = searchVal,
    page = tablePagination.page - 1,
    pageSize = tablePagination.pageSize,) => {
    setTableLoading(true)
    console.log(searchBy)
    voucher.listVoucher(true, page, pageSize, searchBy, sortBy, sortDir)
      .then(result => {
        if (result.result) {
          console.log("conten", result.result.currentPageContent)
          let res = result.result.currentPageContent
          res.map(e => {
            let startDate = moment(new Date(e.startDate))
            e.startDate = startDate.format("YYYY-MM-DD")
            let endDate = moment(new Date(e.endDate))
            e.endDate = endDate.format("YYYY-MM-DD")
          })
          setTableData(res)
          setTableTotalPages(result.result.totalPages)
          setTableLoading(false)
        } else {
          notification.error({
            message: result.message ? result.message : 'Error loading voucher data',
            duration: 0
          })
        }
      })
  }

  useEffect(() => {
    loadTableData()
    setSearchLoading(false)
    console.log('tabl', tableData)
  }, [searchVal, page, sortBy, sortDir]);

  const columns = [
    {
      title: 'ID',
      key: 'id',
      dataIndex: 'id',
      hidden: true,
    },
    {
      title: 'Name',
      key: 'name',
      dataIndex: 'name',
      align: 'center',
      fixed: 'left',
      sorter: {
        compare: (a, b) => a.name - b.name,
      },
    },
    {
      title: 'Code',
      key: 'code',
      dataIndex: 'code',
      align: 'center',
      sorter: {
        compare: (a, b) => a.name - b.name,
      },
    },
    {
      title: 'Value',
      key: 'value',
      dataIndex: 'value',
      align: 'center',
      sorter: {
        compare: (a, b) => a.name - b.name,
      },
      render: (text, record, index) => (
        <div>
          {`Rp ${text}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </div>
      )
    },
    {
      title: 'Quota',
      key: 'quota',
      dataIndex: 'quota',
      align: 'center',
      sorter: {
        compare: (a, b) => a.name - b.name
      },
    },
    {
      title: 'Start Date',
      key: 'startDate',
      dataIndex: 'startDate',
      align: 'center',
      sorter: {
        compare: (a, b) => a.name - b.name,
      },
    },
    {
      title: 'End date',
      key: 'endDate',
      dataIndex: 'endDate',
      align: 'center',
      sorter: {
        compare: (a, b) => a.name - b.name,

      },
    },
    {
      title: 'Minimum Purchase',
      key: 'minimumPurchase',
      dataIndex: 'minimumPurchase',
      align: 'center',
      sorter: {
        compare: (a, b) => a.name - b.name,

      },
      render: (text, record, index) => (
        <div>
          {`Rp ${text}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </div>
      )
    },
    {
      title: 'Description',
      key: 'description',
      dataIndex: 'description',
      align: 'center',
      sorter: {
        compare: (a, b) => a.name - b.name,

      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      fixed: 'right',
      render: (t, r) => (
        <Space size="middle">
          <Button type='primary' icon={<EditOutlined />} onClick={() => showModal('edit', r.id)}>Edit</Button>
          <Popconfirm
            title={`Confirm to delete ${r.name}`}
            onConfirm={(e) => {
              onDelete(r.id)
            }}
            okText="Yes"
            okButtonProps={{ danger: true }}
            cancelText="No"
          >
            <Button type='danger' icon={<DeleteOutlined />}>Delete</Button>
          </Popconfirm>
        </Space>
      )
    }
  ].filter(item => !item.hidden);

  const onChangePagination = (page, pageSize) => {
    setTablePagination({
      page,
      pageSize
    })
  }

  const onSortAndPagination = (pagination, sorter) => {
    setSortBy(sorter.field)
    setSortDir(sorter.order == 'ascend' ? 'asc' : 'desc')
    setPage(pagination.current)
  }


  return (
    <Layout title="Voucher" subtitle="">
      <Row>
        <Col span={6}>
          <Search placeholder='Search' onSearch={onSearchData} loading={searchLoading} />
        </Col>
        <Col span={18}>
          <Button type='primary' icon={<PlusOutlined />} style={{ float: 'right' }} onClick={() => showModal('add')}>Add Voucher</Button>
        </Col>
      </Row>
      <br />
      <Table
        columns={columns}
        dataSource={tableData}
        loading={tableLoading}
        rowKey={(record) => record.id}
        pagination={{
          onChange: onChangePagination,
          total: tableTotalPages * tablePagination.pageSize,
          pageSize: tablePagination.pageSize,
          showSizeChanger: true
        }}
        onChange={(pagination, filter, sorter) => {
          onSortAndPagination(pagination, sorter)
        }}
        scroll={{ x: 1300 }}

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

