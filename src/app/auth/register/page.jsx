import React from 'react'
import RegisterComponent from '../components/compo';
import { getCurrentUser } from '@/lib/session';

const Register = () => {

  const user =  getCurrentUser()

    if (!user) {
        redirect("/auth/login")
    }


  return (
 <><RegisterComponent/></>
  );
};

export default Register;
