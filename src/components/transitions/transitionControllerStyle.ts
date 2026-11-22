/**
 * TransitionController Pure Engine & Timing Utilities
 * Centralized calculation, validation, and resolution logic for scene transitions.
 *
 * Layer 2 / Layer 3 Bridge of the Motion Graphics Framework.
 */

import { clamp } from '../../utils/animation/clamp.ts';
import type { EasingFunction, EasingPresetName } from '../../utils/animation/easing.ts';
import { easeInOut, resolveEasing } from '../../utils/animation/easing.ts';
import type {
  ResolvedAdjacentTransition,
  ResolvedSceneEnvelope,
  SupportedTransitionType,
  TransitionAlignment,
  TransitionControllerConfig,
  TransitionValidationResult,
  TransitionWindowResult,
} from './transitionControllerTypes.ts';

/**
 * Recognized transition types.
 */
export const SUPPORTED_TRANSITION_TYPES: readonly SupportedTransitionType[] = [
  'fade',
  'slide',
  'zoom',
  'wipe',
  'mask',
  'split',
  'morph',
  'glitch',
  'none',
  'cut',
] as const;

/**
 * Checks whether a given transition type string is supported by the Transition Library.
 */
export function isTransitionSupported(type: unknown): type is SupportedTransitionType {
  if (typeof type !== 'string') return false;
  const normalized = type.toLowerCase().trim();
  return SUPPORTED_TRANSITION_TYPES.includes(normalized as SupportedTransitionType);
}

/**
 * Normalizes an arbitrary transition type string to a valid SupportedTransitionType.
 * Defaults to 'fade' if unrecognized.
 */
export function normalizeTransitionType(type?: unknown): SupportedTransitionType {
  if (!type || typeof type !== 'string') {
    return 'fade';
  }
  const clean = type.toLowerCase().trim();
  if (clean === 'cut') return 'none';
  if (isTransitionSupported(clean)) {
    return clean;
  }
  return 'fade';
}

/**
 * Validates a transition configuration for timing and parameter validity.
 */
export function validateTransitionConfig(
  config?: TransitionControllerConfig,
  sceneDuration?: number,
): TransitionValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!config) {
    return {
      isValid: true,
      errors,
      warnings,
      resolvedType: 'fade',
      resolvedDuration: 20,
    };
  }

  // 1. Validate Transition Type
  let resolvedType: SupportedTransitionType = 'fade';
  if (config.type !== undefined) {
    if (!isTransitionSupported(config.type)) {
      warnings.push(`Unsupported transition type '${config.type}'. Falling back to 'fade'.`);
      resolvedType = 'fade';
    } else {
      resolvedType = normalizeTransitionType(config.type);
    }
  }

  // 2. Validate Duration
  let resolvedDuration = 20;
  if (config.durationInFrames !== undefined) {
    if (config.durationInFrames < 0) {
      errors.push(`Transition duration cannot be negative: ${config.durationInFrames}`);
      resolvedDuration = 0;
    } else if (config.durationInFrames === 0 && resolvedType !== 'none') {
      warnings.push(`Transition duration is 0 frames. It will behave as an instantaneous cut.`);
      resolvedDuration = 0;
    } else {
      resolvedDuration = Math.round(config.durationInFrames);
    }
  }

  // 3. Validate Delay
  if (config.delay !== undefined && config.delay < 0) {
    errors.push(`Transition delay cannot be negative: ${config.delay}`);
  }

  // 4. Validate against Scene Lifespan
  if (sceneDuration !== undefined && sceneDuration > 0 && resolvedDuration > sceneDuration) {
    warnings.push(
      `Transition duration (${resolvedDuration}f) exceeds parent scene duration (${sceneDuration}f). Visual clipping may occur.`,
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    resolvedType,
    resolvedDuration,
  };
}

/**
 * Calculates the exact frame window and lifecycle methods for an adjacent scene transition.
 *
 * @param options Timing parameters: boundaryFrame, durationInFrames, alignment
 * @returns TransitionWindowResult with frame boundaries and query methods
 */
export function calculateTransitionWindow(options: {
  boundaryFrame: number;
  durationInFrames: number;
  alignment?: TransitionAlignment;
  compositionDuration?: number;
}): TransitionWindowResult {
  const boundaryFrame = Math.max(0, Math.round(options.boundaryFrame));
  const durationInFrames = Math.max(0, Math.round(options.durationInFrames));
  const alignment = options.alignment ?? 'center';

  let startFrame: number;
  let endFrame: number;

  if (durationInFrames <= 0) {
    startFrame = boundaryFrame;
    endFrame = boundaryFrame;
  } else {
    switch (alignment) {
      case 'lead-in':
        // Transition ends at boundaryFrame (occurs in outgoing scene)
        startFrame = Math.max(0, boundaryFrame - durationInFrames);
        endFrame = boundaryFrame;
        break;

      case 'lead-out':
        // Transition starts at boundaryFrame (occurs in incoming scene)
        startFrame = boundaryFrame;
        endFrame = boundaryFrame + durationInFrames;
        break;

      case 'center':
      default: {
        // Transition is centered around boundaryFrame
        const half = Math.floor(durationInFrames / 2);
        startFrame = Math.max(0, boundaryFrame - half);
        endFrame = startFrame + durationInFrames;
        break;
      }
    }
  }

  const isWithinTransition = (frame: number): boolean => {
    if (durationInFrames <= 0) return false;
    return frame >= startFrame && frame < endFrame;
  };

  const getTransitionPhase = (frame: number): 'before' | 'transition' | 'after' => {
    if (frame < startFrame) return 'before';
    if (frame >= endFrame) return 'after';
    return 'transition';
  };

  const getLocalTransitionFrame = (frame: number): number => {
    if (durationInFrames <= 0) return 0;
    return clamp(0, Math.floor(frame - startFrame), Math.max(0, durationInFrames - 1));
  };

  const getNormalizedProgress = (frame: number): number => {
    if (durationInFrames <= 0) {
      return frame >= boundaryFrame ? 1 : 0;
    }
    const rawProgress = (frame - startFrame) / durationInFrames;
    return clamp(0, rawProgress, 1);
  };

  return {
    startFrame,
    endFrame,
    durationInFrames,
    boundaryFrame,
    alignment,
    isWithinTransition,
    getTransitionPhase,
    getLocalTransitionFrame,
    getNormalizedProgress,
  };
}

/**
 * Calculates eased animation progress for transition interpolation.
 */
export function calculateTransitionProgress(options: {
  currentFrame: number;
  startFrame: number;
  durationInFrames: number;
  easing?: EasingPresetName | EasingFunction;
}): number {
  const { currentFrame, startFrame, durationInFrames, easing = 'easeInOut' } = options;
  if (durationInFrames <= 0) {
    return currentFrame >= startFrame ? 1 : 0;
  }

  const linear = clamp(0, (currentFrame - startFrame) / durationInFrames, 1);
  const easingFn = (typeof easing === 'function' ? easing : resolveEasing(easing)) ?? easeInOut;
  return clamp(0, easingFn(linear), 1);
}

/**
 * Resolves a normalized adjacent scene transition configuration with defaults.
 */
export function resolveAdjacentTransition(
  config?: TransitionControllerConfig | null,
  defaultDuration = 20,
): ResolvedAdjacentTransition {
  if (!config) {
    return {
      type: 'fade',
      durationInFrames: defaultDuration,
      alignment: 'center',
      disabled: false,
    };
  }

  const type = normalizeTransitionType(config.type);
  const durationInFrames = Math.max(0, config.durationInFrames ?? defaultDuration);
  const alignment = config.alignment ?? 'center';
  const disabled = Boolean(config.disabled || type === 'none');

  return {
    ...config,
    type,
    durationInFrames,
    alignment,
    disabled,
  };
}

/**
 * Resolves entrance and exit transition configurations for a single scene envelope.
 */
export function resolveSceneEnvelope(options: {
  entrance?: TransitionControllerConfig;
  exit?: TransitionControllerConfig;
  sceneDurationInFrames?: number;
}): ResolvedSceneEnvelope {
  const { entrance, exit, sceneDurationInFrames = 90 } = options;

  const resolvedEntrance: TransitionControllerConfig = {
    type: normalizeTransitionType(entrance?.type ?? 'fade'),
    durationInFrames: Math.max(0, entrance?.durationInFrames ?? 15),
    easing: entrance?.easing ?? 'easeOut',
    ...entrance,
  };

  const resolvedExit: TransitionControllerConfig = {
    type: normalizeTransitionType(exit?.type ?? 'fade'),
    durationInFrames: Math.max(0, exit?.durationInFrames ?? 15),
    easing: exit?.easing ?? 'easeIn',
    ...exit,
  };

  // Determine if both entrance and exit use compatible fade or slide modes that can be combined
  const canUseCombinedInOut =
    resolvedEntrance.type === 'fade' &&
    resolvedExit.type === 'fade' &&
    !resolvedEntrance.disabled &&
    !resolvedExit.disabled &&
    (resolvedEntrance.durationInFrames ?? 15) + (resolvedExit.durationInFrames ?? 15) <= sceneDurationInFrames;

  return {
    entrance: resolvedEntrance,
    exit: resolvedExit,
    canUseCombinedInOut,
    combinedInOutType: canUseCombinedInOut ? 'fade' : undefined,
  };
}
