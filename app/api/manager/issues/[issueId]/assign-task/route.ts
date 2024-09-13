// app/api/manager/issues/[issueId]/assign-task/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { auth } from '@/utils/auth';
import { IssueStatus } from '@prisma/client'; // Import the enum from Prisma schema

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

    // Update the issue status to IN_PROGRESS using the Prisma enum
    await db.issue.update({
      where: { id: params.issueId },
      data: {
        status: IssueStatus.IN_PROGRESS, // Use the enum instead of a plain string
      },
    });

    // Assign the task to the developer
    await db.task.create({
      data: {
        issueId: params.issueId,
        assignedToId: developerId,
        status: 'PENDING',
      },
    });

    return NextResponse.json(
      { message: 'Task assigned and issue updated successfully' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error assigning task', error },
      { status: 500 }
    );
  }
};
