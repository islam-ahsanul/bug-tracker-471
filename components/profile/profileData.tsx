import ResetPasswordButton from './ResetPasswordButton';
import DeleteAccountButton from './DeleteAccountButton';

const ProfileData = ({ user }: { user: any }) => {
   // console.log(session);
  return (
    <div className="flex flex-col gap-4 justify-center items-center w-[50%] py-20 border border-gray-300/50 rounded-3xl shadow-lg shadow-gray-200">
      <h1 className="text-4xl font-bold">Welcome, {user.name || 'User'}</h1>
      <p className="text-lg mb-10">{user.email}</p>
      <ResetPasswordButton />
      <DeleteAccountButton />
    </div>
  );
};

export default ProfileData;
