import test from 'node:test';
import assert from 'node:assert/strict';

import {
  tokenizeSvgPath,
  parseSvgPath,
  getPointAlongPath,
  calculatePathBoundingBox,
  resolvePathAnimationConfig,
  calculatePathMotion,
} from '../src/components/graphics/animatedPathStyle.ts';

test('AnimatedPath: SVG Tokenization & Path Parsing', async (t) => {
  await t.test('tokenizes mixed commands and coordinates with negatives and decimals', () => {
    const tokens = tokenizeSvgPath('M 10,20 L -30.5 40.25 H 100 V -50 Z');
    assert.deepEqual(tokens, ['M', 10, 20, 'L', -30.5, 40.25, 'H', 100, 'V', -50, 'Z']);
  });

  await t.test('parses straight line segments and computes accurate Euclidean length', () => {
    const parsed = parseSvgPath('M 0 0 L 100 0 L 100 100');
    assert.equal(parsed.segments.length, 2);
    assert.equal(parsed.segments[0].type, 'line');
    assert.equal(parsed.segments[0].length, 100);
    assert.equal(parsed.segments[1].length, 100);
    assert.equal(parsed.totalLength, 200);
    assert.equal(parsed.isClosed, false);
  });

  await t.test('parses relative commands (m, l, h, v) and detects closed path (Z/z)', () => {
    const parsed = parseSvgPath('m 10 10 l 40 0 v 30 h -40 z');
    assert.ok(parsed.isClosed);
    assert.equal(parsed.segments.length, 4);
    assert.equal(parsed.segments[0].length, 40);
    assert.equal(parsed.segments[1].length, 30);
    assert.equal(parsed.segments[2].length, 40);
    assert.equal(parsed.segments[3].length, 30);
    assert.equal(parsed.totalLength, 140);
  });

  await t.test('parses quadratic Bezier curves (Q / q)', () => {
    const parsed = parseSvgPath('M 0 0 Q 50 100 100 0');
    assert.equal(parsed.segments.length, 1);
    assert.equal(parsed.segments[0].type, 'quadratic');
    assert.ok(parsed.segments[0].length > 100); // arc length must exceed chord
    assert.equal(parsed.segments[0].cx, 50);
    assert.equal(parsed.segments[0].cy, 100);
  });

  await t.test('parses cubic Bezier curves (C / c)', () => {
    const parsed = parseSvgPath('M 0 0 C 30 80 70 80 100 0');
    assert.equal(parsed.segments.length, 1);
    assert.equal(parsed.segments[0].type, 'cubic');
    assert.ok(parsed.segments[0].length > 100);
    assert.equal(parsed.segments[0].cx1, 30);
    assert.equal(parsed.segments[0].cy1, 80);
    assert.equal(parsed.segments[0].cx2, 70);
    assert.equal(parsed.segments[0].cy2, 80);
  });

  await t.test('parses elliptical arc (A / a) converted to cubic Beziers', () => {
    // 90 degree arc on radius 100 circle: theoretical length = (PI / 2) * 100 approx 157.08
    const parsed = parseSvgPath('M 100 0 A 100 100 0 0 1 0 100');
    assert.ok(parsed.segments.length >= 1);
    assert.equal(parsed.segments[0].type, 'cubic');
    const diff = Math.abs(parsed.totalLength - (Math.PI / 2) * 100);
    assert.ok(diff < 2, `Arc length ${parsed.totalLength} should be close to ~157.08`);
  });
});

test('AnimatedPath: Deterministic Point Sampling & Tangent Angle Along Path', async (t) => {
  const parsed = parseSvgPath('M 0 0 L 100 0 L 100 100');

  await t.test('samples exact start and end points of multi-segment path', () => {
    const startPoint = getPointAlongPath(parsed.segments, parsed.totalLength, 0);
    assert.equal(startPoint.x, 0);
    assert.equal(startPoint.y, 0);
    assert.equal(startPoint.angle, 0);
    assert.equal(startPoint.progress, 0);

    const endPoint = getPointAlongPath(parsed.segments, parsed.totalLength, parsed.totalLength);
    assert.equal(endPoint.x, 100);
    assert.equal(endPoint.y, 100);
    assert.equal(endPoint.angle, 90);
    assert.equal(endPoint.progress, 1);
  });

  await t.test('samples midpoint of first horizontal segment', () => {
    const midPoint = getPointAlongPath(parsed.segments, parsed.totalLength, 50);
    assert.equal(midPoint.x, 50);
    assert.equal(midPoint.y, 0);
    assert.equal(midPoint.angle, 0);
    assert.equal(midPoint.progress, 0.25);
  });

  await t.test('samples midpoint of second vertical segment', () => {
    const vertPoint = getPointAlongPath(parsed.segments, parsed.totalLength, 150);
    assert.equal(vertPoint.x, 100);
    assert.equal(vertPoint.y, 50);
    assert.equal(vertPoint.angle, 90);
    assert.equal(vertPoint.progress, 0.75);
  });

  await t.test('clamps distance safely when given out-of-bounds distances', () => {
    const negative = getPointAlongPath(parsed.segments, parsed.totalLength, -50);
    assert.equal(negative.x, 0);
    assert.equal(negative.y, 0);

    const beyond = getPointAlongPath(parsed.segments, parsed.totalLength, 500);
    assert.equal(beyond.x, 100);
    assert.equal(beyond.y, 100);
  });
});

test('AnimatedPath: Bounding Box & ViewPort Calculation', async (t) => {
  await t.test('computes bounding box with stroke width padding', () => {
    const parsed = parseSvgPath('M 20 30 L 120 150');
    const bbox = calculatePathBoundingBox({ parsed, strokeWidth: 4, padding: 6 });
    // minX = 20 - (2 + 6) = 12
    assert.ok(bbox.minX <= 12);
    assert.ok(bbox.maxX >= 128);
    assert.ok(bbox.boxWidth > 100);
    assert.ok(bbox.viewBox.includes(`${bbox.minX} ${bbox.minY}`));
  });

  await t.test('honors explicit custom viewBox override', () => {
    const parsed = parseSvgPath('M 0 0 L 50 50');
    const bbox = calculatePathBoundingBox({ parsed, viewBox: '0 0 500 500' });
    assert.equal(bbox.viewBox, '0 0 500 500');
    assert.equal(bbox.boxWidth, 500);
    assert.equal(bbox.boxHeight, 500);
  });
});

test('AnimatedPath: Motion Lifecycle & Stroke Drawing Variants', async (t) => {
  const parsed = parseSvgPath('M 0 0 L 200 0');
  const totalLength = parsed.totalLength; // 200

  await t.test('draw-in: strokeDashoffset transitions from totalLength to 0', () => {
    const config = resolvePathAnimationConfig({ animation: 'draw-in', delay: 10, durationInFrames: 20 });

    const before = calculatePathMotion({
      currentFrame: 5,
      fps: 30,
      totalLength,
      segments: parsed.segments,
      strokeWidth: 2,
      config,
    });
    assert.equal(before.strokeProgress, 0);
    assert.equal(before.strokeDashoffset, 200);

    const after = calculatePathMotion({
      currentFrame: 30,
      fps: 30,
      totalLength,
      segments: parsed.segments,
      strokeWidth: 2,
      config,
    });
    assert.equal(after.strokeProgress, 1);
    assert.equal(after.strokeDashoffset, 0);
  });

  await t.test('draw-out: retracts strokeDashoffset from 0 to totalLength', () => {
    const config = resolvePathAnimationConfig({ animation: 'draw-out', delay: 0, durationInFrames: 20 });

    const start = calculatePathMotion({
      currentFrame: 0,
      fps: 30,
      totalLength,
      segments: parsed.segments,
      strokeWidth: 2,
      config,
    });
    assert.equal(start.strokeDashoffset, 0);

    const end = calculatePathMotion({
      currentFrame: 20,
      fps: 30,
      totalLength,
      segments: parsed.segments,
      strokeWidth: 2,
      config,
    });
    assert.equal(end.strokeDashoffset, 200);
  });

  await t.test('reverse-draw: draws backwards from -totalLength to 0', () => {
    const config = resolvePathAnimationConfig({ animation: 'reverse-draw', delay: 0, durationInFrames: 20 });

    const start = calculatePathMotion({
      currentFrame: 0,
      fps: 30,
      totalLength,
      segments: parsed.segments,
      strokeWidth: 2,
      config,
    });
    assert.equal(start.strokeDashoffset, -200);

    const end = calculatePathMotion({
      currentFrame: 20,
      fps: 30,
      totalLength,
      segments: parsed.segments,
      strokeWidth: 2,
      config,
    });
    assert.equal(end.strokeDashoffset, 0);
  });

  await t.test('static rendering when animation is "none" or animate is false', () => {
    const staticConfig = resolvePathAnimationConfig({ animate: false });
    assert.equal(staticConfig.type, 'none');

    const state = calculatePathMotion({
      currentFrame: 10,
      fps: 30,
      totalLength,
      segments: parsed.segments,
      strokeWidth: 2,
      userDasharray: '4 4',
      userDashoffset: 2,
      config: staticConfig,
    });
    assert.equal(state.strokeProgress, 1);
    assert.equal(state.strokeDasharray, '4 4');
    assert.equal(state.strokeDashoffset, 2);
  });
});

test('AnimatedPath: Fill Reveal Sequencing Options', async (t) => {
  const parsed = parseSvgPath('M 0 0 L 100 0 L 100 100 Z');
  const config = resolvePathAnimationConfig({ animation: 'draw-in', delay: 0, durationInFrames: 20 });

  await t.test('fillRevealTiming "after-draw" delays fill until stroke draw concludes', () => {
    const duringDraw = calculatePathMotion({
      currentFrame: 10,
      fps: 30,
      totalLength: parsed.totalLength,
      segments: parsed.segments,
      strokeWidth: 2,
      config,
      fillRevealTiming: 'after-draw',
      fillDurationInFrames: 10,
      baseFillOpacity: 0.8,
    });
    // Draw in progress (frame 10 < 20): fill must remain 0
    assert.equal(duringDraw.fillProgress, 0);
    assert.equal(duringDraw.fillOpacity, 0);

    const afterDraw = calculatePathMotion({
      currentFrame: 30,
      fps: 30,
      totalLength: parsed.totalLength,
      segments: parsed.segments,
      strokeWidth: 2,
      config,
      fillRevealTiming: 'after-draw',
      fillDurationInFrames: 10,
      baseFillOpacity: 0.8,
    });
    // Draw completed at 20, fill completed at 30
    assert.equal(afterDraw.fillProgress, 1);
    assert.equal(afterDraw.fillOpacity, 0.8);
  });

  await t.test('fillRevealTiming "with-draw" reveals fill synchronously with stroke', () => {
    const halfway = calculatePathMotion({
      currentFrame: 10,
      fps: 30,
      totalLength: parsed.totalLength,
      segments: parsed.segments,
      strokeWidth: 2,
      config,
      fillRevealTiming: 'with-draw',
      baseFillOpacity: 1,
    });
    assert.ok(halfway.fillProgress > 0 && halfway.fillProgress <= 1);
  });
});

test('AnimatedPath: Motion Along Path & Follower Tracking', async (t) => {
  const parsed = parseSvgPath('M 0 0 L 100 0 L 100 200');

  await t.test('follower follows stroke drawing progress by default', () => {
    const config = resolvePathAnimationConfig({ animation: 'draw-in', delay: 0, durationInFrames: 20 });
    const motion = calculatePathMotion({
      currentFrame: 20,
      fps: 30,
      totalLength: parsed.totalLength,
      segments: parsed.segments,
      strokeWidth: 2,
      config,
      showFollower: true,
    });

    assert.ok(motion.followerPoint);
    assert.equal(motion.followerPoint.x, 100);
    assert.equal(motion.followerPoint.y, 200);
    assert.equal(motion.followerPoint.angle, 90);
  });

  await t.test('explicit followerProgress override samples exact target coordinate', () => {
    const config = resolvePathAnimationConfig({ animation: 'none' });
    const motion = calculatePathMotion({
      currentFrame: 0,
      fps: 30,
      totalLength: parsed.totalLength,
      segments: parsed.segments,
      strokeWidth: 2,
      config,
      showFollower: true,
      followerProgressOverride: 0.5, // 150px along 300px total path -> (100, 50)
    });

    assert.ok(motion.followerPoint);
    assert.equal(motion.followerPoint.x, 100);
    assert.equal(motion.followerPoint.y, 50);
  });
});

test('AnimatedPath: Exit Transitions & Framerate Consistency', async (t) => {
  const parsed = parseSvgPath('M 0 0 L 100 100');
  const config = resolvePathAnimationConfig({ animation: 'draw-in', durationInFrames: 10 });

  await t.test('handles fade-out exit transition cleanly at exitFrame', () => {
    const state = calculatePathMotion({
      currentFrame: 45,
      fps: 30,
      totalLength: parsed.totalLength,
      segments: parsed.segments,
      strokeWidth: 2,
      config,
      exitFrame: 40,
      exitDurationInFrames: 10,
      exitAnimation: 'fade-out',
    });
    assert.ok(state.opacity < 1 && state.opacity > 0);
  });

  await t.test('different framerates (24, 30, 60 fps) calculate consistently', () => {
    for (const fps of [24, 30, 60]) {
      const state = calculatePathMotion({
        currentFrame: 15,
        fps,
        totalLength: parsed.totalLength,
        segments: parsed.segments,
        strokeWidth: 2,
        config,
      });
      assert.ok(state.progress >= 0 && state.progress <= 1);
    }
  });
});
