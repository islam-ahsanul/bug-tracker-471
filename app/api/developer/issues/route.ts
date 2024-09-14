import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { auth } from '@/utils/auth';

export const GET = async () => {
  const session = await auth();

  if (!session || session.user?.role !== 'DEVELOPER') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const tasks = await db.task.findMany({
      where: {
        assignedToId: session.user.id,
      },
      select: {
        id: true,
        status: true,
        issue: {
          select: {
            title: true,
          },
        },
        project: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching tasks', error },
      { status: 500 }
    );
  }
};
