import React, { useEffect, useState } from 'react';
import Layout from '@components/Layout';
import { Button, Col, DatePicker, Form, Input, InputNumber, Modal, Row, Select } from 'antd';
import Search from 'antd/lib/transfer/search';
import { PlusOutlined } from '@ant-design/icons';
import * as storeAPI from 'api/Store';
import * as supplierAPI from 'api/Supplier';
import * as itemAPI from 'api/Item';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import jsCookie from 'js-cookie';

export default function Index() {
  const auth = useSelector((state) => state.auth);

  const [searchVal, setSearchVal] = useState('');
  const [tableData, setTableData] = useState([]);
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
    storeAPI.listStoreItems(jsCookie.get('store_id_employee'), false, 1, 10000000, null, 'name', 'asc').then(res => {
      // console.log(res);
      if (res.status == "SUCCESS") {
        setStoreItems(res.result.currentPageContent);
      }
    });

    supplierAPI.listSuppliers(false, 1, 10000000, null, 'name', 'asc').then(res => {
      // console.log(res);
      if (res.status == "SUCCESS") {
        setSupplier(res.result.currentPageContent);
      }
    });
  }, [])

  const onSearch = (value) => {
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
        setVisible(false);
        form.resetFields();
        setSubmitLoading(false);
      }
    });
  }

  return (
    <Layout title="Incoming Item" subtitle="">
      <Row justify="space-between">
        <Col span={6}>
          <Search
            placeholder="Search"
            onSearch={onSearch}
          />
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
          <Modal
            title="Incoming Item"
            visible={visible}
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
    </Layout>
  )
}

