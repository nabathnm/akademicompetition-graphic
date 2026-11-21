import test from 'node:test';
import assert from 'node:assert/strict';

import {
  calculateDeviceDimensions,
  resolveDeviceShadow,
  resolveDeviceFrameAnimationConfig,
  calculateDeviceMotion,
} from '../src/components/mockups/deviceFrameStyle.ts';

test('DeviceFrame: Geometry & Concentric Dimension Calculations', async (t) => {
  await t.test('calculates default smartphone dimensions and concentric screen radius', () => {
    const dims = calculateDeviceDimensions();
    assert.equal(dims.width, 320);
    assert.equal(dims.height, 640);
    assert.equal(dims.frameThickness, 12);
    assert.equal(dims.borderRadius, 38);
    // screen dimensions = dimension - 2 * thickness
    assert.equal(dims.screenWidth, 320 - 24);
    assert.equal(dims.screenHeight, 640 - 24);
    // concentric screen radius = max(0, borderRadius - frameThickness)
    assert.equal(dims.screenRadius, 38 - 12);
  });

  await t.test('calculates custom tablet landscape geometry with concentric corners', () => {
    const dims = calculateDeviceDimensions({
      width: 800,
      height: 520,
      frameThickness: 16,
      borderRadius: 28,
    });
    assert.equal(dims.width, 800);
    assert.equal(dims.height, 520);
    assert.equal(dims.frameThickness, 16);
    assert.equal(dims.borderRadius, 28);
    assert.equal(dims.screenWidth, 800 - 32);
    assert.equal(dims.screenHeight, 520 - 32);
    assert.equal(dims.screenRadius, 28 - 16);
  });

  await t.test('respects explicit screenRadius override over default concentric calculation', () => {
    const dims = calculateDeviceDimensions({
      width: 400,
      height: 700,
      frameThickness: 20,
      borderRadius: 40,
      screenRadius: 10,
    });
    assert.equal(dims.borderRadius, 40);
    assert.equal(dims.screenRadius, 10);
  });

  await t.test('clamps negative or excessive bezels gracefully without negative radii', () => {
    const dims = calculateDeviceDimensions({
      width: 20, // should clamp to minimum 40
      height: 20, // should clamp to minimum 40
      frameThickness: 50,
      borderRadius: 20,
    });
    assert.equal(dims.width, 40);
    assert.equal(dims.height, 40);
    assert.equal(dims.screenRadius, 0); // 20 - 50 clamped to 0
    assert.equal(dims.screenWidth, 0); // 40 - 100 clamped to 0
    assert.equal(dims.screenHeight, 0);
  });
});

test('DeviceFrame: 2D Depth Shadow Layering', async (t) => {
  await t.test('returns "none" when shadow is disabled or none', () => {
    assert.equal(resolveDeviceShadow(false), 'none');
    assert.equal(resolveDeviceShadow('none'), 'none');
  });

  await t.test('resolves standard presets correctly', () => {
    const subtle = resolveDeviceShadow('subtle');
    assert.ok(subtle.includes('0 8px 24px -4px'));

    const medium = resolveDeviceShadow('medium');
    assert.ok(medium.includes('0 24px 48px -12px'));

    const high = resolveDeviceShadow('high');
    assert.ok(high.includes('0 36px 72px -16px'));

    const floating = resolveDeviceShadow('floating');
    assert.ok(floating.includes('0 48px 96px -20px'));
  });

  await t.test('defaults to medium shadow when shadow is undefined or true', () => {
    const defaultShadow = resolveDeviceShadow(undefined);
    const booleanShadow = resolveDeviceShadow(true);
    assert.equal(defaultShadow, resolveDeviceShadow('medium'));
    assert.equal(booleanShadow, resolveDeviceShadow('medium'));
  });

  await t.test('passes through custom CSS box-shadow declarations', () => {
    const custom = '0 10px 30px rgba(255, 0, 0, 0.5)';
    assert.equal(resolveDeviceShadow(custom), custom);
  });

  await t.test('incorporates custom shadowColor into shadow layers', () => {
    const shadowWithColor = resolveDeviceShadow('subtle', '#00ffcc');
    assert.ok(shadowWithColor.includes('#00ffcc'));
  });
});

test('DeviceFrame: Animation Configuration Normalization', async (t) => {
  await t.test('normalizes animate: false to none', () => {
    const cfg = resolveDeviceFrameAnimationConfig({ animate: false });
    assert.equal(cfg.type, 'none');
  });

  await t.test('resolves default spring animation when unspecified', () => {
    const cfg = resolveDeviceFrameAnimationConfig({});
    assert.equal(cfg.type, 'spring');
    assert.equal(cfg.delay, 0);
    assert.equal(cfg.duration, 25);
    assert.equal(cfg.direction, 'up');
    assert.equal(cfg.springPreset, 'snappy');
  });

  await t.test('resolves shorthand animation string with direct props', () => {
    const cfg = resolveDeviceFrameAnimationConfig({
      animation: 'slide-in',
      slideDirection: 'left',
      delay: 10,
      durationInFrames: 30,
    });
    assert.equal(cfg.type, 'slide-in');
    assert.equal(cfg.direction, 'left');
    assert.equal(cfg.delay, 10);
    assert.equal(cfg.duration, 30);
  });

  await t.test('merges structured animation config object properly', () => {
    const cfg = resolveDeviceFrameAnimationConfig({
      animation: {
        type: 'scale-in',
        delay: 5,
        duration: 20,
        from: 0.5,
        to: 1.0,
      },
    });
    assert.equal(cfg.type, 'scale-in');
    assert.equal(cfg.delay, 5);
    assert.equal(cfg.duration, 20);
    assert.equal(cfg.from, 0.5);
    assert.equal(cfg.to, 1.0);
  });
});

test('DeviceFrame: Remotion Frame-Accurate Kinetics & Transforms', async (t) => {
  await t.test('none animation immediately produces fully settled state', () => {
    const state = calculateDeviceMotion({
      currentFrame: 0,
      fps: 30,
      config: { type: 'none' },
    });
    assert.equal(state.progress, 1);
    assert.equal(state.opacity, 1);
    assert.equal(state.translateX, 0);
    assert.equal(state.translateY, 0);
    assert.equal(state.scaleX, 1);
    assert.equal(state.scaleY, 1);
    assert.equal(state.isAnimating, false);
  });

  await t.test('respects delay frame boundaries', () => {
    const delay = 15;
    const config = { type: 'fade-in' as const, delay, duration: 20 };

    const beforeDelay = calculateDeviceMotion({
      currentFrame: 5,
      fps: 30,
      config,
    });
    assert.equal(beforeDelay.progress, 0);
    assert.equal(beforeDelay.opacity, 0);
    assert.equal(beforeDelay.isAnimating, false);

    const duringAnimation = calculateDeviceMotion({
      currentFrame: 25,
      fps: 30,
      config,
    });
    assert.ok(duringAnimation.progress > 0 && duringAnimation.progress < 1);
    assert.ok(duringAnimation.opacity > 0 && duringAnimation.opacity < 1);
    assert.equal(duringAnimation.isAnimating, true);

    const settled = calculateDeviceMotion({
      currentFrame: 35,
      fps: 30,
      config,
    });
    assert.equal(settled.progress, 1);
    assert.equal(settled.opacity, 1);
    assert.equal(settled.isAnimating, true); // at exact boundary
  });

  await t.test('scale-in interpolates from specified from to to values', () => {
    const config = { type: 'scale-in' as const, delay: 0, duration: 20, from: 0.6, to: 1.2 };
    const initial = calculateDeviceMotion({ currentFrame: 0, fps: 30, config });
    assert.equal(initial.scaleX, 0.6);
    assert.equal(initial.scaleY, 0.6);

    const settled = calculateDeviceMotion({ currentFrame: 25, fps: 30, config });
    assert.equal(settled.scaleX, 1.2);
    assert.equal(settled.scaleY, 1.2);
    assert.equal(settled.opacity, 1);
  });

  await t.test('slide-in respects all 4 directions', () => {
    // Up: starts with positive translateY, moves to 0
    const slideUp = calculateDeviceMotion({
      currentFrame: 0,
      fps: 30,
      config: { type: 'slide-in', duration: 20, direction: 'up' },
    });
    assert.equal(slideUp.translateY, 100);
    assert.equal(slideUp.translateX, 0);

    // Down: starts with negative translateY, moves to 0
    const slideDown = calculateDeviceMotion({
      currentFrame: 0,
      fps: 30,
      config: { type: 'slide-in', duration: 20, direction: 'down' },
    });
    assert.equal(slideDown.translateY, -100);

    // Left: starts with positive translateX, moves to 0
    const slideLeft = calculateDeviceMotion({
      currentFrame: 0,
      fps: 30,
      config: { type: 'slide-in', duration: 20, direction: 'left' },
    });
    assert.equal(slideLeft.translateX, 100);

    // Right: starts with negative translateX, moves to 0
    const slideRight = calculateDeviceMotion({
      currentFrame: 0,
      fps: 30,
      config: { type: 'slide-in', duration: 20, direction: 'right' },
    });
    assert.equal(slideRight.translateX, -100);
  });

  await t.test('rotate interpolates rotation angle from from to to', () => {
    const config = { type: 'rotate' as const, delay: 0, duration: 20, from: -15, to: 0 };
    const initial = calculateDeviceMotion({ currentFrame: 0, fps: 30, config });
    assert.equal(initial.rotation, -15);

    const settled = calculateDeviceMotion({ currentFrame: 20, fps: 30, config });
    assert.equal(settled.rotation, 0);
  });

  await t.test('spring entrance settles accurately after completion', () => {
    const config = { type: 'spring' as const, delay: 0, duration: 25, springPreset: 'snappy' as const };
    const settled = calculateDeviceMotion({ currentFrame: 45, fps: 30, config });
    assert.equal(settled.opacity, 1);
    // At late frame, spring output is approximately 1.0
    assert.ok(Math.abs(settled.scaleX - 1.0) < 0.05);
    assert.ok(Math.abs(settled.translateY) < 1.0);
  });
});

test('DeviceFrame: Exit Transitions', async (t) => {
  await t.test('exit animation remains dormant before exitFrame', () => {
    const motion = calculateDeviceMotion({
      currentFrame: 40,
      fps: 30,
      config: { type: 'none' },
      exitFrame: 60,
      exitDurationInFrames: 20,
      exitAnimation: 'fade-out',
    });
    assert.equal(motion.hasExited, false);
    assert.equal(motion.opacity, 1);
  });

  await t.test('exit fade-out smoothly reduces opacity to 0 and flags hasExited', () => {
    const config = { type: 'none' as const };
    const exitFrame = 50;
    const exitDuration = 15;

    const midway = calculateDeviceMotion({
      currentFrame: exitFrame + 7,
      fps: 30,
      config,
      exitFrame,
      exitDurationInFrames: exitDuration,
      exitAnimation: 'fade-out',
    });
    assert.ok(midway.opacity < 1 && midway.opacity > 0);
    assert.equal(midway.hasExited, false);

    const finished = calculateDeviceMotion({
      currentFrame: exitFrame + exitDuration + 5,
      fps: 30,
      config,
      exitFrame,
      exitDurationInFrames: exitDuration,
      exitAnimation: 'fade-out',
    });
    assert.equal(finished.hasExited, true);
    assert.equal(finished.opacity, 0);
  });

  await t.test('exit slide-down shifts translateY downward as opacity drops', () => {
    const exitFrame = 80;
    const finished = calculateDeviceMotion({
      currentFrame: exitFrame + 15,
      fps: 30,
      config: { type: 'none' },
      exitFrame,
      exitDurationInFrames: 15,
      exitAnimation: 'slide-down',
    });
    assert.equal(finished.hasExited, true);
    assert.equal(finished.opacity, 0);
    assert.ok(finished.translateY >= 120);
  });
});
