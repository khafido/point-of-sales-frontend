import React, { useEffect, useState } from 'react';
import Layout from '@components/Layout';
import UserForm from '@components/Form/User';

export default function Index() {
  return (
    <Layout title="User Form" subtitle="">
      <UserForm />
    </Layout>
  )
}

