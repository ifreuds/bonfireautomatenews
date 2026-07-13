'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { authHash, isAuthed } from './auth';
import { adminRpc, ADMIN_TOKEN } from '../../lib/admin-rpc';

export async function login(formData) {
  const pw = String(formData.get('password') || '');
  if (process.env.ADMIN_PASSWORD && pw === process.env.ADMIN_PASSWORD) {
    cookies().set('console_auth', authHash(pw), {
      httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 8,
    });
    redirect('/console');
  }
  redirect('/console?e=1');
}

export async function logout() {
  cookies().delete('console_auth');
  redirect('/console');
}

// Move an issue between statuses. On 'published', also fire the channel message
// (Lark) — this is the "click approve and it goes out" step.
export async function setStatus(formData) {
  if (!isAuthed()) redirect('/console');
  const id = String(formData.get('id'));
  const status = String(formData.get('status'));
  const newsletter = String(formData.get('newsletter'));
  const date = String(formData.get('date'));

  await adminRpc('admin_set_status', {
    p_token: ADMIN_TOKEN(), p_issue_id: id, p_status: status, p_actor: 'console', p_note: null,
  });

  let sent = null;
  if (status === 'published') {
    const base = process.env.SITE_BASE_URL || '';
    try {
      const r = await fetch(`${base}/api/notify-lark`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, newsletter, token: process.env.NOTIFY_SECRET }),
      });
      sent = r.ok;
    } catch { sent = false; }
  }

  revalidatePath('/console');
  revalidatePath(`/console/${id}`);
  redirect(`/console/${id}?done=${status}${sent === null ? '' : `&sent=${sent ? '1' : '0'}`}`);
}

// Fire a real message to a channel so you can see what it looks like. Only Lark
// is wired; the others report "not built yet". Sends the latest published
// games-review issue's card.
export async function sendTest(formData) {
  if (!isAuthed()) redirect('/console/channels');
  const channel = String(formData.get('channel'));
  if (channel !== 'lark') redirect('/console/channels?msg=notbuilt');

  const base = process.env.SITE_BASE_URL || '';
  let ok = false;
  try {
    const r = await fetch(`${base}/api/notify-lark`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newsletter: 'games-review', token: process.env.NOTIFY_SECRET }),
    });
    ok = r.ok;
  } catch { ok = false; }
  redirect(`/console/channels?sent=${ok ? '1' : '0'}`);
}
