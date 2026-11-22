/**
 * BackgroundMusic Mathematical Engine & Volume Interpolation Logic
 * Deterministic frame-accurate keyframe interpolation, fade timing, and volume resolution.
 *
 * Layer 2 / Layer 3 of the Motion Graphics Framework.
 */

import { clamp } from '../../utils/animation/clamp.ts';
import { linear, resolveEasing } from '../../utils/animation/easing.ts';
import type { AudioVolumeMetrics, AudioVolumeProp } from './audioTrackTypes.ts';
import type { BackgroundMusicProps, VolumeKeyframe } from './backgroundMusicTypes.ts';

/**
 * Resolved timing metadata for background music playback.
 */
export interface ResolvedBackgroundMusicTiming {
  startFrame: number;
  durationInFrames: number;
  endFrame: number;
  fadeInFrames: number;
  fadeOutFrames: number;
}

/**
 * Resolves frame-accurate timing bounds for BackgroundMusic.
 * If duration is omitted, background music automatically stretches to the composition's end frame.
 */
export function resolveBackgroundMusicTiming(
  props: BackgroundMusicProps,
  compositionDuration = 300,
): ResolvedBackgroundMusicTiming {
  const startFrame = Math.max(0, Math.floor(props.startFrame ?? props.startAtFrame ?? 0));

  let durationInFrames: number;
  if (props.durationInFrames !== undefined) {
    durationInFrames = Math.max(0, Math.floor(props.durationInFrames));
  } else if (props.endFrame !== undefined) {
    durationInFrames = Math.max(0, Math.floor(props.endFrame - startFrame));
  } else {
    // Automatically span across the entire remaining composition
    durationInFrames = Math.max(0, compositionDuration - startFrame);
  }

  // Enforce composition bounds clamp unless explicitly disabled
  if (props.clampToComposition !== false) {
    const maxAvailable = Math.max(0, compositionDuration - startFrame);
    durationInFrames = Math.min(durationInFrames, maxAvailable);
  }

  const endFrame = startFrame + durationInFrames;
  const fadeInFrames = Math.max(0, Math.floor(props.fadeInFrames ?? props.fadeInDuration ?? 0));
  const fadeOutFrames = Math.max(0, Math.floor(props.fadeOutFrames ?? props.fadeOutDuration ?? 0));

  return {
    startFrame,
    durationInFrames,
    endFrame,
    fadeInFrames,
    fadeOutFrames,
  };
}

/**
 * Deterministically interpolates volume across an arbitrary sequence of keyframes.
 * Supports linear, cubic-bezier, and custom easing curves between adjacent keyframe nodes.
 *
 * @param keyframes List of volume keyframes
 * @param currentFrame Timeline frame to evaluate
 * @param baseVolume Base nominal volume multiplier (default: 1.0)
 * @param relativeStartFrame Frame offset if keyframes are relative to music start (default: 0)
 * @returns Evaluated volume multiplier
 */
export function interpolateVolumeKeyframes(
  keyframes: VolumeKeyframe[] | undefined,
  currentFrame: number,
  baseVolume = 1.0,
  relativeStartFrame = 0,
): number {
  if (!keyframes || keyframes.length === 0) {
    return Math.max(0, baseVolume);
  }

  const effectiveFrame = currentFrame - relativeStartFrame;

  // Sort keyframes chronologically
  const sorted = [...keyframes].sort((a, b) => a.frame - b.frame);

  // Before first keyframe: hold first keyframe value
  if (effectiveFrame <= sorted[0].frame) {
    return Math.max(0, Number((sorted[0].volume * baseVolume).toFixed(4)));
  }

  // After last keyframe: hold last keyframe value
  const lastIndex = sorted.length - 1;
  if (effectiveFrame >= sorted[lastIndex].frame) {
    return Math.max(0, Number((sorted[lastIndex].volume * baseVolume).toFixed(4)));
  }

  // Find surrounding keyframe interval [prev, next]
  let prevIndex = 0;
  for (let i = 0; i < sorted.length - 1; i++) {
    if (effectiveFrame >= sorted[i].frame && effectiveFrame <= sorted[i + 1].frame) {
      prevIndex = i;
      break;
    }
  }

  const prevNode = sorted[prevIndex];
  const nextNode = sorted[prevIndex + 1];

  const span = nextNode.frame - prevNode.frame;
  if (span <= 0) {
    return Math.max(0, Number((nextNode.volume * baseVolume).toFixed(4)));
  }

  const rawProgress = clamp(0, 1, (effectiveFrame - prevNode.frame) / span);
  const easingFn = nextNode.easing ? (resolveEasing(nextNode.easing) ?? linear) : linear;
  const easedProgress = clamp(0, 1, easingFn(rawProgress));

  const interpolated = prevNode.volume + (nextNode.volume - prevNode.volume) * easedProgress;
  const finalValue = Math.max(0, interpolated * baseVolume);

  return Number(finalValue.toFixed(4));
}

/**
 * Calculates deterministic background music volume for a given frame,
 * combining base volume, volume keyframes, and fade envelopes.
 */
export function calculateBackgroundMusicVolume(
  props: BackgroundMusicProps,
  globalFrame: number,
  compositionDuration = 300,
  masterVolume = 1.0,
): number {
  if (props.disabled || props.enabled === false) {
    return 0;
  }
  if (props.muted) {
    return 0;
  }

  const timing = resolveBackgroundMusicTiming(props, compositionDuration);

  // Outside playback interval
  if (globalFrame < timing.startFrame || globalFrame >= timing.endFrame) {
    return 0;
  }

  // 1. Resolve base volume
  const rawBaseProp: AudioVolumeProp = props.volume ?? 0.7;
  let nominalBase = 0.7;

  if (typeof rawBaseProp === 'function') {
    const dummyMetrics: AudioVolumeMetrics = {
      globalFrame,
      localFrame: globalFrame - timing.startFrame,
      baseVolume: 0.7,
      fadeMultiplier: 1.0,
      finalVolume: 0.7,
      isFadingIn: false,
      isFadingOut: false,
      isMuted: false,
      phase: 'hold',
    };
    nominalBase = rawBaseProp(globalFrame, dummyMetrics);
  } else if (typeof rawBaseProp === 'number') {
    nominalBase = rawBaseProp;
  }

  // 2. Resolve Keyframes
  const keyframes = props.keyframes ?? props.volumeKeyframes;
  const keyframedVolume = interpolateVolumeKeyframes(
    keyframes,
    globalFrame,
    nominalBase,
    props.keyframesRelative ? timing.startFrame : 0,
  );

  // 3. Resolve Fade Envelope
  const localFrame = globalFrame - timing.startFrame;
  const duration = timing.durationInFrames;
  let fadeIn = timing.fadeInFrames;
  let fadeOut = timing.fadeOutFrames;

  if (fadeIn + fadeOut > duration && duration > 0) {
    const scale = duration / (fadeIn + fadeOut);
    fadeIn = Math.floor(fadeIn * scale);
    fadeOut = Math.floor(fadeOut * scale);
  }

  let fadeMultiplier = 1.0;
  if (fadeIn > 0 && localFrame < fadeIn) {
    const progress = clamp(0, 1, localFrame / fadeIn);
    const easeFn = props.fadeInEasing ? (resolveEasing(props.fadeInEasing) ?? linear) : linear;
    fadeMultiplier = clamp(0, 1, easeFn(progress));
  } else if (fadeOut > 0 && localFrame >= duration - fadeOut) {
    const framesIntoFade = localFrame - (duration - fadeOut);
    const progress = clamp(0, 1, framesIntoFade / fadeOut);
    const easeFn = props.fadeOutEasing ? (resolveEasing(props.fadeOutEasing) ?? linear) : linear;
    fadeMultiplier = clamp(0, 1, 1 - easeFn(progress));
  }

  const finalVolume = keyframedVolume * fadeMultiplier * masterVolume;
  return Math.max(0, Number(finalVolume.toFixed(4)));
}
