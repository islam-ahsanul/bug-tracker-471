import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import bcrypt from 'bcryptjs';

export const POST = async (request: Request) => {
  const { name, email, password } = await request.json();
  try {
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse('User already exists', {
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });

    return new NextResponse(
      JSON.stringify({ message: 'User is created', user: user }),
      { status: 201 }
    );
  } catch (error: any) {
    return new NextResponse('Error in creating user' + error, {
      status: 500,
    });
  }
};
