// app/api/admin/users/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/utils/db'; // Assuming you have a utility file to connect to your database
import { auth } from '@/utils/auth'; // Assuming you have an authentication utility

export const GET = async () => {
  const session = await auth();

  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        roles: true,
      },
    });

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Something went wrong', error },
      { status: 500 }
    );
  }
};
