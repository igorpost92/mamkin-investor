'use server';

import { cookies } from 'next/headers';
import { sessionIdCookieName } from '../shared/constants';

export const isUserAuthenticated = async () => {
  const sessionId = cookies().get(sessionIdCookieName)?.value;

  if (!sessionId) {
    return false;
  }

  return true;

  // TODO: doesn't work in middleware
  // const db = await getDB();
  // const session = await db.getRepository(Session).findOne({ where: { id: sessionId } });
  // return !!session;
};
