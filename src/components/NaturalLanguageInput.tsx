import React, { useState } from 'react';
import { Sparkles, Mic, ArrowRight, CheckCircle2, Clock, Brain, Layers, RefreshCw } from 'lucide-react';
import { parseNaturalLanguageStudyInput, ParsedTaskResult } from '../utils/nlpTaskParser';
import { TimelineBlock } from '../types';

interface NaturalLanguageInputProps {
  onAddBlocks: (blocks: TimelineBlock[]) => void;
  selectedDate: string;
}

const SAMPLE_PROMPTS = [
  'Tôi có bài văn 1000 từ cần nộp vào Thứ 6 và cần ôn tập Toán Chương 2',
  'Ôn thi Sinh học: Chuyển hóa & Hô hấp tế bào trong 45 phút',
  'Luyện 30 phút từ vựng Tiếng Anh Unit 4 và nghe hội thoại',
  'Đọc 20 trang Lịch Sử và lập dàn ý 3 luận điểm trọng tâm',
];

export const NaturalLanguageInput: React.FC<NaturalLanguageInputProps> = ({
  onAddBlocks,
  selectedDate,
}) => {
  const [inputText, setInputText] = useState(
    'Tôi có bài văn 1000 từ cần nộp vào Thứ 6 và cần ôn tập Toán Chương 2'
  );
  const [isListening, setIsListening] = useState(false);
  const [parsedResult, setParsedResult] = useState<ParsedTaskResult | null>(() =>
    parseNaturalLanguageStudyInput(
      'Tôi có bài văn 1000 từ cần nộp vào Thứ 6 và cần ôn tập Toán Chương 2',
      selectedDate,
      '16:30'
    )
  );
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [startTimeInput, setStartTimeInput] = useState('16:30');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleParse = (textToParse: string, startTime = startTimeInput) => {
    if (!textToParse.trim()) return;
    const result = parseNaturalLanguageStudyInput(textToParse, selectedDate, startTime);
    setParsedResult(result);
    setSelectedOptionIndex(0);
  };

  const handleSimulateVoice = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    setIsListening(true);
    const voicePrompt = 'Luyện tập bài toán cực trị hình học và viết bài phân tích Ngữ Văn';
    setTimeout(() => {
      setInputText(voicePrompt);
      setIsListening(false);
      handleParse(voicePrompt);
    }, 1800);
  };

  const handleAcceptSchedule = () => {
    if (!parsedResult) return;
    const activeOption = parsedResult.sdtAutonomyOptions[selectedOptionIndex] || {
      blocks: parsedResult.blocks,
    };

    const newBlocks: TimelineBlock[] = activeOption.blocks.map((b, idx) => ({
      ...b,
      id: `task-nlp-${Date.now()}-${idx}`,
      date: selectedDate,
      completed: false,
    }));

    onAddBlocks(newBlocks);
    setToastMessage(`Đã thêm ${newBlocks.length} ca học tự chủ vào dòng thời gian!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner explaining Trace AI style automation */}
      <div className="bg-gradient-to-r from-indigo-50/80 via-white to-teal-50/80 dark:from-indigo-950/30 dark:via-slate-900 dark:to-teal-950/30 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BỘ LẬP LỊCH TỰ NHIÊN TRACE AI</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
              Chuyển bài tập ngổn ngang thành các vi khối thời gian rõ ràng, khả thi
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Gõ hoặc nói tự nhiên dự định học tập của bạn. BANIPU sẽ tự động bẻ nhỏ các bài tập nặng thành các
              bước vi mô 20-30 phút không gây áp lực và đề xuất các phương án tự chủ phù hợp với nhịp sinh học.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Bắt đầu lúc:</span>
            <input
              type="time"
              value={startTimeInput}
              onChange={(e) => {
                setStartTimeInput(e.target.value);
                if (inputText) handleParse(inputText, e.target.value);
              }}
              className="px-2.5 py-1.5 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Natural Language Input Field */}
        <div className="mt-5 relative">
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleParse(inputText);
              }}
              placeholder="VD: Tôi có bài văn 1000 từ cần nộp vào Thứ 6 và cần ôn tập Toán Chương 2..."
              className="w-full pl-4 pr-32 py-3.5 text-sm sm:text-base bg-white dark:bg-slate-800/90 border-2 border-indigo-200 dark:border-indigo-900/60 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 dark:focus:border-indigo-400 shadow-sm transition-all"
            />
            <div className="absolute right-2 flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleSimulateVoice}
                className={`p-2 rounded-lg transition-all cursor-pointer ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
                title="Nhập giọng nói (Mô phỏng Microphone)"
                aria-label="Voice input simulation"
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleParse(inputText)}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <span>Bẻ Nhỏ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          {isListening && (
            <div className="mt-2 text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1.5 animate-pulse">
              <div className="w-2 h-2 rounded-full bg-rose-500"></div>
              <span>Đang lắng nghe kế hoạch học tập... Hãy nói tự nhiên.</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Thử mẫu câu:</span>
          {SAMPLE_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(prompt);
                handleParse(prompt);
              }}
              className="text-2xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-300 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Breakdown & Autonomy Choices Card */}
      {parsedResult && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400">
                <Brain className="w-3.5 h-3.5" />
                <span>PHÂN RÃ SƯ PHẠM AI & LỰA CHỌN TỰ CHỦ</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display mt-0.5">
                Môn học nhận diện: {parsedResult.detectedSubject}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Ước lượng tập trung: <strong className="font-semibold text-slate-800 dark:text-slate-200">{parsedResult.estimatedMinutes} phút</strong></span>
            </div>
          </div>

          {/* Autonomy Choice Selector */}
          {parsedResult.sdtAutonomyOptions.length > 1 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                Chọn chiến lược tập trung phù hợp (Ưu tiên Tự Chủ):
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {parsedResult.sdtAutonomyOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedOptionIndex(idx)}
                    className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedOptionIndex === idx
                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {opt.title}
                      </span>
                      {selectedOptionIndex === idx && (
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {opt.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Decomposed Blocks List */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Xem Trước Các Khối Giờ Lên Lịch</span>
            </div>
            <div className="space-y-3">
              {(
                parsedResult.sdtAutonomyOptions[selectedOptionIndex]?.blocks ||
                parsedResult.blocks
              ).map((block, bIdx) => (
                <div
                  key={bIdx}
                  className={`p-4 rounded-xl border transition-colors ${
                    block.type === 'rest'
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {block.startTime} – {block.endTime}
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">·</span>
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        {block.durationMinutes} phút
                      </span>
                    </div>
                    <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                      {block.type === 'rest' ? 'Nghỉ ngơi' : block.type === 'assignment' ? 'Bài tập' : 'Ôn tập'}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mt-1.5">
                    {block.title}
                  </h4>
                  {block.notes && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 italic">
                      {block.notes}
                    </p>
                  )}

                  {/* Micro-tasks pills */}
                  {block.microTasks && block.microTasks.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Các vi bước hành động để giải tỏa áp lực:
                      </div>
                      <div className="grid grid-cols-1 gap-1">
                        {block.microTasks.map((task) => (
                          <div
                            key={task.id}
                            className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-200/50 dark:border-slate-700/50"
                          >
                            <span>{task.title}</span>
                            <span className="font-mono text-slate-400 text-xs shrink-0">
                              ~{task.estimatedMinutes} phút
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SDT Pedagogical Rationale Quote */}
          <div className="p-3.5 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl text-xs text-amber-900 dark:text-amber-200">
            <strong>Góc nhìn Sư phạm Thuyết Tự Quyết (SDT):</strong> {parsedResult.pedagogicalRationale}
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              onClick={() => handleParse(inputText)}
              className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 py-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Tạo lại phương án chia nhỏ</span>
            </button>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleAcceptSchedule}
                className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Xác Nhận & Thêm Vào Dòng Thời Gian Hôm Nay</span>
              </button>
            </div>
          </div>

          {toastMessage && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs font-semibold text-emerald-800 dark:text-emerald-300 text-center animate-fade-in">
              ✓ {toastMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
