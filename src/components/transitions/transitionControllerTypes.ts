/**
 * TransitionController Type Definitions
 * Centralized configuration, timing interfaces, and validation contracts
 * connecting the Transition Library with Scenes, SceneSequence, and AdvertisementComposition.
 *
 * Layer 2 / Layer 3 Bridge of the Motion Graphics Framework.
 */

import React from 'react';
import type { EasingFunction, EasingPresetName } from '../../utils/animation/easing.ts';
import type {
  FadeTransitionMode,
  SlideDirection,
  SlideTransitionMode,
  ZoomTransitionMode,
  WipeDirection,
  WipeTransitionMode,
  WipeEdgeStyle,
  MaskType,
  MaskPolygonShape,
  MaskTransitionMode,
  SplitDirection,
  SplitMovementDirection,
  SplitStaggerOrder,
  SplitTransitionMode,
  GlitchTransitionMode,
} from './types.ts';

/**
 * All supported transition types in the Motion Graphics Framework.
 */
export type SupportedTransitionType =
  | 'fade'
  | 'slide'
  | 'zoom'
  | 'wipe'
  | 'mask'
  | 'split'
  | 'morph'
  | 'glitch'
  | 'none'
  | 'cut';

/**
 * Timing alignment of adjacent scene transitions relative to the boundary frame.
 * - 'center': Transition is centered on boundary frame (spans before and after).
 * - 'lead-in': Transition finishes at boundary frame (occurs during end of outgoing scene).
 * - 'lead-out': Transition starts at boundary frame (occurs during start of incoming scene).
 */
export type TransitionAlignment = 'center' | 'lead-in' | 'lead-out';

/**
 * Universal transition configuration object.
 * Can be applied to adjacent scene transitions or single scene entrance/exit envelopes.
 */
export interface TransitionControllerConfig {
  /** Transition type preset ('fade' | 'slide' | 'zoom' | 'wipe' | 'mask' | 'split' | 'morph' | 'glitch' | 'none' | 'cut') */
  type?: SupportedTransitionType;
  /** Duration in frames (default: 20) */
  durationInFrames?: number;
  /** Frame delay before transition begins (default: 0) */
  delay?: number;
  /** Explicit mode override (e.g. 'replace', 'crossfade', 'in', 'out', 'in-out') */
  mode?:
    | FadeTransitionMode
    | SlideTransitionMode
    | ZoomTransitionMode
    | WipeTransitionMode
    | MaskTransitionMode
    | SplitTransitionMode
    | GlitchTransitionMode
    | string;
  /** Direction for directional transitions (slide, wipe, split) */
  direction?: SlideDirection | WipeDirection | SplitDirection | string;
  /** Easing curve function or preset name (default: 'easeInOut') */
  easing?: EasingPresetName | EasingFunction;
  /** Completely disables transition, executing an instantaneous cut */
  disabled?: boolean;
  /** Alignment around the scene boundary frame for adjacent transitions (default: 'center') */
  alignment?: TransitionAlignment;
  /** Simultaneous opacity fade along with transition motion */
  fade?: boolean;
  /** Physics-based spring motion (boolean or spring preset name) */
  spring?: boolean | string;
  /** Spring preset alias */
  springPreset?: string;
  /** Whether to allow spring overshoot past target */
  overshoot?: boolean;
  /** Inverts the transition timing progress */
  reverse?: boolean;

  // MaskTransition specific properties
  maskType?: MaskType;
  maskOrigin?: string;
  origin?: string;
  shape?: MaskPolygonShape;
  polygonPoints?: string;
  pathData?: string;
  d?: string;
  pathViewBox?: string;
  cornerRadius?: number;
  rotation?: number;
  scaleMultiplier?: number;

  // SplitTransition specific properties
  splitDirection?: SplitDirection;
  panelCount?: number;
  rows?: number;
  cols?: number;
  movementDirection?: SplitMovementDirection;
  distance?: number | string;
  panelGap?: number;
  staggerDelay?: number;
  staggerOrder?: SplitStaggerOrder;

  // GlitchTransition specific properties
  intensity?: number;
  frequency?: number;
  sliceCount?: number;
  rgbOffset?: number;
  jitter?: number;
  noise?: number;
  seed?: number | string;
  pixelSize?: number;
  enableRgbSplit?: boolean;
  enableSlices?: boolean;
  enableJitter?: boolean;
  enableNoise?: boolean;
  enableFlicker?: boolean;
  enableScanlines?: boolean;

  // MorphTransition specific properties
  fromPath?: string;
  toPath?: string;
  fromFill?: string;
  toFill?: string;
  fromStroke?: string;
  toStroke?: string;
  fromStrokeWidth?: number;
  toStrokeWidth?: number;
  samplePoints?: number;
  viewBox?: string;

  // WipeTransition specific properties
  edgeStyle?: WipeEdgeStyle;
  edgeColor?: string;
  edgeWidth?: number;

  // Container styling properties
  backgroundColor?: string;
  style?: React.CSSProperties;
  className?: string;

  // Arbitrary additional properties passed to underlying transition
  customProps?: Record<string, unknown>;
}

/**
 * Validation result for transition configurations.
 */
export interface TransitionValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  resolvedType: SupportedTransitionType;
  resolvedDuration: number;
}

/**
 * Timing window specification for an adjacent scene transition.
 */
export interface TransitionWindowResult {
  /** Start frame in the global/parent timeline where the transition begins */
  startFrame: number;
  /** End frame in the global/parent timeline where the transition completes */
  endFrame: number;
  /** Total duration of the transition in frames */
  durationInFrames: number;
  /** The anchor boundary frame between the two scenes */
  boundaryFrame: number;
  /** Timing alignment used to compute the window */
  alignment: TransitionAlignment;
  /** Checks if a given global frame falls within the transition window */
  isWithinTransition: (currentFrame: number) => boolean;
  /** Returns the current phase of the transition window */
  getTransitionPhase: (currentFrame: number) => 'before' | 'transition' | 'after';
  /** Computes the 0-indexed local frame within the transition window */
  getLocalTransitionFrame: (currentFrame: number) => number;
  /** Computes the normalized [0, 1] progress through the transition window */
  getNormalizedProgress: (currentFrame: number) => number;
}

/**
 * Resolved adjacent scene transition specification.
 */
export interface ResolvedAdjacentTransition extends TransitionControllerConfig {
  type: SupportedTransitionType;
  durationInFrames: number;
  alignment: TransitionAlignment;
  disabled: boolean;
}

/**
 * Resolved scene envelope specification (entrance + exit).
 */
export interface ResolvedSceneEnvelope {
  entrance: TransitionControllerConfig;
  exit: TransitionControllerConfig;
  canUseCombinedInOut: boolean;
  combinedInOutType?: SupportedTransitionType;
}

/**
 * Props for the TransitionController component.
 */
export interface TransitionControllerProps extends Partial<TransitionControllerConfig> {
  /** Optional transition configuration object (overrides individual config props) */
  transition?: TransitionControllerConfig;
  /** Outgoing scene element or render node (used in adjacent transition mode) */
  fromContent?: React.ReactNode;
  /** Alias for fromContent */
  outgoing?: React.ReactNode;
  /** Incoming scene element or render node (used in adjacent transition mode) */
  toContent?: React.ReactNode;
  /** Alias for toContent */
  incoming?: React.ReactNode;
  /** Boundary frame between outgoing and incoming scenes (used in adjacent transition mode) */
  boundaryFrame?: number;
  /** Total scene lifespan in frames (used in single-scene envelope mode) */
  sceneDurationInFrames?: number;
  /** Entrance transition configuration (used in single-scene envelope mode) */
  entrance?: TransitionControllerConfig;
  /** Exit transition configuration (used in single-scene envelope mode) */
  exit?: TransitionControllerConfig;
  /** Explicit current frame override (defaults to useCurrentFrame() in Remotion) */
  currentFrame?: number;
  /** Container inline styles */
  style?: React.CSSProperties;
  /** Container CSS class name */
  className?: string;
  /** Visual debug HUD display */
  debug?: boolean;
  /** Content children: single node for envelope mode, or [outgoing, incoming] tuple for adjacent mode */
  children?: React.ReactNode;
}
