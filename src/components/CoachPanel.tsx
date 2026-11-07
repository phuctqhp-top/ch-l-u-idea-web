import React, { useState, useEffect } from 'react';
import {
  Heart,
  Sparkles,
  Trophy,
  Coffee,
  Wind,
  Plus,
  Flame,
  CheckCircle2,
  ShieldCheck,
  Smile,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';
import { TimelineBlock, MicroWin, UserProfile } from '../types';
import {
  detectFatiguePattern,
  calculateCompetenceMetrics,
  createAdaptiveRestBlock,
} from '../utils/sdtEngine';

interface CoachPanelProps {
  blocks: TimelineBlock[];
  microWins: MicroWin[];
  profile: UserProfile;
  onAddMicroWin: (win: Omit<MicroWin, 'id' | 'timestamp'>) => void;
  onInsertAdaptiveBreak: (breakBlock: TimelineBlock) => void;
  selectedDate: string;
}

export const CoachPanel: React.FC<CoachPanelProps> = ({
  blocks,
  microWins,
  profile,
  onAddMicroWin,
  onInsertAdaptiveBreak,
  selectedDate,
}) => {
  const [newWinTitle, setNewWinTitle] = useState('');
  const [newWinCategory, setNewWinCategory] = useState<'focus' | 'resilience' | 'clarity' | 'balance'>('focus');
  const [newWinReflection, setNewWinReflection] = useState('');
  const [showAddWinForm, setShowAddWinForm] = useState(false);

  // 4-7-8 Breathing Guide state
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathSeconds, setBreathSeconds] = useState(4);

  const fatigueResult = detectFatiguePattern(blocks.filter((b) => b.date === selectedDate));
  const competence = calculateCompetenceMetrics(blocks.filter((b) => b.date === selectedDate), microWins);

  useEffect(() => {
    if (!isBreathingActive) return;

    const interval = setInterval(() => {
      setBreathSeconds((prev) => {
        if (prev <= 1) {
          if (breathPhase === 'Inhale') {
            setBreathPhase('Hold');
            return 7;
          } else if (breathPhase === 'Hold') {
            setBreathPhase('Exhale');
            return 8;
          } else {
            setBreathPhase('Inhale');
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isBreathingActive, breathPhase]);

  const handleCreateMicroWin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWinTitle.trim()) return;
    onAddMicroWin({
      title: newWinTitle.trim(),
      category: newWinCategory,
      reflection: newWinReflection.trim() || undefined,
    });
    setNewWinTitle('');
    setNewWinReflection('');
    setShowAddWinForm(false);
  };

  const handleScheduleProactiveBreak = () => {
    const breakBlock = createAdaptiveRestBlock(selectedDate, '16:45', 15);
    onInsertAdaptiveBreak(breakBlock);
  };

  return (
    <div className="space-y-6">
      {/* Banipu Mascot & Compassionate Coach Hero */}
      <div className="bg-gradient-to-br from-indigo-50/90 via-white to-amber-50/70 dark:from-indigo-950/40 dark:via-slate-900 dark:to-amber-950/20 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-amber-400 p-0.5 shadow-md shadow-indigo-500/20 shrink-0">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center">
                <span className="text-2xl" role="img" aria-label="Banipu Mascot Owl">
                  🦉
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                  Banipu Motivational Coach
                </h2>
                <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  SDT Framework
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Nurturing Autonomy, Competence, and Intrinsic Joy in learning.
              </p>
              <div className="mt-3 p-3 bg-white/80 dark:bg-slate-800/80 rounded-xl border border-indigo-100 dark:border-indigo-900/50 text-xs text-slate-700 dark:text-slate-200">
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">Today's Affirmation: </span>
                {competence.positiveFeedback}
              </div>
            </div>
          </div>

          {/* Quick Streak Card */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto p-3 sm:p-0 bg-white/60 dark:bg-slate-800/40 sm:bg-transparent rounded-xl border sm:border-0 border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
              <span className="font-extrabold text-lg font-display tabular-nums">
                {profile.streakDays} Day Streak
              </span>
            </div>
            <span className="text-2xs text-slate-500 dark:text-slate-400">
              {microWins.length} Micro-Wins Catalogued
            </span>
          </div>
        </div>
      </div>

      {/* Adaptive Rest & Burnout Radar (Feature 3 Requirement) */}
      <div className={`p-6 rounded-2xl border transition-all ${
        fatigueResult.needsRest
          ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800'
          : 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-xl shrink-0 ${
              fatigueResult.needsRest
                ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300'
                : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
            }`}>
              {fatigueResult.needsRest ? <Coffee className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Adaptive Rest & Cognitive Load Radar
                </h3>
                {fatigueResult.needsRest && (
                  <span className="text-2xs px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200 font-semibold">
                    Fatigue Detected
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 max-w-xl">
                {fatigueResult.reason}
              </p>
              <div className="text-2xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                Recommendation: {fatigueResult.recommendedActivity}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsBreathingActive((prev) => !prev)}
              className="px-3.5 py-2 text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <Wind className="w-3.5 h-3.5 text-teal-500" />
              <span>{isBreathingActive ? 'Stop Breathing Pause' : '4-7-8 Breath Exercise'}</span>
            </button>
            <button
              onClick={handleScheduleProactiveBreak}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              + Add Rest Block
            </button>
          </div>
        </div>

        {/* Interactive 4-7-8 Breathing Guide */}
        {isBreathingActive && (
          <div className="mt-5 p-6 bg-white dark:bg-slate-900 rounded-xl border border-teal-200 dark:border-teal-900/50 flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-3">
              Parasympathetic Nervous Reset (4-7-8)
            </div>

            <div
              className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-1000 ${
                breathPhase === 'Inhale'
                  ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 scale-110'
                  : breathPhase === 'Hold'
                  ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/40 scale-110 ring-4 ring-amber-300/30'
                  : 'border-teal-400 bg-teal-50 dark:bg-teal-950/40 scale-90'
              }`}
            >
              <span className="text-2xl font-black font-display text-slate-900 dark:text-white">
                {breathSeconds}s
              </span>
              <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {breathPhase}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mt-4 max-w-sm">
              {breathPhase === 'Inhale' && 'Breathe in quietly through the nose for 4 seconds...'}
              {breathPhase === 'Hold' && 'Hold your breath gently for 7 seconds...'}
              {breathPhase === 'Exhale' && 'Exhale completely through your mouth with a whoosh for 8 seconds...'}
            </p>
          </div>
        )}
      </div>

      {/* Micro-Wins Vault & Competence Booster (Feature 3 Requirement) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <Trophy className="w-3.5 h-3.5" />
              <span>COMPETENCE BOOSTER VAULT</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display mt-0.5">
              Daily Micro-Wins & Self-Efficacy Log
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Celebrate tiny milestones. Self-efficacy grows not from giant leaps, but from acknowledging genuine daily progress.
            </p>
          </div>

          <button
            onClick={() => setShowAddWinForm((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-xs font-semibold rounded-lg shadow-2xs transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Micro-Win</span>
          </button>
        </div>

        {/* Add Micro-Win Form */}
        {showAddWinForm && (
          <form onSubmit={handleCreateMicroWin} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              What small victory did you conquer just now?
            </div>
            <input
              type="text"
              value={newWinTitle}
              onChange={(e) => setNewWinTitle(e.target.value)}
              placeholder="e.g., Read 5 dense pages of AP Bio, put phone on silent, drafted thesis statement..."
              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              required
            />
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="text-2xs text-slate-500">Category:</span>
                {(['focus', 'resilience', 'clarity', 'balance'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setNewWinCategory(cat)}
                    className={`text-2xs uppercase px-2 py-0.5 rounded-md font-semibold cursor-pointer ${
                      newWinCategory === cat
                        ? 'bg-amber-500 text-white'
                        : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={newWinReflection}
                onChange={(e) => setNewWinReflection(e.target.value)}
                placeholder="Optional 1-line intrinsic reflection..."
                className="flex-1 px-3 py-1.5 text-2xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => setShowAddWinForm(false)}
                  className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white rounded-lg cursor-pointer"
                >
                  Save Win
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Micro-Wins List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {microWins.map((win) => (
            <div
              key={win.id}
              className="p-3.5 bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-1.5 hover:border-amber-300 dark:hover:border-amber-800 transition-colors"
            >
              <div className="flex items-center justify-between text-2xs text-slate-400">
                <span className="font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  {win.category}
                </span>
                <span className="font-mono">{win.timestamp}</span>
              </div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {win.title}
              </p>
              {win.reflection && (
                <p className="text-2xs text-slate-500 dark:text-slate-400 italic">
                  "{win.reflection}"
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
