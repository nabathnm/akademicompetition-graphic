import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  sanitizeMaskNumber,
  normalizeMaskType,
  normalizeMaskMode,
  resolveMaskOrigin,
  calculateNormalizedPolygonPoints,
  calculateNormalizedStarPoints,
  resolveMaskPath,
  calculateMaskCoverScale,
  calculateMaskMetrics,
  BUILTIN_MASK_PATHS,
} from '../src/components/transitions/maskTransitionStyle.ts';

describe('MaskTransition Unit Tests', () => {
  describe('sanitizeMaskNumber', () => {
    it('handles NaN and near-zero values', () => {
      assert.strictEqual(sanitizeMaskNumber(NaN), 0);
      assert.strictEqual(sanitizeMaskNumber(1e-8), 0);
      assert.strictEqual(sanitizeMaskNumber(-1e-8), 0);
      assert.strictEqual(sanitizeMaskNumber(-0), 0);
    });

    it('rounds to 4 decimal places', () => {
      assert.strictEqual(sanitizeMaskNumber(1.234567), 1.2346);
      assert.strictEqual(sanitizeMaskNumber(0.5), 0.5);
    });
  });

  describe('normalizeMaskType', () => {
    it('normalizes standard and alias mask types', () => {
      assert.strictEqual(normalizeMaskType('circle'), 'circle');
      assert.strictEqual(normalizeMaskType(undefined), 'circle');
      assert.strictEqual(normalizeMaskType('rectangle'), 'rectangle');
      assert.strictEqual(normalizeMaskType('rect'), 'rectangle');
      assert.strictEqual(normalizeMaskType('rounded-rectangle'), 'rounded-rectangle');
      assert.strictEqual(normalizeMaskType('roundedRectangle'), 'rounded-rectangle');
      assert.strictEqual(normalizeMaskType('rounded-rect'), 'rounded-rectangle');
      assert.strictEqual(normalizeMaskType('roundedRect'), 'rounded-rectangle');
      assert.strictEqual(normalizeMaskType('ellipse'), 'ellipse');
      assert.strictEqual(normalizeMaskType('polygon'), 'polygon');
      assert.strictEqual(normalizeMaskType('path'), 'path');
      assert.strictEqual(normalizeMaskType('svg-path'), 'path');
      assert.strictEqual(normalizeMaskType('svgPath'), 'path');
      assert.strictEqual(normalizeMaskType('svg'), 'path');
    });
  });

  describe('normalizeMaskMode', () => {
    it('normalizes mode aliases correctly', () => {
      assert.strictEqual(normalizeMaskMode('reveal'), 'reveal');
      assert.strictEqual(normalizeMaskMode('expand'), 'reveal');
      assert.strictEqual(normalizeMaskMode('in'), 'reveal');
      assert.strictEqual(normalizeMaskMode(undefined), 'reveal');

      assert.strictEqual(normalizeMaskMode('hide'), 'hide');
      assert.strictEqual(normalizeMaskMode('contract'), 'hide');
      assert.strictEqual(normalizeMaskMode('out'), 'hide');

      assert.strictEqual(normalizeMaskMode('reveal-hide'), 'reveal-hide');
      assert.strictEqual(normalizeMaskMode('in-out'), 'reveal-hide');
      assert.strictEqual(normalizeMaskMode('revealHide'), 'reveal-hide');

      assert.strictEqual(normalizeMaskMode('replace'), 'replace');
      assert.strictEqual(normalizeMaskMode('cross-mask'), 'replace');
      assert.strictEqual(normalizeMaskMode('crossMask'), 'replace');
    });
  });

  describe('resolveMaskOrigin', () => {
    it('resolves standard named positions', () => {
      assert.deepStrictEqual(resolveMaskOrigin('center'), { x: 0.5, y: 0.5, label: 'center' });
      assert.deepStrictEqual(resolveMaskOrigin(undefined), { x: 0.5, y: 0.5, label: 'center' });
      assert.deepStrictEqual(resolveMaskOrigin('top'), { x: 0.5, y: 0.0, label: 'top' });
      assert.deepStrictEqual(resolveMaskOrigin('bottom'), { x: 0.5, y: 1.0, label: 'bottom' });
      assert.deepStrictEqual(resolveMaskOrigin('left'), { x: 0.0, y: 0.5, label: 'left' });
      assert.deepStrictEqual(resolveMaskOrigin('right'), { x: 1.0, y: 0.5, label: 'right' });
      assert.deepStrictEqual(resolveMaskOrigin('top-left'), { x: 0.0, y: 0.0, label: 'top-left' });
      assert.deepStrictEqual(resolveMaskOrigin('top right'), { x: 1.0, y: 0.0, label: 'top-right' });
      assert.deepStrictEqual(resolveMaskOrigin('bottom-left'), { x: 0.0, y: 1.0, label: 'bottom-left' });
      assert.deepStrictEqual(resolveMaskOrigin('bottom-right'), { x: 1.0, y: 1.0, label: 'bottom-right' });
    });

    it('resolves percentage strings and clamped values', () => {
      const pct = resolveMaskOrigin('25% 75%');
      assert.strictEqual(pct.x, 0.25);
      assert.strictEqual(pct.y, 0.75);

      const clamped = resolveMaskOrigin('150% -20%');
      assert.strictEqual(clamped.x, 1.0);
      assert.strictEqual(clamped.y, 0.0);
    });
  });

  describe('calculateNormalizedPolygonPoints', () => {
    it('generates regular polygons centered at (0, 0)', () => {
      const triangle = calculateNormalizedPolygonPoints('triangle');
      const trianglePoints = triangle.split(' ');
      assert.strictEqual(trianglePoints.length, 3);

      const diamond = calculateNormalizedPolygonPoints('diamond');
      assert.strictEqual(diamond, '0,-0.5 0.5,0 0,0.5 -0.5,0');

      const pentagon = calculateNormalizedPolygonPoints('pentagon');
      assert.strictEqual(pentagon.split(' ').length, 5);

      const hexagon = calculateNormalizedPolygonPoints('hexagon');
      assert.strictEqual(hexagon.split(' ').length, 6);

      const star = calculateNormalizedPolygonPoints('star');
      assert.strictEqual(star.split(' ').length, 10);
    });

    it('preserves custom points when provided', () => {
      const custom = '0,0 1,1 0,1';
      assert.strictEqual(calculateNormalizedPolygonPoints('triangle', custom), custom);
    });
  });

  describe('calculateNormalizedStarPoints', () => {
    it('alternates between outer tips and inner valleys', () => {
      const star = calculateNormalizedStarPoints(5, 0.44);
      const parts = star.split(' ');
      assert.strictEqual(parts.length, 10);
    });
  });

  describe('resolveMaskPath & BUILTIN_MASK_PATHS', () => {
    it('resolves built-in presets correctly', () => {
      assert.ok(BUILTIN_MASK_PATHS.heart);
      assert.ok(BUILTIN_MASK_PATHS.star);
      assert.ok(BUILTIN_MASK_PATHS.diamond);
      assert.ok(BUILTIN_MASK_PATHS.badge);
      assert.ok(BUILTIN_MASK_PATHS.cloud);
      assert.ok(BUILTIN_MASK_PATHS.flower);

      const heart = resolveMaskPath('heart');
      assert.strictEqual(heart.d, BUILTIN_MASK_PATHS.heart.d);
      assert.ok(heart.pathTransform.includes('scale'));

      const star = resolveMaskPath('star');
      assert.strictEqual(star.d, BUILTIN_MASK_PATHS.star.d);
    });

    it('resolves arbitrary custom SVG path strings with custom viewBox', () => {
      const customD = 'M 0 0 L 100 100 Z';
      const pathRes = resolveMaskPath(customD, '0 0 200 200');
      assert.strictEqual(pathRes.d, customD);
      assert.strictEqual(pathRes.viewBox, '0 0 200 200');
      assert.ok(pathRes.pathTransform.includes('scale(0.005 0.005)'));
    });
  });

  describe('calculateMaskCoverScale', () => {
    it('calculates sufficient cover scale for center origin', () => {
      const center = { x: 0.5, y: 0.5 };
      const circleScale = calculateMaskCoverScale('circle', center);
      assert.ok(circleScale >= 1.4);

      const rectScale = calculateMaskCoverScale('rectangle', center);
      assert.ok(rectScale >= 1.0);
    });

    it('scales higher for corner origin to guarantee coverage', () => {
      const corner = { x: 0.0, y: 0.0 };
      const circleScaleCenter = calculateMaskCoverScale('circle', { x: 0.5, y: 0.5 });
      const circleScaleCorner = calculateMaskCoverScale('circle', corner);
      assert.ok(circleScaleCorner > circleScaleCenter);
    });
  });

  describe('calculateMaskMetrics', () => {
    it('calculates reveal mode progression accurately', () => {
      // Pending
      const pending = calculateMaskMetrics({
        currentFrame: 0,
        delay: 5,
        duration: 20,
        mode: 'reveal',
      });
      assert.strictEqual(pending.phase, 'pending');
      assert.strictEqual(pending.scale, 0);
      assert.strictEqual(pending.progress, 0);
      assert.strictEqual(pending.isComplete, false);

      // Midway
      const midway = calculateMaskMetrics({
        currentFrame: 15,
        delay: 5,
        duration: 20,
        mode: 'reveal',
      });
      assert.strictEqual(midway.phase, 'in');
      assert.ok(midway.scale > 0);
      assert.strictEqual(midway.progress, 0.5);
      assert.strictEqual(midway.isComplete, false);

      // Complete
      const complete = calculateMaskMetrics({
        currentFrame: 25,
        delay: 5,
        duration: 20,
        mode: 'reveal',
      });
      assert.strictEqual(complete.phase, 'complete');
      assert.ok(complete.scale > 1.0);
      assert.strictEqual(complete.progress, 1);
      assert.strictEqual(complete.isComplete, true);
    });

    it('calculates hide mode progression accurately', () => {
      // Pending: full scale
      const pending = calculateMaskMetrics({
        currentFrame: 0,
        delay: 10,
        duration: 20,
        mode: 'hide',
      });
      assert.strictEqual(pending.phase, 'pending');
      assert.ok(pending.scale > 1.0);

      // Complete: zero scale
      const complete = calculateMaskMetrics({
        currentFrame: 35,
        delay: 10,
        duration: 20,
        mode: 'hide',
      });
      assert.strictEqual(complete.phase, 'complete');
      assert.strictEqual(complete.scale, 0);
      assert.strictEqual(complete.isComplete, true);
    });

    it('calculates reveal-hide envelope correctly', () => {
      const inMetrics = calculateMaskMetrics({
        currentFrame: 5,
        duration: 30,
        inDuration: 10,
        holdDuration: 10,
        outDuration: 10,
        mode: 'reveal-hide',
      });
      assert.strictEqual(inMetrics.phase, 'in');
      assert.ok(inMetrics.scale > 0);

      const holdMetrics = calculateMaskMetrics({
        currentFrame: 15,
        duration: 30,
        inDuration: 10,
        holdDuration: 10,
        outDuration: 10,
        mode: 'reveal-hide',
      });
      assert.strictEqual(holdMetrics.phase, 'hold');
      assert.ok(holdMetrics.scale > 1.0);

      const outMetrics = calculateMaskMetrics({
        currentFrame: 25,
        duration: 30,
        inDuration: 10,
        holdDuration: 10,
        outDuration: 10,
        mode: 'reveal-hide',
      });
      assert.strictEqual(outMetrics.phase, 'out');
      assert.ok(outMetrics.scale > 0);

      const completeMetrics = calculateMaskMetrics({
        currentFrame: 35,
        duration: 30,
        inDuration: 10,
        holdDuration: 10,
        outDuration: 10,
        mode: 'reveal-hide',
      });
      assert.strictEqual(completeMetrics.phase, 'complete');
      assert.strictEqual(completeMetrics.scale, 0);
      assert.strictEqual(completeMetrics.isComplete, true);
    });

    it('calculates replace dual-layer metrics', () => {
      const midway = calculateMaskMetrics({
        currentFrame: 12,
        duration: 24,
        mode: 'replace',
      });
      assert.strictEqual(midway.phase, 'in');
      assert.ok(midway.outgoingScale > 1.0);
      assert.strictEqual(midway.outgoingOpacity, 1.0);
      assert.ok(midway.incomingScale > 0);
    });

    it('integrates rotation and combined fade', () => {
      const metrics = calculateMaskMetrics({
        currentFrame: 10,
        duration: 20,
        mode: 'reveal',
        initialRotation: 0,
        finalRotation: 180,
        fade: true,
        fromOpacity: 0.2,
        toOpacity: 1.0,
      });

      assert.ok(metrics.rotation > 0 && metrics.rotation <= 180);
      assert.ok(metrics.opacity >= 0.2 && metrics.opacity <= 1.0);
      assert.ok(metrics.transform.includes(`rotate(${metrics.rotation})`));
    });

    it('supports physics spring interpolation', () => {
      const springMetrics = calculateMaskMetrics({
        currentFrame: 15,
        duration: 30,
        spring: 'snappy',
      });
      assert.ok(springMetrics.scale > 0);
    });

    it('generates valid clipPath url and transform', () => {
      const metrics = calculateMaskMetrics({
        currentFrame: 10,
        duration: 20,
        clipId: 'custom-clip-42',
        origin: 'top-left',
      });

      assert.strictEqual(metrics.clipPath, 'url(#custom-clip-42)');
      assert.strictEqual(metrics.clipId, 'custom-clip-42');
      assert.ok(metrics.transform.includes('translate(0 0)'));
    });
  });
});
