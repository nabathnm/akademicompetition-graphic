import test from 'node:test';
import assert from 'node:assert/strict';

import {
  calculateFadeOpacity,
  sanitizeOpacity,
} from '../src/components/transitions/fadeTransitionStyle.ts';

test('FadeTransition: Sanitization & Opacity Bounds', async (t) => {
  await t.test('clamps values strictly within [0, 1]', () => {
    assert.equal(sanitizeOpacity(-0.5), 0);
    assert.equal(sanitizeOpacity(1.5), 1);
    assert.equal(sanitizeOpacity(0), 0);
    assert.equal(sanitizeOpacity(1), 1);
    assert.equal(sanitizeOpacity(Number.NaN), 0);
  });

  await t.test('sanitizes negative signed zero (-0) to positive 0', () => {
    const zero = sanitizeOpacity(-0);
    assert.equal(Object.is(zero, -0), false);
    assert.equal(zero, 0);
  });
});

test('FadeTransition: Mode "in" (Fade In)', async (t) => {
  await t.test('initial frame before delay returns fromOpacity', () => {
    const state = calculateFadeOpacity({
      currentFrame: 0,
      mode: 'in',
      delay: 10,
      duration: 20,
      fromOpacity: 0,
      toOpacity: 1,
    });
    assert.equal(state.opacity, 0);
    assert.equal(state.progress, 0);
    assert.equal(state.isComplete, false);
    assert.equal(state.phase, 'pending');
  });

  await t.test('midpoint frame calculates interpolated opacity', () => {
    const state = calculateFadeOpacity({
      currentFrame: 20, // delay (10) + duration (20) / 2 = 20
      mode: 'in',
      delay: 10,
      duration: 20,
      easing: 'linear',
      fromOpacity: 0,
      toOpacity: 1,
    });
    assert.equal(state.progress, 0.5);
    assert.equal(state.opacity, 0.5);
    assert.equal(state.isComplete, false);
    assert.equal(state.phase, 'in');
  });

  await t.test('final frame at and beyond duration reaches toOpacity and completes', () => {
    const atEnd = calculateFadeOpacity({
      currentFrame: 30,
      mode: 'in',
      delay: 10,
      duration: 20,
      fromOpacity: 0,
      toOpacity: 1,
    });
    assert.equal(atEnd.opacity, 1);
    assert.equal(atEnd.progress, 1);
    assert.equal(atEnd.isComplete, true);
    assert.equal(atEnd.phase, 'complete');

    const beyondEnd = calculateFadeOpacity({
      currentFrame: 60,
      mode: 'in',
      delay: 10,
      duration: 20,
    });
    assert.equal(beyondEnd.opacity, 1);
    assert.equal(beyondEnd.isComplete, true);
  });

  await t.test('reverse flag inverts fade-in direction', () => {
    const state = calculateFadeOpacity({
      currentFrame: 0,
      mode: 'in',
      reverse: true,
      fromOpacity: 0,
      toOpacity: 1,
    });
    assert.equal(state.opacity, 1);
  });
});

test('FadeTransition: Mode "out" (Fade Out)', async (t) => {
  await t.test('initial frame holds toOpacity prior to start', () => {
    const state = calculateFadeOpacity({
      currentFrame: 5,
      mode: 'out',
      delay: 10,
      duration: 20,
      fromOpacity: 0,
      toOpacity: 1,
    });
    assert.equal(state.opacity, 1);
    assert.equal(state.isComplete, false);
    assert.equal(state.phase, 'pending');
  });

  await t.test('midpoint frame fades to middle opacity', () => {
    const state = calculateFadeOpacity({
      currentFrame: 20,
      mode: 'out',
      delay: 10,
      duration: 20,
      easing: 'linear',
      fromOpacity: 0,
      toOpacity: 1,
    });
    assert.equal(state.progress, 0.5);
    assert.equal(state.opacity, 0.5);
    assert.equal(state.isComplete, false);
    assert.equal(state.phase, 'out');
  });

  await t.test('completion frame settles at fromOpacity', () => {
    const state = calculateFadeOpacity({
      currentFrame: 35,
      mode: 'out',
      delay: 10,
      duration: 20,
      fromOpacity: 0,
      toOpacity: 1,
    });
    assert.equal(state.opacity, 0);
    assert.equal(state.isComplete, true);
    assert.equal(state.phase, 'complete');
  });
});

test('FadeTransition: Mode "in-out" (Envelope Sequence)', async (t) => {
  await t.test('traverses in, hold, and out phases sequentially', () => {
    // 10 frames in, 10 frames hold, 10 frames out (total 30)
    const inD = 10;
    const holdD = 10;
    const outD = 10;

    // Phase 0: Before delay (frame 0)
    const before = calculateFadeOpacity({
      currentFrame: 0,
      mode: 'in-out',
      delay: 5,
      inDuration: inD,
      holdDuration: holdD,
      outDuration: outD,
    });
    assert.equal(before.opacity, 0);
    assert.equal(before.phase, 'pending');

    // Phase 1: Ingress (frame 10 = 5 delay + 5 mid of in)
    const ingress = calculateFadeOpacity({
      currentFrame: 10,
      mode: 'in-out',
      delay: 5,
      inDuration: inD,
      holdDuration: holdD,
      outDuration: outD,
      easing: 'linear',
    });
    assert.equal(ingress.phase, 'in');
    assert.equal(ingress.opacity, 0.5);

    // Phase 2: Plateau Hold (frame 20 = 5 delay + 10 in + 5 into hold)
    const hold = calculateFadeOpacity({
      currentFrame: 20,
      mode: 'in-out',
      delay: 5,
      inDuration: inD,
      holdDuration: holdD,
      outDuration: outD,
    });
    assert.equal(hold.phase, 'hold');
    assert.equal(hold.opacity, 1);

    // Phase 3: Egress (frame 30 = 5 delay + 10 in + 10 hold + 5 into out)
    const egress = calculateFadeOpacity({
      currentFrame: 30,
      mode: 'in-out',
      delay: 5,
      inDuration: inD,
      holdDuration: holdD,
      outDuration: outD,
      easing: 'linear',
    });
    assert.equal(egress.phase, 'out');
    assert.equal(egress.opacity, 0.5);

    // Phase 4: Complete (frame 40 > 35)
    const finished = calculateFadeOpacity({
      currentFrame: 40,
      mode: 'in-out',
      delay: 5,
      inDuration: inD,
      holdDuration: holdD,
      outDuration: outD,
    });
    assert.equal(finished.phase, 'complete');
    assert.equal(finished.opacity, 0);
    assert.equal(finished.isComplete, true);
  });
});

test('FadeTransition: Mode "crossfade" (Dual-Layer Dissolve)', async (t) => {
  await t.test('initial frame shows full outgoing and zero incoming layer', () => {
    const state = calculateFadeOpacity({
      currentFrame: 0,
      mode: 'crossfade',
      delay: 10,
      duration: 30,
    });
    assert.equal(state.outgoingOpacity, 1);
    assert.equal(state.incomingOpacity, 0);
    assert.equal(state.progress, 0);
    assert.equal(state.isComplete, false);
  });

  await t.test('midpoint frame cross-dissolves both layers at equal balance', () => {
    const state = calculateFadeOpacity({
      currentFrame: 25, // 10 delay + 15 mid
      mode: 'crossfade',
      delay: 10,
      duration: 30,
      easing: 'linear',
    });
    assert.equal(state.progress, 0.5);
    assert.equal(state.outgoingOpacity, 0.5);
    assert.equal(state.incomingOpacity, 0.5);
  });

  await t.test('completion frame has zero outgoing and full incoming layer', () => {
    const state = calculateFadeOpacity({
      currentFrame: 45,
      mode: 'crossfade',
      delay: 10,
      duration: 30,
    });
    assert.equal(state.outgoingOpacity, 0);
    assert.equal(state.incomingOpacity, 1);
    assert.equal(state.progress, 1);
    assert.equal(state.isComplete, true);
  });

  await t.test('reverse flag swaps outgoing and incoming roles', () => {
    const state = calculateFadeOpacity({
      currentFrame: 0,
      mode: 'crossfade',
      reverse: true,
      delay: 10,
      duration: 30,
    });
    assert.equal(state.outgoingOpacity, 0);
    assert.equal(state.incomingOpacity, 1);
  });
});

test('FadeTransition: Custom Opacity Range and Direction Alias', async (t) => {
  await t.test('respects custom fromOpacity and toOpacity range', () => {
    const state = calculateFadeOpacity({
      currentFrame: 15,
      mode: 'in',
      delay: 0,
      duration: 30,
      fromOpacity: 0.2,
      toOpacity: 0.8,
      easing: 'linear',
    });
    assert.equal(state.progress, 0.5);
    assert.equal(state.opacity, 0.5); // 0.2 + (0.8 - 0.2) * 0.5 = 0.5
  });

  await t.test('direction="out" maps to mode="out" seamlessly', () => {
    const state = calculateFadeOpacity({
      currentFrame: 30,
      direction: 'out',
      duration: 20,
    });
    assert.equal(state.opacity, 0);
    assert.equal(state.isComplete, true);
  });
});
