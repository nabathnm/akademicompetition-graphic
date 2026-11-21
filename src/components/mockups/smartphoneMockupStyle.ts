/**
 * SmartphoneMockup Style & Motion Calculations
 * Pure mathematical functions for aspect ratio resolution, device model presets,
 * deterministic floating kinetics, harmonic tilt angles, and sequential screen reveal transitions.
 * Layer 2 / Layer 3 of the Motion Graphics Framework.
 */

import type {
  DeviceFrameDimensions,
  DeviceNotchType,
  SmartphoneFloatingConfig,
  SmartphoneMockupProps,
  SmartphoneModelPreset,
  SmartphoneScreenRevealConfig,
  SmartphoneTiltConfig,
} from './types.ts';
import { calculateDeviceDimensions } from './deviceFrameStyle.ts';
import { clamp } from '../../utils/animation/clamp.ts';
import { easeOutCubic } from '../../utils/animation/easing.ts';

/**
 * Standard calibrated flagship model specifications.
 */
export const SMARTPHONE_PRESETS: Record<
  Exclude<SmartphoneModelPreset, 'custom'>,
  {
    width: number;
    height: number;
    frameThickness: number;
    borderRadius: number;
    notch: DeviceNotchType;
  }
> = {
  flagship: {
    width: 320,
    height: 660,
    frameThickness: 12,
    borderRadius: 40,
    notch: 'dynamic-island',
  },
  compact: {
    width: 280,
    height: 560,
    frameThickness: 10,
    borderRadius: 34,
    notch: 'punch-hole',
  },
  'pro-max': {
    width: 360,
    height: 740,
    frameThickness: 13,
    borderRadius: 44,
    notch: 'dynamic-island',
  },
  fold: {
    width: 300,
    height: 700,
    frameThickness: 11,
    borderRadius: 28,
    notch: 'punch-hole',
  },
};

/**
 * Parses aspect ratio expressions ('9:19.5', '9:20', '9:16', '19.5/9', or numeric ratio)
 * into a height-to-width factor ($H/W$).
 */
export function parseAspectRatio(aspectRatio?: string | number): number | undefined {
  if (aspectRatio === undefined || aspectRatio === null) {
    return undefined;
  }

  if (typeof aspectRatio === 'number') {
    return aspectRatio > 0 ? aspectRatio : undefined;
  }

  const str = aspectRatio.trim();
  if (str.includes(':')) {
    const parts = str.split(':').map((p) => parseFloat(p.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1]) && parts[0] > 0 && parts[1] > 0) {
      // e.g. 9:19.5 -> height to width ratio is 19.5 / 9 = 2.1667
      return parts[1] / parts[0];
    }
  }

  if (str.includes('/')) {
    const parts = str.split('/').map((p) => parseFloat(p.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1]) && parts[0] > 0 && parts[1] > 0) {
      return parts[0] / parts[1];
    }
  }

  const parsed = parseFloat(str);
  return isNaN(parsed) || parsed <= 0 ? undefined : parsed;
}

/**
 * Resolves smartphone outer geometry and inner screen dimensions,
 * taking into account model presets, explicit widths/heights, and aspect ratio overrides.
 */
export function resolveSmartphoneDimensions(
  props: Partial<SmartphoneMockupProps> = {}
): DeviceFrameDimensions {
  const presetKey = props.model && props.model !== 'custom' ? props.model : undefined;
  const preset = presetKey ? SMARTPHONE_PRESETS[presetKey] : undefined;

  let width = props.width ?? preset?.width ?? 320;
  let height = props.height ?? preset?.height ?? 660;

  const ratio = parseAspectRatio(props.aspectRatio);
  if (ratio !== undefined) {
    if (props.width !== undefined && props.height === undefined) {
      height = Math.round(props.width * ratio);
    } else if (props.height !== undefined && props.width === undefined) {
      width = Math.round(props.height / ratio);
    } else if (props.width === undefined && props.height === undefined) {
      height = Math.round(width * ratio);
    }
  }

  const frameThickness = props.frameThickness ?? preset?.frameThickness ?? 12;
  const borderRadius = props.borderRadius ?? preset?.borderRadius ?? 40;

  return calculateDeviceDimensions({
    width,
    height,
    frameThickness,
    borderRadius,
    screenRadius: props.screenRadius,
  });
}

/**
 * Resolves camera cutout / notch type from boolean flags or specific notch identifiers.
 */
export function resolveCameraCutout(
  showCamera?: boolean | DeviceNotchType,
  cameraCutout?: DeviceNotchType,
  presetNotch?: DeviceNotchType
): DeviceNotchType {
  if (showCamera === false) {
    return 'none';
  }

  if (typeof showCamera === 'string') {
    return showCamera;
  }

  if (cameraCutout !== undefined) {
    return cameraCutout;
  }

  if (presetNotch !== undefined) {
    return presetNotch;
  }

  return 'dynamic-island';
}

/**
 * Calculates continuous deterministic Remotion floating motion:
 * $\Delta y = A \sin\left(\frac{2\pi \cdot f \cdot (\text{frame} - \text{delay})}{\text{fps}} + \phi\right)$
 */
export function calculateContinuousFloating(params: {
  currentFrame: number;
  fps: number;
  config?: boolean | SmartphoneFloatingConfig;
  delay?: number;
}): number {
  const { currentFrame, fps, config, delay = 0 } = params;

  if (!config) {
    return 0;
  }

  if (currentFrame < delay) {
    return 0;
  }

  const amplitude = typeof config === 'object' && config.amplitude !== undefined ? config.amplitude : 8;
  const frequency = typeof config === 'object' && config.frequency !== undefined ? config.frequency : 0.5;
  const phase = typeof config === 'object' && config.phase !== undefined ? config.phase : 0;

  const elapsedSec = (currentFrame - delay) / Math.max(1, fps);
  const y = amplitude * Math.sin(2 * Math.PI * frequency * elapsedSec + phase);

  return Math.round(y * 1000) / 1000;
}

/**
 * Calculates continuous deterministic Remotion gentle tilt angle:
 * $\Delta \theta = \theta_{\max} \sin\left(\frac{2\pi \cdot f \cdot (\text{frame} - \text{delay})}{\text{fps}}\right)$
 */
export function calculateContinuousTilt(params: {
  currentFrame: number;
  fps: number;
  config?: boolean | SmartphoneTiltConfig;
  delay?: number;
}): number {
  const { currentFrame, fps, config, delay = 0 } = params;

  if (!config) {
    return 0;
  }

  if (currentFrame < delay) {
    return 0;
  }

  const maxAngle = typeof config === 'object' && config.maxAngle !== undefined ? config.maxAngle : 3;
  const frequency = typeof config === 'object' && config.frequency !== undefined ? config.frequency : 0.35;

  const elapsedSec = (currentFrame - delay) / Math.max(1, fps);
  const angle = maxAngle * Math.sin(2 * Math.PI * frequency * elapsedSec);

  return Math.round(angle * 1000) / 1000;
}

export interface ScreenRevealState {
  progress: number;
  opacity: number;
  translateY: number;
  scale: number;
  isRevealing: boolean;
  isComplete: boolean;
}

/**
 * Calculates deterministic sequential screen reveal state following device entrance.
 */
export function calculateScreenRevealState(params: {
  currentFrame: number;
  config?: boolean | SmartphoneScreenRevealConfig;
}): ScreenRevealState {
  const { currentFrame, config } = params;

  if (!config) {
    return {
      progress: 1,
      opacity: 1,
      translateY: 0,
      scale: 1,
      isRevealing: false,
      isComplete: true,
    };
  }

  const delay = typeof config === 'object' && config.delay !== undefined ? config.delay : 15;
  const duration = typeof config === 'object' && config.duration !== undefined ? Math.max(1, config.duration) : 15;
  const type = typeof config === 'object' && config.type !== undefined ? config.type : 'fade';

  if (currentFrame < delay) {
    return {
      progress: 0,
      opacity: 0,
      translateY: type === 'wipe-up' ? 24 : 0,
      scale: type === 'scale' ? 0.94 : 1,
      isRevealing: false,
      isComplete: false,
    };
  }

  const elapsed = currentFrame - delay;
  const rawProgress = clamp(elapsed / duration, 0, 1);
  const eased = easeOutCubic(rawProgress);

  const opacity = eased;
  let translateY = 0;
  let scale = 1;

  if (type === 'wipe-up') {
    translateY = 24 * (1 - eased);
  } else if (type === 'scale') {
    scale = 0.94 + 0.06 * eased;
  }

  return {
    progress: eased,
    opacity: clamp(opacity, 0, 1),
    translateY: Math.round(translateY * 1000) / 1000,
    scale: Math.round(scale * 1000) / 1000,
    isRevealing: currentFrame >= delay && currentFrame < delay + duration,
    isComplete: rawProgress >= 1,
  };
}
