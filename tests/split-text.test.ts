import test from 'node:test';
import assert from 'node:assert/strict';

import {
  splitTextIntoSegments,
  createDeterministicShuffle,
  calculateSplitTextTiming,
  calculateSplitTextStyle,
} from '../src/components/typography/splitTextStyle.ts';
import type { SplitTextVariant } from '../src/components/typography/types.ts';

test('SplitText: Segmentation across all 5 modes', async (t) => {
  await t.test('handles empty or missing text', () => {
    assert.deepEqual(splitTextIntoSegments(''), []);
    assert.deepEqual(splitTextIntoSegments(undefined), []);
  });

  await t.test('line mode: splits by newline characters and preserves line count', () => {
    const text = 'First line\nSecond line\r\nThird line';
    const segments = splitTextIntoSegments(text, 'line');
    assert.equal(segments.length, 3);
    assert.equal(segments[0].text, 'First line');
    assert.equal(segments[1].text, 'Second line');
    assert.equal(segments[2].text, 'Third line');
    assert.equal(segments[0].isNewline, true);
    assert.equal(segments[2].isNewline, false);
  });

  await t.test('word mode: segments words and preserves trailing whitespace', () => {
    const text = 'Move faster with better experiences';
    const segments = splitTextIntoSegments(text, 'word');
    assert.equal(segments.length, 5);
    assert.equal(segments[0].text, 'Move');
    assert.equal(segments[0].trailingSpace, ' ');
    assert.equal(segments[4].text, 'experiences');
    assert.equal(segments[4].trailingSpace, '');
  });

  await t.test('word mode: preserves punctuation attached to words', () => {
    const text = 'Precision, scale, and performance!';
    const segments = splitTextIntoSegments(text, 'word');
    assert.equal(segments.length, 4);
    assert.equal(segments[0].text, 'Precision,');
    assert.equal(segments[3].text, 'performance!');
  });

  await t.test('character mode: segments grapheme clusters with unicode and emoji', () => {
    const text = 'A 🚀 👨‍👩‍👧‍👦 ü';
    const segments = splitTextIntoSegments(text, 'character');
    assert.ok(segments.length >= 4);
    assert.equal(segments[0].text, 'A');
    // Ensure rocket emoji is preserved as a single grapheme segment
    const rocketSeg = segments.find((s) => s.text === '🚀');
    assert.ok(rocketSeg, 'Rocket emoji must be preserved as single segment');
  });

  await t.test('sentence mode: segments into individual sentences', () => {
    const text = 'Make every moment count. Built for scale! Ready to launch?';
    const segments = splitTextIntoSegments(text, 'sentence');
    assert.equal(segments.length, 3);
    assert.ok(segments[0].text.includes('Make every moment count.'));
    assert.ok(segments[1].text.includes('Built for scale!'));
    assert.ok(segments[2].text.includes('Ready to launch?'));
  });

  await t.test('custom mode: maps custom defined segments with stable ids', () => {
    const custom = [
      { text: 'MOVE', id: 'seg-a' },
      { text: 'FASTER', id: 'seg-b' },
      { text: 'TODAY' }, // missing id falls back to custom-2
    ];
    const segments = splitTextIntoSegments('Ignored', 'custom', custom);
    assert.equal(segments.length, 3);
    assert.equal(segments[0].id, 'seg-a');
    assert.equal(segments[0].text, 'MOVE');
    assert.equal(segments[2].id, 'custom-2');
    assert.equal(segments[2].text, 'TODAY');
  });
});

test('SplitText: Deterministic Seeded Random Shuffling', async (t) => {
  await t.test('produces identical permutation given the same seed', () => {
    const shuffleA = createDeterministicShuffle(10, 42);
    const shuffleB = createDeterministicShuffle(10, 42);
    assert.deepEqual(shuffleA, shuffleB);
  });

  await t.test('produces different permutations given different seeds', () => {
    const shuffleA = createDeterministicShuffle(10, 42);
    const shuffleB = createDeterministicShuffle(10, 999);
    assert.notDeepEqual(shuffleA, shuffleB);
  });

  await t.test('contains all indices from 0 to count - 1 with no duplicates', () => {
    const count = 16;
    const shuffle = createDeterministicShuffle(count, 'custom-seed');
    assert.equal(shuffle.length, count);
    const sorted = [...shuffle].sort((a, b) => a - b);
    for (let i = 0; i < count; i++) {
      assert.equal(sorted[i], i);
    }
  });

  await t.test('handles boundary counts 0 and 1 cleanly', () => {
    assert.deepEqual(createDeterministicShuffle(0), []);
    assert.deepEqual(createDeterministicShuffle(1), [0]);
  });
});

test('SplitText: Timing Calculations & Stagger Progression', async (t) => {
  await t.test('calculates sequential start frames with default staggerDelay', () => {
    const t0 = calculateSplitTextTiming({
      totalSegments: 4,
      segmentIndex: 0,
      startFrame: 10,
      staggerDelay: 3,
      segmentDuration: 15,
    });
    const t3 = calculateSplitTextTiming({
      totalSegments: 4,
      segmentIndex: 3,
      startFrame: 10,
      staggerDelay: 3,
      segmentDuration: 15,
    });
    assert.equal(t0.segmentStartFrame, 10);
    assert.equal(t0.segmentEndFrame, 25);
    assert.equal(t3.segmentStartFrame, 19);
    assert.equal(t3.segmentEndFrame, 34);
    assert.equal(t0.totalDurationInFrames, 34);
  });

  await t.test('reverse flag inverts start frame progression', () => {
    const firstWhenReversed = calculateSplitTextTiming({
      totalSegments: 5,
      segmentIndex: 0,
      startFrame: 0,
      staggerDelay: 2,
      segmentDuration: 10,
      reverse: true,
    });
    const lastWhenReversed = calculateSplitTextTiming({
      totalSegments: 5,
      segmentIndex: 4,
      startFrame: 0,
      staggerDelay: 2,
      segmentDuration: 10,
      reverse: true,
    });
    // First segment (index 0) starts last, last segment (index 4) starts first
    assert.equal(firstWhenReversed.segmentStartFrame, 8);
    assert.equal(lastWhenReversed.segmentStartFrame, 0);
  });

  await t.test('exit timing calculates exitStartFrame correctly', () => {
    const timing = calculateSplitTextTiming({
      totalSegments: 3,
      segmentIndex: 1,
      startFrame: 0,
      exitFrame: 40,
      exitDurationInFrames: 10,
      exitStaggerDelay: 4,
    });
    assert.equal(timing.exitStartFrame, 44);
    assert.equal(timing.exitEndFrame, 54);
  });
});

test('SplitText: All 14 Animation Variants Calculations', async (t) => {
  const variants: SplitTextVariant[] = [
    'fade',
    'slide-up',
    'slide-down',
    'slide-left',
    'slide-right',
    'scale',
    'pop',
    'rotate',
    'blur',
    'flip-up',
    'flip-down',
    'stagger',
    'wave',
    'random-stagger',
  ];

  for (const variant of variants) {
    await t.test(`variant "${variant}" calculates valid visual style at midpoint`, () => {
      const style = calculateSplitTextStyle({
        currentFrame: 15,
        fps: 30,
        totalSegments: 1,
        segmentIndex: 0,
        startFrame: 10,
        segmentDuration: 10,
        variant,
      });

      assert.equal(style.visibility, 'visible');
      assert.ok(style.opacity > 0 && style.opacity <= 1);

      if (['slide-up', 'slide-down', 'wave', 'random-stagger'].includes(variant)) {
        assert.ok(style.transform?.includes('translateY('), `${variant} must calculate translateY`);
      } else if (['slide-left', 'slide-right'].includes(variant)) {
        assert.ok(style.transform?.includes('translateX('), `${variant} must calculate translateX`);
      } else if (['scale', 'pop'].includes(variant)) {
        assert.ok(style.transform?.includes('scale('), `${variant} must calculate scale`);
      } else if (variant === 'rotate') {
        assert.ok(style.transform?.includes('rotate('), `${variant} must calculate rotate`);
      } else if (variant === 'blur') {
        assert.ok(style.filter?.includes('blur('), `${variant} must calculate filter blur`);
      } else if (['flip-up', 'flip-down'].includes(variant)) {
        assert.ok(style.transform?.includes('rotateX('), `${variant} must calculate 3D rotateX`);
        assert.ok(style.transformOrigin !== undefined, `${variant} must have transformOrigin`);
      } else if (variant === 'stagger') {
        assert.ok(style.transform?.includes('translateY(') && style.transform.includes('scale('));
      }
    });
  }
});

test('SplitText: Lifecycle Boundaries & State Transitions', async (t) => {
  await t.test('segment is hidden before startFrame', () => {
    const style = calculateSplitTextStyle({
      currentFrame: 5,
      fps: 30,
      totalSegments: 3,
      segmentIndex: 1,
      startFrame: 10,
      staggerDelay: 4,
    });
    assert.equal(style.opacity, 0);
    assert.equal(style.visibility, 'hidden');
  });

  await t.test('segment is settled and fully visible after duration', () => {
    const style = calculateSplitTextStyle({
      currentFrame: 40,
      fps: 30,
      totalSegments: 3,
      segmentIndex: 0,
      startFrame: 0,
      segmentDuration: 20,
      variant: 'slide-up',
    });
    assert.equal(style.opacity, 1);
    assert.equal(style.visibility, 'visible');
    assert.equal(style.transform, 'translateY(0.00px)');
  });

  await t.test('exit animation hides segment after exit completion', () => {
    const postExit = calculateSplitTextStyle({
      currentFrame: 55,
      fps: 30,
      totalSegments: 2,
      segmentIndex: 0,
      startFrame: 0,
      segmentDuration: 15,
      exitFrame: 40,
      exitDurationInFrames: 10,
    });
    assert.equal(postExit.opacity, 0);
    assert.equal(postExit.visibility, 'hidden');
  });

  await t.test('handles different framerates (24, 30, 60 fps) consistently', () => {
    for (const fps of [24, 30, 60]) {
      const style = calculateSplitTextStyle({
        currentFrame: 15,
        fps,
        totalSegments: 2,
        segmentIndex: 0,
        startFrame: 0,
        segmentDuration: 20,
        variant: 'pop',
      });
      assert.equal(style.visibility, 'visible');
      assert.ok(typeof style.opacity === 'number');
    }
  });
});
