import React, { useState } from 'react';
import { Sparkles, Trophy, Compass, Heart, CheckCircle2, Clock } from 'lucide-react';
import { SdtGoalItem } from '../types';

interface SdtMotivationTrackerProps {
  goals: SdtGoalItem[];
  onToggleGoal: (id: string) => void;
}

export const SdtMotivationTracker: React.FC<SdtMotivationTrackerProps> = ({
  goals,
  onToggleGoal,
}) => {
  const [goalView, setGoalView] = useState<'day' | 'week' | 'phase'>('day');

  return (
    <div className="space-y-6">
      {/* SDT Motivation Tracker Strip */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              🌱
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Góc Bảo Tồn Động Lực (SDT Motivation Tracker)
              </h3>
              <p className="text-2xs text-slate-500">
                Thuyết Tự Quyết (Deci & Ryan) · Tự Chủ - Năng Lực - Gắn Kết
              </p>
            </div>
          </div>
          <span className="text-2xs px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
            Chuẩn Sư Phạm NCKH
          </span>
        </div>

        {/* 3 SDT Pillars */}
        <div className="space-y-3.5">
          {/* Autonomy */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>Autonomy (Tính Tự Chủ)</span>
              </span>
              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">85%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="bg-emerald-500 h-2 rounded-full w-[85%] transition-all duration-700"></div>
            </div>
            <p className="text-2xs text-slate-500 dark:text-slate-400">
              Bạn tự quyết định 82% lịch học tuần này mà không cần ai thúc ép hay nhắc nhở.
            </p>
          </div>

          {/* Competence */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" />
                <span>Competence (Cảm Giác Năng Lực - ZPD)</span>
              </span>
              <span className="font-mono font-bold text-blue-700 dark:text-blue-400">74%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="bg-blue-500 h-2 rounded-full w-[74%] transition-all duration-700"></div>
            </div>
            <p className="text-2xs text-slate-500 dark:text-slate-400">
              Vùng phát triển gần ZPD: Đã làm chủ Dạng toán 2, đang nhẹ nhàng chinh phục Dạng 3.
            </p>
          </div>

          {/* Relatedness */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-purple-700 dark:text-purple-400 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5" />
                <span>Relatedness (Sự Gắn Kết Đồng Hành)</span>
              </span>
              <span className="font-mono font-bold text-purple-700 dark:text-purple-400">88%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="bg-purple-500 h-2 rounded-full w-[88%] transition-all duration-700"></div>
            </div>
            <p className="text-2xs text-slate-500 dark:text-slate-400">
              Đã chia sẻ 3 tiến bộ tuần này với Smart Study Group và nhận phản hồi tương trợ.
            </p>
          </div>
        </div>

        {/* Motivational Callout */}
        <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800/60 text-xs text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Bạn hoàn toàn quyền chủ động tự hoán đổi thời gian học tập hôm nay. <strong>Chủ động = Bền vững!</strong></span>
        </div>
      </div>

      {/* Bảng Mục Tiêu Cá Nhân Hoá (Thuyết Tự Quyết - SDT) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display">
              Bảng Mục Tiêu Cá Nhân Hoá (Thuyết Tự Quyết – SDT)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Phân rã mục tiêu lớn thành các nhiệm vụ vi mô (Micro-tasks) vừa sức
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setGoalView('day')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                goalView === 'day'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Mục Tiêu Ngày
            </button>
            <button
              onClick={() => setGoalView('week')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                goalView === 'week'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Mục Tiêu Tuần
            </button>
            <button
              onClick={() => setGoalView('phase')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                goalView === 'phase'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Mục Tiêu Giai Đoạn
            </button>
          </div>
        </div>

        {/* 3 Pillar Goal Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {goals.map((g) => {
            const isCompetence = g.pillar === 'competence';
            const isAutonomy = g.pillar === 'autonomy';
            const isRelatedness = g.pillar === 'relatedness';

            return (
              <div
                key={g.id}
                className={`p-5 rounded-2xl border space-y-3 flex flex-col justify-between ${
                  g.status === 'done'
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                    : g.status === 'doing'
                    ? 'bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800/60'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-2xs font-bold uppercase tracking-wider">
                    <span
                      className={`px-2 py-0.5 rounded-md ${
                        isCompetence
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          : isAutonomy
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                      }`}
                    >
                      {isCompetence && 'Competence (Năng lực ZPD)'}
                      {isAutonomy && 'Autonomy (Tự chủ)'}
                      {isRelatedness && 'Relatedness (Gắn kết)'}
                    </span>

                    <span
                      className={`text-2xs font-semibold ${
                        g.status === 'done'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : g.status === 'doing'
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {g.status === 'done' && '✓ Xong'}
                      {g.status === 'doing' && 'Đang làm'}
                      {g.status === 'todo' && 'Chưa làm'}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                    {g.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {g.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                  <span className="text-2xs font-mono font-medium text-slate-500">
                    {g.costBenefit}
                  </span>

                  {g.status !== 'done' ? (
                    <button
                      onClick={() => onToggleGoal(g.id)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-semibold rounded-lg shadow-xs transition-all cursor-pointer"
                    >
                      Xác nhận xong
                    </button>
                  ) : (
                    <span className="text-2xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      +{g.xpGain} XP
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
