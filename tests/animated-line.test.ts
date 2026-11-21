import test from 'node:test';
import assert from 'node:assert/strict';

import {
  calculateLineLength,
  calculateLineAngle,
  calculateLineMidpoint,
  resolveLineCoordinates,
  resolveLineAnimationConfig,
  calculateLineBoundingBox,
  calculateLineMotion,
} from '../src/components/graphics/animatedLineStyle.ts';

test('AnimatedLine: Geometry Calculations & Coordinates', async (t) => {
  await t.test('calculates exact horizontal line Euclidean distance', () => {
    const len = calculateLineLength(0, 0, 100, 0);
    assert.equal(len, 100);
  });

  await t.test('calculates exact vertical line Euclidean distance', () => {
    const len = calculateLineLength(0, 0, 0, 150);
    assert.equal(len, 150);
  });

  await t.test('calculates 3-4-5 Pythagorean diagonal distance', () => {
    const len = calculateLineLength(0, 0, 30, 40);
    assert.equal(len, 50);
  });

  await t.test('calculates exact angle in degrees', () => {
    assert.equal(calculateLineAngle(0, 0, 100, 0), 0);
    assert.equal(calculateLineAngle(0, 0, 0, 100), 90);
    assert.equal(calculateLineAngle(0, 0, 100, 100), 45);
    assert.equal(calculateLineAngle(100, 0, 0, 0), 180);
  });

  await t.test('computes line midpoint coordinates', () => {
    const mid = calculateLineMidpoint(0, 0, 100, 200);
    assert.deepEqual(mid, { x: 50, y: 100 });
  });

  await t.test('resolves horizontal orientation preset', () => {
    const coords = resolveLineCoordinates({ orientation: 'horizontal', length: 180 });
    assert.equal(coords.x1, 0);
    assert.equal(coords.y1, 0);
    assert.equal(coords.x2, 180);
    assert.equal(coords.y2, 0);
    assert.equal(coords.length, 180);
  });

  await t.test('resolves vertical orientation preset', () => {
    const coords = resolveLineCoordinates({ orientation: 'vertical', length: 220 });
    assert.equal(coords.x1, 0);
    assert.equal(coords.y1, 0);
    assert.equal(coords.x2, 0);
    assert.equal(coords.y2, 220);
    assert.equal(coords.length, 220);
  });

  await t.test('resolves diagonal orientation preset', () => {
    const coords = resolveLineCoordinates({ orientation: 'diagonal', length: 100 });
    assert.equal(coords.x1, 0);
    assert.equal(coords.y1, 0);
    assert.equal(coords.x2, 100);
    assert.equal(coords.y2, 100);
  });

  await t.test('explicit x1, y1, x2, y2 override orientation presets', () => {
    const coords = resolveLineCoordinates({
      orientation: 'horizontal',
      x1: 20,
      y1: 30,
      x2: 80,
      y2: 110,
    });
    assert.equal(coords.x1, 20);
    assert.equal(coords.y1, 30);
    assert.equal(coords.x2, 80);
    assert.equal(coords.y2, 110);
    assert.equal(coords.length, 100);
  });

  await t.test('calculates bounding box and ensures dimensions >= strokeWidth', () => {
    const bbox = calculateLineBoundingBox({
      x1: 0,
      y1: 0,
      x2: 200,
      y2: 0,
      strokeWidth: 4,
    });
    assert.equal(bbox.boxWidth, 200);
    assert.equal(bbox.boxHeight, 4);
    assert.equal(bbox.viewBox, '0 0 200 4');
  });
});

test('AnimatedLine: Animation Lifecycle & Stroke Drawing', async (t) => {
  const coords = resolveLineCoordinates({ x1: 0, y1: 0, x2: 100, y2: 0 });

  await t.test('static animation (none) renders fully with progress = 1', () => {
    const config = resolveLineAnimationConfig({ animation: 'none' });
    const motion = calculateLineMotion({
      currentFrame: 0,
      fps: 30,
      coords,
      strokeWidth: 2,
      config,
    });
    assert.equal(motion.progress, 1);
    assert.equal(motion.opacity, 1);
    assert.equal(motion.strokeDashoffset, 0);
  });

  await t.test('draw-in: strokeDashoffset transitions from length to 0', () => {
    const config = resolveLineAnimationConfig({
      animation: 'draw-in',
      delay: 10,
      durationInFrames: 20,
    });

    // Before delay (frame 5)
    const before = calculateLineMotion({
      currentFrame: 5,
      fps: 30,
      coords,
      strokeWidth: 2,
      config,
    });
    assert.equal(before.progress, 0);
    assert.equal(before.strokeDasharray, 100);
    assert.equal(before.strokeDashoffset, 100);

    // Mid animation (frame 20)
    const mid = calculateLineMotion({
      currentFrame: 20,
      fps: 30,
      coords,
      strokeWidth: 2,
      config,
    });
    assert.ok(mid.progress > 0 && mid.progress < 1);
    assert.ok(mid.strokeDashoffset! < 100 && mid.strokeDashoffset! > 0);

    // After completion (frame 30)
    const after = calculateLineMotion({
      currentFrame: 30,
      fps: 30,
      coords,
      strokeWidth: 2,
      config,
    });
    assert.equal(after.progress, 1);
    assert.equal(after.strokeDashoffset, 0);
  });

  await t.test('draw-out: strokeDashoffset transitions from 0 to length', () => {
    const config = resolveLineAnimationConfig({
      animation: 'draw-out',
      delay: 0,
      durationInFrames: 20,
    });

    const start = calculateLineMotion({
      currentFrame: 0,
      fps: 30,
      coords,
      strokeWidth: 2,
      config,
    });
    assert.equal(start.strokeDashoffset, 0);

    const end = calculateLineMotion({
      currentFrame: 20,
      fps: 30,
      coords,
      strokeWidth: 2,
      config,
    });
    assert.equal(end.strokeDashoffset, 100);
  });

  await t.test('reveal-right: reveals from end backwards using negative dashoffset', () => {
    const config = resolveLineAnimationConfig({
      animation: 'reveal-right',
      delay: 0,
      durationInFrames: 20,
    });

    const start = calculateLineMotion({
      currentFrame: 0,
      fps: 30,
      coords,
      strokeWidth: 2,
      config,
    });
    assert.equal(start.strokeDashoffset, -100);

    const end = calculateLineMotion({
      currentFrame: 20,
      fps: 30,
      coords,
      strokeWidth: 2,
      config,
    });
    assert.equal(end.strokeDashoffset, 0);
  });

  await t.test('reveal-center: expands symmetrically from center outward', () => {
    const config = resolveLineAnimationConfig({
      animation: 'reveal-center',
      delay: 0,
      durationInFrames: 20,
      easing: (t) => t, // linear for exact math check
    });

    const start = calculateLineMotion({
      currentFrame: 0,
      fps: 30,
      coords,
      strokeWidth: 2,
      config,
    });
    // At t=0: gap is length/2 = 50, dash is 0
    assert.equal(start.strokeDasharray, '0 50.00 0 100.00');

    const mid = calculateLineMotion({
      currentFrame: 10,
      fps: 30,
      coords,
      strokeWidth: 2,
      config,
    });
    // At t=0.5: gap is 25, dash is 50
    assert.equal(mid.strokeDasharray, '0 25.00 50.00 100.00');

    const end = calculateLineMotion({
      currentFrame: 20,
      fps: 30,
      coords,
      strokeWidth: 2,
      config,
    });
    assert.equal(end.strokeDashoffset, 0);
  });
});

test('AnimatedLine: Length Expansion & Stroke Width Kinematics', async (t) => {
  const coords = resolveLineCoordinates({ x1: 0, y1: 0, x2: 100, y2: 0 });

  await t.test('length-expansion: interpolates endpoint from x1 to x2', () => {
    const config = resolveLineAnimationConfig({
      animation: 'length-expansion',
      delay: 0,
      durationInFrames: 20,
      easing: (t) => t,
    });

    const start = calculateLineMotion({
      currentFrame: 0,
      fps: 30,
      coords,
      strokeWidth: 2,
      config,
    });
    assert.equal(start.effectiveX1, 0);
    assert.equal(start.effectiveX2, 0);

    const mid = calculateLineMotion({
      currentFrame: 10,
      fps: 30,
      coords,
      strokeWidth: 2,
      config,
    });
    assert.equal(mid.effectiveX1, 0);
    assert.equal(mid.effectiveX2, 50);

    const end = calculateLineMotion({
      currentFrame: 20,
      fps: 30,
      coords,
      strokeWidth: 2,
      config,
    });
    assert.equal(end.effectiveX1, 0);
    assert.equal(end.effectiveX2, 100);
  });

  await t.test('length-expansion from center: expands both endpoints outward', () => {
    const config = resolveLineAnimationConfig({
      animation: 'length-expansion',
      direction: 'center',
      delay: 0,
      durationInFrames: 20,
      easing: (t) => t,
    });

    const mid = calculateLineMotion({
      currentFrame: 10,
      fps: 30,
      coords,
      strokeWidth: 2,
      config,
    });
    // Midpoint is 50. Halfway expansion spans 50px (25 to 75)
    assert.equal(mid.effectiveX1, 25);
    assert.equal(mid.effectiveX2, 75);
  });

  await t.test('stroke-width: animates thickness from 0 to full strokeWidth', () => {
    const config = resolveLineAnimationConfig({
      animation: 'stroke-width',
      delay: 0,
      durationInFrames: 20,
      easing: (t) => t,
    });

    const start = calculateLineMotion({
      currentFrame: 0,
      fps: 30,
      coords,
      strokeWidth: 8,
      config,
    });
    assert.equal(start.effectiveStrokeWidth, 0);

    const mid = calculateLineMotion({
      currentFrame: 10,
      fps: 30,
      coords,
      strokeWidth: 8,
      config,
    });
    assert.equal(mid.effectiveStrokeWidth, 4);

    const end = calculateLineMotion({
      currentFrame: 20,
      fps: 30,
      coords,
      strokeWidth: 8,
      config,
    });
    assert.equal(end.effectiveStrokeWidth, 8);
  });

  await t.test('move-in: applies directional translation offset and fades opacity', () => {
    const config = resolveLineAnimationConfig({
      animation: 'move-in',
      direction: 'up',
      delay: 0,
      durationInFrames: 20,
      easing: (t) => t,
    });

    const start = calculateLineMotion({
      currentFrame: 0,
      fps: 30,
      coords,
      strokeWidth: 2,
      config,
    });
    assert.equal(start.translateY, 30);
    assert.equal(start.opacity, 0);

    const end = calculateLineMotion({
      currentFrame: 20,
      fps: 30,
      coords,
      strokeWidth: 2,
      config,
    });
    assert.equal(end.translateY, 0);
    assert.equal(end.opacity, 1);
  });
});

test('AnimatedLine: Exit Transitions & Frame Rates', async (t) => {
  const coords = resolveLineCoordinates({ x1: 0, y1: 0, x2: 100, y2: 0 });

  await t.test('handles fade-out exit transition cleanly at exitFrame', () => {
    const config = resolveLineAnimationConfig({
      animation: 'draw-in',
      delay: 0,
      durationInFrames: 10,
    });

    const beforeExit = calculateLineMotion({
      currentFrame: 20,
      fps: 30,
      coords,
      strokeWidth: 2,
      config,
      exitFrame: 30,
      exitDurationInFrames: 10,
      exitAnimation: 'fade-out',
    });
    assert.equal(beforeExit.opacity, 1);
    assert.equal(beforeExit.hasExited, false);

    const midExit = calculateLineMotion({
      currentFrame: 35,
      fps: 30,
      coords,
      strokeWidth: 2,
      config,
      exitFrame: 30,
      exitDurationInFrames: 10,
      exitAnimation: 'fade-out',
    });
    assert.ok(midExit.opacity < 1 && midExit.opacity > 0);

    const afterExit = calculateLineMotion({
      currentFrame: 45,
      fps: 30,
      coords,
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
    const config = resolveLineAnimationConfig({
      animation: 'draw-in',
      delay: 0,
      durationInFrames: 30,
    });

    const motion24 = calculateLineMotion({
      currentFrame: 15,
      fps: 24,
      coords,
      strokeWidth: 2,
      config,
    });

    const motion30 = calculateLineMotion({
      currentFrame: 15,
      fps: 30,
      coords,
      strokeWidth: 2,
      config,
    });

    const motion60 = calculateLineMotion({
      currentFrame: 15,
      fps: 60,
      coords,
      strokeWidth: 2,
      config,
    });

    assert.equal(motion24.progress, motion30.progress);
    assert.equal(motion30.progress, motion60.progress);
  });
});
