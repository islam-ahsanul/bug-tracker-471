import React from 'react';
import LoginForm from '@/components/auth_forms/loginForm';
import GoogleLoginButton from '@/components/auth_forms/googleLoginButton';
import Link from 'next/link';

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] gap-4">
      <div className="flex flex-col items-center justify-center gap-4  w-[40%] 2xl:w-[30%]">
        <h1 className="font-bold text-2xl tracking-wide">Login</h1>
        <p className="text-sm">
          Don't have an account?{' '}
          <Link href="/signup" className="font-bold hover:underline">
            Create Account
          </Link>
        </p>
        <LoginForm />
        <GoogleLoginButton />
      </div>
    </div>
  );
};

export default Login;
