import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import {
  Eye,
  EyeOff,
  Sun,
  Moon,
  Sparkles,
  User,
  Mail,
  Lock,
  Building2,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
} from 'lucide-react';

export default function LoginPage({ initialMode = 'signin' }) {
  const [mode, setMode] = useState(initialMode); // 'signin' | 'signup'
  const [username, setUsername] = useState('67114640285');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Sign up form state (Only Student ID & Password required)
  const [signUpData, setSignUpData] = useState({
    student_id: '',
    password: '',
    confirm_password: '',
  });
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, register, isDarkMode, toggleTheme } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    const res = await login(username, password);
    setIsLoading(false);

    if (res.success) {
      navigate('/');
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!signUpData.student_id.trim()) {
      setErrorMsg('กรุณากรอกรหัสนักศึกษา');
      return;
    }

    if (signUpData.password.length < 6) {
      setErrorMsg('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }

    if (signUpData.password !== signUpData.confirm_password) {
      setErrorMsg('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง');
      return;
    }

    setIsLoading(true);
    const res = await register({
      student_id: signUpData.student_id.trim(),
      password: signUpData.password,
    });
    setIsLoading(false);

    if (res.success) {
      setSuccessMsg('สมัครสมาชิกสำเร็จเรียบร้อย! กำลังนำคุณเข้าสู่ระบบ...');
      try {
        confetti({
          particleCount: 140,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#006663', '#F07C00', '#10B981'],
        });
      } catch (err) {}

      setTimeout(() => {
        navigate('/');
      }, 1500);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between relative overflow-hidden select-none transition-colors duration-500 font-jakarta ${
        isDarkMode ? 'bg-[#091118] text-slate-100' : 'bg-white text-slate-800'
      }`}
    >
      {/* Dark mode ambient stars & glow */}
      {isDarkMode && (
        <>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-teal-500/15 via-teal-900/5 to-transparent blur-3xl pointer-events-none" />
          <div className="absolute top-12 left-1/4 w-1.5 h-1.5 rounded-full bg-teal-300 animate-ping opacity-60 pointer-events-none" />
          <div className="absolute top-24 right-1/4 w-1 h-1 rounded-full bg-amber-200 animate-pulse pointer-events-none" />
          <div className="absolute top-36 right-1/3 w-1.5 h-1.5 rounded-full bg-white opacity-40 pointer-events-none" />
        </>
      )}

      {/* Top Header Bar with Theme Switcher */}
      <div className="w-full max-w-6xl mx-auto px-6 pt-5 sm:pt-7 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <div
            className={`text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full border transition-colors flex items-center gap-1.5 ${
              isDarkMode
                ? 'bg-teal-950/60 border-teal-800/60 text-teal-300'
                : 'bg-[#E6F4F1] border-[#D1EAE5] text-[#005A56]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F07C00]" />
            <span>UBU Smart Registration System</span>
          </div>
        </div>

        {/* Light / Dark Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          id="theme-toggle-btn"
          title={isDarkMode ? 'เปลี่ยนเป็นธีมสว่าง (Switch to Light Mode)' : 'เปลี่ยนเป็นธีมมืด (Switch to Dark Mode)'}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition-all cursor-pointer shadow-xs ${
            isDarkMode
              ? 'bg-[#13222D] border-teal-800 text-teal-300 hover:bg-[#1A2E3D]'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-black'
          }`}
        >
          {isDarkMode ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold">ธีมสว่าง</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-slate-700" />
              <span className="text-xs font-semibold">ธีมมืด</span>
            </>
          )}
        </button>
      </div>

      {/* Main Form Container */}
      <div
        className={`w-full mx-auto px-6 z-10 flex flex-col items-center my-auto py-6 transition-all duration-300 ${
          mode === 'signup' ? 'max-w-[560px]' : 'max-w-[440px]'
        }`}
      >
        {/* Computer Screen with User Icon */}
        <div className="flex flex-col items-center mb-4 group">
          <div
            className={`w-20 h-16 rounded-2xl border-[4.5px] flex items-center justify-center relative p-1 transition-all duration-300 shadow-md ${
              isDarkMode
                ? 'border-[#009688] bg-[#0E1B24] shadow-teal-950/50'
                : 'border-[#006663] bg-white shadow-teal-900/10'
            }`}
          >
            {/* User Avatar Silhouette inside Screen */}
            <div className="flex flex-col items-center justify-center">
              <div
                className={`w-4.5 h-4.5 rounded-full mb-1 transition-colors ${
                  isDarkMode ? 'bg-[#009688]' : 'bg-[#006663]'
                }`}
              />
              <div
                className={`w-8 h-3.5 rounded-t-full transition-colors ${
                  isDarkMode ? 'bg-[#009688]' : 'bg-[#006663]'
                }`}
              />
            </div>
          </div>
          {/* Monitor Stand */}
          <div
            className={`w-3 h-2.5 transition-colors ${
              isDarkMode ? 'bg-[#009688]' : 'bg-[#006663]'
            }`}
          />
          <div
            className={`w-10 h-2 rounded-xs transition-colors ${
              isDarkMode ? 'bg-[#009688]' : 'bg-[#006663]'
            }`}
          />
        </div>

        {/* Distinctive Iconic Title */}
        <h1
          className={`text-2xl sm:text-[28px] font-extrabold tracking-tight text-center mb-4 font-outfit transition-colors leading-tight ${
            isDarkMode ? 'text-white drop-shadow-sm' : 'text-slate-900'
          }`}
        >
          UBU Course Registration
        </h1>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div className="w-full flex rounded-2xl bg-slate-100 dark:bg-[#13222D] p-1.5 mb-6 border border-slate-200/80 dark:border-teal-900/60 shadow-inner">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-white dark:bg-[#005A56] text-[#005A56] dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            เข้าสู่ระบบ (Sign In)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-white dark:bg-[#005A56] text-[#005A56] dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            สมัครบัญชีใหม่ (Sign Up)
          </button>
        </div>

        {/* Error / Success Notifications */}
        {errorMsg && (
          <div className="w-full mb-4 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="w-full mb-4 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ================= MODE: SIGN IN ================= */}
        {mode === 'signin' ? (
          <form onSubmit={handleLogin} className="w-full space-y-4">
            {/* Username Input Pill */}
            <div className="relative flex items-center">
              <div
                className={`absolute left-5 pointer-events-none transition-colors ${
                  isDarkMode ? 'text-[#009688]' : 'text-[#006663]'
                }`}
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="รหัสนักศึกษา หรือ อีเมล"
                className={`w-full h-12 pl-14 pr-5 rounded-full text-sm font-medium transition-all focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? 'bg-[#13222D] text-white placeholder:text-slate-500 border border-teal-900/60 focus:ring-teal-500/40 focus:border-teal-500'
                    : 'bg-[#EAEFF2] text-slate-800 placeholder:text-[#5F7B83] border border-transparent focus:ring-[#006663]/30 focus:border-[#006663]'
                }`}
              />
            </div>

            {/* Password Input Pill */}
            <div className="relative flex items-center">
              <div
                className={`absolute left-5 pointer-events-none transition-colors ${
                  isDarkMode ? 'text-[#009688]' : 'text-[#006663]'
                }`}
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  <circle cx="8" cy="16" r="1" fill="currentColor" />
                  <circle cx="12" cy="16" r="1" fill="currentColor" />
                  <circle cx="16" cy="16" r="1" fill="currentColor" />
                </svg>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="รหัสผ่าน (password)"
                className={`w-full h-12 pl-14 pr-12 rounded-full text-sm font-medium transition-all focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? 'bg-[#13222D] text-white placeholder:text-slate-500 border border-teal-900/60 focus:ring-teal-500/40 focus:border-teal-500'
                    : 'bg-[#EAEFF2] text-slate-800 placeholder:text-[#5F7B83] border border-transparent focus:ring-[#006663]/30 focus:border-[#006663]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-5 transition-colors cursor-pointer ${
                  isDarkMode ? 'text-teal-400 hover:text-teal-200' : 'text-[#006663] hover:text-[#004e4b]'
                }`}
              >
                {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>

            {/* Remember me & Forgot Password */}
            <div className="flex items-center justify-between pt-1 px-1 text-xs sm:text-[13px]">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <div
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                    rememberMe
                      ? isDarkMode ? 'bg-[#009688] border-[#009688]' : 'bg-[#006663] border-[#006663]'
                      : isDarkMode ? 'border-teal-700 bg-transparent' : 'border-[#006663] bg-transparent'
                  }`}
                >
                  {rememberMe && (
                    <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span className={isDarkMode ? 'text-slate-300' : 'text-[#334155]'}>
                  จำข้อมูลของฉัน (Remember me)
                </span>
              </label>

              <button
                type="button"
                onClick={() => setErrorMsg('หากลืมรหัสผ่าน กรุณาติดต่อสำนักทะเบียน มหาวิทยาลัยอุบลราชธานี หรืออาจารย์ที่ปรึกษา')}
                className={`underline underline-offset-2 transition-colors cursor-pointer ${
                  isDarkMode ? 'text-teal-400 hover:text-teal-300' : 'text-[#334155] hover:text-black'
                }`}
              >
                ลืมรหัสผ่าน?
              </button>
            </div>

            {/* LOG IN Button */}
            <div className="pt-4 flex justify-center">
              <button
                type="submit"
                id="login-submit-btn"
                disabled={isLoading}
                className={`w-48 sm:w-56 h-12 rounded-2xl font-bold uppercase tracking-wider text-sm transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 shadow-lg font-outfit ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-[#00897B] to-[#00695C] hover:from-[#009688] hover:to-[#00796B] text-white shadow-teal-950/60'
                    : 'bg-[#005B58] hover:bg-[#004845] text-white shadow-[#005B58]/25'
                }`}
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>LOG IN</span>}
              </button>
            </div>

            {/* Switch to Sign Up text */}
            <div className="text-center pt-2 space-y-0.5">
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                ยังไม่มีบัญชีนักศึกษา?
              </p>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`text-xs sm:text-sm font-bold underline underline-offset-2 transition-colors cursor-pointer ${
                  isDarkMode ? 'text-teal-300 hover:text-white' : 'text-slate-900 hover:text-[#005B58]'
                }`}
              >
                สมัครบัญชีใหม่ (Sign Up)
              </button>
            </div>
          </form>
        ) : (
          /* ================= MODE: SIGN UP ================= */
          <form onSubmit={handleSignUp} className="w-full space-y-4 text-xs sm:text-sm">
            {/* Student ID */}
            <div>
              <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                รหัสนักศึกษา (Student ID) *
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 pointer-events-none text-slate-400 dark:text-teal-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="เช่น 67114640***"
                  value={signUpData.student_id}
                  onChange={(e) => setSignUpData({ ...signUpData, student_id: e.target.value })}
                  className={`w-full h-12 pl-11 pr-4 rounded-xl text-xs sm:text-sm font-medium transition-all focus:outline-none focus:ring-2 ${
                    isDarkMode
                      ? 'bg-[#13222D] text-white placeholder:text-slate-500 border border-teal-900/60 focus:ring-teal-500/40'
                      : 'bg-[#EAEFF2] text-slate-800 placeholder:text-slate-400 border border-transparent focus:ring-[#006663]/30'
                  }`}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                รหัสผ่าน (Password) *
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 pointer-events-none text-slate-400 dark:text-teal-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="รหัสผ่านอย่างน้อย 6 ตัวอักษร"
                  value={signUpData.password}
                  onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                  className={`w-full h-12 pl-11 pr-11 rounded-xl text-xs sm:text-sm font-medium transition-all focus:outline-none focus:ring-2 ${
                    isDarkMode
                      ? 'bg-[#13222D] text-white placeholder:text-slate-500 border border-teal-900/60 focus:ring-teal-500/40'
                      : 'bg-[#EAEFF2] text-slate-800 placeholder:text-slate-400 border border-transparent focus:ring-[#006663]/30'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                ยืนยันรหัสผ่าน (Confirm Password) *
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 pointer-events-none text-slate-400 dark:text-teal-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="กรอกรหัสผ่านซ้ำอีกครั้ง"
                  value={signUpData.confirm_password}
                  onChange={(e) => setSignUpData({ ...signUpData, confirm_password: e.target.value })}
                  className={`w-full h-12 pl-11 pr-11 rounded-xl text-xs sm:text-sm font-medium transition-all focus:outline-none focus:ring-2 ${
                    isDarkMode
                      ? 'bg-[#13222D] text-white placeholder:text-slate-500 border border-teal-900/60 focus:ring-teal-500/40'
                      : 'bg-[#EAEFF2] text-slate-800 placeholder:text-slate-400 border border-transparent focus:ring-[#006663]/30'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showConfirmPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Helpful Notice Card */}
            <div className={`p-3.5 rounded-2xl border text-xs leading-relaxed transition-colors ${
              isDarkMode
                ? 'bg-teal-950/40 border-teal-800/40 text-teal-200'
                : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
            }`}>
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#F07C00] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold mb-0.5">สมัครง่ายและรวดเร็ว!</p>
                  <p className="text-[11px] opacity-90">
                    กรอกเพียงรหัสนักศึกษาและรหัสผ่านเพื่อเริ่มใช้งาน ข้อมูลส่วนตัวอื่นๆ (ชื่อ-นามสกุล คณะ สาขาวิชา และอาจารย์ที่ปรึกษา) สามารถเข้าไปแก้ไขเพิ่มเติมได้ที่เมนู <strong>"แก้ไขข้อมูลส่วนตัว"</strong> หลังจากเข้าสู่ระบบ
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Sign Up Button */}
            <div className="pt-2 flex justify-center">
              <button
                type="submit"
                id="signup-submit-btn"
                disabled={isLoading}
                className={`w-full sm:w-72 h-12 rounded-2xl font-bold uppercase tracking-wider text-xs sm:text-sm transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 shadow-lg font-outfit ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-[#00897B] to-[#00695C] hover:from-[#009688] hover:to-[#00796B] text-white shadow-teal-950/60'
                    : 'bg-[#005B58] hover:bg-[#004845] text-white shadow-[#005B58]/25'
                }`}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>สร้างบัญชีนักศึกษา (CREATE ACCOUNT)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Back to Sign In */}
            <div className="text-center pt-2">
              <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                มีบัญชีนักศึกษาอยู่แล้ว?{' '}
              </span>
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`text-xs sm:text-sm font-bold underline underline-offset-2 transition-colors cursor-pointer ${
                  isDarkMode ? 'text-teal-300 hover:text-white' : 'text-slate-900 hover:text-[#005B58]'
                }`}
              >
                เข้าสู่ระบบ (Sign In)
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Geometric Sharp Angular Mountain Peaks (Theme-aware: Light & Dark) */}
      <div className="w-full relative leading-none mt-auto select-none pointer-events-none overflow-hidden h-[180px] sm:h-[260px] md:h-[300px]">
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-full object-fill absolute bottom-0 left-0 transition-all duration-500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          {isDarkMode ? (
            /* Dark Mode Mountains (Deep Obsidian & Midnight Pine) */
            <>
              {/* Back Mountain Layer */}
              <polygon
                points="0,320 0,160 80,190 200,120 320,240 450,150 560,320"
                fill="#052726"
              />
              <polygon
                points="880,320 1020,180 1140,240 1260,110 1380,210 1440,150 1440,320"
                fill="#052726"
              />

              {/* Mid Layer */}
              <polygon
                points="0,320 0,220 60,130 150,250 170,220 280,320"
                fill="#021C1B"
              />
              <polygon
                points="140,320 240,210 330,320"
                fill="#021C1B"
              />
              <polygon
                points="920,320 1080,130 1220,320"
                fill="#021C1B"
              />

              {/* Front Crisp Peaks */}
              <polygon
                points="0,320 0,260 50,180 150,320"
                fill="#011211"
              />
              <polygon
                points="1140,320 1260,200 1360,110 1440,180 1440,320"
                fill="#011413"
              />
              <polygon
                points="1280,320 1380,190 1440,250 1440,320"
                fill="#000E0D"
              />
            </>
          ) : (
            /* Light Mode Mountains (Original Reference Colors) */
            <>
              {/* Back Mountain Layer (#004643) */}
              <polygon
                points="0,320 0,160 80,190 200,120 320,240 450,150 560,320"
                fill="#004643"
              />
              <polygon
                points="880,320 1020,180 1140,240 1260,110 1380,210 1440,150 1440,320"
                fill="#004643"
              />

              {/* Foreground Sharp Angular Peaks (#00312F & #002523) */}
              <polygon
                points="0,320 0,220 60,130 150,250 170,220 280,320"
                fill="#00312F"
              />
              <polygon
                points="140,320 240,210 330,320"
                fill="#00312F"
              />
              <polygon
                points="0,320 0,260 50,180 150,320"
                fill="#002523"
              />
              <polygon
                points="920,320 1080,130 1220,320"
                fill="#00312F"
              />
              <polygon
                points="1140,320 1260,200 1360,110 1440,180 1440,320"
                fill="#002B29"
              />
              <polygon
                points="1280,320 1380,190 1440,250 1440,320"
                fill="#002120"
              />
            </>
          )}
        </svg>
      </div>
    </div>
  );
}
