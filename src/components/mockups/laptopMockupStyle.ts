/**
 * LaptopMockup Style & Motion Calculations
 * Pure mathematical functions for laptop lid/base dimension resolution,
 * aspect ratio geometry, hinge mechanics, and deterministic frame-based lid opening kinetics.
 * Layer 2 / Layer 3 of the Motion Graphics Framework.
 */

import type {
  LaptopDimensions,
  LaptopMockupProps,
  LaptopModelPreset,
  LaptopOpeningConfig,
  LaptopOpeningState,
} from './types.ts';
import { clamp } from '../../utils/animation/clamp.ts';
import { resolveEasing, easeOutCubic } from '../../utils/animation/easing.ts';

export const LAPTOP_PRESETS: Record<
  Exclude<LaptopModelPreset, 'custom'>,
  {
    width: number;
    screenAspectRatio: string;
    bezelThickness: number;
    borderRadius: number;
    baseHeight: number;
  }
> = {
  compact: {
    width: 560,
    screenAspectRatio: '16:10',
    bezelThickness: 9,
    borderRadius: 12,
    baseHeight: 85,
  },
  standard: {
    width: 680,
    screenAspectRatio: '16:10',
    bezelThickness: 10,
    borderRadius: 14,
    baseHeight: 100,
  },
  pro: {
    width: 780,
    screenAspectRatio: '16:10',
    bezelThickness: 11,
    borderRadius: 16,
    baseHeight: 115,
  },
};

/**
 * Parses screen aspect ratio ('16:10', '16:9', '3:2', or numeric)
 * into a height-to-width multiplier factor.
 */
export function parseScreenAspectRatio(ratio?: string | number): number {
  if (ratio === undefined || ratio === null) {
    return 10 / 16; // 0.625 standard 16:10
  }

  if (typeof ratio === 'number') {
    if (ratio <= 0) return 10 / 16;
    return ratio > 1 ? 1 / ratio : ratio;
  }

  const str = ratio.trim();
  if (str.includes(':')) {
    const parts = str.split(':').map((p) => parseFloat(p.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1]) && parts[0] > 0 && parts[1] > 0) {
      // e.g. 16:10 -> 10 / 16 = 0.625
      return parts[1] / parts[0];
    }
  }

  if (str.includes('/')) {
    const parts = str.split('/').map((p) => parseFloat(p.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1]) && parts[0] > 0 && parts[1] > 0) {
      return parts[0] < parts[1] ? parts[0] / parts[1] : parts[1] / parts[0];
    }
  }

  const parsed = parseFloat(str);
  if (isNaN(parsed) || parsed <= 0) {
    return 10 / 16;
  }
  return parsed > 1 ? 1 / parsed : parsed;
}

/**
 * Resolves complete laptop physical dimensions (display lid, screen viewport, hinge, keyboard deck, trackpad).
 */
export function resolveLaptopDimensions(
  props: Partial<LaptopMockupProps> = {}
): LaptopDimensions {
  const presetKey = props.model && props.model !== 'custom' ? props.model : undefined;
  const preset = presetKey ? LAPTOP_PRESETS[presetKey] : undefined;

  const width = Math.max(320, props.width ?? preset?.width ?? 680);
  const bezelThickness = Math.max(4, props.bezelThickness ?? preset?.bezelThickness ?? 10);
  const borderRadius = Math.max(2, props.borderRadius ?? preset?.borderRadius ?? 14);

  const ratio = parseScreenAspectRatio(props.screenAspectRatio ?? preset?.screenAspectRatio);
  const screenWidth = Math.max(100, width - bezelThickness * 2);
  const screenHeight = Math.max(60, Math.round(screenWidth * ratio));

  const lidWidth = width;
  const lidHeight = screenHeight + bezelThickness * 2;
  const screenRadius = props.screenRadius !== undefined ? Math.max(0, props.screenRadius) : Math.max(0, borderRadius - bezelThickness);

  const baseHeight = Math.max(40, props.baseHeight ?? preset?.baseHeight ?? 100);
  const baseWidth = width + 28; // subtle flare for keyboard deck perspective

  const hingeWidth = Math.round(width * 0.42);
  const hingeHeight = 8;

  const keyboardWidth = Math.round(width * 0.78);
  const keyboardHeight = Math.round(baseHeight * 0.52);

  const trackpadWidth = Math.round(width * 0.28);
  const trackpadHeight = Math.round(baseHeight * 0.36);

  const totalHeight = props.height ?? (lidHeight + hingeHeight + baseHeight);

  return {
    width,
    height: totalHeight,
    lidWidth,
    lidHeight,
    bezelThickness,
    screenWidth,
    screenHeight,
    screenRadius,
    baseWidth,
    baseHeight,
    hingeWidth,
    hingeHeight,
    keyboardWidth,
    keyboardHeight,
    trackpadWidth,
    trackpadHeight,
    borderRadius,
  };
}

/**
 * Computes deterministic frame-accurate laptop lid opening kinetics.
 */
export function calculateLaptopOpeningState(params: {
  currentFrame: number;
  config?: boolean | LaptopOpeningConfig;
}): LaptopOpeningState {
  const { currentFrame, config } = params;

  if (!config) {
    return {
      progress: 1,
      angle: 0,
      lidOpacity: 1,
      isOpening: false,
      isComplete: true,
    };
  }

  const startFrame = typeof config === 'object' && config.startFrame !== undefined ? config.startFrame : 0;
  const duration = typeof config === 'object' && config.duration !== undefined ? Math.max(1, config.duration) : 30;
  const fromAngle = typeof config === 'object' && config.fromAngle !== undefined ? config.fromAngle : 70;
  const toAngle = typeof config === 'object' && config.toAngle !== undefined ? config.toAngle : 0;

  const easeFn = typeof config === 'object' && config.easing ? resolveEasing(config.easing) ?? easeOutCubic : easeOutCubic;

  if (currentFrame < startFrame) {
    return {
      progress: 0,
      angle: fromAngle,
      lidOpacity: 0.5,
      isOpening: false,
      isComplete: false,
    };
  }

  const elapsed = currentFrame - startFrame;
  const rawProgress = clamp(elapsed / duration, 0, 1);
  const eased = easeFn(rawProgress);

  const rawAngle = Math.round((fromAngle + eased * (toAngle - fromAngle)) * 100) / 100;
  const angle = Math.abs(rawAngle) < 1e-6 ? 0 : rawAngle;
  const lidOpacity = Math.round((0.5 + eased * 0.5) * 1000) / 1000;

  return {
    progress: eased,
    angle,
    lidOpacity,
    isOpening: rawProgress < 1,
    isComplete: rawProgress >= 1,
  };
}
