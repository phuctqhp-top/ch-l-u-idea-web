import test from 'node:test';
import assert from 'node:assert/strict';
import {
  timeStringToMinutes,
  minutesToTimeString,
  detectFatiguePattern,
  calculateCompetenceMetrics,
  createAdaptiveRestBlock,
} from './sdtEngine';
import { parseNaturalLanguageStudyInput } from './nlpTaskParser';
import { TimelineBlock, MicroWin } from '../types';

test('timeStringToMinutes and minutesToTimeString convert back and forth correctly', () => {
  assert.equal(timeStringToMinutes('00:00'), 0);
  assert.equal(timeStringToMinutes('08:30'), 510);
  assert.equal(timeStringToMinutes('14:45'), 885);
  assert.equal(timeStringToMinutes('23:59'), 1439);

  assert.equal(minutesToTimeString(0), '00:00');
  assert.equal(minutesToTimeString(510), '08:30');
  assert.equal(minutesToTimeString(885), '14:45');
});

test('detectFatiguePattern detects heavy continuous study over 120 minutes', () => {
  const blocks: TimelineBlock[] = [
    {
      id: 'b1',
      title: 'Math Calculus',
      type: 'study',
      date: '2026-11-07',
      startTime: '14:00',
      endTime: '15:15', // 75 mins
      durationMinutes: 75,
      completed: false,
    },
    {
      id: 'b2',
      title: 'Physics Lab',
      type: 'study',
      date: '2026-11-07',
      startTime: '15:20', // only 5 min gap
      endTime: '16:30', // 70 mins -> total > 145 mins
      durationMinutes: 70,
      completed: false,
    },
  ];

  const result = detectFatiguePattern(blocks);
  assert.equal(result.needsRest, true);
  assert.ok(result.consecutiveMinutes >= 120);
  assert.ok(result.reason.includes('tập trung liên tục'));
});

test('detectFatiguePattern marks sustainable routine as no rest needed', () => {
  const blocks: TimelineBlock[] = [
    {
      id: 'b1',
      title: 'Quick Review',
      type: 'review',
      date: '2026-11-07',
      startTime: '16:00',
      endTime: '16:35',
      durationMinutes: 35,
      completed: false,
    },
  ];

  const result = detectFatiguePattern(blocks);
  assert.equal(result.needsRest, false);
});

test('calculateCompetenceMetrics generates positive feedback and accurate rates', () => {
  const blocks: TimelineBlock[] = [
    { id: '1', title: 'Task 1', type: 'study', date: '2026-11-07', startTime: '10:00', endTime: '10:30', durationMinutes: 30, completed: true },
    { id: '2', title: 'Task 2', type: 'study', date: '2026-11-07', startTime: '11:00', endTime: '11:30', durationMinutes: 30, completed: true },
    { id: '3', title: 'Task 3', type: 'study', date: '2026-11-07', startTime: '14:00', endTime: '14:30', durationMinutes: 30, completed: false },
  ];

  const microWins: MicroWin[] = [
    { id: 'mw1', title: 'Solved complex derivative problem', category: 'focus', timestamp: '10:28' },
  ];

  const metrics = calculateCompetenceMetrics(blocks, microWins);
  assert.equal(metrics.completedTasks, 2);
  assert.equal(metrics.totalTasks, 3);
  assert.equal(metrics.completionRate, 67);
  assert.equal(metrics.microWinsCount, 1);
  assert.ok(metrics.positiveFeedback.length > 0);
});

test('parseNaturalLanguageStudyInput breaks down essay and math into micro-tasks', () => {
  const prompt = 'I have a 1000-word essay due Friday and Math Chapter 2 review';
  const parsed = parseNaturalLanguageStudyInput(prompt, '2026-11-07', '16:00');

  assert.ok(parsed.sdtAutonomyOptions.length >= 2, 'Should offer multiple autonomous plan options');
  assert.ok(parsed.blocks.length >= 2, 'Should decompose into multiple blocks including micro-breaks');
  const hasEssay = parsed.blocks.some((b) => {
    const t = b.title.toLowerCase();
    return t.includes('luận') || t.includes('1000') || t.includes('văn') || t.includes('essay');
  });
  const hasMath = parsed.blocks.some((b) => {
    const t = b.title.toLowerCase();
    return t.includes('toán') || t.includes('math') || t.includes('chương 2');
  });
  assert.ok(hasEssay, 'Decomposed blocks should include essay task');
  assert.ok(hasMath, 'Decomposed blocks should include math review');
});
