import { NextResponse } from 'next/server';
import { db } from '@/utils/db'; 
import { auth } from '@/utils/auth'; 

export const GET = async (request: Request) => {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'CONSUMER') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const issues = await db.issue.findMany({
      where: {
        postedById: session.user.id, 
      },
      include: {
        project: {
          select: {
            name: true, 
          },
        },
      },
    });

    if (!issues || issues.length === 0) {
      return NextResponse.json(
        { message: 'No issues found', issues: [] },
        { status: 200 }
      );
    }

   
    const formattedIssues = issues.map((issue) => ({
      id: issue.id,
      title: issue.title,
      description: issue.description,
      status: issue.status,
      projectName: issue.project?.name || 'Unknown', 
    }));

    return NextResponse.json({ issues: formattedIssues }, { status: 200 });
  } catch (error) {
    console.error('Error fetching issues:', error);
    return NextResponse.json(
      { message: 'Error fetching issues', error },
      { status: 500 }
    );
  }
};
