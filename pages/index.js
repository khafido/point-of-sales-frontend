import React, { useEffect, useState } from 'react';
import { Content } from 'antd/lib/layout/layout';
import Layout from '@components/Layout';

export default function Home() {
  return (
    <Layout>
      <Content
        id='content-wrapper'
        className="site-layout-background"
      >
        Content
      </Content>
    </Layout>
  )
}
