import React from 'react';

const layout = ({ children }: { children: React.ReactNode }) => {
  return <main className="flex flex-row justify-between">{children}</main>;
};

export default layout;
