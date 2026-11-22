import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  sanitizeMorphNumber,
  resolveMorphPath,
  isPathClosed,
  samplePathPoints,
  interpolatePathPoints,
  parseColorToRgba,
  interpolateColor,
  calculateMorphMetrics,
  BUILTIN_MORPH_SHAPES,
} from '../src/components/transitions/morphTransitionStyle.ts';

describe('MorphTransition Unit Tests', () => {
  describe('sanitizeMorphNumber', () => {
    it('handles NaN and negative zero values', () => {
      assert.strictEqual(sanitizeMorphNumber(NaN), 0);
      assert.strictEqual(sanitizeMorphNumber(1e-8), 0);
      assert.strictEqual(sanitizeMorphNumber(-1e-8), 0);
      assert.strictEqual(sanitizeMorphNumber(-0), 0);
    });

    it('rounds to 4 decimal places', () => {
      assert.strictEqual(sanitizeMorphNumber(3.14159265), 3.1416);
      assert.strictEqual(sanitizeMorphNumber(50), 50);
    });
  });

  describe('resolveMorphPath & BUILTIN_MORPH_SHAPES', () => {
    it('resolves built-in iconic shape presets', () => {
      assert.ok(BUILTIN_MORPH_SHAPES.circle);
      assert.ok(BUILTIN_MORPH_SHAPES.rectangle);
      assert.ok(BUILTIN_MORPH_SHAPES['rounded-rectangle']);
      assert.ok(BUILTIN_MORPH_SHAPES.triangle);
      assert.ok(BUILTIN_MORPH_SHAPES.diamond);
      assert.ok(BUILTIN_MORPH_SHAPES.star);
      assert.ok(BUILTIN_MORPH_SHAPES.heart);
      assert.ok(BUILTIN_MORPH_SHAPES.cloud);
      assert.ok(BUILTIN_MORPH_SHAPES.check);
      assert.ok(BUILTIN_MORPH_SHAPES.cross);
      assert.ok(BUILTIN_MORPH_SHAPES.play);

      assert.strictEqual(resolveMorphPath('circle'), BUILTIN_MORPH_SHAPES.circle.d);
      assert.strictEqual(resolveMorphPath('rectangle'), BUILTIN_MORPH_SHAPES.rectangle.d);
      assert.strictEqual(resolveMorphPath('star'), BUILTIN_MORPH_SHAPES.star.d);
    });

    it('preserves arbitrary custom SVG path strings', () => {
      const custom = 'M 10 20 C 30 40 50 60 70 80 Z';
      assert.strictEqual(resolveMorphPath(custom), custom);
    });

    it('falls back to circle if path is empty', () => {
      assert.strictEqual(resolveMorphPath(''), BUILTIN_MORPH_SHAPES.circle.d);
    });
  });

  describe('isPathClosed', () => {
    it('detects closed SVG paths correctly', () => {
      assert.strictEqual(isPathClosed('M 10 10 L 20 20 Z'), true);
      assert.strictEqual(isPathClosed('M 10 10 L 20 20 z'), true);
      assert.strictEqual(isPathClosed('M 10 10 L 20 20 z   '), true);
      assert.strictEqual(isPathClosed('M 10 10 L 20 20'), false);
    });
  });

  describe('samplePathPoints', () => {
    it('samples exactly requested number of points along path', () => {
      const circlePoints = samplePathPoints('circle', 32);
      assert.strictEqual(circlePoints.length, 32);

      const rectPoints = samplePathPoints('rectangle', 48);
      assert.strictEqual(rectPoints.length, 48);
    });

    it('falls back gracefully on invalid path data', () => {
      const fallbackPoints = samplePathPoints('invalid-non-path', 24);
      assert.strictEqual(fallbackPoints.length, 24);
      assert.ok(fallbackPoints[0].x > 0);
    });
  });

  describe('interpolatePathPoints', () => {
    it('interpolates geometry accurately at boundary and midpoint frames', () => {
      const ptsA = [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 100, y: 100 },
        { x: 0, y: 100 },
      ];
      const ptsB = [
        { x: 20, y: 20 },
        { x: 80, y: 20 },
        { x: 80, y: 80 },
        { x: 20, y: 80 },
      ];

      // At progress 0: matches A
      const pathA = interpolatePathPoints(ptsA, ptsB, 0, true);
      assert.strictEqual(pathA, 'M 0 0 L 100 0 L 100 100 L 0 100 Z');

      // At progress 1: matches B
      const pathB = interpolatePathPoints(ptsA, ptsB, 1, true);
      assert.strictEqual(pathB, 'M 20 20 L 80 20 L 80 80 L 20 80 Z');

      // At progress 0.5: matches exact midpoint
      const pathMid = interpolatePathPoints(ptsA, ptsB, 0.5, true);
      assert.strictEqual(pathMid, 'M 10 10 L 90 10 L 90 90 L 10 90 Z');
    });
  });

  describe('parseColorToRgba & interpolateColor', () => {
    it('parses hex colors accurately', () => {
      const white = parseColorToRgba('#fff');
      assert.deepStrictEqual(white, { r: 255, g: 255, b: 255, a: 1 });

      const cyan = parseColorToRgba('#00ffff');
      assert.deepStrictEqual(cyan, { r: 0, g: 255, b: 255, a: 1 });
    });

    it('interpolates colors smoothly across progress', () => {
      const black = '#000000';
      const white = '#ffffff';

      const mid = interpolateColor(black, white, 0.5);
      assert.strictEqual(mid, 'rgb(128, 128, 128)');

      const start = interpolateColor(black, white, 0);
      assert.strictEqual(start, 'rgb(0, 0, 0)');

      const end = interpolateColor(black, white, 1);
      assert.strictEqual(end, 'rgb(255, 255, 255)');
    });

    it('handles transparent color transitions cleanly', () => {
      const transToRed = interpolateColor('transparent', '#ff0000', 0.5);
      assert.ok(transToRed.includes('rgba(255, 0, 0, 0.5)'));
    });
  });

  describe('calculateMorphMetrics', () => {
    it('calculates initial, midway, and final frames accurately', () => {
      // Pending
      const pending = calculateMorphMetrics({
        currentFrame: 0,
        delay: 5,
        duration: 20,
        fromPath: 'circle',
        toPath: 'rectangle',
        fromFill: '#000000',
        toFill: '#ffffff',
      });
      assert.strictEqual(pending.phase, 'pending');
      assert.strictEqual(pending.progress, 0);
      assert.strictEqual(pending.isComplete, false);
      assert.strictEqual(pending.fill, '#000000');

      // Midway
      const midway = calculateMorphMetrics({
        currentFrame: 15,
        delay: 5,
        duration: 20,
        fromPath: 'circle',
        toPath: 'rectangle',
        fromFill: '#000000',
        toFill: '#ffffff',
      });
      assert.strictEqual(midway.phase, 'in');
      assert.strictEqual(midway.progress, 0.5);
      assert.strictEqual(midway.isComplete, false);
      assert.ok(midway.d.startsWith('M'));

      // Complete
      const complete = calculateMorphMetrics({
        currentFrame: 25,
        delay: 5,
        duration: 20,
        fromPath: 'circle',
        toPath: 'rectangle',
        fromFill: '#000000',
        toFill: '#ffffff',
      });
      assert.strictEqual(complete.phase, 'complete');
      assert.strictEqual(complete.progress, 1);
      assert.strictEqual(complete.isComplete, true);
      assert.strictEqual(complete.fill, '#ffffff');
    });

    it('interpolates stroke color and width', () => {
      const midway = calculateMorphMetrics({
        currentFrame: 10,
        duration: 20,
        fromPath: 'triangle',
        toPath: 'star',
        fromStroke: '#000000',
        toStroke: '#ffffff',
        fromStrokeWidth: 2,
        toStrokeWidth: 6,
      });

      assert.strictEqual(midway.strokeWidth, 4);
      assert.strictEqual(midway.stroke, 'rgb(128, 128, 128)');
    });

    it('interpolates rotation, scale, and opacity', () => {
      const midway = calculateMorphMetrics({
        currentFrame: 10,
        duration: 20,
        fromPath: 'circle',
        toPath: 'star',
        initialRotation: 0,
        finalRotation: 180,
        initialScale: 0.5,
        finalScale: 1.5,
        fromOpacity: 0.2,
        toOpacity: 1.0,
      });

      assert.strictEqual(midway.rotation, 90);
      assert.strictEqual(midway.scale, 1);
      assert.strictEqual(midway.opacity, 0.6);
    });

    it('supports physics spring interpolation', () => {
      const springMetrics = calculateMorphMetrics({
        currentFrame: 15,
        duration: 30,
        fromPath: 'circle',
        toPath: 'rectangle',
        spring: 'snappy',
      });

      assert.ok(springMetrics.progress > 0);
      assert.ok(springMetrics.d.startsWith('M'));
    });

    it('supports reverse morphing', () => {
      const reversePending = calculateMorphMetrics({
        currentFrame: 0,
        delay: 5,
        duration: 20,
        fromPath: 'circle',
        toPath: 'rectangle',
        fromFill: '#000000',
        toFill: '#ffffff',
        reverse: true,
      });

      // When reversed, initial frame shows toPath / toFill
      assert.strictEqual(reversePending.fill, '#ffffff');
    });
  });
});
