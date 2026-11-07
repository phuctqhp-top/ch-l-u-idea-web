import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  X,
  Compass,
  ArrowRight,
  Sun,
  Moon,
  Clock,
  Zap,
  Coffee,
  Check,
} from 'lucide-react';
import { UserProfile, PlanOption } from '../types';
import { PRESET_AUTONOMY_PLANS } from '../utils/sdtEngine';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState(profile.name);
  const [gradeLevel, setGradeLevel] = useState(profile.gradeLevel);
  const [studyRhythm, setStudyRhythm] = useState(profile.studyRhythm);
  const [currentStressLevel, setCurrentStressLevel] = useState(profile.currentStressLevel);
  const [chosenPlan, setChosenPlan] = useState(profile.chosenPlan);
  const [intrinsicMotto, setIntrinsicMotto] = useState(profile.intrinsicMotto);

  if (!isOpen) return null;

  const handleFinish = () => {
    onSaveProfile({
      ...profile,
      name,
      gradeLevel,
      studyRhythm,
      currentStressLevel,
      chosenPlan,
      intrinsicMotto,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-teal-400 flex items-center justify-center text-white text-sm font-bold">
              B
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Khảo Sát Tự Chủ Học Tập BANIPU
              </h3>
              <p className="text-2xs text-slate-500">
                Thuyết Tự Quyết (SDT Framework) · Bước {step} trên 3
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Đóng cửa sổ khảo sát"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-3 gap-2">
          <div className={`h-1.5 rounded-full ${step >= 1 ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
          <div className={`h-1.5 rounded-full ${step >= 2 ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
          <div className={`h-1.5 rounded-full ${step >= 3 ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
        </div>

        {/* Step 1: Identity & Habits */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                Cùng hiệu chỉnh lịch học theo nhịp sinh học tự nhiên
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Lịch học cứng nhắc và ép buộc dễ gây kiệt sức. BANIPU xây dựng dựa trên nhịp năng lượng cá nhân của bạn.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Họ và Tên
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Lớp / Khối Học
                </label>
                <input
                  type="text"
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Chronotype selection */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Khoảng thời gian nào não bộ bạn tỉnh táo và sáng tạo nhất?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'early_bird', label: 'Chim Sớm', time: '06:00 – 11:00', icon: '🌅' },
                  { id: 'balanced', label: 'Trưa & Đầu Chiều', time: '10:00 – 16:00', icon: '☀️' },
                  { id: 'afternoon_peak', label: 'Cuối Chiều', time: '14:00 – 19:00', icon: '⚡' },
                  { id: 'night_owl', label: 'Cú Đêm', time: '19:00 – 23:00', icon: '🌙' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setStudyRhythm(item.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      studyRhythm === item.id
                        ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60'
                    }`}
                  >
                    <div className="text-xl">{item.icon}</div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                      {item.label}
                    </div>
                    <div className="text-2xs text-slate-500 font-mono mt-0.5">{item.time}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Intrinsic Motivation Motto */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Động Lực Tự Thân Của Bạn ("Lý do tôi học là gì?")
              </label>
              <input
                type="text"
                value={intrinsicMotto}
                onChange={(e) => setIntrinsicMotto(e.target.value)}
                placeholder="VD: Tôi muốn hiểu bản chất quy luật tự nhiên và giải quyết bài toán thực tế."
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <span>Tiếp tục</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Stress Assessment */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                Đánh giá Áp lực & Băng thông Nhận thức Hiện tại
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Hiểu rõ mức độ căng thẳng giúp BANIPU căn chỉnh tần suất nghỉ ngơi và chia nhỏ nhiệm vụ phù hợp.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {[
                {
                  id: 'low',
                  title: 'Áp lực Thấp · Trạng thái Ổn định',
                  desc: 'Khối lượng bài về nhà vừa sức. Sẵn sàng cho các bài toán thách thức và ca học chuyên sâu.',
                  badge: 'Cân bằng',
                },
                {
                  id: 'moderate',
                  title: 'Áp lực Trung bình · Nhiều hạn nộp bài',
                  desc: 'Nhiều bài kiểm tra hoặc hạn nộp sắp tới. Cần nhịp độ có cấu trúc để không bị quá tải.',
                  badge: 'Chủ động nhịp độ',
                },
                {
                  id: 'high',
                  title: 'Áp lực Cao · Nguy cơ Kiệt sức',
                  desc: 'Cảm thấy mệt mỏi, hay trì hoãn do choáng ngợp hoặc giấc ngủ bị xáo trộn. Cần các vi nhiệm vụ nhẹ nhàng và nghỉ ngơi rộng rãi.',
                  badge: 'Hỗ trợ nhẹ nhàng',
                },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setCurrentStressLevel(lvl.id as any)}
                  className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    currentStressLevel === lvl.id
                      ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {lvl.title}
                    </span>
                    <span className="text-2xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300">
                      {lvl.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {lvl.desc}
                  </p>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
              >
                Quay lại
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <span>Xem Các Kế Hoạch Tự Chủ</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Autonomy Choices (Core SDT Requirement) */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>LỰA CHỌN TỰ CHỦ THEO THUYẾT TỰ QUYẾT (SDT)</span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white font-display mt-0.5">
                Chọn cấu trúc học tập tạo cảm giác thoải mái nhất cho bạn
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Không thuật toán nào áp đặt cuộc sống của bạn. Hãy chủ động chọn 1 trong 3 khung tập trung khoa học:
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {PRESET_AUTONOMY_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => setChosenPlan(plan.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    chosenPlan === plan.id
                      ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          chosenPlan === plan.id
                            ? 'border-indigo-600 bg-indigo-600 text-white'
                            : 'border-slate-400'
                        }`}
                      >
                        {chosenPlan === plan.id && <Check className="w-3 h-3" />}
                      </div>
                      <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                        {plan.name}
                      </h5>
                    </div>
                    {plan.recommended && (
                      <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                        Đề xuất cho bạn
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                    {plan.description}
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-2xs text-slate-500 dark:text-slate-400">
                    <span>Nhịp độ: <strong>{plan.focusRhythm}</strong></span>
                    <span>Mục tiêu ngày: <strong>~{plan.dailyLoadHours} giờ</strong></span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                Quay lại
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Lưu & Vào Không Gian Học Tập Của Tôi</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
