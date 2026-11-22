import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  resolveSceneDimension,
  resolveScenePadding,
  resolveAlignmentProperties,
  resolveSceneLayoutStyles,
  calculateSceneAnimationMetrics,
  DEFAULT_SAFE_AREA_PX,
} from '../src/components/scenes/sceneContainerStyle.ts';

describe('SceneContainer Unit Tests', () => {
  describe('resolveSceneDimension', () => {
    it('converts numbers to pixel strings', () => {
      assert.strictEqual(resolveSceneDimension(1920), '1920px');
      assert.strictEqual(resolveSceneDimension(1080), '1080px');
    });

    it('preserves existing CSS strings and percentages', () => {
      assert.strictEqual(resolveSceneDimension('100%'), '100%');
      assert.strictEqual(resolveSceneDimension('100vw'), '100vw');
      assert.strictEqual(resolveSceneDimension('800px'), '800px');
    });

    it('falls back to default fallback when undefined or null', () => {
      assert.strictEqual(resolveSceneDimension(undefined, '100%'), '100%');
      assert.strictEqual(resolveSceneDimension(null as unknown as undefined, 1920), 1920);
    });
  });

  describe('resolveScenePadding & SafeArea', () => {
    it('handles uniform numeric padding', () => {
      const p = resolveScenePadding(40, false);
      assert.deepStrictEqual(p, {
        paddingTop: 40,
        paddingBottom: 40,
        paddingLeft: 40,
        paddingRight: 40,
      });
    });

    it('adds default safeArea margin (60px) when safeArea is true', () => {
      const p = resolveScenePadding(20, true);
      assert.deepStrictEqual(p, {
        paddingTop: 20 + DEFAULT_SAFE_AREA_PX,
        paddingBottom: 20 + DEFAULT_SAFE_AREA_PX,
        paddingLeft: 20 + DEFAULT_SAFE_AREA_PX,
        paddingRight: 20 + DEFAULT_SAFE_AREA_PX,
      });
    });

    it('supports custom numeric safeArea', () => {
      const p = resolveScenePadding(0, 80);
      assert.deepStrictEqual(p, {
        paddingTop: 80,
        paddingBottom: 80,
        paddingLeft: 80,
        paddingRight: 80,
      });
    });

    it('handles directional padding objects', () => {
      const p = resolveScenePadding({ top: 30, bottom: 40, left: 50, right: 60 }, false);
      assert.deepStrictEqual(p, {
        paddingTop: 30,
        paddingBottom: 40,
        paddingLeft: 50,
        paddingRight: 60,
      });
    });
  });

  describe('resolveAlignmentProperties & LayoutStyles', () => {
    it('resolves horizontal and vertical flex alignment properties', () => {
      const c = resolveAlignmentProperties('center', 'center');
      assert.strictEqual(c.alignItems, 'center');
      assert.strictEqual(c.justifyContent, 'center');

      const tl = resolveAlignmentProperties('left', 'top');
      assert.strictEqual(tl.alignItems, 'flex-start');
      assert.strictEqual(tl.justifyContent, 'flex-start');

      const br = resolveAlignmentProperties('right', 'bottom');
      assert.strictEqual(br.alignItems, 'flex-end');
      assert.strictEqual(br.justifyContent, 'flex-end');
    });

    it('returns valid flex layout styles for centered mode', () => {
      const s = resolveSceneLayoutStyles('centered');
      assert.strictEqual(s.display, 'flex');
      assert.strictEqual(s.flexDirection, 'column');
      assert.strictEqual(s.alignItems, 'center');
      assert.strictEqual(s.justifyContent, 'center');
    });

    it('returns full-bleed block styles for full-bleed mode', () => {
      const s = resolveSceneLayoutStyles('full-bleed');
      assert.strictEqual(s.display, 'block');
      assert.strictEqual(s.width, '100%');
      assert.strictEqual(s.height, '100%');
    });

    it('returns flex row styles for split mode', () => {
      const s = resolveSceneLayoutStyles('split');
      assert.strictEqual(s.display, 'flex');
      assert.strictEqual(s.flexDirection, 'row');
      assert.strictEqual(s.justifyContent, 'space-between');
    });
  });

  describe('calculateSceneAnimationMetrics', () => {
    it('returns fully active state when animation is "none"', () => {
      const m = calculateSceneAnimationMetrics({
        frame: 10,
        animation: 'none',
      });
      assert.strictEqual(m.opacity, 1);
      assert.strictEqual(m.translateX, 0);
      assert.strictEqual(m.translateY, 0);
      assert.strictEqual(m.scale, 1);
      assert.strictEqual(m.phase, 'active');
    });

    it('fade entrance starts at 0 opacity and settles at 1.0', () => {
      const before = calculateSceneAnimationMetrics({
        frame: 0,
        delay: 5,
        animation: { type: 'fade', enterDuration: 10 },
      });
      assert.strictEqual(before.phase, 'pending');
      assert.strictEqual(before.opacity, 0);

      const mid = calculateSceneAnimationMetrics({
        frame: 10,
        delay: 5,
        animation: { type: 'fade', enterDuration: 10 },
      });
      assert.strictEqual(mid.phase, 'enter');
      assert.ok(mid.opacity > 0 && mid.opacity < 1);

      const after = calculateSceneAnimationMetrics({
        frame: 20,
        delay: 5,
        animation: { type: 'fade', enterDuration: 10 },
      });
      assert.strictEqual(after.phase, 'active');
      assert.strictEqual(after.opacity, 1);
    });

    it('slide entrance translates along slideDirection and settles to 0', () => {
      const mStart = calculateSceneAnimationMetrics({
        frame: 0,
        animation: { type: 'slide', slideDirection: 'bottom', slideDistance: 100, enterDuration: 20 },
      });
      assert.ok(mStart.translateY > 80);

      const mEnd = calculateSceneAnimationMetrics({
        frame: 25,
        animation: { type: 'slide', slideDirection: 'bottom', slideDistance: 100, enterDuration: 20 },
      });
      assert.strictEqual(mEnd.translateY, 0);
      assert.strictEqual(mEnd.opacity, 1);
    });

    it('scale entrance scales from initialScale to 1.0', () => {
      const mStart = calculateSceneAnimationMetrics({
        frame: 0,
        animation: { type: 'scale', initialScale: 0.8, enterDuration: 15 },
      });
      assert.strictEqual(mStart.scale, 0.8);

      const mEnd = calculateSceneAnimationMetrics({
        frame: 20,
        animation: { type: 'scale', initialScale: 0.8, enterDuration: 15 },
      });
      assert.strictEqual(mEnd.scale, 1.0);
    });

    it('handles exit animation correctly before durationInFrames', () => {
      const mExit = calculateSceneAnimationMetrics({
        frame: 95,
        durationInFrames: 100,
        animation: { type: 'fade', enterDuration: 10, exitDuration: 10 },
      });
      assert.strictEqual(mExit.phase, 'exit');
      assert.ok(mExit.opacity < 1 && mExit.opacity > 0);

      const mComplete = calculateSceneAnimationMetrics({
        frame: 105,
        durationInFrames: 100,
        animation: { type: 'fade', enterDuration: 10, exitDuration: 10 },
      });
      assert.strictEqual(mComplete.phase, 'complete');
      assert.strictEqual(mComplete.opacity, 0);
    });
  });
});
