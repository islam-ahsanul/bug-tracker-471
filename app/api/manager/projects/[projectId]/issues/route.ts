import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { auth } from '@/utils/auth';

export const GET = async (
  request: Request,
  { params }: { params: { projectId: string } }
) => {
  const session = await auth();

  if (!session || session.user?.role !== 'MANAGER') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check if the logged-in manager is managing the requested project
    const project = await db.project.findFirst({
      where: {
        id: params.projectId,
        managerId: session.user.id, // Ensure the project is managed by the logged-in manager
      },
    });

    if (!project) {
      return NextResponse.json(
        {
          message:
            'Project not found or you are not the manager of this project',
        },
        { status: 404 }
      );
    }

    // Get all issues for the project
    const issues = await db.issue.findMany({
      where: {
        projectId: params.projectId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        postedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ issues }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Something went wrong', errorLog: error },
      { status: 500 }
    );
  }
};
