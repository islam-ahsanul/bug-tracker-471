import { NextResponse } from 'next/server';
import { auth } from '@/utils/auth';
import { db } from '@/utils/db';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from '@/server-actions/authServerAction';

export const DELETE = async (request: Request) => {
  const { existingPassword } = await request.json();
  const session = await auth();
  const userEmail = session?.user?.email;

  if (!session || !userEmail) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await getUserByEmail(userEmail);

    if (!user || !user.hashedPassword) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(
      existingPassword,
      user.hashedPassword
    );
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Incorrect password' },
        { status: 400 }
      );
    }

    await db.user.delete({ where: { email: userEmail } });

    return NextResponse.json(
      { message: 'Account deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
};
