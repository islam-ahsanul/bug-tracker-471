import React from 'react';
import { auth } from '@/utils/auth';
import Link from 'next/link';

const TopBar = async () => {
  const session = await auth();
  return (
    <nav className="topbar">
      <Link href="/" className="flex items-center gap-4">
        <p className="font-semibold text-white max-sm:hidden tracking-wider">
          BUG TRACKER
        </p>
      </Link>

      <div className="flex items-center gap-1">
        <div className="block">
          <div className="flex gap-2 items-center">
            <p className="text-white font-semibold uppercase">
              {session?.user?.name}
            </p>
            <p className="text-sm px-1 rounded-full font-semibold text-white">
              {session?.user.role}
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopBar;
