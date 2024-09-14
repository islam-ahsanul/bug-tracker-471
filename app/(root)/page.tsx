import React from 'react';
import Link from 'next/link';
import { auth } from '@/utils/auth';

type UserRole = 'ADMIN' | 'DEVELOPER' | 'CONSUMER' | 'MANAGER';

const dashboardPaths: Record<UserRole, string> = {
  ADMIN: '/admin/allprojects',
  DEVELOPER: '/developer/dashboard',
  CONSUMER: '/consumer/explore',
  MANAGER: '/manager/dashboard',
};

const Home = async () => {
  const session = await auth();

  const userRole: UserRole | undefined = session?.user?.role as UserRole;

  const path =
    userRole && dashboardPaths[userRole] ? dashboardPaths[userRole] : '/';

  return (
    <div className="flex flex-col items-center justify-center mt-20 font-extrabold text-3xl">
      <p>
        Welcome to{' '}
        <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700 bg-clip-text text-transparent">
          BUG TRACKER
        </span>
      </p>
      {session?.user && (
        <Link href={path} className="text-pink-700 mt-10">
          Go to Dashboard
        </Link>
      )}
    </div>
  );
};

export default Home;
