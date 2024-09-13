'use client';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '@/server-actions/authServerAction';

export const sidebarLinks = [
  {
    imgURL: '/members.svg',
    route: '/manager/dashboard',
    label: 'Dashboard',
  },

];

const LeftSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;
          return (
            <div key={link.label}>
              <Link
                href={link.route}
                key={link.label}
                className={`leftsidebar_link ${isActive && 'bg-blue-800'}`}
              >
                {/* <Image
                  src={link.imgURL}
                  alt={link.label}
                  width={24}
                  height={24}
                /> */}
                <p className="text-white max-lg:hidden">{link.label}</p>
              </Link>
            </div>
          );
        })}
      </div>

      <div className="mt-10 px-6">
        <div className="flex cursor-pointer gap-4 p-4" onClick={() => logout()}>
          {/* <Image src="/logout.svg" alt="logout" width={24} height={24} /> */}
          <p className="text-white max-lg:hidden">Logout</p>
        </div>
      </div>
    </section>
  );
};

export default LeftSidebar;
