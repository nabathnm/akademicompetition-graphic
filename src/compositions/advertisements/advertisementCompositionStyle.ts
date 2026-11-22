/**
 * AdvertisementComposition Mathematical and Validation Engine
 * Layer 4 of the Motion Graphics Framework.
 */

import React from 'react';
import type {
  AdvertisementCompositionProps,
  AdvertisementValidationResult,
  AudioTrackConfig,
  SceneItemConfig,
  SceneScheduleItem,
} from '../types.ts';
import { clamp } from '../../utils/animation/clamp.ts';

/**
 * Validates configuration parameters for an advertisement composition.
 * Produces actionable development errors and warnings.
 */
export function validateAdvertisementConfig(
  props: AdvertisementCompositionProps,
): AdvertisementValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Dimensional checks
  if (props.width !== undefined && props.width <= 0) {
    errors.push(`Width must be a positive number. Received: ${props.width}`);
  }
  if (props.height !== undefined && props.height <= 0) {
    errors.push(`Height must be a positive number. Received: ${props.height}`);
  }
  if (props.fps !== undefined && props.fps <= 0) {
    errors.push(`FPS must be a positive number. Received: ${props.fps}`);
  }
  if (props.durationInFrames !== undefined && props.durationInFrames <= 0) {
    errors.push(`durationInFrames must be a positive number. Received: ${props.durationInFrames}`);
  }

  // Scene array validation
  if (props.scenes && props.scenes.length > 0) {
    const seenIds = new Set<string>();
    let totalSceneDuration = 0;

    props.scenes.forEach((scene, index) => {
      if (!scene.id) {
        errors.push(`Scene at index ${index} is missing a required unique 'id'.`);
      } else if (seenIds.has(scene.id)) {
        warnings.push(`Duplicate scene id detected: '${scene.id}'. IDs should be unique.`);
      } else {
        seenIds.add(scene.id);
      }

      if (scene.durationInFrames <= 0) {
        errors.push(`Scene '${scene.id || index}' must have durationInFrames > 0. Received: ${scene.durationInFrames}`);
      }

      if (scene.startFrame !== undefined && scene.startFrame < 0) {
        errors.push(`Scene '${scene.id || index}' has negative startFrame: ${scene.startFrame}`);
      }

      totalSceneDuration += scene.durationInFrames;
    });

    if (props.durationInFrames !== undefined && totalSceneDuration > props.durationInFrames) {
      warnings.push(
        `Total scene duration (${totalSceneDuration} frames) exceeds specified composition duration (${props.durationInFrames} frames). Scenes may be truncated.`,
      );
    }
  }

  // Audio track validation
  if (props.audio) {
    const tracks = Array.isArray(props.audio) ? props.audio : [props.audio];
    tracks.forEach((track, index) => {
      if (!track.src || track.src.trim() === '') {
        errors.push(`Audio track at index ${index} is missing a required 'src' URL or path.`);
      }
      if (typeof track.volume === 'number' && (track.volume < 0 || track.volume > 1)) {
        warnings.push(`Audio track '${track.name || index}' volume (${track.volume}) is outside normal 0.0 - 1.0 range.`);
      }
      if (track.fadeInFrames && track.fadeInFrames < 0) {
        errors.push(`Audio track '${track.name || index}' has negative fadeInFrames: ${track.fadeInFrames}`);
      }
      if (track.fadeOutFrames && track.fadeOutFrames < 0) {
        errors.push(`Audio track '${track.name || index}' has negative fadeOutFrames: ${track.fadeOutFrames}`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Calculates deterministic timeline offsets and frame intervals for all scenes.
 * If startFrame is omitted, scenes sequence sequentially.
 */
export function calculateSceneSchedule(
  scenes: SceneItemConfig[] = [],
  compositionDuration?: number,
): SceneScheduleItem[] {
  let currentOffset = 0;

  return scenes.map((scene, index) => {
    const delayBefore = scene.delayBefore ?? 0;
    const start =
      scene.startFrame !== undefined
        ? scene.startFrame
        : currentOffset + delayBefore;
    const end = start + scene.durationInFrames;
    const delayAfter = scene.delayAfter ?? 0;

    // Advance offset for next sequential scene
    currentOffset = end + delayAfter;

    return {
      ...scene,
      computedStartFrame: start,
      computedEndFrame: end,
      sequenceIndex: index,
    };
  });
}

/**
 * Identifies the active scene scheduled at a specific frame number.
 */
export function getActiveSceneAtFrame(
  schedule: SceneScheduleItem[],
  frame: number,
): SceneScheduleItem | null {
  for (const item of schedule) {
    if (frame >= item.computedStartFrame && frame < item.computedEndFrame) {
      return item;
    }
  }
  return null;
}

/**
 * Calculates deterministic volume multiplier for an audio track at any given frame.
 * Handles fade-in, fade-out, start offset, and base volume clamping.
 */
export function calculateAudioVolume(
  track: AudioTrackConfig,
  frame: number,
  totalDurationInFrames: number,
): number {
  const startAt = track.startAtFrame ?? 0;
  if (frame < startAt) {
    return 0;
  }

  const fadeIn = track.fadeInFrames ?? 0;
  const fadeOut = track.fadeOutFrames ?? 0;
  const endAt = totalDurationInFrames;

  // Base volume resolution
  const baseVolume =
    typeof track.volume === 'function'
      ? track.volume(frame)
      : typeof track.volume === 'number'
        ? track.volume
        : 1.0;

  let multiplier = 1.0;

  // Fade In
  if (fadeIn > 0 && frame < startAt + fadeIn) {
    multiplier = clamp((frame - startAt) / fadeIn, 0, 1);
  }

  // Fade Out
  if (fadeOut > 0 && frame >= endAt - fadeOut) {
    const remaining = endAt - frame;
    multiplier = Math.min(multiplier, clamp(remaining / fadeOut, 0, 1));
  }

  return clamp(baseVolume * multiplier, 0, 1);
}

export interface AdvertisementResolvedLayout {
  containerStyle: React.CSSProperties;
  safeAreaMargin: number;
  safeAreaStyle: React.CSSProperties;
  contentStyle: React.CSSProperties;
}

/**
 * Resolves layout styles, safe area guide boundaries, and canvas positioning.
 */
export function resolveAdvertisementLayout(
  width: number,
  height: number,
  safeArea: boolean | number = true,
  background?: string,
  backgroundColor?: string,
): AdvertisementResolvedLayout {
  const safeMargin =
    typeof safeArea === 'number'
      ? safeArea
      : safeArea === true
        ? 60
        : 0;

  return {
    containerStyle: {
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      backgroundColor: backgroundColor ?? '#05070e',
      background: background,
      display: 'flex',
      flexDirection: 'column',
    },
    safeAreaMargin: safeMargin,
    safeAreaStyle: {
      position: 'absolute',
      left: safeMargin,
      right: safeMargin,
      top: safeMargin,
      bottom: safeMargin,
      pointerEvents: 'none',
      border: '1px dashed rgba(6, 182, 212, 0.35)',
      borderRadius: 8,
      zIndex: 9999,
    },
    contentStyle: {
      position: 'relative',
      width: '100%',
      height: '100%',
      padding: safeMargin,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
    },
  };
}
