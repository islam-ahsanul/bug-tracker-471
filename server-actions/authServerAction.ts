'use server';

import { signIn, signOut } from '@/utils/auth';
import { revalidatePath } from 'next/cache';

export const oAuthLogin = async (provider: string) => {
  await signIn(provider, { redirectTo: '/' });
  revalidatePath('/');
};

export const logout = async () => {
  await signOut({ redirectTo: '/' });
  revalidatePath('/');
};
