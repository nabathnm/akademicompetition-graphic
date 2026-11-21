import test from 'node:test';
import assert from 'node:assert/strict';

import {
  parseScreenAspectRatio,
  resolveLaptopDimensions,
  calculateLaptopOpeningState,
  LAPTOP_PRESETS,
} from '../src/components/mockups/laptopMockupStyle.ts';

test('LaptopMockup: Screen Aspect Ratio Parsing', async (t) => {
  await t.test('defaults to 16:10 (0.625) when ratio is unspecified or invalid', () => {
    assert.equal(parseScreenAspectRatio(undefined), 10 / 16);
    assert.equal(parseScreenAspectRatio('invalid'), 10 / 16);
    assert.equal(parseScreenAspectRatio(-1), 10 / 16);
  });

  await t.test('parses standard colon-separated aspect ratios (16:10, 16:9, 3:2)', () => {
    assert.equal(parseScreenAspectRatio('16:10'), 10 / 16);
    assert.equal(parseScreenAspectRatio('16:9'), 9 / 16);
    assert.ok(Math.abs(parseScreenAspectRatio('3:2') - (2 / 3)) < 1e-4);
  });

  await t.test('parses numeric aspect ratio (both > 1 and <= 1)', () => {
    // 1.6 -> inverted to 1 / 1.6 = 0.625
    assert.equal(parseScreenAspectRatio(1.6), 0.625);
    // 0.625 -> 0.625 directly
    assert.equal(parseScreenAspectRatio(0.625), 0.625);
  });

  await t.test('parses slash-separated format', () => {
    assert.equal(parseScreenAspectRatio('10/16'), 10 / 16);
  });
});

test('LaptopMockup: Geometry & Physical Dimensions', async (t) => {
  await t.test('resolves standard model dimensions with concentric screen radius', () => {
    const dims = resolveLaptopDimensions();
    assert.equal(dims.width, LAPTOP_PRESETS.standard.width); // 680
    assert.equal(dims.bezelThickness, 10);
    assert.equal(dims.borderRadius, 14);
    // Screen width = 680 - 2 * 10 = 660
    assert.equal(dims.screenWidth, 660);
    // Screen height = round(660 * 0.625) = 413
    assert.equal(dims.screenHeight, 413);
    // Lid height = 413 + 2 * 10 = 433
    assert.equal(dims.lidHeight, 433);
    // Concentric screen radius = max(0, 14 - 10) = 4
    assert.equal(dims.screenRadius, 4);
    // Base deck width has perspective flare (width + 28 = 708)
    assert.equal(dims.baseWidth, 680 + 28);
    assert.equal(dims.baseHeight, 100);
    assert.equal(dims.hingeHeight, 8);
    // Total height = lidHeight (433) + hingeHeight (8) + baseHeight (100) = 541
    assert.equal(dims.height, 433 + 8 + 100);
  });

  await t.test('resolves compact and pro model presets', () => {
    const compact = resolveLaptopDimensions({ model: 'compact' });
    assert.equal(compact.width, 560);
    assert.equal(compact.bezelThickness, 9);
    assert.equal(compact.borderRadius, 12);
    assert.equal(compact.screenRadius, 12 - 9);

    const pro = resolveLaptopDimensions({ model: 'pro' });
    assert.equal(pro.width, 780);
    assert.equal(pro.bezelThickness, 11);
    assert.equal(pro.borderRadius, 16);
    assert.equal(pro.screenRadius, 16 - 11);
  });

  await t.test('computes screen dimensions with custom aspect ratio (16:9)', () => {
    const dims = resolveLaptopDimensions({
      width: 680,
      bezelThickness: 10,
      screenAspectRatio: '16:9',
    });
    // screenWidth = 660
    // screenHeight = round(660 * (9 / 16)) = round(371.25) = 371
    assert.equal(dims.screenWidth, 660);
    assert.equal(dims.screenHeight, 371);
  });

  await t.test('preserves explicit screenRadius and total height overrides', () => {
    const dims = resolveLaptopDimensions({
      screenRadius: 10,
      height: 600,
    });
    assert.equal(dims.screenRadius, 10);
    assert.equal(dims.height, 600);
  });

  await t.test('clamps small dimensions gracefully', () => {
    const dims = resolveLaptopDimensions({
      width: 200, // clamps to 320
      bezelThickness: 2, // clamps to 4
      baseHeight: 20, // clamps to 40
    });
    assert.equal(dims.width, 320);
    assert.equal(dims.bezelThickness, 4);
    assert.equal(dims.baseHeight, 40);
  });
});

test('LaptopMockup: Deterministic Lid Opening Kinetics', async (t) => {
  await t.test('defaults to fully upright and open when openingAnimation is disabled', () => {
    const state = calculateLaptopOpeningState({ currentFrame: 0, config: false });
    assert.equal(state.progress, 1);
    assert.equal(state.angle, 0);
    assert.equal(state.lidOpacity, 1);
    assert.equal(state.isOpening, false);
    assert.equal(state.isComplete, true);
  });

  await t.test('holds initial tilt angle prior to startFrame', () => {
    const config = { startFrame: 15, duration: 30, fromAngle: 80, toAngle: 0 };

    const before = calculateLaptopOpeningState({ currentFrame: 5, config });
    assert.equal(before.progress, 0);
    assert.equal(before.angle, 80);
    assert.equal(before.lidOpacity, 0.5);
    assert.equal(before.isOpening, false);
    assert.equal(before.isComplete, false);
  });

  await t.test('rotates lid from fromAngle to toAngle smoothly during active window', () => {
    const config = { startFrame: 10, duration: 20, fromAngle: 70, toAngle: 0 };

    const midway = calculateLaptopOpeningState({ currentFrame: 20, config });
    assert.ok(midway.progress > 0 && midway.progress < 1);
    assert.ok(midway.angle > 0 && midway.angle < 70);
    assert.ok(midway.lidOpacity > 0.5 && midway.lidOpacity <= 1);
    assert.equal(midway.isOpening, true);

    const complete = calculateLaptopOpeningState({ currentFrame: 35, config });
    assert.equal(complete.progress, 1);
    assert.equal(complete.angle, 0);
    assert.equal(complete.lidOpacity, 1);
    assert.equal(complete.isOpening, false);
    assert.equal(complete.isComplete, true);
  });
});
