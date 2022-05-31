import React, { useEffect, useState } from 'react';
import Layout from '@components/Layout';
import { Button, Col, DatePicker, Form, Input, InputNumber, Modal, Row, Select, Table, Space } from 'antd';
import Search from 'antd/lib/input/Search';
import { PlusOutlined } from '@ant-design/icons';
import * as storeAPI from 'api/Store';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import jsCookie from 'js-cookie';

export default function Index() {
  const [currentStoreId, setCurrentStoreId] = useState(jsCookie.get('store_id_manager'))

  const { RangePicker } = DatePicker
  const [dateRange, setDateRange] = useState([moment().subtract(50, 'years'), moment().add(1, 'days')]);
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

  const onSearchData = (value, e) => {
    setSearchLoading(true);
    setSearchVal(value);
    setTablePagination({
      page: 1,
      pageSize: 10
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
    storeAPI.storeListofExpiredItems(currentStoreId, true, page, pageSize, searchBy, sortBy, sortDir, startDate, endDate)
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
            message: result.message ? result.message : 'Error loading expired item ',
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
    <Layout title="Expired Item" subtitle="">
      <Row justify='space-between'>
        <Col span={6}>
          <Search
            placeholder='Search'
            onSearch={onSearchData}
            loading={searchLoading}
          />
        </Col>
        <Col>
          <Space>
            Select Created Date:
            <RangePicker
              onChange={(x) => setDateRange(x)}
            />
          </Space>
        </Col>
      </Row>
      <br />
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