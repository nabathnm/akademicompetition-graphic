import test from 'node:test';
import assert from 'node:assert/strict';

import {
  deriveAnimatedInputState,
  getInputSizeMetrics,
  calculateInputVisualStyles,
  calculateInputEntrance,
  isCursorVisible,
  calculateErrorShake,
} from '../src/components/ui/animatedInputStyle.ts';
import type {
  AnimatedInputVariant,
  AnimatedInputSize,
  AnimatedInputState,
} from '../src/components/ui/types.ts';

test('AnimatedInput: Interaction State Transitions & Milestones', async (t) => {
  await t.test('returns idle state before focusFrame', () => {
    const state = deriveAnimatedInputState({
      currentFrame: 5,
      startFrame: 0,
      focusFrame: 10,
      typingStartFrame: 20,
    });
    assert.equal(state, 'idle');
  });

  await t.test('transitions to focus state at focusFrame', () => {
    const state = deriveAnimatedInputState({
      currentFrame: 12,
      startFrame: 0,
      focusFrame: 10,
      typingStartFrame: 20,
    });
    assert.equal(state, 'focus');
  });

  await t.test('transitions to typing state when isTyping is true', () => {
    const state = deriveAnimatedInputState({
      currentFrame: 22,
      startFrame: 0,
      focusFrame: 10,
      typingStartFrame: 20,
      isTyping: true,
    });
    assert.equal(state, 'typing');
  });

  await t.test('transitions to filled state when typing is complete and hasContent', () => {
    const state = deriveAnimatedInputState({
      currentFrame: 35,
      startFrame: 0,
      focusFrame: 10,
      typingStartFrame: 20,
      isTyping: false,
      isComplete: true,
      hasContent: true,
    });
    assert.equal(state, 'filled');
  });

  await t.test('transitions to submitted state at submittedFrame', () => {
    const state = deriveAnimatedInputState({
      currentFrame: 45,
      startFrame: 0,
      focusFrame: 10,
      typingStartFrame: 20,
      isComplete: true,
      hasContent: true,
      submittedFrame: 40,
    });
    assert.equal(state, 'submitted');
  });

  await t.test('transitions to error state at errorFrame', () => {
    const state = deriveAnimatedInputState({
      currentFrame: 50,
      startFrame: 0,
      focusFrame: 10,
      errorFrame: 45,
    });
    assert.equal(state, 'error');
  });

  await t.test('explicitState parameter strictly overrides dynamic timeline', () => {
    for (const explicit of ['disabled', 'error', 'submitted', 'focus', 'idle'] as AnimatedInputState[]) {
      const state = deriveAnimatedInputState({
        currentFrame: 100,
        explicitState: explicit,
      });
      assert.equal(state, explicit);
    }
  });
});

test('AnimatedInput: Size Metrics & Proportions', async (t) => {
  const sizes: AnimatedInputSize[] = ['sm', 'md', 'lg'];

  for (const size of sizes) {
    await t.test(`size "${size}" produces proportional layout metrics`, () => {
      const metrics = getInputSizeMetrics(size);
      assert.ok(metrics.height > 30 && metrics.height < 65);
      assert.ok(metrics.fontSize >= 12 && metrics.fontSize <= 20);
      assert.ok(metrics.paddingX >= 10 && metrics.paddingX <= 25);
      assert.ok(metrics.paddingY >= 4 && metrics.paddingY <= 18);
      assert.ok(metrics.iconSize >= 14 && metrics.iconSize <= 24);
    });
  }

  await t.test('metrics scale monotonically: sm < md < lg', () => {
    const sm = getInputSizeMetrics('sm');
    const md = getInputSizeMetrics('md');
    const lg = getInputSizeMetrics('lg');

    assert.ok(sm.height < md.height && md.height < lg.height);
    assert.ok(sm.fontSize < md.fontSize && md.fontSize < lg.fontSize);
  });
});

test('AnimatedInput: Visual Variants & Styling Options', async (t) => {
  const variants: AnimatedInputVariant[] = ['outlined', 'filled', 'minimal', 'underline', 'rounded'];

  for (const variant of variants) {
    await t.test(`variant "${variant}" calculates valid container styles in focus state`, () => {
      const style = calculateInputVisualStyles({
        state: 'focus',
        variant,
        size: 'md',
        focusColor: '#00D1FF',
      });

      assert.equal(style.isFocused, true);
      assert.equal(style.borderColor, '#00D1FF');

      if (variant === 'underline') {
        assert.equal(style.containerStyle.border, undefined);
        assert.ok(String(style.containerStyle.borderBottom).includes('#00D1FF'));
      } else if (variant === 'rounded') {
        assert.equal(style.containerStyle.borderRadius, 9999);
      } else {
        assert.ok(style.containerStyle.border !== undefined);
      }
    });
  }

  await t.test('error state applies errorColor to border and glow ring', () => {
    const style = calculateInputVisualStyles({
      state: 'error',
      variant: 'outlined',
      size: 'md',
      errorColor: '#EF4444',
    });
    assert.equal(style.borderColor, '#EF4444');
    assert.ok(style.ringColor?.startsWith('#EF4444'));
  });

  await t.test('submitted state applies successColor to border and glow ring', () => {
    const style = calculateInputVisualStyles({
      state: 'submitted',
      variant: 'outlined',
      size: 'md',
      successColor: '#10B981',
    });
    assert.equal(style.borderColor, '#10B981');
    assert.ok(style.ringColor?.startsWith('#10B981'));
  });

  await t.test('disabled state reduces opacity and disables pointer cursor', () => {
    const style = calculateInputVisualStyles({
      state: 'disabled',
      variant: 'outlined',
      size: 'md',
    });
    assert.equal(style.containerStyle.opacity, 0.45);
    assert.equal(style.containerStyle.cursor, 'not-allowed');
  });
});

test('AnimatedInput: Entrance Animations & Lifecycle', async (t) => {
  await t.test('hidden before startFrame', () => {
    const entrance = calculateInputEntrance({
      currentFrame: 4,
      startFrame: 10,
      duration: 14,
      entrance: 'slide-up',
    });
    assert.equal(entrance.opacity, 0);
    assert.equal(entrance.visibility, 'hidden');
  });

  await t.test('slide-up entrance applies translateY translation during transition', () => {
    const entrance = calculateInputEntrance({
      currentFrame: 15,
      startFrame: 10,
      duration: 10,
      entrance: 'slide-up',
    });
    assert.equal(entrance.visibility, 'visible');
    assert.ok(entrance.opacity > 0 && entrance.opacity < 1);
    assert.ok(entrance.transform?.includes('translateY('));
  });

  await t.test('scale-in entrance applies scale transformation', () => {
    const entrance = calculateInputEntrance({
      currentFrame: 15,
      startFrame: 10,
      duration: 10,
      entrance: 'scale-in',
    });
    assert.ok(entrance.transform?.includes('scale('));
  });

  await t.test('entrance none is immediately visible at full opacity', () => {
    const entrance = calculateInputEntrance({
      currentFrame: 0,
      entrance: 'none',
    });
    assert.equal(entrance.opacity, 1);
    assert.equal(entrance.visibility, 'visible');
  });
});

test('AnimatedInput: Cursor Blinking & Error Shake', async (t) => {
  await t.test('cursor alternates visibility every half-cycle', () => {
    const interval = 16;
    // Frame 0..7: visible (floor(0/8) = 0 % 2 = 0)
    assert.equal(isCursorVisible(0, interval), true);
    assert.equal(isCursorVisible(7, interval), true);
    // Frame 8..15: hidden (floor(8/8) = 1 % 2 = 1)
    assert.equal(isCursorVisible(8, interval), false);
    assert.equal(isCursorVisible(15, interval), false);
    // Frame 16: visible again
    assert.equal(isCursorVisible(16, interval), true);
  });

  await t.test('error shake calculates decaying vibration only within window', () => {
    // Before errorFrame: 0
    assert.equal(calculateErrorShake(20, 25), 0);
    // During error window (frame 25..38): non-zero displacement
    const activeShake = calculateErrorShake(28, 25);
    assert.ok(typeof activeShake === 'number');
    assert.notEqual(activeShake, 0);
    // After shake duration (elapsed >= 14): returns to 0
    assert.equal(calculateErrorShake(45, 25), 0);
  });
});
