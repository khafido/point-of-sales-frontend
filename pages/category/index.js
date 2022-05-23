import React, { useEffect, useState } from 'react';
import Layout from '@components/Layout';
import Search from 'antd/lib/input/Search';
import { Button, Col, Row, Form, Input, Modal, notification, Table, message, Space, Popconfirm } from 'antd';
import * as category from 'api/Category';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

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
        message: 'Please input category',
      },
      {
        validator: async (rule, value) => {
          let status = await category.checkCategoryExist(value).then(res => {
            return res;
          });
          console.log('category', status);
          if (status) {
            return Promise.reject('Category already exist');
          }
          return Promise.resolve();
        }
      }
    ]
  }

  const showModal = (type, id) => {
    setVisible(true);
    setSubmitParam({ type, id })
    switch (type) {
      case 'add':
        setModalTitle('Add New Category')
        setModalBody((
          <div>
            <Form layout='vertical' autoComplete='off' form={form}>
              <Form.Item label='Name' name='name' hasFeedback required rules={formRule.name} >
                <Input maxLength={255} />
              </Form.Item>
            </Form>
          </div>
        ))
        break
      case 'edit':
        const editIndex = tableData.findIndex((element) => element.id === id)
        const editData = tableData[editIndex]
        form.setFieldsValue({
          id,
          name: editData.name,
        })
        setModalTitle('Edit Category')
        setModalBody((
          <div>
            <Form layout='vertical' autoComplete='off' form={form}>
              <Form.Item label='Name' name='name' hasFeedback required rules={formRule.name} >
                <Input maxLength={255} />
              </Form.Item>
            </Form>
          </div>
        ))
        break
      case 'delete':
        const deleteIndex = tableData.findIndex((element) => element.id === id)
        const deleteData = tableData[deleteIndex]

        setModalTitle('Delete Category')
        setModalBody((
          `Are you sure want to delete category ${deleteData.name}?`
        ))

        break
    }
  };

  const handleOk = (value) => {
    setConfirmLoading(true);
    switch (submitParam.type) {
      case 'add':
        category.addCategory(value)
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
        category.updateCategory(submitParam.id, value)
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
    category.deleteCategory(id)
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
    console.log('Clicked cancel button');
    form.resetFields()
    setVisible(false);
  }

  const loadTableData = (
    searchBy = searchVal,
    page = tablePagination.page - 1,
    pageSize = tablePagination.pageSize,) => {
    setTableLoading(true)
    console.log(searchBy)
    category.listCategory(true, page, pageSize, searchBy, sortBy, sortDir)
      .then(result => {
        if (result.result) {
          setTableData(result.result.currentPageContent)
          setTableTotalPages(result.result.totalPages)
          setTableLoading(false)
        } else {
          notification.error({
            message: result.message ? result.message : 'Error loading category data',
            duration: 0
          })
        }
      })
  }

  useEffect(() => {
    loadTableData()
    setSearchLoading(false)
  }, [searchVal, page, sortBy, sortDir]);

  const columns = [
    {
      title: 'ID',
      key: 'id',
      dataIndex: 'id',
      hidden: true,
    },
    {
      title: 'Category Name',
      key: 'name',
      dataIndex: 'name',
      align: 'center',
      width: '30%',
      sorter: {
        compare: (a, b) => a.name - b.name,
        multiple: 1,
      },
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
    <Layout title="Category" subtitle="">
      <Row>
        <Col span={6}>
          <Search placeholder='Search' onSearch={onSearchData} loading={searchLoading} />
        </Col>
        <Col span={18}>
          <Button type='primary' icon={<PlusOutlined />} style={{ float: 'right' }} onClick={() => showModal('add')}>Add Category</Button>
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

