import React, { useEffect, useState } from 'react';
import Layout from '@components/Layout';
import Link from 'next/link';
import Search from 'antd/lib/input/Search';
import { Button,Col,Row, Form,Input,Modal, notification, Table } from 'antd';
import * as category from 'api/Category';


export default function Index() {
  // state for modal
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState((<div></div>));
  const [formData, setFormData] = useState({});
  const [tableData, setTableData] = useState([]);

  const showModal = (type) => {
    setVisible(true);
    switch(type){
      case 'add':
        setModalTitle('Add New Category')
        setModalBody((
          <div>
            <Form layout='vertical' autoComplete='off' onFieldsChange={onFieldsChange} >
              <Form.Item label='Name'name='name' hasFeedback required rules={[{required: true, message: 'Please input category name'}]} >
                <Input maxLength={255}/>
              </Form.Item>
            </Form>
          </div>
        ))
        break
        case 'edit':
          setModalTitle('Edit Category')
          break
        case 'delete':
          setModalTitle('Delete Category')
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


  const handleOk = () => {
    setConfirmLoading(true);
    category.addCategory({
      name:formData.name.value
    }).then(response=> {
      setTimeout(() => {
          notification.success({
            message: response.message,
            description: JSON.stringify(response.result)
          })  
      }, 1000)
    })
    setTimeout(() => {
      setVisible(false);
      setConfirmLoading(false);
    }, 1000)
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
    setVisible(false);
  }

  useEffect(() => {
    setTableLoading(true)
    category.listCategory(true, 0, 10)
      .then(response=> {
        setTableData(response.result.currentPageContent)
        setTableLoading(false)
      })
    console.log(tableData)
  }, []);

  const columns = [
    
    {
      title: 'ID',
      dataIndex: 'id',
      hidden: true,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: {
        compare: (a, b) => a.name - b.name,
        multiple: 1,
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (t, r) => 
        <div className='place-content-center'>
          <Link href={'/user/detail/'+r.id}>
              <a className="float-left text-center px-4 pb-1 rounded-md text-white bg-blue-600 hover:bg-transparent border-2 border-blue-600 hover:text-blue-600">            
               Edit
              </a>
          </Link>

          <a onClick={() => deleteUser(r.id)} className="float-right text-center inline px-3 pb-1 rounded-md text-white bg-red-800 hover:bg-transparent border-2 border-red-800 hover:text-red-800">
           Delete
          </a>
        </div>
    }
  ].filter(item => !item.hidden);

  
  function onChange(pagination, filters, sorter, extra) {
    console.log('params', pagination, filters, sorter, extra);
    let filteredData = tableData;
    // sort filterdata by sorter.field asc
    if (sorter.field) {
      filteredData = filteredData.sort((a, b) => {
        if (sorter.order === 'ascend') {
          return a[sorter.field] - b[sorter.field];
        } else {
          return b[sorter.field] - a[sorter.field];
        }
      }
      );
    }
    const numberedFilteredData = filteredData.map((item) => ({
      ...item
    }));
    setTableData(numberedFilteredData);
  }

  const filterData = (e) => {
    const search = e.target.value;
    const filteredData = tableData.filter(
      item => 
        item.name.toLowerCase().includes(search.toLowerCase()) 
      );
    const numberedFilteredData = filteredData.map((item) => ({
      ...item
    }));
    setTableData(numberedFilteredData);
  }

  const deleteUser = (id) => {
    alert("delete/"+id);
  }


  return (
    <Layout title="Category" subtitle="">
      <Row>
        <Col span={6}>
        <Search onChange={filterData} />
        </Col>
        <Col span={18}>
          <Button type='primary' style={{float:'right'}} onClick={() => showModal('add')}>+ Add Category</Button>
        </Col>
      </Row>
      <br />
      <Table  
      columns={columns} 
      dataSource={tableData} 
      onChange={onChange}
      loading={tableLoading}  />
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

