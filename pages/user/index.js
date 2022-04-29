import React, { useEffect, useState } from 'react';
import Layout from '@components/Layout';
import { Image, Table } from 'antd';
import Search from 'antd/lib/input/Search';
import Link from 'next/link';
import { DeleteOutlined, EditOutlined, TrophyOutlined, UserAddOutlined, UsergroupAddOutlined } from '@ant-design/icons';

export default function Index() {
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
    const numberedData = sortedData.map((item, index) => ({
        ...item,
        numrow: index + 1,
    }));
    setUserData(numberedData);
  }, []);
  const columns = [
    {
      title: '#',
      dataIndex: 'numrow',
      fixed: 'left',
      width: 50,
    },
    {
      title: 'ID',
      dataIndex: 'id',
      hidden: true,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      fixed: 'left',
      width: 100,
      sorter: {
        compare: (a, b) => a.name - b.name,
        multiple: 1,
      },
    },
    {
      title: 'Photo',
      dataIndex: 'photo',
      render: (t, r) => <Image width={40} preview={false} src={`${r.photo}`} alt="photo" />,
    },
    {
      title: 'Username',
      dataIndex: 'username',
      sorter: {
        compare: (a, b) => a.username - b.username,
        multiple: 2,
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      width: 130,
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      width: 85,
    },
    {
      title: 'Role',
      width: 150,
      dataIndex: 'role',
      render: (t, r) => 
      <>
        {
          r.role.map((v, k) =>
          <>
            <span key={k} className='w-full text-center inline-block mt-1 px-5 py-1 text-white transition-colors duration-150 bg-stone-600 rounded-lg'>
              {v}
            </span>
          </>
          )
        }
      </>
    },
    {
      title: 'Assign',
      dataIndex: 'assign',
      width: 160,
      render: (t, r) => 
        <div className='place-content-center'>
          <a onClick={() => assignOwner(r.id)} className="w-full text-center px-3 pb-1 rounded-md text-white bg-blue-800 hover:bg-transparent border-2 border-blue-800 hover:bg-transparent hover:text-blue-800 inline-block mt-2">
            <TrophyOutlined /> Assign Owner
          </a>
        </div>
    },
    {
      title: 'Action',
      dataIndex: 'action',
      fixed: 'right',
      width: 195,
      render: (t, r) => 
        <div className='place-content-center'>
          <Link href={'/user/detail/'+r.id}>
              <a className="float-left text-center px-4 pb-1 rounded-md text-white bg-blue-600 hover:bg-transparent border-2 border-blue-600 hover:text-blue-600">            
                <EditOutlined /> Edit
              </a>
          </Link>

          <a onClick={() => deleteUser(r.id)} className="float-right inline px-3 pb-1 rounded-md text-white bg-red-800 hover:bg-transparent border-2 border-red-800 hover:text-red-800">
            <DeleteOutlined /> Delete
          </a>
          
          {/* <a className="w-full text-center px-3 pb-1 rounded-md text-white bg-blue-800 hover:bg-transparent border-2 border-blue-800 hover:bg-transparent hover:text-blue-800 inline-block mt-3">
            <UsergroupAddOutlined /> Assign Manager
          </a> */}
        </div>
    }
  ].filter(item => !item.hidden);
  
  const data = [
    {
      id: 1,
      name: "Luca Doncic",
      photo: "https://cdn-icons-png.flaticon.com/512/847/847975.png",
      username: "luca_magic",
      email: "luca_don@email.com",
      phone: "081234567895",
      address: "Jl. Kebon Jeruk No.1",
      gender: "Male",
      role: ["Employee", "Manager"],
      action: ''
    },
    {
      id: 2,
      name: "Alex Caruso",
      photo: "https://cdn-icons-png.flaticon.com/512/847/847975.png",
      username: "alex_carushow",
      email: "acfresh21@email.com",
      phone: "081234567895",
      address: "Jl. Kebon Pisang No.1",
      gender: "Male",
      role: ["Cashier"],
      action: ''
    },
    {
      id: 3,
      name: "Derrick Rose",
      photo: "https://cdn-icons-png.flaticon.com/512/847/847975.png",
      username: "drose",
      email: "drose@email.com",
      phone: "081234567895",
      address: "Jl. Kebon Kacang No.1",
      gender: "Female",
      role: ["Owner"],
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
        item.name.toLowerCase().includes(search.toLowerCase()) || 
        item.username.toLowerCase().includes(search.toLowerCase())
      );
    const numberedFilteredData = filteredData.map((item, index) => ({
      ...item,
      numrow: index + 1,
    }));
    setUserData(numberedFilteredData);
  }

  const assignOwner = (id) => {
    alert(`Assign Owner to ${id}`);
  }

  const deleteUser = (id) => {
    alert("delete/"+id);
  }

  return (
    <Layout title="User" subtitle="">
      <div className='w-[200px] float-left'>
        <Link href="user/form">
          <a className='text-center px-4 pb-2 pt-1 rounded-md text-white bg-green-600 hover:bg-transparent border-2 border-green-600 hover:text-green-600'>
            <UserAddOutlined /> Add User
          </a>
        </Link>
      </div>
      <div className='w-[200px] float-right'>
        <Search onChange={filterData} />
      </div>
      <br />
      <br />
      <Table className='' columns={columns} dataSource={userData} onChange={onChange} scroll={{x:1300}} />
      
    </Layout>
  )
}

