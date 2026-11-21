/**
 * ZoomTransition Pure Mathematical Engine & Styling Logic
 * Frame-accurate calculation of scale expansions, spring overshoots,
 * transform origins, simultaneous fades, rotational zooms, and dual-layer zoom replacements.
 */

import { easeOut, resolveEasing } from '../../utils/animation/easing.ts';
import type { EasingFunction, EasingPresetName } from '../../utils/animation/easing.ts';
import { createSpring } from '../../utils/animation/spring.ts';
import type { SpringPresetName } from '../../styles/motion.ts';
import type {
  ZoomTransitionMetrics,
  ZoomTransitionMode,
} from './types.ts';

/**
 * Sanitizes numeric values to prevent IEEE-754 signed negative zero (-0)
 * and excessive floating point noise.
 */
export function sanitizeZoomNumber(val: number): number {
  if (Number.isNaN(val) || Math.abs(val) < 1e-6) {
    return 0;
  }
  return Number(val.toFixed(4));
}

/**
 * Normalizes input mode into standard zoom mode.
 */
export function normalizeZoomMode(
  mode?: ZoomTransitionMode
): 'in' | 'out' | 'in-out' | 'through' | 'replace' {
  if (!mode || mode === 'in' || mode === 'zoom-in' || mode === 'zoomIn') {
    return 'in';
  }
  if (mode === 'out' || mode === 'zoom-out' || mode === 'zoomOut') {
    return 'out';
  }
  if (mode === 'in-out' || mode === 'inOut' || mode === 'zoom-in-out') {
    return 'in-out';
  }
  if (mode === 'through' || mode === 'zoom-through' || mode === 'zoomThrough') {
    return 'through';
  }
  if (mode === 'replace' || mode === 'zoom-replace' || mode === 'cross-zoom') {
    return 'replace';
  }
  return 'in';
}

/**
 * Resolves standard CSS transform origin values.
 */
export function resolveTransformOrigin(origin?: string): string {
  if (!origin || origin.trim() === '') {
    return 'center';
  }
  const clean = origin.trim().toLowerCase();
  switch (clean) {
    case 'center':
      return 'center center';
    case 'top':
      return 'center top';
    case 'bottom':
      return 'center bottom';
    case 'left':
      return 'left center';
    case 'right':
      return 'right center';
    case 'top left':
    case 'topleft':
      return 'top left';
    case 'top right':
    case 'topright':
      return 'top right';
    case 'bottom left':
    case 'bottomleft':
      return 'bottom left';
    case 'bottom right':
    case 'bottomright':
      return 'bottom right';
    default:
      return origin;
  }
}

/**
 * Helper to build deterministic CSS transform string
 */
export function buildZoomTransform(scale: number, rotation: number): string {
  const sanitizedScale = sanitizeZoomNumber(scale);
  const sanitizedRot = sanitizeZoomNumber(rotation);
  if (sanitizedRot !== 0) {
    return `scale3d(${sanitizedScale}, ${sanitizedScale}, 1) rotate(${sanitizedRot}deg)`;
  }
  return `scale3d(${sanitizedScale}, ${sanitizedScale}, 1)`;
}

export interface CalculateZoomMetricsParams {
  currentFrame: number;
  fps?: number;
  mode?: ZoomTransitionMode;
  initialScale?: number;
  finalScale?: number;
  throughScale?: number;
  outgoingScale?: number;
  incomingScale?: number;
  transformOrigin?: string;
  duration?: number;
  durationInFrames?: number;
  delay?: number;
  easing?: EasingPresetName | EasingFunction;
  fade?: boolean;
  fromOpacity?: number;
  toOpacity?: number;
  rotation?: number;
  initialRotation?: number;
  finalRotation?: number;
  spring?: boolean | string;
  springPreset?: string;
  overshoot?: boolean;
  reverse?: boolean;
  inDuration?: number;
  holdDuration?: number;
  outDuration?: number;
}

/**
 * Pure calculator for ZoomTransition styling and progress metrics.
 */
export function calculateZoomMetrics(
  params: CalculateZoomMetricsParams
): ZoomTransitionMetrics {
  const {
    currentFrame,
    fps = 30,
    mode = 'in',
    initialScale,
    finalScale,
    throughScale,
    outgoingScale,
    incomingScale,
    transformOrigin = 'center',
    duration,
    durationInFrames,
    delay = 0,
    easing = 'easeOut',
    fade = false,
    fromOpacity,
    toOpacity,
    rotation = 0,
    initialRotation = 0,
    finalRotation,
    spring = false,
    springPreset,
    overshoot = false,
    reverse = false,
    inDuration,
    holdDuration,
    outDuration,
  } = params;

  const normalizedMode = normalizeZoomMode(mode);
  const resolvedOrigin = resolveTransformOrigin(transformOrigin);
  const totalDuration = Math.max(1, duration ?? durationInFrames ?? 25);
  const startFrame = delay;
  const endFrame = startFrame + totalDuration;

  // Resolved rotation values
  const startRot = initialRotation;
  const targetRot = finalRotation ?? rotation;

  // Resolved easing function
  const easeFn = (easing ? resolveEasing(easing) : undefined) ?? easeOut;

  // -------------------------------------------------------------------------
  // 1. Mode: 'in' (Zoom In)
  // -------------------------------------------------------------------------
  if (normalizedMode === 'in') {
    const sInit = initialScale ?? 0;
    const sFinal = finalScale ?? 1.0;
    const oInit = fromOpacity ?? 0;
    const oFinal = toOpacity ?? 1.0;

    let progress = 0;
    let scale = sInit;
    let opacity = fade ? oInit : 1.0;
    let rot = startRot;
    let phase: ZoomTransitionMetrics['phase'] = 'in';

    if (currentFrame < startFrame) {
      phase = 'pending';
      progress = 0;
      scale = sInit;
      opacity = fade ? oInit : 1.0;
      rot = startRot;
    } else if (currentFrame >= endFrame) {
      phase = 'complete';
      progress = 1.0;
      scale = sFinal;
      opacity = fade ? oFinal : 1.0;
      rot = targetRot;
    } else {
      phase = 'in';
      const linearU = (currentFrame - startFrame) / totalDuration;
      const u = reverse ? 1.0 - linearU : linearU;

      if (spring || overshoot) {
        const preset: SpringPresetName = overshoot
          ? 'bouncy'
          : typeof spring === 'string'
            ? (spring as SpringPresetName)
            : (springPreset as SpringPresetName) || 'snappy';

        const springVal = createSpring({
          frame: Math.max(0, currentFrame - startFrame),
          fps,
          delay: 0,
          preset,
          from: 0,
          to: 1,
        });
        progress = reverse ? Math.max(0, 1.0 - springVal) : springVal;
      } else {
        progress = easeFn(u);
      }

      scale = sInit + (sFinal - sInit) * progress;
      opacity = fade ? oInit + (oFinal - oInit) * (reverse ? 1.0 - linearU : linearU) : 1.0;
      rot = startRot + (targetRot - startRot) * progress;
    }

    scale = sanitizeZoomNumber(scale);
    opacity = Math.max(0, Math.min(1, sanitizeZoomNumber(opacity)));
    rot = sanitizeZoomNumber(rot);

    return {
      scale,
      opacity,
      rotation: rot,
      transform: buildZoomTransform(scale, rot),
      transformOrigin: resolvedOrigin,
      outgoingScale: 1,
      outgoingOpacity: 1,
      outgoingRotation: 0,
      outgoingTransform: buildZoomTransform(1, 0),
      incomingScale: scale,
      incomingOpacity: opacity,
      incomingRotation: rot,
      incomingTransform: buildZoomTransform(scale, rot),
      progress: sanitizeZoomNumber(progress),
      isComplete: phase === 'complete',
      phase,
    };
  }

  // -------------------------------------------------------------------------
  // 2. Mode: 'out' (Zoom Out)
  // -------------------------------------------------------------------------
  if (normalizedMode === 'out') {
    const sInit = initialScale ?? 1.0;
    const sFinal = finalScale ?? 0;
    const oInit = fromOpacity ?? 1.0;
    const oFinal = toOpacity ?? 0;

    let progress = 0;
    let scale = sInit;
    let opacity = 1.0;
    let rot = startRot;
    let phase: ZoomTransitionMetrics['phase'] = 'out';

    if (currentFrame < startFrame) {
      phase = 'pending';
      progress = 0;
      scale = sInit;
      opacity = oInit;
      rot = startRot;
    } else if (currentFrame >= endFrame) {
      phase = 'complete';
      progress = 1.0;
      scale = sFinal;
      opacity = fade ? oFinal : 1.0;
      rot = targetRot;
    } else {
      phase = 'out';
      const linearU = (currentFrame - startFrame) / totalDuration;
      const u = reverse ? 1.0 - linearU : linearU;

      if (spring || overshoot) {
        const preset: SpringPresetName = overshoot
          ? 'bouncy'
          : typeof spring === 'string'
            ? (spring as SpringPresetName)
            : (springPreset as SpringPresetName) || 'snappy';

        const springVal = createSpring({
          frame: Math.max(0, currentFrame - startFrame),
          fps,
          delay: 0,
          preset,
          from: 0,
          to: 1,
        });
        progress = reverse ? Math.max(0, 1.0 - springVal) : springVal;
      } else {
        progress = easeFn(u);
      }

      scale = sInit + (sFinal - sInit) * progress;
      opacity = fade ? oInit + (oFinal - oInit) * (reverse ? 1.0 - linearU : linearU) : 1.0;
      rot = startRot + (targetRot - startRot) * progress;
    }

    scale = sanitizeZoomNumber(scale);
    opacity = Math.max(0, Math.min(1, sanitizeZoomNumber(opacity)));
    rot = sanitizeZoomNumber(rot);

    return {
      scale,
      opacity,
      rotation: rot,
      transform: buildZoomTransform(scale, rot),
      transformOrigin: resolvedOrigin,
      outgoingScale: scale,
      outgoingOpacity: opacity,
      outgoingRotation: rot,
      outgoingTransform: buildZoomTransform(scale, rot),
      incomingScale: 1,
      incomingOpacity: 1,
      incomingRotation: 0,
      incomingTransform: buildZoomTransform(1, 0),
      progress: sanitizeZoomNumber(progress),
      isComplete: phase === 'complete',
      phase,
    };
  }

  // -------------------------------------------------------------------------
  // 3. Mode: 'in-out' (Zoom In, Hold, Zoom Out)
  // -------------------------------------------------------------------------
  if (normalizedMode === 'in-out') {
    const sInit = initialScale ?? 0;
    const sMid = throughScale ?? 1.0;
    const sFinal = finalScale ?? 0;

    const inDur = Math.max(1, inDuration ?? Math.floor(totalDuration * 0.4));
    const holdDur = Math.max(0, holdDuration ?? Math.floor(totalDuration * 0.2));
    const outDur = Math.max(1, outDuration ?? (totalDuration - inDur - holdDur));

    const inEnd = startFrame + inDur;
    const holdEnd = inEnd + holdDur;
    const outEnd = holdEnd + outDur;

    let progress = 0;
    let scale = sInit;
    let opacity = fade ? 0 : 1.0;
    let rot = startRot;
    let phase: ZoomTransitionMetrics['phase'] = 'in';

    if (currentFrame < startFrame) {
      phase = 'pending';
      progress = 0;
      scale = sInit;
      opacity = fade ? 0 : 1.0;
      rot = startRot;
    } else if (currentFrame < inEnd) {
      phase = 'in';
      const u = (currentFrame - startFrame) / inDur;
      const p = easeFn(u);
      progress = p * 0.5;
      scale = sInit + (sMid - sInit) * p;
      opacity = fade ? p : 1.0;
      rot = startRot + (targetRot - startRot) * (p * 0.5);
    } else if (currentFrame < holdEnd) {
      phase = 'hold';
      progress = 0.5;
      scale = sMid;
      opacity = 1.0;
      rot = startRot + (targetRot - startRot) * 0.5;
    } else if (currentFrame < outEnd) {
      phase = 'out';
      const u = (currentFrame - holdEnd) / outDur;
      const p = easeFn(u);
      progress = 0.5 + p * 0.5;
      scale = sMid + (sFinal - sMid) * p;
      opacity = fade ? 1.0 - p : 1.0;
      rot = startRot + (targetRot - startRot) * (0.5 + p * 0.5);
    } else {
      phase = 'complete';
      progress = 1.0;
      scale = sFinal;
      opacity = fade ? 0 : 1.0;
      rot = targetRot;
    }

    scale = sanitizeZoomNumber(scale);
    opacity = Math.max(0, Math.min(1, sanitizeZoomNumber(opacity)));
    rot = sanitizeZoomNumber(rot);

    return {
      scale,
      opacity,
      rotation: rot,
      transform: buildZoomTransform(scale, rot),
      transformOrigin: resolvedOrigin,
      outgoingScale: scale,
      outgoingOpacity: opacity,
      outgoingRotation: rot,
      outgoingTransform: buildZoomTransform(scale, rot),
      incomingScale: scale,
      incomingOpacity: opacity,
      incomingRotation: rot,
      incomingTransform: buildZoomTransform(scale, rot),
      progress: sanitizeZoomNumber(progress),
      isComplete: phase === 'complete',
      phase,
    };
  }

  // -------------------------------------------------------------------------
  // 4. Mode: 'through' (Zoom Through / Hyper-Zoom)
  // -------------------------------------------------------------------------
  if (normalizedMode === 'through') {
    const sInit = initialScale ?? 0.2;
    const sMid = throughScale ?? 1.0;
    const sFinal = finalScale ?? 2.8;

    let progress = 0;
    let scale = sInit;
    let opacity = 1.0;
    let rot = startRot;
    let phase: ZoomTransitionMetrics['phase'] = 'in';

    if (currentFrame < startFrame) {
      phase = 'pending';
      progress = 0;
      scale = sInit;
      opacity = fade ? (fromOpacity ?? 0) : 1.0;
      rot = startRot;
    } else if (currentFrame >= endFrame) {
      phase = 'complete';
      progress = 1.0;
      scale = sFinal;
      opacity = 0;
      rot = targetRot;
    } else {
      const u = (currentFrame - startFrame) / totalDuration;
      progress = u;
      rot = startRot + (targetRot - startRot) * u;

      if (u <= 0.5) {
        phase = 'in';
        const halfU = u / 0.5;
        const p = easeFn(halfU);
        scale = sInit + (sMid - sInit) * p;
        opacity = fade ? (fromOpacity ?? 0) + (1.0 - (fromOpacity ?? 0)) * p : 1.0;
      } else {
        phase = 'out';
        const halfU = (u - 0.5) / 0.5;
        const p = easeFn(halfU);
        scale = sMid + (sFinal - sMid) * p;
        // Hyper-zoom past camera always naturally fades to 0
        opacity = 1.0 - p;
      }
    }

    scale = sanitizeZoomNumber(scale);
    opacity = Math.max(0, Math.min(1, sanitizeZoomNumber(opacity)));
    rot = sanitizeZoomNumber(rot);

    return {
      scale,
      opacity,
      rotation: rot,
      transform: buildZoomTransform(scale, rot),
      transformOrigin: resolvedOrigin,
      outgoingScale: scale,
      outgoingOpacity: opacity,
      outgoingRotation: rot,
      outgoingTransform: buildZoomTransform(scale, rot),
      incomingScale: scale,
      incomingOpacity: opacity,
      incomingRotation: rot,
      incomingTransform: buildZoomTransform(scale, rot),
      progress: sanitizeZoomNumber(progress),
      isComplete: phase === 'complete',
      phase,
    };
  }

  // -------------------------------------------------------------------------
  // 5. Mode: 'replace' (Dual Layer Zoom Replace / Cross-Zoom)
  // -------------------------------------------------------------------------
  const sOutStart = 1.0;
  const sOutEnd = outgoingScale ?? 1.4;
  const sInStart = incomingScale ?? 0.6;
  const sInEnd = 1.0;

  let progress = 0;
  let p = 0;
  let phase: ZoomTransitionMetrics['phase'] = 'in';

  if (currentFrame < startFrame) {
    phase = 'pending';
    progress = 0;
    p = 0;
  } else if (currentFrame >= endFrame) {
    phase = 'complete';
    progress = 1.0;
    p = 1.0;
  } else {
    phase = 'in';
    const linearU = (currentFrame - startFrame) / totalDuration;
    const u = reverse ? 1.0 - linearU : linearU;

    if (spring || overshoot) {
      const preset: SpringPresetName = overshoot
        ? 'bouncy'
        : typeof spring === 'string'
          ? (spring as SpringPresetName)
          : (springPreset as SpringPresetName) || 'snappy';

      const springVal = createSpring({
        frame: Math.max(0, currentFrame - startFrame),
        fps,
        delay: 0,
        preset,
        from: 0,
        to: 1,
      });
      p = reverse ? Math.max(0, 1.0 - springVal) : springVal;
    } else {
      p = easeFn(u);
    }
    progress = linearU;
  }

  const outScale = sanitizeZoomNumber(sOutStart + (sOutEnd - sOutStart) * p);
  const outOpacity = Math.max(0, Math.min(1, sanitizeZoomNumber(1.0 - p)));
  const outRot = sanitizeZoomNumber(startRot + targetRot * p);

  const inScale = sanitizeZoomNumber(sInStart + (sInEnd - sInStart) * p);
  const inOpacity = Math.max(0, Math.min(1, sanitizeZoomNumber(p)));
  const inRot = sanitizeZoomNumber(-targetRot * (1.0 - p));

  return {
    scale: inScale,
    opacity: inOpacity,
    rotation: inRot,
    transform: buildZoomTransform(inScale, inRot),
    transformOrigin: resolvedOrigin,
    outgoingScale: outScale,
    outgoingOpacity: outOpacity,
    outgoingRotation: outRot,
    outgoingTransform: buildZoomTransform(outScale, outRot),
    incomingScale: inScale,
    incomingOpacity: inOpacity,
    incomingRotation: inRot,
    incomingTransform: buildZoomTransform(inScale, inRot),
    progress: sanitizeZoomNumber(progress),
    isComplete: phase === 'complete',
    phase,
  };
}
