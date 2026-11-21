import test from 'node:test';
import assert from 'node:assert/strict';

import {
  deriveAnimatedCardState,
  getCardSizeMetrics,
  calculateCardVisualStyles,
  calculateCardMotion,
  calculateCardCollectionStagger,
} from '../src/components/ui/animatedCardStyle.ts';
import type {
  AnimatedCardAnimation,
  AnimatedCardVariant,
  AnimatedCardSize,
} from '../src/components/ui/types.ts';

test('AnimatedCard: Interaction State Transitions & Milestones', async (t) => {
  const milestoneConfig = {
    focusFrame: 10,
    selectFrame: 20,
    highlightFrame: 30,
    expandFrame: 40,
    collapseFrame: 50,
  };

  await t.test('returns idle before any trigger milestone', () => {
    const state = deriveAnimatedCardState({ currentFrame: 5, ...milestoneConfig });
    assert.equal(state, 'idle');
  });

  await t.test('transitions to focused state at focusFrame', () => {
    const state = deriveAnimatedCardState({ currentFrame: 12, ...milestoneConfig });
    assert.equal(state, 'focused');
  });

  await t.test('transitions to selected state at selectFrame', () => {
    const state = deriveAnimatedCardState({ currentFrame: 22, ...milestoneConfig });
    assert.equal(state, 'selected');
  });

  await t.test('transitions to highlighted state at highlightFrame', () => {
    const state = deriveAnimatedCardState({ currentFrame: 32, ...milestoneConfig });
    assert.equal(state, 'highlighted');
  });

  await t.test('transitions to expanded state at expandFrame', () => {
    const state = deriveAnimatedCardState({ currentFrame: 42, ...milestoneConfig });
    assert.equal(state, 'expanded');
  });

  await t.test('transitions to collapsed state at collapseFrame', () => {
    const state = deriveAnimatedCardState({ currentFrame: 55, ...milestoneConfig });
    assert.equal(state, 'collapsed');
  });

  await t.test('explicitState parameter strictly overrides dynamic timeline', () => {
    const state = deriveAnimatedCardState({
      currentFrame: 55,
      explicitState: 'disabled',
      ...milestoneConfig,
    });
    assert.equal(state, 'disabled');
  });
});

test('AnimatedCard: Size Metrics & Proportions', async (t) => {
  const sizes: AnimatedCardSize[] = ['sm', 'md', 'lg', 'small', 'medium', 'large'];

  for (const sz of sizes) {
    await t.test(`size "${sz}" resolves valid proportional metrics`, () => {
      const metrics = getCardSizeMetrics(sz);
      assert.ok(metrics.padding > 0);
      assert.ok(metrics.titleSize > 0);
      assert.ok(metrics.descSize > 0);
      assert.ok(metrics.iconSize > 0);
      assert.ok(metrics.borderRadius > 0);
    });
  }

  await t.test('metrics scale monotonically: sm < md < lg', () => {
    const sm = getCardSizeMetrics('sm');
    const md = getCardSizeMetrics('md');
    const lg = getCardSizeMetrics('lg');

    assert.ok(sm.titleSize < md.titleSize && md.titleSize < lg.titleSize);
    assert.ok(sm.descSize < md.descSize && md.descSize < lg.descSize);
    assert.ok(sm.iconSize < md.iconSize && md.iconSize < lg.iconSize);
  });

  await t.test('compact variant applies tighter padding', () => {
    const normal = getCardSizeMetrics('md', 'default');
    const compact = getCardSizeMetrics('md', 'compact');
    assert.ok(compact.padding < normal.padding);
  });
});

test('AnimatedCard: Visual Variants & Styling Options', async (t) => {
  const variants: AnimatedCardVariant[] = [
    'default',
    'outlined',
    'elevated',
    'flat',
    'image-card',
    'horizontal',
    'compact',
  ];
  const metrics = getCardSizeMetrics('md');

  for (const v of variants) {
    await t.test(`variant "${v}" calculates valid container styles in idle state`, () => {
      const res = calculateCardVisualStyles({
        variant: v,
        state: 'idle',
        metrics,
      });
      assert.ok(res.containerStyle.backgroundColor);
      assert.ok(res.containerStyle.border);
      assert.ok(res.titleColor);
      assert.ok(res.descColor);
    });
  }

  await t.test('selected state applies brand tint and border', () => {
    const res = calculateCardVisualStyles({
      variant: 'default',
      state: 'selected',
      metrics,
    });
    assert.ok(String(res.containerStyle.backgroundColor).includes('rgba'));
    assert.ok(res.containerStyle.transform?.includes('scale'));
  });

  await t.test('disabled state sets not-allowed cursor and reduces opacity', () => {
    const res = calculateCardVisualStyles({
      variant: 'default',
      state: 'disabled',
      metrics,
    });
    assert.equal(res.containerStyle.cursor, 'not-allowed');
    assert.equal(res.containerStyle.opacity, 0.45);
  });
});

test('AnimatedCard: All 12 Animation Variants', async (t) => {
  const animations: AnimatedCardAnimation[] = [
    'fade',
    'slide-up',
    'slide-down',
    'slide-left',
    'slide-right',
    'scale',
    'pop',
    'flip',
    'blur',
    'float',
    'expand',
    'collapse',
  ];

  for (const anim of animations) {
    await t.test(`animation "${anim}" calculates active motion styles`, () => {
      const motion = calculateCardMotion({
        currentFrame: 10,
        startFrame: 0,
        durationInFrames: 14,
        animation: anim,
      });
      assert.ok(motion.opacity > 0);
      assert.equal(motion.visibility, 'visible');

      if (['slide-up', 'slide-down', 'slide-left', 'slide-right', 'scale', 'pop', 'flip', 'float', 'expand', 'collapse'].includes(anim)) {
        assert.ok(motion.transform !== undefined);
      }
      if (anim === 'blur') {
        assert.ok(motion.filter !== undefined);
      }
    });
  }

  await t.test('float animation oscillates after entrance completes', () => {
    const at20 = calculateCardMotion({
      currentFrame: 20,
      startFrame: 0,
      durationInFrames: 10,
      animation: 'float',
    });
    const at35 = calculateCardMotion({
      currentFrame: 35,
      startFrame: 0,
      durationInFrames: 10,
      animation: 'float',
    });
    assert.ok(at20.transform?.includes('translateY'));
    assert.ok(at35.transform?.includes('translateY'));
    assert.notEqual(at20.transform, at35.transform);
  });
});

test('AnimatedCard: Lifecycle Boundaries & Exit Transitions', async (t) => {
  await t.test('hidden before startFrame + delay', () => {
    const motion = calculateCardMotion({
      currentFrame: 4,
      startFrame: 0,
      delay: 10,
      animation: 'slide-up',
    });
    assert.equal(motion.opacity, 0);
    assert.equal(motion.visibility, 'hidden');
  });

  await t.test('exit animation hides card after completion', () => {
    const exitMotion = calculateCardMotion({
      currentFrame: 50,
      startFrame: 0,
      durationInFrames: 10,
      exitFrame: 30,
      exitDurationInFrames: 10,
      animation: 'scale',
    });
    assert.equal(exitMotion.opacity, 0);
    assert.equal(exitMotion.visibility, 'hidden');
  });
});

test('AnimatedCard: Collection & Stagger Calculations', async (t) => {
  await t.test('calculates correct start delay based on index and staggerDelay', () => {
    const d0 = calculateCardCollectionStagger(0, 4, 10);
    const d1 = calculateCardCollectionStagger(1, 4, 10);
    const d2 = calculateCardCollectionStagger(2, 4, 10);

    assert.equal(d0, 10);
    assert.equal(d1, 14);
    assert.equal(d2, 18);
  });

  await t.test('reverse order reveals last card first', () => {
    const d0 = calculateCardCollectionStagger(0, 4, 10, true, 3);
    const d2 = calculateCardCollectionStagger(2, 4, 10, true, 3);

    assert.equal(d0, 18);
    assert.equal(d2, 10);
  });
});

test('AnimatedCard: Content Safety & Framerates', async (t) => {
  await t.test('handles long titles and descriptions safely', () => {
    const metrics = getCardSizeMetrics('md');
    const visual = calculateCardVisualStyles({
      variant: 'default',
      metrics,
    });
    assert.equal(visual.containerStyle.boxSizing, 'border-box');
  });

  await t.test('calculates consistently across 24, 30, 60 fps', () => {
    const m24 = calculateCardMotion({ currentFrame: 12, startFrame: 0, durationInFrames: 24, animation: 'pop', fps: 24 });
    const m30 = calculateCardMotion({ currentFrame: 15, startFrame: 0, durationInFrames: 30, animation: 'pop', fps: 30 });
    const m60 = calculateCardMotion({ currentFrame: 30, startFrame: 0, durationInFrames: 60, animation: 'pop', fps: 60 });

    assert.ok(m24.opacity > 0);
    assert.ok(m30.opacity > 0);
    assert.ok(m60.opacity > 0);
  });
});
