'use client';
import React from 'react';
import { Button } from '../ui/button';
import { signOut } from 'next-auth/react';

const ButtonLogout = () => {
  return (
    <Button className="" onClick={()=>signOut()}>
        <span>Sair</span>
    </Button>
  )
}

export default ButtonLogout;