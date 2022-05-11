import React, { useEffect, useState } from 'react';
import Layout from '@components/Layout';
import Search from 'antd/lib/input/Search';
import { Image, Upload, Button, Col, Row, Form, Input, Modal, notification, Table, message, Space } from 'antd';
import * as item from 'api/Item';
import { UploadOutlined } from '@ant-design/icons';

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
  
  // state for table and filter search
  const [searchVal, setSearchVal] = useState('')
  const [tableData, setTableData] = useState([]);
  const [tablePagination, setTablePagination] = useState({page: 1, pageSize: 10})
  const [tableTotalPages, setTableTotalPages] = useState(0)

  const defaultImage = "https://archive.org/download/no-photo-available/no-photo-available.png"

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
        message: "Please enter item's name",
      },
    ],
    image:[
      // {
      //   required: true,
      //   message: "Please upload item's image",
      // }
    ],
    barcode:[
      {
        validator: async (rule, value) => {
          let status = await item.checkBarcodeExist(value).then(res => {
              return res;
          });
          console.log('barcode', status);
          if (status && value.length > 6) {
              return Promise.reject('Barcode is already exist');
          }
          return Promise.resolve();
        }
      }
    ],
    category:[
      {
        required: true,
        message: "Please enter item's category",
      }
    ],
  }

  const showModal = (type, id) => {
    setVisible(true);
    setSubmitParam({type, id})
    switch(type){
      case 'add':
        setModalTitle('Add New Item')
        setModalBody((
          <div>
            <Form layout='vertical' autoComplete='off' onFieldsChange={onFieldsChange}  form={form}>
              <Form.Item label='Name'name='name' hasFeedback required rules={formRule.name} >
                <Input maxLength={255}/>
              </Form.Item>
              <Form.Item label='Image'name='image' hasFeedback rules={formRule.image} >
                <Upload
                    accept="image/png, image/jpeg"
                    listType="picture"
                    maxCount={1}
                >
                    <Button>{<UploadOutlined />}Upload Photo</Button>
                </Upload>
              </Form.Item>
              <Form.Item label='Barcode'name='barcode' hasFeedback rules={formRule.barcode} >
                <Input maxLength={255}/>
              </Form.Item>
              <Form.Item label='Category'name='category' hasFeedback required rules={formRule.category} >
                <Input maxLength={255}/>
              </Form.Item>
              <Form.Item label='Packaging'name='packaging' hasFeedback >
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
            image: editData.image,
            barcode: editData.barcode,
            category: editData.category,
            packaging: editData.packaging,
          })
          setModalTitle('Edit Item')
          setModalBody((
            <div>
              <Form layout='vertical' autoComplete='off' onFieldsChange={onFieldsChange}  form={form}>
                <Form.Item label='Name'name='name' hasFeedback required rules={formRule.name} >
                  <Input maxLength={255}/>
                </Form.Item>
                <Form.Item label='Image'name='image' hasFeedback rules={formRule.image} >
                  <Upload
                      accept="image/png, image/jpeg"
                      listType="picture"
                      maxCount={1}
                  >
                      <Button>{<UploadOutlined />}Upload Photo</Button>
                  </Upload>
                </Form.Item>
                <Form.Item label='Barcode'name='barcode' hasFeedback rules={formRule.barcode} >
                  <Input maxLength={255}/>
                </Form.Item>
                <Form.Item label='Category'name='category' hasFeedback required rules={formRule.category} >
                  <Input maxLength={255}/>
                </Form.Item>
                <Form.Item label='Packaging'name='packaging' hasFeedback >
                  <Input maxLength={255}/>
                </Form.Item>
              </Form>
            </div>
          ))
          break
        case 'delete':
          const deleteIndex = tableData.findIndex((element)=> element.id === id)
        const deleteData = tableData[deleteIndex]
        
        setModalTitle('Delete Item')
        setModalBody((
          `Are you sure want to delete Item ${deleteData.name}?`
        ))

        break
    }
  };

  const onFieldsChange = (changedField, allFields)=> {
    // console.log("all fields = ", allFields)
    let data = {}
    allFields.forEach(element => {
      data[`${element.name[0]}`] = {
        value: element.value,
        errors: element.errors
      }
    });
    setFormData(data)
  }

  const handleOk = () => {
    setConfirmLoading(true);
    switch(submitParam.type){
      case 'add':
        let img
        if (formData.image.value === undefined) {
          formData.image.value = null
          img = formData.image.value
        }
        else {
          img = formData.image.value.file.thumbUrl
        }
        item.addItem({
          name: formData.name.value,
          image: img,
          barcode: formData.barcode.value,
          category: formData.category.value,
          packaging: formData.packaging.value,
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
        if (typeof(formData.image.value) == "string") {
          img = formData.image.value
        }
        else {
          img = formData.image.value.file.thumbUrl
        }

        item.updateItem(submitParam.id,{
          name: formData.name.value,
          image: img,
          barcode: formData.barcode.value,
          category: formData.category.value,
          packaging: formData.packaging.value,
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
        item.deleteItem(submitParam.id)
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

  // const validateForm = ()=> {
  //   let filled = false
  //   for(var key of Object.keys(formData)) {
  //     if(Object.keys(formData[key]['errors']).length>0 || !formData[key]['value']) {
  //       filled = true
  //       break
  //     }
  //   }
  // }

  // useEffect(() => {
  //   validateForm()
  // }, [formData])

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
      console.log(searchBy)
      item.listItems(true, page, pageSize, searchBy, 'name', 'asc')
      .then(result=> {
        if(result.result) {
          result.result.currentPageContent.map(item => {
            if (item.image == "string" | item.image == "" | item.image == null) {
                item.image = defaultImage;
            };
        })
          setTableData(result.result.currentPageContent)
          setTableTotalPages(result.result.totalPages)
          setTableLoading(false)
        } else {
          notification.error({
            message: result.message? result.message : 'Error loading items',
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
      key: 'name',
      dataIndex: 'name',
      fixed: 'left',
      width: 250,
      sorter: {
        compare: (a, b) => a.name - b.name,
      },
    },
    {
      title: 'Image',
      key: 'image',
      dataIndex: 'image',
      width: 200,
      render: (t, r) => <Image key={r.id} width={150} preview={false} src={`${r.image}`} alt="image" />,
    },
    {
      title: 'Barcode',
      key: 'barcode',
      dataIndex: 'barcode',
      width: 200,
    },
    {
      title: 'Category',
      key: 'category',
      dataIndex: 'category',
      width: 200,
      sorter: {
        compare: (a, b) => a.category - b.category,
      },
    },
    {
      title: 'Packaging',
      key: 'packaging',
      dataIndex: 'packaging',
      width: 200,
      sorter: {
        compare: (a, b) => a.packaging - b.packaging,
      },
    },
    {
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
      fixed: 'right',
      width: 195,
      // render: (t, r) =>
      //   <div className='place-content-center'>
      //     <Link href={'/user/edit/' + r.id}>
      //       <a className="float-left text-center px-4 pb-1 rounded-md text-white bg-blue-600 hover:bg-transparent border-2 border-blue-600 hover:text-blue-600">
      //         <EditOutlined /> Edit
      //       </a>
      //     </Link>
      //     <a onClick={() => deleteUserModal(r.id)} className="float-right inline px-3 pb-1 rounded-md text-white bg-red-800 hover:bg-transparent border-2 border-red-800 hover:text-red-800">
      //       <DeleteOutlined /> Delete
      //     </a>
      //   </div>
      
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

  return (
    <Layout title="Item" subtitle="">
      <Row>
        <Col span={6}>
        <Search placeholder='Search' onSearch={onSearchData} loading={searchLoading} />
        </Col>
        <Col span={18}>
          <Button type='primary' style={{float:'right'}} onClick={() => showModal('add')}>+ Add Item</Button>
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

