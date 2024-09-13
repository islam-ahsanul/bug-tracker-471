import React from 'react';
import { auth } from '@/utils/auth';

import TopBar from '@/components/dasboards/TopBar';
import LeftSidebar from '@/components/dasboards/manager/LeftSidebar';
const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  return (
    <main className="flex flex-row">
      {session?.user.role === 'MANAGER' ? (
        <>
          <TopBar />
          <LeftSidebar />
          <section className="main-container">
            <div className="w-full max-w-5xl">{children}</div>
          </section>
        </>
      ) : (
        <div>You are not authorized</div>
      )}
    </main>
  );
};

export default layout;
