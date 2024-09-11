import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { auth } from '@/utils/auth';

export const GET = async () => {
  const session = await auth();

  if (!session || session.user?.role !== 'DEVELOPER') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get all projects assigned to the logged-in developer
    const developerProjects = await db.developerProject.findMany({
      where: { userId: session.user.id },
      select: {
        project: {
          select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return NextResponse.json(
      { projects: developerProjects.map((dp) => dp.project) },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Something went wrong', errorLog: error },
      { status: 500 }
    );
  }
};
