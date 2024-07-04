import React from 'react';
import NavBar from '@/components/navbar/navBar';
const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex flex-col">
      <NavBar />
      {children}
    </main>
  );
};

export default layout;
