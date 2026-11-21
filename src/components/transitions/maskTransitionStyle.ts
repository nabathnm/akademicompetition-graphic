/**
 * MaskTransition Pure Mathematical Engine & Styling Logic
 * Frame-accurate calculation of normalized geometric masks and SVG paths,
 * objectBoundingBox transforms, scale expansions, rotational pivots,
 * and dual-layer mask replacements.
 */

import { easeInOut, resolveEasing } from '../../utils/animation/easing.ts';
import type { EasingFunction, EasingPresetName } from '../../utils/animation/easing.ts';
import { createSpring } from '../../utils/animation/spring.ts';
import type { SpringPresetName } from '../../styles/motion.ts';
import type {
  MaskOriginPoint,
  MaskPolygonShape,
  MaskShapeData,
  MaskTransitionMetrics,
  MaskTransitionMode,
  MaskType,
} from './types.ts';

/**
 * Sanitizes numeric values to prevent IEEE-754 signed negative zero (-0)
 * and floating point inaccuracy.
 */
export function sanitizeMaskNumber(val: number): number {
  if (Number.isNaN(val) || Math.abs(val) < 1e-6) {
    return 0;
  }
  return Number(val.toFixed(4));
}

/**
 * Normalizes input mask type into standard canonical type.
 */
export function normalizeMaskType(
  type?: MaskType
): 'rectangle' | 'rounded-rectangle' | 'circle' | 'ellipse' | 'polygon' | 'path' {
  if (!type || type === 'circle') {
    return 'circle';
  }
  if (type === 'rectangle' || type === 'rect') {
    return 'rectangle';
  }
  if (
    type === 'rounded-rectangle' ||
    type === 'roundedRectangle' ||
    type === 'rounded-rect' ||
    type === 'roundedRect'
  ) {
    return 'rounded-rectangle';
  }
  if (type === 'ellipse') {
    return 'ellipse';
  }
  if (type === 'polygon') {
    return 'polygon';
  }
  if (type === 'path' || type === 'svg-path' || type === 'svgPath' || type === 'svg') {
    return 'path';
  }
  return 'circle';
}

/**
 * Normalizes input transition mode into standard canonical mode.
 */
export function normalizeMaskMode(
  mode?: MaskTransitionMode
): 'reveal' | 'hide' | 'reveal-hide' | 'replace' {
  if (!mode || mode === 'reveal' || mode === 'expand' || mode === 'in') {
    return 'reveal';
  }
  if (mode === 'hide' || mode === 'contract' || mode === 'out') {
    return 'hide';
  }
  if (
    mode === 'reveal-hide' ||
    mode === 'in-out' ||
    mode === 'revealHide'
  ) {
    return 'reveal-hide';
  }
  if (mode === 'replace' || mode === 'cross-mask' || mode === 'crossMask') {
    return 'replace';
  }
  return 'reveal';
}

/**
 * Resolves normalized [0, 1] origin coordinates for mask expansion/contraction.
 */
export function resolveMaskOrigin(origin?: string): MaskOriginPoint {
  if (!origin || origin.trim() === '') {
    return { x: 0.5, y: 0.5, label: 'center' };
  }
  const clean = origin.trim().toLowerCase();

  switch (clean) {
    case 'center':
    case 'middle':
    case 'center center':
      return { x: 0.5, y: 0.5, label: 'center' };
    case 'top':
    case 'top center':
    case 'center top':
      return { x: 0.5, y: 0.0, label: 'top' };
    case 'bottom':
    case 'bottom center':
    case 'center bottom':
      return { x: 0.5, y: 1.0, label: 'bottom' };
    case 'left':
    case 'left center':
    case 'center left':
      return { x: 0.0, y: 0.5, label: 'left' };
    case 'right':
    case 'right center':
    case 'center right':
      return { x: 1.0, y: 0.5, label: 'right' };
    case 'top left':
    case 'top-left':
    case 'left top':
      return { x: 0.0, y: 0.0, label: 'top-left' };
    case 'top right':
    case 'top-right':
    case 'right top':
      return { x: 1.0, y: 0.0, label: 'top-right' };
    case 'bottom left':
    case 'bottom-left':
    case 'left bottom':
      return { x: 0.0, y: 1.0, label: 'bottom-left' };
    case 'bottom right':
    case 'bottom-right':
    case 'right bottom':
      return { x: 1.0, y: 1.0, label: 'bottom-right' };
    default: {
      // Support percentage formats like "25% 75%" or "0.25 0.75"
      const parts = clean.split(/[\s,]+/);
      if (parts.length >= 2) {
        const parseCoord = (str: string): number => {
          if (str.endsWith('%')) {
            return parseFloat(str) / 100;
          }
          const num = parseFloat(str);
          return Number.isNaN(num) ? 0.5 : num;
        };
        const x = Math.max(0, Math.min(1, parseCoord(parts[0])));
        const y = Math.max(0, Math.min(1, parseCoord(parts[1])));
        return { x: sanitizeMaskNumber(x), y: sanitizeMaskNumber(y), label: clean };
      }
      return { x: 0.5, y: 0.5, label: 'center' };
    }
  }
}

/**
 * Built-in SVG path presets centered in a 100x100 viewBox.
 */
export const BUILTIN_MASK_PATHS: Record<string, { d: string; viewBox: string }> = {
  heart: {
    d: 'M 50 82 C 15 55 5 35 15 18 C 23 4 40 7 50 25 C 60 7 77 4 85 18 C 95 35 85 55 50 82 Z',
    viewBox: '0 0 100 100',
  },
  star: {
    d: 'M 50 5 L 61.2 39.5 L 97.6 39.5 L 68.2 60.9 L 79.4 95.5 L 50 74.1 L 20.6 95.5 L 31.8 60.9 L 2.4 39.5 L 38.8 39.5 Z',
    viewBox: '0 0 100 100',
  },
  diamond: {
    d: 'M 50 5 L 95 50 L 50 95 L 5 50 Z',
    viewBox: '0 0 100 100',
  },
  badge: {
    d: 'M 50 5 L 63 15 L 80 15 L 85 32 L 98 45 L 88 58 L 95 75 L 78 80 L 70 95 L 50 90 L 30 95 L 22 80 L 5 75 L 12 58 L 2 45 L 15 32 L 20 15 L 37 15 Z',
    viewBox: '0 0 100 100',
  },
  cloud: {
    d: 'M 25 65 A 15 15 0 0 1 35 40 A 20 20 0 0 1 70 38 A 16 16 0 0 1 85 55 A 15 15 0 0 1 78 72 L 25 72 Z',
    viewBox: '0 0 100 100',
  },
  flower: {
    d: 'M 50 35 C 50 20 65 20 65 35 C 80 35 80 50 65 50 C 80 65 65 80 50 65 C 35 80 20 65 35 50 C 20 50 20 35 35 35 C 35 20 50 20 50 35 Z',
    viewBox: '0 0 100 100',
  },
};

/**
 * Computes normalized polygon vertices centered at (0, 0) with radius 0.5.
 */
export function calculateNormalizedPolygonPoints(
  shape: MaskPolygonShape | string = 'star',
  customPoints?: string
): string {
  if (customPoints && customPoints.trim() !== '') {
    return customPoints.trim();
  }

  const s = shape.toLowerCase();

  if (s === 'triangle') {
    const coords: string[] = [];
    for (let i = 0; i < 3; i++) {
      const angle = -Math.PI / 2 + (2 * Math.PI * i) / 3;
      const x = 0.5 * Math.cos(angle);
      const y = 0.5 * Math.sin(angle);
      coords.push(`${x.toFixed(4)},${y.toFixed(4)}`);
    }
    return coords.join(' ');
  }

  if (s === 'diamond') {
    return '0,-0.5 0.5,0 0,0.5 -0.5,0';
  }

  if (s === 'pentagon') {
    const coords: string[] = [];
    for (let i = 0; i < 5; i++) {
      const angle = -Math.PI / 2 + (2 * Math.PI * i) / 5;
      const x = 0.5 * Math.cos(angle);
      const y = 0.5 * Math.sin(angle);
      coords.push(`${x.toFixed(4)},${y.toFixed(4)}`);
    }
    return coords.join(' ');
  }

  if (s === 'hexagon') {
    const coords: string[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = -Math.PI / 2 + (2 * Math.PI * i) / 6;
      const x = 0.5 * Math.cos(angle);
      const y = 0.5 * Math.sin(angle);
      coords.push(`${x.toFixed(4)},${y.toFixed(4)}`);
    }
    return coords.join(' ');
  }

  // Default: 5-point star
  return calculateNormalizedStarPoints(5, 0.44);
}

/**
 * Computes normalized star vertices centered at (0, 0).
 */
export function calculateNormalizedStarPoints(points = 5, innerRatio = 0.44): string {
  const n = Math.max(3, points);
  const outerR = 0.5;
  const innerR = outerR * Math.max(0.1, Math.min(0.9, innerRatio));
  const coords: string[] = [];

  for (let i = 0; i < n * 2; i++) {
    const angle = -Math.PI / 2 + (Math.PI * i) / n;
    const r = i % 2 === 0 ? outerR : innerR;
    const x = r * Math.cos(angle);
    const y = r * Math.sin(angle);
    coords.push(`${x.toFixed(4)},${y.toFixed(4)}`);
  }

  return coords.join(' ');
}

/**
 * Resolves SVG path data and normalization transform from a custom path or preset name.
 */
export function resolveMaskPath(
  pathDataOrPreset?: string,
  customViewBox = '0 0 100 100'
): { d: string; viewBox: string; pathTransform: string } {
  const key = pathDataOrPreset?.trim().toLowerCase();

  if (key && BUILTIN_MASK_PATHS[key]) {
    const preset = BUILTIN_MASK_PATHS[key];
    const vb = preset.viewBox.split(/[\s,]+/).map(Number);
    const minX = vb[0] || 0;
    const minY = vb[1] || 0;
    const vbW = vb[2] || 100;
    const vbH = vb[3] || 100;
    const cx = minX + vbW / 2;
    const cy = minY + vbH / 2;
    const scaleX = 1 / vbW;
    const scaleY = 1 / vbH;
    return {
      d: preset.d,
      viewBox: preset.viewBox,
      pathTransform: `scale(${scaleX} ${scaleY}) translate(${-cx} ${-cy})`,
    };
  }

  const d = pathDataOrPreset || BUILTIN_MASK_PATHS.star.d;
  const vbParts = customViewBox.split(/[\s,]+/).map(Number);
  const minX = vbParts[0] || 0;
  const minY = vbParts[1] || 0;
  const vbW = vbParts[2] || 100;
  const vbH = vbParts[3] || 100;
  const cx = minX + vbW / 2;
  const cy = minY + vbH / 2;
  const scaleX = 1 / vbW;
  const scaleY = 1 / vbH;

  return {
    d,
    viewBox: customViewBox,
    pathTransform: `scale(${scaleX} ${scaleY}) translate(${-cx} ${-cy})`,
  };
}

/**
 * Calculates the minimum scale multiplier required to fully cover the [0, 1] x [0, 1]
 * container space from any arbitrary origin point.
 */
export function calculateMaskCoverScale(
  maskType: string,
  origin: { x: number; y: number },
  shape?: string
): number {
  const { x: ox, y: oy } = origin;
  // Maximum distance from origin to all 4 corners of unit bounding box
  const d1 = Math.hypot(ox, oy);
  const d2 = Math.hypot(1 - ox, oy);
  const d3 = Math.hypot(ox, 1 - oy);
  const d4 = Math.hypot(1 - ox, 1 - oy);
  const maxDistance = Math.max(d1, d2, d3, d4);

  switch (maskType) {
    case 'rectangle':
    case 'rounded-rectangle':
      // Unit rectangle [-0.5, 0.5], circumradius ~ 0.7071
      return sanitizeMaskNumber(Math.max(1.0, maxDistance * 2.1));
    case 'circle':
      // Circle with radius 0.5. Scale needed to reach maxDistance is maxDistance / 0.5 = 2 * maxDistance
      return sanitizeMaskNumber(maxDistance * 2.1);
    case 'ellipse':
      // Base rx=0.5, ry=0.35. Minimum radius 0.35 requires scale = maxDistance / 0.35
      return sanitizeMaskNumber(maxDistance * 3.0);
    case 'polygon': {
      const s = shape?.toLowerCase();
      if (s === 'star') {
        // Inner notch radius ~ 0.22, requires scale = maxDistance / 0.22
        return sanitizeMaskNumber(maxDistance * 4.8);
      }
      if (s === 'triangle') {
        // Inradius ~ 0.25
        return sanitizeMaskNumber(maxDistance * 4.2);
      }
      if (s === 'diamond') {
        // Inradius ~ 0.354
        return sanitizeMaskNumber(maxDistance * 3.0);
      }
      return sanitizeMaskNumber(maxDistance * 2.8);
    }
    case 'path':
      // Conservative cover multiplier for arbitrary paths
      return sanitizeMaskNumber(maxDistance * 3.6);
    default:
      return sanitizeMaskNumber(maxDistance * 2.2);
  }
}

export interface CalculateMaskMetricsParams {
  currentFrame: number;
  maskType?: MaskType;
  mode?: MaskTransitionMode;
  duration?: number;
  durationInFrames?: number;
  delay?: number;
  easing?: EasingPresetName | EasingFunction;
  origin?: string;
  maskOrigin?: string;
  shape?: MaskPolygonShape;
  polygonPoints?: string;
  pathData?: string;
  d?: string;
  pathViewBox?: string;
  cornerRadius?: number;
  rotation?: number;
  initialRotation?: number;
  finalRotation?: number;
  scaleMultiplier?: number;
  maxScale?: number;
  fade?: boolean;
  fromOpacity?: number;
  toOpacity?: number;
  spring?: boolean | string;
  springPreset?: string;
  overshoot?: boolean;
  reverse?: boolean;
  clipId?: string;
  inDuration?: number;
  holdDuration?: number;
  outDuration?: number;
}

/**
 * Frame-accurate calculation of mask transition animation metrics.
 */
export function calculateMaskMetrics(
  params: CalculateMaskMetricsParams
): MaskTransitionMetrics {
  const {
    currentFrame,
    maskType: rawMaskType,
    mode: rawMode,
    duration,
    durationInFrames,
    delay = 0,
    easing = 'easeInOut',
    origin,
    maskOrigin,
    shape: rawShape = 'star',
    polygonPoints,
    pathData,
    d,
    pathViewBox = '0 0 100 100',
    cornerRadius: rawCornerRadius,
    rotation: staticRotation = 0,
    initialRotation,
    finalRotation,
    scaleMultiplier = 1.0,
    maxScale: explicitMaxScale,
    fade = false,
    fromOpacity = 0,
    toOpacity = 1,
    spring,
    springPreset,
    overshoot,
    reverse = false,
    clipId: customClipId,
    inDuration,
    holdDuration,
    outDuration,
  } = params;

  const maskType = normalizeMaskType(rawMaskType);
  const mode = normalizeMaskMode(rawMode);
  const resolvedOrigin = resolveMaskOrigin(origin ?? maskOrigin);
  const resolvedClipId = customClipId || 'mask-clip-default';

  // Base cover scale for guaranteed 100% viewport coverage
  const baseCoverScale =
    explicitMaxScale ??
    calculateMaskCoverScale(maskType, resolvedOrigin, rawShape) * scaleMultiplier;

  // Resolve shape data
  const resolvedPath = resolveMaskPath(pathData ?? d, pathViewBox);
  const resolvedPoints =
    maskType === 'polygon'
      ? calculateNormalizedPolygonPoints(rawShape, polygonPoints)
      : undefined;

  const shapeData: MaskShapeData = {
    type: maskType,
    rx: rawCornerRadius ?? (maskType === 'rounded-rectangle' ? 0.1 : 0),
    ry: rawCornerRadius ?? (maskType === 'rounded-rectangle' ? 0.1 : 0),
    points: resolvedPoints,
    d: resolvedPath.d,
    viewBox: resolvedPath.viewBox,
    pathTransform: resolvedPath.pathTransform,
  };

  const totalDuration = durationInFrames ?? duration ?? 25;

  // -------------------------------------------------------------------------
  // Reveal-Hide Envelope Mode
  // -------------------------------------------------------------------------
  if (mode === 'reveal-hide') {
    const inLen = inDuration ?? Math.max(1, Math.round(totalDuration * 0.35));
    const outLen = outDuration ?? Math.max(1, Math.round(totalDuration * 0.35));
    const holdLen = holdDuration ?? Math.max(0, totalDuration - inLen - outLen);
    const totalEnvelope = inLen + holdLen + outLen;

    const relFrame = currentFrame - delay;

    if (relFrame < 0) {
      return {
        scale: 0,
        opacity: fade ? fromOpacity : 1,
        rotation: initialRotation ?? staticRotation,
        progress: 0,
        isComplete: false,
        phase: 'pending',
        transform: `translate(${resolvedOrigin.x} ${resolvedOrigin.y}) scale(0) rotate(${initialRotation ?? staticRotation})`,
        clipPath: `url(#${resolvedClipId})`,
        clipId: resolvedClipId,
        origin: resolvedOrigin,
        shape: shapeData,
        outgoingScale: baseCoverScale,
        outgoingOpacity: 1,
        outgoingRotation: 0,
        outgoingTransform: `translate(${resolvedOrigin.x} ${resolvedOrigin.y}) scale(${baseCoverScale})`,
        incomingScale: 0,
        incomingOpacity: 0,
        incomingRotation: 0,
        incomingTransform: `translate(${resolvedOrigin.x} ${resolvedOrigin.y}) scale(0)`,
      };
    }

    if (relFrame >= totalEnvelope) {
      return {
        scale: 0,
        opacity: fade ? fromOpacity : 1,
        rotation: finalRotation ?? staticRotation,
        progress: 1,
        isComplete: true,
        phase: 'complete',
        transform: `translate(${resolvedOrigin.x} ${resolvedOrigin.y}) scale(0) rotate(${finalRotation ?? staticRotation})`,
        clipPath: `url(#${resolvedClipId})`,
        clipId: resolvedClipId,
        origin: resolvedOrigin,
        shape: shapeData,
        outgoingScale: 0,
        outgoingOpacity: 0,
        outgoingRotation: 0,
        outgoingTransform: `translate(${resolvedOrigin.x} ${resolvedOrigin.y}) scale(0)`,
        incomingScale: baseCoverScale,
        incomingOpacity: 1,
        incomingRotation: 0,
        incomingTransform: `translate(${resolvedOrigin.x} ${resolvedOrigin.y}) scale(${baseCoverScale})`,
      };
    }

    let phase: 'in' | 'hold' | 'out' = 'in';
    let phaseProgress = 0;
    let easedProgress = 0;

    const easingFn: EasingFunction =
      (typeof easing === 'function' ? easing : resolveEasing(easing ?? easeInOut)) ?? easeInOut;

    if (relFrame < inLen) {
      phase = 'in';
      phaseProgress = relFrame / inLen;
      easedProgress = easingFn(phaseProgress);
    } else if (relFrame < inLen + holdLen) {
      phase = 'hold';
      phaseProgress = 1;
      easedProgress = 1;
    } else {
      phase = 'out';
      phaseProgress = (relFrame - inLen - holdLen) / outLen;
      easedProgress = easingFn(phaseProgress);
    }

    let scale = 0;
    let opacity = 1;

    if (phase === 'in') {
      scale = easedProgress * baseCoverScale;
      opacity = fade ? fromOpacity + easedProgress * (toOpacity - fromOpacity) : 1;
    } else if (phase === 'hold') {
      scale = baseCoverScale;
      opacity = toOpacity;
    } else {
      scale = (1 - easedProgress) * baseCoverScale;
      opacity = fade ? toOpacity - easedProgress * (toOpacity - fromOpacity) : 1;
    }

    const rotStart = initialRotation ?? staticRotation;
    const rotEnd = finalRotation ?? staticRotation;
    const overallProgress = relFrame / totalEnvelope;
    const currentRot = rotStart + overallProgress * (rotEnd - rotStart);

    const s = sanitizeMaskNumber(scale);
    const r = sanitizeMaskNumber(currentRot);
    const op = sanitizeMaskNumber(opacity);

    return {
      scale: s,
      opacity: op,
      rotation: r,
      progress: sanitizeMaskNumber(overallProgress),
      isComplete: false,
      phase,
      transform: `translate(${resolvedOrigin.x} ${resolvedOrigin.y}) scale(${s}) rotate(${r})`,
      clipPath: `url(#${resolvedClipId})`,
      clipId: resolvedClipId,
      origin: resolvedOrigin,
      shape: shapeData,
      outgoingScale: s,
      outgoingOpacity: op,
      outgoingRotation: r,
      outgoingTransform: `translate(${resolvedOrigin.x} ${resolvedOrigin.y}) scale(${s}) rotate(${r})`,
      incomingScale: s,
      incomingOpacity: op,
      incomingRotation: r,
      incomingTransform: `translate(${resolvedOrigin.x} ${resolvedOrigin.y}) scale(${s}) rotate(${r})`,
    };
  }

  // -------------------------------------------------------------------------
  // Reveal, Hide, and Replace Modes
  // -------------------------------------------------------------------------
  const relFrame = currentFrame - delay;

  if (relFrame < 0) {
    const initScale = mode === 'hide' ? baseCoverScale : 0;
    const initOpacity = fade ? (mode === 'hide' ? toOpacity : fromOpacity) : 1;
    const initRot = initialRotation ?? staticRotation;

    return {
      scale: sanitizeMaskNumber(initScale),
      opacity: sanitizeMaskNumber(initOpacity),
      rotation: sanitizeMaskNumber(initRot),
      progress: 0,
      isComplete: false,
      phase: 'pending',
      transform: `translate(${resolvedOrigin.x} ${resolvedOrigin.y}) scale(${sanitizeMaskNumber(initScale)}) rotate(${sanitizeMaskNumber(initRot)})`,
      clipPath: `url(#${resolvedClipId})`,
      clipId: resolvedClipId,
      origin: resolvedOrigin,
      shape: shapeData,
      outgoingScale: baseCoverScale,
      outgoingOpacity: 1,
      outgoingRotation: 0,
      outgoingTransform: `translate(${resolvedOrigin.x} ${resolvedOrigin.y}) scale(${baseCoverScale})`,
      incomingScale: 0,
      incomingOpacity: 0,
      incomingRotation: 0,
      incomingTransform: `translate(${resolvedOrigin.x} ${resolvedOrigin.y}) scale(0)`,
    };
  }

  if (relFrame >= totalDuration) {
    const endScale = mode === 'hide' ? 0 : baseCoverScale;
    const endOpacity = fade ? (mode === 'hide' ? fromOpacity : toOpacity) : 1;
    const endRot = finalRotation ?? staticRotation;

    return {
      scale: sanitizeMaskNumber(endScale),
      opacity: sanitizeMaskNumber(endOpacity),
      rotation: sanitizeMaskNumber(endRot),
      progress: 1,
      isComplete: true,
      phase: 'complete',
      transform: `translate(${resolvedOrigin.x} ${resolvedOrigin.y}) scale(${sanitizeMaskNumber(endScale)}) rotate(${sanitizeMaskNumber(endRot)})`,
      clipPath: `url(#${resolvedClipId})`,
      clipId: resolvedClipId,
      origin: resolvedOrigin,
      shape: shapeData,
      outgoingScale: mode === 'replace' ? baseCoverScale : 0,
      outgoingOpacity: mode === 'replace' ? 1 : 0,
      outgoingRotation: 0,
      outgoingTransform: `translate(${resolvedOrigin.x} ${resolvedOrigin.y}) scale(${baseCoverScale})`,
      incomingScale: baseCoverScale,
      incomingOpacity: 1,
      incomingRotation: endRot,
      incomingTransform: `translate(${resolvedOrigin.x} ${resolvedOrigin.y}) scale(${baseCoverScale}) rotate(${endRot})`,
    };
  }

  // Calculate raw progress
  let rawProgress = totalDuration <= 0 ? 1 : relFrame / totalDuration;
  rawProgress = Math.max(0, Math.min(1, rawProgress));

  if (reverse) {
    rawProgress = 1 - rawProgress;
  }

  // Evaluate curve progression
  let progress = rawProgress;
  if (spring || overshoot) {
    const presetName: SpringPresetName = overshoot
      ? 'bouncy'
      : typeof spring === 'string'
        ? (spring as SpringPresetName)
        : (springPreset as SpringPresetName) || 'snappy';
    const springVal = createSpring({
      frame: Math.max(0, relFrame),
      fps: 30,
      delay: 0,
      preset: presetName,
      from: 0,
      to: 1,
    });
    progress = reverse ? Math.max(0, 1.0 - springVal) : springVal;
  } else {
    const easingFn: EasingFunction =
      (typeof easing === 'function' ? easing : resolveEasing(easing ?? easeInOut)) ?? easeInOut;
    progress = easingFn(rawProgress);
  }

  // Calculate animated scale
  let scale = 0;
  if (mode === 'reveal' || mode === 'replace') {
    scale = progress * baseCoverScale;
  } else if (mode === 'hide') {
    scale = (1 - progress) * baseCoverScale;
  }

  // Calculate animated opacity
  let opacity = 1;
  if (fade) {
    if (mode === 'reveal' || mode === 'replace') {
      opacity = fromOpacity + progress * (toOpacity - fromOpacity);
    } else if (mode === 'hide') {
      opacity = toOpacity - progress * (toOpacity - fromOpacity);
    }
  }

  // Calculate animated rotation
  const rotStart = initialRotation ?? staticRotation;
  const rotEnd = finalRotation ?? staticRotation;
  const rotation = rotStart + progress * (rotEnd - rotStart);

  const finalScale = sanitizeMaskNumber(scale);
  const finalOpacity = sanitizeMaskNumber(opacity);
  const finalRotationVal = sanitizeMaskNumber(rotation);
  const finalProgress = sanitizeMaskNumber(rawProgress);

  const phase = mode === 'hide' ? 'out' : 'in';

  return {
    scale: finalScale,
    opacity: finalOpacity,
    rotation: finalRotationVal,
    progress: finalProgress,
    isComplete: false,
    phase,
    transform: `translate(${resolvedOrigin.x} ${resolvedOrigin.y}) scale(${finalScale}) rotate(${finalRotationVal})`,
    clipPath: `url(#${resolvedClipId})`,
    clipId: resolvedClipId,
    origin: resolvedOrigin,
    shape: shapeData,
    outgoingScale: baseCoverScale,
    outgoingOpacity: 1,
    outgoingRotation: 0,
    outgoingTransform: `translate(${resolvedOrigin.x} ${resolvedOrigin.y}) scale(${baseCoverScale})`,
    incomingScale: finalScale,
    incomingOpacity: finalOpacity,
    incomingRotation: finalRotationVal,
    incomingTransform: `translate(${resolvedOrigin.x} ${resolvedOrigin.y}) scale(${finalScale}) rotate(${finalRotationVal})`,
  };
}
