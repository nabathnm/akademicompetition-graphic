import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  hashSeed,
  pseudoRandom,
  seededRandom,
  seededRange,
  sanitizeGlitchNumber,
  calculateGlitchEnvelope,
  calculateGlitchMetrics,
} from '../src/components/transitions/glitchTransitionStyle.ts';

describe('GlitchTransition Unit Tests', () => {
  describe('hashSeed & pseudoRandom PRNG', () => {
    it('returns consistent deterministic hash values for identical seeds', () => {
      const h1 = hashSeed(42, 10, 5);
      const h2 = hashSeed(42, 10, 5);
      assert.strictEqual(h1, h2);
      assert.ok(h1 > 0);
    });

    it('produces different hash values for different seeds or salts', () => {
      const h1 = hashSeed('seed-alpha', 0);
      const h2 = hashSeed('seed-beta', 0);
      const h3 = hashSeed('seed-alpha', 1);
      assert.notStrictEqual(h1, h2);
      assert.notStrictEqual(h1, h3);
    });

    it('pseudoRandom returns floats strictly in [0, 1)', () => {
      for (let s = 1; s <= 20; s++) {
        const val = pseudoRandom(s * 1337);
        assert.ok(val >= 0 && val < 1);
      }
    });
  });

  describe('seededRandom & seededRange', () => {
    it('produces identical outputs for identical (seed, frame, salt)', () => {
      const val1 = seededRandom(1234, 15, 7);
      const val2 = seededRandom(1234, 15, 7);
      assert.strictEqual(val1, val2);
    });

    it('produces different outputs for different frames and seeds', () => {
      const valFrame1 = seededRandom('glitch-seed', 10, 2);
      const valFrame2 = seededRandom('glitch-seed', 11, 2);
      const valSeed = seededRandom('another-seed', 10, 2);
      assert.notStrictEqual(valFrame1, valFrame2);
      assert.notStrictEqual(valFrame1, valSeed);
    });

    it('seededRange clamps outputs strictly between min and max', () => {
      for (let f = 0; f < 30; f++) {
        const r = seededRange(42, f, 1, -15, 15);
        assert.ok(r >= -15 && r <= 15);
      }
    });
  });

  describe('sanitizeGlitchNumber', () => {
    it('handles NaN and negative zero values cleanly', () => {
      assert.strictEqual(sanitizeGlitchNumber(Number.NaN), 0);
      assert.strictEqual(sanitizeGlitchNumber(-0), 0);
      assert.strictEqual(Object.is(sanitizeGlitchNumber(-0), -0), false);
    });

    it('rounds to specified decimal places', () => {
      assert.strictEqual(sanitizeGlitchNumber(3.14159, 2), 3.14);
      assert.strictEqual(sanitizeGlitchNumber(10.5555, 1), 10.6);
    });
  });

  describe('calculateGlitchEnvelope', () => {
    it('mode "in": starts at 1.0 and settles to 0.0', () => {
      const envStart = calculateGlitchEnvelope('in', 0, false);
      const envMid = calculateGlitchEnvelope('in', 0.5, false);
      const envEnd = calculateGlitchEnvelope('in', 1.0, false);
      const envComplete = calculateGlitchEnvelope('in', 1.0, true);

      assert.strictEqual(envStart, 1.0);
      assert.ok(envMid < envStart && envMid > envEnd);
      assert.strictEqual(envEnd, 0.0);
      assert.strictEqual(envComplete, 0.0);
    });

    it('mode "out": starts at 0.0 and ramps to 1.0', () => {
      const envStart = calculateGlitchEnvelope('out', 0, false);
      const envMid = calculateGlitchEnvelope('out', 0.5, false);
      const envEnd = calculateGlitchEnvelope('out', 1.0, false);
      const envComplete = calculateGlitchEnvelope('out', 1.0, true);

      assert.strictEqual(envStart, 0.0);
      assert.ok(envMid > envStart && envMid < envEnd);
      assert.strictEqual(envEnd, 1.0);
      assert.strictEqual(envComplete, 1.0);
    });

    it('mode "replace": peaks at midpoint progress = 0.5 and drops to 0 at bounds', () => {
      const envStart = calculateGlitchEnvelope('replace', 0, false);
      const envPeak = calculateGlitchEnvelope('replace', 0.5, false);
      const envEnd = calculateGlitchEnvelope('replace', 1.0, false);

      assert.strictEqual(envStart, 0.0);
      assert.strictEqual(envPeak, 1.0);
      assert.strictEqual(envEnd, 0.0);
    });

    it('mode "burst": peaks in middle window and is zero outside [0.2, 0.8]', () => {
      const envBefore = calculateGlitchEnvelope('burst', 0.1, false);
      const envPeak = calculateGlitchEnvelope('burst', 0.5, false);
      const envAfter = calculateGlitchEnvelope('burst', 0.9, false);

      assert.strictEqual(envBefore, 0);
      assert.ok(envPeak > 0.9);
      assert.strictEqual(envAfter, 0);
    });

    it('mode "continuous": remains constant at 1.0 across all progress levels', () => {
      assert.strictEqual(calculateGlitchEnvelope('continuous', 0, false), 1.0);
      assert.strictEqual(calculateGlitchEnvelope('continuous', 0.5, false), 1.0);
      assert.strictEqual(calculateGlitchEnvelope('continuous', 1.0, false), 1.0);
      assert.strictEqual(calculateGlitchEnvelope('continuous', 1.0, true), 1.0);
    });
  });

  describe('calculateGlitchMetrics: Lifecycle & Modes', () => {
    it('returns pending phase before delay', () => {
      const metrics = calculateGlitchMetrics({
        frame: 5,
        delay: 10,
        duration: 30,
        mode: 'in',
      });
      assert.strictEqual(metrics.phase, 'pending');
      assert.strictEqual(metrics.progress, 0);
      assert.strictEqual(metrics.opacity, 0);
    });

    it('settles cleanly at completion in mode "in"', () => {
      const metrics = calculateGlitchMetrics({
        frame: 40,
        delay: 0,
        duration: 30,
        mode: 'in',
      });
      assert.strictEqual(metrics.isComplete, true);
      assert.strictEqual(metrics.phase, 'complete');
      assert.strictEqual(metrics.progress, 1);
      assert.strictEqual(metrics.envelope, 0);
      assert.strictEqual(metrics.isGlitchFrame, false);
      assert.strictEqual(metrics.opacity, 1);
    });

    it('mode "replace" toggles active layer at midpoint progress = 0.5', () => {
      const beforeMid = calculateGlitchMetrics({
        frame: 10,
        duration: 30,
        mode: 'replace',
      });
      const afterMid = calculateGlitchMetrics({
        frame: 20,
        duration: 30,
        mode: 'replace',
      });

      assert.strictEqual(beforeMid.activeLayer, 'from');
      assert.strictEqual(afterMid.activeLayer, 'to');
    });

    it('supports reverse direction', () => {
      const normal = calculateGlitchMetrics({
        frame: 5,
        duration: 20,
        reverse: false,
      });
      const reversed = calculateGlitchMetrics({
        frame: 5,
        duration: 20,
        reverse: true,
      });

      assert.strictEqual(normal.progress, 0.25);
      assert.strictEqual(reversed.progress, 0.75);
    });
  });

  describe('calculateGlitchMetrics: Determinism & Seeds', () => {
    it('produces 100% identical outputs for identical props, frame, and seed', () => {
      const run1 = calculateGlitchMetrics({
        frame: 12,
        seed: 'test-seed-99',
        mode: 'burst',
        intensity: 1.5,
        sliceCount: 10,
      });
      const run2 = calculateGlitchMetrics({
        frame: 12,
        seed: 'test-seed-99',
        mode: 'burst',
        intensity: 1.5,
        sliceCount: 10,
      });

      assert.deepStrictEqual(run1, run2);
    });

    it('produces different slice displacements and offsets for different seeds', () => {
      const runSeedA = calculateGlitchMetrics({
        frame: 15,
        seed: 111,
        frequency: 1.0,
        mode: 'continuous',
      });
      const runSeedB = calculateGlitchMetrics({
        frame: 15,
        seed: 999,
        frequency: 1.0,
        mode: 'continuous',
      });

      assert.notStrictEqual(runSeedA.rgbOffsetX, runSeedB.rgbOffsetX);
      assert.notDeepStrictEqual(runSeedA.slices, runSeedB.slices);
    });
  });

  describe('calculateGlitchMetrics: Effect Toggles & Customization', () => {
    it('disabling enableRgbSplit zeroes out rgbOffsetX and rgbOffsetY', () => {
      const metrics = calculateGlitchMetrics({
        frame: 10,
        frequency: 1.0,
        mode: 'continuous',
        enableRgbSplit: false,
      });
      assert.strictEqual(metrics.rgbOffsetX, 0);
      assert.strictEqual(metrics.rgbOffsetY, 0);
    });

    it('disabling enableSlices zeroes out all slice displacements', () => {
      const metrics = calculateGlitchMetrics({
        frame: 10,
        frequency: 1.0,
        mode: 'continuous',
        enableSlices: false,
      });
      for (const slice of metrics.slices) {
        assert.strictEqual(slice.displacementX, 0);
        assert.strictEqual(slice.displacementY, 0);
      }
    });

    it('disabling enableJitter zeroes out jitterX and jitterY', () => {
      const metrics = calculateGlitchMetrics({
        frame: 10,
        frequency: 1.0,
        mode: 'continuous',
        enableJitter: false,
      });
      assert.strictEqual(metrics.jitterX, 0);
      assert.strictEqual(metrics.jitterY, 0);
    });

    it('disabling enableNoise zeroes out noiseBlocks', () => {
      const metrics = calculateGlitchMetrics({
        frame: 10,
        frequency: 1.0,
        mode: 'continuous',
        enableNoise: false,
      });
      assert.strictEqual(metrics.noiseBlocks.length, 0);
    });

    it('disabling enableScanlines sets scanlineOpacity to 0', () => {
      const metrics = calculateGlitchMetrics({
        frame: 10,
        frequency: 1.0,
        mode: 'continuous',
        enableScanlines: false,
      });
      assert.strictEqual(metrics.scanlineOpacity, 0);
    });

    it('disabling enableFlicker keeps flickerBrightness at 1.0', () => {
      const metrics = calculateGlitchMetrics({
        frame: 10,
        frequency: 1.0,
        mode: 'continuous',
        enableFlicker: false,
      });
      assert.strictEqual(metrics.flickerBrightness, 1.0);
    });

    it('scales displacement and chromatic offset proportionally with intensity', () => {
      const low = calculateGlitchMetrics({
        frame: 15,
        seed: 77,
        frequency: 1.0,
        mode: 'continuous',
        intensity: 0.5,
      });
      const high = calculateGlitchMetrics({
        frame: 15,
        seed: 77,
        frequency: 1.0,
        mode: 'continuous',
        intensity: 2.0,
      });

      assert.ok(Math.abs(high.rgbOffsetX) >= Math.abs(low.rgbOffsetX));
      assert.ok(high.envelope > low.envelope);
    });
  });
});
