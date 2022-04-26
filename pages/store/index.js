import React, { useEffect, useState } from 'react';
import HeadPage from '@components/HeadPage';
import Navbar from '@components/Navbar';
import { Content, Footer } from 'antd/lib/layout/layout';

export default function Index() {
  return (
    <Content
      id='content-wrapper'
      className="site-layout-background"
    >
      Store Index
    </Content>
  )
}

