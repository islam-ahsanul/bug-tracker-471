// app/api/manager/issues/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { auth } from '@/utils/auth';

export const GET = async () => {
  const session = await auth();

  if (!session || session.user?.role !== 'MANAGER') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const project = await db.project.findFirst({
      where: {
        managerId: session.user.id,
      },
    });

    if (!project) {
      return NextResponse.json(
        { message: 'No project found for this manager' },
        { status: 404 }
      );
    }

    const issues = await db.issue.findMany({
      where: {
        projectId: project.id,
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
      { message: 'Error fetching issues', error },
      { status: 500 }
    );
  }
};
