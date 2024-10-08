import { auth } from '@/utils/auth';

import Link from 'next/link';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { FiAlignRight } from 'react-icons/fi';
import LogoutButton from '../auth_forms/logoutButton';

const NavBar = async () => {
  const session = await auth();
  // console.log(session);
   // console.log(session.user);
  return (
    <header className="w-full bg-background shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <span className="font-bold">BUG TRACKER</span>
        </Link>
        {session?.user ? (
          <div className="hidden gap-2 md:flex items-center justify-center">
            <div className="mr-4">Welcome, {session?.user?.name}</div>
            {/* <div>{session?.user?.email}</div> */}
            {/* <div>{session?.user?.id}</div> */}
            <Link
              href={`/profile/${session?.user?.id}`}
              className="inline-flex h-9 items-center justify-center rounded-md border border-blue-700 bg-background px-4 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-blue-800"
              prefetch={false}
            >
              Profile
            </Link>
            <LogoutButton />
          </div>
        ) : (
          <div className="hidden gap-2 md:flex">
            <Link
              href="/login"
              className="inline-flex h-9 items-center justify-center rounded-md border border-blue-700 bg-background px-4 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-blue-800"
              prefetch={false}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-9 items-center justify-center rounded-md border border-blue-700 px-4 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-white bg-gradient-to-r from-blue-700 to-blue-800"
              prefetch={false}
            >
              Signup
            </Link>
          </div>
        )}

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <FiAlignRight />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            {session?.user ? (
              <div className="grid gap-4 p-4">
                <p>{session?.user?.name}</p>
                <p>{session?.user?.email}</p>
                <LogoutButton />
              </div>
            ) : (
              <div className="grid gap-4 p-4">
                <Link
                  href="/login"
                  className="inline-flex h-9 items-center justify-center rounded-md border border-black bg-background px-4 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex h-9 items-center justify-center rounded-md border border-black bg-background px-4 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  Signup
                </Link>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default NavBar;
