import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { auth } from '@/utils/auth';

export const GET = async () => {
  const session = await auth();

  if (!session || session.user?.role !== 'DEVELOPER') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch all tasks assigned to the developer and include the related issue with correct status
    const tasks = await db.task.findMany({
      where: { assignedToId: session.user.id },
      include: {
        issue: true, // Include the correct issue status
      },
    });

    // Map tasks to issues (removing duplicates if needed)
    const issues = tasks.map((task) => task.issue);

    return NextResponse.json({ issues }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching assigned issues', error },
      { status: 500 }
    );
  }
};
