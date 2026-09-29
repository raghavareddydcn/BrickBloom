import { type ReactNode, useEffect, useState } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { KeyRound, Lock, LogIn, ShieldCheck, User, UserPlus } from 'lucide-react';
import { firestore } from '@/lib/firebase';
import { Button } from '@/components/ui/button';

const IDLE_TIMEOUT = 30 * 60 * 1000;
const ORG_PASSKEY = 'brickbloom2026';

async function hashPassword(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest)).map((part) => part.toString(16).padStart(2, '0')).join('');
}

async function seedAdmin() {
  const adminRef = doc(firestore, 'admin_users', 'admin');
  const existing = await getDoc(adminRef);
  if (existing.exists()) return;
  await setDoc(adminRef, {
    username: 'admin',
    phone: '0000000000',
    passwordHash: await hashPassword('bloomfrompeat'),
    role: 'admin',
    status: 'active',
    createdAt: new Date().toISOString(),
    lastLogin: null,
    createdBy: 'system',
  });
}

export default function AdminAccessGate({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem('bb_admin') === '1');
  const [mode, setMode] = useState<'signin' | 'register'>('signin');

  // Sign in fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Register fields
  const [regUsername, setRegUsername] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [regPasskey, setRegPasskey] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void seedAdmin().catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    const recordActivity = () => sessionStorage.setItem('bb_last_activity', String(Date.now()));
    const verifySession = () => {
      const lastActivity = Number(sessionStorage.getItem('bb_last_activity') || 0);
      if (!lastActivity || Date.now() - lastActivity > IDLE_TIMEOUT) {
        sessionStorage.removeItem('bb_admin');
        sessionStorage.removeItem('bb_admin_user');
        sessionStorage.removeItem('bb_admin_role');
        setAuthenticated(false);
      }
    };

    recordActivity();
    window.addEventListener('pointerdown', recordActivity);
    window.addEventListener('keydown', recordActivity);
    window.addEventListener('focus', verifySession);
    const interval = window.setInterval(verifySession, 10_000);

    return () => {
      window.removeEventListener('pointerdown', recordActivity);
      window.removeEventListener('keydown', recordActivity);
      window.removeEventListener('focus', verifySession);
      window.clearInterval(interval);
    };
  }, [authenticated]);

  async function signIn(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const normalizedUsername = username.trim().toLowerCase();
      const userRef = doc(firestore, 'admin_users', normalizedUsername);
      const userSnapshot = await getDoc(userRef);
      const user = userSnapshot.data();

      if (!userSnapshot.exists()) {
        throw new Error('User not found. Please verify your username.');
      }
      if (user?.status === 'disabled') {
        throw new Error('This account has been disabled by an administrator.');
      }
      if (user?.passwordHash !== (await hashPassword(password))) {
        throw new Error('Incorrect password. Please try again.');
      }

      sessionStorage.setItem('bb_admin', '1');
      sessionStorage.setItem('bb_admin_user', user.username || normalizedUsername);
      sessionStorage.setItem('bb_admin_role', user.role || 'viewer');
      sessionStorage.setItem('bb_last_activity', String(Date.now()));

      void updateDoc(userRef, { lastLogin: new Date().toISOString() });
      setAuthenticated(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  }

  async function registerUser(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (regPassword !== regConfirm) {
      setError('Passwords do not match.');
      return;
    }
    if (regPasskey.trim() !== ORG_PASSKEY) {
      setError('Invalid organization passkey. Contact your administrator.');
      return;
    }

    setLoading(true);
    try {
      const normalized = regUsername.trim().toLowerCase();
      const userRef = doc(firestore, 'admin_users', normalized);
      const existing = await getDoc(userRef);

      if (existing.exists()) {
        throw new Error('Username already exists. Please choose a different one.');
      }

      await setDoc(userRef, {
        username: normalized,
        phone: regPhone.trim(),
        passwordHash: await hashPassword(regPassword),
        role: 'editor',
        status: 'active',
        createdAt: new Date().toISOString(),
        lastLogin: null,
        createdBy: 'self-registration',
      });

      setSuccess('Account created successfully! You can now sign in.');
      setUsername(normalized);
      setPassword(regPassword);
      setMode('signin');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  }

  if (authenticated) return <>{children}</>;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f0e4cf_0%,#f7f1e5_100%)] flex flex-col justify-between font-sans text-slate-800">
      
      {/* Topbar matching public/admin.html */}
      <header className="sticky top-0 z-50 h-16 bg-[#031c0e]/95 backdrop-blur-md border-b border-white/10 px-6 sm:px-10 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <img
            src="/images/OurProducts/Logo_new.jpeg"
            alt="BrickBloom"
            className="h-10 w-auto rounded-lg object-contain bg-[#f5ebd9] p-1 shadow-md"
          />
          <div>
            <span className="font-display text-lg font-bold text-white tracking-wide block leading-none">
              BRICKBLOOM
            </span>
            <span className="text-[10px] uppercase font-bold tracking-[1.2px] text-emerald-400 block mt-0.5">
              Admin Enterprise Suite
            </span>
          </div>
        </div>

        <a
          href="/"
          className="text-xs font-semibold text-slate-300 hover:text-white transition-colors"
        >
          &larr; Public Site
        </a>
      </header>

      {/* Main Form Center Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="w-full max-w-[440px]">
          
          <div className="relative rounded-3xl bg-[#fcf7ee] border-[1.5px] border-[#e5d4b7] p-8 sm:p-10 shadow-2xl overflow-hidden text-center">
            
            {/* Top Rainbow Stripe */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-700 via-emerald-500 to-amber-400" />

            {/* BrickBloom Logo */}
            <img
              src="/images/OurProducts/Logo_new.jpeg"
              alt="BrickBloom"
              className="h-16 w-auto rounded-2xl mx-auto mb-3 shadow-md bg-[#f5ebd9] p-1.5 border border-[#e5d4b7]"
            />

            {/* Title & Subtitle */}
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {mode === 'signin' ? 'Enterprise Sign In' : 'Create Account'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 mb-6">
              {mode === 'signin'
                ? 'Enter credentials to access admin tools'
                : 'Register for admin portal access'}
            </p>

            {/* Alerts */}
            {error && (
              <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-left text-xs font-bold text-rose-700">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-left text-xs font-bold text-emerald-700">
                {success}
              </div>
            )}

            {/* Mode A: Sign In Form */}
            {mode === 'signin' ? (
              <form onSubmit={signIn} className="space-y-4 text-left">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      required
                      autoComplete="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username"
                      className="w-full h-11 rounded-xl border-[1.5px] border-[#d8c4a0] bg-white pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      required
                      autoComplete="current-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full h-11 rounded-xl border-[1.5px] border-[#d8c4a0] bg-white pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-brand-900 to-brand-950 hover:from-brand-800 hover:to-brand-900 text-white font-bold text-sm shadow-xl shadow-brand-950/20 transition-all hover:-translate-y-0.5 mt-2"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  {loading ? 'Authenticating…' : 'Sign In \u2192'}
                </Button>

                <div className="pt-3 text-center text-xs text-slate-600">
                  New here?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setError('');
                    }}
                    className="font-bold text-brand-800 hover:underline"
                  >
                    Create an Account
                  </button>
                </div>
              </form>
            ) : (
              /* Mode B: Register Form */
              <form onSubmit={registerUser} className="space-y-3.5 text-left">
                <div className="rounded-xl border border-amber-300 bg-amber-50 p-2.5 text-[11px] font-medium text-amber-900 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-amber-700 shrink-0" />
                  <span>
                    You need an <strong>organization passkey</strong> to register. Contact your administrator if needed.
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1">
                      Username
                    </label>
                    <input
                      required
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder="Choose username"
                      className="w-full h-10 rounded-xl border-[1.5px] border-[#d8c4a0] bg-white px-3 text-xs text-slate-800 outline-none focus:border-brand-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1">
                      Phone Number
                    </label>
                    <input
                      required
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full h-10 rounded-xl border-[1.5px] border-[#d8c4a0] bg-white px-3 text-xs text-slate-800 outline-none focus:border-brand-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1">
                      Password
                    </label>
                    <input
                      required
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      className="w-full h-10 rounded-xl border-[1.5px] border-[#d8c4a0] bg-white px-3 text-xs text-slate-800 outline-none focus:border-brand-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1">
                      Confirm
                    </label>
                    <input
                      required
                      type="password"
                      value={regConfirm}
                      onChange={(e) => setRegConfirm(e.target.value)}
                      placeholder="Repeat"
                      className="w-full h-10 rounded-xl border-[1.5px] border-[#d8c4a0] bg-white px-3 text-xs text-slate-800 outline-none focus:border-brand-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1">
                    Organization Passkey
                  </label>
                  <input
                    required
                    type="password"
                    value={regPasskey}
                    onChange={(e) => setRegPasskey(e.target.value)}
                    placeholder="Enter organization passkey"
                    className="w-full h-10 rounded-xl border-[1.5px] border-[#d8c4a0] bg-white px-3 text-xs text-slate-800 outline-none focus:border-brand-600"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-brand-900 to-brand-950 hover:from-brand-800 hover:to-brand-900 text-white font-bold text-xs shadow-md mt-2"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  {loading ? 'Creating Account…' : 'Create Account \u2192'}
                </Button>

                <div className="pt-2 text-center text-xs text-slate-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setError('');
                    }}
                    className="font-bold text-brand-800 hover:underline"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            )}

            <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-400">
              <KeyRound className="h-3 w-3" />
              Sessions automatically expire after 30 minutes of inactivity.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-slate-500">
        &copy; 2026 Konaseema Coco Products LLP &bull; BrickBloom Enterprise Operations
      </footer>
    </div>
  );
}
