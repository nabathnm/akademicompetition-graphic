/**
 * DeviceFrame Style & Motion Calculations
 * Pure mathematical functions computing concentric device and screen dimensions,
 * 2D depth shadow layering, hardware button alignments, and Remotion frame-accurate entrance kinetics.
 * Layer 2 / Layer 3 of the Motion Graphics Framework.
 */

import type {
  DeviceFrameAnimation,
  DeviceFrameAnimationConfig,
  DeviceFrameDimensions,
  DeviceFrameMotionState,
  DeviceFrameProps,
  DeviceShadowPreset,
  DeviceSlideDirection,
} from './types.ts';
import { clamp } from '../../utils/animation/clamp.ts';
import { resolveEasing, easeOutCubic, easeOut } from '../../utils/animation/easing.ts';
import { createSpring } from '../../utils/animation/spring.ts';

/**
 * Computes outer and inner screen dimensions preserving geometric concentricity.
 */
export function calculateDeviceDimensions(props: Partial<DeviceFrameProps> = {}): DeviceFrameDimensions {
  const width = Math.max(40, props.width ?? 320);
  const height = Math.max(40, props.height ?? 640);
  const frameThickness = Math.max(0, props.frameThickness ?? 12);
  const borderRadius = Math.max(0, props.borderRadius ?? 38);

  const screenWidth = Math.max(0, width - frameThickness * 2);
  const screenHeight = Math.max(0, height - frameThickness * 2);

  // Concentric radius: inner radius equals outer radius minus bezel thickness
  const defaultInnerRadius = Math.max(0, borderRadius - frameThickness);
  const screenRadius = props.screenRadius !== undefined ? Math.max(0, props.screenRadius) : defaultInnerRadius;

  return {
    width,
    height,
    frameThickness,
    borderRadius,
    screenWidth,
    screenHeight,
    screenRadius,
  };
}

/**
 * Resolves 2D depth shadow presets or custom CSS box-shadow declarations.
 */
export function resolveDeviceShadow(
  shadow: DeviceShadowPreset | string | boolean | undefined,
  shadowColor?: string
): string {
  if (shadow === false || shadow === 'none') {
    return 'none';
  }

  const baseColor = shadowColor ?? 'rgba(0, 0, 0, 0.45)';
  const deepColor = shadowColor ? `${shadowColor}B3` : 'rgba(0, 0, 0, 0.6)';
  const ambientColor = shadowColor ? `${shadowColor}4D` : 'rgba(0, 0, 0, 0.25)';

  if (shadow === 'subtle') {
    return `0 8px 24px -4px ${ambientColor}, 0 2px 6px -1px ${ambientColor}`;
  }

  if (shadow === 'high') {
    return `0 36px 72px -16px ${deepColor}, 0 12px 28px -6px ${baseColor}, 0 2px 6px 0 ${ambientColor}`;
  }

  if (shadow === 'floating') {
    return `0 48px 96px -20px ${deepColor}, 0 20px 42px -10px ${baseColor}, 0 4px 12px -2px ${ambientColor}`;
  }

  if (shadow === 'medium' || shadow === true || shadow === undefined) {
    return `0 24px 48px -12px ${baseColor}, 0 8px 18px -4px ${ambientColor}, 0 2px 4px 0 rgba(0, 0, 0, 0.15)`;
  }

  // Custom user CSS string
  return shadow;
}

/**
 * Normalizes props into a structured DeviceFrameAnimationConfig.
 */
export function resolveDeviceFrameAnimationConfig(props: Partial<DeviceFrameProps>): DeviceFrameAnimationConfig {
  if (props.animate === false) {
    return { type: 'none' };
  }

  if (typeof props.animation === 'object' && props.animation !== null) {
    return {
      type: props.animation.type ?? 'spring',
      delay: props.animation.delay ?? props.delay ?? 0,
      duration: props.animation.duration ?? props.durationInFrames ?? 25,
      direction: props.animation.direction ?? props.slideDirection ?? 'up',
      easing: props.animation.easing ?? props.easing,
      springPreset: props.animation.springPreset ?? props.springPreset ?? 'snappy',
      from: props.animation.from,
      to: props.animation.to,
    };
  }

  const animType: DeviceFrameAnimation =
    (typeof props.animation === 'string' ? props.animation : undefined) ?? 'spring';

  return {
    type: animType,
    delay: props.delay ?? 0,
    duration: props.durationInFrames ?? 25,
    direction: props.slideDirection ?? 'up',
    easing: props.easing,
    springPreset: props.springPreset ?? 'snappy',
  };
}

/**
 * Computes frame-accurate entrance, transform, and exit motion state for the device frame.
 */
export function calculateDeviceMotion(params: {
  currentFrame: number;
  fps: number;
  config: DeviceFrameAnimationConfig;
  exitFrame?: number;
  exitDurationInFrames?: number;
  exitAnimation?: 'fade-out' | 'scale-out' | 'slide-down';
}): DeviceFrameMotionState {
  const {
    currentFrame,
    fps,
    config,
    exitFrame,
    exitDurationInFrames = 15,
    exitAnimation = 'fade-out',
  } = params;

  const animType = config.type ?? 'spring';
  const delay = Math.max(0, config.delay ?? 0);
  const duration = Math.max(1, config.duration ?? 25);
  const direction: DeviceSlideDirection = config.direction ?? 'up';

  const f = Math.max(0, currentFrame - delay);
  const rawProgress = animType === 'none' ? 1 : currentFrame < delay ? 0 : clamp(f / duration, 0, 1);

  // Eased progress
  let eased = rawProgress;
  if (animType !== 'none') {
    if (config.easing) {
      const easeFn = resolveEasing(config.easing) ?? easeOutCubic;
      eased = easeFn(rawProgress);
    } else {
      eased = easeOutCubic(rawProgress);
    }
  }

  let opacity = 1;
  let translateX = 0;
  let translateY = 0;
  let scaleX = 1;
  let scaleY = 1;
  let rotation = 0;

  switch (animType) {
    case 'none':
      opacity = 1;
      break;

    case 'fade-in':
      opacity = eased;
      break;

    case 'fade-out':
      opacity = 1 - eased;
      break;

    case 'scale-in': {
      const fromVal = config.from ?? 0.8;
      const toVal = config.to ?? 1.0;
      const s = fromVal + eased * (toVal - fromVal);
      scaleX = s;
      scaleY = s;
      opacity = clamp(rawProgress * 2, 0, 1);
      break;
    }

    case 'scale-out': {
      const fromVal = config.from ?? 1.0;
      const toVal = config.to ?? 0.8;
      const s = fromVal + eased * (toVal - fromVal);
      scaleX = s;
      scaleY = s;
      opacity = 1 - eased;
      break;
    }

    case 'slide-in': {
      opacity = clamp(rawProgress * 2, 0, 1);
      const dist = 100 * (1 - eased);
      if (direction === 'up') translateY = dist;
      else if (direction === 'down') translateY = -dist;
      else if (direction === 'left') translateX = dist;
      else if (direction === 'right') translateX = -dist;
      break;
    }

    case 'rotate': {
      const fromRot = config.from ?? -12;
      const toRot = config.to ?? 0;
      rotation = fromRot + eased * (toRot - fromRot);
      const s = 0.88 + eased * 0.12;
      scaleX = s;
      scaleY = s;
      opacity = clamp(rawProgress * 2.5, 0, 1);
      break;
    }

    case 'pop': {
      // Spring pop with snappy physics
      const spring = createSpring({
        frame: f,
        fps,
        preset: config.springPreset ?? 'bouncy',
      });
      scaleX = spring;
      scaleY = spring;
      opacity = clamp(rawProgress * 3, 0, 1);
      break;
    }

    case 'spring': {
      const spring = createSpring({
        frame: f,
        fps,
        preset: config.springPreset ?? 'snappy',
      });
      // Settle scale from 0.88 to 1.0 and slide up from 40px to 0px
      scaleX = 0.88 + spring * 0.12;
      scaleY = 0.88 + spring * 0.12;
      translateY = 40 * (1 - spring);
      opacity = clamp(rawProgress * 3, 0, 1);
      break;
    }
  }

  // Exit transition
  let hasExited = false;
  if (exitFrame !== undefined && currentFrame >= exitFrame) {
    const exitElapsed = currentFrame - exitFrame;
    const exitDuration = Math.max(1, exitDurationInFrames);
    const exitProgress = clamp(exitElapsed / exitDuration, 0, 1);
    const exitEased = easeOut(exitProgress);

    if (exitAnimation === 'fade-out') {
      opacity *= 1 - exitEased;
    } else if (exitAnimation === 'scale-out') {
      const s = 1 - exitEased * 0.2;
      scaleX *= s;
      scaleY *= s;
      opacity *= 1 - exitEased;
    } else if (exitAnimation === 'slide-down') {
      translateY += exitEased * 120;
      opacity *= 1 - exitEased;
    }

    if (exitProgress >= 1) {
      hasExited = true;
      opacity = 0;
    }
  }

  const isAnimating = animType !== 'none' && currentFrame >= delay && currentFrame <= delay + duration;

  return {
    progress: eased,
    opacity: clamp(opacity, 0, 1),
    translateX,
    translateY,
    scaleX,
    scaleY,
    rotation,
    isAnimating,
    hasExited,
  };
}
