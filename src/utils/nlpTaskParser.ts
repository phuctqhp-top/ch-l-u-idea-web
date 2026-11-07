import { TimelineBlock, MicroTask, TaskType } from '../types';
import { timeStringToMinutes, minutesToTimeString } from './sdtEngine';

export interface ParsedTaskResult {
  rawInput: string;
  detectedSubject: string;
  primaryType: TaskType;
  estimatedMinutes: number;
  blocks: Omit<TimelineBlock, 'id'>[];
  sdtAutonomyOptions: {
    title: string;
    description: string;
    blocks: Omit<TimelineBlock, 'id'>[];
  }[];
  pedagogicalRationale: string;
}

/**
 * Smart Natural Language Decomposition for High School Study Demands.
 * Breaks overwhelming homework & exam prep into low-friction micro-tasks.
 */
export function parseNaturalLanguageStudyInput(
  input: string,
  targetDate: string,
  baseStartTime = '16:00'
): ParsedTaskResult {
  const lower = input.toLowerCase();

  // Detect subject
  let subject = 'Tự Học Chung';
  if (lower.includes('toán') || lower.includes('math') || lower.includes('hình') || lower.includes('đại')) {
    subject = 'Toán Giải Tích 10';
  } else if (lower.includes('sinh') || lower.includes('bio') || lower.includes('tế bào')) {
    subject = 'Sinh Học 10';
  } else if (lower.includes('văn') || lower.includes('luận') || lower.includes('bài viết') || lower.includes('essay') || lower.includes('đọc')) {
    subject = 'Ngữ Văn 10';
  } else if (lower.includes('sử') || lower.includes('history') || lower.includes('chiến tranh') || lower.includes('địa')) {
    subject = 'Lịch Sử 10';
  } else if (lower.includes('anh') || lower.includes('english') || lower.includes('từ vựng') || lower.includes('vocab')) {
    subject = 'Tiếng Anh 10';
  } else if (lower.includes('hóa') || lower.includes('lý') || lower.includes('vật lý')) {
    subject = 'Vật Lý / Hóa Học';
  }

  // Check essay / writing workload
  if (lower.includes('văn') || lower.includes('essay') || lower.includes('1000') || lower.includes('bài viết') || lower.includes('báo cáo')) {
    const microTasksA: MicroTask[] = [
      { id: 'm1', title: 'Động não luận điểm chính & 3 dẫn chứng lập luận trọng tâm', estimatedMinutes: 20, completed: false },
      { id: 'm2', title: 'Lập dàn ý các đoạn thân bài gắn với ngữ liệu thực tế', estimatedMinutes: 25, completed: false },
      { id: 'm3', title: 'Viết phần mở bài cuốn hút và 300 từ đầu tiên', estimatedMinutes: 30, completed: false },
    ];

    const microTasksB: MicroTask[] = [
      { id: 'm4', title: 'Ôn lại các công thức Toán Chương 2 và bài tập mẫu', estimatedMinutes: 25, completed: false },
      { id: 'm5', title: 'Luyện 4 bài tập trắc nghiệm & tự luận điển hình', estimatedMinutes: 30, completed: false },
    ];

    const startMinutes = timeStringToMinutes(baseStartTime);

    // Option 1: Interleaved (Spaced) - Best for retention
    const essaySubjectTitle = lower.includes('văn') || lower.includes('essay') || lower.includes('1000') ? 'Ngữ Văn: Dàn Ý & Luận Điểm Bài Viết 1000 Từ' : `Phác thảo: Dàn ý bài viết ${subject}`;

    const interleavedBlocks: Omit<TimelineBlock, 'id'>[] = [
      {
        title: essaySubjectTitle,
        type: 'assignment',
        date: targetDate,
        startTime: minutesToTimeString(startMinutes),
        endTime: minutesToTimeString(startMinutes + 45),
        durationMinutes: 45,
        completed: false,
        energyTag: 'Micro-task',
        microTasks: microTasksA.slice(0, 2),
        notes: 'Khởi đầu với lực cản thấp: Tập trung vào cấu trúc mạch lạc thay vì câu chữ cầu kỳ.',
      },
      {
        title: '🌿 Nghỉ Tái Tạo Nhận Thức & Thư Giãn',
        type: 'rest',
        date: targetDate,
        startTime: minutesToTimeString(startMinutes + 45),
        endTime: minutesToTimeString(startMinutes + 55),
        durationMinutes: 10,
        completed: false,
        energyTag: 'Adaptive Rest',
        isAdaptiveBreak: true,
      },
      {
        title: 'Toán: Khắc Sâu Kiến Thức Chương 2',
        type: 'review',
        date: targetDate,
        startTime: minutesToTimeString(startMinutes + 55),
        endTime: minutesToTimeString(startMinutes + 115),
        durationMinutes: 60,
        completed: false,
        energyTag: 'High Focus',
        microTasks: microTasksB,
        notes: 'Học xen kẽ giúp vùng não ngôn ngữ được nghỉ trong khi kích hoạt tư duy toán học logic.',
      },
    ];

    // Option 2: Sequential Deep Dive
    const sequentialBlocks: Omit<TimelineBlock, 'id'>[] = [
      {
        title: essaySubjectTitle,
        type: 'assignment',
        date: targetDate,
        startTime: minutesToTimeString(startMinutes),
        endTime: minutesToTimeString(startMinutes + 75),
        durationMinutes: 75,
        completed: false,
        energyTag: 'High Focus',
        microTasks: microTasksA,
        notes: 'Phiên học tập trung sâu không ngắt quãng.',
      },
      {
        title: 'Toán: Luyện Tập Chương 2',
        type: 'review',
        date: targetDate,
        startTime: minutesToTimeString(startMinutes + 90),
        endTime: minutesToTimeString(startMinutes + 145),
        durationMinutes: 55,
        completed: false,
        energyTag: 'High Focus',
        microTasks: microTasksB,
      },
    ];

    return {
      rawInput: input,
      detectedSubject: subject,
      primaryType: 'assignment',
      estimatedMinutes: 115,
      blocks: interleavedBlocks,
      sdtAutonomyOptions: [
        {
          title: 'Phương án A: Học Xen Kẽ (Khuyên dùng cho sự Bền vững)',
          description: 'Đan xen bài viết Văn học và luyện Toán, ngăn cách bởi 10 phút tái tạo não bộ.',
          blocks: interleavedBlocks,
        },
        {
          title: 'Phương án B: Tuần Tự Tập Trung (Giải quyết từng mục tiêu)',
          description: 'Hoàn tất bài viết Văn trước khi chuyển toàn bộ sự chú ý sang môn Toán.',
          blocks: sequentialBlocks,
        },
      ],
      pedagogicalRationale:
        'Góc nhìn Thuyết Tự Quyết (SDT): Nghiên cứu chỉ ra chia nhỏ nhiệm vụ thành các mốc 20-30 phút giúp giảm áp lực amygdala và nâng cao cảm giác làm chủ năng lực.',
    };
  }

  // Default smart breakdown for single task or general request
  const startM = timeStringToMinutes(baseStartTime);
  const defaultDuration = lower.includes('ngắn') || lower.includes('nhanh') || lower.includes('ôn') ? 35 : 50;

  const standardBlocks: Omit<TimelineBlock, 'id'>[] = [
    {
      title: `${subject}: ${input.length > 40 ? input.slice(0, 37) + '...' : input}`,
      type: lower.includes('ôn') ? 'review' : 'study',
      date: targetDate,
      startTime: baseStartTime,
      endTime: minutesToTimeString(startM + defaultDuration),
      durationMinutes: defaultDuration,
      completed: false,
      energyTag: defaultDuration > 40 ? 'High Focus' : 'Micro-task',
      microTasks: [
        { id: 'sm1', title: 'Chuẩn bị tài liệu, đóng các tab gây xao nhãng & chốt mục tiêu', estimatedMinutes: 5, completed: false },
        { id: 'sm2', title: 'Tương tác chủ động với các khái niệm cốt lõi', estimatedMinutes: 20, completed: false },
        { id: 'sm3', title: 'Tự kiểm tra nhanh hoặc đúc kết bài học vi thành tựu', estimatedMinutes: 15, completed: false },
      ],
      notes: 'Hãy nhớ: Hiểu sâu 1 khái niệm giá trị hơn việc đọc lướt thụ động 50 trang sách.',
    },
  ];

  return {
    rawInput: input,
    detectedSubject: subject,
    primaryType: 'study',
    estimatedMinutes: defaultDuration,
    blocks: standardBlocks,
    sdtAutonomyOptions: [
      {
        title: `Phiên học Tập Trung ${defaultDuration} phút`,
        description: 'Một khối giờ tập trung với 3 vi bước tiến bộ rõ ràng.',
        blocks: standardBlocks,
      },
    ],
    pedagogicalRationale:
      'Đặt mục tiêu vi mô rõ ràng trước khi học kích hoạt dopamine mong đợi, giúp việc tập trung trở nên tự nhiên hơn.',
  };
}
