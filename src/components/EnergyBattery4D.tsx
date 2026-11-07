import React from 'react';
import { ShieldCheck, Sparkles, HeartPulse, Brain, BookOpen, Users } from 'lucide-react';
import { Energy4D } from '../types';

interface EnergyBattery4DProps {
  energy: Energy4D;
  onRebalance: () => void;
}

export const EnergyBattery4D: React.FC<EnergyBattery4DProps> = ({
  energy,
  onRebalance,
}) => {
  return (
    <div className="space-y-4">
      {/* Sustainability Forecast Banner */}
      <div className="bg-gradient-to-r from-indigo-50/80 via-white to-teal-50/80 dark:from-indigo-950/40 dark:via-slate-900 dark:to-teal-950/30 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-2xs font-bold text-teal-600 dark:text-teal-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SUSTAINABILITY FORECAST · CẬP NHẬT 5 PHÚT TRƯỚC</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-display mt-0.5">
              Chỉ số Độ Bền Học Tập: <span className="text-emerald-600 dark:text-emerald-400">An toàn 85%</span> (7 ngày tới)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              AI phân tích: Nhịp sinh học & khối lượng bài vở hiện tại cân bằng. Đủ năng lượng duy trì phong độ đỉnh cao cho đợt thi giữa kỳ sắp tới.
            </p>
          </div>

          <button
            onClick={onRebalance}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-xl flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-500/25 transition-all cursor-pointer shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Re-balance Tức Thì</span>
          </button>
        </div>
      </div>

      {/* Ma Trận Pin Năng Lượng 4D */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            <span className="text-indigo-500">⚡</span>
            <span>Ma Trận Pin Năng Lượng 4D (4D Energy Battery)</span>
          </div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
            Pin Tổng Thể: {energy.overall}%
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Thể Chất (Physical) */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <HeartPulse className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Thể Chất</div>
                  <div className="text-2xs text-slate-400 font-mono">Physical</div>
                </div>
              </div>
              <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {energy.physical}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${energy.physical}%` }}
              ></div>
            </div>
            <div className="text-2xs text-slate-500">Giấc ngủ 7.5h · Dinh dưỡng tốt</div>
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-2xs">
              <span className="text-slate-600 dark:text-slate-300 font-medium">Trạng thái: dồi dào</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">+5% vs hôm qua</span>
            </div>
          </div>

          {/* Card 2: Tinh Thần (Mental) */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Tinh Thần</div>
                  <div className="text-2xs text-slate-400 font-mono">Mental</div>
                </div>
              </div>
              <span className="text-base font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">
                {energy.mental}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${energy.mental}%` }}
              ></div>
            </div>
            <div className="text-2xs text-slate-500">Tâm lý ổn định · Bình tĩnh</div>
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-2xs">
              <span className="text-slate-600 dark:text-slate-300 font-medium">Focus Score: High</span>
              <span className="text-blue-600 dark:text-blue-400 font-semibold">Tập trung tốt</span>
            </div>
          </div>

          {/* Card 3: Bài Vở (Study Load) */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Bài Vở</div>
                  <div className="text-2xs text-slate-400 font-mono">Study Load</div>
                </div>
              </div>
              <span className="text-base font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">
                {energy.studyLoad}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${energy.studyLoad}%` }}
              ></div>
            </div>
            <div className="text-2xs text-slate-500">4 bài tập · 1 kỳ thi tuần sau</div>
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-2xs">
              <span className="text-slate-600 dark:text-slate-300 font-medium">Tải trọng: Vừa sức</span>
              <span className="text-amber-600 dark:text-amber-400 font-semibold">Cần 2.5h làm việc</span>
            </div>
          </div>

          {/* Card 4: Xã Hội & Gia Đình */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Xã Hội & Nhà</div>
                  <div className="text-2xs text-slate-400 font-mono">Relatedness</div>
                </div>
              </div>
              <span className="text-base font-extrabold text-purple-600 dark:text-purple-400 tabular-nums">
                {energy.social}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${energy.social}%` }}
              ></div>
            </div>
            <div className="text-2xs text-slate-500">Ăn tối cùng nhà · Đội bóng</div>
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-2xs">
              <span className="text-slate-600 dark:text-slate-300 font-medium">Kết nối: Rất tốt</span>
              <span className="text-purple-600 dark:text-purple-400 font-semibold">Tích cực</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
