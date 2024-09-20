import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { auth } from '@/utils/auth';

export const GET = async (
  request: Request,
  { params }: { params: { taskId: string } }
) => {
  const session = await auth();

  if (!session || session.user?.role !== 'DEVELOPER') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const task = await db.task.findUnique({
      where: { id: params.taskId },
      select: {
        id: true,
        issue: {
          select: {
            title: true,
            description: true,
          },
        },
        // status: true,
      },
    });

    if (!task) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ task }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching task details', error },
      { status: 500 }
    );
  }
};
