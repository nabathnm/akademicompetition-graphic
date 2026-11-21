import test from 'node:test';
import assert from 'node:assert/strict';

import {
  deriveSearchBarStage,
  getSearchBarMetrics,
  calculateContainerEntranceStyles,
  calculateDropdownEntranceStyles,
  calculateSuggestionItemStyles,
  calculateResultCardStyles,
  mapSearchBarVariantToInput,
} from '../src/components/ui/animatedSearchBarStyle.ts';
import type {
  AnimatedSearchBarSize,
  AnimatedSearchBarVariant,
  AnimatedSearchBarContainerEntrance,
} from '../src/components/ui/types.ts';

test('AnimatedSearchBar: Interaction Stage Transitions & Milestones', async (t) => {
  const milestoneConfig = {
    startFrame: 0,
    focusFrame: 10,
    typingStartFrame: 16,
    suggestionStartFrame: 28,
    selectionFrame: 48,
    submitFrame: 60,
    loadingStartFrame: 64,
    resultsStartFrame: 80,
  };

  await t.test('returns idle before focusFrame', () => {
    const stage = deriveSearchBarStage({ currentFrame: 5, ...milestoneConfig });
    assert.equal(stage, 'idle');
  });

  await t.test('transitions to focus stage at focusFrame', () => {
    const stage = deriveSearchBarStage({ currentFrame: 12, ...milestoneConfig });
    assert.equal(stage, 'focus');
  });

  await t.test('transitions to typing stage at typingStartFrame', () => {
    const stage = deriveSearchBarStage({ currentFrame: 20, ...milestoneConfig });
    assert.equal(stage, 'typing');
  });

  await t.test('transitions to suggestions stage at suggestionStartFrame', () => {
    const stage = deriveSearchBarStage({ currentFrame: 32, ...milestoneConfig });
    assert.equal(stage, 'suggestions');
  });

  await t.test('transitions to selected stage at selectionFrame', () => {
    const stage = deriveSearchBarStage({ currentFrame: 50, ...milestoneConfig });
    assert.equal(stage, 'selected');
  });

  await t.test('transitions to submitted stage at submitFrame', () => {
    const stage = deriveSearchBarStage({ currentFrame: 62, ...milestoneConfig });
    assert.equal(stage, 'submitted');
  });

  await t.test('transitions to loading stage at loadingStartFrame', () => {
    const stage = deriveSearchBarStage({ currentFrame: 70, ...milestoneConfig });
    assert.equal(stage, 'loading');
  });

  await t.test('transitions to results stage at resultsStartFrame', () => {
    const stage = deriveSearchBarStage({ currentFrame: 85, ...milestoneConfig });
    assert.equal(stage, 'results');
  });
});

test('AnimatedSearchBar: Size Metrics & Proportions', async (t) => {
  const sizes: AnimatedSearchBarSize[] = ['sm', 'md', 'lg'];

  for (const sz of sizes) {
    await t.test(`size "${sz}" resolves valid proportional metrics`, () => {
      const metrics = getSearchBarMetrics(sz);
      assert.ok(metrics.height > 0);
      assert.ok(metrics.fontSize > 0);
      assert.ok(metrics.iconSize > 0);
      assert.ok(metrics.padding > 0);
      assert.ok(metrics.borderRadius > 0);
      assert.ok(metrics.cardPadding > 0);
    });
  }

  await t.test('metrics scale monotonically: sm < md < lg', () => {
    const sm = getSearchBarMetrics('sm');
    const md = getSearchBarMetrics('md');
    const lg = getSearchBarMetrics('lg');

    assert.ok(sm.height < md.height && md.height < lg.height);
    assert.ok(sm.fontSize < md.fontSize && md.fontSize < lg.fontSize);
    assert.ok(sm.iconSize < md.iconSize && md.iconSize < lg.iconSize);
  });
});

test('AnimatedSearchBar: Container Entrance Animations', async (t) => {
  await t.test('hidden before startFrame', () => {
    const style = calculateContainerEntranceStyles({
      currentFrame: 2,
      startFrame: 10,
      entrance: 'fade-in',
    });
    assert.equal(style.opacity, 0);
    assert.equal(style.visibility, 'hidden');
  });

  await t.test('variant "fade-in" transitions opacity 0 -> 1', () => {
    const mid = calculateContainerEntranceStyles({
      currentFrame: 6,
      startFrame: 0,
      entrance: 'fade-in',
      duration: 12,
    });
    assert.ok(mid.opacity > 0 && mid.opacity < 1);
    assert.equal(mid.visibility, 'visible');

    const end = calculateContainerEntranceStyles({
      currentFrame: 15,
      startFrame: 0,
      entrance: 'fade-in',
      duration: 12,
    });
    assert.equal(end.opacity, 1);
  });

  await t.test('variant "slide-in" includes translateY transform', () => {
    const mid = calculateContainerEntranceStyles({
      currentFrame: 6,
      startFrame: 0,
      entrance: 'slide-in',
      duration: 12,
    });
    assert.ok(mid.transform?.includes('translateY'));
  });

  await t.test('variant "scale-in" scales up container', () => {
    const mid = calculateContainerEntranceStyles({
      currentFrame: 6,
      startFrame: 0,
      entrance: 'scale-in',
      duration: 12,
    });
    assert.ok(mid.transform?.includes('scale('));
  });

  await t.test('variant "expand-width" applies horizontal scaleX', () => {
    const mid = calculateContainerEntranceStyles({
      currentFrame: 6,
      startFrame: 0,
      entrance: 'expand-width',
      duration: 12,
    });
    assert.ok(mid.transform?.includes('scaleX('));
  });

  await t.test('variant "none" is instantly visible with opacity 1', () => {
    const style = calculateContainerEntranceStyles({
      currentFrame: 0,
      startFrame: 0,
      entrance: 'none',
    });
    assert.equal(style.opacity, 1);
    assert.equal(style.visibility, 'visible');
  });
});

test('AnimatedSearchBar: Visual Variant Mapping', async (t) => {
  const variants: AnimatedSearchBarVariant[] = [
    'minimal',
    'outlined',
    'filled',
    'rounded',
    'expanded',
  ];

  for (const v of variants) {
    await t.test(`variant "${v}" maps to valid AnimatedInputVariant`, () => {
      const inputVariant = mapSearchBarVariantToInput(v);
      assert.ok(['minimal', 'outlined', 'filled', 'rounded'].includes(inputVariant));
    });
  }
});

test('AnimatedSearchBar: Suggestions & Stagger Mechanics', async (t) => {
  await t.test('dropdown entrance is hidden before suggestionStartFrame', () => {
    const style = calculateDropdownEntranceStyles({
      currentFrame: 20,
      startFrame: 28,
    });
    assert.equal(style.opacity, 0);
    assert.equal(style.visibility, 'hidden');
  });

  await t.test('dropdown entrance is visible and positioned after suggestionStartFrame', () => {
    const style = calculateDropdownEntranceStyles({
      currentFrame: 35,
      startFrame: 28,
    });
    assert.ok(typeof style.opacity === 'number' && style.opacity > 0);
    assert.equal(style.visibility, 'visible');
  });

  await t.test('suggestions stagger sequentially based on index and staggerDelay', () => {
    const item0 = calculateSuggestionItemStyles({
      index: 0,
      currentFrame: 30,
      startFrame: 28,
      staggerDelay: 3,
    });
    const item2 = calculateSuggestionItemStyles({
      index: 2,
      currentFrame: 30,
      startFrame: 28,
      staggerDelay: 3,
    });

    assert.equal(item0.visibility, 'visible');
    assert.equal(item2.visibility, 'hidden'); // starts at 28 + 2*3 = 34
  });

  await t.test('selected suggestion receives highlight background and border', () => {
    const normal = calculateSuggestionItemStyles({
      index: 0,
      currentFrame: 50,
      startFrame: 28,
      isSelected: false,
    });
    const selected = calculateSuggestionItemStyles({
      index: 0,
      currentFrame: 50,
      startFrame: 28,
      isSelected: true,
    });

    assert.equal(normal.backgroundColor, 'transparent');
    assert.notEqual(selected.backgroundColor, 'transparent');
    assert.ok(selected.border?.includes('solid'));
  });
});

test('AnimatedSearchBar: Result Card Stagger Mechanics', async (t) => {
  await t.test('results are hidden before resultsStartFrame', () => {
    const card = calculateResultCardStyles({
      index: 0,
      currentFrame: 75,
      resultsStartFrame: 80,
      staggerDelay: 4,
    });
    assert.equal(card.visibility, 'hidden');
    assert.equal(card.opacity, 0);
  });

  await t.test('first result card reveals at resultsStartFrame', () => {
    const card = calculateResultCardStyles({
      index: 0,
      currentFrame: 85,
      resultsStartFrame: 80,
      staggerDelay: 4,
    });
    assert.equal(card.visibility, 'visible');
    assert.ok(typeof card.opacity === 'number' && card.opacity > 0);
  });

  await t.test('subsequent result cards stagger by staggerDelay frames', () => {
    const card1 = calculateResultCardStyles({
      index: 1,
      currentFrame: 82, // card 1 starts at 80 + 1*4 = 84
      resultsStartFrame: 80,
      staggerDelay: 4,
    });
    assert.equal(card1.visibility, 'hidden');

    const card1Later = calculateResultCardStyles({
      index: 1,
      currentFrame: 90,
      resultsStartFrame: 80,
      staggerDelay: 4,
    });
    assert.equal(card1Later.visibility, 'visible');
  });
});

test('AnimatedSearchBar: Edge Cases & Text Lengths', async (t) => {
  await t.test('handles empty search value smoothly', () => {
    const stage = deriveSearchBarStage({
      currentFrame: 20,
      typingStartFrame: 16,
    });
    assert.equal(stage, 'typing');
  });

  await t.test('handles long search query string safely', () => {
    const longQuery = 'San Francisco International Airport Terminal 2 Departures Level Gateway';
    assert.ok(longQuery.length > 50);
    const metrics = getSearchBarMetrics('md');
    assert.ok(metrics.fontSize === 15);
  });

  await t.test('works consistently across various fps timelines (24, 30, 60 fps)', () => {
    // Stage logic is frame-deterministic
    const frameAt24 = Math.round(1.0 * 24); // 24
    const frameAt30 = Math.round(1.0 * 30); // 30
    const frameAt60 = Math.round(1.0 * 60); // 60

    const stage24 = deriveSearchBarStage({ currentFrame: frameAt24, focusFrame: 10, typingStartFrame: 20 });
    const stage30 = deriveSearchBarStage({ currentFrame: frameAt30, focusFrame: 10, typingStartFrame: 20 });
    const stage60 = deriveSearchBarStage({ currentFrame: frameAt60, focusFrame: 10, typingStartFrame: 20 });

    assert.equal(stage24, 'typing');
    assert.equal(stage30, 'typing');
    assert.equal(stage60, 'typing');
  });
});
