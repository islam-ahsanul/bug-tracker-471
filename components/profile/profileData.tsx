'use client';
import React from 'react';
import { useState } from 'react';
import { Button } from '../ui/button';

const ProfileData = ({ user }: { user: any }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handlePasswordReset = async () => {
    // setLoading(true);
    // try {
    //   const response = await fetch('/api/profile/reset-password', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ newPassword: '789456' }),
    //   });
    //   if (response.ok) {
    //     setMessage('Password reset successful');
    //   } else {
    //     setMessage('Password reset failed');
    //   }
    // } catch (error) {
    //   setMessage('An error occurred');
    // }
    // setLoading(false);
  };

  const handleDeleteAccount = async () => {
    // setLoading(true);
    // try {
    //   const response = await fetch('/api/profile/delete-account', {
    //     method: 'DELETE',
    //   });
    //   if (response.ok) {
    //     setMessage('Account deleted successfully');
    //   } else {
    //     setMessage('Account deletion failed');
    //   }
    // } catch (error) {
    //   setMessage('An error occurred');
    // }
    // setLoading(false);
  };

  return (
    <div className="ml-10 mt-6 flex flex-col gap-4 items-start">
      <h1 className="text-lg font-bold">Name: {user.name || 'User'}</h1>
      <p className="text-lg">Email: {user.email}</p>
      <Button onClick={handlePasswordReset} disabled={loading}>
        Reset Password
      </Button>
      <Button onClick={handleDeleteAccount} disabled={loading}>
        Delete Account
      </Button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ProfileData;
