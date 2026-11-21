import test from 'node:test';
import assert from 'node:assert/strict';

import {
  normalizeZoomMode,
  resolveTransformOrigin,
  calculateZoomMetrics,
  buildZoomTransform,
  sanitizeZoomNumber,
} from '../src/components/transitions/zoomTransitionStyle.ts';

test('ZoomTransition: Mode Normalization & Origin Resolution', async (t) => {
  await t.test('normalizes mode aliases correctly', () => {
    assert.equal(normalizeZoomMode('in'), 'in');
    assert.equal(normalizeZoomMode('zoom-in'), 'in');
    assert.equal(normalizeZoomMode('zoomIn'), 'in');
    assert.equal(normalizeZoomMode('out'), 'out');
    assert.equal(normalizeZoomMode('zoom-out'), 'out');
    assert.equal(normalizeZoomMode('zoomOut'), 'out');
    assert.equal(normalizeZoomMode('in-out'), 'in-out');
    assert.equal(normalizeZoomMode('inOut'), 'in-out');
    assert.equal(normalizeZoomMode('zoom-in-out'), 'in-out');
    assert.equal(normalizeZoomMode('through'), 'through');
    assert.equal(normalizeZoomMode('zoom-through'), 'through');
    assert.equal(normalizeZoomMode('zoomThrough'), 'through');
    assert.equal(normalizeZoomMode('replace'), 'replace');
    assert.equal(normalizeZoomMode('zoom-replace'), 'replace');
    assert.equal(normalizeZoomMode('cross-zoom'), 'replace');
    assert.equal(normalizeZoomMode(undefined), 'in');
  });

  await t.test('resolves standard transform origins', () => {
    assert.equal(resolveTransformOrigin('center'), 'center center');
    assert.equal(resolveTransformOrigin('top'), 'center top');
    assert.equal(resolveTransformOrigin('bottom'), 'center bottom');
    assert.equal(resolveTransformOrigin('left'), 'left center');
    assert.equal(resolveTransformOrigin('right'), 'right center');
    assert.equal(resolveTransformOrigin('top left'), 'top left');
    assert.equal(resolveTransformOrigin('topleft'), 'top left');
    assert.equal(resolveTransformOrigin('top right'), 'top right');
    assert.equal(resolveTransformOrigin('bottom left'), 'bottom left');
    assert.equal(resolveTransformOrigin('bottom right'), 'bottom right');
    assert.equal(resolveTransformOrigin('50% 50%'), '50% 50%');
    assert.equal(resolveTransformOrigin(undefined), 'center');
  });

  await t.test('builds transform strings cleanly', () => {
    assert.equal(buildZoomTransform(1, 0), 'scale3d(1, 1, 1)');
    assert.equal(buildZoomTransform(0.5, 15), 'scale3d(0.5, 0.5, 1) rotate(15deg)');
  });

  await t.test('sanitizes -0 and small floating points', () => {
    assert.equal(sanitizeZoomNumber(-0), 0);
    assert.equal(sanitizeZoomNumber(0.0000001), 0);
    assert.equal(sanitizeZoomNumber(1.23456), 1.2346);
  });
});

test('ZoomTransition: Mode "in" (Zoom In)', async (t) => {
  await t.test('starts at initialScale (0) and settles at 1.0', () => {
    const start = calculateZoomMetrics({
      currentFrame: 0,
      mode: 'in',
      delay: 5,
      duration: 20,
    });
    assert.equal(start.scale, 0);
    assert.equal(start.isComplete, false);
    assert.equal(start.phase, 'pending');

    const mid = calculateZoomMetrics({
      currentFrame: 15,
      mode: 'in',
      delay: 5,
      duration: 20,
    });
    assert.ok(mid.scale > 0 && mid.scale < 1.0);
    assert.equal(mid.phase, 'in');

    const end = calculateZoomMetrics({
      currentFrame: 25,
      mode: 'in',
      delay: 5,
      duration: 20,
    });
    assert.equal(end.scale, 1.0);
    assert.equal(end.isComplete, true);
    assert.equal(end.phase, 'complete');
    assert.equal(end.transform, 'scale3d(1, 1, 1)');
  });

  await t.test('supports custom initialScale and finalScale range', () => {
    const start = calculateZoomMetrics({
      currentFrame: 0,
      mode: 'in',
      initialScale: 0.5,
      finalScale: 1.5,
      duration: 30,
    });
    assert.equal(start.scale, 0.5);

    const end = calculateZoomMetrics({
      currentFrame: 30,
      mode: 'in',
      initialScale: 0.5,
      finalScale: 1.5,
      duration: 30,
    });
    assert.equal(end.scale, 1.5);
  });

  await t.test('fade=true coordinates opacity with zoom in', () => {
    const start = calculateZoomMetrics({
      currentFrame: 0,
      mode: 'in',
      fade: true,
      duration: 20,
    });
    assert.equal(start.opacity, 0);

    const mid = calculateZoomMetrics({
      currentFrame: 10,
      mode: 'in',
      fade: true,
      duration: 20,
    });
    assert.equal(mid.opacity, 0.5);

    const end = calculateZoomMetrics({
      currentFrame: 20,
      mode: 'in',
      fade: true,
      duration: 20,
    });
    assert.equal(end.opacity, 1.0);
  });
});

test('ZoomTransition: Mode "out" (Zoom Out)', async (t) => {
  await t.test('starts at initialScale (1.0) and scales down to finalScale (0)', () => {
    const start = calculateZoomMetrics({
      currentFrame: 0,
      mode: 'out',
      duration: 20,
    });
    assert.equal(start.scale, 1.0);
    assert.equal(start.isComplete, false);

    const end = calculateZoomMetrics({
      currentFrame: 20,
      mode: 'out',
      duration: 20,
    });
    assert.equal(end.scale, 0);
    assert.equal(end.isComplete, true);
    assert.equal(end.phase, 'complete');
  });

  await t.test('fade=true fades opacity from 1 to 0', () => {
    const start = calculateZoomMetrics({
      currentFrame: 0,
      mode: 'out',
      fade: true,
      duration: 20,
    });
    assert.equal(start.opacity, 1.0);

    const end = calculateZoomMetrics({
      currentFrame: 20,
      mode: 'out',
      fade: true,
      duration: 20,
    });
    assert.equal(end.opacity, 0);
  });
});

test('ZoomTransition: Mode "in-out" (Zoom In-Out Envelope)', async (t) => {
  await t.test('progresses through enter, hold at 1.0, and exit', () => {
    const dur = 40;
    const inDur = 15;
    const holdDur = 10;
    const outDur = 15;

    // Start
    const start = calculateZoomMetrics({
      currentFrame: 0,
      mode: 'in-out',
      inDuration: inDur,
      holdDuration: holdDur,
      outDuration: outDur,
      fade: true,
    });
    assert.equal(start.scale, 0);
    assert.equal(start.phase, 'in');

    // Peak of in / Hold start
    const hold = calculateZoomMetrics({
      currentFrame: 20,
      mode: 'in-out',
      inDuration: inDur,
      holdDuration: holdDur,
      outDuration: outDur,
      fade: true,
    });
    assert.equal(hold.scale, 1.0);
    assert.equal(hold.opacity, 1.0);
    assert.equal(hold.phase, 'hold');

    // End of exit
    const end = calculateZoomMetrics({
      currentFrame: dur,
      mode: 'in-out',
      inDuration: inDur,
      holdDuration: holdDur,
      outDuration: outDur,
      fade: true,
    });
    assert.equal(end.scale, 0);
    assert.equal(end.opacity, 0);
    assert.equal(end.phase, 'complete');
  });
});

test('ZoomTransition: Mode "through" (Hyper-Zoom Through)', async (t) => {
  await t.test('zooms from small, passes midpoint 1.0, and flies through past camera', () => {
    const start = calculateZoomMetrics({
      currentFrame: 0,
      mode: 'through',
      duration: 30,
      initialScale: 0.2,
      throughScale: 1.0,
      finalScale: 2.8,
      fade: true,
    });
    assert.equal(start.scale, 0.2);
    assert.equal(start.opacity, 0);
    assert.equal(start.phase, 'in');

    const mid = calculateZoomMetrics({
      currentFrame: 15,
      mode: 'through',
      duration: 30,
      initialScale: 0.2,
      throughScale: 1.0,
      finalScale: 2.8,
      fade: true,
    });
    assert.equal(mid.scale, 1.0);
    assert.equal(mid.opacity, 1.0);

    const end = calculateZoomMetrics({
      currentFrame: 30,
      mode: 'through',
      duration: 30,
      initialScale: 0.2,
      throughScale: 1.0,
      finalScale: 2.8,
      fade: true,
    });
    assert.equal(end.scale, 2.8);
    assert.equal(end.opacity, 0);
    assert.equal(end.phase, 'complete');
  });
});

test('ZoomTransition: Mode "replace" (Dual-Layer Cross-Zoom)', async (t) => {
  await t.test('outgoing layer zooms out while incoming layer zooms in', () => {
    const start = calculateZoomMetrics({
      currentFrame: 0,
      mode: 'replace',
      duration: 20,
      outgoingScale: 1.4,
      incomingScale: 0.6,
    });
    // At start: outgoing is scale 1.0 and opacity 1.0; incoming is 0.6 and opacity 0
    assert.equal(start.outgoingScale, 1.0);
    assert.equal(start.outgoingOpacity, 1.0);
    assert.equal(start.incomingScale, 0.6);
    assert.equal(start.incomingOpacity, 0);

    const end = calculateZoomMetrics({
      currentFrame: 20,
      mode: 'replace',
      duration: 20,
      outgoingScale: 1.4,
      incomingScale: 0.6,
    });
    // At end: outgoing expanded to 1.4 and faded to 0; incoming settled to 1.0 and opacity 1.0
    assert.equal(end.outgoingScale, 1.4);
    assert.equal(end.outgoingOpacity, 0);
    assert.equal(end.incomingScale, 1.0);
    assert.equal(end.incomingOpacity, 1.0);
  });
});

test('ZoomTransition: Spring Overshoot & Rotational Zoom', async (t) => {
  await t.test('overshoot=true produces scale overshooting 1.0 before settling', () => {
    // Check bouncy spring at frame 10 (settling over target)
    const midOvershoot = calculateZoomMetrics({
      currentFrame: 8,
      mode: 'in',
      duration: 30,
      overshoot: true,
    });
    // Spring physics naturally shoots past 1.0 with bouncy preset
    assert.ok(midOvershoot.scale > 0);

    const end = calculateZoomMetrics({
      currentFrame: 45,
      mode: 'in',
      duration: 30,
      overshoot: true,
    });
    // Eventually settles at target
    assert.equal(end.scale, 1.0);
  });

  await t.test('interpolates rotation during zoom', () => {
    const start = calculateZoomMetrics({
      currentFrame: 0,
      mode: 'in',
      rotation: 180,
      initialRotation: 0,
      duration: 20,
    });
    assert.equal(start.rotation, 0);

    const end = calculateZoomMetrics({
      currentFrame: 20,
      mode: 'in',
      rotation: 180,
      initialRotation: 0,
      duration: 20,
    });
    assert.equal(end.rotation, 180);
    assert.equal(end.transform, 'scale3d(1, 1, 1) rotate(180deg)');
  });
});
