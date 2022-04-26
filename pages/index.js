import React, { useEffect, useState } from 'react';
import HeadPage from '@components/HeadPage';
import Navbar from '@components/Navbar';
import { Content, Footer } from 'antd/lib/layout/layout';

export default function Home() {
  return (
    <div>
      <HeadPage title="Dashboard" />
      <Navbar content={<ContentPage />} />
      <Footer style={{ textAlign: 'center' }}>HIPPOS ©2022 Created by CDC - Team 3</Footer>
    </div>
  )
}

const ContentPage = () => {
  return (
    <Content
      className="site-layout-background"
      style={{
        margin: '24px 16px 0 16px',
        padding: '24px 24px 0 24px',
        minHeight: 600,
      }}
    >
      Content
    </Content>
  )
}
