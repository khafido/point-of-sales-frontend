import React, { useEffect, useState } from 'react';
import Layout from '@components/Layout';

import { Button, Col, Divider, Image, Modal, notification, Popconfirm, Row, Space, Table, Tag } from 'antd';
import Search from 'antd/lib/input/Search';
import Link from 'next/link';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, PlusOutlined, PlusSquareOutlined, TrophyOutlined, UserAddOutlined } from '@ant-design/icons';
import * as user from 'api/User'
import { useRouter } from 'next/router';

  
import { Divider, Form, Image, Modal, notification, Table, Tag, Select } from 'antd';
import Search from 'antd/lib/input/Search';
import Link from 'next/link';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, TrophyOutlined, UserAddOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import * as user from 'api/User';
import axios from 'axios';
  
export default function Index() {
  const router = useRouter();
  const { Option } = Select;
  const [searchVal, setSearchVal] = useState('');
  const [tableData, setTableData] = useState([]);
  const [tablePagination, setTablePagination] = useState({ page: 1, pageSize: 10 });
  const [tableTotalPages, setTableTotalPages] = useState(0);

  const [searchLoading, setSearchLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  // roles
  const [visible, setVisible] = useState(false)
  const [formData, setFormData] = useState({});
  const [form] = Form.useForm();
  const [submitParam, setSubmitParam] = useState('');

  const handleCancel = () => {
    setVisible(false);
  }

  useEffect(() => {
    loadTableData();
  }, []);

  useEffect(() => {
    loadTableData()
    setSearchLoading(false)
  }, [tablePagination])

  const loadTableData = (
    searchBy = searchVal,
    page = tablePagination.page - 1,
    pageSize = tablePagination.pageSize,
  ) => {
    setTableLoading(true)

    user.listUser(true, page, pageSize, searchBy, 'default', 'ASC')
      .then(result => {

        if (result.result) {
          let users = result.result.currentPageContent.map((item, key) => {
            item.key = item.id;
            item.numrow = key + 1;
            item.name = item.firstName + ' ' + item.lastName;
            if (!item.photo) {
              item.photo = "https://www.nicepng.com/png/detail/933-9332131_profile-picture-default-png.png";
            };
            return item;
          });

          // const numberedData = users.map((item, index) => ({
          //   ...item,
          //   numrow: index + 1,
          // }));

          // const sortedData = users.sort((a, b) => a.name.localeCompare(b.name));

          setTableData(users);
          setTableTotalPages(result.result.totalPages);
          setTableLoading(false);
          setSearchLoading(false);
        } else {
          notification.error({
            message: result.message ? result.message : 'Error get user data',
            duration: 0
          });
        }
      })
  }

  const onChangePagination = (page, pageSize) => {
    setTablePagination({
      page,
      pageSize
    })
  }

  const onSearchData = (e) => {
    if (e.key === 'Enter') {
      setSearchLoading(true)
      setSearchVal(e.target.value)
      setTablePagination({
        page: 1,
        pageSize: 10
      })
    }
  }

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
      width: 100,
      render: (t, r) => <Image key={r.id} width={40} preview={false} src={`${r.photo}`} alt="photo" />,
    },
    {
      title: 'Username',
      key: 'username',
      dataIndex: 'username',
      width: 100,
      sorter: {
        compare: (a, b) => a.username - b.username,
      },
    },
    {
      title: 'Email',
      key: 'email',
      dataIndex: 'email',
      width: 150,
    },
    {
      title: 'Phone',
      key: 'phone',
      dataIndex: 'phone',
      width: 130,
    },
    {
      title: 'Birth Date',
      key: 'birthDate',
      dataIndex: 'birthDate',
      width: 120,
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
      title: 'Roles',
      key: 'roles',
      width: 150,
      dataIndex: 'roles',
      render: (t, r) =>
        r.roles.map((v, k) =>
          <div key={k}>
            <Tag key={k} color="cyan">{v.name.replace('ROLE_', '')}</Tag>
          </div>
        )
    },
    // {
    //   title: 'Assign',
    //   key: 'assign',
    //   dataIndex: 'assign',
    //   width: 160,
    //   render: (t, r) =>
    //     <div className='place-content-center'>
    //       <a key={r.id} onClick={() => assignOwner(r.id)} className="w-full text-center px-3 pb-1 rounded-md text-white bg-blue-800 hover:bg-transparent border-2 border-blue-800 hover:bg-transparent hover:text-blue-800 inline-block mt-2">
    //         <TrophyOutlined /> Assign Owner
    //       </a>
    //     </div>
    // },
    {
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
      fixed: 'right',
      width: 200,
      render: (t, r) =>
        <>
          <Space>
            <Button type='primary' onClick={() => router.push(`/user/edit/${r.id}`)}>
              <EditOutlined /> Edit
            </Button>

            <Popconfirm
              title={`Confirm to delete ${r.name}`}
              onConfirm={(e) => {
                deleteUser(r.id)
              }}
              okText="Yes"
              okButtonProps={{ danger: true }}
              cancelText="No"
            >
              <Button
                type='danger'
                className="float-right inline px-3 pb-1 rounded-md text-white bg-red-800 hover:bg-transparent border-2 border-red-800 hover:text-red-800">
                <DeleteOutlined /> Delete
              </Button>
            </Popconfirm>
          </Space>

          <Space>
            {/* <Button 
            style={ { backgroundColor: '#0d9488', color: '#fff' } }
            key={r.id} 
            onClick={() => assignOwner(r.id)} 
            className="w-full text-center px-3 pb-1 rounded-md text-white bg-teal-600 hover:bg-transparent border-2 border-teal-600 hover:bg-transparent hover:text-teal-600 inline-block mt-2">
            <TrophyOutlined /> Assign Owner
          </Button> */}
            {/* <a className="w-full text-center px-3 pb-1 rounded-md text-white bg-blue-800 hover:bg-transparent border-2 border-blue-800 hover:bg-transparent hover:text-blue-800 inline-block mt-3">
            <UsergroupAddOutlined /> Assign Manager
          </a> */}
          </Space>
        </>
    }
  ].filter(item => !item.hidden);

  function onChange(pagination, filters, sorter, extra) {
    // console.log('params', pagination, filters, sorter, extra);
    let filteredData = tableData;

    filteredData = filteredData.sort((a, b) => {
      let field = (sorter.field) ? sorter.field : 'name';
      if (sorter.order === 'ascend' || sorter.order === undefined) {
        return a[field].localeCompare(b[field]);
      } else {
        return b[field].localeCompare(a[field]);
      }
    });

    const numberedFilteredData = filteredData.map((item, index) => ({
      ...item,
      numrow: index + 1,
    }));

    setTableData(numberedFilteredData);
  }

  const assignOwner = (id) => {
    alert(`Assign Owner to ${id}`);
  }

  const { confirm } = Modal;

  const deleteUserModal = (id, name) => {
    confirm({
      title: `Are you sure want to delete ${name}?`,
      icon: <ExclamationCircleOutlined />,
      content: '',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteUser(id);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  const [options, setOptions] = useState([])
  useEffect(() => {
    axios.get('http://localhost:8080/api/v1/role')
      .then(res => {
        console.log('res', res.data.result)
        setOptions(res.data.result)
      })
      .catch(err => console.log(err))
  }, [])

  console.log('opt', options)

  const onFieldsChange = (changedField, allFields) => {
    let data = {}
    allFields.forEach(element => {
      data[`${element.name[0]}`] = {
        value: element.value,
        errors: element.errors
      }
    });
    setFormData(data)
  }

  const assignUserRoleModal = (id) => {
    setVisible(true);
    setSubmitParam(id);
    const editIndex = tableData.findIndex((element) => element.id === id)
    const editData = tableData[editIndex]
    const showed = []
    editData.roles.forEach(r => showed.push(r.name))
    form.setFieldsValue({
      id,
      roles: showed
    })

  }


  const deleteUser = (id) => {
    user.deleteUser(id)
      .then(res => {
        console.log(res);
        loadTableData();
      })
      .catch(err => {
        console.log(err);
      });
  }

  const assignUserRole = () => {
    console.log('data from ', formData.roles.value)

    user.addRole(submitParam, { roles: formData.roles.value })
      .then(res => {
        console.log(res);
        loadTableData();
      })
      .catch(err => {
        console.log(err)
      })

    setVisible(false)
  }

  return (
    <Layout title="User" subtitle="">
      <Row justify="space-between">
        <Col>
          <Button
            type="primary"
            onClick={() => {
              router.push('/user/add');
            }}
          >
            <PlusOutlined />New User
          </Button>
        </Col>
        <Col>
          <Search
            placeholder="Search User"
            onKeyDown={onSearchData}
          />
        </Col>
      </Row>
      <br></br>

      <Table className=''
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
        onChange={onChange}
        scroll={{ x: 1300 }} />

      <Modal
        title='Add roles'
        visible={visible}
        onOk={assignUserRole}
        onCancel={handleCancel}
      >
        <div>
          <Form layout='vertical' autoComplete='off' onFieldsChange={onFieldsChange} form={form}>
            <Form.Item label='Roles' name='roles' hasFeedback >
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Please select"
              // options={options}
              >
                {options.map(r => { return <Option value={r.name} key={r.id}>{r.name}</Option> })}
              </Select>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </Layout>
  )
}

