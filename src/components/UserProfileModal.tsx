import React, { useState } from 'react';
import { X, LogOut, CheckCircle2, User, Sparkles } from 'lucide-react';
import { AVATAR_OPTIONS } from './AuthModal';
import { UserProfile } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  userAvatar: string;
  onUpdateProfile: (updated: { name: string; gradeLevel: string; avatar: string }) => void;
  onLogout: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  userAvatar,
  onUpdateProfile,
  onLogout,
}) => {
  const [name, setName] = useState(profile.name);
  const [gradeLevel, setGradeLevel] = useState(profile.gradeLevel);
  const [avatar, setAvatar] = useState(userAvatar);
  const [savedToast, setSavedToast] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ name: name.trim(), gradeLevel: gradeLevel.trim(), avatar });
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{avatar}</span>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Hồ Sơ Học Sinh
              </h3>
              <p className="text-2xs text-slate-500">Minh Anh · Quản lý danh tính & Avatar</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {savedToast && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs font-semibold text-emerald-800 dark:text-emerald-300 text-center">
            ✓ Đã cập nhật thông tin thành công!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Họ và Tên
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Lớp / Chuyên ban
            </label>
            <input
              type="text"
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium"
            />
          </div>

          {/* Avatar selector */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Chọn Avatar Yêu Thích
            </label>
            <div className="grid grid-cols-6 gap-2">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => setAvatar(av.emoji)}
                  className={`w-11 h-11 text-xl rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
                    avatar === av.emoji
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 ring-2 ring-indigo-500/20 scale-105'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100'
                  }`}
                  title={av.label}
                >
                  {av.emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng Xuất</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Lưu Thay Đổi
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
