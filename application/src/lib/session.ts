'use server';

import { Session } from '@/models/Session';
import { cookies } from 'next/headers';
import bcrypt from 'bcrypt';

export async function saveSession(session: Session) {
  // cookies().set({
  //   name: 'session',
  //   value: await bcrypt.hash(JSON.stringify(session), 10),
  //   httpOnly: true,
  // });

  cookies().set({
    name: 'session',
    value: JSON.stringify(session),
    httpOnly: true,
  });
}

export async function getSession(): Promise<Session> {
  // if (!cookies().has('session')) return null;

  const sessionCookie = cookies().get('session');

  return JSON.parse(sessionCookie?.value!);

  // await bcrypt.compare(JSON.stringify(session), 10);
}

export async function clearSession() {
  cookies().delete('session');
}
