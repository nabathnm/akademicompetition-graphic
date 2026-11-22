/**
 * Component Integration Unit Test Suite
 * Validates cross-library interoperability, timing prop standardization (startFrame vs delay),
 * typography text/children flexibility, spatial annotation math, container fit calculations,
 * and seamless transition/timeline integration.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  resolveEffectiveTiming,
  calculateAnnotationCoordinates,
  calculateNestedSequenceStagger,
  validateContainerFit,
  getIntegrationTheme,
  INTEGRATION_SCENARIOS,
} from '../src/playground/showcases/componentIntegrationStyle.ts';

import { calculateButtonMotion } from '../src/components/ui/animatedButtonStyle.ts';
import { calculateCardMotion } from '../src/components/ui/animatedCardStyle.ts';
import { calculateNotificationMotion } from '../src/components/ui/animatedNotificationStyle.ts';
import { resolveArrowAnimationConfig, resolveArrowCoordinates } from '../src/components/graphics/animatedArrowStyle.ts';
import { resolveCircleAnimationConfig, resolveCircleDimensions } from '../src/components/graphics/animatedCircleStyle.ts';
import { resolveLineAnimationConfig, resolveLineCoordinates } from '../src/components/graphics/animatedLineStyle.ts';
import { calculateAnimatedTextStyle } from '../src/components/typography/animatedTextStyle.ts';
import { buildTimelineComposition, inspectTimelineAtFrame } from '../src/utils/timing/TimelineManager.ts';
import type { TimelineInputConfig } from '../src/utils/timing/timelineTypes.ts';

describe('Component Integration - Timing Prop Normalization', () => {
  it('resolves startFrame when delay is undefined', () => {
    const timing = resolveEffectiveTiming({ startFrame: 25 });
    assert.strictEqual(timing, 25);
  });

  it('resolves delay when provided and non-zero', () => {
    const timing = resolveEffectiveTiming({ delay: 18 });
    assert.strictEqual(timing, 18);
  });

  it('prefers non-zero delay over startFrame for backward compatibility with delay-first components', () => {
    const timing = resolveEffectiveTiming({ startFrame: 10, delay: 20 });
    assert.strictEqual(timing, 20);
  });

  it('falls back to startFrame when delay is 0', () => {
    const timing = resolveEffectiveTiming({ startFrame: 15, delay: 0 });
    assert.strictEqual(timing, 15);
  });

  it('defaults to 0 when both are omitted', () => {
    const timing = resolveEffectiveTiming({});
    assert.strictEqual(timing, 0);
  });
});

describe('Component Integration - Cross-Library Style & Config Interoperability', () => {
  it('calculateButtonMotion respects startFrame timing', () => {
    // Hidden before frame 10
    const beforeStart = calculateButtonMotion({
      currentFrame: 5,
      fps: 30,
      startFrame: 10,
    });
    assert.strictEqual(beforeStart.opacity, 0);
    assert.strictEqual(beforeStart.visibility, 'hidden');

    // Visible after frame 10
    const afterStart = calculateButtonMotion({
      currentFrame: 15,
      fps: 30,
      startFrame: 10,
    });
    assert.ok(afterStart.opacity > 0);
    assert.strictEqual(afterStart.visibility, 'visible');
  });

  it('calculateCardMotion respects startFrame and delay timing interoperability', () => {
    const beforeEntrance = calculateCardMotion({
      currentFrame: 5,
      startFrame: 15,
      durationInFrames: 20,
    });
    assert.strictEqual(beforeEntrance.opacity, 0);
    assert.strictEqual(beforeEntrance.visibility, 'hidden');

    const settledCard = calculateCardMotion({
      currentFrame: 40,
      startFrame: 15,
      durationInFrames: 20,
    });
    assert.strictEqual(settledCard.opacity, 1);
    assert.strictEqual(settledCard.visibility, 'visible');

    // Also supports delay directly
    const delayCard = calculateCardMotion({
      currentFrame: 5,
      delay: 15,
      durationInFrames: 20,
    });
    assert.strictEqual(delayCard.opacity, 0);
  });

  it('calculateNotificationMotion handles startFrame correctly across lifecycle', () => {
    const beforeNotification = calculateNotificationMotion({
      currentFrame: 5,
      startFrame: 10,
      durationInFrames: 15,
    });
    assert.strictEqual(beforeNotification.opacity, 0);
    assert.strictEqual(beforeNotification.visibility, 'hidden');

    const visibleNotification = calculateNotificationMotion({
      currentFrame: 25,
      startFrame: 10,
      durationInFrames: 15,
    });
    assert.strictEqual(visibleNotification.opacity, 1);
    assert.strictEqual(visibleNotification.visibility, 'visible');
  });

  it('AnimatedArrow resolves delay from startFrame when delay is 0 or omitted', () => {
    const configFromStart = resolveArrowAnimationConfig({
      direction: 'right',
      startFrame: 14,
      durationInFrames: 20,
    });
    assert.strictEqual(configFromStart.delay, 14);

    const configExplicitDelay = resolveArrowAnimationConfig({
      direction: 'right',
      delay: 24,
      durationInFrames: 20,
    });
    assert.strictEqual(configExplicitDelay.delay, 24);

    const coords = resolveArrowCoordinates({ direction: 'right', length: 150 });
    assert.strictEqual(coords.length, 150);
  });

  it('AnimatedCircle resolves delay from startFrame correctly', () => {
    const configFromStart = resolveCircleAnimationConfig({
      startFrame: 12,
      durationInFrames: 15,
    });
    assert.strictEqual(configFromStart.delay, 12);

    const dims = resolveCircleDimensions({ radius: 40 });
    assert.strictEqual(dims.radius, 40);
    assert.strictEqual(dims.diameter, 80);
  });

  it('AnimatedLine resolves delay from startFrame correctly', () => {
    const configFromStart = resolveLineAnimationConfig({
      direction: 'right',
      startFrame: 18,
      durationInFrames: 25,
    });
    assert.strictEqual(configFromStart.delay, 18);

    const coords = resolveLineCoordinates({ direction: 'right', length: 200 });
    assert.strictEqual(coords.length, 200);
  });

  it('AnimatedText behaves deterministically with startFrame and delay', () => {
    const beforeText = calculateAnimatedTextStyle({
      currentFrame: 4,
      fps: 30,
      startFrame: 10,
      durationInFrames: 15,
      variant: 'slide-up',
    });
    assert.strictEqual(beforeText.opacity, 0);
    assert.strictEqual(beforeText.visibility, 'hidden');

    const settledText = calculateAnimatedTextStyle({
      currentFrame: 30,
      fps: 30,
      startFrame: 10,
      durationInFrames: 15,
      variant: 'slide-up',
    });
    assert.strictEqual(settledText.opacity, 1);
    assert.strictEqual(settledText.visibility, 'visible');
    assert.strictEqual(settledText.transform, 'translateY(0.00px)');
  });
});

describe('Component Integration - Mathematical & Spatial Helpers', () => {
  it('calculates correct coordinate deltas and Euclidean distance for vector annotations', () => {
    const coords = calculateAnnotationCoordinates(
      { x: 100, y: 100 },
      { x: 400, y: 500 },
    );

    assert.strictEqual(coords.startX, 100);
    assert.strictEqual(coords.startY, 100);
    assert.strictEqual(coords.endX, 400);
    assert.strictEqual(coords.endY, 500);
    assert.strictEqual(coords.deltaX, 300);
    assert.strictEqual(coords.deltaY, 400);
    assert.strictEqual(coords.distance, 500); // 3-4-5 right triangle
  });

  it('handles negative direction vector annotations', () => {
    const coords = calculateAnnotationCoordinates(
      { x: 500, y: 300 },
      { x: 200, y: 100 },
    );

    assert.strictEqual(coords.deltaX, -300);
    assert.strictEqual(coords.deltaY, -200);
    assert.strictEqual(coords.distance, Math.round(Math.hypot(-300, -200)));
  });

  it('handles zero-length vector gracefully without NaN', () => {
    const coords = calculateAnnotationCoordinates(
      { x: 250, y: 250 },
      { x: 250, y: 250 },
    );

    assert.strictEqual(coords.deltaX, 0);
    assert.strictEqual(coords.deltaY, 0);
    assert.strictEqual(coords.distance, 0);
  });

  it('calculates nested sequence stagger intervals correctly', () => {
    const stagger = calculateNestedSequenceStagger(15, 4, 6);

    assert.strictEqual(stagger.length, 4);
    assert.deepStrictEqual(stagger, [
      { index: 0, startFrame: 15 },
      { index: 1, startFrame: 21 },
      { index: 2, startFrame: 27 },
      { index: 3, startFrame: 33 },
    ]);
  });

  it('validates container fit and detects bounding overflow accurately', () => {
    // Fits comfortably
    const comfortable = validateContainerFit(
      { width: 800, height: 600 },
      { width: 500, height: 350, padding: 20 },
    );
    assert.strictEqual(comfortable.fits, true);
    assert.strictEqual(comfortable.horizontalOverflow, 0);
    assert.strictEqual(comfortable.verticalOverflow, 0);

    // Horizontal overflow
    const hOverflow = validateContainerFit(
      { width: 400, height: 600 },
      { width: 450, height: 200 },
    );
    assert.strictEqual(hOverflow.fits, false);
    assert.strictEqual(hOverflow.horizontalOverflow, 50);
    assert.strictEqual(hOverflow.verticalOverflow, 0);

    // Vertical overflow with padding
    const vOverflow = validateContainerFit(
      { width: 600, height: 300 },
      { width: 400, height: 280, padding: 20 },
    );
    assert.strictEqual(vOverflow.fits, false);
    assert.strictEqual(vOverflow.horizontalOverflow, 0);
    assert.strictEqual(vOverflow.verticalOverflow, 20); // (280 + 40) - 300 = 20
  });

  it('returns appropriate active and inactive theme tokens', () => {
    const activeTheme = getIntegrationTheme(true);
    assert.ok(activeTheme.backgroundColor.includes('rgba'));
    assert.strictEqual(activeTheme.borderColor, '#00D1FF');

    const inactiveTheme = getIntegrationTheme(false);
    assert.ok(inactiveTheme.borderColor.includes('rgba'));
  });
});

describe('Component Integration - Multi-Scene Timeline & Transition Integration', () => {
  it('integrates SceneSequence scenes with TransitionController settings via TimelineManager', () => {
    const timelineConfig: TimelineInputConfig = {
      fps: 30,
      scenes: [
        {
          id: 'hero-scene',
          durationInFrames: 60,
          transition: {
            type: 'fade',
            durationInFrames: 15,
          },
        },
        {
          id: 'product-showcase-scene',
          durationInFrames: 60,
          transition: {
            type: 'slide',
            direction: 'left',
            durationInFrames: 20,
          },
        },
      ],
    };

    const timeline = buildTimelineComposition(timelineConfig);

    assert.strictEqual(timeline.scenes.length, 2);
    assert.strictEqual(timeline.scenes[0].id, 'hero-scene');
    assert.strictEqual(timeline.scenes[0].startFrame, 0);
    assert.strictEqual(timeline.scenes[0].durationInFrames, 60);

    assert.strictEqual(timeline.scenes[1].id, 'product-showcase-scene');
    assert.strictEqual(timeline.scenes[1].startFrame, 60);
    assert.strictEqual(timeline.scenes[1].durationInFrames, 60);

    assert.strictEqual(timeline.totalDurationInFrames, 120);

    // Verify transitions were registered
    assert.strictEqual(timeline.transitions.length, 2);
    assert.strictEqual(timeline.transitions[0].type, 'fade');
    assert.strictEqual(timeline.transitions[1].type, 'slide');

    // Inspect active scene during scene 1
    const frame20 = inspectTimelineAtFrame(timeline, 20);
    assert.strictEqual(frame20.primaryActiveScene?.id, 'hero-scene');

    // Inspect active scene during scene 2 transition window
    const frame65 = inspectTimelineAtFrame(timeline, 65);
    assert.strictEqual(frame65.primaryActiveScene?.id, 'product-showcase-scene');
    assert.ok(frame65.activeTransitions.length > 0);
    assert.strictEqual(frame65.activeTransitions[0].type, 'slide');
  });

  it('declares and covers all 6 required integration scenarios in metadata', () => {
    assert.strictEqual(INTEGRATION_SCENARIOS.length, 6);
    const expectedIds = [
      'card-typography',
      'button-device',
      'graphics-typography',
      'smartphone-ui',
      'scene-transitions',
      'all-in-scene',
    ];

    const actualIds = INTEGRATION_SCENARIOS.map((s) => s.id);
    assert.deepStrictEqual(actualIds, expectedIds);

    for (const scenario of INTEGRATION_SCENARIOS) {
      assert.ok(scenario.title.length > 0);
      assert.ok(scenario.subtitle.length > 0);
      assert.ok(scenario.description.length > 0);
      assert.ok(scenario.categoryTags.length >= 2);
    }
  });
});
