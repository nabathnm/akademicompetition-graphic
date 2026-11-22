import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  calculateHeroStaggerMetrics,
  resolveHeroLayoutStyles,
} from '../src/components/scenes/heroSceneStyle.ts';

describe('HeroScene Unit Tests', () => {
  describe('calculateHeroStaggerMetrics: Timing & Progression', () => {
    it('staggers entrance sequence: eyebrow -> headline -> subtitle -> description -> cta', () => {
      // At frame 0: only eyebrow starts; others pending
      const m0 = calculateHeroStaggerMetrics({
        frame: 0,
        delay: 0,
        staggerDelay: 5,
      });

      assert.ok(m0.eyebrow.opacity >= 0);
      assert.strictEqual(m0.headline.opacity, 0);
      assert.strictEqual(m0.subtitle.opacity, 0);
      assert.strictEqual(m0.description.opacity, 0);
      assert.strictEqual(m0.cta.opacity, 0);

      // At frame 12: headline is animating, cta is still pending (starts at 20)
      const m12 = calculateHeroStaggerMetrics({
        frame: 12,
        delay: 0,
        staggerDelay: 5,
      });
      assert.ok(m12.headline.opacity > 0);
      assert.strictEqual(m12.cta.opacity, 0);

      // At frame 45: all elements are settled
      const m45 = calculateHeroStaggerMetrics({
        frame: 45,
        delay: 0,
        staggerDelay: 5,
      });
      assert.strictEqual(m45.eyebrow.isSettled, true);
      assert.strictEqual(m45.headline.isSettled, true);
      assert.strictEqual(m45.subtitle.isSettled, true);
      assert.strictEqual(m45.description.isSettled, true);
      assert.strictEqual(m45.cta.isSettled, true);
      assert.strictEqual(m45.visual.isSettled, true);
    });

    it('respects explicit delay overrides for specific slots', () => {
      const metrics = calculateHeroStaggerMetrics({
        frame: 8,
        delay: 0,
        animation: {
          headlineDelay: 20, // delayed
          eyebrowDelay: 0,
        },
      });

      assert.strictEqual(metrics.headline.opacity, 0);
      assert.ok(metrics.eyebrow.opacity > 0);
    });

    it('computes floating sine offset deterministically for decorative elements', () => {
      const f1 = calculateHeroStaggerMetrics({ frame: 10 }).floatOffset;
      const f2 = calculateHeroStaggerMetrics({ frame: 20 }).floatOffset;
      const f1Repeat = calculateHeroStaggerMetrics({ frame: 10 }).floatOffset;

      assert.strictEqual(f1, f1Repeat);
      assert.notStrictEqual(f1, f2);
    });
  });

  describe('resolveHeroLayoutStyles', () => {
    it('returns flex column layout for centered variation', () => {
      const l = resolveHeroLayoutStyles('centered');
      assert.strictEqual(l.containerStyle.display, 'flex');
      assert.strictEqual(l.containerStyle.flexDirection, 'column');
      assert.strictEqual(l.containerStyle.textAlign, 'center');
    });

    it('returns flex row layout for split-left variation', () => {
      const l = resolveHeroLayoutStyles('split-left');
      assert.strictEqual(l.containerStyle.display, 'flex');
      assert.strictEqual(l.containerStyle.flexDirection, 'row');
    });

    it('returns flex row-reverse layout for split-right variation', () => {
      const l = resolveHeroLayoutStyles('split-right');
      assert.strictEqual(l.containerStyle.display, 'flex');
      assert.strictEqual(l.containerStyle.flexDirection, 'row-reverse');
    });

    it('returns glassmorphism text card and full-bleed visual for full-screen-visual', () => {
      const l = resolveHeroLayoutStyles('full-screen-visual');
      assert.strictEqual(l.visualColStyle.position, 'absolute');
      assert.ok(l.textColStyle.backdropFilter !== undefined);
    });
  });
});
