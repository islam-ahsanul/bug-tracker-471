import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { auth } from '@/utils/auth';

export const PATCH = async (
  request: Request,
  { params }: { params: { projectId: string } }
) => {
  const { name, description } = await request.json();
  const session = await auth();

  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const project = await db.project.update({
      where: { id: params.projectId },
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(
      { message: 'Project updated successfully', project },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Something went wrong', errorLog: error },
      { status: 500 }
    );
  }
};
