import React, { useEffect, useState } from 'react';
import { Content } from 'antd/lib/layout/layout';
import Layout from '@components/Layout';
import { useRouter } from 'next/router';
import Dashboard from 'pages/dashboard';
import { useSelector } from 'react-redux';

export default function Home() {
  const router = useRouter();
  
  const auth = useSelector(state => state.auth);
  useEffect(() => {
    if (!auth.isAuthenticated) {
      router.push('/login');
    }
  }, []);

  return (
    <Dashboard />
  )
}
