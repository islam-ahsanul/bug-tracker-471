// app/api/developer/tasks/[taskId]/status/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { auth } from '@/utils/auth';
import { TaskStatus } from '@prisma/client'; // Import the enum from Prisma

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

    // Update the task status
    const updatedTask = await db.task.update({
      where: { id: params.taskId },
      data: {
        status: status as TaskStatus, // Ensure status is a valid enum value
      },
    });

    return NextResponse.json(
      { message: 'Task status updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error updating task status', error },
      { status: 500 }
    );
  }
};
