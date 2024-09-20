import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { auth } from '@/utils/auth';

export const POST = async (
  request: Request,
  { params }: { params: { issueId: string } }
) => {
  const session = await auth();
  const { developerId } = await request.json();

  if (!session || session.user?.role !== 'MANAGER') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Ensure the issue exists
    const issue = await db.issue.findUnique({
      where: { id: params.issueId },
    });

    if (!issue) {
      return NextResponse.json({ message: 'Issue not found' }, { status: 404 });
    }

    // Ensure the developer exists
    const developer = await db.user.findUnique({
      where: { id: developerId },
      select: { roles: true },
    });

    if (!developer || developer.roles !== 'DEVELOPER') {
      return NextResponse.json(
        { message: 'Developer not found or invalid role' },
        { status: 404 }
      );
    }

    // Update the issue status to IN_PROGRESS
    await db.issue.update({
      where: { id: params.issueId },
      data: { status: 'IN_PROGRESS' },
    });

    // Assign the task to the developer (task model is still needed for assignment tracking)
    await db.task.create({
      data: {
        issueId: params.issueId,
        assignedToId: developerId,
        projectId: issue.projectId,
      },
    });

    return NextResponse.json(
      { message: 'Developer assigned and issue status updated to IN_PROGRESS' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error assigning developer to issue', error },
      { status: 500 }
    );
  }
};
