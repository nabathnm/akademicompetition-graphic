import test from 'node:test';
import assert from 'node:assert/strict';

import {
  parseTabletAspectRatio,
  resolveTabletDimensions,
  calculateTabletRotationState,
  TABLET_PRESETS,
  TABLET_FINISH_COLORS,
} from '../src/components/mockups/tabletMockupStyle.ts';

test('TabletMockup: Aspect Ratio Parsing', async (t) => {
  await t.test('defaults to 4:3 (1.3333 in landscape, 0.75 in portrait)', () => {
    assert.ok(Math.abs(parseTabletAspectRatio(undefined, 'landscape') - 4 / 3) < 1e-4);
    assert.ok(Math.abs(parseTabletAspectRatio(undefined, 'portrait') - 3 / 4) < 1e-4);
    assert.ok(Math.abs(parseTabletAspectRatio('invalid', 'landscape') - 4 / 3) < 1e-4);
    assert.ok(Math.abs(parseTabletAspectRatio(-5, 'landscape') - 4 / 3) < 1e-4);
  });

  await t.test('parses colon-separated ratios (4:3, 16:10, 3:2)', () => {
    assert.ok(Math.abs(parseTabletAspectRatio('4:3', 'landscape') - 4 / 3) < 1e-4);
    assert.ok(Math.abs(parseTabletAspectRatio('4:3', 'portrait') - 3 / 4) < 1e-4);
    assert.ok(Math.abs(parseTabletAspectRatio('16:10', 'landscape') - 1.6) < 1e-4);
    assert.ok(Math.abs(parseTabletAspectRatio('16:10', 'portrait') - 0.625) < 1e-4);
    assert.ok(Math.abs(parseTabletAspectRatio('3:2', 'landscape') - 1.5) < 1e-4);
    assert.ok(Math.abs(parseTabletAspectRatio('3:2', 'portrait') - 2 / 3) < 1e-4);
  });

  await t.test('parses slash-separated ratios and decimal numbers', () => {
    assert.ok(Math.abs(parseTabletAspectRatio('4/3', 'landscape') - 4 / 3) < 1e-4);
    assert.ok(Math.abs(parseTabletAspectRatio(1.5, 'landscape') - 1.5) < 1e-4);
    assert.ok(Math.abs(parseTabletAspectRatio(1.5, 'portrait') - 1 / 1.5) < 1e-4);
  });
});

test('TabletMockup: Geometry & Dimensions Resolution', async (t) => {
  await t.test('resolves standard model dimensions in landscape orientation', () => {
    const dims = resolveTabletDimensions({ model: 'standard', orientation: 'landscape' });
    assert.equal(dims.orientation, 'landscape');
    assert.equal(dims.width, TABLET_PRESETS.standard.landscapeWidth); // 720
    assert.equal(dims.height, TABLET_PRESETS.standard.landscapeHeight); // 520
    assert.equal(dims.frameThickness, 16);
    assert.equal(dims.borderRadius, 26);
    // Concentric screen radius = max(2, 26 - 16) = 10
    assert.equal(dims.screenRadius, 10);
    // Screen dimensions: 720 - 32 = 688, 520 - 32 = 488
    assert.equal(dims.screenWidth, 688);
    assert.equal(dims.screenHeight, 488);
    assert.ok(dims.aspectRatio > 1);
  });

  await t.test('resolves standard model dimensions in portrait orientation', () => {
    const dims = resolveTabletDimensions({ model: 'standard', orientation: 'portrait' });
    assert.equal(dims.orientation, 'portrait');
    assert.equal(dims.width, TABLET_PRESETS.standard.portraitWidth); // 520
    assert.equal(dims.height, TABLET_PRESETS.standard.portraitHeight); // 720
    assert.equal(dims.screenWidth, 488);
    assert.equal(dims.screenHeight, 688);
    assert.ok(dims.aspectRatio < 1);
  });

  await t.test('resolves compact and pro model presets in both orientations', () => {
    const compactL = resolveTabletDimensions({ model: 'compact', orientation: 'landscape' });
    assert.equal(compactL.width, 620);
    assert.equal(compactL.height, 440);
    assert.equal(compactL.frameThickness, 14);

    const compactP = resolveTabletDimensions({ model: 'compact', orientation: 'portrait' });
    assert.equal(compactP.width, 440);
    assert.equal(compactP.height, 620);

    const proL = resolveTabletDimensions({ model: 'pro', orientation: 'landscape' });
    assert.equal(proL.width, 840);
    assert.equal(proL.height, 620);

    const proP = resolveTabletDimensions({ model: 'pro', orientation: 'portrait' });
    assert.equal(proP.width, 620);
    assert.equal(proP.height, 840);
  });

  await t.test('respects explicit width and height overrides', () => {
    const dims = resolveTabletDimensions({ width: 800, height: 600, frameThickness: 20, borderRadius: 30 });
    assert.equal(dims.width, 800);
    assert.equal(dims.height, 600);
    assert.equal(dims.frameThickness, 20);
    assert.equal(dims.borderRadius, 30);
    assert.equal(dims.screenRadius, 10); // 30 - 20 = 10
    assert.equal(dims.screenWidth, 760);
    assert.equal(dims.screenHeight, 560);
  });

  await t.test('computes height from width and aspect ratio when only width is provided', () => {
    const dims = resolveTabletDimensions({ width: 700, aspectRatio: '16:10', orientation: 'landscape' });
    assert.equal(dims.width, 700);
    // screenWidth = 700 - 32 = 668
    // screenHeight = round(668 / 1.6) = 418
    // height = 418 + 32 = 450
    assert.equal(dims.height, 450);
  });

  await t.test('preserves explicit screenRadius override', () => {
    const dims = resolveTabletDimensions({ screenRadius: 0 });
    assert.equal(dims.screenRadius, 0);
  });
});

test('TabletMockup: Hardware Finishes', async (t) => {
  await t.test('all metallic finishes map to valid CSS hex colors', () => {
    const finishes = Object.keys(TABLET_FINISH_COLORS) as Array<keyof typeof TABLET_FINISH_COLORS>;
    assert.ok(finishes.length >= 6);
    for (const finish of finishes) {
      assert.match(TABLET_FINISH_COLORS[finish], /^#[0-9a-fA-F]{6}$/);
    }
  });
});

test('TabletMockup: Device Rotation Kinetics', async (t) => {
  await t.test('returns 0 when rotation config is disabled', () => {
    assert.equal(calculateTabletRotationState({ currentFrame: 15, config: false }), 0);
    assert.equal(calculateTabletRotationState({ currentFrame: 15, config: undefined }), 0);
  });

  await t.test('returns staticAngle directly when provided', () => {
    assert.equal(calculateTabletRotationState({ currentFrame: 15, staticAngle: 45 }), 45);
    assert.equal(calculateTabletRotationState({ currentFrame: 15, config: true, staticAngle: -15 }), -15);
  });

  await t.test('holds fromAngle prior to startFrame', () => {
    const angle = calculateTabletRotationState({
      currentFrame: 5,
      config: { startFrame: 10, duration: 20, fromAngle: 0, toAngle: 90 },
    });
    assert.equal(angle, 0);
  });

  await t.test('rotates smoothly during active transition window', () => {
    const angle = calculateTabletRotationState({
      currentFrame: 20,
      config: { startFrame: 10, duration: 20, fromAngle: 0, toAngle: 90 },
    });
    // at frame 20 (50% progress), angle should be between 0 and 90
    assert.ok(angle > 0 && angle < 90);
  });

  await t.test('completes and settles at toAngle at and after completion frame', () => {
    const angleAtEnd = calculateTabletRotationState({
      currentFrame: 30,
      config: { startFrame: 10, duration: 20, fromAngle: 0, toAngle: 90 },
    });
    assert.equal(angleAtEnd, 90);

    const angleAfterEnd = calculateTabletRotationState({
      currentFrame: 60,
      config: { startFrame: 10, duration: 20, fromAngle: 0, toAngle: 90 },
    });
    assert.equal(angleAfterEnd, 90);
  });
});
