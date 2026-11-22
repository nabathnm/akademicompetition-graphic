/**
 * Global Animation Configuration Engine & Precedence Resolver
 * Pure mathematical functions for merging configuration tiers,
 * applying speed multipliers, and computing reduced-motion states.
 *
 * Layer 1 / Layer 4 of the Motion Graphics Framework.
 */

import { MOTION } from '../../styles/motion.ts';
import type { EasingFunction, EasingPresetName } from '../../utils/animation/easing.ts';
import type {
  GlobalAnimationConfig,
  ResolvedAnimationConfig,
} from './animationConfigTypes.ts';

/**
 * Standard framework-level animation defaults.
 * Tier 4 in the precedence hierarchy.
 */
export const DEFAULT_GLOBAL_ANIMATION_CONFIG: ResolvedAnimationConfig = {
  defaultDuration: MOTION.duration.normal, // 18 frames
  defaultEasing: 'easeOutCubic',
  speedMultiplier: 1.0,
  defaultTransitionDuration: 15, // 15 frames
  defaultStaggerInterval: MOTION.stagger.normal, // 6 frames
  reducedMotion: false,
  presets: {
    spring: MOTION.spring,
    easing: {},
    entrance: {},
  },
};

/**
 * Merges multiple animation configuration layers into a fully resolved configuration.
 * Follows strict precedence: Component > Scene > Composition > Framework Defaults.
 *
 * @param configs Array of configuration layers ordered from lowest to highest priority.
 * @returns Fully resolved configuration.
 */
export function mergeAnimationConfigs(
  ...configs: (GlobalAnimationConfig | undefined)[]
): ResolvedAnimationConfig {
  let defaultDuration = DEFAULT_GLOBAL_ANIMATION_CONFIG.defaultDuration;
  let defaultEasing = DEFAULT_GLOBAL_ANIMATION_CONFIG.defaultEasing;
  let speedMultiplier = DEFAULT_GLOBAL_ANIMATION_CONFIG.speedMultiplier;
  let defaultTransitionDuration = DEFAULT_GLOBAL_ANIMATION_CONFIG.defaultTransitionDuration;
  let defaultStaggerInterval = DEFAULT_GLOBAL_ANIMATION_CONFIG.defaultStaggerInterval;
  let reducedMotion = DEFAULT_GLOBAL_ANIMATION_CONFIG.reducedMotion;
  let compositionId = DEFAULT_GLOBAL_ANIMATION_CONFIG.compositionId;

  const presets = {
    ...DEFAULT_GLOBAL_ANIMATION_CONFIG.presets,
    spring: { ...DEFAULT_GLOBAL_ANIMATION_CONFIG.presets.spring },
    easing: { ...DEFAULT_GLOBAL_ANIMATION_CONFIG.presets.easing },
    entrance: { ...DEFAULT_GLOBAL_ANIMATION_CONFIG.presets.entrance },
  };

  for (const cfg of configs) {
    if (!cfg) continue;

    if (cfg.defaultDuration !== undefined && cfg.defaultDuration >= 0) {
      defaultDuration = Math.round(cfg.defaultDuration);
    }
    if (cfg.defaultEasing !== undefined) {
      defaultEasing = cfg.defaultEasing;
    }
    if (cfg.speedMultiplier !== undefined && cfg.speedMultiplier > 0) {
      speedMultiplier = cfg.speedMultiplier;
    }
    if (cfg.defaultTransitionDuration !== undefined && cfg.defaultTransitionDuration >= 0) {
      defaultTransitionDuration = Math.round(cfg.defaultTransitionDuration);
    }
    if (cfg.defaultStaggerInterval !== undefined && cfg.defaultStaggerInterval >= 0) {
      defaultStaggerInterval = Math.round(cfg.defaultStaggerInterval);
    }
    if (cfg.reducedMotion !== undefined) {
      reducedMotion = Boolean(cfg.reducedMotion);
    }
    if (cfg.compositionId !== undefined) {
      compositionId = cfg.compositionId;
    }
    if (cfg.presets) {
      if (cfg.presets.spring) {
        presets.spring = { ...presets.spring, ...cfg.presets.spring };
      }
      if (cfg.presets.easing) {
        presets.easing = { ...presets.easing, ...cfg.presets.easing };
      }
      if (cfg.presets.entrance) {
        presets.entrance = { ...presets.entrance, ...cfg.presets.entrance };
      }
      for (const [key, val] of Object.entries(cfg.presets)) {
        if (key !== 'spring' && key !== 'easing' && key !== 'entrance') {
          (presets as Record<string, unknown>)[key] = val;
        }
      }
    }
  }

  return {
    defaultDuration,
    defaultEasing,
    speedMultiplier,
    defaultTransitionDuration,
    defaultStaggerInterval,
    reducedMotion,
    presets,
    compositionId,
  };
}

/**
 * Resolves the effective duration in frames for an animation.
 *
 * Precedence:
 * 1. Reduced motion: strictly 0 (instantaneous).
 * 2. Explicit duration if provided, otherwise config.defaultDuration.
 * 3. Scaled by speedMultiplier (duration / speedMultiplier).
 * 4. Lower-bounded at 1 frame (if base duration > 0).
 */
export function resolveEffectiveDuration(
  explicitDuration: number | undefined,
  config: ResolvedAnimationConfig | GlobalAnimationConfig = DEFAULT_GLOBAL_ANIMATION_CONFIG,
): number {
  if (config.reducedMotion) {
    return 0;
  }

  const base = explicitDuration !== undefined
    ? Math.max(0, Math.round(explicitDuration))
    : (config.defaultDuration ?? DEFAULT_GLOBAL_ANIMATION_CONFIG.defaultDuration);

  if (base === 0) return 0;

  const speed = (config.speedMultiplier !== undefined && config.speedMultiplier > 0)
    ? config.speedMultiplier
    : 1.0;

  return Math.max(1, Math.round(base / speed));
}

/**
 * Resolves the effective transition duration in frames.
 */
export function resolveEffectiveTransitionDuration(
  explicitDuration: number | undefined,
  config: ResolvedAnimationConfig | GlobalAnimationConfig = DEFAULT_GLOBAL_ANIMATION_CONFIG,
): number {
  if (config.reducedMotion) {
    return 0;
  }

  const base = explicitDuration !== undefined
    ? Math.max(0, Math.round(explicitDuration))
    : (config.defaultTransitionDuration ?? DEFAULT_GLOBAL_ANIMATION_CONFIG.defaultTransitionDuration);

  if (base === 0) return 0;

  const speed = (config.speedMultiplier !== undefined && config.speedMultiplier > 0)
    ? config.speedMultiplier
    : 1.0;

  return Math.max(1, Math.round(base / speed));
}

/**
 * Resolves the effective stagger interval in frames.
 */
export function resolveEffectiveStagger(
  explicitStagger: number | undefined,
  config: ResolvedAnimationConfig | GlobalAnimationConfig = DEFAULT_GLOBAL_ANIMATION_CONFIG,
): number {
  if (config.reducedMotion) {
    return 0;
  }

  const base = explicitStagger !== undefined
    ? Math.max(0, Math.round(explicitStagger))
    : (config.defaultStaggerInterval ?? DEFAULT_GLOBAL_ANIMATION_CONFIG.defaultStaggerInterval);

  if (base === 0) return 0;

  const speed = (config.speedMultiplier !== undefined && config.speedMultiplier > 0)
    ? config.speedMultiplier
    : 1.0;

  return Math.max(0, Math.round(base / speed));
}

/**
 * Resolves the effective easing curve.
 * Precedence: explicit easing override > config.defaultEasing.
 */
export function resolveEffectiveEasing(
  explicitEasing: EasingPresetName | EasingFunction | undefined,
  config: ResolvedAnimationConfig | GlobalAnimationConfig = DEFAULT_GLOBAL_ANIMATION_CONFIG,
): EasingPresetName | EasingFunction {
  return explicitEasing ?? config.defaultEasing ?? DEFAULT_GLOBAL_ANIMATION_CONFIG.defaultEasing;
}

/**
 * Validation result for global animation configuration.
 */
export interface AnimationConfigValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates an animation configuration object for anomalies.
 */
export function validateAnimationConfig(
  config: GlobalAnimationConfig,
): AnimationConfigValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (config.defaultDuration !== undefined && config.defaultDuration < 0) {
    errors.push(`defaultDuration cannot be negative (got ${config.defaultDuration})`);
  }
  if (config.defaultTransitionDuration !== undefined && config.defaultTransitionDuration < 0) {
    errors.push(`defaultTransitionDuration cannot be negative (got ${config.defaultTransitionDuration})`);
  }
  if (config.defaultStaggerInterval !== undefined && config.defaultStaggerInterval < 0) {
    errors.push(`defaultStaggerInterval cannot be negative (got ${config.defaultStaggerInterval})`);
  }
  if (config.speedMultiplier !== undefined) {
    if (config.speedMultiplier <= 0) {
      errors.push(`speedMultiplier must be strictly greater than 0 (got ${config.speedMultiplier})`);
    } else if (config.speedMultiplier > 5.0) {
      warnings.push(`speedMultiplier is unusually high (${config.speedMultiplier}x)`);
    } else if (config.speedMultiplier < 0.2) {
      warnings.push(`speedMultiplier is unusually low (${config.speedMultiplier}x)`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
