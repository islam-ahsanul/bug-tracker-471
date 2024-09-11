import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { auth } from '@/utils/auth';

export const PATCH = async (
  request: Request,
  { params }: { params: { userId: string } }
) => {
  const { newRole } = await request.json();
  const session = await auth();

  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Ensure the new role is valid
  const validRoles = ['CONSUMER', 'ADMIN', 'MANAGER', 'DEVELOPER'];
  if (!validRoles.includes(newRole)) {
    return NextResponse.json({ message: 'Invalid role' }, { status: 400 });
  }

  try {
    const user = await db.user.update({
      where: { id: params.userId },
      data: { roles: newRole },
    });

    return NextResponse.json(
      { message: 'User role updated successfully', user },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Something went wrong', errorLog: error },
      { status: 500 }
    );
  }
};
