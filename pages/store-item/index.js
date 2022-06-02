import React, { useEffect, useState } from 'react'
import Layout from '@components/Layout'
import { Button, Col, Descriptions, Divider, Form, Image, Input, InputNumber, Modal, notification, Popconfirm, Row, Select, Space, Table } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import * as store from 'api/Store'
import * as item from 'api/Item'
import jsCookie from 'js-cookie'
import Search from 'antd/lib/input/Search'
import { useSelector } from 'react-redux'



export default function Index() {

  const auth = useSelector((state) => state.auth);
  const [form] = Form.useForm()

  const [currentRoles, setCurrentRoles] = useState(jsCookie.get('roles')? JSON.parse(jsCookie.get('roles')): [])

  const [currentStoreId, setCurrentStoreId] = useState(jsCookie.get('store_id_employee')? jsCookie.get('store_id_employee') : jsCookie.get('store_id_manager'))
  const [storeData, setStoreData] = useState(null)

  const [searchLoading, setSearchLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [tableLoading, setTableLoading] = useState(false)
  const [selectItemsLoading, setSelectItemsLoading] = useState(false)

  const [modalVisible, setModalVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [modalBody, setModalBody] = useState((<div></div>))
  const [modalFooterConfig, setModalFooterConfig] = useState({submitBtnText: '', submitBtnType: ''})

  const [masterItemsData, setMasterItemsData] = useState(null)
  const [searchVal, setSearchVal] = useState('')
  const [submitParam, setSubmitParam] = useState({type: '', id: ''})

  const [tableData, setTableData] = useState([])
  const [tablePagination, setTablePagination] = useState({page: 1, pageSize: 10})
  const [tableTotalPages, setTableTotalPages] = useState(0)

  const [tableSortBy, setTableSortBy] = useState('name')
  const [tableSortDir, setTableSortDir] = useState('ASC')

  useEffect(()=> {
    loadTableData()
    setSearchLoading(false)
  }, [tablePagination, tableSortBy, tableSortDir])

  useEffect(() => {
		loadMasterItemData()
    loadStoreData()
	}, [])

  const loadTableData = (
    sId = currentStoreId,
    searchBy = searchVal,
    page = tablePagination.page-1, 
    pageSize = tablePagination.pageSize,
    sortBy = tableSortBy,
    sortDir = tableSortDir
  )=> {
    if(!sId) {
      return
    }
    setTableLoading(true)
    store.storeListOfItems(sId, true, page, pageSize, searchBy, sortBy, sortDir)
    .then(result=> {
      if(result.result) {
        setTableData(result.result.currentPageContent)
        setTableTotalPages(result.result.totalPages)
        setTableLoading(false)
      } else {
        notification.error({
          message: result.message? result.message : 'Error loading store items data',
          duration: 0
        })
      }
    })
  }

  const loadStoreData = ()=> {
    if(!currentStoreId) {
      notification.error({
        message: 'Failed to get store Id',
        duration: 0
      })
      return
    }
    store.getById(currentStoreId)
    .then(result=>setStoreData(result.result))
  }

  const loadMasterItemData = ()=> {
    item.listItems(false, 0, 0, '', 'name', 'ASC', false)
      .then(result=> {
        if(result.result) {
          setMasterItemsData(result.result.currentPageContent)
          setSelectItemsLoading(false)
        } else {
          setSelectItemsLoading(false)
          notification.error({
            message: result.message? result.message : 'Error loading master item data',
            duration: 0
          })
        }
      })
  }

  const onTableSort = (sorter) => {
		setTableSortBy(sorter.field)
		setTableSortDir(sorter.order == 'ascend' ? 'ASC' : 'DESC')
	}

  const onSearchData = (value , e)=> {
    setSearchLoading(true)
    setSearchVal(value)
    setTablePagination({
      page: 1,
      pageSize: 10
    })
  }

  const onChangePagination = (page, pageSize)=> {
    setTablePagination({
      page, 
      pageSize
    })
  }

  const showModal = (type, id) => {
    setSubmitParam({type, id})
    setModalVisible(true)
    switch(type) {
      case 'add':
        setModalTitle('Add New Store Item')
        setModalBody((
          <div>
            <Form layout='vertical' autoComplete='off' form={form}>
              <Form.Item label='Item' name='item' hasFeedback required rules={[{required: true, message: 'Please select items to add'}]}>
                <Select
                  showSearch
                  mode="multiple"
                  loading={selectItemsLoading}
                  placeholder='Item (Category)'
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.children
                      .toLowerCase()
                      .localeCompare(optionB.children.toLowerCase())
                  }
                >
                  {masterItemsData?
                      masterItemsData.map(item=> {
                        return (
                          <Select.Option
                            value={item.id}
                            key={item.id}
                          >
                            {`${item.name} (${item.category})`}
                          </Select.Option>
                        )
                      }) 
                  : null}
                </Select>
              </Form.Item>
            </Form>
          </div>
        ))
        setModalFooterConfig({
          submitBtnText: 'Add',
          submitBtnType: 'primary',
        })
        break
      case 'edit':
        const editIndex = tableData.findIndex((element)=> element.id === id)
        const editData = tableData[editIndex]
        form.setFieldsValue({
          storeItemId: editData.storeItemId,
          storeId: currentStoreId,
          itemId: editData.id,
          fixedPrice: editData.fixedPrice,
          name: editData.name,
          priceMode: editData.priceMode
        })

        setModalTitle('Edit Store Item Price')
        setModalBody((
          <div>
            <Form layout='vertical' autoComplete='off' form={form}>
              <Form.Item label='Store Item ID' name='storeItemId' hidden>
                <Input maxLength={255} disabled />
              </Form.Item>
              <Form.Item label='Store ID' name='storeId' hidden>
                <Input maxLength={255} readOnly />
              </Form.Item>
              <Form.Item label='Item ID' name='itemId' hidden>
                <Input maxLength={255} readOnly />
              </Form.Item>
              <Form.Item label='Item Name' name='name' >
                <Input maxLength={255} readOnly />
              </Form.Item>
              <Form.Item label='Fixed Price' name='fixedPrice' required rules={[{required: true, message: 'Please input fixed price'}]}>
                <InputNumber maxLength={255} min={0} prefix='Rp' style={{ width: '100%' }}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
              <Form.Item label='Price Mode' name='priceMode' hasFeedback required rules={[{required: true, message: 'Please input price mode'}]}>
                <Select 
                  placeholder='Select Price Mode'
                >
                  <Select.Option value='BY_SYSTEM'>BY_SYSTEM</Select.Option>
                  <Select.Option value='FIXED'>FIXED</Select.Option>
                </Select>
              </Form.Item>
            </Form>
          </div>
        ))
        setModalFooterConfig({
          submitBtnText: 'Edit',
          submitBtnType: 'primary'
        })
        break
    }
  }

  const cancelModal = () => {
    setModalVisible(false);
  };

  const handleModalSubmit = () => {
    form.validateFields().then(values=> {
      setSubmitLoading(true);
      switch(submitParam.type) {
        case 'add':
          if(!currentRoles.includes('STOCKIST')) {
            setModalVisible(false)
            setSubmitLoading(false)
            form.resetFields()
            notification.error({
              message: 'Action Invalid Role',
              description: result.message
            })
            return
          }

          store.addItemToStore(currentStoreId, values.item).then(result=> {
              setModalVisible(false)
              setSubmitLoading(false)
              if(result.status === 'SUCCESS') {
                form.resetFields()
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
        case 'edit':
          if(!currentRoles.includes('MANAGER')) {
            setModalVisible(false)
            setSubmitLoading(false)
            form.resetFields()
            notification.error({
              message: 'Action Invalid Role',
              description: result.message
            })
            return
          }

          store.updateStoreItemPrice(currentStoreId, values.itemId, {
            priceMode: values.priceMode,
            fixedPrice: values.fixedPrice
          }).then(result=> {
              setModalVisible(false)
              setSubmitLoading(false)
              if(result.status === 'SUCCESS') {
                form.resetFields()
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
    }).catch((info) => {
      return
    })

    if(submitParam.type === 'delete') {
      if(!currentRoles.includes('STOCKIST')) {
        setSubmitLoading(false)
        notification.error({
          message: 'Action Invalid Role',
          description: result.message
        })
        return
      }

      store.deleteStoreItem(currentStoreId, submitParam.id)
        .then(result=> {
          setSubmitLoading(false)
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
        }
      )
    }
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      sorter: (a, b) => null
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (t, r) => <Image key={r.id} width={150} preview={false} src={`${r.image}`} alt="image" />
    },
    {
      title: 'Category',
      key: 'category',
      dataIndex: 'category',
      sorter: (a, b) => null,
    },
    {
      title: 'Stock',
      key: 'stock',
      dataIndex: 'stock',
      sorter: (a, b) => null,
    },
    {
      title: 'Expired Date',
      key: 'expiredDate',
      dataIndex: 'latestExpiredDate',
      render: (text, record, index)=> (
        <div>
          {record.earlyExpiredDate? `${record.earlyExpiredDate} - ${record.latestExpiredDate}` : '-'}
        </div>
      )
    },
    {
      title: 'Fixed Price',
      key: 'fixedPrice',
      dataIndex: 'fixedPrice',
      sorter: (a, b) => null,
      render: (text, record, index)=> (
        <div>
          {`Rp ${text}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </div>
      )
    },
    {
      title: 'By System Price',
      key: 'By System Price',
      dataIndex: 'bySystemPrice',
      render: (text, record, index)=> (
        <div>
          {`Rp ${text}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </div>
      )
    },
    {
      title: 'Current Price Mode',
      key: 'priceMode',
      dataIndex: 'priceMode',
      sorter: (a, b) => null
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      render: (text, record, index)=> (
        <Space wrap>
          {currentRoles.includes('MANAGER')?
            <Button 
              type='primary' 
              icon={<EditOutlined/>} 
              onClick={()=> showModal('edit', record.id)}
            >
              Set Price
            </Button>
            : null
          }
          
          {currentRoles.includes('STOCKIST')?
            <Popconfirm
              title={`Confirm to delete ${record.name}`}
              onConfirm={(e) => {
                console.log(submitParam)
                handleModalSubmit()
              }}
              okText="Yes"
              okButtonProps={{ type: 'danger', loading: submitLoading }}
              cancelText="No"
            >
              <Button type='danger' icon={<DeleteOutlined/>} onClick={()=>{
                setSubmitParam({type: 'delete', id: record.id})}}>
                  Delete            
              </Button>
            </Popconfirm>
            : null
          }
          
        </Space>
      )
    }
  ]

  return (
    <Layout title="Store Items" subtitle="">
      <Descriptions
        bordered
      >
        <Descriptions.Item label='Store Name'>{storeData? storeData.name : 'loading..'}</Descriptions.Item>
        <Descriptions.Item label='Store Location'>{storeData? storeData.location : 'loading..'}</Descriptions.Item>
      </Descriptions>
      <Divider />
      <Row>
        <Col span={6}>
          <Search
            placeholder='Search' 
            onSearch={onSearchData} 
            loading={searchLoading}
          />
        </Col>
        <Col span={18}>
          {currentRoles.includes('STOCKIST')?
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              style={{float: 'right'}} 
              onClick={()=> showModal('add')}
            >
              Add New
            </Button>
            : null 
          }
          
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
					onTableSort(sorter)
				}}
        scroll={{ x: 1300 }}
      />

      <Modal
        title={modalTitle}
        visible={modalVisible}
        width={600}
        closable={false}
        footer={[
          <Button key="cancel" onClick={cancelModal}>
            Cancel
          </Button>,
          <Button 
            key="submit" 
            type={modalFooterConfig.submitBtnType} 
            loading={submitLoading} 
            onClick={handleModalSubmit} 
          >
            {modalFooterConfig.submitBtnText}
          </Button>
        ]}
      >
        {modalBody}
      </Modal>
    </Layout>
  )
}

