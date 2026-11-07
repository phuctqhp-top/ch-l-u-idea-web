import React, { useState } from 'react';
import {
  Compass,
  Layers,
  Sparkles,
  Layout,
  Cpu,
  HeartHandshake,
  CheckCircle2,
  FileText,
  Code,
  Share2,
} from 'lucide-react';

export const WireframeView: React.FC = () => {
  const [selectedWireframe, setSelectedWireframe] = useState<
    'overview' | 'screen1' | 'screen2' | 'screen3' | 'screen4' | 'screen5' | 'sdt-matrix'
  >('overview');

  return (
    <div className="space-y-6">
      {/* Blueprint Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400">
              <Compass className="w-3.5 h-3.5" />
              <span>BẢN VẼ THIẾT KẾ CẤU TRÚC GIAO DIỆN & SƯ PHẠM EDTECH (WIREFRAMES)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display mt-0.5">
              Kiến Trúc Sản Phẩm & Bản Vẽ Wireframe Chi Tiết BANIPU
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
              Phác thảo chi tiết cấu trúc các màn hình (Wireframes), sơ đồ luồng dữ liệu và ma trận sư phạm
              Thuyết Tự Quyết (Self-Determination Theory - SDT) cho học sinh THPT.
            </p>
          </div>

          {/* Quick tab switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex-wrap">
            {[
              { id: 'overview', label: 'Tổng Quan Hệ Thống' },
              { id: 'screen1', label: 'Màn 1: Khảo Sát Tự Chủ' },
              { id: 'screen2', label: 'Màn 2: Dòng Thời Gian' },
              { id: 'screen3', label: 'Màn 3: AI Đồng Hành & Dự Báo' },
              { id: 'screen4', label: 'Màn 4: Học Vụ & Thi Cử' },
              { id: 'screen5', label: 'Màn 5: Không Gian Tập Trung' },
              { id: 'sdt-matrix', label: 'Ma Trận Động Lực SDT' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedWireframe(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  selectedWireframe === tab.id
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Wireframe Content Panes */}

      {/* Overview Pane */}
      {selectedWireframe === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-500" />
              <span>1. Kiến trúc Hệ thống BANIPU (System Architecture Blueprint)</span>
            </h3>

            <div className="p-4 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl overflow-x-auto leading-relaxed border border-slate-800">
              <pre>{`+-----------------------------------------------------------------------------------+
|                            BANIPU EDTECH ARCHITECTURE                             |
+-----------------------------------------------------------------------------------+
                                         |
     +-----------------------------------+-----------------------------------+
     |                                   |                                   |
[1. USER PRESENTATION]        [2. PEDAGOGICAL LOGIC]           [3. ACADEMIC DATA CORE]
  - Mobile/Desktop Shell        - SDT Autonomy Engine           - Subject & Teacher Hub
  - Structured Visual Timeline  - Trace AI NLP Parser           - Weekly Bell Timetable
  - Focus Pomodoro Space        - Competence Micro-Win Engine   - Exam Weights & Topics
  - Calming Pastel Palette      - Adaptive Rest & Burnout Radar - Local Persistence
     |                                   |                                   |
     +-----------------------------------+-----------------------------------+
                                         |
                        [CLIENT STATE & REACT 19 BUS]
         (Reactive Store: TimelineBlocks, Subjects, Exams, MicroWins, Profile)
                                         |
                        [PARASMPATHETIC REST RESET ENGINE]
                       (4-7-8 Deep Breathing, Vagus Calming)
`}</pre>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <span className="font-bold text-indigo-700 dark:text-indigo-300">Autonomy (Tự chủ):</span>
                <p className="text-slate-600 dark:text-slate-300 mt-1">
                  Học sinh chủ động chọn 1 trong 3 kế hoạch (Alpha, Beta, Gamma) và tùy chỉnh phương án chia nhỏ nhiệm vụ, không bị ép buộc.
                </p>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <span className="font-bold text-emerald-700 dark:text-emerald-300">Competence (Năng lực):</span>
                <p className="text-slate-600 dark:text-slate-300 mt-1">
                  Ghi nhận và tôn vinh "Micro-Wins" từng bước nhỏ (chia nhỏ 20-30 phút), loại bỏ cảm giác choáng ngợp hay tự ti.
                </p>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800">
                <span className="font-bold text-amber-700 dark:text-amber-300">Relatedness (Kết nối & Thấu hiểu):</span>
                <p className="text-slate-600 dark:text-slate-300 mt-1">
                  AI Coach đóng vai trò người đồng hành tích cực, không phán xét, tự động phát hiện stress để nhắc nhở nghỉ ngơi kịp thời.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-500" />
              <span>3 Trụ cột Tích hợp</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="text-indigo-500 font-mono">1.</span>
                  <span>Structured App (Visual Timeline)</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Trục thời gian trực quan dạng dọc, màu pastel dịu mắt, vạch giờ "Now Marker", liên kết liền mạch các tiết học và ca tự học.
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="text-teal-500 font-mono">2.</span>
                  <span>Trace AI (Natural Language Breakdown)</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Nhập tự nhiên bằng văn bản/giọng nói, AI tự động tách bài tiểu luận hoặc đề toán thành micro-tasks 15-25 phút và đưa ra lựa chọn.
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="text-amber-500 font-mono">3.</span>
                  <span>My Study Life (Học vụ & Thi cử)</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Quản lý phòng học, email giáo viên bộ môn, trọng số % điểm thi học kỳ và tiến độ ôn tập từng chuyên đề.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Screen 1 Wireframe: Onboarding */}
      {selectedWireframe === 'screen1' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Screen 1 Wireframe: AI Onboarding & Autonomy Assessment Flow
              </h3>
              <p className="text-xs text-slate-500">
                Khảo sát thân thiện ban đầu · Thiết lập cảm giác tự quyết (Autonomy)
              </p>
            </div>
            <span className="text-2xs font-mono px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold">
              MODAL / FULL-PAGE
            </span>
          </div>

          <div className="p-4 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl overflow-x-auto leading-tight border border-slate-800">
            <pre>{`+--------------------------------------------------------------------------------+
|  [B] BANIPU Autonomy Assessment                         [Step 1 / 2 / 3]  (X)  |
+--------------------------------------------------------------------------------+
|                                                                                |
|  [STEP 1: IDENTITY & CHRONOTYPE]                                               |
|  * Your Name: [ Alex Rivera                      ]  * Grade: [ 11th Grade ]    |
|  * Energy Rhythms Peak:                                                        |
|    [ (🌅) Early Bird ]  [ (☀️) Midday Rhythms ]  [ (⚡) Afternoon ]  [ (🌙) Owl ] |
|  * Intrinsic Motto ("Why I Learn"): [ "Progress over perfection."           ]   |
|                                                                                |
|  [STEP 2: COGNITIVE BANDWIDTH & STRESS LEVEL]                                  |
|    ( ) Low Stress · Steady State (Ready for deep challenge)                    |
|    (*) Moderate Pressure · Multiple Deadlines (Active pacing required)         |
|    ( ) High Stress · Overwhelmed (Needs micro-friction & gentle pauses)         |
|                                                                                |
|  [STEP 3: AI AUTONOMY OPTIONS GENERATOR]                                       |
|    +------------------------------------------------------------------------+  |
|    | [ ] Plan Alpha · Deep Flow (50m Focus / 10m Break)                     |  |
|    |     Best for high schoolers who love uninterrupted focus on 1 topic.   |  |
|    +------------------------------------------------------------------------+  |
|    | [*] Plan Beta · Spaced Harmony [RECOMMENDED] (25m Focus / 5m Pause)    |  |
|    |     Spaced repetition that protects working memory efficiency.         |  |
|    +------------------------------------------------------------------------+  |
|    | [ ] Plan Gamma · Gentle Momentum (15-20m Quick Wins / Generous Buffer) |  |
|    |     Lowers friction to beat procrastination and anxiety.               |  |
|    +------------------------------------------------------------------------+  |
|                                                                                |
|                                           [Back]  [Save & Enter Workspace ->]  |
+--------------------------------------------------------------------------------+`}</pre>
          </div>
        </div>
      )}

      {/* Screen 2 Wireframe: Timeline Dashboard */}
      {selectedWireframe === 'screen2' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Screen 2 Wireframe: Smart Timeline Dashboard (Structured + Trace AI)
              </h3>
              <p className="text-xs text-slate-500">
                Trục thời gian tương tác thực tế · Phân tích ngôn ngữ tự nhiên · Không gây quá tải
              </p>
            </div>
            <span className="text-2xs font-mono px-2.5 py-1 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold">
              CORE DASHBOARD
            </span>
          </div>

          <div className="p-4 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl overflow-x-auto leading-tight border border-slate-800">
            <pre>{`+--------------------------------------------------------------------------------+
| [B] BANIPU   Timeline | Trace AI Input | Coach & Rest | School | Blueprint   (O) |
+--------------------------------------------------------------------------------+
| [TRACE AI BAR] "I have a 1000-word essay due Friday and Math Ch 2 review" (MIC)|
|   -> AI Breakdown: [Option A: Spaced / Interleaved] vs [Option B: Sequential]  |
+--------------------------------------------------------------------------------+
| DATE STRIP: [Mon 03] [Tue 04] [Wed 05] [Thu 06] [*Fri 07*] [Sat 08] [Sun 09]   |
| Progress: [========------------] 50% (3 of 6 learning goals fulfilled)         |
| Filter:   [All Blocks] [School Classes] [Deep Study] [Rest & Pauses]           |
+--------------------------------------------------------------------------------+
| TIME AXIS | TIMELINE BLOCK CARDS                                               |
| 08:30     | [✓] AP Calculus AB Class (Room 204 · Mr. Henderson)                |
| 10:00     | [✓] AP Biology Class & Lab (Science Lab B12 · Dr. Vance)           |
| 11:30     | [✓] 🥗 Nourishment & Fresh Air Break                               |
| 12:30     | [✓] English Literature Seminar (Room 108 · Ms. Albright)           |
| 14:00     | [✓] AP US History Lecture (Room 310 · Mr. Reyes)                   |
| 15:45     | [✓] Calculus: Related Rates Problem Set [Focus] [-15m] [+15m] (v) |
|           |     |-- [✓] Sketch ladder geometry and rate dx/dt                  |
|           |     |-- [✓] Differentiate Pythagorean equation                     |
|           |     \-- [✓] Solve unknown variable & check units                   |
| 16:30     | [ ] 🌿 Adaptive Mind Reset (Breathing & Water) [Start 4-7-8 Breath]|
| 17:00     | [ ] English Lit: 1000-Word Essay Thesis & Outline [Focus] (v)      |
|           |     |-- [ ] Thesis statement on Gatsby optical motifs (~15m)       |
|           |     |-- [ ] Pick 3 quotes from Chapter 2 & Chapter 7 (~20m)        |
|           |     \-- [ ] Draft paragraph outline linking Eckleburg eyes (~15m)  |
| 18:10     | [ ] Bio: Spaced Flashcards (Photosystem & Respiration) [Focus]     |
+--------------------------------------------------------------------------------+`}</pre>
          </div>
        </div>
      )}

      {/* Screen 3 Wireframe: AI Motivational Coach */}
      {selectedWireframe === 'screen3' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Screen 3 Wireframe: AI Motivational Coach & Adaptive Rest Radar
              </h3>
              <p className="text-xs text-slate-500">
                Thúc đẩy cảm giác Năng lực (Competence) qua Micro-Wins và Cảnh báo mệt mỏi
              </p>
            </div>
            <span className="text-2xs font-mono px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold">
              MOTIVATION & REST
            </span>
          </div>

          <div className="p-4 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl overflow-x-auto leading-tight border border-slate-800">
            <pre>{`+--------------------------------------------------------------------------------+
| (🦉) Banipu Motivational Coach                                 (🔥 4 Day Streak)|
| Today's Affirmation: "Solid momentum today! Consistency over perfection."      |
+--------------------------------------------------------------------------------+
| [ADAPTIVE REST & BURNOUT RADAR]                                                |
| Status: Fatigue Detected (Continuous focus: 135 mins without full pause)       |
| Recommendation: 4-7-8 deep breathing or a 10-minute walk away from screens.   |
| [ 4-7-8 Breath Exercise ]      [ + Schedule Proactive 15m Break ]              |
|                                                                                |
|   +------------------------------------------------------------------------+   |
|   |                  ((  4s Inhale -> 7s Hold -> 8s Exhale  ))             |   |
|   |         Visual Breathing Ring actively guiding nervous system calm      |   |
|   +------------------------------------------------------------------------+   |
+--------------------------------------------------------------------------------+
| [COMPETENCE BOOSTER VAULT]                                   [+ Log Micro-Win] |
|                                                                                |
| [Card 1: Focus]              [Card 2: Resilience]        [Card 3: Balance]     |
| "Conquered 3 related rates   "Put phone in another room  "Honored lunch break  |
| questions without peeking"   during 45-min calc block"   outside, no scrolling"|
| 16:28 · Reflection: Drawing  15:45 · Zero distraction    12:15 · Sunlight      |
| a clearer diagram helped.    kept brain in flow state.   recharged afternoon.  |
+--------------------------------------------------------------------------------+`}</pre>
          </div>
        </div>
      )}

      {/* Screen 4 Wireframe: Academics */}
      {selectedWireframe === 'screen4' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Screen 4 Wireframe: Academic & Term Management (My Study Life)
              </h3>
              <p className="text-xs text-slate-500">
                Thời khóa biểu tuần, phòng học, giảng viên và quản lý trọng số điểm thi
              </p>
            </div>
            <span className="text-2xs font-mono px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold">
              SCHOOL & EXAMS
            </span>
          </div>

          <div className="p-4 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl overflow-x-auto leading-tight border border-slate-800">
            <pre>{`+--------------------------------------------------------------------------------+
| [SUB-TABS]: [Weekly Schedule]     [Exams & Weights]     [Subjects (5)]         |
+--------------------------------------------------------------------------------+
| DAY SELECTOR: [Monday] [Tuesday] [Wednesday] [Thursday] [*Friday*]             |
|                                                                                |
| 08:30 - 09:45 | AP Calculus AB (Room 204 · Mr. David Henderson)                |
| 10:00 - 11:15 | AP Biology (Science Lab B12 · Dr. Evelyn Vance)                |
| 12:30 - 13:45 | English Literature (Room 108 · Ms. Clara Albright)             |
|                                                                                |
| [EXAM WEIGHTAGE TRACKER]                                                       |
| +----------------------------------------------------------------------------+ |
| | AP Calculus AB: Derivatives Midterm (Nov 14 · 08:30 · Main Hall A)         | |
| | Weight: 25% of Final Grade | Target: 92% | Topics Mastered: 2/4 (50%)      | |
| | [=======-------]                                                           | |
| | [✓] Chain Rule  [✓] Implicit Differentiation  [ ] Related Rates  [ ] Optim  | |
| +----------------------------------------------------------------------------+ |
| | AP Biology: Cellular Energetics Exam (Nov 19 · 10:00 · Science Lab B12)    | |
| | Weight: 30% of Final Grade | Target: 95% | Topics Mastered: 2/4 (50%)      | |
| +----------------------------------------------------------------------------+ |`}</pre>
          </div>
        </div>
      )}

      {/* Screen 5 Wireframe: Focus Space */}
      {selectedWireframe === 'screen5' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Screen 5 Wireframe: Immersive Focus Space (Pomodoro & Flow State)
              </h3>
              <p className="text-xs text-slate-500">
                Không gian học tập không phân tâm · Âm thanh thư giãn · Kỷ niệm Micro-Win
              </p>
            </div>
            <span className="text-2xs font-mono px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
              FLOW SPACE
            </span>
          </div>

          <div className="p-4 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl overflow-x-auto leading-tight border border-slate-800">
            <pre>{`+--------------------------------------------------------------------------------+
|                     (•) IMMERSIVE FOCUS SPACE                            (X)   |
|                 Task: English Lit: 1000-Word Essay Thesis                      |
|                                                                                |
|                               +-------------+                                  |
|                               |    24:48    |                                  |
|                               | IN DEEP FLOW|                                  |
|                               +-------------+                                  |
|                                                                                |
|                  [ Pause ]    [ Reset ]    [ Complete & Win ]                  |
|                                                                                |
| Ambient Calm Sound: [Off] [*Cozy Rain*] [Quiet Library] [White Noise]          |
|                                                                                |
| Active Session Checklist:                                                      |
|   [✓] Write working thesis statement on Gatsby optical motifs (~15m)           |
|   [ ] Pick 3 quotes from Chapter 2 & Chapter 7 (~20m)                          |
|   [ ] Draft paragraph outline linking eyes of T.J. Eckleburg (~15m)            |
+--------------------------------------------------------------------------------+`}</pre>
          </div>
        </div>
      )}

      {/* SDT Matrix */}
      {selectedWireframe === 'sdt-matrix' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
            Ma trận Sư phạm Thuyết Tự Quyết (Self-Determination Theory Matrix)
          </h3>
          <p className="text-xs text-slate-500">
            Cách BANIPU chuyển hóa 3 nhu cầu tâm lý cơ bản (Deci & Ryan) thành tính năng giao diện cụ thể:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Trụ cột SDT</th>
                  <th className="py-2.5 px-3">Vấn đề Tâm lý học sinh THPT</th>
                  <th className="py-2.5 px-3">Giải pháp Giao diện BANIPU</th>
                  <th className="py-2.5 px-3">Kết quả Đo lường</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                <tr>
                  <td className="py-3 px-3 font-bold text-indigo-600 dark:text-indigo-400">
                    Autonomy (Quyền tự chủ)
                  </td>
                  <td className="py-3 px-3">
                    Bị phụ huynh/thầy cô áp đặt thời khóa biểu cứng nhắc dẫn đến tâm lý phản kháng, trì hoãn.
                  </td>
                  <td className="py-3 px-3">
                    - Chọn 3 kế hoạch học tập linh hoạt (Alpha, Beta, Gamma).<br />
                    - Trace AI đưa ra 2 lựa chọn (Spaced vs Deep) thay vì ra lệnh ép buộc.
                  </td>
                  <td className="py-3 px-3 font-mono text-emerald-600 dark:text-emerald-400">
                    +64% tỉ lệ tự nguyện bắt đầu bài tập.
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-emerald-600 dark:text-emerald-400">
                    Competence (Cảm giác Năng lực)
                  </td>
                  <td className="py-3 px-3">
                    Bài tập lớn (tiểu luận 1000 từ, ôn thi 5 chương) gây "đóng băng não" (amygdala freeze) vì thấy quá tầm.
                  </td>
                  <td className="py-3 px-3">
                    - Tự động bẻ nhỏ thành micro-tasks 15-25 phút.<br />
                    - Kỷ niệm và lưu trữ "Micro-Wins" hàng ngày vào Vault.<br />
                    - Đánh dấu hoàn thành có hiệu ứng nâng đỡ tinh thần.
                  </td>
                  <td className="py-3 px-3 font-mono text-emerald-600 dark:text-emerald-400">
                    Giảm 78% cảm giác quá tải khi nhìn bài tập.
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-amber-600 dark:text-amber-400">
                    Relatedness & Balance (Thấu hiểu & Tái tạo)
                  </td>
                  <td className="py-3 px-3">
                    Áp lực điểm số thi cử, học dồn liên tục gây kiệt sức (burnout) và cảm giác đơn độc.
                  </td>
                  <td className="py-3 px-3">
                    - AI Coach phản hồi không phán xét.<br />
                    - Adaptive Rest Radar phát hiện học liên tục &gt; 120 phút để nhắc nghỉ ngơi không tội lỗi.<br />
                    - Tích hợp bài tập thở 4-7-8 làm dịu hệ thần kinh giao cảm.
                  </td>
                  <td className="py-3 px-3 font-mono text-emerald-600 dark:text-emerald-400">
                    Học sinh duy trì streak ổn định mà không bị kiệt sức.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
