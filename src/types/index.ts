export type SubjectCategory = 'stem' | 'humanities' | 'languages' | 'arts' | 'wellness' | 'other';

export interface Energy4D {
  physical: number; // 0-100
  mental: number;
  studyLoad: number;
  social: number;
  overall: number;
  statusText: string;
}

export interface BurnoutDataPoint {
  day: string;
  dayShort: string;
  energyBattery: number; // 0-100
  studyLoad: number; // 0-100
  isToday?: boolean;
  isForecast?: boolean;
}

export interface TimetableGridRow {
  sessionPeriod: 'morning' | 'lunch_rest' | 'afternoon' | 'ai_study';
  timeLabel: string;
  title: string;
  schedule: {
    [dayIndex: number]: { // 1: Mon, 2: Tue, 3: Wed, 4: Thu, 5: Fri
      subjectName: string;
      roomOrNote: string;
      category: 'school' | 'lunch_rest' | 'ai_study' | 'free';
      timeSlot?: string;
    };
  };
}

export interface SdtGoalItem {
  id: string;
  pillar: 'competence' | 'autonomy' | 'relatedness';
  title: string;
  description: string;
  status: 'done' | 'doing' | 'todo';
  costBenefit: string; // e.g. "-15% Mental", "+20 XP"
  xpGain?: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  category: SubjectCategory;
  color: string; // pastel color class or hex
  accentColor: string;
  teacherName: string;
  teacherEmail: string;
  room: string;
  targetGrade?: string;
  currentGrade?: string;
}

export interface ClassSession {
  id: string;
  subjectId: string;
  dayOfWeek: number; // 1 (Mon) - 5 (Fri)
  startTime: string; // HH:mm format, e.g. "08:30"
  endTime: string; // "09:45"
  room: string;
  building?: string;
}

export interface Exam {
  id: string;
  subjectId: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  room: string;
  weightPercentage: number; // e.g. 30%
  targetScore: number; // e.g. 90
  topics: string[];
  completedTopics: string[];
}

export interface MicroTask {
  id: string;
  title: string;
  estimatedMinutes: number;
  completed: boolean;
  completedAt?: string;
}

export type TaskType = 'study' | 'class' | 'assignment' | 'review' | 'rest' | 'personal';

export interface TimelineBlock {
  id: string;
  title: string;
  subjectId?: string;
  type: TaskType;
  date: string; // YYYY-MM-DD
  startTime: string; // "14:00"
  endTime: string; // "15:15"
  durationMinutes: number;
  completed: boolean;
  notes?: string;
  microTasks?: MicroTask[];
  energyLevelRequired?: 'low' | 'medium' | 'high';
  energyTag?: 'High Focus' | 'Micro-task' | 'Low Energy' | 'Học Nhóm' | 'Lịch Trường' | 'Adaptive Rest';
  energyCost?: string; // e.g. "-25% Mental, -5% Physical"
  recommendedContext?: string; // e.g. "Khớp với khung giờ tập trung cao nhất (20:00 - 20:45) do AI đề xuất"
  isAdaptiveBreak?: boolean;
  autonomyChoiceId?: string;
}

export interface MicroWin {
  id: string;
  title: string;
  category: 'focus' | 'resilience' | 'clarity' | 'balance';
  timestamp: string;
  reflection?: string;
}

export interface PlanOption {
  id: string;
  name: string;
  tagline: string;
  description: string;
  focusRhythm: string; // e.g. "25/5 Spaced Pomodoro" or "50/10 Deep Blocks"
  dailyLoadHours: number;
  philosophy: string;
  suitableFor: string;
  recommended?: boolean;
}

export interface UserProfile {
  name: string;
  gradeLevel: string;
  studyRhythm: 'early_bird' | 'afternoon_peak' | 'night_owl' | 'balanced';
  chosenPlan: string;
  currentStressLevel: 'low' | 'moderate' | 'high';
  weeklyStudyGoalHours: number;
  streakDays: number;
  totalMicroWins: number;
  intrinsicMotto: string;
}

export type RaiLevel = 'Thấp' | 'Trung bình' | 'Cao';
export type StressLevel = 'Thấp' | 'Trung bình' | 'Cao' | 'Quá tải';
export type EmotionalState = 'Vui vẻ' | 'Mệt mỏi' | 'Lo âu' | 'Chán nản' | 'Hào hứng' | 'Bình tĩnh' | 'Áp lực';

export interface RaiScoreData {
  level: RaiLevel;
  score: number; // e.g. -24 to +24
  label: string; // e.g. "Động lực Nội tại (Tự nguyện)"
  description: string;
}

export interface WoopGoal {
  id: string;
  wish: string; // W (Wish): Mục tiêu cụ thể, có ý nghĩa
  outcome: string; // O (Outcome): Hình dung kết quả tốt nhất & cảm xúc tích cực
  obstacle: string; // O (Obstacle): Nhận diện trở ngại nội tại chính
  plan: string; // P (Plan): Nếu [Trở ngại X], tôi sẽ [Hành động Y]
  status: 'active' | 'completed';
  createdAt: string;
  subjectTag?: string;
}

export interface ScheduleModification {
  task_id: string;
  action: 'RESCHEDULE' | 'REMOVE' | 'REDUCE_DURATION';
  new_time?: string;
  reduced_minutes?: number;
  original_title?: string;
}

export interface SystemActionJson {
  status_summary: string;
  action_type: 'KEEP_SCHEDULE' | 'ADJUST_LIGHT' | 'DE_STRESS_MODE';
  schedule_modifications: ScheduleModification[];
  suggested_recovery_activities: string[];
}

export interface BanipuMessage {
  id: string;
  sender: 'ai' | 'user';
  messageToUser: string;
  systemActionJson?: SystemActionJson;
  timestamp: string;
  applied?: boolean;
}
