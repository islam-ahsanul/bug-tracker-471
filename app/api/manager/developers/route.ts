// app/api/manager/developers/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { auth } from '@/utils/auth';

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');

  if (!projectId) {
    console.error('Project ID not provided');
    return NextResponse.json(
      { message: 'Project ID not provided' },
      { status: 400 }
    );
  }

  try {
    const developers = await db.developerProject.findMany({
      where: { projectId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(
      { developers: developers.map((dev) => dev.user) },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching developers:', error);
    return NextResponse.json(
      { message: 'Error fetching developers', error },
      { status: 500 }
    );
  }
};
