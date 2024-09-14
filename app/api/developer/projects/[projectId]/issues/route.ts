import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { auth } from '@/utils/auth';

export const GET = async (
  request: Request,
  { params }: { params: { projectId: string } }
) => {
  const session = await auth();

  if (!session || session.user?.role !== 'DEVELOPER') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const tasks = await db.task.findMany({
      where: {
        assignedToId: session.user.id,
        issue: {
          projectId: params.projectId,
        },
      },
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

    if (tasks.length === 0) {
      return NextResponse.json(
        { message: 'No tasks found for this project' },
        { status: 404 }
      );
    }

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Something went wrong', errorLog: error },
      { status: 500 }
    );
  }
};
