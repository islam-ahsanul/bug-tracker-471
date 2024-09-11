import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { auth } from '@/utils/auth';

export const POST = async (
  request: Request,
  { params }: { params: { issueId: string } }
) => {
  const { developerId } = await request.json();
  const session = await auth();

  if (!session || session.user?.role !== 'MANAGER') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Ensure the developer exists and has the role of DEVELOPER
    const developer = await db.user.findUnique({
      where: { id: developerId },
      select: { roles: true },
    });

    if (!developer || developer.roles !== 'DEVELOPER') {
      return NextResponse.json(
        { message: 'The user must be a developer to assign to the task' },
        { status: 400 }
      );
    }

    // Assign the task to the developer
    const task = await db.task.create({
      data: {
        issueId: params.issueId,
        assignedToId: developerId,
        status: 'PENDING', // Default status
      },
    });

    return NextResponse.json(
      { message: 'Task assigned to developer successfully', task },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Something went wrong', errorLog: error },
      { status: 500 }
    );
  }
};
