import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  calculateTypographySceneKinematics,
  resolveTypographySceneLayout,
  splitTextWithHighlights,
} from '../src/components/scenes/typographySceneStyle.ts';

describe('TypographyScene Unit Tests', () => {
  describe('calculateTypographySceneKinematics', () => {
    it('staggers entrance sequence: eyebrow -> headline -> secondary -> description', () => {
      const m0 = calculateTypographySceneKinematics({
        frame: 0,
        delay: 0,
        staggerDelay: 4,
      });

      assert.strictEqual(m0.headline.opacity, 0);
      assert.strictEqual(m0.secondary.opacity, 0);
      assert.strictEqual(m0.description.opacity, 0);

      const m15 = calculateTypographySceneKinematics({
        frame: 15,
        delay: 0,
        staggerDelay: 4,
      });

      assert.ok(m15.eyebrow.opacity > 0);
      assert.ok(m15.headline.opacity > 0);

      const m40 = calculateTypographySceneKinematics({
        frame: 40,
        delay: 0,
        staggerDelay: 4,
      });

      assert.strictEqual(m40.eyebrow.isSettled, true);
      assert.strictEqual(m40.headline.isSettled, true);
      assert.strictEqual(m40.secondary.isSettled, true);
      assert.strictEqual(m40.description.isSettled, true);
    });

    it('respects explicit delay overrides in animation config', () => {
      const m = calculateTypographySceneKinematics({
        frame: 10,
        delay: 0,
        animation: {
          headlineDelay: 20,
          highlightDelay: 25,
        },
      });

      // Frame 10 is before frame 20, so headline and highlight remain at 0 opacity
      assert.strictEqual(m.headline.opacity, 0);
      assert.strictEqual(m.highlight.opacity, 0);
    });

    it('supports none animation mode for immediate rendering', () => {
      const m = calculateTypographySceneKinematics({
        frame: 0,
        delay: 0,
        animation: {
          secondaryAnimation: 'none',
          descriptionAnimation: 'none',
        },
      });

      assert.strictEqual(m.secondary.opacity, 1);
      assert.strictEqual(m.secondary.isSettled, true);
      assert.strictEqual(m.description.opacity, 1);
      assert.strictEqual(m.description.isSettled, true);
    });
  });

  describe('resolveTypographySceneLayout', () => {
    it('returns centered column for centered layout', () => {
      const l = resolveTypographySceneLayout('centered');
      assert.strictEqual(l.containerStyle.flexDirection, 'column');
      assert.strictEqual(l.containerStyle.alignItems, 'center');
      assert.strictEqual(l.containerStyle.textAlign, 'center');
    });

    it('returns left-aligned column for left-aligned layout', () => {
      const l = resolveTypographySceneLayout('left-aligned');
      assert.strictEqual(l.containerStyle.alignItems, 'flex-start');
      assert.strictEqual(l.containerStyle.textAlign, 'left');
    });

    it('returns right-aligned column for right-aligned layout', () => {
      const l = resolveTypographySceneLayout('right-aligned');
      assert.strictEqual(l.containerStyle.alignItems, 'flex-end');
      assert.strictEqual(l.containerStyle.textAlign, 'right');
    });

    it('returns massive headline font size for oversized-headline layout', () => {
      const l = resolveTypographySceneLayout('oversized-headline');
      assert.strictEqual(l.headlineStyle.fontSize, 92);
      assert.strictEqual(l.headlineStyle.fontWeight, 900);
    });

    it('returns 2-column flex row for split-text layout', () => {
      const l = resolveTypographySceneLayout('split-text');
      assert.strictEqual(l.containerStyle.flexDirection, 'row');
      assert.ok(l.contentColStyle !== undefined);
      assert.ok(l.sideColStyle !== undefined);
    });

    it('respects explicit alignment override across layouts', () => {
      const l = resolveTypographySceneLayout('oversized-headline', 'left');
      assert.strictEqual(l.containerStyle.alignItems, 'flex-start');
      assert.strictEqual(l.containerStyle.textAlign, 'left');
    });
  });

  describe('splitTextWithHighlights', () => {
    it('returns single unhighlighted segment when list is empty', () => {
      const segs = splitTextWithHighlights('Autonomous Intelligence for Video');
      assert.strictEqual(segs.length, 1);
      assert.strictEqual(segs[0].isHighlight, false);
      assert.strictEqual(segs[0].text, 'Autonomous Intelligence for Video');
    });

    it('identifies and marks targeted highlight words case-insensitively', () => {
      const segs = splitTextWithHighlights('Building the Future of Autonomous Agents', [
        'future',
        'agents',
      ]);

      const highlights = segs.filter((s) => s.isHighlight);
      assert.strictEqual(highlights.length, 2);
      assert.strictEqual(highlights[0].text, 'Future');
      assert.strictEqual(highlights[1].text, 'Agents');
    });

    it('strips punctuation when matching target words', () => {
      const segs = splitTextWithHighlights('Ready, Set, Launch!', ['ready', 'launch']);
      const highlights = segs.filter((s) => s.isHighlight);
      assert.strictEqual(highlights.length, 2);
    });
  });
});
