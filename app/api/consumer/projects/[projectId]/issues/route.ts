import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { auth } from '@/utils/auth';

export const GET = async (
  request: Request,
  { params }: { params: { projectId: string } }
) => {
  const session = await auth();

  if (!session || session.user?.role !== 'CONSUMER') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const issues = await db.issue.findMany({
      where: {
        projectId: params.projectId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        postedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
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

export const POST = async (
  request: Request,
  { params }: { params: { projectId: string } }
) => {
  const { title, description } = await request.json();
  const session = await auth();

  if (!session || session.user?.role !== 'CONSUMER') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (!title || !description) {
    return NextResponse.json(
      { message: 'Title and description are required' },
      { status: 400 }
    );
  }

  try {
    const project = await db.project.findUnique({
      where: { id: params.projectId },
    });

    if (!project) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }

    const issue = await db.issue.create({
      data: {
        title,
        description,
        projectId: params.projectId,
        postedById: session.user.id,
        status: 'PENDING',
      },
      include: {
        postedBy: {
          select: {
            name: true,
            email: true,
          },
        },
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
