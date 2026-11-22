/**
 * AdvertisementPreview Mathematical & Validation Engine
 * Pure calculation logic for preview validation, duration resolution,
 * scene normalization, and transition default injection.
 *
 * Layer 4 of the Motion Graphics Framework.
 */

import type { SceneSequenceItemConfig } from '../../components/scenes/types.ts';
import { validateAnimationConfig } from '../../config/animation/animationConfigStyle.ts';
import type {
  AdvertisementPreviewProps,
  AdvertisementPreviewValidationResult,
  PreviewTransitionSettings,
} from './advertisementPreviewTypes.ts';

/**
 * Validates configuration parameters for an AdvertisementPreview.
 * Generates informative, actionable diagnostics for development inspection.
 */
export function validateAdvertisementPreviewConfig(
  props: AdvertisementPreviewProps,
): AdvertisementPreviewValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Dimensional Checks
  if (props.width !== undefined && props.width <= 0) {
    errors.push(`Width must be a positive number (received ${props.width})`);
  }
  if (props.height !== undefined && props.height <= 0) {
    errors.push(`Height must be a positive number (received ${props.height})`);
  }
  if (props.fps !== undefined && props.fps <= 0) {
    errors.push(`FPS must be a positive number (received ${props.fps})`);
  }
  if (props.durationInFrames !== undefined && props.durationInFrames <= 0) {
    errors.push(`durationInFrames must be a positive number (received ${props.durationInFrames})`);
  }

  // 2. Scene Inspection
  const sceneCount = props.scenes?.length ?? 0;
  let totalSceneDuration = 0;
  let maxComputedEnd = 0;

  if (sceneCount > 0 && props.scenes) {
    const seenIds = new Set<string>();
    let currentOffset = 0;

    props.scenes.forEach((scene, index) => {
      const sceneId = scene.id;
      if (!sceneId) {
        errors.push(`Scene at index ${index} is missing a required unique 'id'.`);
      } else if (seenIds.has(sceneId)) {
        warnings.push(`Duplicate scene id '${sceneId}' detected. IDs should be unique.`);
      } else {
        seenIds.add(sceneId);
      }

      if (scene.durationInFrames <= 0) {
        errors.push(`Scene '${sceneId || index}' has non-positive durationInFrames: ${scene.durationInFrames}`);
      }

      const delayBefore = scene.delayBefore ?? 0;
      if (delayBefore < 0) {
        errors.push(`Scene '${sceneId || index}' has negative delayBefore: ${delayBefore}`);
      }

      const start = scene.startFrame !== undefined ? scene.startFrame : currentOffset + delayBefore;
      const end = start + Math.max(0, scene.durationInFrames);
      const delayAfter = scene.delayAfter ?? 0;

      currentOffset = end + delayAfter;
      totalSceneDuration += Math.max(0, scene.durationInFrames);
      maxComputedEnd = Math.max(maxComputedEnd, end);
    });
  } else if (!props.children) {
    warnings.push(
      'No scenes or children provided to AdvertisementPreview. Please specify a scenes array or pass child components.',
    );
  }

  // 3. Computed Total Duration
  const computedTotalDuration =
    props.durationInFrames !== undefined
      ? props.durationInFrames
      : maxComputedEnd > 0
        ? maxComputedEnd
        : 150;

  if (props.durationInFrames !== undefined && maxComputedEnd > props.durationInFrames) {
    warnings.push(
      `Scenes end frame (${maxComputedEnd}f) exceeds specified durationInFrames (${props.durationInFrames}f). Trailing scene content will be cut off.`,
    );
  }

  // 4. Global Animation Validation
  if (props.animation) {
    const animValidation = validateAnimationConfig(props.animation);
    if (!animValidation.isValid) {
      errors.push(...animValidation.errors.map((e) => `[AnimationConfig] ${e}`));
    }
    warnings.push(...animValidation.warnings.map((w) => `[AnimationConfig] ${w}`));
  }

  // 5. Audio Inspection
  const hasAudio = Boolean(
    props.backgroundMusic ||
      (props.soundEffects && props.soundEffects.length > 0) ||
      props.audio,
  );

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    computedTotalDuration,
    sceneCount,
    hasAudio,
  };
}

/**
 * Injects global transition settings into scenes that do not specify explicit transitions.
 */
export function resolvePreviewScenes(
  scenes?: SceneSequenceItemConfig[],
  transitionSettings?: PreviewTransitionSettings,
): SceneSequenceItemConfig[] {
  if (!scenes || scenes.length === 0) return [];
  if (!transitionSettings) return scenes;

  return scenes.map((scene, index) => {
    // If the scene already specifies an explicit transition, preserve it
    if (scene.transition) {
      return scene;
    }

    // Do not apply transition to the very last scene unless explicitly specified
    if (index === scenes.length - 1) {
      return scene;
    }

    return {
      ...scene,
      transition: {
        type: transitionSettings.defaultType ?? 'fade',
        durationInFrames: transitionSettings.defaultDurationInFrames ?? 15,
        easing: transitionSettings.defaultEasing,
      },
    };
  });
}
