import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateBanipuCoachResponse,
  applySystemActionToSchedule,
  INITIAL_RAI_DATA,
  INITIAL_WOOP_GOALS,
} from './banipuCoachEngine';
import { TimelineBlock, SystemActionJson } from '../types';

test('generateBanipuCoachResponse triggers DE_STRESS_MODE when stress is high or user reports fatigue', () => {
  const blocks: TimelineBlock[] = [
    {
      id: 'b-study-1',
      title: 'Toán Giải Tích 10: Luyện Đề',
      type: 'study',
      date: '2026-11-07',
      startTime: '15:00',
      endTime: '16:00',
      durationMinutes: 60,
      completed: false,
    },
    {
      id: 'b-study-2',
      title: 'Sinh Học 10: Tế Bào',
      type: 'study',
      date: '2026-11-07',
      startTime: '16:30',
      endTime: '17:30',
      durationMinutes: 60,
      completed: false,
    },
  ];

  const ctx = {
    studentName: 'Minh Anh',
    raiScore: INITIAL_RAI_DATA['Cao'],
    stressLevel: 'Cao' as const,
    emotionalState: 'Mệt mỏi' as const,
    currentBlocks: blocks,
    woopGoals: INITIAL_WOOP_GOALS,
    selectedDate: '2026-11-07',
  };

  const response = generateBanipuCoachResponse('Mình thấy mệt và căng thẳng quá, bài tập nhiều ngợp quá', ctx);

  assert.ok(response.messageToUser.includes('De-stress Mode'));
  assert.equal(response.systemActionJson.action_type, 'DE_STRESS_MODE');
  assert.ok(response.systemActionJson.schedule_modifications.length > 0);
  assert.ok(response.systemActionJson.suggested_recovery_activities.length >= 2);
});

test('generateBanipuCoachResponse guides student through 4-step WOOP framework', () => {
  const ctx = {
    studentName: 'Minh Anh',
    raiScore: INITIAL_RAI_DATA['Trung bình'],
    stressLevel: 'Thấp' as const,
    emotionalState: 'Hào hứng' as const,
    currentBlocks: [],
    woopGoals: INITIAL_WOOP_GOALS,
    selectedDate: '2026-11-07',
  };

  const response = generateBanipuCoachResponse('Hướng dẫn mình lập mục tiêu theo chuẩn WOOP với', ctx);

  assert.ok(response.messageToUser.includes('WOOP'));
  assert.ok(response.messageToUser.includes('Wish'));
  assert.ok(response.messageToUser.includes('Outcome'));
  assert.ok(response.messageToUser.includes('Obstacle'));
  assert.ok(response.messageToUser.includes('Plan'));
  assert.equal(response.systemActionJson.action_type, 'ADJUST_LIGHT');
});

test('applySystemActionToSchedule shortens heavy study blocks and inserts adaptive recovery block', () => {
  const initialBlocks: TimelineBlock[] = [
    {
      id: 'task-101',
      title: 'Toán Giải Tích: Đạo hàm nâng cao',
      type: 'study',
      date: '2026-11-07',
      startTime: '15:00',
      endTime: '16:00',
      durationMinutes: 60,
      completed: false,
    },
    {
      id: 'task-102',
      title: 'Ngữ Văn 10: Viết luận',
      type: 'assignment',
      date: '2026-11-07',
      startTime: '16:30',
      endTime: '17:30',
      durationMinutes: 60,
      completed: false,
    },
  ];

  const systemAction: SystemActionJson = {
    status_summary: 'Chế độ Giảm áp kích hoạt',
    action_type: 'DE_STRESS_MODE',
    schedule_modifications: [
      {
        task_id: 'task-101',
        action: 'REDUCE_DURATION',
        reduced_minutes: 35,
        original_title: 'Toán Giải Tích',
      },
      {
        task_id: 'task-102',
        action: 'RESCHEDULE',
        new_time: '19:30',
        original_title: 'Ngữ Văn 10',
      },
    ],
    suggested_recovery_activities: ['Bài thở 4-7-8', 'Uống nước ấm'],
  };

  const result = applySystemActionToSchedule(systemAction, initialBlocks, '2026-11-07');

  assert.equal(result.appliedCount, 2);
  const task1 = result.updatedBlocks.find((b) => b.id === 'task-101');
  assert.ok(task1);
  assert.equal(task1.durationMinutes, 35);
  assert.ok(task1.notes?.includes('banipu AI'));

  const recoveryBlock = result.updatedBlocks.find((b) => b.type === 'rest' && b.isAdaptiveBreak);
  assert.ok(recoveryBlock, 'Should automatically add an adaptive recovery block in DE_STRESS_MODE');
  assert.ok(recoveryBlock.title.includes('Hồi Phục Tâm Lý'));
});
