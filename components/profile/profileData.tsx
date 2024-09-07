import { Button } from '../ui/button';
import ResetPasswordButton from './ResetPasswordButton';
import DeleteAccountButton from './DeleteAccountButton';

const ProfileData = ({ user }: { user: any }) => {
  return (
    <div className="ml-10 mt-6 flex flex-col gap-4 items-start">
      <h1 className="text-lg font-bold">Name: {user.name || 'User'}</h1>
      <p className="text-lg">Email: {user.email}</p>
      <ResetPasswordButton />
      <DeleteAccountButton />
    </div>
  );
};

export default ProfileData;
