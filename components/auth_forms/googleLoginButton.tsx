'use client';

import React from 'react';
import { FaGoogle } from 'react-icons/fa';
import { Button } from '../ui/button';
import { oAuthLogin } from '@/server-actions/authServerAction';
const GoogleLoginButton = () => {
  return (
    <div>
      <Button
        className="flex flex-row items-center justify-center gap-2"
        onClick={() => oAuthLogin('google')}
      >
        <FaGoogle />
        <span>Sign in with Google</span>
      </Button>
    </div>
  );
};

export default GoogleLoginButton;
