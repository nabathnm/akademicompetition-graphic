import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  calculateCallToActionSceneKinematics,
  resolveCallToActionSceneLayout,
} from '../src/components/scenes/callToActionSceneStyle.ts';

describe('CallToActionScene Unit Tests', () => {
  describe('calculateCallToActionSceneKinematics', () => {
    it('staggers entrance sequence: brand -> headline -> description -> buttons', () => {
      const m0 = calculateCallToActionSceneKinematics({
        frame: 0,
        delay: 0,
        staggerDelay: 4,
      });

      assert.strictEqual(m0.headline.opacity, 0);
      assert.strictEqual(m0.buttons.opacity, 0);

      const m15 = calculateCallToActionSceneKinematics({
        frame: 15,
        delay: 0,
        staggerDelay: 4,
      });

      assert.ok(m15.brand.opacity > 0);
      assert.ok(m15.headline.opacity > 0);

      const m35 = calculateCallToActionSceneKinematics({
        frame: 35,
        delay: 0,
        staggerDelay: 4,
      });

      assert.strictEqual(m35.headline.isSettled, true);
      assert.strictEqual(m35.buttons.isSettled, true);
    });

    it('calculates continuous harmonic button pulse', () => {
      const p10 = calculateCallToActionSceneKinematics({ frame: 10 }).buttonPulse;
      const p20 = calculateCallToActionSceneKinematics({ frame: 20 }).buttonPulse;
      const p10Repeat = calculateCallToActionSceneKinematics({ frame: 10 }).buttonPulse;

      assert.strictEqual(p10, p10Repeat);
      assert.notStrictEqual(p10, p20);
    });
  });

  describe('resolveCallToActionSceneLayout', () => {
    it('returns centered column for centered layout', () => {
      const l = resolveCallToActionSceneLayout('centered');
      assert.strictEqual(l.containerStyle.flexDirection, 'column');
      assert.strictEqual(l.containerStyle.alignItems, 'center');
      assert.strictEqual(l.isSplit, false);
    });

    it('returns left aligned column for left-aligned layout', () => {
      const l = resolveCallToActionSceneLayout('left-aligned');
      assert.strictEqual(l.containerStyle.alignItems, 'flex-start');
      assert.strictEqual(l.isSplit, false);
    });

    it('returns split row for cta-with-product and cta-with-device', () => {
      const l1 = resolveCallToActionSceneLayout('cta-with-product');
      const l2 = resolveCallToActionSceneLayout('cta-with-device');

      assert.strictEqual(l1.isSplit, true);
      assert.strictEqual(l1.containerStyle.flexDirection, 'row');
      assert.strictEqual(l2.isSplit, true);
      assert.strictEqual(l2.containerStyle.flexDirection, 'row');
    });

    it('returns full screen typography layout', () => {
      const l = resolveCallToActionSceneLayout('full-screen-typography');
      assert.strictEqual(l.containerStyle.maxWidth, 1200);
      assert.strictEqual(l.isSplit, false);
    });
  });
});
