import React, { useEffect, useState } from 'react';
import { Content } from 'antd/lib/layout/layout';
import Layout from '@components/Layout';
import { useRouter } from 'next/router';
import Dashboard from 'pages/dashboard';

export default function Home() {
  return (
    <Dashboard />
  )
}
