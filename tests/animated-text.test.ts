import test from 'node:test';
import assert from 'node:assert/strict';

import { calculateAnimatedTextStyle } from '../src/components/typography/animatedTextStyle.ts';

test('AnimatedText: Lifecycle Boundaries', async (t) => {
  await t.test('before startFrame + delay is hidden and opacity 0', () => {
    const style = calculateAnimatedTextStyle({
      currentFrame: 5,
      fps: 30,
      startFrame: 10,
      delay: 5,
      durationInFrames: 20,
    });
    assert.equal(style.opacity, 0);
    assert.equal(style.visibility, 'hidden');
  });

  await t.test('at completion entrance is fully visible and settled', () => {
    const style = calculateAnimatedTextStyle({
      currentFrame: 30,
      fps: 30,
      startFrame: 10,
      durationInFrames: 20,
      variant: 'slide-up',
      distance: 50,
    });
    assert.equal(style.opacity, 1);
    assert.equal(style.visibility, 'visible');
    assert.equal(style.transform, 'translateY(0.00px)');
  });

  await t.test('zero duration entrance is instantly visible at startFrame', () => {
    const style = calculateAnimatedTextStyle({
      currentFrame: 10,
      fps: 30,
      startFrame: 10,
      durationInFrames: 0,
    });
    assert.equal(style.opacity, 1);
    assert.equal(style.visibility, 'visible');
  });

  await t.test('exit animation progresses and hides after completion', () => {
    // Entrance: 0..20, Exit: 40..50
    const midExit = calculateAnimatedTextStyle({
      currentFrame: 45,
      fps: 30,
      startFrame: 0,
      durationInFrames: 20,
      exitFrame: 40,
      exitDurationInFrames: 10,
    });
    assert.ok(midExit.opacity > 0 && midExit.opacity < 1);
    assert.equal(midExit.visibility, 'visible');

    const afterExit = calculateAnimatedTextStyle({
      currentFrame: 55,
      fps: 30,
      startFrame: 0,
      durationInFrames: 20,
      exitFrame: 40,
      exitDurationInFrames: 10,
    });
    assert.equal(afterExit.opacity, 0);
    assert.equal(afterExit.visibility, 'hidden');
  });
});

test('AnimatedText: All 10 Animation Variants', async (t) => {
  const common = {
    currentFrame: 10,
    fps: 30,
    startFrame: 0,
    durationInFrames: 20,
  };

  await t.test('variant: fade', () => {
    const style = calculateAnimatedTextStyle({ ...common, variant: 'fade' });
    assert.ok(style.opacity > 0 && style.opacity < 1);
    assert.equal(style.transform, undefined);
    assert.equal(style.filter, undefined);
  });

  await t.test('variant: slide-up', () => {
    const style = calculateAnimatedTextStyle({ ...common, variant: 'slide-up', distance: 40 });
    assert.ok(style.opacity > 0 && style.opacity < 1);
    assert.ok(style.transform?.startsWith('translateY('));
    // At mid-frame, Y should be between 40 and 0
    const yVal = parseFloat(style.transform!.replace('translateY(', '').replace('px)', ''));
    assert.ok(yVal > 0 && yVal < 40);
  });

  await t.test('variant: slide-down', () => {
    const style = calculateAnimatedTextStyle({ ...common, variant: 'slide-down', distance: 40 });
    const yVal = parseFloat(style.transform!.replace('translateY(', '').replace('px)', ''));
    // Enters from -40 towards 0
    assert.ok(yVal < 0 && yVal > -40);
  });

  await t.test('variant: slide-left', () => {
    const style = calculateAnimatedTextStyle({ ...common, variant: 'slide-left', distance: 40 });
    const xVal = parseFloat(style.transform!.replace('translateX(', '').replace('px)', ''));
    assert.ok(xVal > 0 && xVal < 40);
  });

  await t.test('variant: slide-right', () => {
    const style = calculateAnimatedTextStyle({ ...common, variant: 'slide-right', distance: 40 });
    const xVal = parseFloat(style.transform!.replace('translateX(', '').replace('px)', ''));
    assert.ok(xVal < 0 && xVal > -40);
  });

  await t.test('variant: scale', () => {
    const style = calculateAnimatedTextStyle({ ...common, variant: 'scale', initialScale: 0.5 });
    assert.ok(style.transform?.startsWith('scale('));
    const scale = parseFloat(style.transform!.replace('scale(', '').replace(')', ''));
    assert.ok(scale > 0.5 && scale < 1.0);
  });

  await t.test('variant: pop (spring)', () => {
    const style = calculateAnimatedTextStyle({ ...common, variant: 'pop', springPreset: 'bouncy' });
    assert.ok(style.transform?.startsWith('scale('));
    const scale = parseFloat(style.transform!.replace('scale(', '').replace(')', ''));
    assert.ok(scale > 0.7);
  });

  await t.test('variant: blur', () => {
    const style = calculateAnimatedTextStyle({ ...common, variant: 'blur', initialBlur: 20 });
    assert.ok(style.filter?.startsWith('blur('));
    const blur = parseFloat(style.filter!.replace('blur(', '').replace('px)', ''));
    assert.ok(blur > 0 && blur < 20);
  });

  await t.test('variant: rotate', () => {
    const style = calculateAnimatedTextStyle({ ...common, variant: 'rotate', initialRotation: -15 });
    assert.ok(style.transform?.startsWith('rotate('));
    const rot = parseFloat(style.transform!.replace('rotate(', '').replace('deg)', ''));
    assert.ok(rot < 0 && rot > -15);
  });

  await t.test('variant: fade-slide-up', () => {
    const style = calculateAnimatedTextStyle({ ...common, variant: 'fade-slide-up', distance: 30 });
    assert.ok(style.opacity > 0 && style.opacity < 1);
    assert.ok(style.transform?.startsWith('translateY('));
    const yVal = parseFloat(style.transform!.replace('translateY(', '').replace('px)', ''));
    assert.ok(yVal > 0 && yVal < 30);
  });
});

test('AnimatedText: Direction Control', async (t) => {
  await t.test('direction: in ignores exitFrame', () => {
    const style = calculateAnimatedTextStyle({
      currentFrame: 50,
      fps: 30,
      startFrame: 0,
      durationInFrames: 20,
      exitFrame: 40,
      exitDurationInFrames: 10,
      direction: 'in',
    });
    // With direction 'in', at frame 50 (past exit) it remains fully visible
    assert.equal(style.opacity, 1);
    assert.equal(style.visibility, 'visible');
  });

  await t.test('direction: out skips entrance delay and only handles exit', () => {
    const beforeExit = calculateAnimatedTextStyle({
      currentFrame: 20,
      fps: 30,
      exitFrame: 30,
      exitDurationInFrames: 10,
      direction: 'out',
    });
    assert.equal(beforeExit.opacity, 1);
    assert.equal(beforeExit.visibility, 'visible');

    const afterExit = calculateAnimatedTextStyle({
      currentFrame: 45,
      fps: 30,
      exitFrame: 30,
      exitDurationInFrames: 10,
      direction: 'out',
    });
    assert.equal(afterExit.opacity, 0);
    assert.equal(afterExit.visibility, 'hidden');
  });
});
