'use client';
import { useState } from 'react';
import { auth } from '@/utils/auth';
import { db } from '@/utils/db';
import { notFound } from 'next/navigation';

const ProfilePage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const session = await auth();

  if (!session) {
    return notFound();
  }

  const user = await db.user.findUnique({
    where: {
      id,
    },
  });

  if (!user || session?.user?.email !== user.email) {
    return notFound();
  }

  return <Profile user={user} />;
};

const Profile = ({ user }: { user: any }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handlePasswordReset = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/profile/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword: 'newPassword123' }), // Replace with actual password from input
      });

      if (response.ok) {
        setMessage('Password reset successful');
      } else {
        setMessage('Password reset failed');
      }
    } catch (error) {
      setMessage('An error occurred');
    }
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/profile/delete-account', {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('Account deleted successfully');
      } else {
        setMessage('Account deletion failed');
      }
    } catch (error) {
      setMessage('An error occurred');
    }
    setLoading(false);
  };

  return (
    <div className="profile-container">
      <h1>Profile of {user.name || 'User'}</h1>
      <p>Email: {user.email}</p>
      <button onClick={handlePasswordReset} disabled={loading}>
        Reset Password
      </button>
      <button onClick={handleDeleteAccount} disabled={loading}>
        Delete Account
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ProfilePage;
