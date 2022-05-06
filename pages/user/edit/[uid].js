import React, { useEffect, useState } from 'react';
import Layout from '@components/Layout';
import { useRouter } from 'next/router';
import axios from 'axios';
import UserForm from '@components/Form/User';

export default function UserDetail() {
  const router = useRouter()
  const { uid } = router.query

  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (uid !== undefined) { 
      axios.get(process.env.NEXT_PUBLIC_API_URL+'v1/user/'+uid).then((res) => {
        setUserData(res.data);
      }).catch((err) => {
        console.log(err);
      });
    }
  }, [uid]);

  return (
    <Layout title="Detail User" subtitle="">
      <UserForm action="edit" userId={uid} userData={userData} />
    </Layout>
  )
}

