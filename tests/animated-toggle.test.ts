import test from 'node:test';
import assert from 'node:assert/strict';

import {
  resolveToggleSize,
  calculateToggleMotion,
  getTrackColor,
  getThumbColor,
  getToggleTrackStyles,
  getToggleThumbStyles,
} from '../src/components/ui/animatedToggleStyle.ts';
import type {
  AnimatedToggleVisualVariant,
  AnimatedToggleAnimationVariant,
} from '../src/components/ui/types.ts';

test('AnimatedToggle: Size Metrics & Proportions', async (t) => {
  await t.test('size "small" and "sm" resolve equal valid metrics', () => {
    const s1 = resolveToggleSize('small');
    const s2 = resolveToggleSize('sm');
    assert.deepEqual(s1, s2);
    assert.equal(s1.trackWidth, 36);
    assert.equal(s1.trackHeight, 20);
    assert.equal(s1.thumbSize, 16);
    assert.equal(s1.travelDistance, 16);
  });

  await t.test('size "medium" and "md" resolve equal valid metrics', () => {
    const m1 = resolveToggleSize('medium');
    const m2 = resolveToggleSize('md');
    assert.deepEqual(m1, m2);
    assert.equal(m1.trackWidth, 48);
    assert.equal(m1.trackHeight, 26);
    assert.equal(m1.thumbSize, 20);
    assert.equal(m1.travelDistance, 22);
  });

  await t.test('size "large" and "lg" resolve equal valid metrics', () => {
    const l1 = resolveToggleSize('large');
    const l2 = resolveToggleSize('lg');
    assert.deepEqual(l1, l2);
    assert.equal(l1.trackWidth, 64);
    assert.equal(l1.trackHeight, 34);
    assert.equal(l1.thumbSize, 26);
    assert.equal(l1.travelDistance, 30);
  });

  await t.test('metrics scale monotonically: small < medium < large', () => {
    const sm = resolveToggleSize('small');
    const md = resolveToggleSize('medium');
    const lg = resolveToggleSize('large');

    assert.ok(sm.trackWidth < md.trackWidth && md.trackWidth < lg.trackWidth);
    assert.ok(sm.thumbSize < md.thumbSize && md.thumbSize < lg.thumbSize);
    assert.ok(sm.travelDistance < md.travelDistance && md.travelDistance < lg.travelDistance);
  });

  await t.test('custom dimensions override defaults safely', () => {
    const custom = resolveToggleSize('medium', 80, 40, 30, 5);
    assert.equal(custom.trackWidth, 80);
    assert.equal(custom.trackHeight, 40);
    assert.equal(custom.thumbSize, 30);
    assert.equal(custom.padding, 5);
    assert.equal(custom.travelDistance, 80 - 30 - 10);
  });
});

test('AnimatedToggle: Initial OFF and ON States', async (t) => {
  const metrics = resolveToggleSize('medium');

  await t.test('initial OFF state before toggleFrame has thumb at 0', () => {
    const motion = calculateToggleMotion({
      currentFrame: 5,
      defaultChecked: false,
      toggleFrame: 20,
      durationInFrames: 12,
      sizeMetrics: metrics,
    });

    assert.equal(motion.progress, 0);
    assert.equal(motion.thumbX, 0);
    assert.equal(motion.effectiveChecked, false);
    assert.equal(motion.isTransitioning, false);
  });

  await t.test('initial ON state before toggleFrame has thumb at travelDistance', () => {
    const motion = calculateToggleMotion({
      currentFrame: 5,
      defaultChecked: true,
      toggleFrame: 20,
      durationInFrames: 12,
      sizeMetrics: metrics,
    });

    assert.equal(motion.progress, 1);
    assert.equal(motion.thumbX, metrics.travelDistance);
    assert.equal(motion.effectiveChecked, true);
    assert.equal(motion.isTransitioning, false);
  });

  await t.test('static checked toggle without toggleFrame is settled ON', () => {
    const motion = calculateToggleMotion({
      currentFrame: 10,
      checked: true,
      sizeMetrics: metrics,
    });

    assert.equal(motion.progress, 1);
    assert.equal(motion.thumbX, metrics.travelDistance);
    assert.equal(motion.effectiveChecked, true);
  });
});

test('AnimatedToggle: OFF to ON Transition Timeline', async (t) => {
  const metrics = resolveToggleSize('medium');

  await t.test('transition starts exactly at toggleFrame', () => {
    const atStart = calculateToggleMotion({
      currentFrame: 20,
      defaultChecked: false,
      toggleFrame: 20,
      durationInFrames: 10,
      animationVariant: 'slide',
      sizeMetrics: metrics,
    });

    assert.equal(atStart.progress, 0);
    assert.equal(atStart.thumbX, 0);
    assert.equal(atStart.isTransitioning, true);
  });

  await t.test('mid-transition progresses smoothly between 0 and 1', () => {
    const mid = calculateToggleMotion({
      currentFrame: 25,
      defaultChecked: false,
      toggleFrame: 20,
      durationInFrames: 10,
      animationVariant: 'slide',
      sizeMetrics: metrics,
    });

    assert.ok(mid.progress > 0.3 && mid.progress < 0.7);
    assert.ok(mid.thumbX > 0 && mid.thumbX < metrics.travelDistance);
    assert.equal(mid.isTransitioning, true);
  });

  await t.test('completed transition settles at target ON state', () => {
    const done = calculateToggleMotion({
      currentFrame: 40,
      defaultChecked: false,
      toggleFrame: 20,
      durationInFrames: 10,
      animationVariant: 'slide',
      sizeMetrics: metrics,
    });

    assert.equal(done.progress, 1);
    assert.equal(done.thumbX, metrics.travelDistance);
    assert.equal(done.effectiveChecked, true);
  });
});

test('AnimatedToggle: ON to OFF Reverse Transition', async (t) => {
  const metrics = resolveToggleSize('medium');

  await t.test('reverses from ON to OFF starting at toggleFrame', () => {
    const before = calculateToggleMotion({
      currentFrame: 10,
      defaultChecked: true,
      checked: false,
      toggleFrame: 20,
      durationInFrames: 10,
      animationVariant: 'slide',
      sizeMetrics: metrics,
    });
    assert.equal(before.progress, 1);

    const mid = calculateToggleMotion({
      currentFrame: 25,
      defaultChecked: true,
      checked: false,
      toggleFrame: 20,
      durationInFrames: 10,
      animationVariant: 'slide',
      sizeMetrics: metrics,
    });
    assert.ok(mid.progress < 1 && mid.progress > 0);

    const after = calculateToggleMotion({
      currentFrame: 35,
      defaultChecked: true,
      checked: false,
      toggleFrame: 20,
      durationInFrames: 10,
      animationVariant: 'slide',
      sizeMetrics: metrics,
    });
    assert.equal(after.progress, 0);
    assert.equal(after.thumbX, 0);
    assert.equal(after.effectiveChecked, false);
  });
});

test('AnimatedToggle: All 7 Animation Variants', async (t) => {
  const metrics = resolveToggleSize('medium');
  const variants: AnimatedToggleAnimationVariant[] = [
    'slide',
    'scale',
    'spring',
    'elastic',
    'fade',
    'color-transition',
    'combined',
  ];

  for (const v of variants) {
    await t.test(`animation variant "${v}" calculates valid progress and thumb coordinates`, () => {
      const motion = calculateToggleMotion({
        currentFrame: 26,
        defaultChecked: false,
        toggleFrame: 20,
        durationInFrames: 12,
        animationVariant: v,
        sizeMetrics: metrics,
      });

      assert.ok(!Number.isNaN(motion.progress));
      assert.ok(!Number.isNaN(motion.thumbX));
      assert.ok(!Number.isNaN(motion.thumbScaleX));
      assert.ok(!Number.isNaN(motion.thumbScaleY));
    });
  }

  await t.test('scale variant squashes and stretches horizontally during motion', () => {
    const mid = calculateToggleMotion({
      currentFrame: 26,
      defaultChecked: false,
      toggleFrame: 20,
      durationInFrames: 12,
      animationVariant: 'scale',
      sizeMetrics: metrics,
    });

    assert.ok(mid.thumbScaleX > 1.0);
    assert.ok(mid.thumbScaleY < 1.0);
  });

  await t.test('spring variant overshoots slightly before settling with snappy preset', () => {
    const springPeak = calculateToggleMotion({
      currentFrame: 28,
      defaultChecked: false,
      toggleFrame: 20,
      durationInFrames: 12,
      animationVariant: 'spring',
      springPreset: 'snappy',
      sizeMetrics: metrics,
    });

    // Valid number and in the upper territory
    assert.ok(springPeak.progress > 0.8);
  });
});

test('AnimatedToggle: Interaction States (disabled, loading)', async (t) => {
  const metrics = resolveToggleSize('medium');

  await t.test('disabled state stays fixed and non-interactive', () => {
    const disabled = calculateToggleMotion({
      currentFrame: 30,
      defaultChecked: false,
      toggleFrame: 20,
      state: 'disabled',
      sizeMetrics: metrics,
    });

    assert.equal(disabled.progress, 0);
    assert.equal(disabled.thumbX, 0);
    assert.equal(disabled.isTransitioning, false);

    const trackStyles = getToggleTrackStyles({
      visualVariant: 'default',
      sizeMetrics: metrics,
      clampedProgress: disabled.clampedProgress,
      state: 'disabled',
    });
    assert.equal(trackStyles.cursor, 'not-allowed');
    assert.equal(trackStyles.opacity, 0.55);
  });

  await t.test('loading state maintains valid layout and progress metrics', () => {
    const loading = calculateToggleMotion({
      currentFrame: 15,
      defaultChecked: true,
      state: 'loading',
      sizeMetrics: metrics,
    });

    assert.equal(loading.progress, 1);
    assert.equal(loading.effectiveChecked, true);
  });
});

test('AnimatedToggle: Visual Variants & Styling', async (t) => {
  const metrics = resolveToggleSize('medium');
  const visualVariants: AnimatedToggleVisualVariant[] = [
    'default',
    'minimal',
    'outlined',
    'filled',
    'labeled',
  ];

  for (const v of visualVariants) {
    await t.test(`visual variant "${v}" calculates valid track and thumb styles`, () => {
      const track = getToggleTrackStyles({
        visualVariant: v,
        sizeMetrics: metrics,
        clampedProgress: 0.5,
      });
      const thumb = getToggleThumbStyles({
        visualVariant: v,
        sizeMetrics: metrics,
        thumbX: 11,
        thumbScaleX: 1.1,
        thumbScaleY: 0.9,
        clampedProgress: 0.5,
      });

      assert.ok(track.width);
      assert.ok(track.height);
      assert.ok(thumb.width);
      assert.ok(thumb.height);
    });
  }

  await t.test('minimal variant produces slimmer track height', () => {
    const minimal = getToggleTrackStyles({
      visualVariant: 'minimal',
      sizeMetrics: metrics,
      clampedProgress: 0,
    });
    const def = getToggleTrackStyles({
      visualVariant: 'default',
      sizeMetrics: metrics,
      clampedProgress: 0,
    });

    assert.ok(Number(minimal.height) < Number(def.height));
  });

  await t.test('outlined variant applies border rule', () => {
    const outlined = getToggleTrackStyles({
      visualVariant: 'outlined',
      sizeMetrics: metrics,
      clampedProgress: 0,
    });

    assert.ok(String(outlined.border).includes('solid'));
  });
});

test('AnimatedToggle: Framerate Consistency & Color Blending', async (t) => {
  const metrics = resolveToggleSize('medium');

  await t.test('motion calculates across 24, 30, and 60 fps without nan', () => {
    for (const fps of [24, 30, 60]) {
      const motion = calculateToggleMotion({
        currentFrame: 25,
        fps,
        defaultChecked: false,
        toggleFrame: 20,
        durationInFrames: 12,
        animationVariant: 'combined',
        sizeMetrics: metrics,
      });

      assert.ok(!Number.isNaN(motion.progress));
      assert.ok(!Number.isNaN(motion.thumbX));
    }
  });

  await t.test('track color blends cleanly between offColor and onColor', () => {
    const c0 = getTrackColor(0, '#2E2E33', '#0E8345');
    const c1 = getTrackColor(1, '#2E2E33', '#0E8345');
    assert.ok(c0);
    assert.ok(c1);
    assert.notEqual(c0, c1);
  });

  await t.test('thumb color blends between off and on thumb colors if distinct', () => {
    const t0 = getThumbColor(0, '#FFFFFF', '#00D1FF');
    const t1 = getThumbColor(1, '#FFFFFF', '#00D1FF');
    assert.ok(t0);
    assert.ok(t1);
  });
});
