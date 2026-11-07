import React, { useState } from 'react';
import { Calendar, Edit3, Plus, Sparkles, Check, X } from 'lucide-react';
import { TimetableGridRow } from '../types';

interface SchoolTimetableGridProps {
  gridData: TimetableGridRow[];
  onUpdateGrid: (newGrid: TimetableGridRow[]) => void;
}

export const SchoolTimetableGrid: React.FC<SchoolTimetableGridProps> = ({
  gridData,
  onUpdateGrid,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{
    rowIndex: number;
    dayIndex: number;
    currentSubject: string;
    currentNote: string;
  } | null>(null);

  const days = [
    { index: 1, label: 'Thứ Hai' },
    { index: 2, label: 'Thứ Ba' },
    { index: 3, label: 'Thứ Tư (Hôm nay)', isToday: true },
    { index: 4, label: 'Thứ Năm' },
    { index: 5, label: 'Thứ Sáu' },
  ];

  const handleSaveCell = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCell) return;

    const newGrid = [...gridData];
    const targetRow = { ...newGrid[selectedCell.rowIndex] };
    const targetSchedule = { ...targetRow.schedule };

    targetSchedule[selectedCell.dayIndex] = {
      ...targetSchedule[selectedCell.dayIndex],
      subjectName: selectedCell.currentSubject,
      roomOrNote: selectedCell.currentNote,
    };

    targetRow.schedule = targetSchedule;
    newGrid[selectedCell.rowIndex] = targetRow;

    onUpdateGrid(newGrid);
    setSelectedCell(null);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <Calendar className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">THỜI KHÓA BIỂU BÁN TRÚ HỌC ĐƯỜNG (THỨ 2 – THỨ 6)</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display mt-0.5">
            Thời Khóa Biểu Ngang Chuẩn Lớp 10 Đan Xen Nhiệm Vụ Tự Học AI
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Kết nối lịch học chính khóa tại trường với khung giờ tự học tối ưu theo mức pin sinh học.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Legend Badges */}
          <div className="hidden lg:flex items-center gap-2 text-2xs font-semibold mr-2">
            <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Chính khóa
            </span>
            <span className="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              Nghỉ trưa Bán trú
            </span>
            <span className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              Lịch Tự Học AI
            </span>
          </div>

          <button
            onClick={() => setIsEditing((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 border border-indigo-200 dark:border-indigo-800 rounded-xl transition-all cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Xong Chỉnh Sửa' : 'Chỉnh Sửa Bảng Thời Khóa Biểu'}</span>
          </button>
        </div>
      </div>

      {/* Grid Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[760px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider text-2xs">
              <th className="py-3 px-3 w-36">Buổi / Khung Giờ</th>
              {days.map((day) => (
                <th
                  key={day.index}
                  className={`py-3 px-3 ${
                    day.isToday ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/40 dark:bg-indigo-950/20 rounded-t-xl' : ''
                  }`}
                >
                  {day.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {gridData.map((row, rIdx) => {
              const isLunch = row.sessionPeriod === 'lunch_rest';

              return (
                <tr key={row.sessionPeriod} className="group">
                  {/* Period Column */}
                  <td className="py-3.5 px-3 font-semibold text-slate-800 dark:text-slate-200 align-top">
                    <div>{row.title}</div>
                    <div className="text-2xs font-mono text-slate-400 mt-0.5">{row.timeLabel}</div>
                  </td>

                  {/* Lunch Special Spanning Row or Standard 5-day slots */}
                  {isLunch ? (
                    <td
                      colSpan={5}
                      className="py-3.5 px-3 bg-teal-50/50 dark:bg-teal-950/30 border border-dashed border-teal-200 dark:border-teal-800/60 rounded-xl text-center"
                    >
                      <div className="flex items-center justify-center gap-2 text-teal-800 dark:text-teal-300 font-semibold">
                        <span>🍱 Ăn trưa bán trú tại trường & Nghỉ ngơi tái tạo năng lượng</span>
                        <span className="text-2xs px-2 py-0.5 rounded-full bg-teal-200/60 dark:bg-teal-900 text-teal-900 dark:text-teal-200">
                          AI Rec: Tắt màn hình 30 phút
                        </span>
                      </div>
                    </td>
                  ) : (
                    days.map((day) => {
                      const item = row.schedule[day.index];
                      const isAi = row.sessionPeriod === 'ai_study';

                      return (
                        <td
                          key={day.index}
                          className={`py-3 px-2.5 align-top ${
                            day.isToday ? 'bg-indigo-50/20 dark:bg-indigo-950/10' : ''
                          }`}
                        >
                          {item ? (
                            <div
                              onClick={() => {
                                if (isEditing) {
                                  setSelectedCell({
                                    rowIndex: rIdx,
                                    dayIndex: day.index,
                                    currentSubject: item.subjectName,
                                    currentNote: item.roomOrNote,
                                  });
                                }
                              }}
                              className={`p-2.5 rounded-xl border text-2xs transition-all ${
                                isAi
                                  ? 'bg-purple-50/70 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/60 text-purple-900 dark:text-purple-200'
                                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-200'
                              } ${isEditing ? 'cursor-pointer hover:border-indigo-500 hover:scale-[1.02]' : ''}`}
                            >
                              <div className="font-bold text-xs truncate">{item.subjectName}</div>
                              <div className="text-slate-500 dark:text-slate-400 mt-1 truncate">
                                {item.roomOrNote}
                              </div>
                              {isEditing && (
                                <span className="text-2xs text-indigo-500 font-semibold mt-1 inline-block">
                                  Bấm sửa ✎
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="text-2xs text-slate-400 italic py-2">—</div>
                          )}
                        </td>
                      );
                    })
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit Cell Modal */}
      {selectedCell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                Chỉnh Sửa Tiết Học
              </h4>
              <button
                onClick={() => setSelectedCell(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCell} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tên Môn / Nhiệm vụ
                </label>
                <input
                  type="text"
                  value={selectedCell.currentSubject}
                  onChange={(e) =>
                    setSelectedCell({ ...selectedCell, currentSubject: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phòng học / Ghi chú AI
                </label>
                <input
                  type="text"
                  value={selectedCell.currentNote}
                  onChange={(e) =>
                    setSelectedCell({ ...selectedCell, currentNote: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedCell(null)}
                  className="px-3 py-1.5 text-slate-500 hover:text-slate-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl"
                >
                  Lưu Tiết Học
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
