import {
  RaiScoreData,
  RaiLevel,
  StressLevel,
  EmotionalState,
  WoopGoal,
  SystemActionJson,
  BanipuMessage,
  TimelineBlock,
} from '../types';
import { minutesToTimeString, timeStringToMinutes } from './sdtEngine';

export const BANIPU_SYSTEM_PROMPT = `
# SYSTEM PROMPT: ASSISTANT BANIPU - SMART AUTONOMY & WELLBEING COACH

## 1. VAI TRÒ & TRIẾT LÝ HẠT NHÂN
Bạn là banipu, một Trợ lý AI thông minh tích hợp trên website quản lý học tập và tâm lý dành cho học sinh. 
Mục tiêu chính của bạn là hỗ trợ học sinh thiết lập mục tiêu, phân bổ thời gian biểu tối ưu và chủ động điều chỉnh tải lượng công việc để bảo vệ sức khỏe tâm thần, dựa trên 3 nền tảng khoa học:
1. Thuyết Tự Chủ (Self-Determination Theory - SDT): Nuôi dưỡng 3 nhu cầu tâm lý cơ bản (Năng lực - Competence, Tự chủ - Autonomy, Kết nối - Relatedness).
2. Chỉ số Tự chủ Tương đối (RAI - Relative Autonomy Index): Đo lường động lực học tập (từ Ngoại tại/Áp lực đến Nội tại/Tự nguyện).
3. Mô hình Thiết lập Mục tiêu WOOP: Wish (Hằng mong) -> Outcome (Kết quả) -> Obstacle (Trở ngại) -> Plan (Kế hoạch Nếu... Thì...).

## 2. NGUYÊN TẮC HOẠT ĐỘNG KHÁCH HÀNG & PHÂN TÍCH DỮ LIỆU INPUT
Mỗi phiên tương tác hoặc khi cập nhật hệ thống, bạn nhận các chỉ số đầu vào:
- RAI_Score: Thấp / Trung bình / Cao
- Stress_Level: Thấp / Trung bình / Cao / Quá tải
- Emotional_State: Vui vẻ, Mệt mỏi, Lo âu, Chán nản, Hào hứng, Bình tĩnh, Áp lực
- Student_Goals: Danh sách mục tiêu

## 3. QUY TRÌNH XỬ LÝ & ĐỀ XUẤT LỊCH TRÌNH
- Bước 1: Thiết lập mục tiêu theo chuẩn WOOP (Wish, Outcome, Obstacle, Plan: Nếu [Trở ngại X], tôi sẽ [Hành động Y]).
- Bước 2: Phân bổ thời gian dựa trên chỉ số RAI (Cao -> Deep focus; Trung bình -> Micro-rewards; Thấp -> Quick-wins, low resistance).
- Bước 3: Cơ chế Tự động Điều chỉnh Thời gian biểu (Adaptive Scheduling):
  Khi Stress_Level ở mức "Cao/Quá tải" hoặc RAI giảm sút:
  1. Kích hoạt Chế độ Giảm áp (De-stress Mode): Tạm ẩn/dời nhiệm vụ chưa gấp, giảm 30%-50% thời gian học trong ngày.
  2. Đề xuất Thay thế Tự chọn: Bài thở 4-7-8, Chánh niệm 5p, Đi dạo, Nghe nhạc, Viết nhật ký, Flashcard nhẹ.
  3. Phản hồi Đồng cảm: Giọng văn ấm áp, khẳng định nghỉ ngơi là cần thiết.

## 4. TÔNG GIỌNG
- Thân thiện, Đồng cảm, Thấu hiểu, không phán xét hay ép buộc.
- Tôn trọng Quyền Tự chủ: "Bạn có muốn...", "Mình đề xuất...", "Bạn chọn phương án nào?".
- Trình bày Markdown rõ ràng (bảng, gạch đầu dòng).

## 5. CẤU TRÚC PHẢN HỒI (OUTPUT FORMAT)
MESSAGE_TO_USER: [Lời nhắn thân thiện, phân tích cảm xúc & giải pháp]
SYSTEM_ACTION_JSON:
{
  "status_summary": "...",
  "action_type": "KEEP_SCHEDULE | ADJUST_LIGHT | DE_STRESS_MODE",
  "schedule_modifications": [
    {
      "task_id": "...",
      "action": "RESCHEDULE / REMOVE / REDUCE_DURATION",
      "new_time": "..."
    }
  ],
  "suggested_recovery_activities": ["..."]
}
`;

export const INITIAL_WOOP_GOALS: WoopGoal[] = [
  {
    id: 'woop-1',
    wish: 'Hoàn thành trọn vẹn 3 đề Toán Đạo hàm & Cực trị tuần này',
    outcome: 'Tự tin bước vào kỳ kiểm tra 1 tiết, hiểu sâu bản chất toán học và đạt điểm 9.0+',
    obstacle: 'Thói quen mở điện thoại lướt mạng xã hội khi bắt gặp bài toán hình học khó',
    plan: 'Nếu mình thấy muốn với tay lấy điện thoại, tôi sẽ đặt điện thoại sang phòng khác và bật chế độ Focus 20 phút giải trước 1 câu dễ nhất.',
    status: 'active',
    createdAt: 'Hôm nay',
    subjectTag: 'Toán Giải Tích 10',
  },
  {
    id: 'woop-2',
    wish: 'Viết xong dàn ý và đoạn mở bài cho bài luận Ngữ Văn 1000 từ',
    outcome: 'Trút bỏ hoàn toàn gánh nặng tâm lý trước hạn nộp Thứ 6, ngủ ngon giấc',
    obstacle: 'Cảm giác cầu toàn: sợ viết câu mở bài không hay dẫn đến trì hoãn không dám bắt đầu',
    plan: 'Nếu cảm giác sợ viết ùa tới, tôi sẽ cho phép mình viết bản nháp nháp thô trong 15 phút mà không phán xét câu chữ.',
    status: 'active',
    createdAt: 'Hôm qua',
    subjectTag: 'Ngữ Văn 10',
  },
];

export const INITIAL_RAI_DATA: Record<RaiLevel, RaiScoreData> = {
  Cao: {
    level: 'Cao',
    score: 18,
    label: 'Động lực Nội tại (Autonomous - Tự nguyện)',
    description: 'Bạn học vì sự tò mò và niềm vui khám phá. Khả năng tự điều chỉnh và duy trì sự bền bỉ rất cao.',
  },
  'Trung bình': {
    level: 'Trung bình',
    score: 8,
    label: 'Động lực Đồng hóa (Identified Regulation)',
    description: 'Bạn nhận thức được tầm quan trọng của bài học nhưng đôi khi vẫn cần các mốc chia nhỏ (Micro-tasks) để vượt qua sức ỳ.',
  },
  Thấp: {
    level: 'Thấp',
    score: -6,
    label: 'Động lực Ngoại tại / Bị ép buộc (External Regulation)',
    description: 'Bạn đang cảm thấy áp lực từ bên ngoài hoặc cảm giác phải học. Cần ưu tiên các mục tiêu "Dễ thắng" và quyền tự chọn.',
  },
};

export interface BanipuEngineContext {
  studentName: string;
  raiScore: RaiScoreData;
  stressLevel: StressLevel;
  emotionalState: EmotionalState;
  currentBlocks: TimelineBlock[];
  woopGoals: WoopGoal[];
  selectedDate: string;
}

export function generateBanipuCoachResponse(
  prompt: string,
  ctx: BanipuEngineContext
): { messageToUser: string; systemActionJson: SystemActionJson } {
  const lower = prompt.toLowerCase();
  const isOverwhelmed = ctx.stressLevel === 'Quá tải' || ctx.stressLevel === 'Cao';
  const isFatigued = ctx.emotionalState === 'Mệt mỏi' || ctx.emotionalState === 'Lo âu' || ctx.emotionalState === 'Áp lực';

  // Case 1: Student mentions stress, tiredness, overload, or requested De-stress
  if (
    lower.includes('mệt') ||
    lower.includes('stress') ||
    lower.includes('căng thẳng') ||
    lower.includes('quá tải') ||
    lower.includes('nghỉ') ||
    lower.includes('giảm tải') ||
    lower.includes('de-stress') ||
    isOverwhelmed ||
    isFatigued
  ) {
    const studyTasks = ctx.currentBlocks.filter(
      (b) => !b.completed && b.type !== 'rest'
    );

    const modifications = studyTasks.slice(0, 2).map((t, idx) => {
      const reducedM = Math.max(15, Math.round(t.durationMinutes * 0.6)); // Reduce duration by 40%
      if (idx === 0) {
        return {
          task_id: t.id,
          action: 'REDUCE_DURATION' as const,
          reduced_minutes: reducedM,
          original_title: t.title,
        };
      }
      return {
        task_id: t.id,
        action: 'RESCHEDULE' as const,
        new_time: 'Ngày mai (19:30)',
        original_title: t.title,
      };
    });

    const systemAction: SystemActionJson = {
      status_summary: `Căng thẳng mức ${ctx.stressLevel} · Cảm xúc: ${ctx.emotionalState} · RAI: ${ctx.raiScore.level} (${ctx.raiScore.score > 0 ? '+' : ''}${ctx.raiScore.score})`,
      action_type: 'DE_STRESS_MODE',
      schedule_modifications: modifications,
      suggested_recovery_activities: [
        'Bài thở phế vị 4-7-8 (3 chu kỳ)',
        'Rời màn hình, uống 200ml nước ấm',
        'Nghe nhạc lofi thư giãn không lời 10 phút',
        'Chuyển bài tập sang học bằng Flashcard / Video tóm tắt nhẹ nhàng',
      ],
    };

    const messageToUser = `### Chào ${ctx.studentName}, mình cảm nhận bạn đang ${ctx.emotionalState.toLowerCase()} 🌿

Theo nguyên lý **Thuyết Tự Chủ (SDT)**, sức khỏe tinh thần chính là nhiên liệu số một để duy trì năng lực học tập bền vững. Khi mức căng thẳng đang ở ngưỡng **${ctx.stressLevel}**, việc cố gắng học dồn chỉ làm giảm 70% hiệu suất tiếp thu.

Mình đề xuất **Chế độ Giảm áp (De-stress Mode)** tự chọn cho bạn:
- 📉 **Rút ngắn 40% thời gian** ca học nặng nhất hôm nay để giảm áp lực thần kinh.
- 🗓️ **Tạm dời nhiệm vụ chưa gấp** sang ngày mai khi pin năng lượng được sạc lại.
- 🧘 **Bổ sung 15 phút xả tải**: Thở 4-7-8 hoặc giãn cơ nhẹ nhàng.

> *"Bạn hoàn toàn có quyền nghỉ ngơi mà không cần cảm thấy có lỗi. Nghỉ ngơi có chiến lược chính là một phần của thành công."*

Bạn có muốn mình cập nhật lại thời gian biểu chiều và tối nay theo phương án này không? Nhấn nút bên dưới để áp dụng nhé!`;

    return { messageToUser, systemActionJson: systemAction };
  }

  // Case 2: Student wants WOOP goal guidance
  if (
    lower.includes('woop') ||
    lower.includes('mục tiêu') ||
    lower.includes('wish') ||
    lower.includes('lập kế hoạch') ||
    lower.includes('trì hoãn')
  ) {
    const systemAction: SystemActionJson = {
      status_summary: `Thiết lập Mục tiêu theo Mô hình WOOP · Động lực: ${ctx.raiScore.label}`,
      action_type: 'ADJUST_LIGHT',
      schedule_modifications: [],
      suggested_recovery_activities: [
        'Thực hành hình dung kết quả tích cực (Outcome Visualization)',
        'Gắn kế hoạch Nếu... Thì... vào báo thức điện thoại',
      ],
    };

    const messageToUser = `### Cùng thiết lập Mục Tiêu theo Chuẩn WOOP nhé ${ctx.studentName}! 🎯

Phương pháp **WOOP (Wish - Outcome - Obstacle - Plan)** được chứng minh khoa học giúp tăng gấp đôi khả năng duy trì mục tiêu nhờ việc chuẩn bị trước cho trở ngại:

1. **W (Wish - Hằng mong):** Chọn một mục tiêu học tập có ý nghĩa cá nhân trong 24h tới (Ví dụ: *Hoàn thành bài tập Toán Hình*).
2. **O (Outcome - Kết quả tốt nhất):** Cảm xúc tự hào, nhẹ nhõm và tự tin khi giải quyết xong bài tập.
3. **O (Obstacle - Trở ngại nội tại):** Nhận diện điểm yếu (Ví dụ: *Cảm giác buồn ngủ lúc 20:00* hoặc *Lướt mạng xã hội*).
4. **P (Plan - Kế hoạch Nếu... Thì...):** 
   > **"NẾU [Trở ngại X xảy ra], TÔI SẼ [Hành động ứng phó Y]"**

Bạn có muốn mở ngay **Trình hướng dẫn WOOP** để ghi lại mục tiêu và đưa trực tiếp vào thời gian biểu không?`;

    return { messageToUser, systemActionJson: systemAction };
  }

  // Case 3: RAI score inquiry or study strategy
  if (lower.includes('rai') || lower.includes('động lực') || lower.includes('tự chủ')) {
    const isHighRai = ctx.raiScore.level === 'Cao';
    const isLowRai = ctx.raiScore.level === 'Thấp';

    const systemAction: SystemActionJson = {
      status_summary: `Phân tích Chỉ số Tự chủ Tương đối (RAI = ${ctx.raiScore.score > 0 ? '+' : ''}${ctx.raiScore.score}) · Mức ${ctx.raiScore.level}`,
      action_type: 'KEEP_SCHEDULE',
      schedule_modifications: [],
      suggested_recovery_activities: [
        'Ghi nhận 1 Micro-win sau mỗi phiên học',
        'Tự do chọn thứ tự hoàn thành các môn học',
      ],
    };

    const messageToUser = `### Phân tích Động Lực Tự Chủ (RAI) của bạn 📊

Hiện tại, chỉ số **Relative Autonomy Index (RAI)** của bạn đang ở mức **${ctx.raiScore.level}** (${ctx.raiScore.score > 0 ? '+' : ''}${ctx.raiScore.score} điểm):

- **Phân loại:** ${ctx.raiScore.label}
- **Chiến lược tối ưu theo SDT:**
${
  isHighRai
    ? `  - Bạn đang có động lực nội tại rất vững vàng! Hãy ưu tiên các nhiệm vụ thách thức cao (Toán nâng cao, viết luận sáng tạo).\n  - Bạn có toàn quyền chủ động chọn thứ tự giải quyết công việc trong ngày.`
    : isLowRai
    ? `  - Khi cảm thấy bị ép buộc, não bộ sẽ sinh ra lực cản lớn. Chúng ta sẽ áp dụng chiến thuật **"Vi thành tựu (Quick-wins)"** dài 15-20 phút để khởi động nhẹ nhàng, không gây ngợp.\n  - Bạn có thể chọn học cùng bạn thân (Study Buddy) để tăng cảm giác Kết nối (Relatedness).`
    : `  - Hãy chia nhỏ bài học thành các khối 25 phút kèm phần thưởng ngắn hạn (Micro-rewards).\n  - Tự chọn một không gian học tập tạo cảm hứng cho riêng mình.`
}

Bạn cảm thấy chiến lược này có phù hợp với nhịp sinh học hiện tại của mình không?`;

    return { messageToUser, systemActionJson: systemAction };
  }

  // Default: Empathetic, supportive SDT check-in
  const systemAction: SystemActionJson = {
    status_summary: `Nhịp học ổn định · Căng thẳng: ${ctx.stressLevel} · Cảm xúc: ${ctx.emotionalState}`,
    action_type: 'KEEP_SCHEDULE',
    schedule_modifications: [],
    suggested_recovery_activities: [
      'Uống nước đầy đủ giữa các ca học',
      'Thực hiện quy tắc 20-20-20 bảo vệ mắt',
    ],
  };

  const messageToUser = `### Chào ${ctx.studentName}, mình luôn sẵn sàng đồng hành cùng bạn! ✨

Với trạng thái cảm xúc hiện tại là **${ctx.emotionalState}** và mức độ căng thẳng **${ctx.stressLevel}**:
- Bạn đang kiểm soát nhịp học rất tốt.
- Mình có thể hỗ trợ bạn:
  1. 🎯 **Thiết lập mục tiêu WOOP** có kế hoạch phòng ngừa trì hoãn.
  2. ⚡ **Tự động phân bổ lại bài vở** khi cảm thấy mệt mỏi hoặc quá tải.
  3. 🧩 **Tách nhỏ bài tập khó** thành các bước vi mô dễ hoàn thành.

Bạn muốn cùng mình thực hiện điều gì tiếp theo? Hãy nói cho mình biết nhé!`;

  return { messageToUser, systemActionJson: systemAction };
}

export function applySystemActionToSchedule(
  systemAction: SystemActionJson,
  currentBlocks: TimelineBlock[],
  selectedDate: string
): { updatedBlocks: TimelineBlock[]; appliedCount: number; recoveryAdded: string[] } {
  let appliedCount = 0;
  const recoveryAdded: string[] = [];

  let newBlocks = currentBlocks.map((b) => {
    const mod = systemAction.schedule_modifications.find((m) => m.task_id === b.id);
    if (!mod) return b;

    appliedCount++;
    if (mod.action === 'REDUCE_DURATION') {
      const newDur = mod.reduced_minutes || Math.max(15, Math.round(b.durationMinutes * 0.6));
      const startM = timeStringToMinutes(b.startTime);
      const newEndM = startM + newDur;
      return {
        ...b,
        durationMinutes: newDur,
        endTime: minutesToTimeString(newEndM),
        notes: `${b.notes || ''} [banipu AI: Đã rút gọn để chống kiệt sức]`.trim(),
        energyTag: 'Micro-task' as const,
      };
    } else if (mod.action === 'RESCHEDULE') {
      return {
        ...b,
        startTime: '19:30',
        endTime: '20:15',
        notes: `${b.notes || ''} [banipu AI: Dời sang khung giờ thảnh thơi hơn]`.trim(),
      };
    }
    return b;
  });

  // If DE_STRESS_MODE is activated, automatically insert an adaptive recovery block
  if (systemAction.action_type === 'DE_STRESS_MODE') {
    const hasRecoveryToday = newBlocks.some(
      (b) => b.type === 'rest' && b.date === selectedDate && b.isAdaptiveBreak
    );

    if (!hasRecoveryToday) {
      const recoveryBlock: TimelineBlock = {
        id: `recovery-${Date.now()}`,
        title: '🌿 Hồi Phục Tâm Lý & Thở Chánh Niệm (Banipu De-Stress)',
        type: 'rest',
        date: selectedDate,
        startTime: '16:45',
        endTime: '17:05',
        durationMinutes: 20,
        completed: false,
        isAdaptiveBreak: true,
        energyTag: 'Adaptive Rest',
        notes: 'Quãng nghỉ hồi phục do trợ lý banipu kích hoạt để xả tải thần kinh phế vị.',
        microTasks: [
          { id: `rec-1-${Date.now()}`, title: '3 chu kỳ bài thở 4-7-8', estimatedMinutes: 5, completed: false },
          { id: `rec-2-${Date.now()}`, title: 'Uống 1 cốc nước ấm và vươn vai', estimatedMinutes: 5, completed: false },
          { id: `rec-3-${Date.now()}`, title: 'Nhắm mắt nghe 1 bản nhạc lofi không lời', estimatedMinutes: 10, completed: false },
        ],
      };
      newBlocks.push(recoveryBlock);
      recoveryAdded.push('🌿 Hồi Phục Tâm Lý & Thở Chánh Niệm (20 phút)');
    }
  }

  // Sort blocks by start time
  newBlocks.sort((a, b) => timeStringToMinutes(a.startTime) - timeStringToMinutes(b.startTime));

  return { updatedBlocks: newBlocks, appliedCount, recoveryAdded };
}
