import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getNotificationTypeTheme,
  getNotificationPositionStyles,
  getNotificationVariantStyles,
  calculateNotificationMotion,
  calculateProgressBarWidth,
} from '../src/components/ui/animatedNotificationStyle.ts';
import type {
  AnimatedNotificationType,
  AnimatedNotificationVariant,
  AnimatedNotificationPosition,
  AnimatedNotificationEntrance,
  AnimatedNotificationExit,
} from '../src/components/ui/types.ts';

test('AnimatedNotification: Semantic Types & Themes', async (t) => {
  const types: AnimatedNotificationType[] = [
    'info',
    'success',
    'warning',
    'error',
    'message',
    'custom',
  ];

  for (const typ of types) {
    await t.test(`type "${typ}" resolves valid semantic theme`, () => {
      const theme = getNotificationTypeTheme(typ);
      assert.ok(theme.accentColor);
      assert.ok(theme.bgTint);
      assert.ok(theme.borderColor);
      assert.ok(theme.iconColor);
      assert.ok(theme.defaultIcon);
    });
  }

  await t.test('custom type respects user-provided accent color override', () => {
    const custom = getNotificationTypeTheme('custom', '#FF0055');
    assert.equal(custom.accentColor, '#FF0055');
    assert.equal(custom.iconColor, '#FF0055');
  });
});

test('AnimatedNotification: Position Coordinates', async (t) => {
  const positions: AnimatedNotificationPosition[] = [
    'top',
    'top-left',
    'top-right',
    'center',
    'bottom',
    'bottom-left',
    'bottom-right',
  ];

  for (const pos of positions) {
    await t.test(`position "${pos}" resolves valid coordinates`, () => {
      const style = getNotificationPositionStyles(pos);
      assert.ok(style.top !== undefined || style.bottom !== undefined);
      assert.ok(style.left !== undefined || style.right !== undefined);
    });
  }

  await t.test('top and bottom positions apply horizontal centering translation', () => {
    const topStyle = getNotificationPositionStyles('top');
    const bottomStyle = getNotificationPositionStyles('bottom');
    assert.equal(topStyle.transform, 'translateX(-50%)');
    assert.equal(bottomStyle.transform, 'translateX(-50%)');
  });

  await t.test('center position applies 2D centering translation', () => {
    const centerStyle = getNotificationPositionStyles('center');
    assert.equal(centerStyle.transform, 'translate(-50%, -50%)');
  });
});

test('AnimatedNotification: Visual Variants Layout', async (t) => {
  const variants: AnimatedNotificationVariant[] = [
    'toast',
    'banner',
    'floating',
    'compact',
    'card',
  ];
  const theme = getNotificationTypeTheme('info');

  for (const v of variants) {
    await t.test(`variant "${v}" resolves valid layout metrics`, () => {
      const layout = getNotificationVariantStyles(v, theme);
      assert.ok(layout.padding);
      assert.ok(layout.boxShadow);
      assert.ok(layout.fontSize > 0);
      assert.ok(layout.iconSize > 0);
    });
  }

  await t.test('banner variant applies left accent border rule', () => {
    const layout = getNotificationVariantStyles('banner', theme);
    assert.ok(layout.borderLeft?.includes('solid'));
    assert.equal(layout.maxWidth, '100%');
  });

  await t.test('toast variant uses full pill border radius', () => {
    const layout = getNotificationVariantStyles('toast', theme);
    assert.equal(layout.borderRadius, 9999);
  });
});

test('AnimatedNotification: Entrance & Exit Motion Transforms', async (t) => {
  const entrances: AnimatedNotificationEntrance[] = [
    'fade-in',
    'slide-down',
    'slide-up',
    'slide-left',
    'slide-right',
    'scale-in',
    'pop-in',
    'expand',
  ];

  for (const ent of entrances) {
    await t.test(`entrance "${ent}" calculates active motion styles`, () => {
      const motion = calculateNotificationMotion({
        currentFrame: 10,
        startFrame: 0,
        durationInFrames: 12,
        entranceVariant: ent,
      });
      assert.ok(motion.opacity > 0);
      assert.equal(motion.visibility, 'visible');

      if (ent !== 'fade-in') {
        assert.ok(motion.transform !== undefined);
      }
    });
  }

  const exits: AnimatedNotificationExit[] = [
    'fade-out',
    'slide-out',
    'scale-out',
    'collapse',
  ];

  for (const ex of exits) {
    await t.test(`exit "${ex}" hides notification after exit duration completes`, () => {
      const motion = calculateNotificationMotion({
        currentFrame: 50,
        startFrame: 0,
        durationInFrames: 10,
        exitFrame: 30,
        exitDurationInFrames: 10,
        exitVariant: ex,
      });
      assert.equal(motion.opacity, 0);
      assert.equal(motion.visibility, 'hidden');
    });
  }

  await t.test('hidden before startFrame', () => {
    const motion = calculateNotificationMotion({
      currentFrame: 5,
      startFrame: 10,
    });
    assert.equal(motion.opacity, 0);
    assert.equal(motion.visibility, 'hidden');
  });

  await t.test('error notification applies subtle shake vibration during settle', () => {
    const motion = calculateNotificationMotion({
      currentFrame: 12,
      startFrame: 0,
      durationInFrames: 12,
      type: 'error',
    });
    assert.ok(motion.transform?.includes('translateX('));
  });
});

test('AnimatedNotification: Linear Progress Synchronization', async (t) => {
  await t.test('progress is 0 before startFrame', () => {
    const p = calculateProgressBarWidth(2, 5, 40);
    assert.equal(p, 0);
  });

  await t.test('progress is 0% at startFrame', () => {
    const p = calculateProgressBarWidth(10, 10, 40);
    assert.equal(p, 0);
  });

  await t.test('progress is 50% halfway through duration', () => {
    const p = calculateProgressBarWidth(30, 10, 40);
    assert.equal(p, 50);
  });

  await t.test('progress is 100% at end of duration and clamps', () => {
    const p = calculateProgressBarWidth(55, 10, 40);
    assert.equal(p, 100);
  });
});

test('AnimatedNotification: Sequential Sequencing & Framerates', async (t) => {
  await t.test('supports multiple sequential notifications via staggered start frames', () => {
    const n1 = calculateNotificationMotion({ currentFrame: 15, startFrame: 0, exitFrame: 30 });
    const n2 = calculateNotificationMotion({ currentFrame: 15, startFrame: 35, exitFrame: 65 });

    assert.equal(n1.visibility, 'visible');
    assert.equal(n2.visibility, 'hidden');
  });

  await t.test('motion calculates consistently across 24, 30, and 60 fps', () => {
    const m24 = calculateNotificationMotion({ currentFrame: 12, startFrame: 0, durationInFrames: 24, fps: 24, entranceVariant: 'pop-in' });
    const m30 = calculateNotificationMotion({ currentFrame: 15, startFrame: 0, durationInFrames: 30, fps: 30, entranceVariant: 'pop-in' });
    const m60 = calculateNotificationMotion({ currentFrame: 30, startFrame: 0, durationInFrames: 60, fps: 60, entranceVariant: 'pop-in' });

    assert.ok(m24.opacity > 0);
    assert.ok(m30.opacity > 0);
    assert.ok(m60.opacity > 0);
  });
});
