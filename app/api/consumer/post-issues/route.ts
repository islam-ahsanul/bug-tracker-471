import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { auth } from '@/utils/auth';

export const POST = async (request: Request) => {
  const { title, description, projectId } = await request.json();
  const session = await auth();

  if (!session || session.user?.role !== 'CONSUMER') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Ensure the project exists before posting an issue
    const project = await db.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }

    // Create the issue and link it to the project and consumer
    const issue = await db.issue.create({
      data: {
        title,
        description,
        projectId,
        postedById: session.user.id, // The consumer who posted the issue
        status: 'PENDING', // Default status
      },
    });

    return NextResponse.json(
      { message: 'Issue posted successfully', issue },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Something went wrong', errorLog: error },
      { status: 500 }
    );
  }
};
