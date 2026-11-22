/**
 * TimelineManager Utility Engine
 * Layer 3 / Core Utility of the Motion Graphics Framework.
 *
 * Centralized timing system for calculating, managing, and inspecting advertisement
 * timeline information across scenes, transitions, and audio tracks.
 * Uses integer frames as the single source of truth to avoid floating-point drift.
 */

import { clamp } from '../animation/clamp.ts';
import { SILENT_AUDIO_DATA_URI } from '../../components/audio/audioTrackStyle.ts';
import {
  secondsToFrames,
  framesToSeconds,
  formatTimecode,
} from './frame.ts';
export { secondsToFrames, framesToSeconds, formatTimecode };
import type {
  TimelineAudioInput,
  TimelineAudioTrack,
  TimelineComposition,
  TimelineFrameInspection,
  TimelineInputConfig,
  TimelineSceneInput,
  TimelineSceneTrack,
  TimelineSpan,
  TimelineTransitionConfig,
  TimelineTransitionTrack,
  TimelineValidationResult,
} from './timelineTypes.ts';

/**
 * Helper to construct a standard TimelineSpan object.
 */
export function createTimelineSpan(startFrame: number, durationInFrames: number, fps: number): TimelineSpan {
  const safeStart = Math.max(0, Math.round(startFrame));
  const safeDuration = Math.max(0, Math.round(durationInFrames));
  const endFrame = safeStart + safeDuration;

  return {
    startFrame: safeStart,
    endFrame,
    durationInFrames: safeDuration,
    durationInSeconds: framesToSeconds(safeDuration, fps),
    startTimeInSeconds: framesToSeconds(safeStart, fps),
    endTimeInSeconds: framesToSeconds(endFrame, fps),
  };
}

/**
 * Validates timeline configuration parameters.
 * Checks for invalid FPS, negative durations, missing IDs, duplicate IDs, and collision warnings.
 */
export function validateTimelineConfig(config: TimelineInputConfig): TimelineValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const seenIds = new Set<string>();

  // 1. FPS validation
  if (config.fps !== undefined) {
    if (!Number.isFinite(config.fps) || config.fps <= 0) {
      errors.push(`FPS must be a positive number greater than 0. Received: ${config.fps}`);
    }
  }

  // 2. Default delay validation
  if (config.defaultDelay !== undefined && config.defaultDelay < 0) {
    errors.push(`defaultDelay cannot be negative. Received: ${config.defaultDelay}`);
  }

  // 3. Scene tracks validation
  let cursorFrame = 0;
  const allowGlobalOverlap = config.allowOverlap ?? false;
  const scenes = config.scenes ?? [];

  scenes.forEach((scene, index) => {
    // Unique ID
    if (!scene.id || typeof scene.id !== 'string' || scene.id.trim() === '') {
      errors.push(`Scene at index ${index} is missing a required unique 'id'.`);
    } else if (seenIds.has(scene.id)) {
      errors.push(`Duplicate scene ID detected: '${scene.id}'. IDs must be strictly unique.`);
    } else {
      seenIds.add(scene.id);
    }

    // Duration
    if (
      scene.durationInFrames === undefined ||
      !Number.isFinite(scene.durationInFrames) ||
      scene.durationInFrames <= 0
    ) {
      errors.push(
        `Scene '${scene.id || index}' has invalid durationInFrames: ${scene.durationInFrames}. Must be > 0.`,
      );
    }

    // Delays
    if (scene.delayBefore !== undefined && scene.delayBefore < 0) {
      errors.push(`Scene '${scene.id || index}' has negative delayBefore: ${scene.delayBefore}`);
    }
    if (scene.delayAfter !== undefined && scene.delayAfter < 0) {
      errors.push(`Scene '${scene.id || index}' has negative delayAfter: ${scene.delayAfter}`);
    }

    // Transitions
    const entranceDur = scene.entranceTransition?.durationInFrames ?? scene.transition?.durationInFrames ?? 0;
    const exitDur = scene.exitTransition?.durationInFrames ?? 0;

    if (entranceDur < 0) {
      errors.push(`Scene '${scene.id || index}' has negative entrance transition duration: ${entranceDur}`);
    }
    if (exitDur < 0) {
      errors.push(`Scene '${scene.id || index}' has negative exit transition duration: ${exitDur}`);
    }
    if (scene.durationInFrames > 0 && entranceDur + exitDur > scene.durationInFrames) {
      warnings.push(
        `Scene '${scene.id || index}' transition duration sum (${entranceDur + exitDur}f) exceeds scene lifespan (${scene.durationInFrames}f).`,
      );
    }

    // Overlap checks
    const scenePermitsOverlap = scene.allowOverlap ?? allowGlobalOverlap;
    const delayBefore = scene.delayBefore ?? config.defaultDelay ?? 0;

    if (scene.startFrame !== undefined) {
      if (scene.startFrame < 0) {
        errors.push(`Scene '${scene.id || index}' has negative startFrame: ${scene.startFrame}`);
      } else if (index > 0 && scene.startFrame < cursorFrame && !scenePermitsOverlap) {
        warnings.push(
          `Scene '${scene.id || index}' startFrame (${scene.startFrame}) overlaps with previous scene end (${cursorFrame}). Overlap is prevented.`,
        );
      }
    }

    // Advance simulated cursor
    const effectiveStart =
      scene.startFrame !== undefined
        ? !scenePermitsOverlap && scene.startFrame < cursorFrame
          ? cursorFrame
          : scene.startFrame
        : cursorFrame + delayBefore;

    const dur = Math.max(1, scene.durationInFrames || 1);
    cursorFrame = effectiveStart + dur + (scene.delayAfter ?? 0);
  });

  // 4. Audio tracks validation
  if (config.audio) {
    const audioList = Array.isArray(config.audio) ? config.audio : [config.audio];
    audioList.forEach((track, idx) => {
      if (!track.src) {
        errors.push(`Audio track at index ${idx} is missing a required 'src' URL or file path.`);
      }
      if (track.startAtFrame !== undefined && track.startAtFrame < 0) {
        errors.push(`Audio track '${track.name || idx}' has negative startAtFrame: ${track.startAtFrame}`);
      }
      if (track.durationInFrames !== undefined && track.durationInFrames <= 0) {
        errors.push(`Audio track '${track.name || idx}' has non-positive durationInFrames: ${track.durationInFrames}`);
      }
      if (track.fadeInFrames !== undefined && track.fadeInFrames < 0) {
        errors.push(`Audio track '${track.name || idx}' has negative fadeInFrames: ${track.fadeInFrames}`);
      }
      if (track.fadeOutFrames !== undefined && track.fadeOutFrames < 0) {
        errors.push(`Audio track '${track.name || idx}' has negative fadeOutFrames: ${track.fadeOutFrames}`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    totalCalculatedDuration: cursorFrame,
  };
}

/**
 * Calculates start, end, and transition ranges for an array of scenes.
 */
export function calculateSceneTimeline(
  scenes: TimelineSceneInput[] = [],
  options: { fps: number; defaultDelay?: number; allowOverlap?: boolean },
): { scenes: TimelineSceneTrack[]; transitions: TimelineTransitionTrack[] } {
  let cursorFrame = 0;
  const fps = options.fps > 0 ? options.fps : 30;
  const allowGlobalOverlap = options.allowOverlap ?? false;
  const defaultDelay = options.defaultDelay ?? 0;

  const sceneTracks: TimelineSceneTrack[] = [];
  const transitionTracks: TimelineTransitionTrack[] = [];

  scenes.forEach((scene, index) => {
    const delayBefore = scene.delayBefore !== undefined ? scene.delayBefore : defaultDelay;
    const scenePermitsOverlap = scene.allowOverlap ?? allowGlobalOverlap;
    const duration = Math.max(1, Math.round(scene.durationInFrames || 1));

    let computedStart: number;
    if (scene.startFrame !== undefined) {
      if (!scenePermitsOverlap && scene.startFrame < cursorFrame) {
        // Enforce overlap prevention
        computedStart = cursorFrame;
      } else {
        computedStart = Math.max(0, Math.round(scene.startFrame));
      }
    } else {
      computedStart = cursorFrame + delayBefore;
    }

    const span = createTimelineSpan(computedStart, duration, fps);
    const delayAfter = scene.delayAfter ?? 0;
    cursorFrame = span.endFrame + delayAfter;

    // Resolve Entrance Transition
    let entranceTrack: TimelineTransitionTrack | undefined;
    const entConfig: TimelineTransitionConfig | undefined =
      scene.entranceTransition ?? scene.transition;

    if (entConfig && entConfig.type && entConfig.type !== 'none') {
      const entDuration = Math.min(
        span.durationInFrames,
        Math.max(1, Math.round(entConfig.durationInFrames ?? 15)),
      );
      const entSpan = createTimelineSpan(span.startFrame, entDuration, fps);

      entranceTrack = {
        ...entSpan,
        id: `trans-enter-${scene.id}`,
        type: entConfig.type,
        direction: entConfig.direction ?? 'left',
        directionType: 'entrance',
        parentSceneId: scene.id,
      };
      transitionTracks.push(entranceTrack);
    }

    // Resolve Exit Transition
    let exitTrack: TimelineTransitionTrack | undefined;
    const exitConfig: TimelineTransitionConfig | undefined = scene.exitTransition;

    if (exitConfig && exitConfig.type && exitConfig.type !== 'none') {
      const exitDuration = Math.min(
        span.durationInFrames,
        Math.max(1, Math.round(exitConfig.durationInFrames ?? 15)),
      );
      const exitStart = Math.max(span.startFrame, span.endFrame - exitDuration);
      const exitSpan = createTimelineSpan(exitStart, exitDuration, fps);

      exitTrack = {
        ...exitSpan,
        id: `trans-exit-${scene.id}`,
        type: exitConfig.type,
        direction: exitConfig.direction ?? 'left',
        directionType: 'exit',
        parentSceneId: scene.id,
      };
      transitionTracks.push(exitTrack);
    }

    sceneTracks.push({
      ...span,
      id: scene.id,
      name: scene.name ?? scene.id,
      sequenceIndex: index,
      delayBefore,
      delayAfter,
      allowOverlap: scenePermitsOverlap,
      entranceTransition: entranceTrack,
      exitTransition: exitTrack,
      metadata: scene.metadata,
    });
  });

  return { scenes: sceneTracks, transitions: transitionTracks };
}

/**
 * Calculates start, end, and duration ranges for all audio tracks.
 */
export function calculateAudioTimeline(
  audio: TimelineAudioInput | TimelineAudioInput[] | undefined,
  totalDurationInFrames: number,
  fps: number,
): TimelineAudioTrack[] {
  if (!audio) return [];
  const audioList = Array.isArray(audio) ? audio : [audio];

  return audioList.map((track, idx) => {
    const startFrame = Math.max(0, Math.round(track.startAtFrame ?? 0));
    const duration = Math.max(
      1,
      Math.round(
        track.durationInFrames ?? Math.max(1, totalDurationInFrames - startFrame),
      ),
    );
    const span = createTimelineSpan(startFrame, duration, fps);

    const resolvedSrc = track.src || SILENT_AUDIO_DATA_URI;
    return {
      ...span,
      id: track.id ?? `audio-${idx}-${track.src ? track.src : idx}`,
      name: track.name ?? `Audio Track ${idx + 1}`,
      src: resolvedSrc,
      volume: track.volume ?? 1,
      fadeInFrames: Math.max(0, Math.round(track.fadeInFrames ?? 0)),
      fadeOutFrames: Math.max(0, Math.round(track.fadeOutFrames ?? 0)),
      loop: Boolean(track.loop),
    };
  });
}

/**
 * Builds a complete TimelineComposition data structure from configuration inputs.
 */
export function buildTimelineComposition(config: TimelineInputConfig): TimelineComposition {
  const fps = config.fps !== undefined && config.fps > 0 ? config.fps : 30;

  // 1. Calculate scene & transition timeline
  const { scenes, transitions } = calculateSceneTimeline(config.scenes ?? [], {
    fps,
    defaultDelay: config.defaultDelay,
    allowOverlap: config.allowOverlap,
  });

  // 2. Compute interim total duration from scenes
  const scenesEndFrame = scenes.length > 0 ? Math.max(...scenes.map((s) => s.endFrame)) : 0;
  const initialDuration = Math.max(config.totalDurationInFrames ?? 0, scenesEndFrame);

  // 3. Assemble and calculate multi-track audio timeline (BGM, sound effects, voice/audio)
  const audioList: TimelineAudioInput[] = [];
  if (config.backgroundMusic) {
    audioList.push({
      ...config.backgroundMusic,
      id: config.backgroundMusic.id ?? 'background-music',
      name: config.backgroundMusic.name ?? 'Background Music',
      loop: config.backgroundMusic.loop ?? true,
    });
  }
  if (config.audio) {
    if (Array.isArray(config.audio)) {
      audioList.push(...config.audio);
    } else {
      audioList.push(config.audio);
    }
  }
  if (config.soundEffects && config.soundEffects.length > 0) {
    audioList.push(...config.soundEffects);
  }

  const audioTracks = calculateAudioTimeline(audioList, initialDuration, fps);

  // 4. Resolve absolute total composition duration
  const audioEndFrame = audioTracks.length > 0 ? Math.max(...audioTracks.map((a) => a.endFrame)) : 0;
  const totalDurationInFrames = Math.max(
    config.totalDurationInFrames ?? 0,
    scenesEndFrame,
    audioEndFrame,
    0,
  );

  return {
    fps,
    totalDurationInFrames,
    totalDurationInSeconds: framesToSeconds(totalDurationInFrames, fps),
    scenes,
    transitions,
    audio: audioTracks,
  };
}

/**
 * Performs a comprehensive inspection of all timeline elements at a given frame number.
 */
export function inspectTimelineAtFrame(
  composition: TimelineComposition,
  frame: number,
): TimelineFrameInspection {
  const safeFrame = Math.round(frame);
  const totalFrames = composition.totalDurationInFrames;
  const isWithinBounds = safeFrame >= 0 && safeFrame < totalFrames;
  const progress = totalFrames > 0 ? clamp(safeFrame / totalFrames, 0, 1) : 0;

  // Active scenes: [startFrame, endFrame)
  const activeScenes = composition.scenes.filter(
    (scene) => safeFrame >= scene.startFrame && safeFrame < scene.endFrame,
  );

  // Primary active scene: the latest started active scene
  const primaryActiveScene =
    activeScenes.length > 0 ? activeScenes[activeScenes.length - 1] : null;

  // Active transitions
  const activeTransitions = composition.transitions.filter(
    (trans) => safeFrame >= trans.startFrame && safeFrame < trans.endFrame,
  );

  // Active audio
  const activeAudio = composition.audio.filter(
    (audio) => safeFrame >= audio.startFrame && safeFrame < audio.endFrame,
  );

  return {
    frame: safeFrame,
    timeInSeconds: framesToSeconds(safeFrame, composition.fps),
    timecode: formatTimecode(safeFrame, composition.fps),
    progress,
    activeScenes,
    primaryActiveScene,
    activeTransitions,
    activeAudio,
    isWithinBounds,
  };
}

/**
 * TimelineManager Class
 * Object-oriented state container providing an ergonomic, fluent API around timeline calculations.
 */
export class TimelineManager {
  private config: TimelineInputConfig;
  private composition: TimelineComposition;
  private validation: TimelineValidationResult;

  constructor(config: TimelineInputConfig = {}) {
    this.config = { ...config };
    this.validation = validateTimelineConfig(this.config);
    this.composition = buildTimelineComposition(this.config);
  }

  /**
   * Reconfigures and recalculates the timeline.
   */
  public updateConfig(newConfig: Partial<TimelineInputConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.validation = validateTimelineConfig(this.config);
    this.composition = buildTimelineComposition(this.config);
  }

  /**
   * Returns the underlying TimelineComposition data structure.
   */
  public getComposition(): TimelineComposition {
    return this.composition;
  }

  /**
   * Returns timeline validation diagnostics.
   */
  public getValidation(): TimelineValidationResult {
    return this.validation;
  }

  /**
   * Returns composition frame rate.
   */
  public getFps(): number {
    return this.composition.fps;
  }

  /**
   * Returns total duration in integer frames.
   */
  public getDurationInFrames(): number {
    return this.composition.totalDurationInFrames;
  }

  /**
   * Returns total duration in seconds.
   */
  public getDurationInSeconds(): number {
    return this.composition.totalDurationInSeconds;
  }

  /**
   * Returns all scheduled scene tracks.
   */
  public getScenes(): TimelineSceneTrack[] {
    return this.composition.scenes;
  }

  /**
   * Finds a scene track by its unique ID.
   */
  public getSceneById(id: string): TimelineSceneTrack | undefined {
    return this.composition.scenes.find((s) => s.id === id);
  }

  /**
   * Returns all transition tracks across all scenes.
   */
  public getTransitions(): TimelineTransitionTrack[] {
    return this.composition.transitions;
  }

  /**
   * Returns all audio tracks.
   */
  public getAudioTracks(): TimelineAudioTrack[] {
    return this.composition.audio;
  }

  /**
   * Returns scenes active at a specific frame.
   */
  public getActiveScenesAt(frame: number): TimelineSceneTrack[] {
    return this.composition.scenes.filter(
      (s) => frame >= s.startFrame && frame < s.endFrame,
    );
  }

  /**
   * Returns the primary active scene at a specific frame.
   */
  public getPrimaryActiveSceneAt(frame: number): TimelineSceneTrack | null {
    const active = this.getActiveScenesAt(frame);
    if (active.length === 0) return null;
    return active[active.length - 1];
  }

  /**
   * Returns transitions active at a specific frame.
   */
  public getActiveTransitionsAt(frame: number): TimelineTransitionTrack[] {
    return this.composition.transitions.filter(
      (t) => frame >= t.startFrame && frame < t.endFrame,
    );
  }

  /**
   * Returns audio tracks active at a specific frame.
   */
  public getActiveAudioAt(frame: number): TimelineAudioTrack[] {
    return this.composition.audio.filter(
      (a) => frame >= a.startFrame && frame < a.endFrame,
    );
  }

  /**
   * Performs full multi-track inspection at a specific frame.
   */
  public inspectAt(frame: number): TimelineFrameInspection {
    return inspectTimelineAtFrame(this.composition, frame);
  }

  /**
   * Converts frames to seconds using this manager's FPS.
   */
  public toSeconds(frames: number): number {
    return framesToSeconds(frames, this.composition.fps);
  }

  /**
   * Converts seconds to frames using this manager's FPS.
   */
  public toFrames(seconds: number): number {
    return secondsToFrames(seconds, this.composition.fps);
  }

  /**
   * Formats frames to timecode using this manager's FPS.
   */
  public format(frames: number): string {
    return formatTimecode(frames, this.composition.fps);
  }
}
