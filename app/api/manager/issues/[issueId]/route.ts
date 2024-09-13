// app/api/manager/issues/[issueId]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { auth } from '@/utils/auth';

export const GET = async (
  request: Request,
  { params }: { params: { issueId: string } }
) => {
  const session = await auth();

  if (!session || session.user?.role !== 'MANAGER') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch issue by ID
    const issue = await db.issue.findUnique({
      where: { id: params.issueId },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
      },
    });

    if (!issue) {
      return NextResponse.json({ message: 'Issue not found' }, { status: 404 });
    }

    return NextResponse.json({ issue }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching issue details', error },
      { status: 500 }
    );
  }
};
