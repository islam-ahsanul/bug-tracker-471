import { NextResponse } from 'next/server';
import { auth } from '@/utils/auth';
import { db } from '@/utils/db';
import bcrypt from 'bcryptjs';

export const POST = async (request: Request) => {
  const { newPassword } = await request.json();
  const session = await auth();

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  try {
    await db.user.update({
      where: { email: session?.user?.email || undefined },
      data: { hashedPassword },
    });
    return NextResponse.json(
      { message: 'Password updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
};
