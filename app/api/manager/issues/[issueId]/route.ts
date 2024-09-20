import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { auth } from '@/utils/auth';

export const GET = async (
  request: Request,
  { params }: { params: { issueId: string } }
) => {
  try {
    const issue = await db.issue.findUnique({
      where: { id: params.issueId },
    });

    if (!issue) {
      return NextResponse.json({ message: 'Issue not found' }, { status: 404 });
    }

    console.log('Issue data:', issue); // Log issue data for debugging
    return NextResponse.json({ issue }, { status: 200 });
  } catch (error) {
    console.error('Error fetching issue:', error);
    return NextResponse.json(
      { message: 'Error fetching issue', error },
      { status: 500 }
    );
  }
};
