import test from 'node:test';
import assert from 'node:assert/strict';

import {
  deriveAnimatedButtonState,
  getButtonSizeMetrics,
  calculateButtonVisualStyles,
  calculatePressScale,
  calculateButtonMotion,
  calculateSpinnerAngle,
  calculateButtonShake,
} from '../src/components/ui/animatedButtonStyle.ts';
import type {
  AnimatedButtonVariant,
  AnimatedButtonSize,
  AnimatedButtonState,
} from '../src/components/ui/types.ts';

test('AnimatedButton: Interaction State Transitions & Milestones', async (t) => {
  await t.test('returns idle before pressFrame', () => {
    const state = deriveAnimatedButtonState({
      currentFrame: 5,
      pressFrame: 10,
    });
    assert.equal(state, 'idle');
  });

  await t.test('transitions to pressed state at pressFrame', () => {
    const state = deriveAnimatedButtonState({
      currentFrame: 12,
      pressFrame: 10,
      releaseFrame: 20,
    });
    assert.equal(state, 'pressed');
  });

  await t.test('transitions to released state at releaseFrame', () => {
    const state = deriveAnimatedButtonState({
      currentFrame: 22,
      pressFrame: 10,
      releaseFrame: 20,
    });
    assert.equal(state, 'released');
  });

  await t.test('transitions to loading state at loadingStartFrame', () => {
    const state = deriveAnimatedButtonState({
      currentFrame: 28,
      pressFrame: 10,
      releaseFrame: 20,
      loadingStartFrame: 25,
    });
    assert.equal(state, 'loading');
  });

  await t.test('transitions to success state at successFrame', () => {
    const state = deriveAnimatedButtonState({
      currentFrame: 45,
      loadingStartFrame: 20,
      successFrame: 40,
    });
    assert.equal(state, 'success');
  });

  await t.test('transitions to error state at errorFrame', () => {
    const state = deriveAnimatedButtonState({
      currentFrame: 50,
      errorFrame: 48,
    });
    assert.equal(state, 'error');
  });

  await t.test('explicitState parameter strictly overrides dynamic timeline', () => {
    for (const explicit of ['disabled', 'loading', 'success', 'error', 'pressed', 'idle'] as AnimatedButtonState[]) {
      const state = deriveAnimatedButtonState({
        currentFrame: 100,
        explicitState: explicit,
      });
      assert.equal(state, explicit);
    }
  });
});

test('AnimatedButton: Size Metrics & Proportions', async (t) => {
  const sizes: AnimatedButtonSize[] = ['small', 'medium', 'large', 'sm', 'md', 'lg'];

  for (const size of sizes) {
    await t.test(`size "${size}" resolves valid proportional metrics`, () => {
      const metrics = getButtonSizeMetrics(size);
      assert.ok(metrics.height >= 32 && metrics.height <= 60);
      assert.ok(metrics.fontSize >= 11 && metrics.fontSize <= 18);
      assert.ok(metrics.paddingX >= 12 && metrics.paddingX <= 30);
      assert.ok(metrics.paddingY >= 4 && metrics.paddingY <= 16);
      assert.ok(metrics.iconSize >= 12 && metrics.iconSize <= 24);
    });
  }

  await t.test('metrics scale monotonically: sm < md < lg', () => {
    const sm = getButtonSizeMetrics('sm');
    const md = getButtonSizeMetrics('md');
    const lg = getButtonSizeMetrics('lg');

    assert.ok(sm.height < md.height && md.height < lg.height);
    assert.ok(sm.fontSize < md.fontSize && md.fontSize < lg.fontSize);
  });
});

test('AnimatedButton: Visual Variants & Styling Options', async (t) => {
  const variants: AnimatedButtonVariant[] = [
    'primary',
    'secondary',
    'outline',
    'ghost',
    'text',
    'icon-only',
  ];

  for (const variant of variants) {
    await t.test(`variant "${variant}" calculates valid container styles in idle state`, () => {
      const styles = calculateButtonVisualStyles({
        state: 'idle',
        variant,
        size: 'medium',
      });
      assert.ok(styles.containerStyle.display?.includes('inline-flex'));
      assert.ok(styles.containerStyle.height !== undefined);
      assert.equal(styles.isClickable, true);
    });
  }

  await t.test('icon-only mode sets width equal to height for square/circular proportions', () => {
    const styles = calculateButtonVisualStyles({
      state: 'idle',
      variant: 'icon-only',
      size: 'medium',
    });
    assert.equal(styles.containerStyle.width, styles.containerStyle.height);
    assert.equal(styles.containerStyle.padding, 0);
  });

  await t.test('success state applies emerald background and white text', () => {
    const styles = calculateButtonVisualStyles({
      state: 'success',
      variant: 'primary',
      size: 'medium',
    });
    assert.equal(styles.textColor, '#FFFFFF');
    assert.ok(styles.containerStyle.backgroundColor !== undefined);
  });

  await t.test('error state applies crimson background and white text', () => {
    const styles = calculateButtonVisualStyles({
      state: 'error',
      variant: 'primary',
      size: 'medium',
    });
    assert.equal(styles.textColor, '#FFFFFF');
    assert.ok(styles.containerStyle.backgroundColor !== undefined);
  });

  await t.test('disabled state sets not-allowed cursor and reduces opacity', () => {
    const styles = calculateButtonVisualStyles({
      state: 'disabled',
      variant: 'primary',
      size: 'medium',
    });
    assert.equal(styles.containerStyle.cursor, 'not-allowed');
    assert.equal(styles.containerStyle.opacity, 0.45);
    assert.equal(styles.isClickable, false);
  });

  await t.test('loading state sets wait cursor', () => {
    const styles = calculateButtonVisualStyles({
      state: 'loading',
      variant: 'primary',
      size: 'medium',
    });
    assert.equal(styles.containerStyle.cursor, 'wait');
    assert.equal(styles.isClickable, false);
  });
});

test('AnimatedButton: Press & Release Physics Compression', async (t) => {
  await t.test('scale is 1.0 before pressFrame', () => {
    const scale = calculatePressScale({
      currentFrame: 5,
      pressFrame: 10,
    });
    assert.equal(scale, 1.0);
  });

  await t.test('compresses to scaleOnPress while pressed', () => {
    const scale = calculatePressScale({
      currentFrame: 14,
      pressFrame: 10,
      releaseFrame: 25,
      scaleOnPress: 0.94,
    });
    assert.equal(scale, 0.94);
  });

  await t.test('spring settles back toward 1.0 after releaseFrame', () => {
    const initialRelease = calculatePressScale({
      currentFrame: 25,
      pressFrame: 10,
      releaseFrame: 25,
      scaleOnPress: 0.94,
      fps: 30,
    });
    assert.equal(initialRelease, 0.94);

    const settled = calculatePressScale({
      currentFrame: 45,
      pressFrame: 10,
      releaseFrame: 25,
      scaleOnPress: 0.94,
      fps: 30,
    });
    assert.ok(Math.abs(settled - 1.0) < 0.05);
  });
});

test('AnimatedButton: Entrance & Exit Transitions', async (t) => {
  await t.test('hidden before startFrame', () => {
    const motion = calculateButtonMotion({
      currentFrame: 3,
      startFrame: 10,
      entrance: 'scale-in',
    });
    assert.equal(motion.opacity, 0);
    assert.equal(motion.visibility, 'hidden');
  });

  await t.test('active and visible after startFrame', () => {
    const motion = calculateButtonMotion({
      currentFrame: 20,
      startFrame: 10,
      entrance: 'slide-up',
    });
    assert.equal(motion.visibility, 'visible');
    assert.ok(motion.opacity > 0);
  });

  await t.test('exit animation hides button after completion', () => {
    const postExit = calculateButtonMotion({
      currentFrame: 55,
      startFrame: 0,
      exitFrame: 40,
      exitDurationInFrames: 10,
      exit: 'fade-out',
    });
    assert.equal(postExit.opacity, 0);
    assert.equal(postExit.visibility, 'hidden');
  });
});

test('AnimatedButton: Spinner Rotation & Error Shake', async (t) => {
  await t.test('spinner angle increments deterministically modulo 360', () => {
    const a0 = calculateSpinnerAngle(0, 12);
    const a10 = calculateSpinnerAngle(10, 12);
    const a30 = calculateSpinnerAngle(30, 12);
    assert.equal(a0, 0);
    assert.equal(a10, 120);
    assert.equal(a30, 0); // 360 % 360
  });

  await t.test('error shake produces horizontal displacement only during shake window', () => {
    assert.equal(calculateButtonShake(10, 20), 0);
    const active = calculateButtonShake(24, 20);
    assert.notEqual(active, 0);
    assert.equal(calculateButtonShake(40, 20), 0);
  });
});
