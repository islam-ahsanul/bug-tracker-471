import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { auth } from '@/utils/auth';
import { TaskStatus, IssueStatus } from '@prisma/client'; 

export const PATCH = async (
  request: Request,
  { params }: { params: { taskId: string } }
) => {
  const session = await auth();
  const { status } = await request.json();

  if (!session || session.user?.role !== 'DEVELOPER') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    if (!['PENDING', 'IN_PROGRESS', 'SOLVED'].includes(status)) {
      return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
    }

    const task = await db.task.findUnique({
      where: { id: params.taskId },
      select: {
        id: true,
        issueId: true,
        status: true,
      },
    });

    if (!task) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    await db.task.update({
      where: { id: params.taskId },
      data: {
        status: status as TaskStatus, 
      },
    });

    if (status === 'SOLVED') {
      await db.issue.update({
        where: { id: task.issueId },
        data: {
          status: IssueStatus.SOLVED,
        },
      });
    }

    return NextResponse.json(
      { message: 'Task and issue status updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error updating task and issue status', error },
      { status: 500 }
    );
  }
};
