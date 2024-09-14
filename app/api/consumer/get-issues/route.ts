// app/api/consumer/get-issues/route.ts

import { NextResponse } from 'next/server';
import { db } from '@/utils/db'; // Ensure the path is correct based on your project structure
import { auth } from '@/utils/auth'; // Make sure to handle authentication

export const GET = async (request: Request) => {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'CONSUMER') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const issues = await db.issue.findMany({
      where: {
        postedById: session.user.id, // Ensure you are filtering by the current consumer
      },
      include: {
        project: {
          select: {
            name: true, // Get the project name
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

    // Format the data to include project name
    const formattedIssues = issues.map((issue) => ({
      id: issue.id,
      title: issue.title,
      description: issue.description,
      status: issue.status,
      projectName: issue.project?.name || 'Unknown', // Handle missing project name gracefully
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
