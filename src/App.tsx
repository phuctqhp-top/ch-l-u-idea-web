import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { TimelineView } from './components/TimelineView';
import { BioCoreGauge } from './components/BioCoreGauge';
import { EnergyBattery4D } from './components/EnergyBattery4D';
import { BurnoutPredictorChart } from './components/BurnoutPredictorChart';
import { SchoolTimetableGrid } from './components/SchoolTimetableGrid';
import { SdtMotivationTracker } from './components/SdtMotivationTracker';
import { AiEnergyCompanion } from './components/AiEnergyCompanion';
import { NaturalLanguageInput } from './components/NaturalLanguageInput';
import { FocusModal } from './components/FocusModal';
import { OnboardingModal } from './components/OnboardingModal';
import { QuickAddModal } from './components/QuickAddModal';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { WireframeView } from './components/WireframeModal';
import {
  INITIAL_SUBJECTS,
  INITIAL_CLASSES,
  INITIAL_EXAMS,
  INITIAL_TIMELINE_BLOCKS,
  INITIAL_MICRO_WINS,
  INITIAL_USER_PROFILE,
  INITIAL_ENERGY_4D,
  INITIAL_BURNOUT_PREDICTIONS,
  INITIAL_TIMETABLE_GRID,
  INITIAL_SDT_GOALS,
} from './utils/mockData';
import { TimelineBlock, MicroWin, UserProfile, Energy4D, BurnoutDataPoint, TimetableGridRow, SdtGoalItem } from './types';
import { minutesToTimeString, timeStringToMinutes } from './utils/sdtEngine';
import { Trophy, AlertTriangle, ShieldCheck, Heart, Sparkles, Wind } from 'lucide-react';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [activeTab, setActiveTab] = useState<
    'timeline' | 'bio-energy' | 'burnout' | 'timetable-grid' | 'sdt-tracker' | 'coach-chat' | 'wireframe'
  >('timeline');

  // Authentication & Profile state
  const [user, setUser] = useState<{ name: string; avatar: string; gradeLevel: string } | null>(() => {
    const saved = localStorage.getItem('banipu_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      name: 'Minh Anh',
      avatar: '🧑‍🎓',
      gradeLevel: 'Lớp 10A1 · Chuyên Toán',
    };
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Core App Data
  const [selectedDate, setSelectedDate] = useState('2026-11-07');
  const [subjects, setSubjects] = useState(INITIAL_SUBJECTS);
  const [blocks, setBlocks] = useState<TimelineBlock[]>(INITIAL_TIMELINE_BLOCKS);
  const [microWins, setMicroWins] = useState<MicroWin[]>(INITIAL_MICRO_WINS);
  const [profile, setProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [energy4D, setEnergy4D] = useState<Energy4D>(INITIAL_ENERGY_4D);
  const [burnoutData, setBurnoutData] = useState<BurnoutDataPoint[]>(INITIAL_BURNOUT_PREDICTIONS);
  const [timetableGrid, setTimetableGrid] = useState<TimetableGridRow[]>(INITIAL_TIMETABLE_GRID);
  const [sdtGoals, setSdtGoals] = useState<SdtGoalItem[]>(INITIAL_SDT_GOALS);

  // Modals
  const [isFocusModalOpen, setIsFocusModalOpen] = useState(false);
  const [focusBlock, setFocusBlock] = useState<TimelineBlock | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [redAlertModalOpen, setRedAlertModalOpen] = useState(false);
  const [celebrationToast, setCelebrationToast] = useState<{ title: string; subtitle: string } | null>(null);

  // Dark mode class sync
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Support ?autostart=1 or ?tab=
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['timeline', 'bio-energy', 'burnout', 'timetable-grid', 'sdt-tracker', 'coach-chat', 'wireframe'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
    if (params.get('onboarding') === '1') {
      setIsOnboardingOpen(true);
    }
  }, []);

  const triggerCelebration = (title: string, subtitle: string) => {
    setCelebrationToast({ title, subtitle });
    setTimeout(() => {
      setCelebrationToast(null);
    }, 4000);
  };

  // Toggle timeline block completion
  const handleToggleBlockComplete = (id: string) => {
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const willBeCompleted = !b.completed;
          if (willBeCompleted) {
            const newWin: MicroWin = {
              id: `mw-${Date.now()}`,
              title: `Hoàn thành: ${b.title}`,
              category: b.type === 'rest' ? 'balance' : 'focus',
              timestamp: minutesToTimeString(new Date().getHours() * 60 + new Date().getMinutes()),
              reflection: 'Duy trì năng lượng chủ động và kỷ niệm vi thành tựu.',
            };
            setMicroWins((w) => [newWin, ...w]);
            triggerCelebration(
              'Vi Thành Tựu Xuất Sắc! 🎉',
              `Chúc mừng bạn đã hoàn tất "${b.title}". +10 Điểm Năng Lực SDT!`
            );
          }
          return { ...b, completed: willBeCompleted };
        }
        return b;
      })
    );
  };

  // Toggle micro-task inside a block
  const handleToggleMicroTask = (blockId: string, microTaskId: string) => {
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id === blockId && b.microTasks) {
          const updated = b.microTasks.map((t) =>
            t.id === microTaskId ? { ...t, completed: !t.completed } : t
          );
          return { ...b, microTasks: updated };
        }
        return b;
      })
    );
  };

  // Reschedule block with time delta
  const handleRescheduleBlock = (id: string, deltaMinutes: number) => {
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const startM = Math.max(0, timeStringToMinutes(b.startTime) + deltaMinutes);
          const endM = Math.max(startM + 15, timeStringToMinutes(b.endTime) + deltaMinutes);
          return {
            ...b,
            startTime: minutesToTimeString(startM),
            endTime: minutesToTimeString(endM),
          };
        }
        return b;
      })
    );
    triggerCelebration('Đã Điều Chỉnh Giờ!', `Dời lịch học ${deltaMinutes > 0 ? '+' : ''}${deltaMinutes} phút thành công.`);
  };

  // Drag and drop reordering
  const handleReorderBlocks = (draggedId: string, targetId: string) => {
    setBlocks((prev) => {
      const draggedIndex = prev.findIndex((b) => b.id === draggedId);
      const targetIndex = prev.findIndex((b) => b.id === targetId);
      if (draggedIndex === -1 || targetIndex === -1) return prev;

      const newBlocks = [...prev];
      const [draggedItem] = newBlocks.splice(draggedIndex, 1);
      newBlocks.splice(targetIndex, 0, draggedItem);

      // Re-assign start and end times smoothly
      let currentMinutes = 8 * 60 + 30; // 08:30
      return newBlocks.map((item) => {
        const duration = item.durationMinutes || 45;
        const startStr = minutesToTimeString(currentMinutes);
        currentMinutes += duration;
        const endStr = minutesToTimeString(currentMinutes);
        currentMinutes += 15; // 15 min buffer between tasks
        return {
          ...item,
          startTime: startStr,
          endTime: endStr,
        };
      });
    });

    triggerCelebration(
      'Hoán Đổi Lịch Học Bằng Kéo Thả! 🔄',
      'Đã sắp xếp lại thứ tự ưu tiên và cập nhật vạch thời gian tự động.'
    );
  };

  // AI Rebalance button handler
  const handleAutoRebalance = () => {
    // Alleviate the Thursday/Friday burnout peak
    setBurnoutData((prev) =>
      prev.map((d) => {
        if (d.day.includes('Thứ 6')) {
          return { ...d, studyLoad: 65, energyBattery: 78 };
        }
        return d;
      })
    );
    setEnergy4D((prev) => ({
      ...prev,
      overall: 88,
      mental: 85,
      studyLoad: 55,
      statusText: 'Cân Bằng Hoàn Hảo (88%)',
    }));
    triggerCelebration(
      'AI Re-balance Thành Công! ✨',
      'Đã phân bổ lại bài tập Thứ 6 sang cuối tuần. Chỉ số độ bền học tập tăng lên An Toàn 92%!'
    );
  };

  // Toggle personal SDT goal
  const handleToggleGoal = (id: string) => {
    setSdtGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const newStatus = g.status === 'done' ? 'doing' : 'done';
          if (newStatus === 'done') {
            triggerCelebration(
              'Mục Tiêu SDT Hoàn Thành!',
              `Chúc mừng bạn đã chinh phục "${g.title}". +${g.xpGain} XP Competence!`
            );
          }
          return { ...g, status: newStatus };
        }
        return g;
      })
    );
  };

  const handleOpenFocusDefault = () => {
    const nextStudyBlock =
      blocks.find((b) => b.date === selectedDate && !b.completed && b.type !== 'rest') ||
      blocks[0];
    setFocusBlock(nextStudyBlock || null);
    setIsFocusModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col transition-colors selection:bg-indigo-100 dark:selection:bg-indigo-950 selection:text-indigo-900 dark:selection:text-indigo-200">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenFocusModal={handleOpenFocusDefault}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        user={user}
        energy={energy4D}
        onTriggerRedAlert={() => setRedAlertModalOpen(true)}
      />

      {/* Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Student Welcome Banner (shown on timeline and main tabs) */}
        {activeTab !== 'burnout' && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-teal-400 p-0.5 shadow-sm shadow-indigo-500/20 shrink-0">
                <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center text-2xl">
                  {user?.avatar || '🧑‍🎓'}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white font-display">
                    {user?.name || 'Minh Anh'}
                  </h2>
                  <span className="text-slate-300 dark:text-slate-600">·</span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {user?.gradeLevel || 'Lớp 10A1 · Chuyên Toán'}
                  </span>
                  <span className="text-2xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {profile.chosenPlan === 'spaced-harmony'
                      ? 'Kế Hoạch Beta (Nhịp Điệu Cách Quãng)'
                      : 'Kế Hoạch Alpha (Tập Trung Sâu)'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 italic mt-0.5">
                  "{profile.intrinsicMotto}"
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setActiveTab('bio-energy')}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                Xem Pin 4D ({energy4D.overall}%)
              </button>
              <button
                onClick={() => setActiveTab('burnout')}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 transition-colors cursor-pointer"
              >
                Radar Kiệt Sức
              </button>
              <button
                onClick={() => setIsOnboardingOpen(true)}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition-colors cursor-pointer"
              >
                Khảo Sát SDT
              </button>
            </div>
          </div>
        )}

        {/* View Switching */}

        {/* 1. Timeline & Nhiệm Vụ (Default Dashboard with Drag-and-Drop) */}
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <TimelineView
              blocks={blocks}
              subjects={subjects}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              onToggleBlockComplete={handleToggleBlockComplete}
              onToggleMicroTask={handleToggleMicroTask}
              onRescheduleBlock={handleRescheduleBlock}
              onReorderBlocks={handleReorderBlocks}
              onOpenFocusModalWithBlock={(b) => {
                setFocusBlock(b);
                setIsFocusModalOpen(true);
              }}
              onOpenQuickAdd={() => setIsQuickAddOpen(true)}
              onTriggerBreathingReset={() => setRedAlertModalOpen(true)}
            />

            {/* Quick Natural Language Assistant below Timeline */}
            <div className="pt-2">
              <NaturalLanguageInput
                onAddBlocks={(newBlocks) => {
                  setBlocks((prev) => [...prev, ...newBlocks]);
                  triggerCelebration('Đã Thêm Lịch Học!', `Thêm ${newBlocks.length} ca học tự chủ vào ngày.`);
                }}
                selectedDate={selectedDate}
              />
            </div>
          </div>
        )}

        {/* 2. Pin Năng Lượng 4D & 360° Bio-Core Gauge (Images 2, 3, 4) */}
        {activeTab === 'bio-energy' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <BioCoreGauge
                energy={energy4D}
                onEnergyChange={setEnergy4D}
                onTriggerRedAlert={() => setRedAlertModalOpen(true)}
              />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <EnergyBattery4D
                energy={energy4D}
                onRebalance={handleAutoRebalance}
              />
              <SdtMotivationTracker
                goals={sdtGoals}
                onToggleGoal={handleToggleGoal}
              />
            </div>
          </div>
        )}

        {/* 3. Dự Báo Kiệt Sức & Xu Hướng Năng Lượng Tuần (Image 1 / Screenshot) */}
        {activeTab === 'burnout' && (
          <div className="space-y-6">
            {/* Top Row: Task item card & AI Tutor motivational card matching screenshot */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Column: Scheduled Task Card */}
              <div className="lg:col-span-7 bg-[#111827] dark:bg-[#0b1120] border border-slate-800 rounded-3xl p-5 sm:p-6 text-slate-200 flex flex-col justify-between shadow-lg">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded-md border-slate-600 text-indigo-600 focus:ring-indigo-500 cursor-pointer bg-slate-800"
                        defaultChecked={false}
                      />
                      <h4 className="text-sm sm:text-base font-bold text-white font-display">
                        Đọc tóm tắt chương Lịch Sử lớp 10
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-2xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-950/70 text-indigo-300 border border-indigo-700/50">
                        Low Energy
                      </span>
                      <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                        ⏱ 20 phút
                      </span>
                      <span className="text-xs text-amber-400 font-semibold bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded-md">
                        Chờ thực hiện
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 pl-8">
                    Thích hợp đọc thư giãn trước khi đi ngủ (21:30).
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 pt-4 mt-3 border-t border-slate-800 text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <span className="text-amber-400">💡</span> Mẹo AI: Bạn đã hoàn thành 1/3 micro-tasks hôm nay.
                  </span>
                  <button
                    onClick={() => setIsQuickAddOpen(true)}
                    className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors cursor-pointer"
                  >
                    + Thêm nhiệm vụ mới
                  </button>
                </div>
              </div>

              {/* Right Column: AI Tutor Motivation Card */}
              <div className="lg:col-span-5 bg-[#111827] dark:bg-[#0b1120] border border-slate-800 rounded-3xl p-5 sm:p-6 text-slate-200 flex flex-col justify-between shadow-lg">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                      AI
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-white font-display">
                      Nhận xét Động Lực từ AI Tutor Đồng Hành:
                    </h4>
                  </div>
                  <blockquote className="text-xs sm:text-sm text-slate-300 italic leading-relaxed pl-1 border-l-2 border-indigo-500/40 ml-1 pl-2.5">
                    "Minh Anh ơi, hôm nay bạn đã hoàn thành xuất sắc 1 bài Tiếng Anh trong lúc thể chất rất dồi dào. Nếu thấy Toán hơi khó, nhớ rằng sai sót là bước đệm tự nhiên của ZPD nhé! Bạn hoàn toàn có quyền nghỉ 15 phút trước khi tiếp tục."
                  </blockquote>
                </div>

                <div className="flex items-center justify-between gap-2 pt-4 mt-3 border-t border-slate-800 text-2xs text-slate-400">
                  <span>Khung lý thuyết SDT: Competence & Autonomy</span>
                  <button
                    onClick={() => setActiveTab('coach-chat')}
                    className="text-teal-400 hover:text-teal-300 font-bold transition-colors cursor-pointer"
                  >
                    Trò chuyện với AI →
                  </button>
                </div>
              </div>
            </div>

            {/* Red highlighted box: Burnout Predictor SVG Chart */}
            <BurnoutPredictorChart
              data={burnoutData}
              onAutoRebalance={handleAutoRebalance}
            />

            {/* Supplementary 4D Battery & Companion */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <EnergyBattery4D
                energy={energy4D}
                onRebalance={handleAutoRebalance}
              />
              <AiEnergyCompanion
                energy={energy4D}
                userName={user?.name || 'Minh Anh'}
                blocks={blocks}
                onUpdateBlocks={setBlocks}
                selectedDate={selectedDate}
                onShowToast={triggerCelebration}
                onOpenFocusModal={handleOpenFocusDefault}
              />
            </div>
          </div>
        )}

        {/* 4. Thời Khóa Biểu Bán Trú Học Đường (Image 6 & 4) */}
        {activeTab === 'timetable-grid' && (
          <div className="space-y-6">
            <SchoolTimetableGrid
              gridData={timetableGrid}
              onUpdateGrid={setTimetableGrid}
            />
            <SdtMotivationTracker
              goals={sdtGoals}
              onToggleGoal={handleToggleGoal}
            />
          </div>
        )}

        {/* 5. Động Lực Tự Thân (SDT) & Bảng Mục Tiêu Cá Nhân Hoá */}
        {activeTab === 'sdt-tracker' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <SdtMotivationTracker
                goals={sdtGoals}
                onToggleGoal={handleToggleGoal}
              />
              <BurnoutPredictorChart
                data={burnoutData}
                onAutoRebalance={handleAutoRebalance}
              />
            </div>
            <div className="lg:col-span-1">
              <AiEnergyCompanion
                energy={energy4D}
                userName={user?.name || 'Minh Anh'}
                blocks={blocks}
                onUpdateBlocks={setBlocks}
                selectedDate={selectedDate}
                onShowToast={triggerCelebration}
                onOpenFocusModal={handleOpenFocusDefault}
              />
            </div>
          </div>
        )}

        {/* 6. AI Companion & Micro-Dose Coaching (Image 7) */}
        {activeTab === 'coach-chat' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AiEnergyCompanion
              energy={energy4D}
              userName={user?.name || 'Minh Anh'}
              blocks={blocks}
              onUpdateBlocks={setBlocks}
              selectedDate={selectedDate}
              onShowToast={triggerCelebration}
              onOpenFocusModal={handleOpenFocusDefault}
            />
            <BioCoreGauge
              energy={energy4D}
              onEnergyChange={setEnergy4D}
              onTriggerRedAlert={() => setRedAlertModalOpen(true)}
            />
          </div>
        )}

        {/* 7. Architecture & Wireframes Blueprint */}
        {activeTab === 'wireframe' && <WireframeView />}
      </main>

      {/* Floating Micro-Win Toast */}
      {celebrationToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm p-4 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 rounded-2xl shadow-xl flex items-start gap-3 animate-slide-up">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h5 className="text-xs font-bold text-slate-900 dark:text-white">
              {celebrationToast.title}
            </h5>
            <p className="text-2xs text-slate-600 dark:text-slate-400 mt-0.5">
              {celebrationToast.subtitle}
            </p>
          </div>
        </div>
      )}

      {/* Focus Timer Modal */}
      <FocusModal
        block={focusBlock}
        isOpen={isFocusModalOpen}
        onClose={() => setIsFocusModalOpen(false)}
        onCompleteBlock={(id) => {
          handleToggleBlockComplete(id);
          setIsFocusModalOpen(false);
        }}
        onToggleMicroTask={handleToggleMicroTask}
      />

      {/* Onboarding Flow Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        profile={profile}
        onSaveProfile={(updated) => {
          setProfile(updated);
          triggerCelebration('Kế Hoạch Tự Chủ Đã Lưu!', 'Lộ trình học tập SDT đã được cập nhật.');
        }}
      />

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        subjects={subjects}
        selectedDate={selectedDate}
        onAddBlock={(block) => {
          setBlocks((prev) => [...prev, block]);
          triggerCelebration('Đã Thêm Ca Học!', `"${block.title}" đã được xếp vào lịch.`);
        }}
      />

      {/* Auth Modal (Signup / Login) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(loggedInUser) => {
          setUser(loggedInUser);
          triggerCelebration('Đăng Nhập Thành Công!', `Chào mừng ${loggedInUser.name} trở lại với BANIPU.`);
        }}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        userAvatar={user?.avatar || '🧑‍🎓'}
        onUpdateProfile={(updated) => {
          setUser((prev) => ({
            name: updated.name,
            gradeLevel: updated.gradeLevel,
            avatar: updated.avatar,
          }));
          localStorage.setItem('banipu_auth_user', JSON.stringify({
            name: updated.name,
            gradeLevel: updated.gradeLevel,
            avatar: updated.avatar,
          }));
          triggerCelebration('Đã Cập Nhật Hồ Sơ!', 'Tên và Avatar học sinh đã được lưu.');
        }}
        onLogout={() => {
          localStorage.removeItem('banipu_auth_user');
          setUser(null);
          setIsProfileModalOpen(false);
          triggerCelebration('Đã Đăng Xuất', 'Hẹn gặp lại bạn trong buổi học tiếp theo!');
        }}
      />

      {/* Red Alert: Cấp Cứu Kiệt Sức Modal */}
      {redAlertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border-2 border-rose-300 dark:border-rose-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center text-3xl mx-auto shadow-md">
              🚨
            </div>
            <div>
              <span className="text-2xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                CHẾ ĐỘ CẤP CỨU KIỆT SỨC (EMERGENCY DECOMPRESSION)
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display mt-1">
                Dừng Mọi Áp Lực. Não Bộ Cần 15 Phút Xả Tải!
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Khi chỉ số căng thẳng vượt ngưỡng, việc tiếp tục học sẽ gây ức chế thần kinh và giảm 70% khả năng ghi nhớ. Bạn có quyền nghỉ ngơi hoàn toàn không cảm giác tội lỗi.
              </p>
            </div>

            {/* Quick 3 Emergency Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-left pt-2">
              <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800">
                <span className="font-bold text-teal-700 dark:text-teal-300">1. Thở 4-7-8</span>
                <p className="text-2xs text-slate-500 mt-1">3 chu kỳ làm dịu dây thần kinh phế vị.</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                <span className="font-bold text-blue-700 dark:text-blue-300">2. Tắt màn hình</span>
                <p className="text-2xs text-slate-500 mt-1">Đứng dậy, uống 200ml nước ấm.</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
                <span className="font-bold text-purple-700 dark:text-purple-300">3. Dời lịch tự động</span>
                <p className="text-2xs text-slate-500 mt-1">AI dời ca học dồn sang ngày mai.</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-3">
              <button
                onClick={() => {
                  handleAutoRebalance();
                  setRedAlertModalOpen(false);
                }}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                Kích Hoạt AI Giảm Tải Ngay
              </button>
              <button
                onClick={() => setRedAlertModalOpen(false)}
                className="px-4 py-2.5 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer matching screenshot */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">EduEnergy AI</span>
            <span>•</span>
            <span>Đề tài NCKH THPT 2026</span>
            <span>•</span>
            <span>Thuyết Tự Quyết (SDT Framework)</span>
          </div>

          <div className="flex items-center gap-4 text-2xs">
            <button
              onClick={() => setActiveTab('wireframe')}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer"
            >
              Thiết kế UI/UX Dashboard
            </button>
            <span aria-hidden="true">•</span>
            <button
              onClick={() => {
                triggerCelebration('Tải Về Thành Công!', 'Đã xuất file tóm tắt tiến độ PDF & Prototype Figma sang máy học sinh.');
              }}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Tải về bản PDF & Prototype
            </button>
            <span aria-hidden="true">•</span>
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Khảo Sát Tự Chủ
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
