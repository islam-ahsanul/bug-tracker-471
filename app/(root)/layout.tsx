import React from 'react';
import NavBar from '@/components/navbar/navBar';
import { Toaster } from '@/components/ui/toaster';
const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex flex-col">
      <NavBar />
      {children}
      <Toaster />
    </main>
  );
};

export default layout;
