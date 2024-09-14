// app/api/developer/tasks/[taskId]/status/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { auth } from '@/utils/auth';
import { TaskStatus, IssueStatus } from '@prisma/client'; // Import the enums from Prisma

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
    // Validate the status to ensure it's a valid TaskStatus enum value
    if (!['PENDING', 'IN_PROGRESS', 'SOLVED'].includes(status)) {
      return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
    }

    // Fetch the task and related issue
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

    // Update the task status
    await db.task.update({
      where: { id: params.taskId },
      data: {
        status: status as TaskStatus, // Ensure status is a valid enum value
      },
    });

    // If task status is solved, update the corresponding issue's status
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
