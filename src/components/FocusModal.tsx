import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Circle,
  Volume2,
  VolumeX,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { TimelineBlock } from '../types';

interface FocusModalProps {
  block: TimelineBlock | null;
  isOpen: boolean;
  onClose: () => void;
  onCompleteBlock: (id: string) => void;
  onToggleMicroTask: (blockId: string, microTaskId: string) => void;
}

export const FocusModal: React.FC<FocusModalProps> = ({
  block,
  isOpen,
  onClose,
  onCompleteBlock,
  onToggleMicroTask,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [ambientSound, setAmbientSound] = useState<'off' | 'rain' | 'library' | 'whitenoise'>('off');
  const [celebrated, setCelebrated] = useState(false);

  useEffect(() => {
    if (block) {
      setSecondsRemaining(block.durationMinutes * 60);
      setIsActive(false);
      setCelebrated(false);
    }
  }, [block]);

  useEffect(() => {
    let timer: any = null;
    if (isActive && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isActive) {
      setIsActive(false);
      setCelebrated(true);
    }
    return () => clearInterval(timer);
  }, [isActive, secondsRemaining]);

  if (!isOpen || !block) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const handleFinishEarly = () => {
    setIsActive(false);
    setCelebrated(true);
    onCompleteBlock(block.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400">
              KHÔNG GIAN TẬP TRUNG SÂU
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Đóng đồng hồ tập trung"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Task Title */}
        <div className="text-center space-y-1">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-display">
            {block.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {block.startTime} – {block.endTime} · Bảo vệ trạng thái dòng chảy tập trung của bạn
          </p>
        </div>

        {/* Big Minimalist Timer Display */}
        <div className="flex flex-col items-center justify-center py-4">
          <div className="relative flex items-center justify-center w-52 h-52 rounded-full border-4 border-indigo-100 dark:border-indigo-950 bg-indigo-50/30 dark:bg-slate-800/40">
            <div className="text-center">
              <span className="font-mono text-5xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
                {formattedTime}
              </span>
              <div className="text-2xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mt-1">
                {isActive ? 'Đang Tập Trung Sâu' : 'Tạm Dừng / Sẵn Sàng'}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={() => setIsActive((prev) => !prev)}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-bold rounded-xl flex items-center gap-2 shadow-md shadow-indigo-500/30 transition-all cursor-pointer"
            >
              {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isActive ? 'Tạm Dừng' : 'Bắt Đầu Tập Trung'}</span>
            </button>
            <button
              onClick={() => {
                setIsActive(false);
                setSecondsRemaining(block.durationMinutes * 60);
              }}
              className="p-2.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title="Đặt Lại Thời Gian"
              aria-label="Đặt lại thời gian"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleFinishEarly}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Hoàn Thành & Nhận Điểm</span>
            </button>
          </div>
        </div>

        {/* Ambient Noise Selector */}
        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            {ambientSound === 'off' ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-indigo-500" />}
            <span className="font-medium">Âm thanh thư giãn:</span>
          </div>
          <div className="flex items-center gap-1">
            {[
              { id: 'off', label: 'Tắt' },
              { id: 'rain', label: 'Mưa Rơi' },
              { id: 'library', label: 'Thư Viện' },
              { id: 'whitenoise', label: 'Tiếng Trắng' },
            ].map((sound) => (
              <button
                key={sound.id}
                onClick={() => setAmbientSound(sound.id as any)}
                className={`px-2.5 py-1 rounded-md text-2xs font-semibold transition-colors cursor-pointer ${
                  ambientSound === sound.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {sound.label}
              </button>
            ))}
          </div>
        </div>

        {/* Micro-Tasks Checklist */}
        {block.microTasks && block.microTasks.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="text-2xs font-bold uppercase tracking-wider text-slate-400">
              Danh Sách Vi Nhiệm Vụ Trong Phiên
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {block.microTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onToggleMicroTask(block.id, task.id)}
                  className={`flex items-center justify-between p-2 rounded-lg text-xs transition-colors cursor-pointer ${
                    task.completed
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 line-through'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {task.completed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <span>{task.title}</span>
                  </div>
                  <span className="text-2xs text-slate-400 font-mono">~{task.estimatedMinutes} phút</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Celebration Banner */}
        {celebrated && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-center space-y-1.5 animate-scale-up">
            <div className="flex items-center justify-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Mở Khóa Vi Thành Tựu!</span>
            </div>
            <p className="text-xs text-emerald-800 dark:text-emerald-200">
              Nỗ lực xuất sắc! Mỗi phiên tập trung đều củng cố khả năng làm chủ bản thân theo Thuyết Tự Quyết (SDT).
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
