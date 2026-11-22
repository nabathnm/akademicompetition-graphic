/**
 * GlobalAnimationConfig Unit Test Suite
 * Tests configuration merging precedence, speed multipliers,
 * reduced-motion static mode, transition durations, and validation.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_GLOBAL_ANIMATION_CONFIG,
  mergeAnimationConfigs,
  resolveEffectiveDuration,
  resolveEffectiveEasing,
  resolveEffectiveStagger,
  resolveEffectiveTransitionDuration,
  validateAnimationConfig,
} from '../src/config/animation/animationConfigStyle.ts';
import type { GlobalAnimationConfig } from '../src/config/animation/animationConfigTypes.ts';

describe('GlobalAnimationConfig - Framework Defaults', () => {
  it('supplies standard framework default values', () => {
    assert.strictEqual(DEFAULT_GLOBAL_ANIMATION_CONFIG.defaultDuration, 18);
    assert.strictEqual(DEFAULT_GLOBAL_ANIMATION_CONFIG.defaultEasing, 'easeOutCubic');
    assert.strictEqual(DEFAULT_GLOBAL_ANIMATION_CONFIG.speedMultiplier, 1.0);
    assert.strictEqual(DEFAULT_GLOBAL_ANIMATION_CONFIG.defaultTransitionDuration, 15);
    assert.strictEqual(DEFAULT_GLOBAL_ANIMATION_CONFIG.defaultStaggerInterval, 6);
    assert.strictEqual(DEFAULT_GLOBAL_ANIMATION_CONFIG.reducedMotion, false);
    assert.ok(DEFAULT_GLOBAL_ANIMATION_CONFIG.presets);
  });
});

describe('GlobalAnimationConfig - Precedence & Layered Merging', () => {
  it('falls back to framework defaults when inputs are undefined or empty', () => {
    const resolved = mergeAnimationConfigs(undefined, {});
    assert.strictEqual(resolved.defaultDuration, 18);
    assert.strictEqual(resolved.speedMultiplier, 1.0);
    assert.strictEqual(resolved.defaultTransitionDuration, 15);
  });

  it('respects composition-level overrides over framework defaults', () => {
    const compositionConfig: GlobalAnimationConfig = {
      defaultDuration: 24,
      speedMultiplier: 1.25,
      defaultTransitionDuration: 20,
    };

    const resolved = mergeAnimationConfigs(compositionConfig);
    assert.strictEqual(resolved.defaultDuration, 24);
    assert.strictEqual(resolved.speedMultiplier, 1.25);
    assert.strictEqual(resolved.defaultTransitionDuration, 20);
    // Unspecified settings remain framework defaults
    assert.strictEqual(resolved.defaultStaggerInterval, 6);
    assert.strictEqual(resolved.reducedMotion, false);
  });

  it('enforces 4-tier precedence: Component > Scene > Composition > Framework Defaults', () => {
    const compositionTier: GlobalAnimationConfig = {
      defaultDuration: 30,
      defaultEasing: 'linear',
      speedMultiplier: 1.0,
    };

    const sceneTier: GlobalAnimationConfig = {
      defaultDuration: 25,
      defaultEasing: 'easeInOutCubic',
      speedMultiplier: 1.5,
    };

    const componentTier: GlobalAnimationConfig = {
      defaultDuration: 12,
    };

    // 1. Composition level only
    const atComposition = mergeAnimationConfigs(compositionTier);
    assert.strictEqual(atComposition.defaultDuration, 30);
    assert.strictEqual(atComposition.defaultEasing, 'linear');

    // 2. Scene level overrides composition level
    const atScene = mergeAnimationConfigs(compositionTier, sceneTier);
    assert.strictEqual(atScene.defaultDuration, 25);
    assert.strictEqual(atScene.defaultEasing, 'easeInOutCubic');
    assert.strictEqual(atScene.speedMultiplier, 1.5);

    // 3. Component level overrides scene and composition levels
    const atComponent = mergeAnimationConfigs(compositionTier, sceneTier, componentTier);
    assert.strictEqual(atComponent.defaultDuration, 12);
    assert.strictEqual(atComponent.defaultEasing, 'easeInOutCubic'); // Inherited from scene
    assert.strictEqual(atComponent.speedMultiplier, 1.5); // Inherited from scene
  });

  it('merges presets across tiers without wiping existing presets', () => {
    const tierA: GlobalAnimationConfig = {
      presets: {
        spring: {
          brandSnappy: { damping: 14, mass: 0.5, stiffness: 220, overshootClamping: false },
        },
      },
    };

    const tierB: GlobalAnimationConfig = {
      presets: {
        spring: {
          brandGentle: { damping: 28, mass: 1.2, stiffness: 90, overshootClamping: false },
        },
      },
    };

    const merged = mergeAnimationConfigs(tierA, tierB);
    assert.ok(merged.presets.spring.brandSnappy);
    assert.ok(merged.presets.spring.brandGentle);
    assert.ok(merged.presets.spring.snappy); // From framework defaults
  });
});

describe('GlobalAnimationConfig - Speed Multiplier & Duration Resolution', () => {
  it('scales duration proportionally with speedMultiplier', () => {
    // 2.0x speed -> 20 frames becomes 10 frames
    const fastConfig: GlobalAnimationConfig = { speedMultiplier: 2.0 };
    assert.strictEqual(resolveEffectiveDuration(20, fastConfig), 10);

    // 0.5x speed -> 20 frames becomes 40 frames
    const slowConfig: GlobalAnimationConfig = { speedMultiplier: 0.5 };
    assert.strictEqual(resolveEffectiveDuration(20, slowConfig), 40);

    // 1.0x speed -> 20 frames remains 20 frames
    const normalConfig: GlobalAnimationConfig = { speedMultiplier: 1.0 };
    assert.strictEqual(resolveEffectiveDuration(20, normalConfig), 20);
  });

  it('uses defaultDuration when explicit duration is undefined', () => {
    const config: GlobalAnimationConfig = { defaultDuration: 24, speedMultiplier: 2.0 };
    // 24 / 2.0 = 12
    assert.strictEqual(resolveEffectiveDuration(undefined, config), 12);
  });

  it('enforces a lower bound of 1 frame when base duration is greater than 0', () => {
    const ultraFast: GlobalAnimationConfig = { speedMultiplier: 10.0 };
    assert.strictEqual(resolveEffectiveDuration(2, ultraFast), 1);
  });

  it('keeps 0-duration animations at 0', () => {
    const config: GlobalAnimationConfig = { speedMultiplier: 2.0 };
    assert.strictEqual(resolveEffectiveDuration(0, config), 0);
  });

  it('scales transition duration and stagger interval with speedMultiplier', () => {
    const config: GlobalAnimationConfig = {
      defaultTransitionDuration: 20,
      defaultStaggerInterval: 10,
      speedMultiplier: 2.0,
    };

    assert.strictEqual(resolveEffectiveTransitionDuration(undefined, config), 10);
    assert.strictEqual(resolveEffectiveStagger(undefined, config), 5);

    // Explicit override scaled by speed
    assert.strictEqual(resolveEffectiveTransitionDuration(30, config), 15);
    assert.strictEqual(resolveEffectiveStagger(8, config), 4);
  });
});

describe('GlobalAnimationConfig - Reduced Motion Mode', () => {
  const reducedConfig: GlobalAnimationConfig = {
    reducedMotion: true,
    defaultDuration: 30,
    speedMultiplier: 1.0,
  };

  it('forces duration to strictly 0 frames in reduced-motion mode', () => {
    assert.strictEqual(resolveEffectiveDuration(undefined, reducedConfig), 0);
    assert.strictEqual(resolveEffectiveDuration(50, reducedConfig), 0);
  });

  it('forces transition duration to strictly 0 frames in reduced-motion mode', () => {
    assert.strictEqual(resolveEffectiveTransitionDuration(undefined, reducedConfig), 0);
    assert.strictEqual(resolveEffectiveTransitionDuration(25, reducedConfig), 0);
  });

  it('forces stagger delay to strictly 0 frames in reduced-motion mode', () => {
    assert.strictEqual(resolveEffectiveStagger(undefined, reducedConfig), 0);
    assert.strictEqual(resolveEffectiveStagger(12, reducedConfig), 0);
  });
});

describe('GlobalAnimationConfig - Easing Precedence', () => {
  it('favors explicit component easing over global default easing', () => {
    const config: GlobalAnimationConfig = { defaultEasing: 'easeInOut' };
    assert.strictEqual(resolveEffectiveEasing('easeInCubic', config), 'easeInCubic');
  });

  it('falls back to config.defaultEasing when explicit easing is undefined', () => {
    const config: GlobalAnimationConfig = { defaultEasing: 'easeInOutExpo' };
    assert.strictEqual(resolveEffectiveEasing(undefined, config), 'easeInOutExpo');
  });

  it('falls back to framework default when config easing is not provided', () => {
    assert.strictEqual(resolveEffectiveEasing(undefined, {}), 'easeOutCubic');
  });
});

describe('GlobalAnimationConfig - Validation', () => {
  it('validates valid animation configs with isValid: true', () => {
    const result = validateAnimationConfig({
      defaultDuration: 18,
      speedMultiplier: 1.2,
      defaultTransitionDuration: 15,
      defaultStaggerInterval: 6,
    });
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.errors.length, 0);
  });

  it('catches negative durations and non-positive speedMultiplier', () => {
    const result = validateAnimationConfig({
      defaultDuration: -5,
      speedMultiplier: 0,
      defaultTransitionDuration: -10,
    });
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.length >= 3);
  });

  it('warns on extreme speed multipliers', () => {
    const fast = validateAnimationConfig({ speedMultiplier: 8.0 });
    assert.ok(fast.warnings.length > 0);

    const slow = validateAnimationConfig({ speedMultiplier: 0.1 });
    assert.ok(slow.warnings.length > 0);
  });
});
