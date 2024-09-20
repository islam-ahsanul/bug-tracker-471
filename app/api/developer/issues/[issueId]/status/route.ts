import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { auth } from '@/utils/auth';

export const PATCH = async (
  request: Request,
  { params }: { params: { issueId: string } }
) => {
  const session = await auth();
  const { status } = await request.json();

  if (!session || session.user?.role !== 'DEVELOPER') {
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

    // Update the issue status directly in the database
    await db.issue.update({
      where: { id: params.issueId },
      data: { status },
    });

    return NextResponse.json(
      { message: 'Issue status updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error updating issue status', error },
      { status: 500 }
    );
  }
};
