import { cookies } from 'next/headers';
import crypto from 'node:crypto';

// Basic gate for the approval console. The admin RPC token never touches the
// browser — this only controls who can drive the console UI. The real database
// gate is the token check inside each admin_* function.
const SALT = 'bonfire-console-v1';

export function authHash(pw) {
  return crypto.createHash('sha256').update(`${pw}:${SALT}`).digest('hex');
}

export function isAuthed() {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return false;
  const c = cookies().get('console_auth')?.value;
  return !!c && c === authHash(pw);
}
