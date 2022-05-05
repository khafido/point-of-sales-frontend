import React, { useEffect, useState } from 'react';
import Layout from '@components/Layout';
import Link from 'next/link';
import Search from 'antd/lib/input/Search';
import { Modal, Table } from 'antd';
import {UserAddOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons';

export default function Index() {
  const [categoryData, setCategoryData] = useState([])
  useEffect(() => {
    const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
    const numberedData = sortedData.map((item, index) => ({
        ...item,
        numrow: index + 1,
    }));
    setCategoryData(numberedData);
  }, []);

  const columns = [
    {
      title: '#',
      dataIndex: 'numrow',
    },
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
              <a className=" text-center px-4 pb-1 rounded-md text-white bg-blue-600 hover:bg-transparent border-2 border-blue-600 hover:text-blue-600">            
                <EditOutlined /> Edit
              </a>
          </Link>

          <a onClick={() => deleteUser(r.id)} className="text-center inline px-3 pb-1 rounded-md text-white bg-red-800 hover:bg-transparent border-2 border-red-800 hover:text-red-800">
            <DeleteOutlined /> Delete
          </a>
        </div>
    }
  ].filter(item => !item.hidden);

    
  const data = [
    {
      id: 1,
      name: "Category 1",
      action: ''
    },
    {
      id: 2,
      name: "Category 2",
      action: ''
    },
    {
      id: 3,
      name: "Category 3",
      action: ''
    },
  ];
  
  function onChange(pagination, filters, sorter, extra) {
    console.log('params', pagination, filters, sorter, extra);
  }

  const filterData = (e) => {
    const search = e.target.value;
    const filteredData = data.filter(
      item => 
        item.name.toLowerCase().includes(search.toLowerCase()) 
      );
    const numberedFilteredData = filteredData.map((item, index) => ({
      ...item,
      numrow: index + 1,
    }));
    setCategoryData(numberedFilteredData);
  }

  const deleteUser = (id) => {
    alert("delete/"+id);
  }


  return (
    <Layout title="Category" subtitle="">
      <div className='w-[200px] float-left'>
        <Link href="user/form">
          <a className='text-center px-4 pb-2 pt-1 rounded-md text-white bg-green-600 hover:bg-transparent border-2 border-green-600 hover:text-green-600'>
            <UserAddOutlined /> Add Category
          </a>
        </Link>
      </div>
      <div className='w-[200px] float-right'>
        <Search onChange={filterData} />
      </div>
      <br />
      <br />
      <Table className='' columns={columns} dataSource={categoryData} onChange={onChange}  />
   
    </Layout>
  )
}

