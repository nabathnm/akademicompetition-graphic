import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  isTransitionSupported,
  normalizeTransitionType,
  validateTransitionConfig,
  calculateTransitionWindow,
  calculateTransitionProgress,
  resolveAdjacentTransition,
  resolveSceneEnvelope,
} from '../src/components/transitions/transitionControllerStyle.ts';
import type { TransitionControllerConfig } from '../src/components/transitions/transitionControllerTypes.ts';

describe('TransitionController Unit Tests', () => {
  describe('isTransitionSupported & normalizeTransitionType', () => {
    it('recognizes all 10 supported transition types', () => {
      const expected = [
        'fade',
        'slide',
        'zoom',
        'wipe',
        'mask',
        'split',
        'morph',
        'glitch',
        'none',
        'cut',
      ];
      for (const type of expected) {
        assert.strictEqual(
          isTransitionSupported(type),
          true,
          `Expected type '${type}' to be supported`,
        );
      }
    });

    it('handles case-insensitivity and trimming', () => {
      assert.strictEqual(isTransitionSupported('  FADE '), true);
      assert.strictEqual(isTransitionSupported('Slide'), true);
      assert.strictEqual(isTransitionSupported('GLITCH'), true);
    });

    it('returns false for unknown or non-string inputs', () => {
      assert.strictEqual(isTransitionSupported('flip'), false);
      assert.strictEqual(isTransitionSupported('dissolve'), false);
      assert.strictEqual(isTransitionSupported('bounce'), false);
      assert.strictEqual(isTransitionSupported(null), false);
      assert.strictEqual(isTransitionSupported(undefined), false);
      assert.strictEqual(isTransitionSupported(42), false);
    });

    it('normalizes type strings properly', () => {
      assert.strictEqual(normalizeTransitionType('slide'), 'slide');
      assert.strictEqual(normalizeTransitionType('CUT'), 'none');
      assert.strictEqual(normalizeTransitionType('unknown-type'), 'fade');
      assert.strictEqual(normalizeTransitionType(undefined), 'fade');
    });
  });

  describe('validateTransitionConfig', () => {
    it('returns isValid: true for standard valid configuration', () => {
      const config: TransitionControllerConfig = {
        type: 'slide',
        durationInFrames: 25,
        direction: 'left',
      };
      const result = validateTransitionConfig(config, 90);
      assert.strictEqual(result.isValid, true);
      assert.strictEqual(result.errors.length, 0);
      assert.strictEqual(result.resolvedType, 'slide');
      assert.strictEqual(result.resolvedDuration, 25);
    });

    it('catches negative transition duration', () => {
      const config: TransitionControllerConfig = {
        type: 'fade',
        durationInFrames: -15,
      };
      const result = validateTransitionConfig(config);
      assert.strictEqual(result.isValid, false);
      assert.strictEqual(result.errors.length, 1);
      assert.match(result.errors[0], /cannot be negative/i);
    });

    it('catches negative delay', () => {
      const config: TransitionControllerConfig = {
        type: 'zoom',
        durationInFrames: 20,
        delay: -5,
      };
      const result = validateTransitionConfig(config);
      assert.strictEqual(result.isValid, false);
      assert.strictEqual(result.errors.length, 1);
      assert.match(result.errors[0], /delay cannot be negative/i);
    });

    it('warns about unsupported transition type and falls back to fade', () => {
      const config: TransitionControllerConfig = {
        type: 'unsupported-3d-flip' as any,
        durationInFrames: 30,
      };
      const result = validateTransitionConfig(config);
      assert.strictEqual(result.isValid, true);
      assert.strictEqual(result.warnings.length, 1);
      assert.match(result.warnings[0], /unsupported transition type/i);
      assert.strictEqual(result.resolvedType, 'fade');
    });

    it('warns when transition duration exceeds parent scene duration', () => {
      const config: TransitionControllerConfig = {
        type: 'wipe',
        durationInFrames: 120,
      };
      const result = validateTransitionConfig(config, 60);
      assert.strictEqual(result.isValid, true);
      assert.strictEqual(result.warnings.length, 1);
      assert.match(result.warnings[0], /exceeds parent scene duration/i);
    });

    it('handles zero duration as an instantaneous cut', () => {
      const config: TransitionControllerConfig = {
        type: 'slide',
        durationInFrames: 0,
      };
      const result = validateTransitionConfig(config);
      assert.strictEqual(result.isValid, true);
      assert.strictEqual(result.resolvedDuration, 0);
      assert.strictEqual(result.warnings.length, 1);
      assert.match(result.warnings[0], /instantaneous cut/i);
    });
  });

  describe('calculateTransitionWindow', () => {
    it('calculates center alignment correctly', () => {
      // boundary: 60, duration: 20 -> center half = 10 -> [50 .. 70]
      const win = calculateTransitionWindow({
        boundaryFrame: 60,
        durationInFrames: 20,
        alignment: 'center',
      });
      assert.strictEqual(win.startFrame, 50);
      assert.strictEqual(win.endFrame, 70);
      assert.strictEqual(win.durationInFrames, 20);
      assert.strictEqual(win.boundaryFrame, 60);

      assert.strictEqual(win.getTransitionPhase(45), 'before');
      assert.strictEqual(win.getTransitionPhase(50), 'transition');
      assert.strictEqual(win.getTransitionPhase(60), 'transition');
      assert.strictEqual(win.getTransitionPhase(69), 'transition');
      assert.strictEqual(win.getTransitionPhase(70), 'after');

      assert.strictEqual(win.isWithinTransition(49), false);
      assert.strictEqual(win.isWithinTransition(50), true);
      assert.strictEqual(win.isWithinTransition(69), true);
      assert.strictEqual(win.isWithinTransition(70), false);
    });

    it('calculates lead-in alignment correctly (transition completes at boundary)', () => {
      // boundary: 60, duration: 20 -> lead-in -> [40 .. 60]
      const win = calculateTransitionWindow({
        boundaryFrame: 60,
        durationInFrames: 20,
        alignment: 'lead-in',
      });
      assert.strictEqual(win.startFrame, 40);
      assert.strictEqual(win.endFrame, 60);

      assert.strictEqual(win.getTransitionPhase(39), 'before');
      assert.strictEqual(win.getTransitionPhase(40), 'transition');
      assert.strictEqual(win.getTransitionPhase(59), 'transition');
      assert.strictEqual(win.getTransitionPhase(60), 'after');
    });

    it('calculates lead-out alignment correctly (transition starts at boundary)', () => {
      // boundary: 60, duration: 20 -> lead-out -> [60 .. 80]
      const win = calculateTransitionWindow({
        boundaryFrame: 60,
        durationInFrames: 20,
        alignment: 'lead-out',
      });
      assert.strictEqual(win.startFrame, 60);
      assert.strictEqual(win.endFrame, 80);

      assert.strictEqual(win.getTransitionPhase(59), 'before');
      assert.strictEqual(win.getTransitionPhase(60), 'transition');
      assert.strictEqual(win.getTransitionPhase(79), 'transition');
      assert.strictEqual(win.getTransitionPhase(80), 'after');
    });

    it('calculates normalized progress and local frame accurately', () => {
      const win = calculateTransitionWindow({
        boundaryFrame: 100,
        durationInFrames: 20,
        alignment: 'center', // [90 .. 110]
      });

      assert.strictEqual(win.getNormalizedProgress(90), 0);
      assert.strictEqual(win.getNormalizedProgress(100), 0.5);
      assert.strictEqual(win.getNormalizedProgress(110), 1);
      assert.strictEqual(win.getNormalizedProgress(80), 0);
      assert.strictEqual(win.getNormalizedProgress(120), 1);

      assert.strictEqual(win.getLocalTransitionFrame(90), 0);
      assert.strictEqual(win.getLocalTransitionFrame(100), 10);
      assert.strictEqual(win.getLocalTransitionFrame(109), 19);
      assert.strictEqual(win.getLocalTransitionFrame(110), 19);
    });

    it('clamps boundaryFrame and startFrame to non-negative values', () => {
      const win = calculateTransitionWindow({
        boundaryFrame: 5,
        durationInFrames: 20,
        alignment: 'center', // 5 - 10 = -5 -> clamped to 0
      });
      assert.strictEqual(win.startFrame, 0);
      assert.strictEqual(win.endFrame, 20);
    });

    it('handles zero duration in calculateTransitionWindow gracefully', () => {
      const win = calculateTransitionWindow({
        boundaryFrame: 50,
        durationInFrames: 0,
      });
      assert.strictEqual(win.startFrame, 50);
      assert.strictEqual(win.endFrame, 50);
      assert.strictEqual(win.isWithinTransition(50), false);
      assert.strictEqual(win.getTransitionPhase(49), 'before');
      assert.strictEqual(win.getTransitionPhase(50), 'after');
    });
  });

  describe('calculateTransitionProgress', () => {
    it('interpolates linear progress accurately', () => {
      const p0 = calculateTransitionProgress({
        currentFrame: 10,
        startFrame: 10,
        durationInFrames: 20,
        easing: 'linear',
      });
      assert.strictEqual(p0, 0);

      const pMid = calculateTransitionProgress({
        currentFrame: 20,
        startFrame: 10,
        durationInFrames: 20,
        easing: 'linear',
      });
      assert.strictEqual(pMid, 0.5);

      const pEnd = calculateTransitionProgress({
        currentFrame: 30,
        startFrame: 10,
        durationInFrames: 20,
        easing: 'linear',
      });
      assert.strictEqual(pEnd, 1);
    });

    it('supports custom easing functions', () => {
      const stepEasing = (t: number) => (t >= 0.5 ? 1 : 0);
      const valBefore = calculateTransitionProgress({
        currentFrame: 14,
        startFrame: 10,
        durationInFrames: 20, // progress 0.2
        easing: stepEasing,
      });
      assert.strictEqual(valBefore, 0);

      const valAfter = calculateTransitionProgress({
        currentFrame: 21,
        startFrame: 10,
        durationInFrames: 20, // progress 0.55
        easing: stepEasing,
      });
      assert.strictEqual(valAfter, 1);
    });
  });

  describe('resolveAdjacentTransition', () => {
    it('applies standard defaults when config is empty or omitted', () => {
      const resolved = resolveAdjacentTransition();
      assert.strictEqual(resolved.type, 'fade');
      assert.strictEqual(resolved.durationInFrames, 20);
      assert.strictEqual(resolved.alignment, 'center');
      assert.strictEqual(resolved.disabled, false);
    });

    it('respects explicit disabled flag and none type', () => {
      const disabled1 = resolveAdjacentTransition({ disabled: true, type: 'slide' });
      assert.strictEqual(disabled1.disabled, true);

      const disabled2 = resolveAdjacentTransition({ type: 'none' });
      assert.strictEqual(disabled2.disabled, true);
    });
  });

  describe('resolveSceneEnvelope', () => {
    it('resolves entrance and exit defaults', () => {
      const envelope = resolveSceneEnvelope({});
      assert.strictEqual(envelope.entrance.type, 'fade');
      assert.strictEqual(envelope.entrance.durationInFrames, 15);
      assert.strictEqual(envelope.exit.type, 'fade');
      assert.strictEqual(envelope.exit.durationInFrames, 15);
      assert.strictEqual(envelope.canUseCombinedInOut, true);
    });

    it('detects when combined in-out is not applicable due to different types', () => {
      const envelope = resolveSceneEnvelope({
        entrance: { type: 'slide', durationInFrames: 20 },
        exit: { type: 'zoom', durationInFrames: 20 },
      });
      assert.strictEqual(envelope.entrance.type, 'slide');
      assert.strictEqual(envelope.exit.type, 'zoom');
      assert.strictEqual(envelope.canUseCombinedInOut, false);
    });

    it('detects when combined in-out duration exceeds scene duration', () => {
      const envelope = resolveSceneEnvelope({
        entrance: { type: 'fade', durationInFrames: 40 },
        exit: { type: 'fade', durationInFrames: 40 },
        sceneDurationInFrames: 60, // 40 + 40 = 80 > 60
      });
      assert.strictEqual(envelope.canUseCombinedInOut, false);
    });
  });
});
