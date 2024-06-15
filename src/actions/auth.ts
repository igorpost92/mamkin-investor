'use server';

import { killSession, registerUser, signInUser } from '../shared/api/mainApi/users';
import { cookies } from 'next/headers';
import { appRoutes, sessionIdCookieName } from '../shared/constants';
import { redirect } from 'next/navigation';

interface UserPayload {
  username: string;
  password: string;
}

export const signIn = async (payload: UserPayload) => {
  const sessionId = await signInUser(payload);
  cookies().set(sessionIdCookieName, sessionId);
};

export const signUp = async (payload: UserPayload) => {
  const sessionId = await registerUser(payload);
  cookies().set(sessionIdCookieName, sessionId);
};

export const logOut = async () => {
  const sessionId = cookies().get(sessionIdCookieName)?.value;

  if (!sessionId) {
    return;
  }

  await killSession(sessionId);
  cookies().delete(sessionIdCookieName);
  redirect(appRoutes.index);
};
