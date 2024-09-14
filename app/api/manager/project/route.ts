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
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { message: 'No project assigned' },
        { status: 404 }
      );
    }

    return NextResponse.json({ project }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching project', error },
      { status: 500 }
    );
  }
};
