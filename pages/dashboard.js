import React, { useEffect, useState } from 'react';
import { Content } from 'antd/lib/layout/layout';
import Layout from '@components/Layout';
import { PageHeader } from 'antd';
import { useSelector } from 'react-redux';

export default function Home() {
  const auth = useSelector(state => state.auth);
  const user = useSelector(state => state.user);

  useEffect(() => {
    console.log('auth', auth);
    console.log('user', user);
  }, []);

  return (
    <Layout title="Dashboard" subtitle="">      
      Dashhboard
    </Layout>
  )
}
