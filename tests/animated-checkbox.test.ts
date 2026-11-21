import test from 'node:test';
import assert from 'node:assert/strict';

import {
  resolveCheckboxSize,
  calculateCheckboxMotion,
  getCheckmarkStrokeParams,
  getCheckboxBoxStyles,
  calculateCheckboxStaggerFrames,
  CHECKMARK_TOTAL_LENGTH,
  INDETERMINATE_TOTAL_LENGTH,
} from '../src/components/ui/animatedCheckboxStyle.ts';
import type {
  AnimatedCheckboxVisualVariant,
  AnimatedCheckboxAnimationVariant,
} from '../src/components/ui/types.ts';

test('AnimatedCheckbox: Size Metrics & Proportions', async (t) => {
  await t.test('size "small" and "sm" resolve equal valid metrics', () => {
    const s1 = resolveCheckboxSize('small');
    const s2 = resolveCheckboxSize('sm');
    assert.deepEqual(s1, s2);
    assert.equal(s1.boxSize, 18);
    assert.equal(s1.borderRadius, 4);
  });

  await t.test('size "medium" and "md" resolve equal valid metrics', () => {
    const m1 = resolveCheckboxSize('medium');
    const m2 = resolveCheckboxSize('md');
    assert.deepEqual(m1, m2);
    assert.equal(m1.boxSize, 24);
    assert.equal(m1.borderRadius, 6);
  });

  await t.test('size "large" and "lg" resolve equal valid metrics', () => {
    const l1 = resolveCheckboxSize('large');
    const l2 = resolveCheckboxSize('lg');
    assert.deepEqual(l1, l2);
    assert.equal(l1.boxSize, 32);
    assert.equal(l1.borderRadius, 8);
  });

  await t.test('metrics scale monotonically: small < medium < large', () => {
    const sm = resolveCheckboxSize('small');
    const md = resolveCheckboxSize('medium');
    const lg = resolveCheckboxSize('large');

    assert.ok(sm.boxSize < md.boxSize && md.boxSize < lg.boxSize);
    assert.ok(sm.strokeWidth < md.strokeWidth && md.strokeWidth < lg.strokeWidth);
    assert.ok(sm.fontSize < md.fontSize && md.fontSize < lg.fontSize);
  });

  await t.test('visual variant "rounded" applies full pill border radius', () => {
    const rounded = resolveCheckboxSize('medium', 'rounded');
    assert.equal(rounded.borderRadius, 9999);
  });

  await t.test('visual variant "square" applies sharp square corners', () => {
    const square = resolveCheckboxSize('medium', 'square');
    assert.equal(square.borderRadius, 2);
  });
});

test('AnimatedCheckbox: Initial Unchecked and Checked States', async (t) => {
  await t.test('initial unchecked state before checkFrame has 0 progress and hidden stroke', () => {
    const motion = calculateCheckboxMotion({
      currentFrame: 5,
      defaultChecked: false,
      checkFrame: 20,
      durationInFrames: 12,
    });

    assert.equal(motion.progress, 0);
    assert.equal(motion.checkDrawProgress, 0);
    assert.equal(motion.effectiveChecked, false);
    assert.equal(motion.isTransitioning, false);

    const stroke = getCheckmarkStrokeParams(motion.checkDrawProgress, false, motion.checkmarkOpacity);
    assert.equal(stroke.strokeDashoffset, CHECKMARK_TOTAL_LENGTH);
  });

  await t.test('initial checked state before checkFrame has full progress and drawn stroke', () => {
    const motion = calculateCheckboxMotion({
      currentFrame: 5,
      defaultChecked: true,
      checkFrame: 20,
      durationInFrames: 12,
    });

    assert.equal(motion.progress, 1);
    assert.equal(motion.checkDrawProgress, 1);
    assert.equal(motion.effectiveChecked, true);
    assert.equal(motion.isTransitioning, false);

    const stroke = getCheckmarkStrokeParams(motion.checkDrawProgress, false, motion.checkmarkOpacity);
    assert.equal(stroke.strokeDashoffset, 0);
  });

  await t.test('static checked checkbox without checkFrame is settled checked', () => {
    const motion = calculateCheckboxMotion({
      currentFrame: 10,
      checked: true,
    });

    assert.equal(motion.progress, 1);
    assert.equal(motion.effectiveChecked, true);
  });
});

test('AnimatedCheckbox: Unchecked to Checked Transition Timeline', async (t) => {
  await t.test('transition starts exactly at checkFrame', () => {
    const atStart = calculateCheckboxMotion({
      currentFrame: 20,
      defaultChecked: false,
      checkFrame: 20,
      durationInFrames: 10,
      animationVariant: 'check-draw',
    });

    assert.equal(atStart.progress, 0);
    assert.equal(atStart.checkDrawProgress, 0);
    assert.equal(atStart.isTransitioning, true);
  });

  await t.test('mid-transition checkmark draws progressively between 0 and totalLength', () => {
    const mid = calculateCheckboxMotion({
      currentFrame: 25,
      defaultChecked: false,
      checkFrame: 20,
      durationInFrames: 10,
      animationVariant: 'check-draw',
    });

    assert.ok(mid.checkDrawProgress > 0 && mid.checkDrawProgress < 1);
    const stroke = getCheckmarkStrokeParams(mid.checkDrawProgress, false, mid.checkmarkOpacity);
    assert.ok(stroke.strokeDashoffset > 0 && stroke.strokeDashoffset < CHECKMARK_TOTAL_LENGTH);
  });

  await t.test('completed transition settles at target checked state', () => {
    const done = calculateCheckboxMotion({
      currentFrame: 40,
      defaultChecked: false,
      checkFrame: 20,
      durationInFrames: 10,
      animationVariant: 'check-draw',
    });

    assert.equal(done.progress, 1);
    assert.equal(done.checkDrawProgress, 1);
    assert.equal(done.effectiveChecked, true);

    const stroke = getCheckmarkStrokeParams(done.checkDrawProgress, false, done.checkmarkOpacity);
    assert.equal(stroke.strokeDashoffset, 0);
  });
});

test('AnimatedCheckbox: Checked to Unchecked Reverse Transition', async (t) => {
  await t.test('reverses smoothly from checked to unchecked starting at checkFrame', () => {
    const before = calculateCheckboxMotion({
      currentFrame: 10,
      defaultChecked: true,
      checked: false,
      checkFrame: 20,
      durationInFrames: 10,
      animationVariant: 'check-draw',
    });
    assert.equal(before.progress, 1);

    const mid = calculateCheckboxMotion({
      currentFrame: 25,
      defaultChecked: true,
      checked: false,
      checkFrame: 20,
      durationInFrames: 10,
      animationVariant: 'check-draw',
    });
    assert.ok(mid.checkDrawProgress < 1 && mid.checkDrawProgress > 0);

    const after = calculateCheckboxMotion({
      currentFrame: 35,
      defaultChecked: true,
      checked: false,
      checkFrame: 20,
      durationInFrames: 10,
      animationVariant: 'check-draw',
    });
    assert.equal(after.progress, 0);
    assert.equal(after.checkDrawProgress, 0);
    assert.equal(after.effectiveChecked, false);
  });
});

test('AnimatedCheckbox: Indeterminate State', async (t) => {
  await t.test('indeterminate state sets effectiveIndeterminate and uses dash stroke params', () => {
    const motion = calculateCheckboxMotion({
      currentFrame: 10,
      indeterminate: true,
    });

    assert.equal(motion.effectiveIndeterminate, true);

    const stroke = getCheckmarkStrokeParams(motion.checkDrawProgress, true, motion.checkmarkOpacity);
    assert.equal(stroke.totalLength, INDETERMINATE_TOTAL_LENGTH);
    assert.ok(stroke.path.includes('18 12'));
  });

  await t.test('explicit state="indeterminate" triggers indeterminate behavior', () => {
    const motion = calculateCheckboxMotion({
      currentFrame: 10,
      state: 'indeterminate',
    });

    assert.equal(motion.effectiveIndeterminate, true);
  });
});

test('AnimatedCheckbox: Interaction States (disabled, error)', async (t) => {
  const metrics = resolveCheckboxSize('medium');

  await t.test('disabled state stays fixed, non-interactive, and dims opacity', () => {
    const disabled = calculateCheckboxMotion({
      currentFrame: 25,
      defaultChecked: false,
      checkFrame: 20,
      state: 'disabled',
    });

    assert.equal(disabled.progress, 0);
    assert.equal(disabled.isTransitioning, false);

    const boxStyles = getCheckboxBoxStyles({
      visualVariant: 'default',
      sizeMetrics: metrics,
      clampedProgress: disabled.clampedProgress,
      scale: disabled.scale,
      errorShakeX: disabled.errorShakeX,
      state: 'disabled',
    });

    assert.equal(boxStyles.cursor, 'not-allowed');
    assert.equal(boxStyles.opacity, 0.5);
  });

  await t.test('error state applies crimson border and horizontal shake displacement', () => {
    const errorMotion = calculateCheckboxMotion({
      currentFrame: 24,
      checkFrame: 20,
      state: 'error',
    });

    assert.notEqual(errorMotion.errorShakeX, 0);

    const boxStyles = getCheckboxBoxStyles({
      visualVariant: 'default',
      sizeMetrics: metrics,
      clampedProgress: errorMotion.clampedProgress,
      scale: errorMotion.scale,
      errorShakeX: errorMotion.errorShakeX,
      state: 'error',
    });

    assert.ok(String(boxStyles.border).includes('solid'));
    assert.ok(String(boxStyles.transform).includes('translate3d'));
  });
});

test('AnimatedCheckbox: All 8 Animation Variants', async (t) => {
  const variants: AnimatedCheckboxAnimationVariant[] = [
    'scale',
    'pop',
    'check-draw',
    'fill',
    'border',
    'fade',
    'bounce',
    'combined',
  ];

  for (const v of variants) {
    await t.test(`animation variant "${v}" calculates valid progress, stroke, and scale`, () => {
      const motion = calculateCheckboxMotion({
        currentFrame: 26,
        defaultChecked: false,
        checkFrame: 20,
        durationInFrames: 12,
        animationVariant: v,
      });

      assert.ok(!Number.isNaN(motion.progress));
      assert.ok(!Number.isNaN(motion.checkDrawProgress));
      assert.ok(!Number.isNaN(motion.scale));
    });
  }

  await t.test('scale variant produces scale feedback greater than 1 mid-transition', () => {
    const mid = calculateCheckboxMotion({
      currentFrame: 26,
      defaultChecked: false,
      checkFrame: 20,
      durationInFrames: 12,
      animationVariant: 'scale',
    });

    assert.ok(mid.scale > 1.0);
  });

  await t.test('pop variant uses spring physics to create noticeable overshoot', () => {
    const pop = calculateCheckboxMotion({
      currentFrame: 28,
      defaultChecked: false,
      checkFrame: 20,
      durationInFrames: 12,
      animationVariant: 'pop',
    });

    assert.ok(pop.scale > 1.0);
  });
});

test('AnimatedCheckbox: All 6 Visual Variants & Box Styles', async (t) => {
  const metrics = resolveCheckboxSize('medium');
  const visualVariants: AnimatedCheckboxVisualVariant[] = [
    'default',
    'rounded',
    'square',
    'filled',
    'outlined',
    'minimal',
  ];

  for (const v of visualVariants) {
    await t.test(`visual variant "${v}" calculates valid container box styles`, () => {
      const box = getCheckboxBoxStyles({
        visualVariant: v,
        sizeMetrics: metrics,
        clampedProgress: 0.5,
        scale: 1,
        errorShakeX: 0,
      });

      assert.ok(box.width);
      assert.ok(box.height);
      assert.ok(box.borderRadius !== undefined);
      assert.ok(box.border);
    });
  }
});

test('AnimatedCheckbox: Multiple Checkbox Stagger Calculations', async (t) => {
  await t.test('calculates sequential staggered check frames', () => {
    const frames = calculateCheckboxStaggerFrames(4, 10, 6, false);
    assert.deepEqual(frames, [10, 16, 22, 28]);
  });

  await t.test('reverse order staggers from last item to first item', () => {
    const frames = calculateCheckboxStaggerFrames(3, 10, 5, true);
    assert.deepEqual(frames, [20, 15, 10]);
  });
});

test('AnimatedCheckbox: Framerate Consistency', async (t) => {
  await t.test('motion calculates consistently across 24, 30, and 60 fps without nan', () => {
    for (const fps of [24, 30, 60]) {
      const motion = calculateCheckboxMotion({
        currentFrame: 25,
        fps,
        defaultChecked: false,
        checkFrame: 20,
        durationInFrames: 12,
        animationVariant: 'combined',
      });

      assert.ok(!Number.isNaN(motion.progress));
      assert.ok(!Number.isNaN(motion.checkDrawProgress));
      assert.ok(!Number.isNaN(motion.scale));
    }
  });
});
