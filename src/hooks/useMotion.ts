/**
 * useMotion Hook
 * Unified master hook providing common animation primitives, access to current frame/fps,
 * and pre-configured transitions (fadeIn, fadeOut, slideIn, scaleIn, progress, springProgress).
 */

import { useCurrentFrame, useVideoConfig } from 'remotion';
import { EasingPresetName, resolveEasing } from '../utils/animation/easing';
import { interpolateValue } from '../utils/animation/interpolate';
import { createSpring } from '../utils/animation/spring';
import { SpringPresetName, MOTION } from '../styles/motion';

export interface FadeOptions {
  startFrame?: number;
  duration?: number;
  easing?: EasingPresetName;
}

export interface SlideOptions {
  startFrame?: number;
  duration?: number;
  from?: number;
  to?: number;
  easing?: EasingPresetName;
}

export interface ScaleOptions {
  startFrame?: number;
  duration?: number;
  from?: number;
  to?: number;
  preset?: SpringPresetName;
  useSpring?: boolean;
  easing?: EasingPresetName;
}

export interface SpringMotionOptions {
  startFrame?: number;
  delay?: number;
  preset?: SpringPresetName;
  from?: number;
  to?: number;
  reverse?: boolean;
}

export interface UseMotionResult {
  /** Current composition frame */
  frame: number;
  /** Composition FPS */
  fps: number;
  /** Calculate alpha fade-in from 0 to 1 */
  fadeIn: (options?: FadeOptions) => number;
  /** Calculate alpha fade-out from 1 to 0 */
  fadeOut: (options?: FadeOptions) => number;
  /** Calculate translation offset from `from` to `to` */
  slideIn: (options?: SlideOptions) => number;
  /** Calculate scale value from `from` to `to` (spring or eased) */
  scaleIn: (options?: ScaleOptions) => number;
  /** Calculate normalized 0..1 progression */
  progress: (startFrame: number, duration: number, easing?: EasingPresetName) => number;
  /** Calculate physics spring progression */
  springProgress: (options?: SpringMotionOptions) => number;
}

export const useMotion = (): UseMotionResult => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = ({
    startFrame = 0,
    duration = MOTION.duration.normal,
    easing = 'easeOut',
  }: FadeOptions = {}): number => {
    return interpolateValue({
      frame,
      inputRange: [startFrame, startFrame + duration],
      outputRange: [0, 1],
      easing: resolveEasing(easing),
    });
  };

  const fadeOut = ({
    startFrame = 0,
    duration = MOTION.duration.normal,
    easing = 'easeIn',
  }: FadeOptions = {}): number => {
    return interpolateValue({
      frame,
      inputRange: [startFrame, startFrame + duration],
      outputRange: [1, 0],
      easing: resolveEasing(easing),
    });
  };

  const slideIn = ({
    startFrame = 0,
    duration = MOTION.duration.normal,
    from = 40,
    to = 0,
    easing = 'easeOutCubic',
  }: SlideOptions = {}): number => {
    return interpolateValue({
      frame,
      inputRange: [startFrame, startFrame + duration],
      outputRange: [from, to],
      easing: resolveEasing(easing),
    });
  };

  const scaleIn = ({
    startFrame = 0,
    duration = MOTION.duration.normal,
    from = 0.85,
    to = 1,
    preset = 'snappy',
    useSpring = true,
    easing = 'easeOut',
  }: ScaleOptions = {}): number => {
    if (useSpring) {
      return createSpring({
        frame,
        fps,
        delay: startFrame,
        preset,
        from,
        to,
      });
    }

    return interpolateValue({
      frame,
      inputRange: [startFrame, startFrame + duration],
      outputRange: [from, to],
      easing: resolveEasing(easing),
    });
  };

  const progress = (
    startFrame: number,
    duration: number,
    easing: EasingPresetName = 'standard'
  ): number => {
    return interpolateValue({
      frame,
      inputRange: [startFrame, startFrame + duration],
      outputRange: [0, 1],
      easing: resolveEasing(easing),
    });
  };

  const springProgress = (options: SpringMotionOptions = {}): number => {
    return createSpring({
      frame,
      fps,
      delay: (options.startFrame ?? 0) + (options.delay ?? 0),
      preset: options.preset ?? 'smooth',
      from: options.from ?? 0,
      to: options.to ?? 1,
      reverse: options.reverse ?? false,
    });
  };

  return {
    frame,
    fps,
    fadeIn,
    fadeOut,
    slideIn,
    scaleIn,
    progress,
    springProgress,
  };
};
