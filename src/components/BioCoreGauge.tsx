import React, { useState } from 'react';
import { Activity, AlertTriangle, Sparkles, RefreshCw, BatteryCharging } from 'lucide-react';
import { Energy4D } from '../types';

interface BioCoreGaugeProps {
  energy: Energy4D;
  onEnergyChange: (newEnergy: Energy4D) => void;
  onTriggerRedAlert: () => void;
}

export const BioCoreGauge: React.FC<BioCoreGaugeProps> = ({
  energy,
  onEnergyChange,
  onTriggerRedAlert,
}) => {
  const [hoveredDimension, setHoveredDimension] = useState<string | null>(null);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    let status = 'Cân Bằng';
    if (val >= 90) status = 'Sức Sống Đỉnh Cao';
    else if (val >= 70) status = 'Năng Lượng Dồi Dào';
    else if (val >= 45) status = 'Cân Bằng Ổn Định';
    else status = 'Cần Phục Hồi Gấp';

    onEnergyChange({
      ...energy,
      overall: val,
      physical: Math.min(100, Math.round(val * 1.05)),
      mental: Math.min(100, Math.round(val * 0.95)),
      social: Math.min(100, Math.round(val * 1.1)),
      statusText: status,
    });
  };

  const handleQuickSwitch = (targetVal: number, status: string) => {
    onEnergyChange({
      ...energy,
      overall: targetVal,
      physical: Math.min(100, Math.round(targetVal * 1.05)),
      mental: Math.min(100, Math.round(targetVal * 0.95)),
      social: Math.min(100, Math.round(targetVal * 1.1)),
      statusText: status,
    });
  };

  // SVG Gauge calculations
  const size = 220;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (energy.overall / 100) * circumference;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
      {/* Top Title & Red Alert Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400">
            <Activity className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">THE 360° BIO-CORE GAUGE</span>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-display mt-0.5">
            Quản Trị Năng Lượng Sinh Học Real-Time
          </h3>
        </div>

        <button
          onClick={onTriggerRedAlert}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 rounded-xl transition-all cursor-pointer shadow-2xs shrink-0"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
          <span>Red Alert: Cấp Cứu Kiệt Sức</span>
        </button>
      </div>

      {/* 360° Circular Gauge */}
      <div className="flex flex-col items-center justify-center relative py-2">
        <div className="relative flex items-center justify-center">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background Ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="transparent"
              className="text-slate-100 dark:text-slate-800"
            />
            {/* Gradient Progress Ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="url(#bioGradient)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={progressOffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
            <defs>
              <linearGradient id="bioGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="35%" stopColor="#3b82f6" />
                <stop offset="70%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Info Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <span className="text-2xl" role="img" aria-label="Energy status">
              {energy.overall >= 80 ? '😊' : energy.overall >= 50 ? '🙂' : '😴'}
            </span>
            <div className="text-4xl font-extrabold font-display text-slate-900 dark:text-white tabular-nums tracking-tight mt-0.5">
              {energy.overall}%
            </div>
            <div className="text-2xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mt-0.5">
              {energy.statusText}
            </div>
          </div>
        </div>

        <p className="text-2xs text-slate-400 text-center mt-3">
          Rê chuột/Chạm vào các vòng màu để xem phân tích năng lượng chi tiết.
        </p>

        {/* Dimension Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full mt-4">
          <div
            onMouseEnter={() => setHoveredDimension('physical')}
            onMouseLeave={() => setHoveredDimension(null)}
            className={`p-2.5 rounded-xl border text-center transition-all ${
              hoveredDimension === 'physical'
                ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40'
                : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5 text-2xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Thể chất</span>
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 tabular-nums">
              {energy.physical}%
            </span>
          </div>

          <div
            onMouseEnter={() => setHoveredDimension('mental')}
            onMouseLeave={() => setHoveredDimension(null)}
            className={`p-2.5 rounded-xl border text-center transition-all ${
              hoveredDimension === 'mental'
                ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40'
                : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5 text-2xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>Tinh thần</span>
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 tabular-nums">
              {energy.mental}%
            </span>
          </div>

          <div
            onMouseEnter={() => setHoveredDimension('studyLoad')}
            onMouseLeave={() => setHoveredDimension(null)}
            className={`p-2.5 rounded-xl border text-center transition-all ${
              hoveredDimension === 'studyLoad'
                ? 'border-purple-500 bg-purple-50/60 dark:bg-purple-950/40'
                : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5 text-2xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              <span>Trí óc</span>
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 tabular-nums">
              {energy.studyLoad}%
            </span>
          </div>

          <div
            onMouseEnter={() => setHoveredDimension('social')}
            onMouseLeave={() => setHoveredDimension(null)}
            className={`p-2.5 rounded-xl border text-center transition-all ${
              hoveredDimension === 'social'
                ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/40'
                : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5 text-2xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>Xã hội</span>
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 tabular-nums">
              {energy.social}%
            </span>
          </div>
        </div>
      </div>

      {/* AI Energy Slider & Quick Switch */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
            <BatteryCharging className="w-3.5 h-3.5 text-indigo-500" />
            <span>AI Energy Slider & Quick Switch</span>
          </div>
          <span className="text-2xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
            Trạng thái: {energy.statusText}
          </span>
        </div>

        {/* Quick Switch Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleQuickSwitch(95, 'Đỉnh Cao (95%)')}
            className={`py-2 px-2.5 rounded-xl text-2xs font-bold border transition-all cursor-pointer ${
              energy.overall >= 90
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            ⚡ High (90-100%)
          </button>
          <button
            onClick={() => handleQuickSwitch(75, 'Cân Bằng (75%)')}
            className={`py-2 px-2.5 rounded-xl text-2xs font-bold border transition-all cursor-pointer ${
              energy.overall >= 50 && energy.overall < 90
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            ⚖️ Balanced (50-80%)
          </button>
          <button
            onClick={() => handleQuickSwitch(35, 'Cần Phục Hồi (35%)')}
            className={`py-2 px-2.5 rounded-xl text-2xs font-bold border transition-all cursor-pointer ${
              energy.overall < 50
                ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            🔋 Low (&lt;40%)
          </button>
        </div>

        {/* Interactive Slider */}
        <div className="space-y-1.5 pt-1">
          <input
            type="range"
            min="0"
            max="100"
            value={energy.overall}
            onChange={handleSliderChange}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex items-center justify-between text-2xs text-slate-400 font-mono">
            <span>Cần Phục Hồi (0%)</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">{energy.overall}%</span>
            <span>Đỉnh Cao (100%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
