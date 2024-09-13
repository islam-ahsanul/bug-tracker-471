// app/api/manager/developers/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { auth } from '@/utils/auth';

export const GET = async () => {
  const session = await auth();

  if (!session || session.user?.role !== 'MANAGER') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch all users with the role of DEVELOPER
    const developers = await db.user.findMany({
      where: {
        roles: 'DEVELOPER',
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json({ developers }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching developers', error },
      { status: 500 }
    );
  }
};
