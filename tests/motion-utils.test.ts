import test from 'node:test';
import assert from 'node:assert/strict';

import {
  clamp,
  normalizeRange,
  mapRange,
  getProgress,
  reverseProgress,
} from '../src/utils/animation/clamp.ts';

import {
  EasingPresets,
  resolveEasing,
  createBezierEasing,
} from '../src/utils/animation/easing.ts';

import {
  createSpring,
  getSpringProgress,
} from '../src/utils/animation/spring.ts';

import {
  interpolateValue,
  clampedInterpolate,
} from '../src/utils/animation/interpolate.ts';

import {
  secondsToFrames,
  millisecondsToFrames,
  framesToSeconds,
  framesToMilliseconds,
  formatTimecode,
} from '../src/utils/timing/frame.ts';

import {
  getLocalFrame,
  getDelayedFrame,
  isFrameInRange,
  getRemainingFrames,
  getAnimationProgress,
} from '../src/utils/timing/duration.ts';

import {
  calculateSequenceBounds,
  getSequenceProgress,
  getSequenceItemIndex,
  calculateStagger,
} from '../src/utils/timing/sequence.ts';

import { MOTION } from '../src/styles/motion.ts';

test('Clamp & Range Utilities', async (t) => {
  await t.test('clamp() restricts value within boundaries', () => {
    assert.equal(clamp(5, 0, 10), 5);
    assert.equal(clamp(-5, 0, 10), 0);
    assert.equal(clamp(15, 0, 10), 10);
    // reversed min/max
    assert.equal(clamp(5, 10, 0), 5);
  });

  await t.test('normalizeRange() scales value to 0..1', () => {
    assert.equal(normalizeRange(50, 0, 100), 0.5);
    assert.equal(normalizeRange(0, 0, 100), 0);
    assert.equal(normalizeRange(100, 0, 100), 1);
    assert.equal(normalizeRange(-10, 0, 100), 0);
    assert.equal(normalizeRange(150, 0, 100), 1);
    // edge case: min === max
    assert.equal(normalizeRange(10, 10, 10), 1);
    assert.equal(normalizeRange(5, 10, 10), 0);
  });

  await t.test('mapRange() projects between arbitrary ranges', () => {
    assert.equal(mapRange(5, 0, 10, 100, 200), 150);
    assert.equal(mapRange(-5, 0, 10, 100, 200, true), 100);
    assert.equal(mapRange(15, 0, 10, 100, 200, true), 200);
    assert.equal(mapRange(15, 0, 10, 100, 200, false), 250);
    // edge case: inMin === inMax
    assert.equal(mapRange(5, 10, 10, 100, 200), 100);
  });

  await t.test('getProgress() & reverseProgress()', () => {
    assert.equal(getProgress(10, 0, 20), 0.5);
    assert.equal(getProgress(-5, 0, 20), 0);
    assert.equal(getProgress(25, 0, 20), 1);
    // zero or negative duration
    assert.equal(getProgress(5, 5, 0), 1);
    assert.equal(getProgress(4, 5, 0), 0);

    assert.equal(reverseProgress(0.2), 0.8);
    assert.equal(reverseProgress(1.5), 0);
    assert.equal(reverseProgress(-0.5), 1);
  });
});

test('Easing Presets & Functions', async (t) => {
  await t.test('all required easing curves exist and are functions', () => {
    const requiredEasings = [
      'linear',
      'easeIn',
      'easeOut',
      'easeInOut',
      'easeInCubic',
      'easeOutCubic',
      'easeInOutCubic',
      'easeInExpo',
      'easeOutExpo',
      'easeInOutExpo',
      'easeInQuart',
      'easeOutQuart',
      'easeInOutQuart',
      'standard',
      'emphasized',
      'decelerate',
      'accelerate',
    ] as const;

    for (const name of requiredEasings) {
      const fn = EasingPresets[name];
      assert.equal(typeof fn, 'function', `Easing ${name} should be a function`);
      assert.equal(typeof fn(0), 'number');
      assert.equal(typeof fn(1), 'number');
      assert.ok(Math.abs(fn(0)) < 0.05, `${name} at 0 should be near 0`);
      assert.ok(Math.abs(fn(1) - 1) < 0.05, `${name} at 1 should be near 1`);
    }
  });

  await t.test('resolveEasing handles preset names, custom functions, and undefined', () => {
    assert.equal(resolveEasing('easeOut'), EasingPresets.easeOut);
    const custom = (t: number) => t * t;
    assert.equal(resolveEasing(custom), custom);
    assert.equal(resolveEasing(undefined), undefined);
  });

  await t.test('createBezierEasing returns a callable easing', () => {
    const bezier = createBezierEasing(0.25, 0.1, 0.25, 1.0);
    assert.equal(typeof bezier, 'function');
    assert.ok(bezier(0.5) > 0 && bezier(0.5) < 1);
  });
});

test('Spring Calculation & Presets', async (t) => {
  await t.test('all standard spring presets are defined in MOTION', () => {
    const requiredPresets = ['gentle', 'smooth', 'bouncy', 'snappy', 'heavy', 'stiff'] as const;
    for (const preset of requiredPresets) {
      assert.ok(MOTION.spring[preset], `Spring preset ${preset} must exist`);
      assert.ok(typeof MOTION.spring[preset].damping === 'number');
      assert.ok(typeof MOTION.spring[preset].stiffness === 'number');
      assert.ok(typeof MOTION.spring[preset].mass === 'number');
    }
  });

  await t.test('createSpring respects boundaries before delay', () => {
    const beforeStart = createSpring({
      frame: 5,
      fps: 30,
      delay: 10,
      from: 0,
      to: 100,
    });
    assert.equal(beforeStart, 0);

    const beforeStartReverse = createSpring({
      frame: 5,
      fps: 30,
      delay: 10,
      from: 0,
      to: 100,
      reverse: true,
    });
    assert.equal(beforeStartReverse, 100);
  });

  await t.test('createSpring progresses toward target', () => {
    const initial = createSpring({ frame: 10, fps: 30, delay: 10, from: 0, to: 1 });
    assert.equal(initial, 0);

    const mid = createSpring({ frame: 25, fps: 30, delay: 10, from: 0, to: 1, preset: 'snappy' });
    assert.ok(mid > 0.5, `Mid spring should have progressed significantly, got ${mid}`);

    const settled = createSpring({ frame: 100, fps: 30, delay: 10, from: 0, to: 1, preset: 'snappy' });
    assert.ok(Math.abs(settled - 1) < 0.01, `Settled spring should be ~1, got ${settled}`);
  });

  await t.test('getSpringProgress returns 0..1 progression', () => {
    const prog = getSpringProgress({ frame: 100, fps: 30, delay: 0 });
    assert.ok(Math.abs(prog - 1) < 0.01);
  });
});

test('Interpolation Utilities', async (t) => {
  await t.test('interpolateValue with linear mapping', () => {
    const res = interpolateValue({
      frame: 15,
      inputRange: [0, 30],
      outputRange: [0, 100],
    });
    assert.equal(res, 50);
  });

  await t.test('interpolateValue with multi-point range', () => {
    const res = interpolateValue({
      frame: 15,
      inputRange: [0, 10, 20],
      outputRange: [0, 100, 50],
    });
    assert.equal(res, 75);
  });

  await t.test('clampedInterpolate respects clamp boundaries', () => {
    const clampedBefore = clampedInterpolate({
      frame: -10,
      inputRange: [0, 30],
      outputRange: [10, 20],
    });
    assert.equal(clampedBefore, 10);

    const clampedAfter = clampedInterpolate({
      frame: 50,
      inputRange: [0, 30],
      outputRange: [10, 20],
    });
    assert.equal(clampedAfter, 20);
  });
});

test('Timing & Frame Utilities', async (t) => {
  await t.test('frame and seconds conversions', () => {
    assert.equal(secondsToFrames(2, 30), 60);
    assert.equal(secondsToFrames(1.5, 60), 90);
    assert.equal(framesToSeconds(60, 30), 2);
    assert.equal(millisecondsToFrames(1000, 30), 30);
    assert.equal(framesToMilliseconds(30, 30), 1000);
  });

  await t.test('formatTimecode formats correctly', () => {
    assert.equal(formatTimecode(0, 30), '00:00:00');
    assert.equal(formatTimecode(45, 30), '00:01:15');
    assert.equal(formatTimecode(1800, 30), '01:00:00');
  });

  await t.test('window & duration helpers', () => {
    assert.equal(getLocalFrame(25, 20), 5);
    assert.equal(getDelayedFrame(30, 10), 20);
    assert.equal(isFrameInRange(25, 20, 10), true);
    assert.equal(isFrameInRange(15, 20, 10), false);
    assert.equal(isFrameInRange(30, 20, 10), false);

    assert.equal(getRemainingFrames(25, 20, 10), 5);
    assert.equal(getRemainingFrames(35, 20, 10), 0);
    assert.equal(getRemainingFrames(10, 20, 10), 10);

    assert.equal(getAnimationProgress(25, 20, 10), 0.5);
  });

  await t.test('sequence helpers calculate bounds and indices correctly', () => {
    const items = [
      { durationInFrames: 30 },
      { durationInFrames: 20, delay: 5 },
      { durationInFrames: 15 },
    ];

    const bounds = calculateSequenceBounds(items, 0);
    assert.equal(bounds.length, 3);
    assert.deepEqual(bounds[0], { startFrame: 0, endFrame: 30, durationInFrames: 30, index: 0 });
    assert.deepEqual(bounds[1], { startFrame: 35, endFrame: 55, durationInFrames: 20, index: 1 });
    assert.deepEqual(bounds[2], { startFrame: 55, endFrame: 70, durationInFrames: 15, index: 2 });

    assert.equal(getSequenceItemIndex(15, bounds), 0);
    assert.equal(getSequenceItemIndex(32, bounds), -1); // in delay gap
    assert.equal(getSequenceItemIndex(40, bounds), 1);
    assert.equal(getSequenceItemIndex(60, bounds), 2);
    assert.equal(getSequenceItemIndex(80, bounds), -1);

    assert.equal(getSequenceProgress(45, bounds[1]), 0.5);
    assert.equal(calculateStagger(3, 4, 10), 22);
  });
});
