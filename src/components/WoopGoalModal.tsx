import React, { useState } from 'react';
import { X, Target, Heart, AlertCircle, Compass, CheckCircle2, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { WoopGoal } from '../types';

interface WoopGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveGoal: (goal: WoopGoal) => void;
  subjects?: Array<{ id: string; name: string }>;
}

export const WoopGoalModal: React.FC<WoopGoalModalProps> = ({
  isOpen,
  onClose,
  onSaveGoal,
  subjects = [],
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [wish, setWish] = useState('');
  const [outcome, setOutcome] = useState('');
  const [obstacle, setObstacle] = useState('');
  const [planIf, setPlanIf] = useState('');
  const [planThen, setPlanThen] = useState('');
  const [subjectTag, setSubjectTag] = useState(subjects[0]?.name || 'Toán Giải Tích 10');

  if (!isOpen) return null;

  const sampleTemplates = [
    {
      label: 'Toán học: Tránh lướt điện thoại',
      w: 'Giải quyết 3 bài toán giải tích khó trong hôm nay',
      o: 'Cảm giác nhẹ nhõm, tự tin hơn khi đến lớp và đạt điểm 9.0+',
      ob: 'Cảm giác nản lòng khi thấy bài toán lạ dẫn đến mở mạng xã hội',
      pIf: 'mình thấy muốn với tay lấy điện thoại',
      pThen: 'tôi sẽ đặt điện thoại sang phòng khác và giải trước câu dễ nhất trong 15 phút',
    },
    {
      label: 'Ngữ Văn: Vượt qua sức ỳ mở bài',
      w: 'Hoàn thành dàn ý chi tiết và 300 từ đầu bài viết 1000 từ',
      o: 'Giải tỏa hoàn toàn cảm giác lo âu trước hạn nộp ngày mai',
      ob: 'Ám ảnh sự hoàn hảo: sợ viết câu mở bài không đủ sâu sắc',
      pIf: 'cảm giác sợ viết dở xuất hiện',
      pThen: 'tôi sẽ bật đồng hồ Pomodoro 15 phút và cho phép mình viết nháp tự do mà không xóa',
    },
    {
      label: 'Sức khỏe & Giấc ngủ: Tắt màn hình đúng giờ',
      w: 'Đi ngủ trước 22:45 sau khi hoàn thành bài tập nhẹ',
      o: 'Thức dậy sáng mai với năng lượng 85% dồi dào, không đau đầu',
      ob: 'Thói quen xem thêm 1 video ngắn trên YouTube trước khi ngủ',
      pIf: 'đồng hồ điểm 22:30',
      pThen: 'tôi sẽ cắm sạc điện thoại ở bàn học và thực hiện bài thở 4-7-8',
    },
  ];

  const handleApplyTemplate = (tmpl: typeof sampleTemplates[0]) => {
    setWish(tmpl.w);
    setOutcome(tmpl.o);
    setObstacle(tmpl.ob);
    setPlanIf(tmpl.pIf);
    setPlanThen(tmpl.pThen);
  };

  const handleFinish = () => {
    if (!wish.trim()) return;

    const fullPlan = `Nếu ${planIf.trim() || obstacle.trim() || 'gặp trở ngại'}, tôi sẽ ${planThen.trim() || 'tập trung giải quyết trong 15 phút'}.`;

    const newGoal: WoopGoal = {
      id: `woop-${Date.now()}`,
      wish: wish.trim(),
      outcome: outcome.trim() || 'Đạt được mục tiêu và nâng cao năng lực tự chủ.',
      obstacle: obstacle.trim() || 'Sự xao nhãng và trì hoãn ngẫu nhiên.',
      plan: fullPlan,
      status: 'active',
      createdAt: 'Hôm nay',
      subjectTag,
    };

    onSaveGoal(newGoal);
    onClose();
    // Reset
    setStep(1);
    setWish('');
    setOutcome('');
    setObstacle('');
    setPlanIf('');
    setPlanThen('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xs font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  Mô Hình WOOP Khoa Học
                </span>
                <span className="text-2xs text-slate-400">Bước {step}/4</span>
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white font-display">
                Thiết Lập Mục Tiêu Tự Chủ Bền Vững
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {[
            { s: 1, label: 'W · Wish', name: 'Hằng Mong' },
            { s: 2, label: 'O · Outcome', name: 'Kết Quả' },
            { s: 3, label: 'O · Obstacle', name: 'Trở Ngại' },
            { s: 4, label: 'P · Plan', name: 'Nếu... Thì...' },
          ].map((item) => (
            <button
              key={item.s}
              type="button"
              onClick={() => setStep(item.s as any)}
              className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                step === item.s
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold shadow-xs'
                  : step > item.s
                  ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400'
                  : 'bg-transparent border-slate-200 dark:border-slate-800 text-slate-400'
              }`}
            >
              <div className="text-3xs font-extrabold uppercase">{item.label}</div>
              <div className="text-2xs truncate">{item.name}</div>
            </button>
          ))}
        </div>

        {/* Step 1: Wish */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
                W (Wish) - Bạn hằng mong muốn đạt được điều gì có ý nghĩa nhất trong ngày hôm nay?
              </label>
              <p className="text-2xs text-slate-500 dark:text-slate-400 mb-2">
                Hãy chọn một mục tiêu vừa tầm và truyền cảm hứng thực sự cho bạn (không phải vì bị người khác ép buộc).
              </p>
              <textarea
                value={wish}
                onChange={(e) => setWish(e.target.value)}
                placeholder="Ví dụ: Nắm vững dạng bài cực trị Toán Giải Tích và tự giải được 3 câu trắc nghiệm khó..."
                rows={3}
                className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Subject Selector */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-2xs text-slate-500 font-semibold">Gắn môn học:</span>
              {['Toán Giải Tích 10', 'Ngữ Văn 10', 'Sinh Học 10', 'Tiếng Anh 10', 'Sức Khỏe & Thể Chất'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSubjectTag(s)}
                  className={`px-2.5 py-1 rounded-lg text-2xs font-semibold cursor-pointer transition-all ${
                    subjectTag === s
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Quick Templates */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-3xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" /> Gợi ý mẫu WOOP nhanh:
              </span>
              <div className="flex flex-wrap gap-2">
                {sampleTemplates.map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyTemplate(tmpl)}
                    className="text-2xs px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    {tmpl.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Outcome */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
                O (Outcome) - Kết quả tốt nhất là gì và bạn sẽ cảm thấy thế nào khi hoàn thành?
              </label>
              <p className="text-2xs text-slate-500 dark:text-slate-400 mb-2">
                Nhắm mắt lại và hình dung rõ nét cảm xúc tự hào, nhẹ nhõm hoặc sự tự tin lan tỏa trong bạn.
              </p>
              <textarea
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                placeholder="Ví dụ: Cảm thấy vô cùng tự hào vì đã kiên trì, không còn cảm giác lo âu đè nặng, tối nay có thể thảnh thơi nghe nhạc..."
                rows={3}
                className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        )}

        {/* Step 3: Obstacle */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
                O (Obstacle) - Đâu là trở ngại nội tại chính có thể khiến bạn bỏ cuộc hoặc trì hoãn?
              </label>
              <p className="text-2xs text-slate-500 dark:text-slate-400 mb-2">
                Không phải thời tiết hay bài vở khó, mà là thói quen, cảm giác nản lòng hay sự xao nhãng từ chính bản thân bạn.
              </p>
              <textarea
                value={obstacle}
                onChange={(e) => setObstacle(e.target.value)}
                placeholder="Ví dụ: Cảm giác buồn ngủ lúc 20:30, hoặc thói quen tiện tay mở điện thoại xem tin nhắn khi gặp bài toán dài..."
                rows={3}
                className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        )}

        {/* Step 4: Plan (If... Then...) */}
        {step === 4 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
                P (Plan) - Lập kế hoạch hành động "Nếu... Thì..."
              </label>
              <p className="text-2xs text-slate-500 dark:text-slate-400 mb-3">
                Não bộ con người xử lý cấu trúc điều kiện cực kỳ hiệu quả khi trở ngại thực tế xuất hiện:
              </p>

              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-3">
                <div>
                  <span className="text-2xs font-extrabold uppercase text-indigo-600 dark:text-indigo-400">
                    NẾU [Trở ngại X xảy ra]:
                  </span>
                  <input
                    type="text"
                    value={planIf}
                    onChange={(e) => setPlanIf(e.target.value)}
                    placeholder="Ví dụ: mình thấy muốn mở điện thoại lướt mạng xã hội..."
                    className="w-full mt-1 p-2.5 text-xs bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <span className="text-2xs font-extrabold uppercase text-teal-600 dark:text-teal-400">
                    TÔI SẼ [Hành động vượt qua Y]:
                  </span>
                  <input
                    type="text"
                    value={planThen}
                    onChange={(e) => setPlanThen(e.target.value)}
                    placeholder="Ví dụ: cất điện thoại sang phòng khác và bật đồng hồ Focus 20 phút giải 1 câu dễ trước."
                    className="w-full mt-1 p-2.5 text-xs bg-white dark:bg-slate-800 border border-teal-200 dark:border-teal-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>

            {/* Preview Card */}
            {wish && (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                <span className="text-3xs font-extrabold text-slate-400 uppercase tracking-wider">
                  Xem trước Mục Tiêu WOOP:
                </span>
                <p className="font-bold text-slate-900 dark:text-white">🎯 {wish}</p>
                <p className="text-2xs text-indigo-600 dark:text-indigo-400 italic">
                  "Nếu {planIf || 'gặp trở ngại'}, tôi sẽ {planThen || 'hành động ngay'}."
                </p>
              </div>
            )}
          </div>
        )}

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as any)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay Lại</span>
            </button>
          ) : (
            <div></div>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s + 1) as any)}
              className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Tiếp Theo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Lưu Mục Tiêu WOOP & Kích Hoạt</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
