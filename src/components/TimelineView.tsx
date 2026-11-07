import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  ChevronDown,
  ChevronUp,
  Plus,
  Coffee,
  GripVertical,
  Zap,
  Sparkles,
  ArrowUpDown,
  RefreshCw,
} from 'lucide-react';
import { TimelineBlock, Subject } from '../types';
import { minutesToTimeString, timeStringToMinutes } from '../utils/sdtEngine';

interface TimelineViewProps {
  blocks: TimelineBlock[];
  subjects: Subject[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  onToggleBlockComplete: (id: string) => void;
  onToggleMicroTask: (blockId: string, microTaskId: string) => void;
  onRescheduleBlock: (id: string, deltaMinutes: number) => void;
  onReorderBlocks: (draggedId: string, targetId: string) => void;
  onOpenFocusModalWithBlock: (block: TimelineBlock) => void;
  onOpenQuickAdd: () => void;
  onTriggerBreathingReset: () => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  blocks,
  subjects,
  selectedDate,
  setSelectedDate,
  onToggleBlockComplete,
  onToggleMicroTask,
  onRescheduleBlock,
  onReorderBlocks,
  onOpenFocusModalWithBlock,
  onOpenQuickAdd,
  onTriggerBreathingReset,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'class' | 'study' | 'rest'>('all');
  const [expandedBlockIds, setExpandedBlockIds] = useState<Record<string, boolean>>({
    't-study-1': true,
    't-study-2': true,
  });
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [dragOverBlockId, setDragOverBlockId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedBlockIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const daysOfWeek = [
    { dayName: 'T2', date: '2026-11-03', dayNum: '03' },
    { dayName: 'T3', date: '2026-11-04', dayNum: '04' },
    { dayName: 'T4', date: '2026-11-05', dayNum: '05' },
    { dayName: 'T5', date: '2026-11-06', dayNum: '06' },
    { dayName: 'T6', date: '2026-11-07', dayNum: '07', isToday: true },
    { dayName: 'T7', date: '2026-11-08', dayNum: '08' },
    { dayName: 'CN', date: '2026-11-09', dayNum: '09' },
  ];

  const filteredBlocks = blocks
    .filter((b) => b.date === selectedDate)
    .filter((b) => {
      if (filterType === 'all') return true;
      if (filterType === 'class') return b.type === 'class';
      if (filterType === 'study') return b.type === 'study' || b.type === 'assignment' || b.type === 'review';
      if (filterType === 'rest') return b.type === 'rest';
      return true;
    })
    .sort((a, b) => timeStringToMinutes(a.startTime) - timeStringToMinutes(b.startTime));

  const totalToday = blocks.filter((b) => b.date === selectedDate && b.type !== 'rest').length;
  const completedToday = blocks.filter((b) => b.date === selectedDate && b.type !== 'rest' && b.completed).length;
  const progressPct = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  const getSubjectById = (id?: string) => subjects.find((s) => s.id === id);

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedBlockId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggedBlockId !== id) {
      setDragOverBlockId(id);
    }
  };

  const handleDragLeave = () => {
    setDragOverBlockId(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('text/plain') || draggedBlockId;
    if (sourceId && sourceId !== targetId) {
      onReorderBlocks(sourceId, targetId);
    }
    setDraggedBlockId(null);
    setDragOverBlockId(null);
  };

  return (
    <div className="space-y-6">
      {/* Date Header & Progress Strip */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xs font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
                DÒNG THỜI GIAN HỌC TẬP HẰNG NGÀY
              </span>
              <span className="text-2xs px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">
                Kéo & Thả Linh Hoạt
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display mt-0.5">
              Thứ Sáu, 07 Tháng 11, 2026
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span>{completedToday} trên {totalToday} mục tiêu học tập hoàn thành</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{progressPct}% hoàn tất</span>
            </div>
          </div>

          {/* Quick Progress Bar & Action */}
          <div className="flex items-center gap-3">
            <div className="w-36 sm:w-44 bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 via-teal-400 to-emerald-400 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              ></div>
            </div>
            <button
              onClick={onOpenQuickAdd}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-semibold rounded-xl shadow-xs shadow-indigo-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm Khối Giờ</span>
            </button>
          </div>
        </div>

        {/* 7-Day Visual Selector */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          {daysOfWeek.map((day) => {
            const isSelected = day.date === selectedDate;
            return (
              <button
                key={day.date}
                onClick={() => setSelectedDate(day.date)}
                className={`flex flex-col items-center py-2.5 px-1 rounded-2xl transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span className={`text-2xs font-semibold uppercase ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                  {day.dayName}
                </span>
                <span className={`text-sm sm:text-base font-bold font-display mt-0.5 ${isSelected ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                  {day.dayNum}
                </span>
                {day.isToday && (
                  <span className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-white' : 'bg-indigo-500'}`}></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Segmented Controls */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filterType === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Tất Cả
          </button>
          <button
            onClick={() => setFilterType('class')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filterType === 'class'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Tiết Trên Lớp
          </button>
          <button
            onClick={() => setFilterType('study')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filterType === 'study'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Tự Học Sâu
          </button>
          <button
            onClick={() => setFilterType('rest')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filterType === 'rest'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Nghỉ Ngơi & Tái Tạo
          </button>
        </div>

        <div className="flex items-center gap-2 text-2xs text-slate-500 dark:text-slate-400 font-medium">
          <ArrowUpDown className="w-3.5 h-3.5 text-indigo-500" />
          <span>Kéo thả để hoán đổi thời gian tức thì</span>
        </div>
      </div>

      {/* Structured Visual Timeline with Drag-and-Drop */}
      <div className="relative pl-5 sm:pl-9 border-l-2 border-indigo-100 dark:border-indigo-950/70 space-y-4">
        {filteredBlocks.map((block) => {
          const subject = getSubjectById(block.subjectId);
          const isExpanded = !!expandedBlockIds[block.id];
          const isRest = block.type === 'rest';
          const isDragOver = dragOverBlockId === block.id;

          // Pastel Badge styles
          let badgeClass = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
          let badgeText = block.energyTag || (block.type === 'class' ? 'Lịch Trường' : isRest ? 'Nghỉ Tái Tạo' : 'Tự Học Sâu');
          if (block.energyTag === 'High Focus' || block.energyLevelRequired === 'high') {
            badgeClass = 'bg-amber-100/80 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
            badgeText = 'Tập Trung Cao';
          } else if (block.energyTag === 'Micro-task') {
            badgeClass = 'bg-teal-100/80 text-teal-800 dark:bg-teal-950 dark:text-teal-300';
            badgeText = 'Vi Nhiệm Vụ';
          } else if (block.energyTag === 'Low Energy') {
            badgeClass = 'bg-blue-100/80 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
            badgeText = 'Năng Lượng Thấp';
          } else if (block.energyTag === 'Lịch Trường' || block.type === 'class') {
            badgeClass = 'bg-indigo-100/80 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300';
            badgeText = 'Lịch Trường';
          } else if (block.energyTag === 'Adaptive Rest' || isRest) {
            badgeClass = 'bg-emerald-100/80 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
            badgeText = 'Nghỉ Tái Tạo';
          }

          return (
            <div
              key={block.id}
              draggable
              onDragStart={(e) => handleDragStart(e, block.id)}
              onDragOver={(e) => handleDragOver(e, block.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, block.id)}
              className={`relative group transition-all duration-200 ${
                isDragOver ? 'scale-[1.02] -translate-y-1' : ''
              }`}
            >
              {/* Connector Dot */}
              <div
                className={`absolute -left-[27px] sm:-left-[43px] top-4 w-4 h-4 rounded-full border-2 transition-transform group-hover:scale-125 ${
                  block.completed
                    ? 'bg-emerald-500 border-white dark:border-slate-900 ring-2 ring-emerald-200 dark:ring-emerald-950'
                    : isRest
                    ? 'bg-teal-400 border-white dark:border-slate-900'
                    : 'bg-indigo-500 border-white dark:border-slate-900'
                }`}
              ></div>

              {/* Card Container */}
              <div
                className={`rounded-2xl border p-4 sm:p-5 transition-all duration-200 ${
                  isDragOver
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-md ring-2 ring-indigo-500/30'
                    : block.completed
                    ? 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-80'
                    : isRest
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 hover:shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 hover:shadow-xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  {/* Left Column: Drag handle + Checkbox + Content */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Drag Handle */}
                    <div
                      className="mt-0.5 text-slate-300 dark:text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-grab active:cursor-grabbing p-0.5"
                      title="Kéo thả để sắp xếp lại thời gian"
                    >
                      <GripVertical className="w-4 h-4" />
                    </div>

                    <button
                      onClick={() => onToggleBlockComplete(block.id)}
                      className="mt-0.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shrink-0 cursor-pointer"
                      title={block.completed ? 'Đánh dấu chưa xong' : 'Hoàn thành (nhận Micro-Win!)'}
                      aria-label={`Toggle completion for ${block.title}`}
                    >
                      {block.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      {/* Meta Tags */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                        <span className="font-mono font-bold text-slate-700 dark:text-slate-200">
                          {block.startTime} – {block.endTime}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-medium">{block.durationMinutes} phút</span>

                        {subject && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                              {subject.name}
                            </span>
                          </>
                        )}

                        {/* Energy Tag Badge */}
                        <span className={`text-2xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${badgeClass}`}>
                          {badgeText}
                        </span>
                      </div>

                      <h3
                        className={`text-base font-semibold mt-1 font-display transition-colors ${
                          block.completed
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {block.title}
                      </h3>

                      {block.recommendedContext && (
                        <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-0.5 font-medium">
                          💡 {block.recommendedContext}
                        </p>
                      )}

                      {block.energyCost && (
                        <p className="text-2xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                          Tải nhận thức: {block.energyCost}
                        </p>
                      )}

                      {block.notes && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 italic">
                          {block.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Actions: Reschedule, Focus, Expand */}
                  <div className="flex items-center gap-1.5 self-end sm:self-start shrink-0">
                    {isRest ? (
                      <button
                        onClick={onTriggerBreathingReset}
                        className="px-3 py-1 text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-100/80 dark:bg-teal-900/50 hover:bg-teal-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Coffee className="w-3.5 h-3.5" />
                        <span>Bài thở 4-7-8</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => onOpenFocusModalWithBlock(block)}
                          className="px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                          title="Bật Không Gian Tập Trung Pomodoro"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Tập Trung</span>
                        </button>
                        <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden text-2xs">
                          <button
                            onClick={() => onRescheduleBlock(block.id, -15)}
                            className="px-1.5 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"
                            title="Lùi sớm 15 phút"
                          >
                            -15p
                          </button>
                          <button
                            onClick={() => onRescheduleBlock(block.id, 15)}
                            className="px-1.5 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 border-l border-slate-200 dark:border-slate-700 cursor-pointer"
                            title="Dời trễ 15 phút"
                          >
                            +15p
                          </button>
                        </div>
                      </>
                    )}

                    {block.microTasks && block.microTasks.length > 0 && (
                      <button
                        onClick={() => toggleExpand(block.id)}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer"
                        aria-label="Xem micro-tasks"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Micro-tasks breakdown list */}
                {isExpanded && block.microTasks && block.microTasks.length > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-2xs font-bold uppercase tracking-wider text-slate-400">
                      <span>Vi Nhiệm Vụ (Micro-Steps)</span>
                      <span>
                        {block.microTasks.filter((m) => m.completed).length} / {block.microTasks.length} hoàn thành
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {block.microTasks.map((task) => (
                        <div
                          key={task.id}
                          onClick={() => onToggleMicroTask(block.id, task.id)}
                          className={`flex items-center justify-between p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                            task.completed
                              ? 'bg-slate-50 dark:bg-slate-800/40 text-slate-400 line-through'
                              : 'bg-slate-50/70 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-slate-400">
                              {task.completed ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <Circle className="w-3.5 h-3.5" />
                              )}
                            </span>
                            <span className="truncate">{task.title}</span>
                          </div>
                          <span className="font-mono text-2xs text-slate-400 shrink-0 ml-2">
                            ~{task.estimatedMinutes}m
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
