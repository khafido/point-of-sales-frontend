import React, { useEffect, useState } from 'react';
import Layout from '@components/Layout';
import { useRouter } from 'next/router';

export default function UserDetail() {
    const router = useRouter()
    const { uid } = router.query

  return (
    <Layout title="Detail User" subtitle="">
      ID: {uid}
    </Layout>
  )
}

