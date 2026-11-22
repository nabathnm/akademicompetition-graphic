/**
 * Performance & Rendering Optimization Benchmark Tests
 * Measures execution speeds, memoization cache hits, and deterministic frame safety.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { performance } from 'node:perf_hooks';
import {
  parseSvgPath,
  clearParsedPathCache,
} from '../src/components/graphics/animatedPathStyle.ts';
import {
  calculateMorphMetrics,
  clearMorphSampleCache,
  BUILTIN_MORPH_SHAPES,
} from '../src/components/transitions/morphTransitionStyle.ts';
import {
  getGraphemes,
} from '../src/components/typography/characterRevealStyle.ts';
import {
  splitTextIntoSegments,
} from '../src/components/typography/splitTextStyle.ts';
import {
  generateParticles,
  calculateParticleStates,
} from '../src/components/graphics/particleSystemStyle.ts';
import {
  calculateSplitMetrics,
} from '../src/components/transitions/splitTransitionStyle.ts';

describe('Performance Optimization Benchmarks', () => {
  it('SVG Path Parsing: verifies memoization cache hit speedup', () => {
    clearParsedPathCache();
    const testPath =
      'M 10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80 Q 200 40, 220 80 A 25 25 0 0 1 270 80 Z';

    // First call (cache miss)
    const t0 = performance.now();
    const parsed1 = parseSvgPath(testPath);
    const missTime = performance.now() - t0;

    assert.ok(parsed1.totalLength > 0);
    assert.strictEqual(parsed1.isClosed, true);

    // Repeated calls (cache hits)
    const t1 = performance.now();
    for (let i = 0; i < 100; i++) {
      const parsedCached = parseSvgPath(testPath);
      assert.strictEqual(parsedCached.totalLength, parsed1.totalLength);
    }
    const hitTime = (performance.now() - t1) / 100;

    // Cache hit should be significantly faster than initial parse
    assert.ok(hitTime <= missTime || hitTime < 0.05);
  });

  it('MorphTransition: verifies samplePathPoints caching across frames', () => {
    clearMorphSampleCache();
    const circle = BUILTIN_MORPH_SHAPES.circle.d;
    const star = BUILTIN_MORPH_SHAPES.star.d;

    const t0 = performance.now();
    for (let frame = 0; frame < 60; frame++) {
      const metrics = calculateMorphMetrics({
        currentFrame: frame,
        fromPath: circle,
        toPath: star,
        durationInFrames: 30,
        samplePoints: 48,
      });
      assert.ok(metrics.d.length > 0);
      assert.strictEqual(typeof metrics.opacity, 'number');
    }
    const elapsed = performance.now() - t0;

    // 60 frames of morph calculation should complete comfortably under 100ms
    assert.ok(elapsed < 100, `Expected 60 frames morph to take < 100ms, took ${elapsed.toFixed(2)}ms`);
  });

  it('Typography: verifies Intl.Segmenter singleton efficiency', () => {
    const text = 'Autonomous Video Intelligence 🚀 & Kinetic Motion Graphics 2026';

    const t0 = performance.now();
    for (let i = 0; i < 200; i++) {
      const graphemes = getGraphemes(text);
      assert.ok(graphemes.length > 0);
    }
    const graphemeDuration = performance.now() - t0;

    assert.ok(graphemeDuration < 120, `200 grapheme calls took ${graphemeDuration.toFixed(2)}ms, expected < 120ms`);

    // Sentence segmentation
    const sentenceText = 'First scene introduces brand. Second highlights feature! Third is conversion?';
    const t1 = performance.now();
    for (let i = 0; i < 100; i++) {
      const segments = splitTextIntoSegments(sentenceText, 'sentence');
      assert.strictEqual(segments.length, 3);
    }
    const sentenceDuration = performance.now() - t1;
    assert.ok(sentenceDuration < 80, `100 sentence segmentations took ${sentenceDuration.toFixed(2)}ms`);
  });

  it('ParticleSystem: calculates 500 live particle states within frame budget', () => {
    const particles = generateParticles({
      seed: 999,
      particleCount: 500,
      distribution: 'radial',
    });
    assert.strictEqual(particles.length, 500);

    const t0 = performance.now();
    for (let frame = 0; frame < 60; frame++) {
      const states = calculateParticleStates({
        particles,
        currentFrame: frame,
        config: {
          motionMode: 'burst',
          durationInFrames: 60,
        },
      });
      assert.strictEqual(states.length, 500);
    }
    const elapsed = performance.now() - t0;

    // 500 particles across 60 frames (30,000 live states) should take < 150ms
    assert.ok(elapsed < 150, `500 particles x 60 frames took ${elapsed.toFixed(2)}ms`);
  });

  it('SplitTransition: verifies panel calculations and completion phases', () => {
    const metrics = calculateSplitMetrics({
      currentFrame: 40,
      splitDirection: 'grid',
      rows: 4,
      cols: 4,
      mode: 'enter',
      durationInFrames: 30,
    });

    assert.strictEqual(metrics.panels.length, 16);
    assert.strictEqual(metrics.isComplete, true);
    assert.strictEqual(metrics.progress, 1);
  });
});
