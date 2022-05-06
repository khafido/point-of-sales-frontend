import React, { useEffect, useState } from 'react';
import Layout from '@components/Layout';
import Link from 'next/link';
import Search from 'antd/lib/input/Search';
import { Button,Col,Row, Form,Input,Modal, notification, Table, message, Space } from 'antd';
import * as category from 'api/Category';
import { duration } from 'moment';


export default function Index() {
  const [form] = Form.useForm()

  // state for modal
  const [visible, setVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState((<div></div>));
  const [formData, setFormData] = useState({});
  const [submitParam, setSubmitParam] = useState({type: '', id: ''})

  const [searchLoading, setSearchLoading] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
 

  const [searchVal, setSearchVal] = useState('')
  const [tableData, setTableData] = useState([]);
  const [tablePagination, setTablePagination] = useState({page: 1, pageSize: 10})
  const [tableTotalPages, setTableTotalPages] = useState(0)


  // testing filter 
  const onSearchData = (value , e)=> {
    setSearchLoading(true)
    setSearchVal(value)
    setTablePagination({
      page: 1,
      pageSize: 10
    })
  }

  const formRule = {
    name:[
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
          if (status && value.length > 6) {
              return Promise.reject('Category already exist');
          }
          return Promise.resolve();
        }
      }
    ]
  }

  const showModal = (type, id) => {
    setVisible(true);
    setSubmitParam({type, id})
    switch(type){
      case 'add':
        setModalTitle('Add New Category')
        setModalBody((
          <div>
            <Form layout='vertical' autoComplete='off' onFieldsChange={onFieldsChange}  form={form}>
              <Form.Item label='Name'name='name' hasFeedback required rules={formRule.name} >
                <Input maxLength={255}/>
              </Form.Item>
            </Form>
          </div>
        ))
        break
        case 'edit':
          const editIndex = tableData.findIndex((element)=> element.id === id)
          const editData = tableData[editIndex]
          form.setFieldsValue({
            id,
            name: editData.name,
          })
          setModalTitle('Edit Category')
          setModalBody((
            <div>
              <Form layout='vertical' autoComplete='off' onFieldsChange={onFieldsChange}  form={form}>
                <Form.Item label='Name'name='name' hasFeedback required rules={formRule.name} >
                  <Input maxLength={255}/>
                </Form.Item>
              </Form>
            </div>
          ))
          break
        case 'delete':
          const deleteIndex = tableData.findIndex((element)=> element.id === id)
        const deleteData = tableData[deleteIndex]
        
        setModalTitle('Delete Category')
        setModalBody((
          `Are you sure want to delete category ${deleteData.name}?`
        ))

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

  // TODO clear form field after submitting
  const handleOk = () => {
    setConfirmLoading(true);
    switch(submitParam.type){
      case 'add':
        category.addCategory({
          name:formData.name.value
        })
        .then(result=> {
          setVisible(false);
          setConfirmLoading(false);
          if(result.status === 'CREATED') {
            notification.success({
              message: result.message,
              duration: 3
            })
          } 
          form.resetFields()
          loadTableData()
        })
        .catch(err => {
          console.log(err)
          message.error(err.message)
        })
      break
      case 'edit':
        category.updateCategory(submitParam.id,{
          name:formData.name.value
        })
        .then(result=> {
          setVisible(false);
          setConfirmLoading(false);
          if(result.status === 'SUCCESS') {
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
      case 'delete':
        category.deleteCategory(submitParam.id)
        .then(result=> {
          setVisible(false);
          setConfirmLoading(false);
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
    
  };

  const validateForm = ()=> {
    let filled = false
    for(var key of Object.keys(formData)) {
      if(Object.keys(formData[key]['errors']).length>0 || !formData[key]['value']) {
        filled = true
        break
      }
    }
  }

  useEffect(() => {
    validateForm()
  }, [formData])

  const handleCancel = () => {
    console.log('Clicked cancel button');
    form.resetFields()
    setVisible(false);
  }

  const loadTableData = (
    searchBy = searchVal,
    page = tablePagination.page-1, 
    pageSize = tablePagination.pageSize,) => {
      setTableLoading(true)
      category.listCategory(true, page, pageSize, searchBy, 'name', 'asc')
      .then(result=> {
        if(result.result) {
          setTableData(result.result.currentPageContent)
          setTableTotalPages(result.result.totalPages)
          setTableLoading(false)
        } else {
          notification.error({
            message: result.message? result.message : 'Error loading category data',
            duration: 0
          })
        }
      })
    }

  useEffect(() => {
    loadTableData()
    setSearchLoading(false)
  }, [tablePagination]);

  const columns = [
    {
      title: 'ID',
      key: 'id',
      dataIndex: 'id',
      hidden: true,
    },
    {
      title: 'Name',
      key:'name',
      dataIndex: 'name',
      sorter: {
        compare: (a, b) => a.name - b.name,
        multiple: 1,
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (t, r) => (
        <Space size="middle">
          <Button type='primary' onClick={() => showModal('edit', r.id)}>Edit</Button>
          <Button type='danger' onClick={() => showModal('delete', r.id)}>Delete</Button>
        </Space>
      )
    }
  ].filter(item => !item.hidden);

  const onChangePagination = (page, pageSize)=> {
    setTablePagination({
      page, 
      pageSize
    })
  }

  const deleteUser = (id) => {
    alert("delete/"+id);
  }


  return (
    <Layout title="Category" subtitle="">
      <Row>
        <Col span={6}>
        <Search onChange={onSearchData} loading={searchLoading} />
        </Col>
        <Col span={18}>
          <Button type='primary' style={{float:'right'}} onClick={() => showModal('add')}>+ Add Category</Button>
        </Col>
      </Row>
      <br />
      <Table  
      columns={columns} 
      dataSource={tableData} 
      loading={tableLoading}
      pagination={{
        onChange: onChangePagination,
        total: tableTotalPages * tablePagination.pageSize,
        pageSize: tablePagination.pageSize,
        showSizeChanger: true
      }}
      />
        <Modal
          title={modalTitle}
          visible={visible}
          onOk={handleOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
        >
       {modalBody}
        </Modal>
    </Layout>
  )
}

