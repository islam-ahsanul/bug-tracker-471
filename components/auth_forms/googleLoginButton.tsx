'use client';

import React from 'react';
import { FaGoogle } from 'react-icons/fa';
import { Button } from '../ui/button';
import { oAuthLogin } from '@/server-actions/authServerAction';
const GoogleLoginButton = () => {
  return (
    <div className="w-full">
      <Button
        className="flex flex-row items-center justify-center gap-2 w-full bg-gradient-to-r from-yellow-200 via-green-200 to-green-500"
        onClick={() => oAuthLogin('google')}
      >
        <FaGoogle className="text-black" />
        <span className="text-black">Continue with Google</span>
      </Button>
    </div>
  );
};

export default GoogleLoginButton;
