import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  sanitizeSplitNumber,
  normalizeSplitDirection,
  normalizeSplitMovement,
  normalizeSplitMode,
  resolveSplitGrid,
  calculatePanelClipInset,
  calculatePanelMovementVector,
  calculateStaggerRank,
  calculateSplitMetrics,
} from '../src/components/transitions/splitTransitionStyle.ts';

describe('SplitTransition Unit Tests', () => {
  describe('sanitizeSplitNumber', () => {
    it('handles NaN and floating zero boundaries', () => {
      assert.strictEqual(sanitizeSplitNumber(NaN), 0);
      assert.strictEqual(sanitizeSplitNumber(1e-8), 0);
      assert.strictEqual(sanitizeSplitNumber(-1e-8), 0);
      assert.strictEqual(sanitizeSplitNumber(-0), 0);
    });

    it('rounds to 4 decimal places', () => {
      assert.strictEqual(sanitizeSplitNumber(12.345678), 12.3457);
      assert.strictEqual(sanitizeSplitNumber(50), 50);
    });
  });

  describe('normalizeSplitDirection', () => {
    it('normalizes direction strings with fallback', () => {
      assert.strictEqual(normalizeSplitDirection('vertical'), 'vertical');
      assert.strictEqual(normalizeSplitDirection(undefined), 'vertical');
      assert.strictEqual(normalizeSplitDirection('horizontal'), 'horizontal');
      assert.strictEqual(normalizeSplitDirection('quadrants'), 'quadrants');
      assert.strictEqual(normalizeSplitDirection('grid'), 'grid');
    });
  });

  describe('normalizeSplitMovement', () => {
    it('normalizes movement directions correctly', () => {
      assert.strictEqual(normalizeSplitMovement('outward'), 'outward');
      assert.strictEqual(normalizeSplitMovement(undefined), 'outward');
      assert.strictEqual(normalizeSplitMovement('inward'), 'inward');
      assert.strictEqual(normalizeSplitMovement('opposite'), 'opposite');
      assert.strictEqual(normalizeSplitMovement('alternate'), 'opposite');
      assert.strictEqual(normalizeSplitMovement('left'), 'left');
      assert.strictEqual(normalizeSplitMovement('right'), 'right');
      assert.strictEqual(normalizeSplitMovement('up'), 'up');
      assert.strictEqual(normalizeSplitMovement('down'), 'down');
    });
  });

  describe('normalizeSplitMode', () => {
    it('normalizes mode aliases', () => {
      assert.strictEqual(normalizeSplitMode('enter'), 'enter');
      assert.strictEqual(normalizeSplitMode('in'), 'enter');
      assert.strictEqual(normalizeSplitMode('reveal'), 'enter');
      assert.strictEqual(normalizeSplitMode(undefined), 'enter');

      assert.strictEqual(normalizeSplitMode('exit'), 'exit');
      assert.strictEqual(normalizeSplitMode('out'), 'exit');
      assert.strictEqual(normalizeSplitMode('hide'), 'exit');

      assert.strictEqual(normalizeSplitMode('enter-exit'), 'enter-exit');
      assert.strictEqual(normalizeSplitMode('in-out'), 'enter-exit');

      assert.strictEqual(normalizeSplitMode('replace'), 'replace');
    });
  });

  describe('resolveSplitGrid', () => {
    it('resolves 2 vertical panels', () => {
      const grid = resolveSplitGrid({ splitDirection: 'vertical', panelCount: 2 });
      assert.strictEqual(grid.totalRows, 1);
      assert.strictEqual(grid.totalCols, 2);
      assert.strictEqual(grid.count, 2);
    });

    it('resolves 4 horizontal strips', () => {
      const grid = resolveSplitGrid({ splitDirection: 'horizontal', panelCount: 4 });
      assert.strictEqual(grid.totalRows, 4);
      assert.strictEqual(grid.totalCols, 1);
      assert.strictEqual(grid.count, 4);
    });

    it('resolves 4 quadrants', () => {
      const grid = resolveSplitGrid({ splitDirection: 'quadrants' });
      assert.strictEqual(grid.totalRows, 2);
      assert.strictEqual(grid.totalCols, 2);
      assert.strictEqual(grid.count, 4);
    });

    it('resolves custom grid dimensions', () => {
      const grid = resolveSplitGrid({ splitDirection: 'grid', rows: 3, cols: 5 });
      assert.strictEqual(grid.totalRows, 3);
      assert.strictEqual(grid.totalCols, 5);
      assert.strictEqual(grid.count, 15);
    });
  });

  describe('calculatePanelClipInset', () => {
    it('calculates correct insets for 2 vertical panels', () => {
      const leftPanel = calculatePanelClipInset(0, 0, 1, 2);
      assert.strictEqual(leftPanel, 'inset(0% 50% 0% 0%)');

      const rightPanel = calculatePanelClipInset(0, 1, 1, 2);
      assert.strictEqual(rightPanel, 'inset(0% 0% 0% 50%)');
    });

    it('calculates correct insets for 2 horizontal panels', () => {
      const topPanel = calculatePanelClipInset(0, 0, 2, 1);
      assert.strictEqual(topPanel, 'inset(0% 0% 50% 0%)');

      const bottomPanel = calculatePanelClipInset(1, 0, 2, 1);
      assert.strictEqual(bottomPanel, 'inset(50% 0% 0% 0%)');
    });

    it('calculates correct insets for 4 quadrants', () => {
      const topLeft = calculatePanelClipInset(0, 0, 2, 2);
      assert.strictEqual(topLeft, 'inset(0% 50% 50% 0%)');

      const topRight = calculatePanelClipInset(0, 1, 2, 2);
      assert.strictEqual(topRight, 'inset(0% 0% 50% 50%)');

      const bottomLeft = calculatePanelClipInset(1, 0, 2, 2);
      assert.strictEqual(bottomLeft, 'inset(50% 50% 0% 0%)');

      const bottomRight = calculatePanelClipInset(1, 1, 2, 2);
      assert.strictEqual(bottomRight, 'inset(50% 0% 0% 50%)');
    });

    it('applies panelGap to insets', () => {
      const withGap = calculatePanelClipInset(0, 0, 1, 2, 8);
      assert.ok(withGap.includes('+ 4px'));
    });
  });

  describe('calculatePanelMovementVector', () => {
    it('computes outward vectors for vertical split', () => {
      const left = calculatePanelMovementVector(0, 0, 1, 2, 'outward', 'vertical');
      assert.deepStrictEqual(left, { dirX: -1, dirY: 0 });

      const right = calculatePanelMovementVector(0, 1, 1, 2, 'outward', 'vertical');
      assert.deepStrictEqual(right, { dirX: 1, dirY: 0 });
    });

    it('computes outward vectors for horizontal split', () => {
      const top = calculatePanelMovementVector(0, 0, 2, 1, 'outward', 'horizontal');
      assert.deepStrictEqual(top, { dirX: 0, dirY: -1 });

      const bottom = calculatePanelMovementVector(1, 0, 2, 1, 'outward', 'horizontal');
      assert.deepStrictEqual(bottom, { dirX: 0, dirY: 1 });
    });

    it('computes outward vectors for 4 quadrants', () => {
      const tl = calculatePanelMovementVector(0, 0, 2, 2, 'outward', 'quadrants');
      assert.deepStrictEqual(tl, { dirX: -1, dirY: -1 });

      const tr = calculatePanelMovementVector(0, 1, 2, 2, 'outward', 'quadrants');
      assert.deepStrictEqual(tr, { dirX: 1, dirY: -1 });

      const bl = calculatePanelMovementVector(1, 0, 2, 2, 'outward', 'quadrants');
      assert.deepStrictEqual(bl, { dirX: -1, dirY: 1 });

      const br = calculatePanelMovementVector(1, 1, 2, 2, 'outward', 'quadrants');
      assert.deepStrictEqual(br, { dirX: 1, dirY: 1 });
    });

    it('computes opposite/alternating movement vectors', () => {
      const col0 = calculatePanelMovementVector(0, 0, 1, 4, 'opposite', 'vertical');
      assert.deepStrictEqual(col0, { dirX: 0, dirY: -1 });

      const col1 = calculatePanelMovementVector(0, 1, 1, 4, 'opposite', 'vertical');
      assert.deepStrictEqual(col1, { dirX: 0, dirY: 1 });
    });
  });

  describe('calculateStaggerRank', () => {
    it('ranks panel orders correctly', () => {
      assert.strictEqual(calculateStaggerRank(0, 0, 0, 1, 4, 'start-to-end'), 0);
      assert.strictEqual(calculateStaggerRank(3, 0, 3, 1, 4, 'start-to-end'), 3);

      assert.strictEqual(calculateStaggerRank(0, 0, 0, 1, 4, 'end-to-start'), 3);
      assert.strictEqual(calculateStaggerRank(3, 0, 3, 1, 4, 'end-to-start'), 0);
    });
  });

  describe('calculateSplitMetrics', () => {
    it('calculates enter mode progression accurately', () => {
      // Pending: panels at offset position
      const pending = calculateSplitMetrics({
        currentFrame: 0,
        delay: 5,
        duration: 20,
        mode: 'enter',
        splitDirection: 'vertical',
        panelCount: 2,
      });
      assert.strictEqual(pending.phase, 'pending');
      assert.strictEqual(pending.isComplete, false);
      assert.strictEqual(pending.panels.length, 2);
      assert.strictEqual(pending.panels[0].translateX, '-100%');
      assert.strictEqual(pending.panels[1].translateX, '100%');

      // Complete: panels settled at home (0%)
      const complete = calculateSplitMetrics({
        currentFrame: 30,
        delay: 5,
        duration: 20,
        mode: 'enter',
        splitDirection: 'vertical',
        panelCount: 2,
      });
      assert.strictEqual(complete.phase, 'complete');
      assert.strictEqual(complete.isComplete, true);
      assert.strictEqual(complete.panels[0].translateX, '0%');
      assert.strictEqual(complete.panels[1].translateX, '0%');
    });

    it('calculates exit mode progression accurately', () => {
      // Pending: panels at home (0%)
      const pending = calculateSplitMetrics({
        currentFrame: 0,
        delay: 10,
        duration: 20,
        mode: 'exit',
        splitDirection: 'horizontal',
        panelCount: 2,
      });
      assert.strictEqual(pending.phase, 'pending');
      assert.strictEqual(pending.panels[0].translateY, '0%');
      assert.strictEqual(pending.panels[1].translateY, '0%');

      // Complete: panels moved to off-screen
      const complete = calculateSplitMetrics({
        currentFrame: 35,
        delay: 10,
        duration: 20,
        mode: 'exit',
        splitDirection: 'horizontal',
        panelCount: 2,
      });
      assert.strictEqual(complete.phase, 'complete');
      assert.strictEqual(complete.isComplete, true);
      assert.strictEqual(complete.panels[0].translateY, '-100%');
      assert.strictEqual(complete.panels[1].translateY, '100%');
    });

    it('calculates enter-exit envelope accurately', () => {
      const inMetrics = calculateSplitMetrics({
        currentFrame: 5,
        duration: 30,
        inDuration: 10,
        holdDuration: 10,
        outDuration: 10,
        mode: 'enter-exit',
        splitDirection: 'vertical',
        panelCount: 2,
      });
      assert.strictEqual(inMetrics.phase, 'in');

      const holdMetrics = calculateSplitMetrics({
        currentFrame: 15,
        duration: 30,
        inDuration: 10,
        holdDuration: 10,
        outDuration: 10,
        mode: 'enter-exit',
        splitDirection: 'vertical',
        panelCount: 2,
      });
      assert.strictEqual(holdMetrics.phase, 'hold');
      assert.strictEqual(holdMetrics.panels[0].translateX, '0%');
      assert.strictEqual(holdMetrics.panels[1].translateX, '0%');

      const outMetrics = calculateSplitMetrics({
        currentFrame: 25,
        duration: 30,
        inDuration: 10,
        holdDuration: 10,
        outDuration: 10,
        mode: 'enter-exit',
        splitDirection: 'vertical',
        panelCount: 2,
      });
      assert.strictEqual(outMetrics.phase, 'out');
    });

    it('staggers panel animations when staggerDelay > 0', () => {
      const staggered = calculateSplitMetrics({
        currentFrame: 10,
        delay: 0,
        duration: 20,
        staggerDelay: 5,
        splitDirection: 'vertical',
        panelCount: 3,
        mode: 'enter',
      });

      // Panel 0 has progress 10/20 = 0.5
      // Panel 1 has progress (10 - 5)/20 = 0.25
      // Panel 2 has progress (10 - 10)/20 = 0
      assert.ok(staggered.panels[0].progress > staggered.panels[1].progress);
      assert.ok(staggered.panels[1].progress > staggered.panels[2].progress);
    });

    it('integrates opacity fade and spring physics', () => {
      const metrics = calculateSplitMetrics({
        currentFrame: 10,
        duration: 20,
        mode: 'enter',
        fade: true,
        fromOpacity: 0.1,
        toOpacity: 1.0,
        spring: 'snappy',
      });

      assert.ok(metrics.panels[0].opacity > 0.1);
    });

    it('generates replace dual-layer panels', () => {
      const replace = calculateSplitMetrics({
        currentFrame: 10,
        duration: 20,
        mode: 'replace',
        splitDirection: 'quadrants',
      });

      assert.ok(replace.outgoingPanels);
      assert.ok(replace.incomingPanels);
      assert.strictEqual(replace.outgoingPanels.length, 4);
      assert.strictEqual(replace.incomingPanels.length, 4);
      assert.strictEqual(replace.incomingPanels[0].translateX, '0%');
    });
  });
});
