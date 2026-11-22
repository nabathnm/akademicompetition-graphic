/**
 * Global Animation Configuration Type Definitions
 * Centralized contracts for consistent animation behaviors, durations, easings,
 * speed multipliers, and reduced-motion modes across compositions.
 *
 * Layer 1 / Layer 4 of the Motion Graphics Framework.
 */

import React from 'react';
import type { EasingFunction, EasingPresetName } from '../../utils/animation/easing.ts';
import type { SpringPhysicsConfig } from '../../utils/animation/spring.ts';

export type SceneAnimationType = 'fade' | 'slide' | 'scale' | 'zoom' | 'none';
export type SceneSlideDirection = 'left' | 'right' | 'top' | 'bottom';

export interface SceneAnimationConfig {
  /** Animation preset type ('fade' | 'slide' | 'scale' | 'zoom' | 'none') */
  type?: SceneAnimationType;
  /** Duration of entrance animation in frames (default: 15) */
  enterDuration?: number;
  /** Delay before entrance animation starts in frames (default: 0) */
  enterDelay?: number;
  /** Duration of exit animation in frames (default: 0) */
  exitDuration?: number;
  /** Direction for slide entrance animation (default: 'bottom') */
  slideDirection?: SceneSlideDirection;
  /** Slide distance in pixels (default: 60) */
  slideDistance?: number;
  /** Initial scale for scale/zoom animations (default: 0.9 for scale, 0.5 for zoom) */
  initialScale?: number;
  /** Target scale at completion (default: 1.0) */
  finalScale?: number;
  /** Initial opacity for entrance animation (default: 0) */
  initialOpacity?: number;
  /** Easing curve function or preset name */
  easing?: EasingPresetName | EasingFunction;
}

/**
 * Global animation configuration interface.
 */
export interface GlobalAnimationConfig {
  /**
   * Default animation duration in frames for component entrances and micro-interactions.
   * Default: MOTION.duration.normal (18 frames at 30 FPS).
   */
  defaultDuration?: number;

  /**
   * Default easing curve preset name or custom cubic bezier function.
   * Default: 'easeOutCubic'.
   */
  defaultEasing?: EasingPresetName | EasingFunction;

  /**
   * Global animation speed multiplier applied to all calculated durations.
   * Values > 1.0 speed up animations (durations are divided by this factor).
   * Values < 1.0 slow down animations (durations are multiplied).
   * Must be strictly positive (default: 1.0).
   */
  speedMultiplier?: number;

  /**
   * Default scene and layer transition duration in frames.
   * Default: 15 frames at 30 FPS.
   */
  defaultTransitionDuration?: number;

  /**
   * Default stagger interval in frames for sequential list and element reveals.
   * Default: MOTION.stagger.normal (6 frames at 30 FPS).
   */
  defaultStaggerInterval?: number;

  /**
   * Reduced-motion or static preview mode.
   * When true, all motion animations snap immediately to their final state (duration = 0).
   * Default: false.
   */
  reducedMotion?: boolean;

  /**
   * Optional shared animation preset collections for standardized brand physics.
   */
  presets?: {
    spring?: Record<string, SpringPhysicsConfig>;
    easing?: Record<string, EasingPresetName | EasingFunction>;
    entrance?: Record<string, SceneAnimationConfig>;
    [key: string]: unknown;
  };

  /**
   * Optional composition ID or campaign namespace for telemetry and logging.
   */
  compositionId?: string;
}

/**
 * Fully resolved global animation configuration guaranteed to have non-null values.
 */
export interface ResolvedAnimationConfig {
  defaultDuration: number;
  defaultEasing: EasingPresetName | EasingFunction;
  speedMultiplier: number;
  defaultTransitionDuration: number;
  defaultStaggerInterval: number;
  reducedMotion: boolean;
  presets: {
    spring: Record<string, SpringPhysicsConfig>;
    easing: Record<string, EasingPresetName | EasingFunction>;
    entrance: Record<string, SceneAnimationConfig>;
    [key: string]: unknown;
  };
  compositionId?: string;
}

/**
 * Return interface for the useAnimationConfig hook.
 */
export interface UseAnimationConfigReturn {
  /** Fully resolved active animation configuration */
  config: ResolvedAnimationConfig;
  /**
   * Calculates effective duration in frames, applying component overrides,
   * speedMultiplier, and reducedMotion.
   */
  getDuration: (explicitDuration?: number) => number;
  /**
   * Calculates effective transition duration in frames.
   */
  getTransitionDuration: (explicitDuration?: number) => number;
  /**
   * Calculates effective stagger delay in frames.
   */
  getStagger: (explicitStagger?: number) => number;
  /**
   * Resolves effective easing curve.
   */
  getEasing: (explicitEasing?: EasingPresetName | EasingFunction) => EasingPresetName | EasingFunction;
  /** Convenience flag indicating if reduced-motion mode is active */
  isReducedMotion: boolean;
  /** Current effective speed multiplier */
  speedMultiplier: number;
}

/**
 * Props for the AnimationConfigProvider component.
 */
export interface AnimationConfigProviderProps {
  /** Global animation configuration overrides to provide to children */
  value?: GlobalAnimationConfig;
  /** Child React tree */
  children: React.ReactNode;
}
