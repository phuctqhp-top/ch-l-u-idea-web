import React, { useState } from 'react';
import { TrendingUp, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { BurnoutDataPoint } from '../types';

interface BurnoutPredictorChartProps {
  data: BurnoutDataPoint[];
  onAutoRebalance?: () => void;
}

// Generate smooth cubic bezier SVG path through points
function getCurvedPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;

  let d = `M ${points[0].x},${points[0].y}`;
  const tension = 0.22;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;

    d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return d;
}

export const BurnoutPredictorChart: React.FC<BurnoutPredictorChartProps> = ({
  data,
  onAutoRebalance,
}) => {
  const [activeDayIndex, setActiveDayIndex] = useState<number>(4); // Default to Thứ 5 / Thứ 6

  const width = 880;
  const height = 310;
  const paddingLeft = 45;
  const paddingRight = 45;
  const paddingTop = 28;
  const paddingBottom = 45;

  const chartHeight = height - paddingTop - paddingBottom;
  const chartWidth = width - paddingLeft - paddingRight;

  const pointsCount = data.length;
  const stepX = chartWidth / (pointsCount - 1);

  const getY = (val: number) => {
    return paddingTop + chartHeight - (val / 100) * chartHeight;
  };

  // Convert data points to coordinate objects
  const batteryCoords = data.map((d, i) => ({
    x: paddingLeft + i * stepX,
    y: getY(d.energyBattery),
  }));

  const loadCoords = data.map((d, i) => ({
    x: paddingLeft + i * stepX,
    y: getY(d.studyLoad),
  }));

  const batteryCurvedPath = getCurvedPath(batteryCoords);
  const loadCurvedPath = getCurvedPath(loadCoords);

  const activePoint = data[activeDayIndex] || data[4];
  const isDangerDay = activePoint.studyLoad > activePoint.energyBattery;

  // Y-axis grid values: 100 down to 0
  const yValues = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0];

  return (
    <div className="bg-[#101726] border border-[#1e293b] text-slate-100 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
      {/* Header matching exact screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <TrendingUp className="w-5 h-5 text-rose-500" />
            <h3 className="text-base sm:text-lg font-bold text-white font-display tracking-tight">
              Dự Báo Kiệt Sức & Xu Hướng Năng Lượng Tuần (Burnout Predictor)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Đối chiếu Khối lượng bài vở (Workload) và Năng lượng sinh học theo thời gian real-time
          </p>
        </div>

        {/* Legend Pills matching screenshot */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d2a2a] border border-[#14b8a6]/40 text-[#2dd4bf] text-xs font-semibold shadow-inner">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2dd4bf]"></span>
            <span>Năng lượng (Battery)</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2a131b] border border-[#f43f5e]/40 text-[#fb7185] text-xs font-semibold shadow-inner">
            <span className="w-2.5 h-2.5 rounded-full bg-[#fb7185]"></span>
            <span>Tải trọng (Study Load)</span>
          </div>
        </div>
      </div>

      {/* Interactive High-Fidelity SVG Chart */}
      <div className="relative overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[650px] select-none"
        >
          {/* Subtle grid gradient filter */}
          <defs>
            <linearGradient id="batteryGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="loadGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
            </linearGradient>
            <filter id="glowTeal" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glowRose" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Horizontal Grid lines 0 to 100 */}
          {yValues.map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 14}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[11px] fill-slate-400 font-mono"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Solid Teal Curve (Battery) */}
          <path
            d={batteryCurvedPath}
            fill="none"
            stroke="#2dd4bf"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glowTeal)"
          />

          {/* Dashed Red Curve (Study Load) */}
          <path
            d={loadCurvedPath}
            fill="none"
            stroke="#fb7185"
            strokeWidth="2.8"
            strokeDasharray="6,6"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glowRose)"
          />

          {/* Data Points and Column Interactivity */}
          {data.map((d, i) => {
            const x = paddingLeft + i * stepX;
            const yBattery = getY(d.energyBattery);
            const yLoad = getY(d.studyLoad);
            const isSelected = i === activeDayIndex;

            return (
              <g
                key={d.day}
                onClick={() => setActiveDayIndex(i)}
                className="cursor-pointer group"
              >
                {/* Vertical hover indicator */}
                <line
                  x1={x}
                  y1={paddingTop}
                  x2={x}
                  y2={height - paddingBottom}
                  stroke={isSelected ? '#818cf8' : 'rgba(255,255,255,0.05)'}
                  strokeWidth={isSelected ? 1.5 : 1}
                  strokeDasharray={isSelected ? '3,3' : '1,4'}
                  className="transition-colors group-hover:stroke-indigo-400"
                />

                {/* Battery Dot (Teal) */}
                <circle
                  cx={x}
                  cy={yBattery}
                  r={isSelected ? 7 : 5.5}
                  fill="#2dd4bf"
                  stroke="#111827"
                  strokeWidth="2"
                  className="transition-transform group-hover:scale-125"
                />

                {/* Load Dot (Rose) */}
                <circle
                  cx={x}
                  cy={yLoad}
                  r={isSelected ? 7 : 5.5}
                  fill="#fb7185"
                  stroke="#111827"
                  strokeWidth="2"
                  className="transition-transform group-hover:scale-125"
                />

                {/* X Axis Label */}
                <text
                  x={x}
                  y={height - 12}
                  textAnchor="middle"
                  className={`text-[12px] font-medium transition-colors ${
                    isSelected
                      ? 'fill-indigo-300 font-bold'
                      : d.isToday
                      ? 'fill-teal-300 font-semibold'
                      : 'fill-slate-400'
                  }`}
                >
                  {d.day}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Active Day Detail & Adaptive Rebalance Banner */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border transition-all ${
          isDangerDay
            ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
            : 'bg-teal-950/30 border-teal-500/30 text-teal-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={`p-2.5 rounded-xl shrink-0 ${
                isDangerDay
                  ? 'bg-rose-900/60 text-rose-300'
                  : 'bg-teal-900/60 text-teal-300'
              }`}
            >
              {isDangerDay ? (
                <AlertCircle className="w-5 h-5 animate-pulse text-rose-400" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-teal-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Phân tích: {activePoint.day}
                </span>
                <span
                  className={`text-2xs px-2.5 py-0.5 rounded-full font-bold ${
                    isDangerDay
                      ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40'
                      : 'bg-teal-500/30 text-teal-300 border border-teal-500/40'
                  }`}
                >
                  {isDangerDay ? 'Cảnh Báo Kiệt Sức (Burnout Crossover)' : 'An Toàn Bền Vững (Optimal)'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {isDangerDay
                  ? `Khối lượng bài vở (${activePoint.studyLoad}%) đang vượt quá dung lượng pin sinh học (${activePoint.energyBattery}%). Nguy cơ mệt mỏi tích tụ cao vào cuối tuần!`
                  : `Năng lượng sinh học (${activePoint.energyBattery}%) cao hơn tải trọng học tập (${activePoint.studyLoad}%). Trạng thái lý tưởng để tiếp thu kiến thức chuyên sâu.`}
              </p>
            </div>
          </div>

          {onAutoRebalance && (
            <button
              onClick={onAutoRebalance}
              className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 active:scale-95 rounded-xl shadow-md shadow-indigo-600/30 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 self-start sm:self-center"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
              <span>AI Cân Bằng Tức Thì</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

