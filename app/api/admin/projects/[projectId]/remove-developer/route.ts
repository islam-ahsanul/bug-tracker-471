import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { auth } from '@/utils/auth';

export const DELETE = async (
  request: Request,
  { params }: { params: { projectId: string } }
) => {
  const { developerId } = await request.json();
  const session = await auth();

  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await db.developerProject.deleteMany({
      where: {
        userId: developerId,
        projectId: params.projectId,
      },
    });

    return NextResponse.json(
      { message: 'Developer removed successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Something went wrong', errorLog: error },
      { status: 500 }
    );
  }
};
