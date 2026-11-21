import test from 'node:test';
import assert from 'node:assert/strict';

import {
  resolveArrowCoordinates,
  describeArrowPath,
  calculateArrowheadPath,
  calculateArrowBoundingBox,
  resolveArrowAnimationConfig,
  calculateArrowMotion,
} from '../src/components/graphics/animatedArrowStyle.ts';

test('AnimatedArrow: Geometry Calculations & Coordinates', async (t) => {
  await t.test('resolves horizontal right direction preset', () => {
    const coords = resolveArrowCoordinates({ direction: 'right', length: 120 });
    assert.equal(coords.x1, 0);
    assert.equal(coords.y1, 0);
    assert.equal(coords.x2, 120);
    assert.equal(coords.y2, 0);
    assert.equal(coords.endAngle, 0);
    assert.equal(coords.length, 120);
    assert.equal(coords.isCurved, false);
  });

  await t.test('resolves vertical down direction preset', () => {
    const coords = resolveArrowCoordinates({ direction: 'down', length: 100 });
    assert.equal(coords.x1, 0);
    assert.equal(coords.y1, 0);
    assert.equal(coords.x2, 0);
    assert.equal(coords.y2, 100);
    assert.equal(coords.endAngle, 90);
    assert.equal(coords.length, 100);
  });

  await t.test('resolves diagonal up-right direction preset', () => {
    const coords = resolveArrowCoordinates({ direction: 'diagonal-up-right', length: 100 });
    assert.equal(coords.x1, 0);
    assert.equal(coords.y1, 0);
    assert.equal(coords.x2, 100);
    assert.equal(coords.y2, -100);
    assert.equal(coords.endAngle, -45);
  });

  await t.test('calculates perpendicular control point and arc length for curved arrows', () => {
    const coords = resolveArrowCoordinates({
      x1: 0,
      y1: 0,
      x2: 100,
      y2: 0,
      curvature: 0.5,
    });
    assert.equal(coords.isCurved, true);
    // Control point should be displaced vertically perpendicular to horizontal chord
    assert.equal(coords.cx, 50);
    assert.ok(coords.cy !== 0);
    // Curved length must exceed straight chord length (100)
    assert.ok(coords.length > 100);
  });

  await t.test('describeArrowPath outputs L for straight and Q for curved arrows', () => {
    const straight = resolveArrowCoordinates({ direction: 'right', length: 80 });
    assert.ok(describeArrowPath(straight).includes('L 80.00 0.00'));

    const curved = resolveArrowCoordinates({ direction: 'right', length: 80, curvature: 0.4 });
    assert.ok(describeArrowPath(curved).includes('Q '));
  });

  await t.test('calculateArrowheadPath generates valid paths for multiple styles', () => {
    const triangle = calculateArrowheadPath({ tipX: 100, tipY: 50, angleInDegrees: 0, size: 14, style: 'triangle' });
    assert.ok(triangle.startsWith('M 100.00 50.00') && triangle.endsWith('Z'));

    const chevron = calculateArrowheadPath({ tipX: 100, tipY: 50, angleInDegrees: 0, size: 14, style: 'chevron' });
    assert.ok(!chevron.endsWith('Z')); // open V-shape

    const stealth = calculateArrowheadPath({ tipX: 100, tipY: 50, angleInDegrees: 0, size: 14, style: 'stealth' });
    assert.ok(stealth.endsWith('Z'));

    const circle = calculateArrowheadPath({ tipX: 100, tipY: 50, angleInDegrees: 0, size: 14, style: 'circle' });
    assert.ok(circle.includes('A '));
  });

  await t.test('calculateArrowBoundingBox includes arrowhead padding and positive viewport', () => {
    const coords = resolveArrowCoordinates({ direction: 'right', length: 150 });
    const bbox = calculateArrowBoundingBox({ coords, arrowheadSize: 14, strokeWidth: 2 });
    assert.ok(bbox.boxWidth >= 150);
    assert.ok(bbox.boxHeight >= 28);
    assert.ok(bbox.viewBox.startsWith('0 0 '));
  });
});

test('AnimatedArrow: Animation Lifecycle & Arrowhead Timing', async (t) => {
  const coords = resolveArrowCoordinates({ direction: 'right', length: 100 });

  await t.test('draw-in: strokeDashoffset transitions from length to 0', () => {
    const config = resolveArrowAnimationConfig({
      animation: 'draw-in',
      delay: 5,
      durationInFrames: 20,
    });

    const before = calculateArrowMotion({
      currentFrame: 2,
      fps: 30,
      coords,
      strokeWidth: 2,
      config,
    });
    assert.equal(before.strokeDashoffset, 100);
    assert.equal(before.headProgress, 0);

    const after = calculateArrowMotion({
      currentFrame: 25,
      fps: 30,
      coords,
      strokeWidth: 2,
      config,
    });
    assert.equal(after.strokeDashoffset, 0);
    assert.equal(after.headProgress, 1);
  });

  await t.test('draw-out: retracts stroke from 0 to length', () => {
    const config = resolveArrowAnimationConfig({
      animation: 'draw-out',
      delay: 0,
      durationInFrames: 20,
    });

    const start = calculateArrowMotion({
      currentFrame: 0,
      fps: 30,
      coords,
      strokeWidth: 2,
      config,
    });
    assert.equal(start.strokeDashoffset, 0);

    const end = calculateArrowMotion({
      currentFrame: 20,
      fps: 30,
      coords,
      strokeWidth: 2,
      config,
    });
    assert.equal(end.strokeDashoffset, 100);
  });

  await t.test('arrowhead timing "after-line": delays arrowhead reveal until line is drawn', () => {
    const config = resolveArrowAnimationConfig({
      animation: 'draw-in',
      headTiming: 'after-line',
      delay: 0,
      durationInFrames: 20,
    });

    // At frame 10 (mid-line duration), line is progressing, but head is not yet visible
    const midLine = calculateArrowMotion({
      currentFrame: 10,
      fps: 30,
      coords,
      strokeWidth: 2,
      config,
    });
    assert.ok(midLine.lineProgress > 0);
    assert.equal(midLine.headProgress, 0);

    // At frame 18 (in the final 25% phase), arrowhead is revealing
    const inHeadPhase = calculateArrowMotion({
      currentFrame: 18,
      fps: 30,
      coords,
      strokeWidth: 2,
      config,
    });
    assert.equal(inHeadPhase.lineProgress, 1);
    assert.ok(inHeadPhase.headProgress > 0 && inHeadPhase.headProgress <= 1);

    // At completion
    const end = calculateArrowMotion({
      currentFrame: 20,
      fps: 30,
      coords,
      strokeWidth: 2,
      config,
    });
    assert.equal(end.headProgress, 1);
  });

  await t.test('arrowhead timing "independent": respects independent headDelay', () => {
    const config = resolveArrowAnimationConfig({
      animation: 'draw-in',
      headTiming: 'independent',
      delay: 0,
      durationInFrames: 10,
      headDelay: 20,
      headDurationInFrames: 10,
    });

    // At frame 15, line is finished, but head is still waiting for headDelay=20
    const waitingHead = calculateArrowMotion({
      currentFrame: 15,
      fps: 30,
      coords,
      strokeWidth: 2,
      config,
    });
    assert.equal(waitingHead.lineProgress, 1);
    assert.equal(waitingHead.headProgress, 0);

    // At frame 30, head has completed
    const finishedHead = calculateArrowMotion({
      currentFrame: 30,
      fps: 30,
      coords,
      strokeWidth: 2,
      config,
    });
    assert.equal(finishedHead.headProgress, 1);
  });

  await t.test('move-in: applies directional offset translation along angle', () => {
    const config = resolveArrowAnimationConfig({
      animation: 'move-in',
      delay: 0,
      durationInFrames: 20,
    });

    const start = calculateArrowMotion({
      currentFrame: 0,
      fps: 30,
      coords,
      strokeWidth: 2,
      config,
    });
    assert.ok(start.translateX < 0); // backwards offset
    assert.equal(start.opacity, 0);

    const end = calculateArrowMotion({
      currentFrame: 20,
      fps: 30,
      coords,
      strokeWidth: 2,
      config,
    });
    assert.ok(Math.abs(end.translateX) < 1e-4);
    assert.equal(end.opacity, 1);
  });
});

test('AnimatedArrow: Exit Transitions & Frame Rates', async (t) => {
  const coords = resolveArrowCoordinates({ direction: 'right', length: 100 });

  await t.test('handles fade-out exit transition cleanly at exitFrame', () => {
    const config = resolveArrowAnimationConfig({
      animation: 'draw-in',
      delay: 0,
      durationInFrames: 10,
    });

    const beforeExit = calculateArrowMotion({
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

    const afterExit = calculateArrowMotion({
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
    const config = resolveArrowAnimationConfig({
      animation: 'draw-in',
      delay: 0,
      durationInFrames: 30,
    });

    const m24 = calculateArrowMotion({
      currentFrame: 15,
      fps: 24,
      coords,
      strokeWidth: 2,
      config,
    });

    const m30 = calculateArrowMotion({
      currentFrame: 15,
      fps: 30,
      coords,
      strokeWidth: 2,
      config,
    });

    const m60 = calculateArrowMotion({
      currentFrame: 15,
      fps: 60,
      coords,
      strokeWidth: 2,
      config,
    });

    assert.equal(m24.progress, m30.progress);
    assert.equal(m30.progress, m60.progress);
  });
});
