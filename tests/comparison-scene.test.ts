import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  calculateComparisonSceneKinematics,
  resolveComparisonSceneLayout,
} from '../src/components/scenes/comparisonSceneStyle.ts';

describe('ComparisonScene Unit Tests', () => {
  describe('calculateComparisonSceneKinematics', () => {
    it('staggers panel entrances in sequential mode', () => {
      const m = calculateComparisonSceneKinematics({
        frame: 10,
        delay: 0,
        staggerDelay: 6,
        animation: { sequentialReveal: true },
      });

      // Left panel starts at frame 6, right panel starts at frame 12
      assert.ok(m.leftPanel.opacity > 0);
      assert.strictEqual(m.rightPanel.opacity, 0);
    });

    it('reveals panels simultaneously when sequentialReveal is false', () => {
      const m = calculateComparisonSceneKinematics({
        frame: 10,
        delay: 0,
        staggerDelay: 6,
        animation: { sequentialReveal: false },
      });

      assert.ok(m.leftPanel.opacity > 0);
      assert.ok(m.rightPanel.opacity > 0);
      assert.strictEqual(m.leftPanel.opacity, m.rightPanel.opacity);
    });

    it('calculates divider scaling reveal', () => {
      const m0 = calculateComparisonSceneKinematics({
        frame: 2,
        animation: { dividerDelay: 4 },
      });
      assert.strictEqual(m0.divider.scale, 0);

      const m20 = calculateComparisonSceneKinematics({
        frame: 25,
        animation: { dividerDelay: 4 },
      });
      assert.strictEqual(m20.divider.isSettled, true);
    });

    it('applies highlight pulse to selected side', () => {
      const mLeft = calculateComparisonSceneKinematics({
        frame: 15,
        animation: { highlightSide: 'left' },
      });
      assert.notStrictEqual(mLeft.leftHighlightPulse, 1);
      assert.strictEqual(mLeft.rightHighlightPulse, 1);

      const mRight = calculateComparisonSceneKinematics({
        frame: 15,
        animation: { highlightSide: 'right' },
      });
      assert.strictEqual(mRight.leftHighlightPulse, 1);
      assert.notStrictEqual(mRight.rightHighlightPulse, 1);
    });
  });

  describe('resolveComparisonSceneLayout', () => {
    it('returns flex row for side-by-side', () => {
      const l = resolveComparisonSceneLayout('side-by-side');
      assert.strictEqual(l.panelsContainerStyle.flexDirection, 'row');
      assert.strictEqual(l.isVertical, false);
    });

    it('returns flex column for top-and-bottom', () => {
      const l = resolveComparisonSceneLayout('top-and-bottom');
      assert.strictEqual(l.panelsContainerStyle.flexDirection, 'column');
      assert.strictEqual(l.isVertical, true);
    });

    it('returns styled before and after panels', () => {
      const l = resolveComparisonSceneLayout('before-and-after');
      assert.ok(l.leftPanelStyle.borderRadius !== undefined);
      assert.ok(l.rightPanelStyle.boxShadow !== undefined);
    });

    it('supports custom divider thickness and color', () => {
      const l = resolveComparisonSceneLayout('side-by-side', {
        thickness: 4,
        color: '#06b6d4',
      });
      assert.strictEqual(l.dividerStyle.width, 4);
      assert.strictEqual(l.dividerStyle.backgroundColor, '#06b6d4');
    });
  });
});
