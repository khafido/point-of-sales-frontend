import React, { useEffect, useState } from 'react';
import Layout from '@components/Layout';
import { Button, Col, DatePicker, Form, Input, InputNumber, Modal, Row, Select, Table, Space, message } from 'antd';
import Search from 'antd/lib/input/Search';
import { PlusOutlined } from '@ant-design/icons';
import * as storeAPI from 'api/Store';
import * as supplierAPI from 'api/Supplier';
import * as itemAPI from 'api/Item';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import jsCookie from 'js-cookie';

export default function Index() {
  const auth = useSelector((state) => state.auth);

  const { RangePicker } = DatePicker
  const [dateRange, setDateRange] = useState([moment().subtract(50, 'years'), moment()]);
  const [defaultDate, setDefaultDate] = useState([moment().subtract(50, 'years'), moment().add(1, 'days')]);


  const [searchVal, setSearchVal] = useState('');
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('');
  const [sortDir, setSortDir] = useState('');
  const [tablePagination, setTablePagination] = useState({ page: 1, pageSize: 10 });
  const [tableTotalPages, setTableTotalPages] = useState(0);

  const [searchLoading, setSearchLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  const [visible, setVisible] = useState(false);

  const [form] = Form.useForm();

  const [storeItems, setStoreItems] = useState([]);
  const [supplier, setSupplier] = useState([]);

  useEffect(() => {
    storeAPI.storeListOfItems(jsCookie.get('store_id_employee'), false, 1, 10000000, null, 'name', 'asc').then(res => {
      // console.log(res);
      if (res && res.status == "SUCCESS") {
        setStoreItems(res.result.currentPageContent);
      }
    });

    supplierAPI.listSuppliers(false, 1, 10000000, null, 'name', 'asc').then(res => {
      // console.log(res);
      if (res && res.status == "SUCCESS") {
        setSupplier(res.result.currentPageContent);
      }
    });
  }, [])

  const onSearchData = (value, e) => {
    setSearchLoading(true);
    setSearchVal(value);
    setTablePagination({
      page: 1,
      pageSize: 10
    });
  }

  const showStoreItems = () => {
    if (storeItems.length > 0) {
      return storeItems.map(item => {
        return (
          <Select.Option key={item.storeItemId} value={item.storeItemId}>
            {item.name}
          </Select.Option>
        )
      })
    }
  }

  const showSupplier = () => {
    if (supplier.length > 0) {
      return supplier.map(item => {
        return (
          <Select.Option key={item.id} value={item.id}>
            {item.name}
          </Select.Option>
        )
      })
    }
  }

  const onFinishForm = (values) => {
    console.log("Form values ", values);
    itemAPI.addStock(values).then(res => {
      console.log(res);
      if (res.status == "CREATED") {
        message.success("Incoming Item added successfully");
        setVisible(false);
        form.resetFields();
        setSubmitLoading(false);
        loadTableData();
      }
    });
  }

  const loadTableData = (
    searchBy = searchVal,
    page = tablePagination.page - 1,
    pageSize = tablePagination.pageSize,
    startDate = dateRange == null ? new Date(defaultDate[0]) : new Date(dateRange[0]),
    endDate = dateRange == null ? new Date(defaultDate[1]) : new Date(dateRange[1])
  ) => {
    setTableLoading(true)
    itemAPI.getIncomingItem(true, page, pageSize, searchBy, sortBy, sortDir, startDate, endDate)
      .then(result => {
        if (result.result) {
          let res = result.result.currentPageContent
          res.map(e => {
            let date = moment(new Date(e.buyDate))
            e.buyDate = date.format("YYYY-MM-DD")
          })
          setTableData(res)
          setTableTotalPages(result.result.totalPages)
          setTableLoading(false)
        } else {
          notification.error({
            message: result.message ? result.message : 'Error loading incoming item ',
            duration: 0
          })
        }
      })
  }

  useEffect(() => {
    loadTableData()
    setSearchLoading(false)
  }, [searchVal, page, sortBy, sortDir, dateRange])

  const columns = [
    {
      title: 'ID',
      key: 'id',
      dataIndex: 'id',
      hidden: true,
    },
    {
      title: 'Item name',
      key: 'itemName',
      dataIndex: 'itemName',
      align: 'center',
      width: '15%',
      sorter: {
        compare: (a, b) => a.name - b.name,
        multiple: 1,
      },
    },
    {
      title: 'Suplier name',
      key: 'supllierName',
      dataIndex: 'supplierName',
      align: 'center',
      width: '15%',
      sorter: {
        compare: (a, b) => a.name - b.name,
        multiple: 1,
      },
    },
    {
      title: 'Quantity',
      key: 'qty',
      dataIndex: 'qty',
      align: 'center',
      width: '5%',

    },
    {
      title: 'Price',
      key: 'price',
      dataIndex: 'price',
      align: 'center',
      width: '10%',

    },
    {
      title: 'Buy Date',
      key: 'buyDate',
      dataIndex: 'buyDate',
      align: 'center',
      width: '30%',
      sorter: {
        compare: (a, b) => a.name - b.name,
        multiple: 1,
      },

    },
    {
      title: 'Expiry Date',
      key: 'expiryDate',
      dataIndex: 'expiryDate',
      align: 'center',
      width: '30%',
      sorter: {
        compare: (a, b) => a.name - b.name,
        multiple: 1,
      },


    },
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
    <Layout title="Incoming Item" subtitle="">
      <Row justify="space-between">
        <Col span={6}>
          <Search
            placeholder="Search"
            onSearch={onSearchData}
            loading={searchLoading}
          />
        </Col>
        <Col>
          <Space>
            Select Buy Date:
            <RangePicker
              onChange={(x) => setDateRange(x)}
            />
          </Space>
        </Col>
        {auth.isAuthenticated && JSON.parse(jsCookie.get('roles')).includes('STOCKIST') ?
          <Col>
            <Button
              type="primary"
              onClick={() => {
                setVisible(true)
              }}
              icon={<PlusOutlined />}
            >
              New Incoming Item
            </Button>

            <br />

            <Modal
              title="Incoming Item"
              visible={visible}
              okText="Save"
              onOk={() => {
                form.submit();
                // setVisible(false);
              }}
              onCancel={() => {
                setVisible(false);
              }}
            >
              <Form
                form={form}
                layout='vertical'
                name="form_incoming_item"
                onFinish={onFinishForm}
              >
                <Form.Item label='Store Item' name='storeItemId' hasFeedback required rules={[{
                  required: true,
                  message: 'Please select store item!'
                }]}>
                  <Select
                    showSearch
                    placeholder="Select a store item"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    onSelect={(value) => {
                      console.log(value);
                    }}
                  >
                    {showStoreItems()}
                  </Select>
                </Form.Item>
                <Form.Item label='Supplier' name='supplierId' hasFeedback rules={[{
                  required: true,
                  message: 'Please select a supplier'
                }]}>
                  <Select
                    showSearch
                    placeholder="Select a supplier"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {showSupplier()}
                  </Select>
                </Form.Item>
                <Form.Item label='Incoming Stock' name='qty' hasFeedback
                  rules={[
                    {
                      required: true,
                      message: 'Please input the incoming stock!',
                    }
                  ]}
                >
                  <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label='Total Price' name='buyPrice' hasFeedback
                  rules={[
                    {
                      required: true,
                      message: 'Please input the Price!',
                    }
                  ]}
                >
                  <InputNumber prefix='Rp' min={1} style={{ width: '100%' }}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
                <Row>
                  <Col>
                    <Form.Item
                      name="buyDate"
                      label="Buy Date"
                      rules={[
                        {
                          required: true,
                          message: 'Please input the buy date!',
                        }
                      ]}
                      style={{ width: '200px' }}
                    >
                      <DatePicker className='' disabledDate={(current) => {
                        let customDate = moment().add(0, 'days');
                        return current && current > moment(customDate, "YYYY-MM-DD");
                      }}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      name="expiryDate"
                      label="Expiry Date"
                      rules={[
                        {
                          required: true,
                          message: 'Please input the expiry date!',
                        }
                      ]}
                      style={{ marginLeft: 12, width: '200px' }}
                    >
                      <DatePicker className='' disabledDate={(current) => {
                        let customDate = moment().add(0, 'days');
                        return current && current < moment(customDate, "YYYY-MM-DD");
                      }}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Modal>
          </Col>
          : null}
      </Row>
      <br></br>
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
    </Layout>
  )
}

