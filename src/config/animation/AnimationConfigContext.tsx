/**
 * AnimationConfigContext & React Provider
 * React context and hook for distributing and overriding global animation configurations
 * across scenes, compositions, and atomic components.
 *
 * Layer 1 / Layer 4 of the Motion Graphics Framework.
 */

import React, { createContext, useContext, useMemo } from 'react';
import type {
  AnimationConfigProviderProps,
  GlobalAnimationConfig,
  ResolvedAnimationConfig,
  UseAnimationConfigReturn,
} from './animationConfigTypes.ts';
import {
  DEFAULT_GLOBAL_ANIMATION_CONFIG,
  mergeAnimationConfigs,
  resolveEffectiveDuration,
  resolveEffectiveEasing,
  resolveEffectiveStagger,
  resolveEffectiveTransitionDuration,
} from './animationConfigStyle.ts';
import type { EasingFunction, EasingPresetName } from '../../utils/animation/easing.ts';

/**
 * React Context storing the active animation configuration.
 */
export const AnimationConfigContext = createContext<ResolvedAnimationConfig>(
  DEFAULT_GLOBAL_ANIMATION_CONFIG,
);

/**
 * Provider component for setting or overriding animation settings for a subtree.
 * Supports nesting: child providers merge with parent context following the precedence hierarchy.
 */
export const AnimationConfigProvider: React.FC<AnimationConfigProviderProps> = ({
  value,
  children,
}) => {
  const parentConfig = useContext(AnimationConfigContext);

  const resolvedConfig = useMemo(() => {
    return mergeAnimationConfigs(parentConfig, value);
  }, [parentConfig, value]);

  return (
    <AnimationConfigContext.Provider value={resolvedConfig}>
      {children}
    </AnimationConfigContext.Provider>
  );
};

/**
 * Primary hook for accessing and resolving animation parameters within components and scenes.
 *
 * @param localOverrides Optional component-level overrides (highest priority in precedence hierarchy)
 * @returns Helper methods and resolved configuration
 */
export function useAnimationConfig(
  localOverrides?: Partial<GlobalAnimationConfig>,
): UseAnimationConfigReturn {
  const contextConfig = useContext(AnimationConfigContext);

  const activeConfig = useMemo(() => {
    if (!localOverrides) return contextConfig;
    return mergeAnimationConfigs(contextConfig, localOverrides);
  }, [contextConfig, localOverrides]);

  const getDuration = useMemo(() => {
    return (explicitDuration?: number) =>
      resolveEffectiveDuration(explicitDuration, activeConfig);
  }, [activeConfig]);

  const getTransitionDuration = useMemo(() => {
    return (explicitDuration?: number) =>
      resolveEffectiveTransitionDuration(explicitDuration, activeConfig);
  }, [activeConfig]);

  const getStagger = useMemo(() => {
    return (explicitStagger?: number) =>
      resolveEffectiveStagger(explicitStagger, activeConfig);
  }, [activeConfig]);

  const getEasing = useMemo(() => {
    return (explicitEasing?: EasingPresetName | EasingFunction) =>
      resolveEffectiveEasing(explicitEasing, activeConfig);
  }, [activeConfig]);

  return {
    config: activeConfig,
    getDuration,
    getTransitionDuration,
    getStagger,
    getEasing,
    isReducedMotion: activeConfig.reducedMotion,
    speedMultiplier: activeConfig.speedMultiplier,
  };
}
