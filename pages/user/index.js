import React, { useEffect, useState } from 'react';
import Layout from '@components/Layout';
import { Image, Table } from 'antd';
import Search from 'antd/lib/input/Search';
import Link from 'next/link';
import { DeleteOutlined, EditOutlined, TrophyOutlined, UserAddOutlined, UsergroupAddOutlined } from '@ant-design/icons';

export default function Index() {
  const [userData, setUserData] = useState([]);
  const [order, setOrder] = useState({});

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
      key: 'numrow',
      dataIndex: 'numrow',
      fixed: 'left',
      width: 50,
    },
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
      width: 100,
      sorter: {
        compare: (a, b) => a.name - b.name,
      },
    },
    {
      title: 'Photo',
      key: 'photo',
      dataIndex: 'photo',
      render: (t, r) => <Image key={r.id} width={40} preview={false} src={`${r.photo}`} alt="photo" />,
    },
    {
      title: 'Username',
      key: 'username',
      dataIndex: 'username',
      sorter: {
        compare: (a, b) => a.username - b.username,
      },
    },
    {
      title: 'Email',
      key: 'email',
      dataIndex: 'email',
    },
    {
      title: 'Phone',
      key: 'phone',
      dataIndex: 'phone',
      width: 130,
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
    {
      title: 'Gender',
      key: 'gender',
      dataIndex: 'gender',
      width: 85,
    },
    {
      title: 'Role',
      key: 'role',
      width: 150,
      dataIndex: 'role',
      render: (t, r) =>
        r.role.map((v, k) =>
          <span key={k} className='w-full text-center inline-block mt-1 px-5 py-1 text-white transition-colors duration-150 bg-stone-600 rounded-lg'>
            {v}
          </span>
        )
    },
    {
      title: 'Assign',
      key: 'assign',
      dataIndex: 'assign',
      width: 160,
      render: (t, r) =>
        <div className='place-content-center'>
          <a key={r.id} onClick={() => assignOwner(r.id)} className="w-full text-center px-3 pb-1 rounded-md text-white bg-blue-800 hover:bg-transparent border-2 border-blue-800 hover:bg-transparent hover:text-blue-800 inline-block mt-2">
            <TrophyOutlined /> Assign Owner
          </a>
        </div>
    },
    {
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
      fixed: 'right',
      width: 195,
      render: (t, r) =>
        <div className='place-content-center'>
          <Link href={'/user/edit/' + r.id}>
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
      action: '',
      key: 1,
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
      action: '',
      key: 2,
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
      action: '',
      key: 3,
    },
  ];

  function onChange(pagination, filters, sorter, extra) {
    console.log('params', pagination, filters, sorter, extra);
    console.log(sorter.field);
    console.log(sorter.order);
    let filteredData = userData;
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
    const numberedFilteredData = filteredData.map((item, index) => ({
      ...item,
      numrow: index + 1,
    }));
    setUserData(numberedFilteredData);
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
    alert("delete/" + id);
  }

  return (
    <Layout title="User" subtitle="">
      <div className='w-[200px] float-left'>
        <Link href="/user/add">
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
      <Table className='' columns={columns} dataSource={userData} onChange={onChange} scroll={{ x: 1300 }} />

    </Layout>
  )
}

