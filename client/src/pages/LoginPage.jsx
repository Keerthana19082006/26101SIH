import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn, ShieldCheck, ExternalLink, AlertCircle, Zap, GraduationCap, Shield } from 'lucide-react';
import { authAPI } from '../services/api';
import { useStream } from '../context/StreamContext';
import PreDashboardLayout from '../components/layout/PreDashboardLayout';

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const { skipToDashboard } = useStream();
  const [form, setForm] = useState({ credential: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInstantDemoLogin = () => {
    setLoading(true);
    setError('');
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem('ks_active_portal', 'portal_selection');
      onLogin();
    }, 120);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.credential || !form.password) {
      setError('Please enter your iGOT credentials to continue.');
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      const { data } = await authAPI.login({
        email: form.credential,
        password: form.password,
      });
      if (data?.token) {
        localStorage.setItem('ks_token', data.token);
        if (data.user) {
          localStorage.setItem('ks_user', JSON.stringify(data.user));
        }
      }
    } catch {
      // If backend server is offline or mock mode, smoothly authenticate demo session
      console.info('Operating in fast offline/demo session mode.');
    } finally {
      setTimeout(() => {
        setLoading(false);
        localStorage.setItem('ks_active_portal', 'portal_selection');
        onLogin();
      }, 150);
    }
  };

  const quickLogin = () => {
    setForm({ credential: 'rahul.sharma@nic.in', password: 'Demo@1234' });
  };

  const loginHeader = (
    <div className="w-full flex flex-col">
      {/* ── GOVERNMENT HEADER & TOP TRICOLOR BORDER ──────────────────────── */}
      <div className="bg-gov-navy">
        <div className="h-1 bg-gradient-to-r from-gov-saffron via-white to-gov-green w-full" />
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-4">
            <div className="w-14 h-14 rounded-full border-2 border-white/30 bg-white/10 flex items-center justify-center shrink-0">
              <div className="text-center">
                <div className="text-[8px] font-bold text-white/90 leading-none">GOVT</div>
                <div className="text-[9px] font-bold text-gov-saffron mt-0.5 leading-none">INDIA</div>
              </div>
            </div>
            <div>
              <p className="text-[11px] text-white/60 font-medium uppercase tracking-widest">
                भारत सरकार · Government of India
              </p>
              <h1 className="text-base sm:text-lg font-bold text-white leading-snug">
                Ministry of Statistics & Programme Implementation
              </h1>
              <p className="text-xs text-white/50">Data Informatics & Innovation Division (DIID)</p>
            </div>
            <div className="ml-auto hidden sm:flex items-center gap-2 border border-white/20 rounded px-3 py-2 bg-white/5">
              <div className="w-6 h-6 rounded bg-gov-saffron flex items-center justify-center text-white text-[10px] font-bold">iG</div>
              <div>
                <p className="text-[11px] font-semibold text-white">iGOT Karmayogi</p>
                <p className="text-[9px] text-white/40">[Integration Placeholder]</p>
              </div>
            </div>
          </div>
        </div>
        <div className="h-px bg-white/10" />
      </div>

      {/* ── PAGE TITLE STRIP ─────────────────────────────────────────────── */}
      <div className="bg-gov-blue py-3 px-4 w-full shadow-xs">
        <div className="w-full">
          <h2 className="text-sm sm:text-base font-semibold text-white text-center">
            Government Employee Learning & Competency Portal
          </h2>
        </div>
      </div>
    </div>
  );

  const loginFooter = (
    <div className="bg-gov-navy border-t border-white/10 py-3 px-4 text-center shrink-0">
      <p className="text-[10px] text-white/40">
        © {new Date().getFullYear()} Government Employee Competency Platform · Ministry of Statistics & Programme Implementation ·{' '}
        <span className="text-white/30">Demonstration Portal — Not an official Government of India website</span>
      </p>
    </div>
  );

  return (
    <PreDashboardLayout header={loginHeader} footer={loginFooter}>
      {/* ── LOGIN AREA ────────────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Card */}
            <div className="gov-card overflow-hidden">
              {/* Card header */}
              <div className="bg-gov-off-white border-b border-gov-gray-200 px-6 py-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-gov-blue rounded-gov flex items-center justify-center">
                  <ShieldCheck size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gov-navy">Secure Sign In</h3>
                  <p className="text-[11px] text-gov-gray-400">Sign in using your registered iGOT credentials</p>
                </div>
              </div>

              <div className="p-6">
                {/* iGOT notice */}
                <div className="flex items-start gap-2 bg-gov-blue-light border border-blue-200 rounded-gov px-3 py-2.5 mb-5 text-xs text-gov-blue">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>Only employees registered with <strong>iGOT Karmayogi</strong> can access this portal.</span>
                </div>

                {error && (
                  <div className="flex items-center gap-2 bg-gov-red-light border border-red-200 rounded-gov px-3 py-2 mb-4 text-xs text-gov-red">
                    <AlertCircle size={12} />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div>
                    <label className="gov-label" htmlFor="credential">
                      iGOT Registered Email / Employee ID
                    </label>
                    <input
                      id="credential"
                      type="text"
                      className="gov-input"
                      placeholder="e.g. rahul.sharma@nic.in or EMP-2024-04821"
                      value={form.credential}
                      onChange={e => { setForm(p => ({ ...p, credential: e.target.value })); setError(''); }}
                      autoComplete="username"
                    />
                  </div>

                  <div>
                    <label className="gov-label" htmlFor="password">Password</label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPw ? 'text' : 'password'}
                        className="gov-input pr-10"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={e => { setForm(p => ({ ...p, password: e.target.value })); setError(''); }}
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gov-gray-400 hover:text-gov-gray-600 transition-colors"
                      >
                        {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-gov-primary w-full justify-center py-2.5 text-sm"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Authenticating...
                      </>
                    ) : (
                      <>
                        <LogIn size={16} />
                        Login with iGOT
                      </>
                    )}
                  </button>
                </form>

                {/* Instant Access & Demo */}
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-gov-gray-200" />
                  <span className="text-[10px] text-gov-gray-400 uppercase tracking-wide">Instant Demo Access</span>
                  <div className="flex-1 h-px bg-gov-gray-200" />
                </div>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleInstantDemoLogin}
                    className="w-full bg-gov-blue hover:bg-gov-navy text-white font-semibold rounded-gov py-2 px-4 text-xs transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Zap size={14} className="fill-white" />
                    <span>⚡ Instant Access: Employee Portal (Dashboard)</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        localStorage.setItem('ks_is_logged_in', 'true');
                        localStorage.setItem('ks_active_portal', 'trainer');
                        navigate('/trainer');
                      }}
                      className="bg-gov-saffron hover:bg-[#c0622a] text-white font-semibold rounded-gov py-2 px-3 text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <GraduationCap size={14} />
                      <span>🎓 Trainer Portal</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        localStorage.setItem('ks_is_logged_in', 'true');
                        localStorage.setItem('ks_active_portal', 'admin');
                        navigate('/admin');
                      }}
                      className="bg-gov-green hover:bg-[#1a5b3a] text-white font-semibold rounded-gov py-2 px-3 text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Shield size={14} />
                      <span>🛡️ Admin Portal</span>
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={quickLogin}
                  className="w-full border border-gov-gray-200 rounded-gov px-3 py-2 text-xs text-gov-gray-600 hover:bg-gov-gray-100 transition-colors text-left mt-2 flex items-center justify-between cursor-pointer"
                >
                  <span>
                    <span className="font-semibold text-gov-navy">Demo Account:</span> rahul.sharma@nic.in
                  </span>
                  <span className="badge-gov-neutral text-[9px]">Auto-Fill</span>
                </button>

                {/* Helper links */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4 justify-center">
                  {[
                    { label: 'Forgot Password', href: '#' },
                    { label: 'iGOT Registration / Help', href: 'https://www.igot.gov.in', external: true },
                    { label: 'Privacy Policy', href: '#' },
                    { label: 'Terms of Use', href: '#' },
                  ].map(({ label, href, external }) => (
                    <a key={label} href={href}
                      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                      className="text-[11px] text-gov-blue hover:text-gov-navy transition-colors flex items-center gap-0.5">
                      {label} {external && <ExternalLink size={9} />}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Official disclaimer */}
            <div className="mt-4 text-center">
              <p className="text-[10px] text-gov-gray-400 leading-relaxed">
                This portal is accessible only to registered government employees.<br />
                Unauthorised access is prohibited. All activity is logged and monitored.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </PreDashboardLayout>
  );
}
