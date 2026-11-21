import test from 'node:test';
import assert from 'node:assert/strict';

import {
  calculateCircumference,
  resolveCircleDimensions,
  calculateArcCoordinates,
  describeArcPath,
  resolveCircleAnimationConfig,
  calculateCircleMotion,
} from '../src/components/graphics/animatedCircleStyle.ts';

test('AnimatedCircle: Geometry Calculations & Coordinates', async (t) => {
  await t.test('calculates exact circle circumference (2 * PI * r)', () => {
    const c = calculateCircumference(50);
    const expected = 2 * Math.PI * 50;
    assert.ok(Math.abs(c - expected) < 1e-6);
  });

  await t.test('resolves circle dimensions from radius and strokeWidth', () => {
    const dims = resolveCircleDimensions({ radius: 40, strokeWidth: 4 });
    assert.equal(dims.radius, 40);
    assert.equal(dims.diameter, 80);
    assert.equal(dims.size, 84);
    assert.equal(dims.cx, 42);
    assert.equal(dims.cy, 42);
    assert.ok(Math.abs(dims.circumference - 2 * Math.PI * 40) < 1e-6);
  });

  await t.test('resolves circle dimensions from size override', () => {
    const dims = resolveCircleDimensions({ size: 100, strokeWidth: 2 });
    assert.equal(dims.radius, 49);
    assert.equal(dims.diameter, 98);
    assert.equal(dims.size, 100);
    assert.equal(dims.cx, 50);
    assert.equal(dims.cy, 50);
  });

  await t.test('computes cardinal arc coordinates with 0° pointing at 12 o\'clock', () => {
    const cx = 100;
    const cy = 100;
    const r = 50;

    // 0° is 12 o'clock (x = cx, y = cy - r)
    const top = calculateArcCoordinates(cx, cy, r, 0);
    assert.ok(Math.abs(top.x - 100) < 1e-4);
    assert.ok(Math.abs(top.y - 50) < 1e-4);

    // 90° is 3 o'clock (x = cx + r, y = cy)
    const right = calculateArcCoordinates(cx, cy, r, 90);
    assert.ok(Math.abs(right.x - 150) < 1e-4);
    assert.ok(Math.abs(right.y - 100) < 1e-4);

    // 180° is 6 o'clock (x = cx, y = cy + r)
    const bottom = calculateArcCoordinates(cx, cy, r, 180);
    assert.ok(Math.abs(bottom.x - 100) < 1e-4);
    assert.ok(Math.abs(bottom.y - 150) < 1e-4);

    // 270° is 9 o'clock (x = cx - r, y = cy)
    const left = calculateArcCoordinates(cx, cy, r, 270);
    assert.ok(Math.abs(left.x - 50) < 1e-4);
    assert.ok(Math.abs(left.y - 100) < 1e-4);
  });

  await t.test('describeArcPath produces valid SVG path string for partial arcs', () => {
    const path = describeArcPath(100, 100, 50, 0, 180, false);
    assert.ok(path.startsWith('M '));
    assert.ok(path.includes('A 50.00 50.00'));
    assert.ok(!path.endsWith('Z'));
  });

  await t.test('describeArcPath closes path with Z when closed is true for sector wedge', () => {
    const path = describeArcPath(100, 100, 50, 0, 90, true);
    assert.ok(path.startsWith('M 100.00 100.00 L'));
    assert.ok(path.endsWith('Z'));
  });
});

test('AnimatedCircle: Animation Lifecycle & Kinematics', async (t) => {
  const dimensions = resolveCircleDimensions({ radius: 50, strokeWidth: 2 });
  const C = dimensions.circumference;

  await t.test('scale-in: transitions scale from 0 to 1', () => {
    const config = resolveCircleAnimationConfig({
      animation: 'scale-in',
      delay: 10,
      durationInFrames: 20,
    });

    // Before delay
    const before = calculateCircleMotion({
      currentFrame: 5,
      fps: 30,
      dimensions,
      strokeWidth: 2,
      config,
    });
    assert.equal(before.scaleX, 0);
    assert.equal(before.opacity, 0);

    // After completion
    const after = calculateCircleMotion({
      currentFrame: 30,
      fps: 30,
      dimensions,
      strokeWidth: 2,
      config,
    });
    assert.equal(after.scaleX, 1);
    assert.equal(after.opacity, 1);
  });

  await t.test('draw-in: strokeDashoffset transitions from circumference to 0', () => {
    const config = resolveCircleAnimationConfig({
      animation: 'draw-in',
      delay: 0,
      durationInFrames: 20,
    });

    const start = calculateCircleMotion({
      currentFrame: 0,
      fps: 30,
      dimensions,
      strokeWidth: 2,
      config,
    });
    assert.equal(start.strokeDasharray, C);
    assert.equal(start.strokeDashoffset, C);

    const end = calculateCircleMotion({
      currentFrame: 20,
      fps: 30,
      dimensions,
      strokeWidth: 2,
      config,
    });
    assert.equal(end.strokeDashoffset, 0);
  });

  await t.test('draw-out: strokeDashoffset transitions from 0 to circumference', () => {
    const config = resolveCircleAnimationConfig({
      animation: 'draw-out',
      delay: 0,
      durationInFrames: 20,
    });

    const start = calculateCircleMotion({
      currentFrame: 0,
      fps: 30,
      dimensions,
      strokeWidth: 2,
      config,
    });
    assert.equal(start.strokeDashoffset, 0);

    const end = calculateCircleMotion({
      currentFrame: 20,
      fps: 30,
      dimensions,
      strokeWidth: 2,
      config,
    });
    assert.equal(end.strokeDashoffset, C);
  });

  await t.test('radial-reveal: sweeps effectiveEndAngle from startAngle to endAngle', () => {
    const config = resolveCircleAnimationConfig({
      animation: 'radial-reveal',
      delay: 0,
      durationInFrames: 20,
      easing: (t) => t,
    });

    const mid = calculateCircleMotion({
      currentFrame: 10,
      fps: 30,
      dimensions,
      strokeWidth: 2,
      startAngle: 0,
      endAngle: 360,
      config,
    });
    assert.equal(mid.effectiveStartAngle, 0);
    assert.equal(mid.effectiveEndAngle, 180);

    const end = calculateCircleMotion({
      currentFrame: 20,
      fps: 30,
      dimensions,
      strokeWidth: 2,
      startAngle: 0,
      endAngle: 360,
      config,
    });
    assert.equal(end.effectiveEndAngle, 360);
  });

  await t.test('ring-expansion: expands effectiveRadius outward', () => {
    const config = resolveCircleAnimationConfig({
      animation: 'ring-expansion',
      delay: 0,
      durationInFrames: 20,
      easing: (t) => t,
    });

    const start = calculateCircleMotion({
      currentFrame: 0,
      fps: 30,
      dimensions,
      strokeWidth: 2,
      config,
    });
    assert.equal(start.effectiveRadius, 0);

    const mid = calculateCircleMotion({
      currentFrame: 10,
      fps: 30,
      dimensions,
      strokeWidth: 2,
      config,
    });
    assert.equal(mid.effectiveRadius, 25);

    const end = calculateCircleMotion({
      currentFrame: 20,
      fps: 30,
      dimensions,
      strokeWidth: 2,
      config,
    });
    assert.equal(end.effectiveRadius, 50);
  });

  await t.test('pulse: oscillates scale periodically without boundary drift', () => {
    const config = resolveCircleAnimationConfig({
      animation: 'pulse',
      delay: 0,
      durationInFrames: 60,
    });

    const atQuarterCycle = calculateCircleMotion({
      currentFrame: 7.5,
      fps: 30,
      dimensions,
      strokeWidth: 2,
      config,
    });
    // At quarter cycle (phase = PI/2), sin(PI/2) = 1, scale is 1 + pulseMagnitude (1.08)
    assert.ok(atQuarterCycle.scaleX > 1.0);

    const atHalfCycle = calculateCircleMotion({
      currentFrame: 15,
      fps: 30,
      dimensions,
      strokeWidth: 2,
      config,
    });
    // At half cycle (phase = PI), sin(PI) = 0, scale is ~1.0
    assert.ok(Math.abs(atHalfCycle.scaleX - 1.0) < 1e-4);
  });

  await t.test('progress: calculates exact strokeDasharray matching circular percentage', () => {
    const config = resolveCircleAnimationConfig({
      animation: 'progress',
      delay: 0,
      durationInFrames: 20,
      easing: (t) => t,
    });

    const end = calculateCircleMotion({
      currentFrame: 20,
      fps: 30,
      dimensions,
      strokeWidth: 2,
      progress: 0.75,
      config,
    });
    const expectedArc = (0.75 * C).toFixed(2);
    assert.equal(end.strokeDasharray, `${expectedArc} ${C.toFixed(2)}`);
    assert.equal(end.strokeDashoffset, 0);
  });

  await t.test('stroke-width: animates thickness from 0 to full strokeWidth', () => {
    const config = resolveCircleAnimationConfig({
      animation: 'stroke-width',
      delay: 0,
      durationInFrames: 20,
      easing: (t) => t,
    });

    const mid = calculateCircleMotion({
      currentFrame: 10,
      fps: 30,
      dimensions,
      strokeWidth: 6,
      config,
    });
    assert.equal(mid.effectiveStrokeWidth, 3);

    const end = calculateCircleMotion({
      currentFrame: 20,
      fps: 30,
      dimensions,
      strokeWidth: 6,
      config,
    });
    assert.equal(end.effectiveStrokeWidth, 6);
  });
});

test('AnimatedCircle: Exit Transitions & Frame Rates', async (t) => {
  const dimensions = resolveCircleDimensions({ radius: 50, strokeWidth: 2 });

  await t.test('handles fade-out exit transition cleanly at exitFrame', () => {
    const config = resolveCircleAnimationConfig({
      animation: 'scale-in',
      delay: 0,
      durationInFrames: 10,
    });

    const beforeExit = calculateCircleMotion({
      currentFrame: 20,
      fps: 30,
      dimensions,
      strokeWidth: 2,
      config,
      exitFrame: 30,
      exitDurationInFrames: 10,
      exitAnimation: 'fade-out',
    });
    assert.equal(beforeExit.opacity, 1);
    assert.equal(beforeExit.hasExited, false);

    const afterExit = calculateCircleMotion({
      currentFrame: 45,
      fps: 30,
      dimensions,
      strokeWidth: 2,
      config,
      exitFrame: 30,
      exitDurationInFrames: 10,
      exitAnimation: 'fade-out',
    });
    assert.equal(afterExit.opacity, 0);
    assert.equal(afterExit.hasExited, true);
  });

  await t.test('different framerates (24, 30, 60 fps) calculate consistently', () => {
    const config = resolveCircleAnimationConfig({
      animation: 'draw-in',
      delay: 0,
      durationInFrames: 30,
    });

    const m24 = calculateCircleMotion({
      currentFrame: 15,
      fps: 24,
      dimensions,
      strokeWidth: 2,
      config,
    });

    const m30 = calculateCircleMotion({
      currentFrame: 15,
      fps: 30,
      dimensions,
      strokeWidth: 2,
      config,
    });

    const m60 = calculateCircleMotion({
      currentFrame: 15,
      fps: 60,
      dimensions,
      strokeWidth: 2,
      config,
    });

    assert.equal(m24.progress, m30.progress);
    assert.equal(m30.progress, m60.progress);
  });
});
