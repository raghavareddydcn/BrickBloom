import { type ReactNode, useEffect, useState } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { KeyRound, Leaf, LogIn } from 'lucide-react';
import { firestore } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const IDLE_TIMEOUT = 30 * 60 * 1000;

async function hashPassword(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest)).map((part) => part.toString(16).padStart(2, '0')).join('');
}

async function seedAdmin() {
  const adminRef = doc(firestore, 'admin_users', 'admin');
  const existing = await getDoc(adminRef);
  if (existing.exists()) return;
  await setDoc(adminRef, { username: 'admin', phone: '0000000000', passwordHash: await hashPassword('bloomfrompeat'), role: 'admin', status: 'active', createdAt: new Date().toISOString(), lastLogin: null, createdBy: 'system' });
}

export default function AdminAccessGate({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem('bb_admin') === '1');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { void seedAdmin().catch(() => undefined); }, []);
  useEffect(() => {
    if (!authenticated) return;
    const recordActivity = () => sessionStorage.setItem('bb_last_activity', String(Date.now()));
    const verifySession = () => {
      const lastActivity = Number(sessionStorage.getItem('bb_last_activity') || 0);
      if (!lastActivity || Date.now() - lastActivity > IDLE_TIMEOUT) {
        sessionStorage.removeItem('bb_admin'); sessionStorage.removeItem('bb_admin_user'); sessionStorage.removeItem('bb_admin_role'); setAuthenticated(false);
      }
    };
    recordActivity();
    window.addEventListener('pointerdown', recordActivity); window.addEventListener('keydown', recordActivity); window.addEventListener('focus', verifySession);
    const interval = window.setInterval(verifySession, 10_000);
    return () => { window.removeEventListener('pointerdown', recordActivity); window.removeEventListener('keydown', recordActivity); window.removeEventListener('focus', verifySession); window.clearInterval(interval); };
  }, [authenticated]);

  async function signIn(event: React.FormEvent) {
    event.preventDefault(); setError(''); setLoading(true);
    try {
      const normalizedUsername = username.trim().toLowerCase();
      const userRef = doc(firestore, 'admin_users', normalizedUsername);
      const userSnapshot = await getDoc(userRef);
      const user = userSnapshot.data();
      if (!userSnapshot.exists() || user?.status === 'disabled' || user?.passwordHash !== await hashPassword(password)) throw new Error('Invalid username or password.');
      sessionStorage.setItem('bb_admin', '1'); sessionStorage.setItem('bb_admin_user', user.username || normalizedUsername); sessionStorage.setItem('bb_admin_role', user.role || 'viewer'); sessionStorage.setItem('bb_last_activity', String(Date.now()));
      void updateDoc(userRef, { lastLogin: new Date().toISOString() });
      setAuthenticated(true);
    } catch (signInError) { setError(signInError instanceof Error ? signInError.message : 'Unable to sign in.'); }
    finally { setLoading(false); }
  }

  if (authenticated) return <>{children}</>;
  return <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,_#dcfce7,_#f8fafc_42%,_#ffffff)] p-4"><Card className="w-full max-w-md"><CardHeader className="items-center text-center"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-700 text-white"><Leaf className="h-6 w-6" /></div><CardTitle className="mt-4 text-3xl">Operations sign in</CardTitle><CardDescription>Use your BrickBloom operations account to continue.</CardDescription></CardHeader><CardContent><form onSubmit={signIn} className="space-y-4"><label className="block text-sm font-semibold text-slate-700">Username<input required autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 font-normal outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100" placeholder="Enter username" /></label><label className="block text-sm font-semibold text-slate-700">Password<input required autoComplete="current-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 font-normal outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100" placeholder="Enter password" /></label>{error && <p className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">{error}</p>}<Button type="submit" size="lg" className="w-full" disabled={loading}><LogIn className="h-4 w-4" />{loading ? 'Signing in…' : 'Sign in'}</Button></form><p className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-slate-400"><KeyRound className="h-3.5 w-3.5" /> Sessions automatically expire after 30 minutes of inactivity.</p></CardContent></Card></main>;
}
