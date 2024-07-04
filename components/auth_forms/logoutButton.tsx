'use client';
import { logout } from '@/server-actions/authServerAction';
import { Button } from '../ui/button';

const LogoutButton = () => {
  return <Button onClick={() => logout()}>Logout</Button>;
};

export default LogoutButton;
