/**
 * MorphTransition Pure Mathematical Engine & Styling Logic
 * Frame-accurate calculation of 2D SVG path morphing, deterministic point sampling,
 * linear control point interpolation, color blending, and rotational scaling kinetics.
 * Layer 2 of the Motion Graphics Framework.
 */

import { easeInOut, resolveEasing } from '../../utils/animation/easing.ts';
import type { EasingFunction, EasingPresetName } from '../../utils/animation/easing.ts';
import { createSpring } from '../../utils/animation/spring.ts';
import type { SpringPresetName } from '../../styles/motion.ts';
import { parseSvgPath, getPointAlongPath } from '../graphics/animatedPathStyle.ts';
import type { MorphTransitionMetrics } from './types.ts';

/**
 * Sanitizes numeric values to prevent IEEE-754 signed negative zero (-0)
 * and floating point inaccuracy.
 */
export function sanitizeMorphNumber(val: number): number {
  if (Number.isNaN(val) || Math.abs(val) < 1e-6) {
    return 0;
  }
  return Number(val.toFixed(4));
}

/**
 * Built-in iconic SVG path shapes normalized in a 100x100 viewBox.
 */
export const BUILTIN_MORPH_SHAPES: Record<string, { d: string; viewBox: string }> = {
  circle: {
    d: 'M 50 10 C 72.09 10 90 27.91 90 50 C 90 72.09 72.09 90 50 90 C 27.91 90 10 72.09 10 50 C 10 27.91 27.91 10 50 10 Z',
    viewBox: '0 0 100 100',
  },
  rectangle: {
    d: 'M 15 15 L 85 15 L 85 85 L 15 85 Z',
    viewBox: '0 0 100 100',
  },
  'rounded-rectangle': {
    d: 'M 30 15 L 70 15 C 78.28 15 85 21.72 85 30 L 85 70 C 85 78.28 78.28 85 70 85 L 30 85 C 21.72 85 15 78.28 15 70 L 15 30 C 15 21.72 21.72 15 30 15 Z',
    viewBox: '0 0 100 100',
  },
  triangle: {
    d: 'M 50 15 L 85 80 L 15 80 Z',
    viewBox: '0 0 100 100',
  },
  diamond: {
    d: 'M 50 15 L 85 50 L 50 85 L 15 50 Z',
    viewBox: '0 0 100 100',
  },
  star: {
    d: 'M 50 12 L 61.2 38 L 89 38 L 66 54 L 75 80 L 50 64 L 25 80 L 34 54 L 11 38 L 38.8 38 Z',
    viewBox: '0 0 100 100',
  },
  pentagon: {
    d: 'M 50 15 L 83.3 39.2 L 70.6 78.3 L 29.4 78.3 L 16.7 39.2 Z',
    viewBox: '0 0 100 100',
  },
  hexagon: {
    d: 'M 50 15 L 80.3 32.5 L 80.3 67.5 L 50 85 L 19.7 67.5 L 19.7 32.5 Z',
    viewBox: '0 0 100 100',
  },
  heart: {
    d: 'M 50 82 C 15 55 5 35 15 18 C 23 4 40 7 50 25 C 60 7 77 4 85 18 C 95 35 85 55 50 82 Z',
    viewBox: '0 0 100 100',
  },
  cloud: {
    d: 'M 25 68 C 18 68 12 62 12 55 C 12 48 18 42 25 42 C 26 33 33 26 42 26 C 49 26 55 30 58 36 C 61 34 65 33 69 33 C 78 33 86 40 86 49 C 88 51 88 53 88 55 C 88 62 82 68 75 68 Z',
    viewBox: '0 0 100 100',
  },
  check: {
    d: 'M 22 50 L 40 68 L 78 30',
    viewBox: '0 0 100 100',
  },
  cross: {
    d: 'M 25 25 L 75 75 M 75 25 L 25 75',
    viewBox: '0 0 100 100',
  },
  play: {
    d: 'M 30 20 L 78 50 L 30 80 Z',
    viewBox: '0 0 100 100',
  },
  arrow: {
    d: 'M 20 50 L 65 50 M 50 35 L 65 50 L 50 65',
    viewBox: '0 0 100 100',
  },
};

/**
 * Resolves input string to either a preset SVG path or raw path data.
 */
export function resolveMorphPath(pathOrPreset: string): string {
  if (!pathOrPreset || pathOrPreset.trim() === '') {
    return BUILTIN_MORPH_SHAPES.circle.d;
  }
  const key = pathOrPreset.trim().toLowerCase();
  if (BUILTIN_MORPH_SHAPES[key]) {
    return BUILTIN_MORPH_SHAPES[key].d;
  }
  return pathOrPreset.trim();
}

/**
 * Checks whether an SVG path string is closed (ends with Z or z).
 */
export function isPathClosed(d: string): boolean {
  return /[zZ]\s*$/.test(d.trim());
}

export interface MorphPoint {
  x: number;
  y: number;
}

/**
 * Samples N equidistant coordinates along an SVG path.
 */
export function samplePathPoints(d: string, pointCount = 48): MorphPoint[] {
  const resolvedD = resolveMorphPath(d);
  const parsed = parseSvgPath(resolvedD);

  if (!parsed || parsed.segments.length === 0 || parsed.totalLength <= 0) {
    // Fallback: regular circular points around (50, 50)
    const fallback: MorphPoint[] = [];
    for (let i = 0; i < pointCount; i++) {
      const angle = (2 * Math.PI * i) / pointCount;
      fallback.push({
        x: sanitizeMorphNumber(50 + 40 * Math.cos(angle)),
        y: sanitizeMorphNumber(50 + 40 * Math.sin(angle)),
      });
    }
    return fallback;
  }

  const points: MorphPoint[] = [];
  const totalLength = parsed.totalLength;

  for (let i = 0; i < pointCount; i++) {
    const dist = (i / pointCount) * totalLength;
    const pt = getPointAlongPath(parsed.segments, totalLength, dist);
    points.push({
      x: sanitizeMorphNumber(pt.x),
      y: sanitizeMorphNumber(pt.y),
    });
  }

  return points;
}

/**
 * Interpolates two sets of sampled points at frame progress u in [0, 1].
 */
export function interpolatePathPoints(
  pointsA: MorphPoint[],
  pointsB: MorphPoint[],
  progress: number,
  isClosed = true
): string {
  const n = Math.min(pointsA.length, pointsB.length);
  if (n === 0) {
    return '';
  }

  const u = Math.max(0, Math.min(1, progress));
  const interpolated: MorphPoint[] = [];

  for (let i = 0; i < n; i++) {
    const a = pointsA[i];
    const b = pointsB[i];
    const x = (1 - u) * a.x + u * b.x;
    const y = (1 - u) * a.y + u * b.y;
    interpolated.push({
      x: sanitizeMorphNumber(x),
      y: sanitizeMorphNumber(y),
    });
  }

  const d = `M ${interpolated[0].x} ${interpolated[0].y} ` +
    interpolated.slice(1).map((p) => `L ${p.x} ${p.y}`).join(' ') +
    (isClosed ? ' Z' : '');

  return d;
}

export interface RgbaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

/**
 * Parses any CSS color (hex, rgb, rgba, transparent, none) into numeric RGBA components.
 */
export function parseColorToRgba(color: string): RgbaColor {
  if (!color || color === 'none' || color === 'transparent') {
    return { r: 0, g: 0, b: 0, a: 0 };
  }

  const clean = color.trim().toLowerCase();

  // Hex format: #rgb, #rgba, #rrggbb, #rrggbbaa
  if (clean.startsWith('#')) {
    const hex = clean.slice(1);
    if (hex.length === 3 || hex.length === 4) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      const a = hex.length === 4 ? parseInt(hex[3] + hex[3], 16) / 255 : 1;
      return { r, g, b, a };
    }
    if (hex.length === 6 || hex.length === 8) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
      return { r, g, b, a };
    }
  }

  // rgb / rgba format
  const rgbMatch = clean.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/);
  if (rgbMatch) {
    const r = parseFloat(rgbMatch[1]);
    const g = parseFloat(rgbMatch[2]);
    const b = parseFloat(rgbMatch[3]);
    const a = rgbMatch[4] !== undefined ? parseFloat(rgbMatch[4]) : 1;
    return { r, g, b, a };
  }

  // Fallback default
  return { r: 6, g: 182, b: 212, a: 1 };
}

/**
 * Linearly interpolates two colors at progress in [0, 1].
 */
export function interpolateColor(colorA: string, colorB: string, progress: number): string {
  const u = Math.max(0, Math.min(1, progress));
  const cA = parseColorToRgba(colorA);
  const cB = parseColorToRgba(colorB);

  // If one color is completely transparent (a=0), take RGB from the visible color
  let rA = cA.r;
  let gA = cA.g;
  let bA = cA.b;
  let rB = cB.r;
  let gB = cB.g;
  let bB = cB.b;

  if (cA.a === 0 && cB.a > 0) {
    rA = rB;
    gA = gB;
    bA = bB;
  } else if (cB.a === 0 && cA.a > 0) {
    rB = rA;
    gB = gA;
    bB = bA;
  }

  const r = Math.round((1 - u) * rA + u * rB);
  const g = Math.round((1 - u) * gA + u * gB);
  const b = Math.round((1 - u) * bA + u * bB);
  const a = sanitizeMorphNumber((1 - u) * cA.a + u * cB.a);

  if (a <= 0) {
    return 'transparent';
  }

  if (a >= 1) {
    return `rgb(${r}, ${g}, ${b})`;
  }

  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export interface CalculateMorphMetricsParams {
  currentFrame: number;
  fromPath: string;
  toPath: string;
  duration?: number;
  durationInFrames?: number;
  delay?: number;
  easing?: EasingPresetName | EasingFunction;
  fromFill?: string;
  toFill?: string;
  fromStroke?: string;
  toStroke?: string;
  fromStrokeWidth?: number;
  toStrokeWidth?: number;
  fromOpacity?: number;
  toOpacity?: number;
  initialRotation?: number;
  finalRotation?: number;
  initialScale?: number;
  finalScale?: number;
  samplePoints?: number;
  viewBox?: string;
  spring?: boolean | string;
  springPreset?: string;
  overshoot?: boolean;
  reverse?: boolean;
}

/**
 * Frame-accurate calculation of MorphTransition animation metrics.
 */
export function calculateMorphMetrics(
  params: CalculateMorphMetricsParams
): MorphTransitionMetrics {
  const {
    currentFrame,
    fromPath,
    toPath,
    duration,
    durationInFrames,
    delay = 0,
    easing = 'easeInOut',
    fromFill = '#06b6d4',
    toFill = '#ec4899',
    fromStroke = 'transparent',
    toStroke = 'transparent',
    fromStrokeWidth = 0,
    toStrokeWidth = 0,
    fromOpacity = 1.0,
    toOpacity = 1.0,
    initialRotation = 0,
    finalRotation = 0,
    initialScale = 1.0,
    finalScale = 1.0,
    samplePoints = 48,
    viewBox = '0 0 100 100',
    spring,
    springPreset,
    overshoot,
    reverse = false,
  } = params;

  const totalDuration = durationInFrames ?? duration ?? 30;
  const relFrame = currentFrame - delay;

  // Sample points for both start and end paths
  const resolvedFromD = resolveMorphPath(fromPath);
  const resolvedToD = resolveMorphPath(toPath);
  const isClosed = isPathClosed(resolvedFromD) || isPathClosed(resolvedToD);

  const pointsA = samplePathPoints(resolvedFromD, samplePoints);
  const pointsB = samplePathPoints(resolvedToD, samplePoints);

  // Boundary conditions
  if (relFrame < 0) {
    return {
      d: interpolatePathPoints(pointsA, pointsB, reverse ? 1 : 0, isClosed),
      fill: reverse ? toFill : fromFill,
      stroke: reverse ? toStroke : fromStroke,
      strokeWidth: reverse ? toStrokeWidth : fromStrokeWidth,
      opacity: reverse ? toOpacity : fromOpacity,
      rotation: reverse ? finalRotation : initialRotation,
      scale: reverse ? finalScale : initialScale,
      progress: 0,
      isComplete: false,
      phase: 'pending',
      viewBox,
    };
  }

  if (relFrame >= totalDuration) {
    return {
      d: interpolatePathPoints(pointsA, pointsB, reverse ? 0 : 1, isClosed),
      fill: reverse ? fromFill : toFill,
      stroke: reverse ? fromStroke : toStroke,
      strokeWidth: reverse ? fromStrokeWidth : toStrokeWidth,
      opacity: reverse ? fromOpacity : toOpacity,
      rotation: reverse ? initialRotation : finalRotation,
      scale: reverse ? initialScale : finalScale,
      progress: 1,
      isComplete: true,
      phase: 'complete',
      viewBox,
    };
  }

  // Calculate normalized timeline progress
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

  // Interpolate properties
  const d = interpolatePathPoints(pointsA, pointsB, progress, isClosed);
  const fill = interpolateColor(fromFill, toFill, progress);
  const stroke = interpolateColor(fromStroke, toStroke, progress);
  const strokeWidth = sanitizeMorphNumber((1 - progress) * fromStrokeWidth + progress * toStrokeWidth);
  const opacity = sanitizeMorphNumber((1 - progress) * fromOpacity + progress * toOpacity);
  const rotation = sanitizeMorphNumber((1 - progress) * initialRotation + progress * finalRotation);
  const scale = sanitizeMorphNumber((1 - progress) * initialScale + progress * finalScale);

  return {
    d,
    fill,
    stroke,
    strokeWidth,
    opacity,
    rotation,
    scale,
    progress: sanitizeMorphNumber(rawProgress),
    isComplete: false,
    phase: 'in',
    viewBox,
  };
}
