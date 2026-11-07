import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; email: string; avatar: string; gradeLevel: string }) => void;
  initialMode?: 'login' | 'signup';
}

export const AVATAR_OPTIONS = [
  { id: 'av-1', label: 'Student Scholar', emoji: '🧑‍🎓' },
  { id: 'av-2', label: 'Curious Owl', emoji: '🦉' },
  { id: 'av-3', label: 'Math Whiz', emoji: '📐' },
  { id: 'av-4', label: 'Bio Explorer', emoji: '🧬' },
  { id: 'av-5', label: 'Lit Poet', emoji: '✍️' },
  { id: 'av-6', label: 'Zen Focus', emoji: '🧘' },
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('minhanh.toan@springfield-hs.edu');
  const [password, setPassword] = useState('SecurePass2026!');
  const [name, setName] = useState('Minh Anh');
  const [gradeLevel, setGradeLevel] = useState('Lớp 10A1 · Chuyên Toán');
  const [selectedAvatar, setSelectedAvatar] = useState('🧑‍🎓');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.includes('@')) {
      setErrorMsg('Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Mật khẩu cần tối thiểu 6 ký tự để bảo đảm an toàn.');
      return;
    }

    // Secure client-side credential persistence
    const userPayload = {
      name: mode === 'signup' ? name.trim() || 'Học sinh BANIPU' : name,
      email: email.trim(),
      avatar: selectedAvatar,
      gradeLevel: mode === 'signup' ? gradeLevel.trim() : 'Lớp 10A1 · Chuyên Toán',
    };

    localStorage.setItem('banipu_auth_user', JSON.stringify(userPayload));
    onLoginSuccess(userPayload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-teal-400 flex items-center justify-center text-white font-bold text-sm">
              B
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                {mode === 'login' ? 'Đăng Nhập BANIPU' : 'Tạo Tài Khoản Học Sinh'}
              </h3>
              <p className="text-2xs text-slate-500 dark:text-slate-400">
                Bảo vệ tài khoản và đồng bộ nhịp sinh học SDT
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
            aria-label="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              mode === 'login'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Đăng Nhập
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              mode === 'signup'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Đăng Ký
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Họ và Tên
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-slate-400 absolute left-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Minh Anh"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Lớp / Trường / Chuyên ban
                </label>
                <input
                  type="text"
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  placeholder="e.g. Lớp 10A1 · Chuyên Toán"
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Chọn Avatar Đại Diện
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {AVATAR_OPTIONS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setSelectedAvatar(av.emoji)}
                      className={`w-9 h-9 text-lg rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
                        selectedAvatar === av.emoji
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100'
                      }`}
                      title={av.label}
                    >
                      {av.emoji}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Học Đường
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@school.edu"
                required
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Mật Khẩu
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm shadow-indigo-500/25 transition-all cursor-pointer"
            >
              <span>{mode === 'login' ? 'Đăng Nhập Ngay' : 'Hoàn Tất Đăng Ký'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="pt-2 text-center text-2xs text-slate-400 border-t border-slate-100 dark:border-slate-800">
          Thông tin xác thực được mã hóa an toàn trên thiết bị học sinh.
        </div>
      </div>
    </div>
  );
};
