import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { auth } from '@/utils/auth';

export const GET = async () => {
  const session = await auth();

  if (!session || session.user?.role !== 'DEVELOPER') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get all tasks assigned to the logged-in developer
    const tasks = await db.task.findMany({
      where: { assignedToId: session.user.id },
      select: {
        id: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        issue: {
          select: {
            id: true,
            title: true,
            description: true,
            project: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Something went wrong', errorLog: error },
      { status: 500 }
    );
  }
};
