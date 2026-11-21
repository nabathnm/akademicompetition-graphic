import test from 'node:test';
import assert from 'node:assert/strict';

import {
  normalizeWipeMode,
  normalizeWipeDirection,
  resolveWipeOrigin,
  calculateWipeMetrics,
  sanitizeWipeNumber,
} from '../src/components/transitions/wipeTransitionStyle.ts';

test('WipeTransition: Mode Normalization & Direction Resolution', async (t) => {
  await t.test('normalizes mode aliases correctly', () => {
    assert.equal(normalizeWipeMode('reveal'), 'reveal');
    assert.equal(normalizeWipeMode('in'), 'reveal');
    assert.equal(normalizeWipeMode('hide'), 'hide');
    assert.equal(normalizeWipeMode('out'), 'hide');
    assert.equal(normalizeWipeMode('reveal-hide'), 'reveal-hide');
    assert.equal(normalizeWipeMode('in-out'), 'reveal-hide');
    assert.equal(normalizeWipeMode('replace'), 'replace');
    assert.equal(normalizeWipeMode('cross-wipe'), 'replace');
    assert.equal(normalizeWipeMode(undefined), 'reveal');
  });

  await t.test('normalizes direction aliases correctly', () => {
    assert.equal(normalizeWipeDirection('left-to-right'), 'left-to-right');
    assert.equal(normalizeWipeDirection('leftToRight'), 'left-to-right');
    assert.equal(normalizeWipeDirection('right-to-left'), 'right-to-left');
    assert.equal(normalizeWipeDirection('rightToLeft'), 'right-to-left');
    assert.equal(normalizeWipeDirection('top-to-bottom'), 'top-to-bottom');
    assert.equal(normalizeWipeDirection('topToBottom'), 'top-to-bottom');
    assert.equal(normalizeWipeDirection('bottom-to-top'), 'bottom-to-top');
    assert.equal(normalizeWipeDirection('bottomToTop'), 'bottom-to-top');
    assert.equal(normalizeWipeDirection('center-out'), 'center-out');
    assert.equal(normalizeWipeDirection('centerOut'), 'center-out');
    assert.equal(normalizeWipeDirection('center-in'), 'center-in');
    assert.equal(normalizeWipeDirection('diagonal'), 'diagonal');
    assert.equal(normalizeWipeDirection('radial'), 'radial');
    assert.equal(normalizeWipeDirection('circle'), 'radial');
  });

  await t.test('resolves origin coordinates', () => {
    assert.deepEqual(resolveWipeOrigin('center'), { x: '50%', y: '50%' });
    assert.deepEqual(resolveWipeOrigin('top'), { x: '50%', y: '0%' });
    assert.deepEqual(resolveWipeOrigin('bottom right'), { x: '100%', y: '100%' });
    assert.deepEqual(resolveWipeOrigin('20% 80%'), { x: '20%', y: '80%' });
  });

  await t.test('sanitizes -0 and small floating points', () => {
    assert.equal(sanitizeWipeNumber(-0), 0);
    assert.equal(sanitizeWipeNumber(0.0000001), 0);
    assert.equal(sanitizeWipeNumber(50.1234), 50.1234);
  });
});

test('WipeTransition: Mode "reveal" Across Directions', async (t) => {
  await t.test('direction="left-to-right" clips right edge from 100% to 0%', () => {
    const start = calculateWipeMetrics({
      currentFrame: 0,
      direction: 'left-to-right',
      mode: 'reveal',
      duration: 20,
    });
    assert.equal(start.clipPath, 'inset(0% 100% 0% 0%)');
    assert.equal(start.isComplete, false);

    const end = calculateWipeMetrics({
      currentFrame: 20,
      direction: 'left-to-right',
      mode: 'reveal',
      duration: 20,
    });
    assert.equal(end.clipPath, 'inset(0% 0% 0% 0%)');
    assert.equal(end.isComplete, true);
  });

  await t.test('direction="right-to-left" clips left edge from 100% to 0%', () => {
    const start = calculateWipeMetrics({
      currentFrame: 0,
      direction: 'right-to-left',
      mode: 'reveal',
      duration: 20,
    });
    assert.equal(start.clipPath, 'inset(0% 0% 0% 100%)');

    const end = calculateWipeMetrics({
      currentFrame: 20,
      direction: 'right-to-left',
      mode: 'reveal',
      duration: 20,
    });
    assert.equal(end.clipPath, 'inset(0% 0% 0% 0%)');
  });

  await t.test('direction="top-to-bottom" clips bottom edge from 100% to 0%', () => {
    const start = calculateWipeMetrics({
      currentFrame: 0,
      direction: 'top-to-bottom',
      mode: 'reveal',
      duration: 20,
    });
    assert.equal(start.clipPath, 'inset(0% 0% 100% 0%)');

    const end = calculateWipeMetrics({
      currentFrame: 20,
      direction: 'top-to-bottom',
      mode: 'reveal',
      duration: 20,
    });
    assert.equal(end.clipPath, 'inset(0% 0% 0% 0%)');
  });

  await t.test('direction="bottom-to-top" clips top edge from 100% to 0%', () => {
    const start = calculateWipeMetrics({
      currentFrame: 0,
      direction: 'bottom-to-top',
      mode: 'reveal',
      duration: 20,
    });
    assert.equal(start.clipPath, 'inset(100% 0% 0% 0%)');

    const end = calculateWipeMetrics({
      currentFrame: 20,
      direction: 'bottom-to-top',
      mode: 'reveal',
      duration: 20,
    });
    assert.equal(end.clipPath, 'inset(0% 0% 0% 0%)');
  });

  await t.test('direction="center-out" expands insets from 50% to 0%', () => {
    const start = calculateWipeMetrics({
      currentFrame: 0,
      direction: 'center-out',
      mode: 'reveal',
      duration: 20,
    });
    assert.equal(start.clipPath, 'inset(50% 50% 50% 50%)');

    const end = calculateWipeMetrics({
      currentFrame: 20,
      direction: 'center-out',
      mode: 'reveal',
      duration: 20,
    });
    assert.equal(end.clipPath, 'inset(0% 0% 0% 0%)');
  });

  await t.test('direction="diagonal" polygon sweeps from point to full rectangle', () => {
    const start = calculateWipeMetrics({
      currentFrame: 0,
      direction: 'diagonal',
      mode: 'reveal',
      duration: 20,
    });
    assert.equal(start.clipPath, 'polygon(0% 0%, 0% 0%, 0% 0%)');

    const end = calculateWipeMetrics({
      currentFrame: 20,
      direction: 'diagonal',
      mode: 'reveal',
      duration: 20,
    });
    assert.equal(end.clipPath, 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)');
  });

  await t.test('direction="radial" expands circle radius from 0% to 142%', () => {
    const start = calculateWipeMetrics({
      currentFrame: 0,
      direction: 'radial',
      mode: 'reveal',
      duration: 20,
    });
    assert.equal(start.clipPath, 'circle(0% at 50% 50%)');

    const end = calculateWipeMetrics({
      currentFrame: 20,
      direction: 'radial',
      mode: 'reveal',
      duration: 20,
    });
    assert.equal(end.clipPath, 'circle(142% at 50% 50%)');
  });
});

test('WipeTransition: Mode "hide"', async (t) => {
  await t.test('starts fully visible and insets to completely hidden', () => {
    const start = calculateWipeMetrics({
      currentFrame: 0,
      direction: 'left-to-right',
      mode: 'hide',
      duration: 20,
    });
    assert.equal(start.clipPath, 'inset(0% 0% 0% 0%)');

    const end = calculateWipeMetrics({
      currentFrame: 20,
      direction: 'left-to-right',
      mode: 'hide',
      duration: 20,
    });
    assert.equal(end.clipPath, 'inset(0% 100% 0% 0%)');
    assert.equal(end.isComplete, true);
    assert.equal(end.phase, 'complete');
  });
});

test('WipeTransition: Mode "reveal-hide" (Envelope)', async (t) => {
  await t.test('reveals in, holds unclipped at 0%, and hides out', () => {
    const start = calculateWipeMetrics({
      currentFrame: 0,
      direction: 'left-to-right',
      mode: 'reveal-hide',
      inDuration: 10,
      holdDuration: 10,
      outDuration: 10,
    });
    assert.equal(start.clipPath, 'inset(0% 100% 0% 0%)');
    assert.equal(start.phase, 'in');

    const hold = calculateWipeMetrics({
      currentFrame: 15,
      direction: 'left-to-right',
      mode: 'reveal-hide',
      inDuration: 10,
      holdDuration: 10,
      outDuration: 10,
    });
    assert.equal(hold.clipPath, 'inset(0% 0% 0% 0%)');
    assert.equal(hold.phase, 'hold');

    const end = calculateWipeMetrics({
      currentFrame: 30,
      direction: 'left-to-right',
      mode: 'reveal-hide',
      inDuration: 10,
      holdDuration: 10,
      outDuration: 10,
    });
    assert.equal(end.clipPath, 'inset(0% 100% 0% 0%)');
    assert.equal(end.phase, 'complete');
  });
});

test('WipeTransition: Mode "replace" (Dual-Layer Cross-Wipe)', async (t) => {
  await t.test('outgoing layer hides while incoming layer reveals', () => {
    const start = calculateWipeMetrics({
      currentFrame: 0,
      direction: 'left-to-right',
      mode: 'replace',
      duration: 20,
    });
    // At start: outgoing is fully visible, incoming is fully clipped
    assert.equal(start.outgoingClipPath, 'inset(0% 0% 0% 0%)');
    assert.equal(start.incomingClipPath, 'inset(0% 100% 0% 0%)');

    const end = calculateWipeMetrics({
      currentFrame: 20,
      direction: 'left-to-right',
      mode: 'replace',
      duration: 20,
    });
    // At end: outgoing is completely clipped away, incoming is fully visible
    assert.equal(end.outgoingClipPath, 'inset(0% 100% 0% 0%)');
    assert.equal(end.incomingClipPath, 'inset(0% 0% 0% 0%)');
  });
});

test('WipeTransition: Edge Position & Modifiers', async (t) => {
  await t.test('calculates leading edge position at midpoint', () => {
    const mid = calculateWipeMetrics({
      currentFrame: 10,
      direction: 'left-to-right',
      mode: 'reveal',
      duration: 20,
      easing: 'linear',
      edgeWidth: 3,
    });
    assert.ok(mid.edgePosition);
    assert.equal(mid.edgePosition?.visible, true);
    assert.equal(mid.edgePosition?.x, '50%');
    assert.equal(mid.edgePosition?.width, '3px');
  });

  await t.test('fade=true coordinates opacity alongside clipPath', () => {
    const start = calculateWipeMetrics({
      currentFrame: 0,
      mode: 'reveal',
      fade: true,
      duration: 20,
      easing: 'linear',
    });
    assert.equal(start.opacity, 0);

    const end = calculateWipeMetrics({
      currentFrame: 20,
      mode: 'reveal',
      fade: true,
      duration: 20,
      easing: 'linear',
    });
    assert.equal(end.opacity, 1.0);
  });
});
