/**
 * GlitchTransition Style & Mathematical Engine
 *
 * Provides deterministic pseudo-random number generation (FNV-1a + Mulberry32),
 * frame-accurate glitch envelope calculations, horizontal slice tearing,
 * RGB chromatic aberration separation, vertical jitter, digital noise blocks,
 * CRT scanlines, and strobe flicker.
 *
 * Layer 2 of the Motion Graphics Framework.
 */

import type {
  GlitchBlockData,
  GlitchSliceData,
  GlitchTransitionMetrics,
  GlitchTransitionMode,
  GlitchTransitionProps,
} from './types.ts';
import { clamp } from '../../utils/animation/clamp.ts';

/**
 * 32-bit FNV-1a hash function for strings and numbers.
 * Produces deterministic non-zero 32-bit unsigned integer hash.
 */
export function hashSeed(seed: string | number, ...extra: number[]): number {
  let str = String(seed);
  if (extra.length > 0) {
    str += ':' + extra.join(':');
  }
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 16777619) >>> 0;
  }
  return h || 1;
}

/**
 * Deterministic pseudo-random number generator based on Mulberry32.
 * Returns a floating-point number in [0, 1).
 */
export function pseudoRandom(seed: number): number {
  let t = (seed + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), 1 | t);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/**
 * Generates a deterministic float in [0, 1) for a specific (seed, frame, salt).
 */
export function seededRandom(seed: string | number, frame: number, salt: number): number {
  const h = hashSeed(seed, frame, salt);
  return pseudoRandom(h);
}

/**
 * Generates a deterministic float within [min, max] for a specific (seed, frame, salt).
 */
export function seededRange(
  seed: string | number,
  frame: number,
  salt: number,
  min: number,
  max: number,
): number {
  return min + seededRandom(seed, frame, salt) * (max - min);
}

/**
 * Sanitizes floating point numbers to avoid IEEE-754 negative zeros and limit precision.
 */
export function sanitizeGlitchNumber(n: number, decimals = 3): number {
  if (!Number.isFinite(n)) return 0;
  const factor = 10 ** decimals;
  const rounded = Math.round(n * factor) / factor;
  return Object.is(rounded, -0) ? 0 : rounded;
}

/**
 * Calculates the glitch distortion envelope [0, 1] based on transition mode and progress.
 *
 * - 'in': starts at 1.0 (heavy glitch chaos) and smoothly settles to 0.0 (crystal clean).
 * - 'out': starts at 0.0 (clean) and escalates to 1.0 (chaotic glitch destruction).
 * - 'replace': peaks at progress = 0.5 (maximum glitch tear during cut) and returns to 0.0.
 * - 'burst': short temporary glitch burst peaking around 0.5 and settling back to 0.0.
 * - 'continuous': constant glitch envelope of 1.0 across all frames.
 */
export function calculateGlitchEnvelope(
  mode: GlitchTransitionMode,
  progress: number,
  isComplete: boolean,
): number {
  if (mode === 'continuous') {
    return 1.0;
  }

  if (isComplete) {
    return mode === 'out' ? 1.0 : 0.0;
  }

  const p = clamp(progress, 0, 1);

  switch (mode) {
    case 'in':
      // Decays from 1 to 0 with quadratic easing
      return (1 - p) * (1 - p);

    case 'out':
      // Ramps from 0 to 1 with quadratic easing
      return p * p;

    case 'replace':
      // Triangular / parabolic bell curve peaking at p = 0.5
      return 4 * p * (1 - p);

    case 'burst': {
      // Glitch burst between p = 0.2 and p = 0.8
      if (p < 0.2 || p > 0.8) return 0;
      const normalizedP = (p - 0.2) / 0.6;
      return Math.sin(normalizedP * Math.PI);
    }

    default:
      return 1 - p;
  }
}

const NOISE_PALETTE = ['#ff0055', '#00ffff', '#ffffff', '#22d3ee', '#ec4899', '#a855f7', '#10b981'];

export interface GlitchMetricsOptions extends GlitchTransitionProps {
  frame: number;
}

/**
 * Calculates deterministic frame-accurate glitch transition metrics.
 */
export function calculateGlitchMetrics(options: GlitchMetricsOptions): GlitchTransitionMetrics {
  const {
    frame,
    duration: rawDuration,
    durationInFrames,
    delay = 0,
    mode = 'in',
    intensity = 1.0,
    frequency = 0.6,
    sliceCount = 8,
    rgbOffset = 12,
    jitter = 6,
    noise = 0.4,
    seed = 42,
    pixelSize = 4,
    enableRgbSplit = true,
    enableSlices = true,
    enableJitter = true,
    enableNoise = true,
    enableFlicker = true,
    enableScanlines = true,
    reverse = false,
  } = options;

  const duration = Math.max(1, durationInFrames ?? rawDuration ?? 30);
  const clampedIntensity = Math.max(0, Math.min(intensity, 3));
  const clampedFrequency = Math.max(0, Math.min(frequency, 1));
  const clampedSliceCount = Math.max(2, Math.min(Math.round(sliceCount), 32));
  const clampedNoise = Math.max(0, Math.min(noise, 1));

  const relFrame = frame - delay;
  const isPending = relFrame < 0;
  const isComplete = mode !== 'continuous' && relFrame >= duration;

  // Normalized progress in [0, 1]
  let rawProgress = clamp(relFrame / duration, 0, 1);
  if (reverse) {
    rawProgress = 1 - rawProgress;
  }
  const progress = sanitizeGlitchNumber(rawProgress);

  // Compute glitch envelope
  const rawEnvelope = isPending ? (mode === 'in' ? 1.0 : 0.0) : calculateGlitchEnvelope(mode, progress, isComplete);
  const envelope = sanitizeGlitchNumber(rawEnvelope * clampedIntensity);

  // Determine whether this frame triggers active glitch effects
  // For envelope <= 0, no glitch triggers.
  // Otherwise, glitch probability is modulated by frequency and envelope.
  const glitchTriggerRoll = seededRandom(seed, frame, 1);
  const glitchThreshold = clampedFrequency * Math.min(1.0, envelope * 1.5 + 0.1);
  const isGlitchFrame = envelope > 0.01 && (clampedFrequency >= 1.0 || glitchTriggerRoll < glitchThreshold);

  // Phase
  let phase: GlitchTransitionMetrics['phase'] = 'active';
  if (isPending) {
    phase = 'pending';
  } else if (isComplete) {
    phase = 'complete';
  } else if (mode === 'in') {
    phase = 'in';
  } else if (mode === 'out') {
    phase = 'out';
  }

  // Active layer determination for replace mode
  let activeLayer: 'from' | 'to' | 'both' = 'to';
  if (mode === 'replace') {
    activeLayer = progress < 0.5 ? 'from' : 'to';
  } else if (mode === 'out') {
    activeLayer = 'from';
  } else {
    activeLayer = 'to';
  }

  // Opacity calculation based on mode
  let baseOpacity = 1.0;
  if (mode === 'in') {
    baseOpacity = isPending ? 0 : progress;
  } else if (mode === 'out') {
    baseOpacity = isPending ? 1 : 1 - progress;
  }

  // Flicker / Strobe
  let flickerBrightness = 1.0;
  let opacity = baseOpacity;
  if (enableFlicker && isGlitchFrame) {
    const brightnessRoll = seededRange(seed, frame, 2, -0.2, 0.4);
    flickerBrightness = sanitizeGlitchNumber(1 + brightnessRoll * envelope);

    const opacityDipRoll = seededRange(seed, frame, 3, 0, 0.25);
    opacity = clamp(baseOpacity - opacityDipRoll * envelope, 0, 1);
  }
  opacity = sanitizeGlitchNumber(opacity);

  // Vertical & Horizontal Jitter
  let jitterX = 0;
  let jitterY = 0;
  if (enableJitter && isGlitchFrame) {
    const rawJitterY = seededRange(seed, frame, 4, -jitter, jitter) * envelope;
    const rawJitterX = seededRange(seed, frame, 5, -jitter * 0.5, jitter * 0.5) * envelope;
    jitterY = pixelSize > 1 ? Math.round(rawJitterY / pixelSize) * pixelSize : Math.round(rawJitterY);
    jitterX = pixelSize > 1 ? Math.round(rawJitterX / pixelSize) * pixelSize : Math.round(rawJitterX);
  }

  // Chromatic Aberration RGB offsets
  let rgbOffsetX = 0;
  let rgbOffsetY = 0;
  if (enableRgbSplit && isGlitchFrame) {
    const rawRgbX = seededRange(seed, frame, 6, -rgbOffset, rgbOffset) * envelope;
    const rawRgbY = seededRange(seed, frame, 7, -rgbOffset * 0.25, rgbOffset * 0.25) * envelope;
    rgbOffsetX = pixelSize > 1 ? Math.round(rawRgbX / pixelSize) * pixelSize : sanitizeGlitchNumber(rawRgbX, 1);
    rgbOffsetY = pixelSize > 1 ? Math.round(rawRgbY / pixelSize) * pixelSize : sanitizeGlitchNumber(rawRgbY, 1);
  }

  // Horizontal Slices
  const slices: GlitchSliceData[] = [];
  const sliceHeight = 100 / clampedSliceCount;

  for (let i = 0; i < clampedSliceCount; i++) {
    const topPercent = sanitizeGlitchNumber(i * sliceHeight);
    const bottomPercent = sanitizeGlitchNumber((i + 1) * sliceHeight);

    let displacementX = 0;
    let displacementY = 0;
    let sliceRgbOffsetX = 0;
    let isSliceGlitching = false;

    if (enableSlices && isGlitchFrame) {
      // Each slice independently rolls whether it tears
      const sliceTearRoll = seededRandom(seed, frame, 20 + i * 4);
      isSliceGlitching = sliceTearRoll < 0.65;

      if (isSliceGlitching) {
        const rawDispX = seededRange(seed, frame, 21 + i * 4, -30, 30) * envelope;
        displacementX = pixelSize > 1 ? Math.round(rawDispX / pixelSize) * pixelSize : sanitizeGlitchNumber(rawDispX, 1);

        const rawDispY = seededRange(seed, frame, 22 + i * 4, -2, 2) * envelope;
        displacementY = pixelSize > 1 ? Math.round(rawDispY / pixelSize) * pixelSize : sanitizeGlitchNumber(rawDispY, 1);

        const rawSliceRgb = seededRange(seed, frame, 23 + i * 4, -rgbOffset * 0.5, rgbOffset * 0.5) * envelope;
        sliceRgbOffsetX = sanitizeGlitchNumber(rawSliceRgb, 1);
      }
    }

    slices.push({
      index: i,
      topPercent,
      bottomPercent,
      displacementX,
      displacementY,
      rgbOffsetX: sliceRgbOffsetX,
      isGlitching: isSliceGlitching,
    });
  }

  // Digital Noise Blocks
  const noiseBlocks: GlitchBlockData[] = [];
  if (enableNoise && isGlitchFrame && clampedNoise > 0) {
    const blockCount = Math.floor(seededRange(seed, frame, 50, 1, 5));
    for (let b = 0; b < blockCount; b++) {
      const bx = sanitizeGlitchNumber(seededRange(seed, frame, 51 + b * 5, 0, 90));
      const by = sanitizeGlitchNumber(seededRange(seed, frame, 52 + b * 5, 0, 95));
      const bw = Math.round(seededRange(seed, frame, 53 + b * 5, 12, 100) * (pixelSize > 1 ? pixelSize : 1));
      const bh = Math.round(seededRange(seed, frame, 54 + b * 5, 4, 24));
      const colorIndex = Math.floor(seededRange(seed, frame, 55 + b * 5, 0, NOISE_PALETTE.length)) % NOISE_PALETTE.length;
      const blockOpacity = sanitizeGlitchNumber(seededRange(seed, frame, 56 + b * 5, 0.2, 0.7) * clampedNoise * envelope);

      noiseBlocks.push({
        id: b,
        x: bx,
        y: by,
        width: bw,
        height: bh,
        color: NOISE_PALETTE[colorIndex],
        opacity: blockOpacity,
      });
    }
  }

  // Scanline Opacity
  const scanlineOpacity = enableScanlines
    ? sanitizeGlitchNumber((0.15 + 0.25 * envelope) * clampedNoise)
    : 0;

  return {
    progress,
    envelope,
    isGlitchFrame,
    opacity,
    jitterX,
    jitterY,
    rgbOffsetX,
    rgbOffsetY,
    flickerBrightness,
    slices,
    noiseBlocks,
    scanlineOpacity,
    activeLayer,
    isComplete,
    phase,
  };
}
