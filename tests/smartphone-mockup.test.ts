import test from 'node:test';
import assert from 'node:assert/strict';

import {
  parseAspectRatio,
  resolveSmartphoneDimensions,
  resolveCameraCutout,
  calculateContinuousFloating,
  calculateContinuousTilt,
  calculateScreenRevealState,
  SMARTPHONE_PRESETS,
} from '../src/components/mockups/smartphoneMockupStyle.ts';

test('SmartphoneMockup: Aspect Ratio Resolution', async (t) => {
  await t.test('parses numeric aspect ratio directly', () => {
    assert.equal(parseAspectRatio(2.16), 2.16);
    assert.equal(parseAspectRatio(undefined), undefined);
    assert.equal(parseAspectRatio(-1), undefined);
  });

  await t.test('parses colon-separated standard mobile aspect ratios (H/W)', () => {
    // 9:19.5 -> 19.5 / 9 = 2.166666...
    const r19_5 = parseAspectRatio('9:19.5');
    assert.ok(r19_5 !== undefined);
    assert.ok(Math.abs(r19_5 - (19.5 / 9)) < 1e-4);

    // 9:20 -> 20 / 9 = 2.2222...
    const r20 = parseAspectRatio('9:20');
    assert.ok(r20 !== undefined);
    assert.ok(Math.abs(r20 - (20 / 9)) < 1e-4);

    // 9:16 -> 16 / 9 = 1.7777...
    const r16 = parseAspectRatio('9:16');
    assert.ok(r16 !== undefined);
    assert.ok(Math.abs(r16 - (16 / 9)) < 1e-4);
  });

  await t.test('parses slash-separated ratio format', () => {
    const rSlash = parseAspectRatio('19.5/9');
    assert.ok(rSlash !== undefined);
    assert.ok(Math.abs(rSlash - (19.5 / 9)) < 1e-4);
  });

  await t.test('handles invalid string gracefully', () => {
    assert.equal(parseAspectRatio('invalid'), undefined);
    assert.equal(parseAspectRatio(''), undefined);
  });
});

test('SmartphoneMockup: Geometry & Preset Dimensions', async (t) => {
  await t.test('defaults to flagship model specifications with concentric screen radius', () => {
    const dims = resolveSmartphoneDimensions();
    assert.equal(dims.width, SMARTPHONE_PRESETS.flagship.width);
    assert.equal(dims.height, SMARTPHONE_PRESETS.flagship.height);
    assert.equal(dims.frameThickness, SMARTPHONE_PRESETS.flagship.frameThickness);
    assert.equal(dims.borderRadius, SMARTPHONE_PRESETS.flagship.borderRadius);
    // Concentric: inner radius = outer radius - frameThickness
    assert.equal(dims.screenRadius, 40 - 12);
    assert.equal(dims.screenWidth, 320 - 24);
    assert.equal(dims.screenHeight, 660 - 24);
  });

  await t.test('resolves compact, pro-max, and fold model presets', () => {
    const compact = resolveSmartphoneDimensions({ model: 'compact' });
    assert.equal(compact.width, 280);
    assert.equal(compact.height, 560);
    assert.equal(compact.screenRadius, 34 - 10);

    const proMax = resolveSmartphoneDimensions({ model: 'pro-max' });
    assert.equal(proMax.width, 360);
    assert.equal(proMax.height, 740);
    assert.equal(proMax.screenRadius, 44 - 13);

    const fold = resolveSmartphoneDimensions({ model: 'fold' });
    assert.equal(fold.width, 300);
    assert.equal(fold.height, 700);
    assert.equal(fold.screenRadius, 28 - 11);
  });

  await t.test('computes height automatically from width and aspect ratio', () => {
    const dims = resolveSmartphoneDimensions({
      width: 300,
      aspectRatio: '9:19.5',
    });
    // Expected height = round(300 * (19.5 / 9)) = round(650)
    assert.equal(dims.width, 300);
    assert.equal(dims.height, 650);
  });

  await t.test('computes width automatically from height and aspect ratio', () => {
    const dims = resolveSmartphoneDimensions({
      height: 650,
      aspectRatio: '9:19.5',
    });
    // Expected width = round(650 / (19.5 / 9)) = round(300)
    assert.equal(dims.width, 300);
    assert.equal(dims.height, 650);
  });

  await t.test('preserves explicit screenRadius override', () => {
    const dims = resolveSmartphoneDimensions({
      borderRadius: 40,
      frameThickness: 12,
      screenRadius: 16,
    });
    assert.equal(dims.screenRadius, 16);
  });
});

test('SmartphoneMockup: Camera Cutout Resolution', async (t) => {
  await t.test('returns "none" when showCamera is explicitly false', () => {
    assert.equal(resolveCameraCutout(false), 'none');
  });

  await t.test('respects cutout string passed into showCamera', () => {
    assert.equal(resolveCameraCutout('punch-hole'), 'punch-hole');
    assert.equal(resolveCameraCutout('dynamic-island'), 'dynamic-island');
    assert.equal(resolveCameraCutout('notch'), 'notch');
  });

  await t.test('uses cameraCutout override if present', () => {
    assert.equal(resolveCameraCutout(true, 'punch-hole'), 'punch-hole');
  });

  await t.test('defaults to dynamic-island when no cutout specified', () => {
    assert.equal(resolveCameraCutout(true), 'dynamic-island');
    assert.equal(resolveCameraCutout(undefined), 'dynamic-island');
  });
});

test('SmartphoneMockup: Deterministic Continuous Floating Motion', async (t) => {
  await t.test('returns 0 when floating is disabled or false', () => {
    assert.equal(calculateContinuousFloating({ currentFrame: 10, fps: 30, config: false }), 0);
    assert.equal(calculateContinuousFloating({ currentFrame: 10, fps: 30, config: undefined }), 0);
  });

  await t.test('returns 0 prior to frame delay', () => {
    const y = calculateContinuousFloating({
      currentFrame: 5,
      fps: 30,
      config: true,
      delay: 15,
    });
    assert.equal(y, 0);
  });

  await t.test('calculates accurate sinusoidal displacement at quarter and three-quarter periods', () => {
    const fps = 30;
    const frequency = 0.5; // 1 cycle every 2 seconds (60 frames)
    const amplitude = 10;
    const config = { amplitude, frequency };

    // At frame 0 (elapsed 0s): sin(0) = 0
    const y0 = calculateContinuousFloating({ currentFrame: 0, fps, config, delay: 0 });
    assert.equal(y0, 0);

    // At frame 15 (elapsed 0.5s): period = 2s, 0.5s is 1/4 cycle -> sin(pi/2) = 1 -> y = 10
    const yQuarter = calculateContinuousFloating({ currentFrame: 15, fps, config, delay: 0 });
    assert.equal(yQuarter, amplitude);

    // At frame 30 (elapsed 1.0s): half cycle -> sin(pi) = 0 -> y = 0
    const yHalf = calculateContinuousFloating({ currentFrame: 30, fps, config, delay: 0 });
    assert.equal(yHalf, 0);

    // At frame 45 (elapsed 1.5s): 3/4 cycle -> sin(3pi/2) = -1 -> y = -10
    const yThreeQuarter = calculateContinuousFloating({ currentFrame: 45, fps, config, delay: 0 });
    assert.equal(yThreeQuarter, -amplitude);
  });
});

test('SmartphoneMockup: Deterministic Continuous Gentle Tilt', async (t) => {
  await t.test('returns 0 when tilt is disabled or false', () => {
    assert.equal(calculateContinuousTilt({ currentFrame: 20, fps: 30, config: false }), 0);
  });

  await t.test('returns 0 before delay', () => {
    assert.equal(calculateContinuousTilt({ currentFrame: 5, fps: 30, config: true, delay: 10 }), 0);
  });

  await t.test('oscillates smoothly between -maxAngle and +maxAngle', () => {
    const fps = 30;
    const maxAngle = 4;
    const frequency = 1; // 1 Hz = 1 cycle per 30 frames
    const config = { maxAngle, frequency };

    // Frame 0: 0
    assert.equal(calculateContinuousTilt({ currentFrame: 0, fps, config }), 0);

    // Frame 7.5: quarter period (sin = 1) -> angle = 4
    const tiltQuarter = calculateContinuousTilt({ currentFrame: 7.5, fps, config });
    assert.equal(tiltQuarter, maxAngle);

    // Frame 22.5: three-quarter period (sin = -1) -> angle = -4
    const tiltThreeQuarter = calculateContinuousTilt({ currentFrame: 22.5, fps, config });
    assert.equal(tiltThreeQuarter, -maxAngle);
  });
});

test('SmartphoneMockup: Sequential Screen Reveal Transitions', async (t) => {
  await t.test('defaults to fully revealed state when screenReveal is disabled', () => {
    const state = calculateScreenRevealState({ currentFrame: 0, config: false });
    assert.equal(state.progress, 1);
    assert.equal(state.opacity, 1);
    assert.equal(state.translateY, 0);
    assert.equal(state.scale, 1);
    assert.equal(state.isComplete, true);
  });

  await t.test('hides screen content before reveal delay', () => {
    const state = calculateScreenRevealState({
      currentFrame: 5,
      config: { delay: 15, duration: 15, type: 'fade' },
    });
    assert.equal(state.progress, 0);
    assert.equal(state.opacity, 0);
    assert.equal(state.isRevealing, false);
    assert.equal(state.isComplete, false);
  });

  await t.test('wipe-up smoothly moves translateY from 24 to 0', () => {
    const config = { delay: 10, duration: 20, type: 'wipe-up' as const };

    const initial = calculateScreenRevealState({ currentFrame: 5, config });
    assert.equal(initial.translateY, 24);
    assert.equal(initial.opacity, 0);

    const midway = calculateScreenRevealState({ currentFrame: 20, config });
    assert.ok(midway.opacity > 0 && midway.opacity < 1);
    assert.ok(midway.translateY > 0 && midway.translateY < 24);
    assert.equal(midway.isRevealing, true);

    const complete = calculateScreenRevealState({ currentFrame: 35, config });
    assert.equal(complete.opacity, 1);
    assert.equal(complete.translateY, 0);
    assert.equal(complete.isComplete, true);
  });

  await t.test('scale reveal smoothly zooms scale from 0.94 to 1.0', () => {
    const config = { delay: 10, duration: 20, type: 'scale' as const };

    const initial = calculateScreenRevealState({ currentFrame: 0, config });
    assert.equal(initial.scale, 0.94);

    const complete = calculateScreenRevealState({ currentFrame: 30, config });
    assert.equal(complete.scale, 1);
  });
});
