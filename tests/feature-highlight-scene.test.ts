import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  calculateFeatureHighlightKinematics,
  resolveFeatureHighlightLayout,
  resolveAnnotationPosition,
} from '../src/components/scenes/featureHighlightSceneStyle.ts';

describe('FeatureHighlightScene Unit Tests', () => {
  describe('calculateFeatureHighlightKinematics', () => {
    it('staggers entrance sequence: label -> title -> description -> benefit', () => {
      const m0 = calculateFeatureHighlightKinematics({
        frame: 0,
        delay: 0,
        staggerDelay: 4,
      });

      assert.strictEqual(m0.title.opacity, 0);
      assert.strictEqual(m0.description.opacity, 0);
      assert.strictEqual(m0.benefit.opacity, 0);

      const m15 = calculateFeatureHighlightKinematics({
        frame: 15,
        delay: 0,
        staggerDelay: 4,
      });

      assert.ok(m15.title.opacity > 0);

      const m40 = calculateFeatureHighlightKinematics({
        frame: 40,
        delay: 0,
        staggerDelay: 4,
      });

      assert.strictEqual(m40.title.isSettled, true);
      assert.strictEqual(m40.description.isSettled, true);
      assert.strictEqual(m40.benefit.isSettled, true);
    });

    it('computes continuous benefit pulse sine wave', () => {
      const p10 = calculateFeatureHighlightKinematics({ frame: 10 }).benefitPulse;
      const p20 = calculateFeatureHighlightKinematics({ frame: 20 }).benefitPulse;
      const p10Repeat = calculateFeatureHighlightKinematics({ frame: 10 }).benefitPulse;

      assert.strictEqual(p10, p10Repeat);
      assert.notStrictEqual(p10, p20);
    });

    it('staggers annotation callout entrances', () => {
      const m = calculateFeatureHighlightKinematics({
        frame: 25,
        delay: 0,
        annotationCount: 3,
        animation: { annotationsDelay: 10, staggerDelay: 6 },
      });

      assert.strictEqual(m.annotations.length, 3);
      assert.ok(m.annotations[0].opacity > m.annotations[2].opacity);
    });
  });

  describe('resolveFeatureHighlightLayout', () => {
    it('returns flex row for text-left', () => {
      const l = resolveFeatureHighlightLayout('text-left');
      assert.strictEqual(l.containerStyle.display, 'flex');
      assert.strictEqual(l.containerStyle.flexDirection, 'row');
    });

    it('returns flex row-reverse for text-right', () => {
      const l = resolveFeatureHighlightLayout('text-right');
      assert.strictEqual(l.containerStyle.display, 'flex');
      assert.strictEqual(l.containerStyle.flexDirection, 'row-reverse');
    });

    it('returns flex column for centered', () => {
      const l = resolveFeatureHighlightLayout('centered');
      assert.strictEqual(l.containerStyle.flexDirection, 'column');
      assert.strictEqual(l.containerStyle.textAlign, 'center');
    });

    it('returns full visual with overlay card for full-visual', () => {
      const l = resolveFeatureHighlightLayout('full-visual');
      assert.strictEqual(l.visualColStyle.position, 'absolute');
      assert.ok(l.textColStyle.backdropFilter !== undefined);
    });
  });

  describe('resolveAnnotationPosition', () => {
    it('resolves explicit percentage coordinates', () => {
      const pos = resolveAnnotationPosition({ title: 'Aperture', x: 70, y: 30 });
      assert.strictEqual(pos.left, '70%');
      assert.strictEqual(pos.top, '30%');
    });

    it('resolves preset positions', () => {
      const top = resolveAnnotationPosition({ title: 'Top', position: 'top' });
      const left = resolveAnnotationPosition({ title: 'Left', position: 'left' });
      assert.strictEqual(top.top, '5%');
      assert.strictEqual(left.left, '0%');
    });
  });
});
