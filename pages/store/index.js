import React, { useEffect, useState } from 'react';
import HeadPage from '@components/HeadPage';
import Navbar from '@components/GeneralLayout';
import { Content, Footer } from 'antd/lib/layout/layout';
import Layout from '@components/Layout';

export default function Index() {
  return (
    <Layout>
      <Content
        id='content-wrapper'
        className="site-layout-background"
        >
        Store Index
      </Content>
    </Layout>
  )
}

