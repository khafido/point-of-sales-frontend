import React, { useEffect, useState, useRef } from 'react';
import Layout from '@components/Layout';
import Search from 'antd/lib/input/Search';
import { Image, Upload, Button, Col, Row, Form, Input, Modal, notification, Table, message, Space, Select,
        Popconfirm } from 'antd';
import * as item from 'api/Item';
import { UploadOutlined, CloseOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import * as category from 'api/Category';

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
    
  const [categories, setCategories] = useState([])
  const [formEdited, setFormEdited] = useState(false)
  const editType = useRef('')
  const editId = useRef(0)

  // state for table and filter search
  const [searchVal, setSearchVal] = useState('')
  const [tableData, setTableData] = useState([]);
  const [tablePagination, setTablePagination] = useState({page: 1, pageSize: 5})
  const [tableTotalPages, setTableTotalPages] = useState(0)
  const [sortBy, setSortBy] = useState()
  const [sortDir, setSortDir] = useState()

  const defaultImage = "https://archive.org/download/no-photo-available/no-photo-available.png"

  const children = []
  const { Option } = Select;

  const onSearchData = (value , e)=> {
    setSearchLoading(true)
    setSearchVal(value)
    setTablePagination({
      page: 1,
      pageSize: tablePagination.pageSize
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
          // console.log("check id = ", editId.current, " barcode = ", value)
          // console.log("check type = ", editType.current)
        
          let status
          if (editType.current == 'add') {
            status = await item.checkBarcodeOnAdd(value).then(res => {
              return res;
            });
          }
          else if (editType.current == 'edit') {
            status = await item.checkBarcodeOnEdit(editId.current, value).then(res => {
              return res;
            });
          }
          
        // console.log('barcode exist = ', status);

        if (status) {
            return Promise.reject('Barcode already exists');
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
        editType.current = type    
        console.log("OPEN ADD")

        setModalTitle('Add New Item')
        setModalBody((
          <div>
            <Form layout='vertical' autoComplete='off' onFieldsChange={onFieldsChange} onValuesChange={() => setFormEdited(true)} form={form}>
              <Form.Item label='Name'name='name' hasFeedback required rules={formRule.name} >
                <Input maxLength={255}/>
              </Form.Item>
              <Form.Item label='Image'name='image' hasFeedback rules={formRule.image} getValueFromEvent={normFile}>
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
                {selectCategory()}

              </Form.Item>
              <Form.Item label='Packaging'name='packaging' hasFeedback >
                <Input maxLength={255}/>
              </Form.Item>
            </Form>
          </div>
        ))
        break
        case 'edit':
          editType.current = type
          editId.current = id
          console.log("OPEN EDIT") 

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
          // console.log("edit data = ", editData)         
          setModalBody((
            <div>
              <Form layout='vertical' autoComplete='off' onFieldsChange={onFieldsChange} onValuesChange={() => setFormEdited(true)} form={form}>
                <Form.Item label='Name'name='name' hasFeedback required rules={formRule.name} >
                  <Input maxLength={255}/>
                </Form.Item>
                <Form.Item label='Image'name='image' hasFeedback rules={formRule.image} getValueFromEvent={normFile}>
                  <Upload
                      accept="image/png, image/jpeg"
                      listType="picture"
                      maxCount={1}
                      defaultFileList={(editData.image && editData.image != defaultImage)? [{name:editData.name, thumbUrl:editData.image}]: []}
                  >
                      <Button icon={<UploadOutlined />}>Upload Photo</Button>
                  </Upload>
                </Form.Item>
                <Form.Item label='Barcode'name='barcode' hasFeedback rules={formRule.barcode} >
                  <Input maxLength={255}/>
                </Form.Item>
                <Form.Item label='Category'name='category' hasFeedback required rules={formRule.category} >
                  {selectCategory()}
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
    let val = ""
    allFields.forEach((element, index) => {
      if (index == 4 && element.value) {
        val = element.value.charAt(0).toUpperCase() + element.value.slice(1)
      }
      else {
        val = element.value
      }

      data[`${element.name[0]}`] = {
        value: val,
        errors: element.errors
      }

    });
    // console.log("on fields change data = ", data)
    setFormData(data)
  }

  const normFile = (e) => {
    // console.log("e = ", e)
    // console.log("e array = ", Array.isArray(e))
    // console.log("e & e.fileList = ", e && e.fileList)
    
    if (Array.isArray(e)) {
        return e;
    }
    return e && e.fileList;
  };

  const handleOk = () => {
    setConfirmLoading(true);
    switch(submitParam.type){
      case 'add':
        console.log("form data = ", formData)
        let img
        if (formData.image.value === undefined) {
          img = null
        }
        else {
          img = formData.image.value[0].thumbUrl
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
          setFormEdited(false)
        })
        .catch(err => {
          console.log(err)
          message.error(err.message)
        })
      break
      case 'edit':
        console.log("form data = ", formData)

        if (typeof(formData.image.value) == "string") {
          img = formData.image.value
        }
        else if (formData.image.value.length == 0) {
          img = null
        }
        else {
          img = formData.image.value[0].thumbUrl
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
          form.resetFields()
          setFormEdited(false)
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

  const handleCancel = () => {
    console.log('Clicked cancel button');
    form.resetFields();
    setVisible(false);
  }

  const loadTableData = (
    searchBy = searchVal,
    page = tablePagination.page-1, 
    pageSize = tablePagination.pageSize,) => {
      setTableLoading(true)
      // console.log(searchBy)
      item.listItems(true, page, pageSize, searchBy, sortBy, sortDir)
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

  const loadCategories = () => {
    category.listCategory(false, 0, 10, '', 'name', 'asc')
    .then(result => {
      if (result.result) {
        setCategories(result.result.currentPageContent)
      }
    })
    .catch(err => console.log(err))
  }

  useEffect(() => {
    loadTableData()
    setSearchLoading(false)
    loadCategories()

  }, [tablePagination, sortBy, sortDir, formData]);

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
      sorter: (a, b) => a.name.localeCompare(b.name),

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
      sorter: (a, b) => a.category.localeCompare(b.category),

    },
    {
      title: 'Packaging',
      key: 'packaging',
      dataIndex: 'packaging',
      width: 200,
      sorter: (a, b) => a.packaging.localeCompare(b.packaging),

    },
    {
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
      fixed: 'right',
      width: 195,
      
      render: (t, r) => (
        <Space size="small">
          <Button 
            type='primary' 
            icon={<EditOutlined/>} 
            onClick={() => {
              form.resetFields();
              showModal('edit', r.id);
            }}
            >
              Edit
          </Button>
          
					<Popconfirm
						title={`Confirm to delete ${r.name}`}
						onConfirm={(e) => {
              handleOk()
						}}
						okText="Yes"
						okButtonProps={{ type: 'danger' }}
						cancelText="No"
					>
            <Button type='danger' icon={<DeleteOutlined/>} onClick={() => setSubmitParam({type:'delete', id:r.id})}>
                Delete            
            </Button>
					</Popconfirm>
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

	const onSortAndPagination = (pagination, sorter) => {
		setSortBy(sorter.field)
		setSortDir(sorter.order == 'ascend' ? 'asc' : 'desc')
		console.log('SortBy', sorter.field, 'SortDir', sorter.order)
	}

  const selectCategory = () => {
    // console.log("categories = ", categories)
    return (  
      <Select
        allowClear
        showSearch
        placeholder="Select Category"
        filterOption={(input, option) =>
          option.children.toLowerCase().includes(input.toLowerCase())
        }
      >
        {categories.map(c => {return <Option key={c.id} value={c.name}>{c.name}</Option>})}
      </Select>
      )
  };


  return (
    <Layout title="Item" subtitle="">
      <Row>
        <Col span={6}>
        <Search placeholder='Search Item' onSearch={onSearchData} loading={searchLoading} />
        </Col>
        <Col span={18}>
          <Button type='primary' style={{float:'right'}} onClick={() => showModal('add')} icon={<PlusOutlined/>}> Add Item</Button>
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
					onSortAndPagination(pagination, sorter)
				}}
      />
        <Modal
          title={modalTitle}
          visible={visible}
          okButtonProps={{disabled: !formEdited}}
          onOk={() => {
            form
              .validateFields()
              .then(() => {
                handleOk()
                form.resetFields()
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

