import React, { useState } from 'react';
import { X, Plus, Clock, BookOpen } from 'lucide-react';
import { TimelineBlock, Subject, TaskType } from '../types';
import { minutesToTimeString, timeStringToMinutes } from '../utils/sdtEngine';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  selectedDate: string;
  onAddBlock: (block: TimelineBlock) => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  subjects,
  selectedDate,
  onAddBlock,
}) => {
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [type, setType] = useState<TaskType>('study');
  const [startTime, setStartTime] = useState('16:00');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const startM = timeStringToMinutes(startTime);
    const endM = startM + Number(durationMinutes);

    const newBlock: TimelineBlock = {
      id: `manual-block-${Date.now()}`,
      title: title.trim(),
      subjectId: type !== 'rest' ? subjectId : undefined,
      type,
      date: selectedDate,
      startTime,
      endTime: minutesToTimeString(endM),
      durationMinutes: Number(durationMinutes),
      completed: false,
      notes: notes.trim() || undefined,
      energyTag: type === 'rest' ? 'Adaptive Rest' : Number(durationMinutes) >= 60 ? 'High Focus' : 'Micro-task',
      microTasks: [
        { id: `mt-${Date.now()}-1`, title: 'Chuẩn bị không gian và tài liệu học', estimatedMinutes: 10, completed: false },
        { id: `mt-${Date.now()}-2`, title: 'Giải quyết bài tập / hoàn thành mục tiêu trọng tâm', estimatedMinutes: Number(durationMinutes) - 15, completed: false },
        { id: `mt-${Date.now()}-3`, title: 'Rà soát lại kết quả và ghi nhận vi thành tựu', estimatedMinutes: 5, completed: false },
      ],
    };

    onAddBlock(newBlock);
    setTitle('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
            Thêm Khối Giờ Học Hoặc Nghỉ Ngơi
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
            aria-label="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tiêu Đề / Mục Tiêu
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Flashcard Sinh Học Chuyển Hóa Tế Bào..."
              required
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phân Loại
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              >
                <option value="study">Tự Học Sâu</option>
                <option value="assignment">Bài Tập Về Nhà</option>
                <option value="review">Ôn Tập Kiến Thức</option>
                <option value="class">Tiết Trên Lớp</option>
                <option value="rest">Nghỉ Ngơi Tái Tạo</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Môn Học
              </label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                disabled={type === 'rest'}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white disabled:opacity-50"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Giờ Bắt Đầu
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Thời Lượng (Phút)
              </label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
              >
                <option value={15}>15 phút (Vi nhiệm vụ)</option>
                <option value={25}>25 phút (Pomodoro chuẩn)</option>
                <option value={45}>45 phút (Cân bằng)</option>
                <option value={60}>60 phút (Chuyên sâu)</option>
                <option value={90}>90 phút (Sprint đề thi)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Ghi Chú / Mục Tiêu Nhỏ (Không bắt buộc)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="VD: Chỉ tập trung vẽ lại sơ đồ Chương 3"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-500 hover:text-slate-700 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-xs cursor-pointer"
            >
              Thêm Vào Lịch Trình
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
