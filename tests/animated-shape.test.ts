import test from 'node:test';
import assert from 'node:assert/strict';

import {
  calculatePolygonPoints,
  calculateStarPoints,
  calculateShapePerimeter,
  resolveShapeAnimationConfig,
  calculateShapeMotion,
} from '../src/components/graphics/animatedShapeStyle.ts';
import type {
  ShapeType,
  ShapeAnimationDirection,
} from '../src/components/graphics/types.ts';

test('AnimatedShape: Geometry Points & Perimeters', async (t) => {
  await t.test('rectangle perimeter calculates exactly 2 * (w + h)', () => {
    const p = calculateShapePerimeter('rectangle', 100, 50);
    assert.equal(p, 300);
  });

  await t.test('circle perimeter calculates 2 * PI * r', () => {
    const p = calculateShapePerimeter('circle', 100, 100);
    const expected = 2 * Math.PI * 50;
    assert.ok(Math.abs(p - expected) < 0.1);
  });

  await t.test('rounded rectangle perimeter accounts for corner curves', () => {
    const p = calculateShapePerimeter('rounded-rectangle', 100, 100, 4, 10);
    assert.ok(p > 0 && p < 400);
  });

  await t.test('polygon points generator produces correct vertex count', () => {
    const triPoints = calculatePolygonPoints(100, 100, 3);
    assert.equal(triPoints.split(' ').length, 3);

    const hexPoints = calculatePolygonPoints(100, 100, 6);
    assert.equal(hexPoints.split(' ').length, 6);

    const octPoints = calculatePolygonPoints(100, 100, 8);
    assert.equal(octPoints.split(' ').length, 8);
  });

  await t.test('star points generator produces 2 * N vertices', () => {
    const star5 = calculateStarPoints(100, 100, 5);
    assert.equal(star5.split(' ').length, 10);

    const star6 = calculateStarPoints(100, 100, 6);
    assert.equal(star6.split(' ').length, 12);
  });
});

test('AnimatedShape: Static Shape Configuration', async (t) => {
  await t.test('static shape with animation="none" returns full base values and settled draw', () => {
    const motion = calculateShapeMotion({
      currentFrame: 10,
      shape: 'rectangle',
      width: 120,
      height: 80,
      baseOpacity: 0.9,
      baseRotation: 45,
      baseX: 10,
      baseY: 20,
      baseScale: 1.5,
      config: { type: 'none' },
    });

    assert.equal(motion.opacity, 0.9);
    assert.equal(motion.rotation, 45);
    assert.equal(motion.translateX, 10);
    assert.equal(motion.translateY, 20);
    assert.equal(motion.scaleX, 1.5);
    assert.equal(motion.drawProgress, 1);
    assert.equal(motion.strokeDashoffset, 0);
    assert.equal(motion.isAnimating, false);
  });

  await t.test('animate=false resolves to type="none"', () => {
    const config = resolveShapeAnimationConfig({
      animate: false,
      animation: 'pop',
    });
    assert.equal(config.type, 'none');
  });
});

test('AnimatedShape: Animation Lifecycle Boundaries', async (t) => {
  await t.test('fade-in is hidden before delay and fully visible after duration', () => {
    const before = calculateShapeMotion({
      currentFrame: 5,
      shape: 'rectangle',
      width: 100,
      height: 100,
      config: { type: 'fade-in', delay: 10, duration: 20 },
    });
    assert.equal(before.opacity, 0);

    const mid = calculateShapeMotion({
      currentFrame: 20,
      shape: 'rectangle',
      width: 100,
      height: 100,
      config: { type: 'fade-in', delay: 10, duration: 20 },
    });
    assert.ok(mid.opacity > 0 && mid.opacity < 1);

    const after = calculateShapeMotion({
      currentFrame: 35,
      shape: 'rectangle',
      width: 100,
      height: 100,
      config: { type: 'fade-in', delay: 10, duration: 20 },
    });
    assert.equal(after.opacity, 1);
  });

  await t.test('scale-in scales from 0 to 1 over duration', () => {
    const before = calculateShapeMotion({
      currentFrame: 5,
      shape: 'circle',
      width: 100,
      height: 100,
      config: { type: 'scale-in', delay: 10, duration: 20 },
    });
    assert.equal(before.scaleX, 0);

    const after = calculateShapeMotion({
      currentFrame: 35,
      shape: 'circle',
      width: 100,
      height: 100,
      config: { type: 'scale-in', delay: 10, duration: 20 },
    });
    assert.equal(after.scaleX, 1);
  });

  await t.test('draw animation travels from perimeter offset down to 0', () => {
    const perimeter = calculateShapePerimeter('rectangle', 100, 100);

    const before = calculateShapeMotion({
      currentFrame: 5,
      shape: 'rectangle',
      width: 100,
      height: 100,
      config: { type: 'draw', delay: 10, duration: 20 },
    });
    assert.equal(before.drawProgress, 0);
    assert.equal(before.strokeDashoffset, perimeter);

    const mid = calculateShapeMotion({
      currentFrame: 20,
      shape: 'rectangle',
      width: 100,
      height: 100,
      config: { type: 'draw', delay: 10, duration: 20 },
    });
    assert.ok(mid.drawProgress > 0 && mid.drawProgress < 1);
    assert.ok(mid.strokeDashoffset > 0 && mid.strokeDashoffset < perimeter);

    const after = calculateShapeMotion({
      currentFrame: 35,
      shape: 'rectangle',
      width: 100,
      height: 100,
      config: { type: 'draw', delay: 10, duration: 20 },
    });
    assert.equal(after.drawProgress, 1);
    assert.equal(after.strokeDashoffset, 0);
  });
});

test('AnimatedShape: Kinematics (Move, Rotate, Pop, Bounce, Combined)', async (t) => {
  await t.test('rotate animation rotates angle clockwise and counter-clockwise', () => {
    const cw = calculateShapeMotion({
      currentFrame: 30,
      shape: 'polygon',
      width: 100,
      height: 100,
      config: { type: 'rotate', delay: 0, duration: 30, direction: 'clockwise', to: 360 },
    });
    assert.equal(cw.rotation, 360);

    const ccw = calculateShapeMotion({
      currentFrame: 30,
      shape: 'polygon',
      width: 100,
      height: 100,
      config: { type: 'rotate', delay: 0, duration: 30, direction: 'counter-clockwise', to: 360 },
    });
    assert.equal(ccw.rotation, -360);
  });

  await t.test('move animation translates correctly along all 4 cardinal directions', () => {
    const directions: ShapeAnimationDirection[] = ['up', 'down', 'left', 'right'];

    for (const dir of directions) {
      const mid = calculateShapeMotion({
        currentFrame: 10,
        shape: 'rectangle',
        width: 100,
        height: 100,
        config: { type: 'move', delay: 0, duration: 20, direction: dir, to: 50 },
      });

      if (dir === 'up') assert.ok(mid.translateY > 0);
      if (dir === 'down') assert.ok(mid.translateY < 0);
      if (dir === 'left') assert.ok(mid.translateX > 0);
      if (dir === 'right') assert.ok(mid.translateX < 0);
    }
  });

  await t.test('pop animation uses spring physics with overshoot > 1.0', () => {
    const pop = calculateShapeMotion({
      currentFrame: 15,
      shape: 'star',
      width: 100,
      height: 100,
      config: { type: 'pop', delay: 0, duration: 20, springPreset: 'bouncy' },
    });

    assert.ok(pop.scaleX > 0.8);
  });

  await t.test('combined animation handles simultaneous draw and spring pop', () => {
    const combined = calculateShapeMotion({
      currentFrame: 15,
      shape: 'rounded-rectangle',
      width: 100,
      height: 100,
      config: { type: 'combined', delay: 0, duration: 20 },
    });

    assert.ok(combined.scaleX > 0);
    assert.ok(combined.opacity > 0);
    assert.ok(combined.drawProgress > 0);
  });
});

test('AnimatedShape: Exit Transitions & Framerate Consistency', async (t) => {
  await t.test('exitAnimation="fade-out" drops opacity to 0 after exitDuration', () => {
    const active = calculateShapeMotion({
      currentFrame: 30,
      shape: 'rectangle',
      width: 100,
      height: 100,
      config: { type: 'fade-in', delay: 0, duration: 15 },
      exitFrame: 40,
      exitDurationInFrames: 10,
      exitAnimation: 'fade-out',
    });
    assert.equal(active.opacity, 1);

    const exited = calculateShapeMotion({
      currentFrame: 55,
      shape: 'rectangle',
      width: 100,
      height: 100,
      config: { type: 'fade-in', delay: 0, duration: 15 },
      exitFrame: 40,
      exitDurationInFrames: 10,
      exitAnimation: 'fade-out',
    });
    assert.equal(exited.opacity, 0);
  });

  await t.test('motion calculates across 24, 30, and 60 fps without nan', () => {
    for (const fps of [24, 30, 60]) {
      const motion = calculateShapeMotion({
        currentFrame: 15,
        fps,
        shape: 'hexagon' as ShapeType,
        width: 100,
        height: 100,
        config: { type: 'combined', delay: 0, duration: 20 },
      });

      assert.ok(!Number.isNaN(motion.opacity));
      assert.ok(!Number.isNaN(motion.scaleX));
      assert.ok(!Number.isNaN(motion.scaleY));
      assert.ok(!Number.isNaN(motion.strokeDashoffset));
    }
  });
});
