import React from 'react';
import { Sparkles, Sun, Moon, Bell, Timer, User, ShieldAlert } from 'lucide-react';
import { Energy4D } from '../types';

interface NavbarProps {
  activeTab: 'timeline' | 'bio-energy' | 'burnout' | 'timetable-grid' | 'sdt-tracker' | 'coach-chat' | 'wireframe';
  setActiveTab: (tab: 'timeline' | 'bio-energy' | 'burnout' | 'timetable-grid' | 'sdt-tracker' | 'coach-chat' | 'wireframe') => void;
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  onOpenFocusModal: () => void;
  onOpenOnboarding: () => void;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
  user: { name: string; avatar: string; gradeLevel: string } | null;
  energy: Energy4D;
  onTriggerRedAlert: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  onOpenFocusModal,
  onOpenOnboarding,
  onOpenProfile,
  onOpenAuth,
  user,
  energy,
  onTriggerRedAlert,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 py-3">
        {/* Zone 1: Wordmark & Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('timeline')}
            className="flex items-center gap-2.5 text-left cursor-pointer group"
            aria-label="Về trang chủ BANIPU - EduEnergy AI"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-lg">⚡</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white font-display whitespace-nowrap">
                  EduEnergy AI
                </span>
              </div>
              <div className="text-3xs font-bold text-indigo-600 dark:text-indigo-400 -mt-0.5">
                v2.4 SDT Pro · BANIPU
              </div>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden 2xl:flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer ${
              activeTab === 'timeline'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setActiveTab('burnout')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer ${
              activeTab === 'burnout'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Dự Báo Kiệt Sức
          </button>
          <button
            onClick={() => setActiveTab('bio-energy')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer ${
              activeTab === 'bio-energy'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Pin Năng Lượng 4D
          </button>
          <button
            onClick={() => setActiveTab('timetable-grid')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer ${
              activeTab === 'timetable-grid'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Thời Khóa Biểu
          </button>
          <button
            onClick={() => setActiveTab('sdt-tracker')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer ${
              activeTab === 'sdt-tracker'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Động Lực SDT
          </button>
          <button
            onClick={() => setActiveTab('coach-chat')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'coach-chat'
                ? 'text-teal-600 dark:text-teal-400 font-bold border-b-2 border-teal-600 dark:border-teal-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>🌱</span>
            <span>banipu AI Coach</span>
          </button>
        </nav>

        {/* Zone 3: Quick Mood + Notification + Profile + Focus Space */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Quick Mood Pills (Matches Screenshot 1 & 2) */}
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <span className="hidden sm:inline text-3xs text-slate-400 font-bold uppercase tracking-wider">
              Quick Mood:
            </span>
            <button
              onClick={() => setActiveTab('bio-energy')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-xs text-xs transition-all cursor-pointer"
            >
              <span>🔋</span>
              <span className="hidden sm:inline">Trạng thái Tối ưu</span>
              <span>(85%)</span>
            </button>
            <button
              onClick={onTriggerRedAlert}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-500/50 bg-rose-950/20 hover:bg-rose-950/40 text-rose-500 dark:text-rose-400 font-semibold text-xs transition-all cursor-pointer"
              title="Kích hoạt chế độ Cấp cứu kiệt sức"
            >
              <span>🪫</span>
              <span className="hidden md:inline">Mệt mỏi / Căng thẳng</span>
              <span>(35%)</span>
            </button>
          </div>

          {/* Dark Mode toggle */}
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Đổi giao diện sáng/tối"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Notification Bell with Badge */}
          <button
            onClick={() => setActiveTab('burnout')}
            className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Thông báo AI: Dự báo kiệt sức Thứ 6"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center animate-pulse">
              1
            </span>
          </button>

          {/* User Profile Pill with Green Online Dot */}
          {user ? (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2.5 p-1 pl-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-2xl border border-slate-200 dark:border-slate-700 transition-all cursor-pointer text-left"
              title="Mở hồ sơ học sinh"
            >
              <div className="hidden sm:block text-right">
                <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {user.name}
                </div>
                <div className="text-3xs text-slate-500 dark:text-slate-400 leading-none">
                  {user.gradeLevel}
                </div>
              </div>
              <div className="relative">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-lg">
                  {user.avatar}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full"></span>
              </div>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 rounded-xl cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>Đăng Nhập</span>
            </button>
          )}

          {/* Không Gian Tập Trung CTA */}
          <button
            onClick={onOpenFocusModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-xl shadow-xs shadow-indigo-500/25 transition-all cursor-pointer"
          >
            <Timer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Không Gian Tập Trung</span>
          </button>
        </div>
      </div>

      {/* Sub-nav row for mobile & tablet screens */}
      <div className="flex xl:hidden overflow-x-auto px-4 py-2 border-t border-slate-200 dark:border-slate-800 gap-3 text-xs font-semibold text-slate-600 dark:text-slate-400 scrollbar-none">
        <button
          onClick={() => setActiveTab('timeline')}
          className={`whitespace-nowrap shrink-0 pb-1 ${activeTab === 'timeline' ? 'text-indigo-600 dark:text-indigo-400 font-bold border-b-2 border-indigo-600' : ''}`}
        >
          Timeline
        </button>
        <button
          onClick={() => setActiveTab('bio-energy')}
          className={`whitespace-nowrap shrink-0 pb-1 ${activeTab === 'bio-energy' ? 'text-indigo-600 dark:text-indigo-400 font-bold border-b-2 border-indigo-600' : ''}`}
        >
          Pin Năng Lượng 4D
        </button>
        <button
          onClick={() => setActiveTab('burnout')}
          className={`whitespace-nowrap shrink-0 pb-1 ${activeTab === 'burnout' ? 'text-indigo-600 dark:text-indigo-400 font-bold border-b-2 border-indigo-600' : ''}`}
        >
          Dự Báo Kiệt Sức
        </button>
        <button
          onClick={() => setActiveTab('timetable-grid')}
          className={`whitespace-nowrap shrink-0 pb-1 ${activeTab === 'timetable-grid' ? 'text-indigo-600 dark:text-indigo-400 font-bold border-b-2 border-indigo-600' : ''}`}
        >
          Thời Khóa Biểu
        </button>
        <button
          onClick={() => setActiveTab('sdt-tracker')}
          className={`whitespace-nowrap shrink-0 pb-1 ${activeTab === 'sdt-tracker' ? 'text-indigo-600 dark:text-indigo-400 font-bold border-b-2 border-indigo-600' : ''}`}
        >
          Động Lực SDT
        </button>
        <button
          onClick={() => setActiveTab('coach-chat')}
          className={`whitespace-nowrap shrink-0 pb-1 ${activeTab === 'coach-chat' ? 'text-teal-600 dark:text-teal-400 font-bold border-b-2 border-teal-600' : ''}`}
        >
          🌱 banipu Coach
        </button>
      </div>
    </header>
  );
};
