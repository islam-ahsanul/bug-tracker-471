'use client';

import React from 'react';
import { FaGoogle } from 'react-icons/fa';
import { Button } from '../ui/button';
import { oAuthLogin } from '@/server-actions/authServerAction';
const GoogleLoginButton = () => {
  return (
    <div className="w-full">
      <Button
        className="flex flex-row items-center justify-center gap-2 w-full"
        onClick={() => oAuthLogin('google')}
      >
        <FaGoogle />
        <span>Continue with Google</span>
      </Button>
    </div>
  );
};

export default GoogleLoginButton;
