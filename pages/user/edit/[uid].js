import React, { useEffect, useState } from 'react';
import Layout from '@components/Layout';
import { useRouter } from 'next/router';
import axios from 'axios';
import UserForm from '@components/Form/User';
import * as user from 'api/User';

export default function UserDetail() {
  const router = useRouter()
  const { uid } = router.query

  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (uid !== undefined) { 
      user.getById(uid).then(result => {
        // console.log('result detail', result);
        if (result) {
          setUserData(result)
        }
      });
    }
  }, [uid]);

  return (
    <Layout title="Detail User" subtitle="">
      <UserForm action="Edit" userId={uid} userData={userData} />
    </Layout>
  )
}

