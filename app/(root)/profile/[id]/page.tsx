import { auth } from '@/utils/auth';
import { db } from '@/utils/db';
import { notFound } from 'next/navigation';
import ProfileData from '@/components/profile/profileData';

const ProfilePage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const session = await auth();

   // console.log(session);
   // console.log(session.user);

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

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] gap-4 py-4 w-full">
      <ProfileData user={user} />
    </div>
  );
};

export default ProfilePage;
