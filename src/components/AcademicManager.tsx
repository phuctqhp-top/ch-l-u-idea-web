import React, { useState } from 'react';
import {
  GraduationCap,
  Calendar,
  Award,
  BookOpen,
  MapPin,
  Mail,
  User,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { Subject, ClassSession, Exam } from '../types';

interface AcademicManagerProps {
  subjects: Subject[];
  classes: ClassSession[];
  exams: Exam[];
  onToggleExamTopic: (examId: string, topic: string) => void;
  onAddExam: (exam: Exam) => void;
}

export const AcademicManager: React.FC<AcademicManagerProps> = ({
  subjects,
  classes,
  exams,
  onToggleExamTopic,
  onAddExam,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'timetable' | 'exams' | 'subjects'>('timetable');
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<number>(5); // Default Friday (5)

  const dayNames = [
    { num: 1, label: 'Monday' },
    { num: 2, label: 'Tuesday' },
    { num: 3, label: 'Wednesday' },
    { num: 4, label: 'Thursday' },
    { num: 5, label: 'Friday' },
  ];

  const getSubject = (subjectId: string) => subjects.find((s) => s.id === subjectId);

  const classesForSelectedDay = classes
    .filter((c) => c.dayOfWeek === selectedDayOfWeek)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="space-y-6">
      {/* Header & Sub-Navigation */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>MY STUDY LIFE ACADEMIC HUB</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display mt-0.5">
              School Timetable, Teacher Directory & Exam Weightage
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Synchronize your school bell schedule with your home autonomous study timeline.
            </p>
          </div>

          {/* Sub-tab segmented buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
            <button
              onClick={() => setActiveSubTab('timetable')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                activeSubTab === 'timetable'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Weekly Schedule
            </button>
            <button
              onClick={() => setActiveSubTab('exams')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                activeSubTab === 'exams'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Exams & Weights
            </button>
            <button
              onClick={() => setActiveSubTab('subjects')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                activeSubTab === 'subjects'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Subjects ({subjects.length})
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Tab 1: Timetable */}
      {activeSubTab === 'timetable' && (
        <div className="space-y-4">
          {/* Day selection tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {dayNames.map((day) => (
              <button
                key={day.num}
                onClick={() => setSelectedDayOfWeek(day.num)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedDayOfWeek === day.num
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>

          {/* Classes for selected day */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {classesForSelectedDay.map((session) => {
              const subject = getSubject(session.subjectId);
              if (!subject) return null;

              return (
                <div
                  key={session.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      {session.startTime} – {session.endTime}
                    </span>
                    <span className="text-2xs font-bold uppercase tracking-wider text-slate-400">
                      {subject.code}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                      {subject.name}
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{session.room}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{subject.teacherName}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {classesForSelectedDay.length === 0 && (
              <div className="col-span-2 text-center py-10 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-500">No school periods scheduled for this day.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Exams & Weightage Tracker */}
      {activeSubTab === 'exams' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {exams.map((exam) => {
              const subject = getSubject(exam.subjectId);
              const completedCount = exam.completedTopics.length;
              const totalCount = exam.topics.length;
              const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

              return (
                <div
                  key={exam.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{exam.date} · {exam.time}</span>
                      </span>
                      <span className="font-mono text-2xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                        {exam.weightPercentage}% of Grade
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                      {exam.title}
                    </h3>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {subject?.name} · {exam.room}
                    </div>

                    {/* Target score indicator */}
                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 pt-1">
                      <span>Target Score:</span>
                      <strong className="font-semibold text-slate-900 dark:text-white">
                        {exam.targetScore}%
                      </strong>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-2xs text-slate-500">
                        <span>Topics Mastered</span>
                        <span>{completedCount}/{totalCount} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-teal-400 h-1.5 rounded-full"
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Syllabus checklist */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                    <div className="text-2xs font-bold uppercase tracking-wider text-slate-400">
                      Syllabus Micro-Checklist:
                    </div>
                    {exam.topics.map((topic) => {
                      const isDone = exam.completedTopics.includes(topic);
                      return (
                        <div
                          key={topic}
                          onClick={() => onToggleExamTopic(exam.id, topic)}
                          className={`flex items-center gap-2 text-xs p-1.5 rounded-lg transition-colors cursor-pointer ${
                            isDone
                              ? 'text-slate-400 line-through bg-slate-50 dark:bg-slate-800/40'
                              : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          )}
                          <span className="truncate">{topic}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Subjects & Teachers */}
      {activeSubTab === 'subjects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((sub) => (
            <div
              key={sub.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xs uppercase tracking-wider font-bold text-slate-400">
                  {sub.code}
                </span>
                <span className="text-2xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {sub.category.toUpperCase()}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                  {sub.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  <span>Current: <strong>{sub.currentGrade}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>Target: <strong>{sub.targetGrade}</strong></span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{sub.teacherName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <a
                    href={`mailto:${sub.teacherEmail}`}
                    className="truncate hover:text-indigo-600 transition-colors"
                  >
                    {sub.teacherEmail}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{sub.room}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
