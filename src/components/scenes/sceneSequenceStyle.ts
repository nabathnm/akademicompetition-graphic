/**
 * SceneSequence Mathematical and Validation Engine
 * Layer 3 of the Motion Graphics Framework.
 *
 * Implements deterministic timeline scheduling, overlap collision prevention,
 * frame boundary resolution, validation, and active scene tracking for multi-scene sequences.
 */

import type {
  SceneSequenceItemConfig,
  ScheduledSceneItem,
  SceneSequenceValidationResult,
  SequenceScheduleOptions,
  SceneTransitionConfig,
} from './types.ts';
import { clamp } from '../../utils/animation/clamp.ts';
import { TimelineManager } from '../../utils/timing/TimelineManager.ts';

/**
 * Validates a list of scene configurations.
 * Checks for missing IDs, duplicate IDs, invalid/non-positive durations,
 * missing components, and unpermitted scene overlaps.
 */
export function validateSceneSequence(
  scenes: SceneSequenceItemConfig[] = [],
  options?: SequenceScheduleOptions,
): SceneSequenceValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const seenIds = new Set<string>();

  if (!Array.isArray(scenes) || scenes.length === 0) {
    warnings.push('SceneSequence received an empty scenes array.');
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      totalCalculatedDuration: 0,
    };
  }

  let cursorFrame = 0;
  const allowGlobalOverlap = options?.allowOverlap ?? false;

  scenes.forEach((scene, index) => {
    // 1. Scene ID validation
    if (!scene.id || typeof scene.id !== 'string' || scene.id.trim() === '') {
      errors.push(`Scene at index ${index} is missing a required unique 'id'.`);
    } else if (seenIds.has(scene.id)) {
      errors.push(`Duplicate scene ID detected: '${scene.id}'. Scene IDs must be strictly unique.`);
    } else {
      seenIds.add(scene.id);
    }

    // 2. Component validation
    if (scene.component === undefined || scene.component === null) {
      errors.push(`Scene '${scene.id || index}' is missing a 'component' or React element.`);
    }

    // 3. Duration validation
    if (
      scene.durationInFrames === undefined ||
      scene.durationInFrames === null ||
      typeof scene.durationInFrames !== 'number' ||
      isNaN(scene.durationInFrames) ||
      scene.durationInFrames <= 0
    ) {
      errors.push(
        `Scene '${scene.id || index}' has invalid durationInFrames: ${scene.durationInFrames}. Duration must be greater than 0.`,
      );
    }

    // 4. Delay validation
    if (scene.delayBefore !== undefined && (typeof scene.delayBefore !== 'number' || scene.delayBefore < 0)) {
      errors.push(`Scene '${scene.id || index}' has negative or non-numeric delayBefore: ${scene.delayBefore}`);
    }
    if (scene.delayAfter !== undefined && (typeof scene.delayAfter !== 'number' || scene.delayAfter < 0)) {
      errors.push(`Scene '${scene.id || index}' has negative or non-numeric delayAfter: ${scene.delayAfter}`);
    }

    // 5. Overlap collision check
    const delayBefore = scene.delayBefore ?? options?.defaultDelay ?? 0;
    const scenePermitsOverlap = scene.allowOverlap ?? allowGlobalOverlap;

    if (scene.startFrame !== undefined) {
      if (scene.startFrame < 0) {
        errors.push(`Scene '${scene.id || index}' has negative startFrame: ${scene.startFrame}`);
      } else if (index > 0 && scene.startFrame < cursorFrame && !scenePermitsOverlap) {
        warnings.push(
          `Scene '${scene.id || index}' startFrame (${scene.startFrame}) overlaps with previous scene boundary (${cursorFrame}). Overlap is prevented; scene will be adjusted.`,
        );
      }
    }

    // Advance cursor for validation simulation
    const effectiveStart =
      scene.startFrame !== undefined
        ? !scenePermitsOverlap && scene.startFrame < cursorFrame
          ? cursorFrame
          : scene.startFrame
        : cursorFrame + delayBefore;

    const duration = Math.max(1, scene.durationInFrames || 0);
    cursorFrame = effectiveStart + duration + (scene.delayAfter ?? 0);
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    totalCalculatedDuration: cursorFrame,
  };
}

/**
 * Calculates deterministic frame offsets and duration boundaries for all scenes.
 * Handles sequential placement, delays between scenes, manual startFrame overrides,
 * and overlap prevention rules.
 */
export function calculateSequenceSchedule(
  scenes: SceneSequenceItemConfig[] = [],
  options?: SequenceScheduleOptions,
): ScheduledSceneItem[] {
  let cursorFrame = 0;
  const allowGlobalOverlap = options?.allowOverlap ?? false;
  const defaultDelay = options?.defaultDelay ?? 0;

  return scenes.map((scene, index) => {
    const delayBefore = scene.delayBefore !== undefined ? scene.delayBefore : defaultDelay;
    const scenePermitsOverlap = scene.allowOverlap ?? allowGlobalOverlap;
    const duration = Math.max(1, scene.durationInFrames || 1);

    let computedStart: number;

    if (scene.startFrame !== undefined) {
      if (!scenePermitsOverlap && scene.startFrame < cursorFrame) {
        // Prevent accidental overlap: push start frame to cursor
        computedStart = cursorFrame;
      } else {
        // Respect manual startFrame
        computedStart = Math.max(0, scene.startFrame);
      }
    } else {
      // Sequential flow: cursor + delayBefore
      computedStart = cursorFrame + delayBefore;
    }

    const computedEnd = computedStart + duration;
    const delayAfter = scene.delayAfter ?? 0;

    // Advance cursor for subsequent sequential scenes
    cursorFrame = computedEnd + delayAfter;

    return {
      ...scene,
      computedStartFrame: computedStart,
      computedEndFrame: computedEnd,
      sequenceIndex: index,
    };
  });
}

/**
 * Returns all scenes that are active at a specific timeline frame.
 * (Multiple scenes may be active simultaneously if overlap or transitions are configured).
 */
export function getActiveScenesAtFrame(
  schedule: ScheduledSceneItem[],
  frame: number,
): ScheduledSceneItem[] {
  return schedule.filter(
    (item) => frame >= item.computedStartFrame && frame < item.computedEndFrame,
  );
}

/**
 * Returns the primary (most recently entered or topmost) active scene at a given frame.
 */
export function getPrimaryActiveSceneAtFrame(
  schedule: ScheduledSceneItem[],
  frame: number,
): ScheduledSceneItem | null {
  const active = getActiveScenesAtFrame(schedule, frame);
  if (active.length === 0) return null;
  return active[active.length - 1];
}

/**
 * Calculates normalized progress (0 to 1) for a scene based on the current frame.
 */
export function calculateSceneProgress(
  scene: ScheduledSceneItem,
  currentFrame: number,
): number {
  if (currentFrame <= scene.computedStartFrame) return 0;
  if (currentFrame >= scene.computedEndFrame) return 1;
  const duration = Math.max(1, scene.durationInFrames);
  return clamp((currentFrame - scene.computedStartFrame) / duration, 0, 1);
}

/**
 * Resolves effective transition configuration for a scene,
 * merging default sequence transition with scene-specific entrance/exit overrides.
 */
export function resolveSceneTransitions(
  scene: SceneSequenceItemConfig,
  defaultTransition?: SceneTransitionConfig,
): {
  entrance: SceneTransitionConfig;
  exit: SceneTransitionConfig;
} {
  const base = scene.transition ?? defaultTransition ?? { type: 'none', durationInFrames: 0 };

  const entrance: SceneTransitionConfig = scene.entranceTransition ?? {
    type: base.type ?? 'none',
    durationInFrames: base.durationInFrames ?? 15,
    direction: base.direction ?? 'left',
    easing: base.easing ?? 'easeOut',
  };

  const exit: SceneTransitionConfig = scene.exitTransition ?? {
    type: base.type ?? 'none',
    durationInFrames: base.durationInFrames ?? 15,
    direction: base.direction ?? 'left',
    easing: base.easing ?? 'easeIn',
  };

  return { entrance, exit };
}

export { TimelineManager } from '../../utils/timing/TimelineManager.ts';
export type {
  TimelineComposition,
  TimelineFrameInspection,
  TimelineInputConfig,
  TimelineSceneTrack,
  TimelineTransitionTrack,
  TimelineAudioTrack,
  TimelineValidationResult,
} from '../../utils/timing/timelineTypes.ts';

/**
 * Creates an integrated TimelineManager instance directly from a SceneSequence configuration.
 */
export function createTimelineManagerFromSequence(
  scenes: SceneSequenceItemConfig[] = [],
  options?: SequenceScheduleOptions & { fps?: number },
): TimelineManager {
  return new TimelineManager({
    fps: options?.fps ?? 30,
    scenes: scenes.map((s) => ({
      id: s.id,
      name: s.name,
      durationInFrames: s.durationInFrames,
      startFrame: s.startFrame,
      delayBefore: s.delayBefore,
      delayAfter: s.delayAfter,
      allowOverlap: s.allowOverlap,
      transition: s.transition,
      entranceTransition: s.entranceTransition,
      exitTransition: s.exitTransition,
      metadata: s.props,
    })),
    defaultDelay: options?.defaultDelay,
    allowOverlap: options?.allowOverlap,
    totalDurationInFrames: options?.totalDurationInFrames,
  });
}
