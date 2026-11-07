import React, { useState } from 'react';
import {
  Send,
  Sparkles,
  Target,
  HeartHandshake,
  ShieldAlert,
  CheckCircle2,
  Calendar,
  Compass,
  ArrowRight,
  TrendingDown,
  Wind,
  Smile,
  Frown,
  Meh,
  Activity,
  Layers,
} from 'lucide-react';
import {
  Energy4D,
  TimelineBlock,
  RaiScoreData,
  RaiLevel,
  StressLevel,
  EmotionalState,
  WoopGoal,
  SystemActionJson,
  BanipuMessage,
} from '../types';
import {
  generateBanipuCoachResponse,
  applySystemActionToSchedule,
  INITIAL_WOOP_GOALS,
  INITIAL_RAI_DATA,
} from '../utils/banipuCoachEngine';
import { WoopGoalModal } from './WoopGoalModal';

interface AiEnergyCompanionProps {
  energy: Energy4D;
  userName: string;
  blocks: TimelineBlock[];
  onUpdateBlocks: (newBlocks: TimelineBlock[]) => void;
  selectedDate: string;
  onShowToast: (title: string, subtitle: string) => void;
  onOpenFocusModal?: () => void;
}

export const AiEnergyCompanion: React.FC<AiEnergyCompanionProps> = ({
  energy,
  userName,
  blocks,
  onUpdateBlocks,
  selectedDate,
  onShowToast,
  onOpenFocusModal,
}) => {
  // Student Input Context states
  const [raiLevel, setRaiLevel] = useState<RaiLevel>('Cao');
  const [stressLevel, setStressLevel] = useState<StressLevel>('Trung bình');
  const [emotionalState, setEmotionalState] = useState<EmotionalState>('Bình tĩnh');
  const [woopGoals, setWoopGoals] = useState<WoopGoal[]>(INITIAL_WOOP_GOALS);
  const [isWoopModalOpen, setIsWoopModalOpen] = useState(false);
  const [viewTab, setViewTab] = useState<'chat' | 'woop-list' | 'sdt-analysis'>('chat');

  // Messages with Banipu
  const [messages, setMessages] = useState<BanipuMessage[]>([
    {
      id: 'm-init-1',
      sender: 'ai',
      messageToUser: `### Chào ${userName}, mình là banipu - Trợ Lý Tự Chủ & Sức Khỏe Học Đường của bạn! 🌱

Mình hoạt động dựa trên 3 nền tảng khoa học:
1. **Thuyết Tự Chủ (SDT):** Tôn trọng quyền tự quyết, bồi dưỡng năng lực tự tin và kết nối xã hội.
2. **Chỉ số Tự chủ Tương đối (RAI):** Điều chỉnh thời gian biểu theo động lực nội tại.
3. **Mô hình Mục tiêu WOOP:** Wish ➔ Outcome ➔ Obstacle ➔ Plan (Nếu... Thì...).

Hôm nay năng lượng của bạn là **${energy.overall}%** (${energy.statusText}). Bạn có muốn thiết lập một mục tiêu WOOP mới, hoặc cần mình rà soát giảm tải thời gian biểu không?`,
      timestamp: 'Vừa xong',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const raiData: RaiScoreData = INITIAL_RAI_DATA[raiLevel];

  const quickPrompts = [
    '🎯 Hướng dẫn lập mục tiêu WOOP',
    '🌿 Mình hơi mệt và căng thẳng, kích hoạt De-stress mode giúp mình',
    '📊 Đánh giá chỉ số tự chủ RAI của mình',
    '🧩 Tách nhỏ bài tập Toán & Văn thành micro-tasks',
  ];

  const handleSend = (textToSend = inputText) => {
    if (!textToSend.trim() || isProcessing) return;

    const userText = textToSend.trim();
    const userMsg: BanipuMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      messageToUser: userText,
      timestamp: 'Vừa xong',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsProcessing(true);

    setTimeout(() => {
      const response = generateBanipuCoachResponse(userText, {
        studentName: userName,
        raiScore: raiData,
        stressLevel,
        emotionalState,
        currentBlocks: blocks,
        woopGoals,
        selectedDate,
      });

      const aiMsg: BanipuMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        messageToUser: response.messageToUser,
        systemActionJson: response.systemActionJson,
        timestamp: 'Vừa xong',
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsProcessing(false);
    }, 450);
  };

  // Execute SYSTEM_ACTION_JSON onto the real user schedule
  const handleApplySystemAction = (msgId: string, actionJson: SystemActionJson) => {
    const { updatedBlocks, appliedCount, recoveryAdded } = applySystemActionToSchedule(
      actionJson,
      blocks,
      selectedDate
    );

    onUpdateBlocks(updatedBlocks);

    // Mark message as applied
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, applied: true } : m))
    );

    onShowToast(
      'Kế Hoạch Banipu Đã Áp Dụng! ✨',
      `Đã điều chỉnh ${appliedCount} ca học & kích hoạt ${recoveryAdded.length > 0 ? recoveryAdded[0] : 'chế độ giảm áp'}.`
    );
  };

  // One-click trigger De-stress Mode
  const handleTriggerDeStressDirect = () => {
    setStressLevel('Cao');
    setEmotionalState('Mệt mỏi');
    handleSend('Mình đang bị quá tải và mệt mỏi, hãy kích hoạt Chế độ Giảm áp (De-stress Mode) giúp mình');
  };

  // Add new WOOP Goal
  const handleSaveWoopGoal = (newGoal: WoopGoal) => {
    setWoopGoals((prev) => [newGoal, ...prev]);
    onShowToast(
      'Mục Tiêu WOOP Đã Lưu! 🎯',
      `"Nếu ${newGoal.obstacle}, tôi sẽ..." đã được đưa vào hệ thống tự chủ.`
    );

    // Bot follows up with praise
    setTimeout(() => {
      const followUpMsg: BanipuMessage = {
        id: `ai-woop-${Date.now()}`,
        sender: 'ai',
        messageToUser: `### Tuyệt vời lắm ${userName}! Mục tiêu WOOP đã được kích hoạt 🎉\n\n- **Hằng mong (Wish):** ${newGoal.wish}\n- **Kế hoạch ứng phó:** *"${newGoal.plan}"*\n\nKhi bạn đã chuẩn bị trước phương án hành động cho trở ngại, não bộ sẽ tự động phản xạ theo kế hoạch mà không tốn ý chí đấu tranh. Chúc bạn một buổi học đầy tự chủ và nhẹ nhàng nhé!`,
        timestamp: 'Vừa xong',
      };
      setMessages((prev) => [...prev, followUpMsg]);
    }, 300);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col h-full min-h-[580px] space-y-4">
      {/* 1. Header with Coach Branding */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 via-indigo-600 to-indigo-700 flex items-center justify-center text-white text-base font-extrabold shadow-md shadow-indigo-500/20">
            🌱
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white font-display">
                banipu · Trợ Lý Tự Chủ & Sức Khỏe Học Đường
              </h3>
              <span className="text-3xs font-extrabold px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                SDT · RAI · WOOP
              </span>
            </div>
            <p className="text-2xs text-slate-500 dark:text-slate-400 mt-0.5">
              Đồng hành tâm lý, bảo vệ sức khỏe tâm thần và tối ưu thời gian biểu tự quyết
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 self-start sm:self-center text-2xs font-semibold">
          <button
            onClick={() => setViewTab('chat')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              viewTab === 'chat'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Trò Chuyện AI
          </button>
          <button
            onClick={() => setViewTab('woop-list')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
              viewTab === 'woop-list'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Target className="w-3 h-3 text-amber-500" />
            <span>Mục Tiêu WOOP ({woopGoals.length})</span>
          </button>
          <button
            onClick={() => setViewTab('sdt-analysis')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              viewTab === 'sdt-analysis'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Chỉ Số RAI & Cảm Xúc
          </button>
        </div>
      </div>

      {/* 2. Interactive Input Context Bar (RAI, Stress, Emotion) */}
      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5">
        <div className="flex items-center justify-between text-2xs font-bold text-slate-500 uppercase tracking-wider">
          <span>Check-in Đầu Vào Hệ Thống (Input Context)</span>
          <span className="text-indigo-600 dark:text-indigo-400">Thời gian thực</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* RAI Selector */}
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-2xs font-bold text-slate-600 dark:text-slate-300">
                Chỉ số Tự chủ (RAI):
              </span>
              <span className="text-2xs font-extrabold text-teal-600 dark:text-teal-400">
                {raiLevel} ({raiData.score > 0 ? '+' : ''}{raiData.score})
              </span>
            </div>
            <div className="flex gap-1 pt-0.5">
              {(['Thấp', 'Trung bình', 'Cao'] as RaiLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setRaiLevel(lvl)}
                  className={`flex-1 py-1 rounded-lg text-2xs font-semibold cursor-pointer transition-all ${
                    raiLevel === lvl
                      ? 'bg-teal-600 text-white shadow-2xs'
                      : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Stress Level Selector */}
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-2xs font-bold text-slate-600 dark:text-slate-300">
                Mức Căng Thẳng (Stress):
              </span>
              <span
                className={`text-2xs font-extrabold ${
                  stressLevel === 'Quá tải' || stressLevel === 'Cao'
                    ? 'text-rose-500'
                    : stressLevel === 'Trung bình'
                    ? 'text-amber-500'
                    : 'text-emerald-500'
                }`}
              >
                {stressLevel}
              </span>
            </div>
            <div className="flex gap-1 pt-0.5">
              {(['Thấp', 'Trung bình', 'Cao', 'Quá tải'] as StressLevel[]).map((st) => (
                <button
                  key={st}
                  onClick={() => setStressLevel(st)}
                  className={`flex-1 py-1 rounded-lg text-2xs font-semibold cursor-pointer transition-all ${
                    stressLevel === st
                      ? st === 'Quá tải' || st === 'Cao'
                        ? 'bg-rose-600 text-white'
                        : 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Emotional State Selector */}
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-2xs font-bold text-slate-600 dark:text-slate-300">
                Cảm xúc hiện tại:
              </span>
              <span className="text-2xs font-extrabold text-indigo-600 dark:text-indigo-400">
                {emotionalState}
              </span>
            </div>
            <select
              value={emotionalState}
              onChange={(e) => setEmotionalState(e.target.value as EmotionalState)}
              aria-label="Chọn cảm xúc hiện tại"
              className="w-full p-1 text-2xs bg-slate-100 dark:bg-slate-700 rounded-lg border-0 text-slate-800 dark:text-slate-200 font-semibold focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              {(
                ['Bình tĩnh', 'Hào hứng', 'Vui vẻ', 'Mệt mỏi', 'Lo âu', 'Chán nản', 'Áp lực'] as EmotionalState[]
              ).map((em) => (
                <option key={em} value={em}>
                  {em}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsWoopModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Target className="w-3.5 h-3.5 text-amber-300" />
              <span>+ Thiết Lập Mục Tiêu WOOP</span>
            </button>

            <button
              onClick={handleTriggerDeStressDirect}
              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
              title="Kích hoạt chế độ giảm áp thời gian biểu tự động"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
              <span>Kích Hoạt De-Stress Mode</span>
            </button>
          </div>

          <span className="text-3xs text-slate-400 italic">
            Tự chủ (Autonomy) = Học vì mục tiêu có ý nghĩa, không áp lực
          </span>
        </div>
      </div>

      {/* 3. Main Body - Chat or WOOP List */}
      {viewTab === 'chat' && (
        <div className="flex-1 flex flex-col min-h-0 space-y-3">
          {/* Messages Scroll View */}
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 max-h-[360px] scrollbar-thin">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div
                  className={`p-4 rounded-2xl text-xs max-w-[92%] sm:max-w-[85%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-xs shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-bl-xs shadow-xs'
                  }`}
                >
                  {/* Markdown formatted text */}
                  <div className="whitespace-pre-line space-y-2">
                    {m.messageToUser}
                  </div>

                  {/* Render SYSTEM_ACTION_JSON card if provided */}
                  {m.systemActionJson && (
                    <div className="mt-3.5 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2.5 text-slate-800 dark:text-slate-200">
                      <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                        <span className="text-3xs font-extrabold uppercase tracking-wider text-slate-400">
                          Đề xuất Kỹ Thuật (SYSTEM_ACTION_JSON)
                        </span>
                        <span
                          className={`text-2xs font-extrabold px-2 py-0.5 rounded-full ${
                            m.systemActionJson.action_type === 'DE_STRESS_MODE'
                              ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                              : m.systemActionJson.action_type === 'ADJUST_LIGHT'
                              ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                              : 'bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-300 dark:border-teal-800'
                          }`}
                        >
                          {m.systemActionJson.action_type}
                        </span>
                      </div>

                      <p className="text-2xs text-slate-600 dark:text-slate-400 font-semibold">
                        📊 {m.systemActionJson.status_summary}
                      </p>

                      {/* Modifications List */}
                      {m.systemActionJson.schedule_modifications.length > 0 && (
                        <div className="space-y-1 text-2xs">
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            Điều chỉnh lịch học đề xuất:
                          </span>
                          {m.systemActionJson.schedule_modifications.map((mod, modIdx) => (
                            <div
                              key={modIdx}
                              className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                            >
                              <TrendingDown className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                              <span>
                                {mod.action === 'REDUCE_DURATION'
                                  ? `Rút ngắn thời lượng: ${mod.original_title || 'Ca học'} (còn ${mod.reduced_minutes} phút)`
                                  : `Dời nhiệm vụ: ${mod.original_title || 'Ca học'} sang ${mod.new_time}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Recovery Activities */}
                      {m.systemActionJson.suggested_recovery_activities.length > 0 && (
                        <div className="space-y-1 text-2xs">
                          <span className="font-bold text-teal-700 dark:text-teal-300 flex items-center gap-1">
                            <Wind className="w-3.5 h-3.5" /> Hoạt động hồi phục tâm lý gợi ý:
                          </span>
                          <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-0.5">
                            {m.systemActionJson.suggested_recovery_activities.map((act, aIdx) => (
                              <li key={aIdx}>{act}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Interactive Apply Button */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        {m.applied ? (
                          <span className="text-2xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Đã áp dụng thay đổi lên Lịch trình
                          </span>
                        ) : (
                          <button
                            onClick={() => handleApplySystemAction(m.id, m.systemActionJson!)}
                            className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-2xs shadow-xs transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Calendar className="w-3 h-3" />
                            <span>Áp Dụng Thay Đổi Lên Lịch Trình Ngay</span>
                          </button>
                        )}

                        <span className="text-3xs text-slate-400">Tự động đồng bộ</span>
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-3xs text-slate-400 px-1">{m.timestamp}</span>
              </div>
            ))}

            {isProcessing && (
              <div className="flex items-center gap-2 p-3 text-xs text-slate-400 bg-slate-50 dark:bg-slate-800 rounded-2xl w-fit">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-teal-500" />
                <span>banipu đang phân tích nhịp tâm lý và tính toán lịch trình...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-2xs scrollbar-none">
            {quickPrompts.map((p, pIdx) => (
              <button
                key={pIdx}
                onClick={() => handleSend(p)}
                className="whitespace-nowrap px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950 text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="relative flex items-center pt-1 border-t border-slate-100 dark:border-slate-800"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Nhắn với banipu: 'Mình thấy bài Toán này khó quá', 'Lập kế hoạch WOOP'..."
              className="w-full pl-3.5 pr-11 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isProcessing}
              className="absolute right-1.5 p-1.5 bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 active:scale-95 disabled:opacity-40 text-white rounded-xl transition-all cursor-pointer shadow-xs"
              aria-label="Gửi tin nhắn"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* View Tab 2: WOOP Goals List */}
      {viewTab === 'woop-list' && (
        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Danh sách Mục Tiêu WOOP của bạn ({woopGoals.length}):
            </span>
            <button
              onClick={() => setIsWoopModalOpen(true)}
              className="text-2xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
            >
              + Tạo mục tiêu mới
            </button>
          </div>

          {woopGoals.map((g) => (
            <div
              key={g.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center text-xs font-bold">
                    W
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-white">{g.wish}</h4>
                </div>
                {g.subjectTag && (
                  <span className="text-3xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {g.subjectTag}
                  </span>
                )}
              </div>

              <div className="pl-8 space-y-1 text-2xs text-slate-600 dark:text-slate-300">
                <p>
                  <strong className="text-teal-600 dark:text-teal-400">Kết quả (Outcome):</strong> {g.outcome}
                </p>
                <p>
                  <strong className="text-amber-600 dark:text-amber-400">Trở ngại (Obstacle):</strong> {g.obstacle}
                </p>
                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 font-semibold italic mt-1.5">
                  👉 "{g.plan}"
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Tab 3: SDT & RAI Analysis */}
      {viewTab === 'sdt-analysis' && (
        <div className="flex-1 space-y-4 overflow-y-auto pr-1 text-xs">
          <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 space-y-2">
            <h4 className="font-bold text-teal-800 dark:text-teal-300 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-teal-600" />
              <span>Chỉ số Tự chủ Tương đối (RAI = {raiData.score > 0 ? '+' : ''}{raiData.score})</span>
            </h4>
            <p className="text-2xs text-teal-900 dark:text-teal-200 leading-relaxed">
              {raiData.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-3xs font-bold text-slate-400 uppercase">1. Tự Chủ (Autonomy)</span>
              <p className="font-bold text-slate-900 dark:text-white">Quyền tự quyết lịch học</p>
              <p className="text-3xs text-slate-500">Học sinh tự do chọn thứ tự ca học và khung giờ nghỉ.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-3xs font-bold text-slate-400 uppercase">2. Năng Lực (Competence)</span>
              <p className="font-bold text-slate-900 dark:text-white">Vi thành tựu & Vùng ZPD</p>
              <p className="text-3xs text-slate-500">Mỗi nỗ lực nhỏ đều được ghi nhận qua Micro-wins.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-3xs font-bold text-slate-400 uppercase">3. Kết Nối (Relatedness)</span>
              <p className="font-bold text-slate-900 dark:text-white">Đồng hành ấm áp</p>
              <p className="text-3xs text-slate-500">banipu phản hồi không phán xét, kết nối bạn bè.</p>
            </div>
          </div>
        </div>
      )}

      {/* WOOP Goal Modal */}
      <WoopGoalModal
        isOpen={isWoopModalOpen}
        onClose={() => setIsWoopModalOpen(false)}
        onSaveGoal={handleSaveWoopGoal}
      />
    </div>
  );
};
