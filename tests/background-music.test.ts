/**
 * BackgroundMusic Unit Test Suite
 * Tests frame-accurate timing resolution, composition spanning,
 * automated fade envelopes, keyframe volume interpolation, and disable/mute states.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBackgroundMusicVolume,
  interpolateVolumeKeyframes,
  resolveBackgroundMusicTiming,
} from '../src/components/audio/backgroundMusicStyle.ts';
import type { VolumeKeyframe } from '../src/components/audio/backgroundMusicTypes.ts';

describe('BackgroundMusic - Timing Resolution & Composition Spanning', () => {
  it('automatically spans the entire composition when durationInFrames is omitted', () => {
    const timing = resolveBackgroundMusicTiming({}, 300);
    assert.strictEqual(timing.startFrame, 0);
    assert.strictEqual(timing.durationInFrames, 300);
    assert.strictEqual(timing.endFrame, 300);
  });

  it('spans remaining composition duration when startFrame is non-zero', () => {
    const timing = resolveBackgroundMusicTiming({ startFrame: 45 }, 300);
    assert.strictEqual(timing.startFrame, 45);
    assert.strictEqual(timing.durationInFrames, 255);
    assert.strictEqual(timing.endFrame, 300);
  });

  it('respects explicit durationInFrames', () => {
    const timing = resolveBackgroundMusicTiming({ startFrame: 20, durationInFrames: 120 }, 300);
    assert.strictEqual(timing.startFrame, 20);
    assert.strictEqual(timing.durationInFrames, 120);
    assert.strictEqual(timing.endFrame, 140);
  });

  it('respects explicit endFrame', () => {
    const timing = resolveBackgroundMusicTiming({ startFrame: 30, endFrame: 150 }, 300);
    assert.strictEqual(timing.startFrame, 30);
    assert.strictEqual(timing.durationInFrames, 120);
    assert.strictEqual(timing.endFrame, 150);
  });

  it('clamps track duration to composition end frame by default', () => {
    const timing = resolveBackgroundMusicTiming(
      { startFrame: 260, durationInFrames: 100, clampToComposition: true },
      300,
    );
    assert.strictEqual(timing.startFrame, 260);
    assert.strictEqual(timing.durationInFrames, 40);
    assert.strictEqual(timing.endFrame, 300);
  });

  it('supports duration exceeding composition when clampToComposition is false', () => {
    const timing = resolveBackgroundMusicTiming(
      { startFrame: 260, durationInFrames: 100, clampToComposition: false },
      300,
    );
    assert.strictEqual(timing.startFrame, 260);
    assert.strictEqual(timing.durationInFrames, 100);
    assert.strictEqual(timing.endFrame, 360);
  });

  it('normalizes aliases fadeInDuration and fadeOutDuration', () => {
    const timing = resolveBackgroundMusicTiming({ fadeInDuration: 25, fadeOutDuration: 35 }, 300);
    assert.strictEqual(timing.fadeInFrames, 25);
    assert.strictEqual(timing.fadeOutFrames, 35);
  });
});

describe('BackgroundMusic - Volume Keyframes Interpolation', () => {
  it('returns base volume when keyframe list is empty or undefined', () => {
    const vol = interpolateVolumeKeyframes(undefined, 50, 0.8);
    assert.strictEqual(vol, 0.8);
  });

  it('holds first keyframe volume for frames before the first keyframe', () => {
    const keyframes: VolumeKeyframe[] = [
      { frame: 30, volume: 0.5 },
      { frame: 90, volume: 1.0 },
    ];
    const vol = interpolateVolumeKeyframes(keyframes, 10, 1.0);
    assert.strictEqual(vol, 0.5);
  });

  it('holds last keyframe volume for frames after the last keyframe', () => {
    const keyframes: VolumeKeyframe[] = [
      { frame: 30, volume: 0.5 },
      { frame: 90, volume: 1.0 },
    ];
    const vol = interpolateVolumeKeyframes(keyframes, 120, 1.0);
    assert.strictEqual(vol, 1.0);
  });

  it('linearly interpolates midpoint between two keyframes', () => {
    const keyframes: VolumeKeyframe[] = [
      { frame: 0, volume: 0.2 },
      { frame: 100, volume: 0.8 },
    ];
    const midVol = interpolateVolumeKeyframes(keyframes, 50, 1.0);
    assert.strictEqual(midVol, 0.5);
  });

  it('supports multiple sequential keyframes with volume modulation', () => {
    const keyframes: VolumeKeyframe[] = [
      { frame: 0, volume: 1.0 },
      { frame: 30, volume: 0.3 }, // Dipped during speech
      { frame: 90, volume: 0.3 }, // Held during speech
      { frame: 120, volume: 1.0 }, // Restored
    ];

    // Before dip
    assert.strictEqual(interpolateVolumeKeyframes(keyframes, 0, 0.8), 0.8);
    // At lowest dip
    assert.strictEqual(interpolateVolumeKeyframes(keyframes, 60, 0.8), 0.24);
    // After recovery
    assert.strictEqual(interpolateVolumeKeyframes(keyframes, 120, 0.8), 0.8);
  });

  it('respects relativeStartFrame when keyframes are relative to track start', () => {
    const relativeKeyframes: VolumeKeyframe[] = [
      { frame: 0, volume: 0.0 },
      { frame: 20, volume: 1.0 },
    ];

    // Track starts at frame 50
    const startVal = interpolateVolumeKeyframes(relativeKeyframes, 50, 1.0, 50);
    const midVal = interpolateVolumeKeyframes(relativeKeyframes, 60, 1.0, 50);
    const endVal = interpolateVolumeKeyframes(relativeKeyframes, 70, 1.0, 50);

    assert.strictEqual(startVal, 0.0);
    assert.strictEqual(midVal, 0.5);
    assert.strictEqual(endVal, 1.0);
  });
});

describe('BackgroundMusic - Envelope Boundaries and End Frame Compliance', () => {
  it('defaults base volume to 0.7 when not specified', () => {
    const vol = calculateBackgroundMusicVolume({}, 50, 300);
    assert.strictEqual(vol, 0.7);
  });

  it('calculates deterministic fade-in from 0 to nominal volume', () => {
    const props = {
      volume: 0.8,
      fadeInFrames: 20,
      fadeInEasing: 'linear' as const,
    };

    assert.strictEqual(calculateBackgroundMusicVolume(props, 0, 300), 0.0);
    assert.strictEqual(calculateBackgroundMusicVolume(props, 10, 300), 0.4);
    assert.strictEqual(calculateBackgroundMusicVolume(props, 20, 300), 0.8);
  });

  it('anchors fade-out precisely to the composition end frame', () => {
    const props = {
      volume: 1.0,
      fadeOutFrames: 30,
      fadeOutEasing: 'linear' as const,
    };
    const compDuration = 300;

    // At frame 270 (start of fade-out): full volume
    assert.strictEqual(calculateBackgroundMusicVolume(props, 270, compDuration), 1.0);
    // At frame 285 (midpoint of fade-out): 0.5 volume
    assert.strictEqual(calculateBackgroundMusicVolume(props, 285, compDuration), 0.5);
    // At frame 299 (last active frame): ~0.0333
    const finalActive = calculateBackgroundMusicVolume(props, 299, compDuration);
    assert.ok(finalActive > 0 && finalActive < 0.1);
    // At frame 300 (past end frame): exactly 0
    assert.strictEqual(calculateBackgroundMusicVolume(props, 300, compDuration), 0.0);
  });

  it('proportionally scales fades if fadeIn + fadeOut exceeds duration', () => {
    const props = {
      startFrame: 0,
      durationInFrames: 50,
      fadeInFrames: 40,
      fadeOutFrames: 40,
      volume: 1.0,
    };
    // 40 + 40 = 80 > 50 -> scale = 50 / 80 = 0.625 -> 25f fadeIn, 25f fadeOut
    const start = calculateBackgroundMusicVolume(props, 0, 300);
    const mid = calculateBackgroundMusicVolume(props, 25, 300);
    const end = calculateBackgroundMusicVolume(props, 50, 300);

    assert.strictEqual(start, 0.0);
    assert.ok(mid > 0.8);
    assert.strictEqual(end, 0.0);
  });
});

describe('BackgroundMusic - Enabled, Disabled, and Muted States', () => {
  it('returns 0 volume when enabled is explicitly false', () => {
    const vol = calculateBackgroundMusicVolume({ enabled: false, volume: 0.9 }, 30, 300);
    assert.strictEqual(vol, 0);
  });

  it('returns 0 volume when disabled is true', () => {
    const vol = calculateBackgroundMusicVolume({ disabled: true, volume: 0.9 }, 30, 300);
    assert.strictEqual(vol, 0);
  });

  it('returns 0 volume when muted is true', () => {
    const vol = calculateBackgroundMusicVolume({ muted: true, volume: 0.9 }, 30, 300);
    assert.strictEqual(vol, 0);
  });

  it('scales final volume with masterVolume', () => {
    const vol = calculateBackgroundMusicVolume({ volume: 0.8 }, 50, 300, 0.5);
    assert.strictEqual(vol, 0.4);
  });
});

describe('BackgroundMusic - Keyframe Volume Automation with Envelope Fades', () => {
  it('combines keyframe dip with fade envelopes smoothly', () => {
    const props = {
      volume: 1.0,
      fadeInFrames: 20,
      fadeOutFrames: 20,
      fadeInEasing: 'linear' as const,
      fadeOutEasing: 'linear' as const,
      keyframes: [
        { frame: 40, volume: 1.0 },
        { frame: 60, volume: 0.3 },
        { frame: 80, volume: 1.0 },
      ],
    };

    // Frame 10: inside fade-in (0.5 * 1.0 = 0.5)
    assert.strictEqual(calculateBackgroundMusicVolume(props, 10, 100), 0.5);
    // Frame 60: at lowest keyframe dip
    assert.strictEqual(calculateBackgroundMusicVolume(props, 60, 100), 0.3);
    // Frame 90: inside fade-out (0.5 * 1.0 = 0.5)
    assert.strictEqual(calculateBackgroundMusicVolume(props, 90, 100), 0.5);
  });
});
