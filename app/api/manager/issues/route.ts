import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { auth } from '@/utils/auth';

export const GET = async () => {
  const session = await auth();

  if (!session || session.user?.role !== 'MANAGER') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get all projects managed by the logged-in manager
    const managerProjects = await db.project.findMany({
      where: { managerId: session.user.id },
      select: {
        id: true,
        name: true,
        issues: true, // Include all related issues
      },
    });

    return NextResponse.json(managerProjects, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Something went wrong', errorLog: error },
      { status: 500 }
    );
  }
};
