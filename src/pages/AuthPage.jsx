import React, { useState, useEffect } from 'react';
import { BrandMark } from '../components/SiteNav';
import PasswordInput from '../components/PasswordInput';
import { submitAuth, verifyUserOtp, resendUserOtp } from '../lib/api';

const fieldStyles =
  'mt-2 w-full border border-white/15 bg-[#0d1f35] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-cyan-400/70 rounded-sm';
const selectStyles =
  'mt-2 w-full border border-white/15 bg-[#0d1f35] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/70 rounded-sm cursor-pointer';

export default function AuthPage({ mode, role, onNavigate, onAuthSuccess }) {
  const isSignup = mode === 'signup';
  const isAdmin = role === 'admin';
  const title = `${isAdmin ? 'Admin' : 'Investor'} ${isSignup ? 'Sign Up' : 'Login'}`;
  const subtitle = isAdmin
    ? 'Secure access for Skytrade administrators, compliance teams, and broker operations.'
    : 'Access your Skytrade investment account, portfolio reports, deposits, and trading workspace.';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    account_type: '',
    staff_id: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [challengeToken, setChallengeToken] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    setFormData({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      account_type: '',
      staff_id: '',
    });
    setError('');
    setShowOtpForm(false);
    setOtpCode('');
    setChallengeToken('');
    setSuccessMessage('');
  }, [mode, role]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    const fieldMap = {
      fullName: 'name',
      staffId: 'staff_id',
      email: 'email',
      accountType: 'account_type',
      password: 'password',
      confirmPassword: 'password_confirmation',
    };
    setFormData((prev) => ({
      ...prev,
      [fieldMap[id] || id]: value,
    }));
  };

  const handleResendOtp = async () => {
    setError('');
    setSuccessMessage('');
    try {
      setLoading(true);
      const data = await resendUserOtp(challengeToken);
      setChallengeToken(data.challenge_token);
      setSuccessMessage('A new verification code has been sent to your email.');
    } catch (err) {
      setError(err.message || 'Failed to resend verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (showOtpForm) {
      if (!otpCode.trim() || otpCode.length !== 6) {
        setError('Please enter a valid 6-digit code.');
        return;
      }
      try {
        setLoading(true);
        const data = await verifyUserOtp(challengeToken, otpCode);
        if (onAuthSuccess) {
          onAuthSuccess({
            ...data.user,
            permissions: data.permissions || [],
          });
        }
      } catch (err) {
        setError(err.message || 'OTP verification failed. Please try again.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!formData.email.trim()) {
      setError('Email address is required.');
      return;
    }
    if (!formData.password) {
      setError('Password is required.');
      return;
    }

    if (isSignup) {
      if (!formData.name.trim()) {
        setError('Full name is required.');
        return;
      }
      if (isAdmin && !formData.staff_id.trim()) {
        setError('Staff ID is required.');
        return;
      }
      if (!formData.password_confirmation) {
        setError('Please confirm your password.');
        return;
      }
      if (formData.password !== formData.password_confirmation) {
        setError('Passwords do not match.');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
    }

    try {
      setLoading(true);
      const data = await submitAuth({
        mode,
        role,
        values: {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
          account_type: formData.account_type || undefined,
          staff_id: formData.staff_id || undefined,
        },
      });

      if (data.otp_required || (isSignup && !isAdmin && data.challenge_token)) {
        setChallengeToken(data.challenge_token);
        setShowOtpForm(true);
        setSuccessMessage('A 6-digit verification code has been sent to your email.');
        return;
      }

      if (onAuthSuccess) {
        onAuthSuccess({
          ...data.user,
          permissions: data.permissions || [],
        });
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <main
      className="relative min-h-screen flex items-center justify-center px-5 pt-20 pb-10 sm:px-8"
      style={{
        backgroundImage: 'url(/auth-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#050e1a]/85 via-[#071828]/80 to-[#04334c]/75 z-0" />
      {/* Cyan glow accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-blue-600/10 blur-[80px] pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-6xl grid gap-8 md:gap-10 lg:grid-cols-[1fr_480px] items-center">

        {/* Left Column – Branding & Info */}
        <div className="hidden lg:block">
          <BrandMark />
          <p className="mt-10 text-xs font-extrabold uppercase tracking-[.24em] text-cyan-400">
            {isAdmin ? 'Broker operations' : 'Investment account'}
          </p>
          <h1 className="mt-4 text-4xl font-black leading-none tracking-tight text-white xl:text-5xl 2xl:text-6xl">
            {title}
          </h1>
          <p className="mt-6 text-base font-medium leading-7 text-white/70 max-w-md">{subtitle}</p>

          <div className="mt-10 grid grid-cols-2 gap-4 text-sm text-white/70 max-w-sm">
            <div className="border border-cyan-500/20 bg-cyan-900/10 backdrop-blur-sm p-5 rounded-sm">
              <p className="text-2xl font-black text-white">256-bit</p>
              <p className="mt-2">Encrypted account access</p>
            </div>
            <div className="border border-cyan-500/20 bg-cyan-900/10 backdrop-blur-sm p-5 rounded-sm">
              <p className="text-2xl font-black text-white">24/5</p>
              <p className="mt-2">Market desk support</p>
            </div>
          </div>
        </div>

        {/* Right Column – Auth Form */}
        <section className="flex flex-col justify-center">
          <div className="w-full border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-[0_30px_80px_rgba(0,0,0,.55)] rounded-sm sm:p-10">
            <div className="lg:hidden mb-6">
              <BrandMark />
            </div>
            <p className="text-xs font-extrabold uppercase tracking-[.22em] text-cyan-400">
              {isAdmin ? 'Admin portal' : 'Client portal'}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-white/60">{subtitle}</p>

            {error && (
              <div className="mt-4 border border-rose-300/30 bg-rose-950/40 px-4 py-3 text-sm text-rose-200 rounded-sm">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="mt-4 border border-emerald-300/30 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-200 rounded-sm">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {showOtpForm ? (
                <>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-[.16em] text-white/55" htmlFor="otpCode">
                      Verification Code
                    </label>
                    <input
                      id="otpCode"
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      className={fieldStyles}
                      placeholder="123456"
                      autoComplete="one-time-code"
                    />
                    <p className="mt-2 text-xs text-white/45">
                      Enter the 6-digit code sent to your email to verify and activate your account.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-cyan-500 hover:bg-cyan-400 px-5 py-3.5 text-sm font-extrabold text-white shadow-[0_0_35px_rgba(6,182,212,.3)] transition disabled:opacity-50 disabled:cursor-not-allowed rounded-sm mt-2"
                  >
                    {loading ? 'Verifying...' : 'Verify Code'}
                  </button>

                  <div className="flex justify-center mt-2">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={loading}
                      className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition underline underline-offset-4 disabled:opacity-50"
                    >
                      Resend Code
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {isSignup && (
                    <div>
                      <label className="text-xs font-bold uppercase tracking-[.16em] text-white/55" htmlFor="fullName">
                        Full name
                      </label>
                      <input id="fullName" value={formData.name} onChange={handleChange} className={fieldStyles} placeholder="Enter your full name" />
                    </div>
                  )}

                  {isAdmin && isSignup && (
                    <div>
                      <label className="text-xs font-bold uppercase tracking-[.16em] text-white/55" htmlFor="staffId">
                        Staff ID
                      </label>
                      <input id="staffId" value={formData.staff_id} onChange={handleChange} className={fieldStyles} placeholder="SKY-ADMIN-001" />
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-bold uppercase tracking-[.16em] text-white/55" htmlFor="email">
                      Email address
                    </label>
                    <input id="email" type="email" value={formData.email} onChange={handleChange} className={fieldStyles} placeholder={isAdmin ? 'admin@skytrade.com' : 'you@example.com'} />
                  </div>

                  {isSignup && !isAdmin && (
                    <div>
                      <label className="text-xs font-bold uppercase tracking-[.16em] text-white/55" htmlFor="accountType">
                        Investment account type
                      </label>
                      <select id="accountType" value={formData.account_type} onChange={handleChange} className={selectStyles}>
                        <option value="" disabled style={{background:'#0d1f35', color:'#94a3b8'}}>Select account type</option>
                        <option value="Individual brokerage" style={{background:'#0d1f35', color:'#ffffff'}}>Individual brokerage</option>
                        <option value="Joint investment account" style={{background:'#0d1f35', color:'#ffffff'}}>Joint investment account</option>
                        <option value="Business investment account" style={{background:'#0d1f35', color:'#ffffff'}}>Business investment account</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-bold uppercase tracking-[.16em] text-white/55" htmlFor="password">
                      Password
                    </label>
                    <PasswordInput
                      id="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                    />
                    {isSignup && (
                      <p className="mt-2 text-[11px] text-white/45">
                        Use at least 6 characters with letters and numbers.
                      </p>
                    )}
                  </div>

                  {isSignup && (
                    <div>
                      <label className="text-xs font-bold uppercase tracking-[.16em] text-white/55" htmlFor="confirmPassword">
                        Confirm password
                      </label>
                      <PasswordInput
                        id="confirmPassword"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        placeholder="Confirm password"
                        autoComplete="new-password"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-cyan-500 hover:bg-cyan-400 px-5 py-3.5 text-sm font-extrabold text-white shadow-[0_0_35px_rgba(6,182,212,.3)] transition disabled:opacity-50 disabled:cursor-not-allowed rounded-sm mt-2"
                  >
                    {loading ? 'Processing...' : isSignup ? 'Create Account' : 'Login'}
                  </button>
                </>
              )}
            </form>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-white/55">
              {!isAdmin && (
                <button
                  onClick={() => onNavigate(isSignup ? `${role}-login` : `${role}-signup`)}
                  className="font-bold text-cyan-400 hover:text-cyan-300 transition"
                >
                  {isSignup ? 'Already have an account? Login' : 'Create an account'}
                </button>
              )}
              {isAdmin && (
                <p className="text-xs text-white/45">
                  Admin access is provisioned internally and monitored by broker operations.
                </p>
              )}
              {!isSignup && isAdmin && (
                <button onClick={() => onNavigate('user-login')} className="hover:text-white transition">
                  Investor login
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
