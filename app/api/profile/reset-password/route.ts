import { NextResponse } from 'next/server';
import { auth } from '@/utils/auth';
import { db } from '@/utils/db';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from '@/server-actions/authServerAction';

export const POST = async (request: Request) => {
  const { existingPassword, newPassword } = await request.json();
  const session = await auth();
  const userEmail = session?.user?.email;

  if (!session || !userEmail) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await getUserByEmail(userEmail);

    if (!user || !user.hashedPassword) {
      return NextResponse.json(
        { message: 'User not found or password not set' },
        { status: 404 }
      );
    }

    const isPasswordValid = await bcrypt.compare(
      existingPassword,
      user.hashedPassword
    );
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Incorrect existing password' },
        { status: 400 }
      );
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await db.user.update({
      where: { email: userEmail },
      data: { hashedPassword: hashedNewPassword },
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
