import test from 'node:test';
import assert from 'node:assert/strict';

import {
  calculateTextMaskStyle,
  calculateLineMaskTiming,
  parseMaskLines,
} from '../src/components/typography/textMaskStyle.ts';

test('TextMask: Lifecycle Boundaries & Edge Cases', async (t) => {
  await t.test('before startFrame is hidden and opacity 0', () => {
    const style = calculateTextMaskStyle({
      currentFrame: 5,
      fps: 30,
      startFrame: 10,
      durationInFrames: 20,
    });
    assert.equal(style.opacity, 0);
    assert.equal(style.visibility, 'hidden');
  });

  await t.test('at completion is fully visible and unclipped', () => {
    const style = calculateTextMaskStyle({
      currentFrame: 30,
      fps: 30,
      startFrame: 10,
      durationInFrames: 20,
      variant: 'bottom-reveal',
    });
    assert.equal(style.opacity, 1);
    assert.equal(style.visibility, 'visible');
    assert.equal(style.clipPath, 'inset(0.00% 0% 0.00% 0%)');
  });

  await t.test('zero duration entrance is instantly visible at startFrame', () => {
    const style = calculateTextMaskStyle({
      currentFrame: 10,
      fps: 30,
      startFrame: 10,
      durationInFrames: 0,
      variant: 'mask-slide-up',
    });
    assert.equal(style.opacity, 1);
    assert.equal(style.visibility, 'visible');
    assert.equal(style.transform, 'translateY(0.00%)');
  });

  await t.test('exit animation progresses and hides after completion', () => {
    const midExit = calculateTextMaskStyle({
      currentFrame: 45,
      fps: 30,
      startFrame: 0,
      durationInFrames: 20,
      exitFrame: 40,
      exitDurationInFrames: 10,
      variant: 'bottom-reveal',
    });
    assert.equal(midExit.visibility, 'visible');
    assert.ok(midExit.clipPath?.includes('inset(0.00% 0%'));

    const afterExit = calculateTextMaskStyle({
      currentFrame: 55,
      fps: 30,
      startFrame: 0,
      durationInFrames: 20,
      exitFrame: 40,
      exitDurationInFrames: 10,
      variant: 'bottom-reveal',
    });
    assert.equal(afterExit.opacity, 0);
    assert.equal(afterExit.visibility, 'hidden');
  });

  await t.test('different framerates (24, 30, 60 fps) calculate consistently', () => {
    for (const testFps of [24, 30, 60]) {
      const style = calculateTextMaskStyle({
        currentFrame: 20,
        fps: testFps,
        startFrame: 0,
        durationInFrames: 20,
        variant: 'mask-slide-up',
      });
      assert.equal(style.visibility, 'visible');
      assert.equal(style.transform, 'translateY(0.00%)');
    }
  });
});

test('TextMask: All 11 Mask Variants', async (t) => {
  const midOpts = {
    currentFrame: 10,
    fps: 30,
    startFrame: 0,
    durationInFrames: 20,
  };

  await t.test('variant: bottom-reveal (reveals bottom-to-top)', () => {
    const style = calculateTextMaskStyle({ ...midOpts, variant: 'bottom-reveal' });
    assert.ok(style.clipPath?.startsWith('inset('));
    // Top inset should be decreasing towards 0
    assert.ok(!style.clipPath?.includes('inset(0.00% 0% 0.00% 0%)'));
  });

  await t.test('variant: top-reveal (reveals top-to-bottom)', () => {
    const style = calculateTextMaskStyle({ ...midOpts, variant: 'top-reveal' });
    assert.ok(style.clipPath?.startsWith('inset('));
  });

  await t.test('variant: left-reveal (reveals left-to-right)', () => {
    const style = calculateTextMaskStyle({ ...midOpts, variant: 'left-reveal' });
    assert.ok(style.clipPath?.startsWith('inset('));
  });

  await t.test('variant: right-reveal (reveals right-to-left)', () => {
    const style = calculateTextMaskStyle({ ...midOpts, variant: 'right-reveal' });
    assert.ok(style.clipPath?.startsWith('inset('));
  });

  await t.test('variant: center-reveal (expands outward from center)', () => {
    const style = calculateTextMaskStyle({ ...midOpts, variant: 'center-reveal' });
    assert.ok(style.clipPath?.startsWith('inset('));
  });

  await t.test('variant: center-collapse (reveals inward)', () => {
    const style = calculateTextMaskStyle({ ...midOpts, variant: 'center-collapse' });
    assert.ok(style.clipPath?.startsWith('inset('));
  });

  await t.test('variant: vertical-wipe', () => {
    const style = calculateTextMaskStyle({ ...midOpts, variant: 'vertical-wipe' });
    assert.ok(style.clipPath?.startsWith('inset('));
  });

  await t.test('variant: horizontal-wipe', () => {
    const style = calculateTextMaskStyle({ ...midOpts, variant: 'horizontal-wipe' });
    assert.ok(style.clipPath?.startsWith('inset('));
  });

  await t.test('variant: diagonal-wipe (polygon cutting angle)', () => {
    const style = calculateTextMaskStyle({ ...midOpts, variant: 'diagonal-wipe' });
    assert.ok(style.clipPath?.startsWith('polygon('));
  });

  await t.test('variant: mask-slide-up (percentage distance)', () => {
    const style = calculateTextMaskStyle({ ...midOpts, variant: 'mask-slide-up' });
    assert.ok(style.transform?.includes('translateY('));
    assert.ok(style.transform?.includes('%'));
  });

  await t.test('variant: mask-slide-up (pixel distance)', () => {
    const style = calculateTextMaskStyle({ ...midOpts, variant: 'mask-slide-up', distance: 50 });
    assert.ok(style.transform?.includes('translateY('));
    assert.ok(style.transform?.includes('px'));
  });

  await t.test('variant: line-reveal', () => {
    const style = calculateTextMaskStyle({ ...midOpts, variant: 'line-reveal' });
    assert.ok(style.transform?.includes('translateY('));
  });
});

test('TextMask: Multi-Line & Stagger Calculations', async (t) => {
  await t.test('parseMaskLines handles newline strings and explicit arrays', () => {
    const fromText = parseMaskLines('Line 1\nLine 2\nLine 3');
    assert.deepEqual(fromText, ['Line 1', 'Line 2', 'Line 3']);

    const fromArray = parseMaskLines(undefined, ['Alpha', 'Beta']);
    assert.deepEqual(fromArray, ['Alpha', 'Beta']);

    assert.deepEqual(parseMaskLines(''), []);
  });

  await t.test('calculateLineMaskTiming calculates sequential start frames', () => {
    const timing = calculateLineMaskTiming(3, {
      startFrame: 5,
      staggerDelay: 4,
      lineDuration: 18,
    });

    assert.equal(timing.totalLines, 3);
    assert.equal(timing.totalDurationInFrames, 26); // (3 - 1) * 4 + 18 = 26

    const line0 = timing.getLineTiming(0);
    assert.equal(line0.lineStartFrame, 5);
    assert.equal(line0.lineEndFrame, 23);

    const line1 = timing.getLineTiming(1);
    assert.equal(line1.lineStartFrame, 9);
    assert.equal(line1.lineEndFrame, 27);

    const line2 = timing.getLineTiming(2);
    assert.equal(line2.lineStartFrame, 13);
    assert.equal(line2.lineEndFrame, 31);
  });

  await t.test('reverse order reveals last line first', () => {
    const timing = calculateLineMaskTiming(3, {
      startFrame: 0,
      staggerDelay: 4,
      lineDuration: 18,
      reverse: true,
    });

    const line2 = timing.getLineTiming(2);
    assert.equal(line2.lineStartFrame, 0);

    const line0 = timing.getLineTiming(0);
    assert.equal(line0.lineStartFrame, 8);
  });
});
