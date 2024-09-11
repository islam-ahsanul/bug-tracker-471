import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { auth } from '@/utils/auth';

export const POST = async (
  request: Request,
  { params }: { params: { projectId: string } }
) => {
  const { managerId } = await request.json();
  const session = await auth();

  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Ensure the user being assigned is a manager
    const manager = await db.user.findUnique({
      where: { id: managerId },
      select: { roles: true },
    });

    if (!manager || manager.roles !== 'MANAGER') {
      return NextResponse.json(
        { message: 'The user must be a manager to assign to the project' },
        { status: 400 }
      );
    }

    const project = await db.project.update({
      where: { id: params.projectId },
      data: {
        managerId,
      },
    });

    return NextResponse.json(
      { message: 'Manager assigned successfully', project },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Something went wrong', errorLog: error },
      { status: 500 }
    );
  }
};
