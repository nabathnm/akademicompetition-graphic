/**
 * AudioTrack Mathematical Engine & Volume Automation Logic
 * Deterministic frame-accurate volume calculations, envelope easing, and timeline scheduling.
 *
 * Layer 2 / Layer 3 of the Motion Graphics Framework.
 */

import { clamp } from '../../utils/animation/clamp.ts';
import { linear, resolveEasing } from '../../utils/animation/easing.ts';
import type {
  AudioTrackConfig,
  AudioTrackPhase,
  AudioTrackValidationResult,
  AudioVolumeMetrics,
} from './audioTrackTypes.ts';

/**
 * Standard data URI for a 1-second 8kHz mono 8-bit silent WAV file.
 * Used as a dependable fallback when no local audio asset is present.
 */
export const SILENT_AUDIO_DATA_URI =
  'data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YRAAAAAAAAAAAAAAAAAAAAAA';

/**
 * Resolves frame-accurate start, duration, and end bounds for an audio track.
 */
export function resolveTrackTiming(
  config: AudioTrackConfig,
  compositionDuration?: number,
): {
  startFrame: number;
  durationInFrames: number;
  endFrame: number;
} {
  const startFrame = Math.max(0, Math.round(config.startAtFrame ?? config.startFrame ?? 0));

  let rawDuration: number;
  if (config.durationInFrames !== undefined) {
    rawDuration = Math.max(1, Math.round(config.durationInFrames));
  } else if (config.endFrame !== undefined) {
    rawDuration = Math.max(1, Math.round(config.endFrame - startFrame));
  } else if (compositionDuration !== undefined) {
    rawDuration = Math.max(1, Math.round(compositionDuration - startFrame));
  } else {
    rawDuration = 150; // 5 seconds at 30fps default
  }

  // Clamping to composition duration if enabled
  const shouldClamp = config.clampToComposition !== false && compositionDuration !== undefined;
  const durationInFrames = shouldClamp
    ? Math.max(1, Math.min(rawDuration, Math.max(1, compositionDuration - startFrame)))
    : rawDuration;

  const endFrame = startFrame + durationInFrames;

  return {
    startFrame,
    durationInFrames,
    endFrame,
  };
}

/**
 * Validates audio track parameters against timeline and audio conventions.
 */
export function validateAudioTrackConfig(
  config: AudioTrackConfig,
  compositionDuration?: number,
): AudioTrackValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const timing = resolveTrackTiming(config, compositionDuration);

  // 1. Source verification
  if (!config.src || typeof config.src !== 'string' || config.src.trim() === '') {
    errors.push('Audio track is missing a required "src" URL or file path.');
  }

  // 2. Start frame checks
  const startFrame = config.startAtFrame ?? config.startFrame ?? 0;
  if (startFrame < 0) {
    errors.push(`Audio track start frame cannot be negative: ${startFrame}`);
  } else if (compositionDuration !== undefined && startFrame >= compositionDuration) {
    warnings.push(
      `Audio track start frame (${startFrame}) is at or past composition duration (${compositionDuration}). It will not be heard.`,
    );
  }

  // 3. Duration checks
  if (config.durationInFrames !== undefined && config.durationInFrames <= 0) {
    errors.push(`Audio track durationInFrames must be greater than 0: ${config.durationInFrames}`);
  }
  if (config.endFrame !== undefined && config.endFrame <= startFrame) {
    errors.push(`Audio track endFrame (${config.endFrame}) must be greater than startFrame (${startFrame})`);
  }

  // 4. Volume checks
  if (typeof config.volume === 'number') {
    if (config.volume < 0) {
      errors.push(`Audio track volume cannot be negative: ${config.volume}`);
    } else if (config.volume > 1.0) {
      warnings.push(`Audio track volume (${config.volume}) exceeds 1.0. Amplification may introduce clipping.`);
    }
  }

  // 5. Playback rate checks
  if (config.playbackRate !== undefined && config.playbackRate <= 0) {
    errors.push(`Audio track playbackRate must be strictly positive: ${config.playbackRate}`);
  }

  // 6. Fade envelopes checks
  const fadeIn = config.fadeInFrames ?? 0;
  const fadeOut = config.fadeOutFrames ?? 0;

  if (fadeIn < 0) {
    errors.push(`Audio track fadeInFrames cannot be negative: ${fadeIn}`);
  }
  if (fadeOut < 0) {
    errors.push(`Audio track fadeOutFrames cannot be negative: ${fadeOut}`);
  }
  if (fadeIn + fadeOut > timing.durationInFrames && timing.durationInFrames > 0) {
    warnings.push(
      `Audio track fade-in (${fadeIn}f) and fade-out (${fadeOut}f) sum exceeds track duration (${timing.durationInFrames}f). Envelopes will be proportionally scaled.`,
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    effectiveStartFrame: timing.startFrame,
    effectiveDurationInFrames: timing.durationInFrames,
    effectiveEndFrame: timing.endFrame,
  };
}

/**
 * Calculates comprehensive, frame-accurate volume metrics for an audio track.
 */
export function calculateAudioVolumeMetrics(
  config: AudioTrackConfig,
  options: {
    globalFrame: number;
    trackStartFrame?: number;
    trackDurationInFrames?: number;
    compositionDuration?: number;
    masterVolume?: number;
  },
): AudioVolumeMetrics {
  const { globalFrame, masterVolume = 1.0 } = options;
  const timing = resolveTrackTiming(config, options.compositionDuration);
  const startFrame = options.trackStartFrame ?? timing.startFrame;
  const duration = options.trackDurationInFrames ?? timing.durationInFrames;
  const endFrame = startFrame + duration;
  const localFrame = globalFrame - startFrame;

  // Disabled or muted tracks
  if (config.disabled) {
    return {
      globalFrame,
      localFrame,
      baseVolume: 0,
      fadeMultiplier: 0,
      finalVolume: 0,
      isFadingIn: false,
      isFadingOut: false,
      isMuted: true,
      phase: 'complete',
    };
  }

  const isMuted = Boolean(config.muted);

  // Before track playback starts
  if (globalFrame < startFrame) {
    return {
      globalFrame,
      localFrame,
      baseVolume: 0,
      fadeMultiplier: 0,
      finalVolume: 0,
      isFadingIn: false,
      isFadingOut: false,
      isMuted,
      phase: 'pending',
    };
  }

  // After track playback completes
  if (globalFrame >= endFrame) {
    return {
      globalFrame,
      localFrame,
      baseVolume: 0,
      fadeMultiplier: 0,
      finalVolume: 0,
      isFadingIn: false,
      isFadingOut: false,
      isMuted,
      phase: 'complete',
    };
  }

  // 1. Resolve base volume
  const rawBase =
    typeof config.volume === 'function'
      ? config.volume(globalFrame, {
          globalFrame,
          localFrame,
          baseVolume: 1.0,
          fadeMultiplier: 1.0,
          finalVolume: 1.0,
          isFadingIn: false,
          isFadingOut: false,
          isMuted,
          phase: 'hold',
        })
      : typeof config.volume === 'number'
        ? config.volume
        : 1.0;

  const baseVolume = Math.max(0, rawBase);

  if (isMuted) {
    return {
      globalFrame,
      localFrame,
      baseVolume,
      fadeMultiplier: 0,
      finalVolume: 0,
      isFadingIn: false,
      isFadingOut: false,
      isMuted: true,
      phase: 'hold',
    };
  }

  // 2. Resolve Fade Envelopes with proportional scaling if sum exceeds duration
  let fadeIn = Math.max(0, config.fadeInFrames ?? 0);
  let fadeOut = Math.max(0, config.fadeOutFrames ?? 0);

  if (fadeIn + fadeOut > duration && duration > 0) {
    const scale = duration / (fadeIn + fadeOut);
    fadeIn = Math.floor(fadeIn * scale);
    fadeOut = Math.floor(fadeOut * scale);
  }

  let fadeMultiplier = 1.0;
  let isFadingIn = false;
  let isFadingOut = false;
  let phase: AudioTrackPhase = 'hold';

  // Fade-In Calculation
  if (fadeIn > 0 && localFrame < fadeIn) {
    isFadingIn = true;
    phase = 'fadeIn';
    const linearProgress = clamp(localFrame / fadeIn, 0, 1);
    const easingFn = (config.fadeInEasing ? resolveEasing(config.fadeInEasing) : undefined) ?? linear;
    fadeMultiplier = clamp(easingFn(linearProgress), 0, 1);
  }

  // Fade-Out Calculation
  if (fadeOut > 0 && localFrame >= duration - fadeOut) {
    isFadingOut = true;
    phase = 'fadeOut';
    const remainingFrames = Math.max(0, endFrame - globalFrame);
    const linearProgress = clamp(remainingFrames / fadeOut, 0, 1);
    const easingFn = (config.fadeOutEasing ? resolveEasing(config.fadeOutEasing) : undefined) ?? linear;
    const outMultiplier = clamp(easingFn(linearProgress), 0, 1);
    fadeMultiplier = Math.min(fadeMultiplier, outMultiplier);
  }

  const finalVolume = clamp(baseVolume * fadeMultiplier * Math.max(0, masterVolume), 0, 2.0);

  return {
    globalFrame,
    localFrame,
    baseVolume,
    fadeMultiplier,
    finalVolume,
    isFadingIn,
    isFadingOut,
    isMuted,
    phase,
  };
}

/**
 * Calculates the final volume multiplier for an audio track at a given frame.
 */
export function calculateAudioVolume(
  config: AudioTrackConfig,
  frame: number,
  compositionDuration?: number,
  masterVolume?: number,
): number {
  return calculateAudioVolumeMetrics(config, {
    globalFrame: frame,
    compositionDuration,
    masterVolume,
  }).finalVolume;
}

/**
 * Coordinates ducking between speech/dialogue and background music beds.
 *
 * @param options Ducking parameters: musicVolume, isVoiceActive, duckedVolume, rampProgress
 * @returns Modified background music volume multiplier
 */
export function calculateDuckedVolume(options: {
  musicVolume: number;
  isVoiceActive: boolean;
  duckedVolume?: number;
  duckProgress?: number; // 0 (unducked) to 1 (fully ducked), default: 1
  rampMultiplier?: number; // alias for duckProgress
}): number {
  const { musicVolume, isVoiceActive, duckedVolume = 0.2 } = options;
  if (!isVoiceActive) {
    return musicVolume;
  }
  const progress =
    options.duckProgress !== undefined
      ? options.duckProgress
      : options.rampMultiplier !== undefined
        ? options.rampMultiplier
        : 1.0;

  const effectiveDuck = 1.0 - (1.0 - duckedVolume) * clamp(progress, 0, 1);
  const result = clamp(musicVolume * effectiveDuck, 0, 1.0);
  return Number(result.toFixed(4));
}
