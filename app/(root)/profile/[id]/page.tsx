import { auth } from '@/utils/auth';
import { db } from '@/utils/db';
import { notFound } from 'next/navigation';
import ProfileData from '@/components/profile/profileData';

const ProfilePage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const session = await auth();

  if (!session) {
    return <div>Please Login to continue</div>;
  }

  const user = await db.user.findUnique({
    where: {
      id,
    },
  });

  if (!user || session?.user?.email !== user.email) {
    return <div>You are not authorized</div>;
  }

  return <ProfileData user={user} />;
};

export default ProfilePage;
