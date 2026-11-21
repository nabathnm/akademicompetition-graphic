import test from 'node:test';
import assert from 'node:assert/strict';

import {
  resolveDirectionVector,
  parseSlideDistance,
  calculateSlideMetrics,
  normalizeSlideMode,
} from '../src/components/transitions/slideTransitionStyle.ts';

test('SlideTransition: Direction Vectors & Parsing', async (t) => {
  await t.test('resolves all 8 directions and aliases', () => {
    assert.deepEqual(resolveDirectionVector('left'), { vx: -1, vy: 0 });
    assert.deepEqual(resolveDirectionVector('right'), { vx: 1, vy: 0 });
    assert.deepEqual(resolveDirectionVector('horizontal'), { vx: 1, vy: 0 });
    assert.deepEqual(resolveDirectionVector('top'), { vx: 0, vy: -1 });
    assert.deepEqual(resolveDirectionVector('up'), { vx: 0, vy: -1 });
    assert.deepEqual(resolveDirectionVector('bottom'), { vx: 0, vy: 1 });
    assert.deepEqual(resolveDirectionVector('down'), { vx: 0, vy: 1 });
    assert.deepEqual(resolveDirectionVector('vertical'), { vx: 0, vy: 1 });

    assert.deepEqual(resolveDirectionVector('top-left'), { vx: -1, vy: -1 });
    assert.deepEqual(resolveDirectionVector('topLeft'), { vx: -1, vy: -1 });
    assert.deepEqual(resolveDirectionVector('top-right'), { vx: 1, vy: -1 });
    assert.deepEqual(resolveDirectionVector('topRight'), { vx: 1, vy: -1 });
    assert.deepEqual(resolveDirectionVector('bottom-left'), { vx: -1, vy: 1 });
    assert.deepEqual(resolveDirectionVector('bottomLeft'), { vx: -1, vy: 1 });
    assert.deepEqual(resolveDirectionVector('bottom-right'), { vx: 1, vy: 1 });
    assert.deepEqual(resolveDirectionVector('bottomRight'), { vx: 1, vy: 1 });
  });

  await t.test('parses distance magnitude and unit accurately', () => {
    assert.deepEqual(parseSlideDistance(undefined), { value: 100, unit: '%' });
    assert.deepEqual(parseSlideDistance(250), { value: 250, unit: 'px' });
    assert.deepEqual(parseSlideDistance('50%'), { value: 50, unit: '%' });
    assert.deepEqual(parseSlideDistance('320px'), { value: 320, unit: 'px' });
  });

  await t.test('normalizes mode aliases', () => {
    assert.equal(normalizeSlideMode('enter'), 'enter');
    assert.equal(normalizeSlideMode('in'), 'enter');
    assert.equal(normalizeSlideMode('exit'), 'exit');
    assert.equal(normalizeSlideMode('out'), 'exit');
    assert.equal(normalizeSlideMode('enter-exit'), 'enter-exit');
    assert.equal(normalizeSlideMode('in-out'), 'enter-exit');
    assert.equal(normalizeSlideMode('replace'), 'replace');
    assert.equal(normalizeSlideMode('cross-slide'), 'replace');
  });
});

test('SlideTransition: Mode "enter" Across Directions', async (t) => {
  await t.test('direction="left" starts at +100% and settles at 0%', () => {
    const start = calculateSlideMetrics({
      currentFrame: 0,
      direction: 'left',
      mode: 'enter',
      delay: 5,
      duration: 20,
      distance: '100%',
    });
    // For leftward flow, enters from opposite side (+100%)
    assert.equal(start.translateX, '100%');
    assert.equal(start.translateY, '0%');
    assert.equal(start.rawX, 100);
    assert.equal(start.rawY, 0);
    assert.equal(start.isComplete, false);
    assert.equal(start.phase, 'pending');

    const end = calculateSlideMetrics({
      currentFrame: 25,
      direction: 'left',
      mode: 'enter',
      delay: 5,
      duration: 20,
    });
    assert.equal(end.translateX, '0%');
    assert.equal(end.translateY, '0%');
    assert.equal(end.rawX, 0);
    assert.equal(end.rawY, 0);
    assert.equal(end.isComplete, true);
    assert.equal(end.phase, 'complete');
  });

  await t.test('direction="bottom" starts at -100% Y and settles at 0%', () => {
    const start = calculateSlideMetrics({
      currentFrame: 0,
      direction: 'bottom',
      mode: 'enter',
      delay: 0,
      duration: 20,
    });
    // Moving downward enters from -100% Y
    assert.equal(start.translateY, '-100%');
    assert.equal(start.translateX, '0%');

    const end = calculateSlideMetrics({
      currentFrame: 20,
      direction: 'bottom',
      mode: 'enter',
      duration: 20,
    });
    assert.equal(end.translateY, '0%');
    assert.equal(end.isComplete, true);
  });

  await t.test('direction="top-left" starts at (+100%, +100%) and settles at (0, 0)', () => {
    const start = calculateSlideMetrics({
      currentFrame: 0,
      direction: 'top-left',
      mode: 'enter',
      duration: 20,
    });
    assert.equal(start.translateX, '100%');
    assert.equal(start.translateY, '100%');

    const end = calculateSlideMetrics({
      currentFrame: 20,
      direction: 'top-left',
      mode: 'enter',
      duration: 20,
    });
    assert.equal(end.translateX, '0%');
    assert.equal(end.translateY, '0%');
  });
});

test('SlideTransition: Mode "exit" Across Directions', async (t) => {
  await t.test('direction="left" starts at 0% and exits to -100% X', () => {
    const start = calculateSlideMetrics({
      currentFrame: 0,
      direction: 'left',
      mode: 'exit',
      delay: 5,
      duration: 20,
    });
    assert.equal(start.translateX, '0%');
    assert.equal(start.rawX, 0);
    assert.equal(start.phase, 'pending');

    const end = calculateSlideMetrics({
      currentFrame: 25,
      direction: 'left',
      mode: 'exit',
      delay: 5,
      duration: 20,
    });
    // Exiting leftward moves to -100% X
    assert.equal(end.translateX, '-100%');
    assert.equal(end.rawX, -100);
    assert.equal(end.isComplete, true);
    assert.equal(end.phase, 'complete');
  });

  await t.test('direction="right" starts at 0% and exits to +100% X', () => {
    const end = calculateSlideMetrics({
      currentFrame: 20,
      direction: 'right',
      mode: 'exit',
      duration: 20,
    });
    assert.equal(end.translateX, '100%');
    assert.equal(end.rawX, 100);
    assert.equal(end.isComplete, true);
  });
});

test('SlideTransition: Mode "enter-exit" Sequence', async (t) => {
  await t.test('moves in -> holds at 0 -> exits away', () => {
    const inD = 10;
    const holdD = 10;
    const outD = 10;

    // Phase 1: Ingress (frame 5 = midway into in)
    const ingress = calculateSlideMetrics({
      currentFrame: 5,
      direction: 'left',
      mode: 'enter-exit',
      delay: 0,
      inDuration: inD,
      holdDuration: holdD,
      outDuration: outD,
      easing: 'linear',
    });
    assert.equal(ingress.phase, 'enter');
    assert.equal(ingress.rawX, 50); // moving from 100 towards 0

    // Phase 2: Hold (frame 15)
    const hold = calculateSlideMetrics({
      currentFrame: 15,
      direction: 'left',
      mode: 'enter-exit',
      inDuration: inD,
      holdDuration: holdD,
      outDuration: outD,
    });
    assert.equal(hold.phase, 'hold');
    assert.equal(hold.rawX, 0);

    // Phase 3: Exit (frame 25 = midway into out)
    const egress = calculateSlideMetrics({
      currentFrame: 25,
      direction: 'left',
      mode: 'enter-exit',
      inDuration: inD,
      holdDuration: holdD,
      outDuration: outD,
      easing: 'linear',
    });
    assert.equal(egress.phase, 'exit');
    assert.equal(egress.rawX, -50); // moving from 0 towards -100

    // Phase 4: Complete (frame 35)
    const complete = calculateSlideMetrics({
      currentFrame: 35,
      direction: 'left',
      mode: 'enter-exit',
      inDuration: inD,
      holdDuration: holdD,
      outDuration: outD,
    });
    assert.equal(complete.phase, 'complete');
    assert.equal(complete.rawX, -100);
    assert.equal(complete.isComplete, true);
  });
});

test('SlideTransition: Mode "replace" (Dual-Layer Push)', async (t) => {
  await t.test('outgoing slides out while incoming slides in', () => {
    // Initial frame
    const start = calculateSlideMetrics({
      currentFrame: 0,
      direction: 'left',
      mode: 'replace',
      duration: 20,
    });
    assert.equal(start.outgoingTranslateX, '0%');
    assert.equal(start.incomingTranslateX, '100%');

    // Midpoint frame
    const mid = calculateSlideMetrics({
      currentFrame: 10,
      direction: 'left',
      mode: 'replace',
      duration: 20,
      easing: 'linear',
    });
    assert.equal(mid.outgoingTranslateX, '-50%');
    assert.equal(mid.incomingTranslateX, '50%');

    // Final frame
    const end = calculateSlideMetrics({
      currentFrame: 20,
      direction: 'left',
      mode: 'replace',
      duration: 20,
    });
    assert.equal(end.outgoingTranslateX, '-100%');
    assert.equal(end.incomingTranslateX, '0%');
    assert.equal(end.isComplete, true);
  });
});

test('SlideTransition: Combined Fade and Pixel Distance', async (t) => {
  await t.test('fade=true coordinates opacity with movement', () => {
    const enterState = calculateSlideMetrics({
      currentFrame: 10,
      mode: 'enter',
      duration: 20,
      fade: true,
      easing: 'linear',
    });
    assert.equal(enterState.opacity, 0.5);

    const exitState = calculateSlideMetrics({
      currentFrame: 10,
      mode: 'exit',
      duration: 20,
      fade: true,
      easing: 'linear',
    });
    assert.equal(exitState.opacity, 0.5);
  });

  await t.test('supports custom numeric pixel distance', () => {
    const state = calculateSlideMetrics({
      currentFrame: 0,
      direction: 'bottom',
      mode: 'enter',
      distance: 300,
    });
    assert.equal(state.translateY, '-300px');
    assert.equal(state.rawY, -300);
  });

  await t.test('reverse flag inverts movement direction', () => {
    const state = calculateSlideMetrics({
      currentFrame: 0,
      direction: 'left',
      mode: 'enter',
      reverse: true,
    });
    assert.equal(state.rawX, 0);
  });
});
