import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { auth } from '@/utils/auth';

export const POST = async (
  request: Request,
  { params }: { params: { projectId: string } }
) => {
  const { developerId } = await request.json();
  const session = await auth();

  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const developer = await db.user.findUnique({
      where: { id: developerId },
      select: { roles: true },
    });

    if (!developer || developer.roles !== 'DEVELOPER') {
      return NextResponse.json(
        { message: 'The user must be a developer to assign to the project' },
        { status: 400 }
      );
    }

    await db.developerProject.create({
      data: {
        userId: developerId,
        projectId: params.projectId,
      },
    });

    return NextResponse.json(
      { message: 'Developer assigned successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Something went wrong', errorLog: error },
      { status: 500 }
    );
  }
};
