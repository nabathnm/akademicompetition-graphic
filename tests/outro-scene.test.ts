import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  calculateOutroSceneKinematics,
  resolveOutroSceneLayout,
} from '../src/components/scenes/outroSceneStyle.ts';

describe('OutroScene Unit Tests', () => {
  describe('calculateOutroSceneKinematics', () => {
    it('staggers entrance sequence: logo -> brand -> tagline -> meta', () => {
      const m0 = calculateOutroSceneKinematics({
        frame: 0,
        delay: 0,
        staggerDelay: 5,
      });

      assert.strictEqual(m0.brand.opacity, 0);
      assert.strictEqual(m0.tagline.opacity, 0);

      const m15 = calculateOutroSceneKinematics({
        frame: 15,
        delay: 0,
        staggerDelay: 5,
      });

      assert.ok(m15.logo.opacity > 0);
      assert.ok(m15.brand.opacity > 0);

      const m40 = calculateOutroSceneKinematics({
        frame: 40,
        delay: 0,
        staggerDelay: 5,
      });

      assert.strictEqual(m40.logo.isSettled, true);
      assert.strictEqual(m40.brand.isSettled, true);
      assert.strictEqual(m40.tagline.isSettled, true);
      assert.strictEqual(m40.meta.isSettled, true);
    });

    it('calculates continuous harmonic logo hover', () => {
      const h10 = calculateOutroSceneKinematics({ frame: 10 }).logoFloating;
      const h25 = calculateOutroSceneKinematics({ frame: 25 }).logoFloating;
      const h10Repeat = calculateOutroSceneKinematics({ frame: 10 }).logoFloating;

      assert.strictEqual(h10, h10Repeat);
      assert.notStrictEqual(h10, h25);
    });
  });

  describe('resolveOutroSceneLayout', () => {
    it('returns centered column for centered-brand layout', () => {
      const l = resolveOutroSceneLayout('centered-brand');
      assert.strictEqual(l.containerStyle.flexDirection, 'column');
      assert.strictEqual(l.containerStyle.alignItems, 'center');
      assert.strictEqual(l.isSplit, false);
    });

    it('returns left-aligned column for left-aligned layout', () => {
      const l = resolveOutroSceneLayout('left-aligned');
      assert.strictEqual(l.containerStyle.alignItems, 'flex-start');
      assert.strictEqual(l.isSplit, false);
    });

    it('returns split row for brand-with-cta layout', () => {
      const l = resolveOutroSceneLayout('brand-with-cta');
      assert.strictEqual(l.isSplit, true);
      assert.strictEqual(l.containerStyle.flexDirection, 'row');
    });

    it('returns ordered structure for tagline-above-logo layout', () => {
      const l = resolveOutroSceneLayout('tagline-above-logo');
      assert.strictEqual(l.brandBlockStyle.order, 1);
      assert.strictEqual(l.logoWrapperStyle.order, 2);
    });
  });
});
