import { TimelineBlock, PlanOption, UserProfile, MicroWin } from '../types';

/**
 * Self-Determination Theory (SDT) Core Engine for BANIPU
 * Governs Autonomy, Competence, and Adaptive Rest logic.
 */

export function timeStringToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

export function minutesToTimeString(totalMinutes: number): string {
  const normalized = Math.max(0, Math.min(24 * 60 - 1, totalMinutes));
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export const PRESET_AUTONOMY_PLANS: PlanOption[] = [
  {
    id: 'deep-flow',
    name: 'Kế Hoạch Alpha · Tập Trung Sâu (Deep Flow)',
    tagline: 'Ít ca học hơn, thời lượng sâu hơn để giải quyết bài toán phức tạp',
    description: 'Các chu kỳ 50 phút tập trung cao độ, xen kẽ 10-15 phút nghỉ ngơi nạp lại năng lượng nhận thức. Rất phù hợp khi làm đề Toán chuyên sâu hoặc viết bài phân tích Văn học.',
    focusRhythm: '50 phút tập trung / 10 phút nghỉ tái tạo',
    dailyLoadHours: 3.5,
    philosophy: 'Bảo vệ băng thông não bộ bằng cách triệt tiêu việc chuyển ngữ cảnh liên tục.',
    suitableFor: 'Học sinh THPT thích làm việc liền mạch, không bị gián đoạn.',
    recommended: false,
  },
  {
    id: 'spaced-harmony',
    name: 'Kế Hoạch Beta · Nhịp Điệu Cách Quãng (Spaced Pomodoro)',
    tagline: 'Khoảng thời gian cân bằng với truy hồi chủ động và nhịp độ ổn định',
    description: 'Phiên học 25 phút Pomodoro kèm quãng nghỉ ngắn có chủ đích. Ngăn ngừa tình trạng uể oải buổi chiều trong khi vẫn duy trì khả năng ghi nhớ kiến thức tối ưu.',
    focusRhythm: '25 phút tập trung / 5 phút nghỉ ngắn',
    dailyLoadHours: 3.0,
    philosophy: 'Cơ chế ngắt quãng dựa trên khoa học thần kinh giúp tối đa hóa hiệu suất bộ nhớ làm việc.',
    suitableFor: 'Học sinh cần cân bằng nhiều môn học khác nhau trong một buổi tối.',
    recommended: true,
  },
  {
    id: 'gentle-resilience',
    name: 'Kế Hoạch Gamma · Khởi Động Nhẹ Nhàng (Gentle Momentum)',
    tagline: 'Khởi đầu với lực cản thấp nhất để vượt qua trì hoãn và căng thẳng',
    description: 'Các vi khối giờ học ngắn bắt đầu từ 15-20 phút với khoảng thời gian đệm thoải mái. Tập trung tạo đà tâm lý thay vì áp lực khối lượng.',
    focusRhythm: '15-20 phút vi nhiệm vụ / nghỉ ngơi linh hoạt',
    dailyLoadHours: 2.0,
    philosophy: 'Hạ thấp năng lượng kích hoạt, xây dựng sự tự tin nội tại mà không gây hoảng loạn.',
    suitableFor: 'Tuần ôn thi cao điểm hoặc học sinh đang cảm thấy quá tải bài vở.',
    recommended: false,
  },
];

export interface StressDetectionResult {
  needsRest: boolean;
  consecutiveMinutes: number;
  reason: string;
  suggestedBreakMinutes: number;
  recommendedActivity: string;
}

/**
 * Analyzes scheduled blocks to spot fatigue patterns or continuous study stretches.
 */
export function detectFatiguePattern(blocks: TimelineBlock[]): StressDetectionResult {
  // Sort blocks chronologically
  const studyBlocks = blocks
    .filter((b) => b.type === 'study' || b.type === 'assignment' || b.type === 'review')
    .sort((a, b) => timeStringToMinutes(a.startTime) - timeStringToMinutes(b.startTime));

  let currentStreakMinutes = 0;
  let maxConsecutiveMinutes = 0;
  let lastEndMinutes = -1;

  for (const block of studyBlocks) {
    const startM = timeStringToMinutes(block.startTime);
    const endM = timeStringToMinutes(block.endTime);
    const duration = Math.max(15, endM - startM);

    if (lastEndMinutes !== -1 && startM - lastEndMinutes <= 15) {
      // Continuous or near-continuous block
      currentStreakMinutes += duration;
    } else {
      currentStreakMinutes = duration;
    }

    lastEndMinutes = endM;
    if (currentStreakMinutes > maxConsecutiveMinutes) {
      maxConsecutiveMinutes = currentStreakMinutes;
    }
  }

  if (maxConsecutiveMinutes >= 120) {
    return {
      needsRest: true,
      consecutiveMinutes: maxConsecutiveMinutes,
      reason: `Bạn đã tập trung liên tục ${maxConsecutiveMinutes} phút. Mệt mỏi thần kinh có thể làm giảm khả năng ghi nhớ đến 40%.`,
      suggestedBreakMinutes: 15,
      recommendedActivity: 'Thực hiện bài thở sâu 4-7-8 hoặc đi dạo 10 phút rời xa màn hình thiết bị.',
    };
  }

  if (studyBlocks.length >= 5 && maxConsecutiveMinutes >= 90) {
    return {
      needsRest: true,
      consecutiveMinutes: maxConsecutiveMinutes,
      reason: `Phát hiện cường độ học dồn (${studyBlocks.length} ca liên tiếp hôm nay). Nghỉ ngơi ngắn sẽ giúp bộ não phục hồi sự minh mẫn.`,
      suggestedBreakMinutes: 10,
      recommendedActivity: 'Uống nước ấm, duỗi cơ vai và nhắm mắt thư giãn 5 phút.',
    };
  }

  return {
    needsRest: false,
    consecutiveMinutes: maxConsecutiveMinutes,
    reason: 'Nhịp độ học tập đang rất cân bằng và bền vững.',
    suggestedBreakMinutes: 5,
    recommendedActivity: 'Uống một ngụm nước mát giữa các ca học.',
  };
}

export interface CompetenceStats {
  completedTasks: number;
  totalTasks: number;
  completionRate: number;
  microWinsCount: number;
  positiveFeedback: string;
  encouragementQuote: string;
}

/**
 * Generates positive, non-judgmental SDT competence affirmations.
 */
export function calculateCompetenceMetrics(
  blocks: TimelineBlock[],
  microWins: MicroWin[]
): CompetenceStats {
  const total = blocks.filter((b) => b.type !== 'rest').length;
  const completed = blocks.filter((b) => b.type !== 'rest' && b.completed).length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const microWinsCount = microWins.length;

  let positiveFeedback = 'Mỗi bước tiến nhỏ hôm nay đều củng cố đường mòn thần kinh và năng lực tự chủ của bạn.';
  if (rate >= 80) {
    positiveFeedback = 'Phong độ xuất sắc! Bạn đã thực hiện kế hoạch với sự tập trung và kiên định đáng nể.';
  } else if (rate >= 50) {
    positiveFeedback = 'Đà học tập rất vững vàng! Hãy nhớ rằng: sự đều đặn quan trọng hơn sự hoàn hảo tuyệt đối.';
  } else if (completed > 0) {
    positiveFeedback = 'Tuyệt vời cho vi thành tựu đầu tiên! Bắt đầu luôn là rào cản lớn nhất, và bạn đã vượt qua.';
  } else {
    positiveFeedback = 'Sẵn sàng bất cứ khi nào bạn muốn. Hãy chọn một nhiệm vụ nhỏ 10 phút để lấy đà.';
  }

  const encouragementQuote =
    'Năng lực thực sự không phải là làm mọi thứ cùng lúc — mà là biết cách chọn việc trọng tâm với lòng kiên nhẫn và sự thấu hiểu bản thân.';

  return {
    completedTasks: completed,
    totalTasks: total,
    completionRate: rate,
    microWinsCount,
    positiveFeedback,
    encouragementQuote,
  };
}

/**
 * Proactively inserts an adaptive rest block into the timeline if fatigue is high.
 */
export function createAdaptiveRestBlock(
  date: string,
  startTime: string,
  durationMinutes = 15
): TimelineBlock {
  const startM = timeStringToMinutes(startTime);
  const endM = startM + durationMinutes;

  return {
    id: `rest-${Date.now()}`,
    title: '🌿 Nghỉ Thở Tự Chủ & Tái Tạo Não Bộ (4-7-8 Breathing)',
    type: 'rest',
    date,
    startTime,
    endTime: minutesToTimeString(endM),
    durationMinutes,
    completed: false,
    isAdaptiveBreak: true,
    notes: 'Quãng nghỉ phục hồi chủ động được Banipu AI đề xuất để bảo vệ độ bền nhận thức.',
    microTasks: [
      { id: 'rest-1', title: 'Rời mắt khỏi màn hình & nhìn xa 6 mét trong 20 giây', estimatedMinutes: 3, completed: false },
      { id: 'rest-2', title: 'Thực hiện 3 chu kỳ bài thở 4-7-8 điều hòa hệ thần kinh', estimatedMinutes: 4, completed: false },
      { id: 'rest-3', title: 'Uống một ly nước lọc để bù nước cho não bộ', estimatedMinutes: 2, completed: false },
    ],
  };
}
