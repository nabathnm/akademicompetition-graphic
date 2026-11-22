/**
 * Centralized Timeline Data Model & Types
 * Layer 3 / Core Utility of the Motion Graphics Framework.
 *
 * Defines the contracts for frame-accurate timeline scheduling,
 * multi-track synchronization (scenes, transitions, audio), and deterministic frame inspection.
 */

export type TimelineTrackType = 'scene' | 'transition' | 'audio';

export interface TimelineSpan {
  /** Starting frame offset (0-indexed integer) */
  startFrame: number;
  /** Ending frame boundary (exclusive integer: startFrame + durationInFrames) */
  endFrame: number;
  /** Total duration in integer frames */
  durationInFrames: number;
  /** Duration in fractional seconds at composition FPS */
  durationInSeconds: number;
  /** Start time in fractional seconds at composition FPS */
  startTimeInSeconds: number;
  /** End time in fractional seconds at composition FPS */
  endTimeInSeconds: number;
}

export type TimelineTransitionType =
  | 'fade'
  | 'slide'
  | 'zoom'
  | 'wipe'
  | 'mask'
  | 'split'
  | 'morph'
  | 'glitch'
  | 'none'
  | 'cut'
  | string;

export interface TimelineTransitionConfig {
  type?: TimelineTransitionType;
  durationInFrames?: number;
  direction?: 'left' | 'right' | 'top' | 'bottom' | string;
  easing?: string | ((t: number) => number);
}

export interface TimelineSceneInput {
  id: string;
  name?: string;
  durationInFrames: number;
  startFrame?: number;
  delayBefore?: number;
  delayAfter?: number;
  allowOverlap?: boolean;
  transition?: TimelineTransitionConfig;
  entranceTransition?: TimelineTransitionConfig;
  exitTransition?: TimelineTransitionConfig;
  metadata?: Record<string, unknown>;
}

export interface TimelineTransitionTrack extends TimelineSpan {
  id: string;
  type: TimelineTransitionType;
  direction?: 'left' | 'right' | 'top' | 'bottom' | string;
  directionType: 'entrance' | 'exit';
  parentSceneId: string;
}

export interface TimelineSceneTrack extends TimelineSpan {
  id: string;
  name: string;
  sequenceIndex: number;
  delayBefore: number;
  delayAfter: number;
  allowOverlap: boolean;
  entranceTransition?: TimelineTransitionTrack;
  exitTransition?: TimelineTransitionTrack;
  metadata?: Record<string, unknown>;
}

export interface TimelineAudioInput {
  src: string;
  id?: string;
  name?: string;
  startAtFrame?: number;
  durationInFrames?: number;
  fadeInFrames?: number;
  fadeOutFrames?: number;
  volume?: number | ((frame: number) => number);
  loop?: boolean;
}

export interface TimelineAudioTrack extends TimelineSpan {
  id: string;
  name: string;
  src: string;
  volume: number | ((frame: number) => number);
  fadeInFrames: number;
  fadeOutFrames: number;
  loop: boolean;
}

export interface TimelineInputConfig {
  /** Composition frame rate (default: 30) */
  fps?: number;
  /** List of scene definitions to sequence and schedule */
  scenes?: TimelineSceneInput[];
  /** Audio track or tracks to synchronize */
  audio?: TimelineAudioInput | TimelineAudioInput[];
  /** Optional background music track spanning composition */
  backgroundMusic?: TimelineAudioInput;
  /** Optional sound effect cues placed on timeline */
  soundEffects?: TimelineAudioInput[];
  /** Default frame delay between sequential scenes (default: 0) */
  defaultDelay?: number;
  /** Global overlap permission toggle (default: false) */
  allowOverlap?: boolean;
  /** Explicit composition duration override */
  totalDurationInFrames?: number;
}

export interface TimelineComposition {
  fps: number;
  totalDurationInFrames: number;
  totalDurationInSeconds: number;
  scenes: TimelineSceneTrack[];
  transitions: TimelineTransitionTrack[];
  audio: TimelineAudioTrack[];
}

export interface TimelineFrameInspection {
  frame: number;
  timeInSeconds: number;
  timecode: string;
  progress: number;
  activeScenes: TimelineSceneTrack[];
  primaryActiveScene: TimelineSceneTrack | null;
  activeTransitions: TimelineTransitionTrack[];
  activeAudio: TimelineAudioTrack[];
  isWithinBounds: boolean;
}

export interface TimelineValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  totalCalculatedDuration: number;
}
