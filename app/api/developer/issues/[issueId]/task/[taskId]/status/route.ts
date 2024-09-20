import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { auth } from '@/utils/auth';

export const PATCH = async (
  request: Request,
  { params }: { params: { issueId: string; taskId: string } }
) => {
  const { status } = await request.json();
  const session = await auth();

  if (!session || session.user?.role !== 'DEVELOPER') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const validStatuses = ['PENDING', 'IN_PROGRESS', 'SOLVED'];
  if (!validStatuses.includes(status)) {
    return NextResponse.json(
      { message: 'Invalid task status' },
      { status: 400 }
    );
  }

  try {
    const task = await db.task.findFirst({
      where: {
        id: params.taskId,
        assignedToId: session.user.id,
      },
    });

    if (!task) {
      return NextResponse.json(
        { message: 'Task not found or not assigned to you' },
        { status: 404 }
      );
    }

    const updatedTask = await db.task.update({
      where: { id: params.taskId },
      data: { status },
    });

    return NextResponse.json(
      { message: 'Task status updated successfully', updatedTask },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Something went wrong', errorLog: error },
      { status: 500 }
    );
  }
};
