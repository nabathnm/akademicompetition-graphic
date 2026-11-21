/**
 * TabletMockup Pure Calculations & Styling Engine
 * Pure mathematical functions for tablet dimensions, aspect ratios,
 * concentric screen geometry, hardware accents, and orientation rotation kinetics.
 */

import { easeOut, resolveEasing } from '../../utils/animation/easing.ts';
import type {
  TabletDimensions,
  TabletFinish,
  TabletModelPreset,
  TabletOrientation,
  TabletRotationConfig,
} from './types.ts';

/**
 * Standard calibrated tablet model presets.
 * Designed around modern tablet form factors:
 * - compact: 8.3-inch mini (compact reading / portable)
 * - standard: 11-inch (versatile tablet)
 * - pro: 12.9-inch (large workstation canvas)
 */
export const TABLET_PRESETS: Record<
  Exclude<TabletModelPreset, 'custom'>,
  {
    portraitWidth: number;
    portraitHeight: number;
    landscapeWidth: number;
    landscapeHeight: number;
    frameThickness: number;
    borderRadius: number;
    aspectRatio: number;
  }
> = {
  compact: {
    portraitWidth: 440,
    portraitHeight: 620,
    landscapeWidth: 620,
    landscapeHeight: 440,
    frameThickness: 14,
    borderRadius: 22,
    aspectRatio: 620 / 440, // ~1.409
  },
  standard: {
    portraitWidth: 520,
    portraitHeight: 720,
    landscapeWidth: 720,
    landscapeHeight: 520,
    frameThickness: 16,
    borderRadius: 26,
    aspectRatio: 720 / 520, // ~1.385
  },
  pro: {
    portraitWidth: 620,
    portraitHeight: 840,
    landscapeWidth: 840,
    landscapeHeight: 620,
    frameThickness: 16,
    borderRadius: 28,
    aspectRatio: 840 / 620, // ~1.355
  },
};

/**
 * Pre-configured metallic hardware finish palettes for tablets.
 */
export const TABLET_FINISH_COLORS: Record<TabletFinish, string> = {
  'space-gray': '#2d3139',
  silver: '#d8dde6',
  starlight: '#e8e4dc',
  midnight: '#161c28',
  'rose-gold': '#e8cfc8',
  'sky-blue': '#a8c6db',
};

/**
 * Parses tablet aspect ratios (e.g. '4:3', '16:10', '3:2', or numeric).
 * Returns the horizontal / vertical ratio (width / height) normalized for orientation.
 */
export function parseTabletAspectRatio(
  ratio: string | number | undefined,
  orientation: TabletOrientation = 'landscape'
): number {
  let rawRatio: number;

  if (typeof ratio === 'number' && Number.isFinite(ratio) && ratio > 0) {
    rawRatio = ratio;
  } else if (typeof ratio === 'string' && ratio.trim().length > 0) {
    const trimmed = ratio.trim();
    if (trimmed.includes(':')) {
      const parts = trimmed.split(':').map((p) => Number.parseFloat(p.trim()));
      if (parts.length === 2 && !Number.isNaN(parts[0]) && !Number.isNaN(parts[1]) && parts[1] > 0) {
        rawRatio = parts[0] / parts[1];
      } else {
        rawRatio = 4 / 3;
      }
    } else if (trimmed.includes('/')) {
      const parts = trimmed.split('/').map((p) => Number.parseFloat(p.trim()));
      if (parts.length === 2 && !Number.isNaN(parts[0]) && !Number.isNaN(parts[1]) && parts[1] > 0) {
        rawRatio = parts[0] / parts[1];
      } else {
        rawRatio = 4 / 3;
      }
    } else {
      const parsed = Number.parseFloat(trimmed);
      rawRatio = !Number.isNaN(parsed) && parsed > 0 ? parsed : 4 / 3;
    }
  } else {
    // Default tablet aspect ratio is 4:3 (~1.333)
    rawRatio = 4 / 3;
  }

  // Ensure rawRatio is > 1 for base landscape proportion
  const baseLandscape = rawRatio < 1 ? 1 / rawRatio : rawRatio;

  if (orientation === 'landscape') {
    return baseLandscape;
  }
  return 1 / baseLandscape;
}

/**
 * Resolves full tablet dimensions, orientation parameters, and concentric radii.
 */
export function resolveTabletDimensions(params: {
  model?: TabletModelPreset;
  preset?: TabletModelPreset;
  orientation?: TabletOrientation;
  width?: number;
  height?: number;
  aspectRatio?: string | number;
  frameThickness?: number;
  borderRadius?: number;
  screenRadius?: number;
} = {}): TabletDimensions {
  const modelKey = params.preset ?? params.model ?? 'standard';
  const orientation = params.orientation ?? 'landscape';
  const preset = modelKey !== 'custom' ? TABLET_PRESETS[modelKey] : TABLET_PRESETS.standard;

  const frameThickness = Math.max(4, params.frameThickness ?? preset.frameThickness);
  const borderRadius = Math.max(frameThickness + 2, params.borderRadius ?? preset.borderRadius);
  const concentricDefault = Math.max(2, borderRadius - frameThickness);
  const screenRadius = params.screenRadius !== undefined ? Math.max(0, params.screenRadius) : concentricDefault;

  let width: number;
  let height: number;

  const ratio = parseTabletAspectRatio(params.aspectRatio, orientation);

  if (params.width !== undefined && params.height !== undefined) {
    // Both explicitly supplied
    width = Math.max(100, Math.round(params.width));
    height = Math.max(100, Math.round(params.height));
  } else if (params.width !== undefined) {
    // Width supplied, compute height via aspect ratio
    width = Math.max(100, Math.round(params.width));
    // screenWidth = width - 2 * frameThickness
    const screenW = Math.max(20, width - 2 * frameThickness);
    const screenH = Math.round(screenW / ratio);
    height = screenH + 2 * frameThickness;
  } else if (params.height !== undefined) {
    // Height supplied, compute width via aspect ratio
    height = Math.max(100, Math.round(params.height));
    const screenH = Math.max(20, height - 2 * frameThickness);
    const screenW = Math.round(screenH * ratio);
    width = screenW + 2 * frameThickness;
  } else {
    // Use preset defaults matching orientation
    if (orientation === 'landscape') {
      width = preset.landscapeWidth;
      height = preset.landscapeHeight;
    } else {
      width = preset.portraitWidth;
      height = preset.portraitHeight;
    }
  }

  const screenWidth = Math.max(1, width - 2 * frameThickness);
  const screenHeight = Math.max(1, height - 2 * frameThickness);
  const computedRatio = screenWidth / screenHeight;

  return {
    width,
    height,
    orientation,
    frameThickness,
    borderRadius,
    screenRadius,
    screenWidth,
    screenHeight,
    aspectRatio: computedRatio,
  };
}

/**
 * Calculates deterministic device orientation rotation angle.
 * Supports static rotation degrees or frame-based transition rotation.
 */
export function calculateTabletRotationState(params: {
  currentFrame: number;
  config?: boolean | TabletRotationConfig;
  staticAngle?: number;
}): number {
  if (params.staticAngle !== undefined) {
    return params.staticAngle;
  }

  if (!params.config) {
    return 0;
  }

  const cfg = typeof params.config === 'object' ? params.config : {};
  const startFrame = cfg.startFrame ?? 0;
  const duration = Math.max(1, cfg.duration ?? 30);
  const fromAngle = cfg.fromAngle ?? 0;
  const toAngle = cfg.toAngle ?? 90;

  if (params.currentFrame < startFrame) {
    return fromAngle;
  }

  const progress = Math.min(1, Math.max(0, (params.currentFrame - startFrame) / duration));
  const easingFn = (cfg.easing ? resolveEasing(cfg.easing) : undefined) ?? easeOut;
  const eased = easingFn(progress);

  const angle = fromAngle + (toAngle - fromAngle) * eased;
  // Sanitize signed zero (-0)
  return Math.abs(angle) < 1e-6 ? 0 : angle;
}
