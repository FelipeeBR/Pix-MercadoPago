'use client';
import React from 'react';
import { Button } from '../ui/button';
import { signIn } from 'next-auth/react';
import { FcGoogle } from "react-icons/fc";

const ButtonLogin = () => {
  return (
    <Button className="w-full" onClick={()=>signIn('google', {callbackUrl:'/home'})}>
        <FcGoogle size={40}/>
        <span>Logar com Google</span>
    </Button>
  )
}

export default ButtonLogin