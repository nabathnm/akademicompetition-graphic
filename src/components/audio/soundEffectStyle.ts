/**
 * SoundEffect Mathematical Engine & Preset Timing Logic
 * Deterministic frame-accurate triggering, envelope resolution, preset definitions,
 * and transition synchronization utilities.
 *
 * Layer 2 / Layer 3 of the Motion Graphics Framework.
 */

import { clamp } from '../../utils/animation/clamp.ts';
import { linear, resolveEasing } from '../../utils/animation/easing.ts';
import type { AudioVolumeMetrics, AudioVolumeProp } from './audioTrackTypes.ts';
import { SILENT_AUDIO_DATA_URI } from './audioTrackStyle.ts';
import type {
  SoundEffectPresetConfig,
  SoundEffectPresetName,
  SoundEffectProps,
  TransitionSoundSyncOptions,
} from './soundEffectTypes.ts';

/**
 * Built-in standard procedural sound effect presets.
 * Preconfigured with characteristic durations, decay envelopes, and preview tone frequencies.
 */
export const SFX_PRESETS: Record<SoundEffectPresetName, SoundEffectPresetConfig> = {
  'ui-click': {
    name: 'UI Click',
    durationInFrames: 6,
    toneFrequency: 880, // A5
    fadeInFrames: 0,
    fadeOutFrames: 2,
    defaultVolume: 0.9,
  },
  whoosh: {
    name: 'Transition Whoosh',
    durationInFrames: 20,
    toneFrequency: 280, // C#4
    fadeInFrames: 5,
    fadeOutFrames: 9,
    defaultVolume: 0.85,
  },
  notification: {
    name: 'Notification Chime',
    durationInFrames: 24,
    toneFrequency: 1046, // C6
    fadeInFrames: 2,
    fadeOutFrames: 12,
    defaultVolume: 0.95,
  },
  pop: {
    name: 'UI Pop',
    durationInFrames: 8,
    toneFrequency: 587, // D5
    fadeInFrames: 1,
    fadeOutFrames: 3,
    defaultVolume: 0.8,
  },
  success: {
    name: 'Success Chime',
    durationInFrames: 32,
    toneFrequency: 659, // E5
    fadeInFrames: 3,
    fadeOutFrames: 16,
    defaultVolume: 1.0,
  },
  error: {
    name: 'Error Buzz',
    durationInFrames: 16,
    toneFrequency: 196, // G3
    fadeInFrames: 2,
    fadeOutFrames: 6,
    defaultVolume: 0.85,
  },
  switch: {
    name: 'Toggle Switch',
    durationInFrames: 5,
    toneFrequency: 1174, // D6
    fadeInFrames: 0,
    fadeOutFrames: 2,
    defaultVolume: 0.75,
  },
  shutter: {
    name: 'Camera Shutter',
    durationInFrames: 10,
    toneFrequency: 740, // F#5
    fadeInFrames: 1,
    fadeOutFrames: 4,
    defaultVolume: 0.9,
  },
  impact: {
    name: 'Dramatic Impact',
    durationInFrames: 28,
    toneFrequency: 130, // C3
    fadeInFrames: 2,
    fadeOutFrames: 18,
    defaultVolume: 1.0,
  },
};

/**
 * Resolved timing metadata for a sound effect.
 */
export interface ResolvedSoundEffectTiming {
  startFrame: number;
  durationInFrames: number;
  endFrame: number;
  fadeInFrames: number;
  fadeOutFrames: number;
  toneFrequency?: number;
  resolvedSrc: string;
  name: string;
}

/**
 * Resolves frame-accurate timing and preset defaults for a sound effect.
 */
export function resolveSoundEffectTiming(
  props: SoundEffectProps,
  compositionDuration = 300,
): ResolvedSoundEffectTiming {
  const rawTrigger = props.triggerFrame ?? props.startFrame ?? props.startAtFrame ?? 0;
  const delay = props.delayFrames ?? 0;
  const startFrame = Math.max(0, Math.floor(rawTrigger + delay));

  const presetConfig = props.preset ? SFX_PRESETS[props.preset] : undefined;

  // Resolve duration
  let durationInFrames: number;
  if (props.durationInFrames !== undefined) {
    durationInFrames = Math.max(1, Math.floor(props.durationInFrames));
  } else if (props.endFrame !== undefined) {
    durationInFrames = Math.max(1, Math.floor(props.endFrame - startFrame));
  } else if (presetConfig) {
    durationInFrames = presetConfig.durationInFrames;
  } else {
    // Standard short sound effect default
    durationInFrames = 15;
  }

  // Enforce composition bounds clamp unless explicitly disabled
  if (props.clampToComposition !== false) {
    const maxAvailable = Math.max(1, compositionDuration - startFrame);
    durationInFrames = Math.min(durationInFrames, maxAvailable);
  }

  const endFrame = startFrame + durationInFrames;

  // Envelopes: check explicit props first, fallback to preset defaults, then 0
  const fadeInFrames = Math.max(
    0,
    Math.floor(props.fadeInFrames ?? props.fadeInDuration ?? presetConfig?.fadeInFrames ?? 0),
  );
  const fadeOutFrames = Math.max(
    0,
    Math.floor(props.fadeOutFrames ?? props.fadeOutDuration ?? presetConfig?.fadeOutFrames ?? 0),
  );

  const toneFrequency = props.toneFrequency ?? presetConfig?.toneFrequency;
  const resolvedSrc = props.src || SILENT_AUDIO_DATA_URI;
  const name = props.name ?? presetConfig?.name ?? (props.id ? `SFX: ${props.id}` : 'Sound Effect');

  return {
    startFrame,
    durationInFrames,
    endFrame,
    fadeInFrames,
    fadeOutFrames,
    toneFrequency,
    resolvedSrc,
    name,
  };
}

/**
 * Deterministically evaluates sound effect volume at a given composition frame.
 * Guaranteed to return 0 outside [startFrame, endFrame), preventing accidental playback.
 */
export function calculateSoundEffectVolume(
  props: SoundEffectProps,
  globalFrame: number,
  compositionDuration = 300,
  masterVolume = 1.0,
): number {
  if (props.disabled || props.enabled === false || props.muted) {
    return 0;
  }

  const timing = resolveSoundEffectTiming(props, compositionDuration);

  // Strict boundary check: completely silent outside the intended trigger window
  if (globalFrame < timing.startFrame || globalFrame >= timing.endFrame) {
    return 0;
  }

  const presetConfig = props.preset ? SFX_PRESETS[props.preset] : undefined;
  const rawBaseProp: AudioVolumeProp = props.volume ?? presetConfig?.defaultVolume ?? 1.0;

  let baseVolume = 1.0;
  if (typeof rawBaseProp === 'function') {
    const dummyMetrics: AudioVolumeMetrics = {
      globalFrame,
      localFrame: globalFrame - timing.startFrame,
      baseVolume: 1.0,
      fadeMultiplier: 1.0,
      finalVolume: 1.0,
      isFadingIn: false,
      isFadingOut: false,
      isMuted: false,
      phase: 'hold',
    };
    baseVolume = rawBaseProp(globalFrame, dummyMetrics);
  } else if (typeof rawBaseProp === 'number') {
    baseVolume = rawBaseProp;
  }

  const localFrame = globalFrame - timing.startFrame;
  const duration = timing.durationInFrames;
  let fadeIn = timing.fadeInFrames;
  let fadeOut = timing.fadeOutFrames;

  // Scale down envelopes if their sum exceeds total sound effect duration
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

  const finalVolume = baseVolume * fadeMultiplier * masterVolume;
  return Math.max(0, Number(finalVolume.toFixed(4)));
}

/**
 * Calculates the exact trigger frame to synchronize a sound effect with a scene transition.
 *
 * @param transitionStartFrame Frame where the scene transition starts
 * @param transitionDurationInFrames Duration of the transition window
 * @param options Alignment mode ('start' | 'midpoint' | 'end') and optional frameOffset
 * @returns Synchronized target trigger frame
 */
export function syncSoundWithTransition(
  transitionStartFrame: number,
  transitionDurationInFrames: number,
  options?: TransitionSoundSyncOptions,
): number {
  const alignment = options?.alignment ?? 'midpoint';
  const offset = options?.frameOffset ?? 0;

  let baseFrame = transitionStartFrame;
  if (alignment === 'midpoint') {
    baseFrame = transitionStartFrame + Math.floor(transitionDurationInFrames / 2);
  } else if (alignment === 'end') {
    baseFrame = transitionStartFrame + transitionDurationInFrames;
  }

  return Math.max(0, baseFrame + offset);
}

/**
 * Convenience helper to create a strongly-typed SoundEffect configuration.
 */
export function createSoundCue(
  triggerFrame: number,
  presetOrSrc: SoundEffectPresetName | string,
  overrides?: Partial<SoundEffectProps>,
): SoundEffectProps {
  const isPreset = Object.prototype.hasOwnProperty.call(SFX_PRESETS, presetOrSrc);

  return {
    triggerFrame,
    ...(isPreset
      ? { preset: presetOrSrc as SoundEffectPresetName }
      : { src: presetOrSrc }),
    ...overrides,
  };
}
