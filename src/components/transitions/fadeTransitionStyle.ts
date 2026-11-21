/**
 * FadeTransition Pure Mathematical Engine & Styling Logic
 * Frame-accurate calculation of opacity envelopes, crossfades,
 * easing curves, and phase boundaries.
 */

import { easeInOut, resolveEasing } from '../../utils/animation/easing.ts';
import type { EasingFunction, EasingPresetName } from '../../utils/animation/easing.ts';
import type { FadeTransitionMetrics, FadeTransitionMode } from './types.ts';

/**
 * Sanitizes numeric opacity to strict [0, 1] bounds and eliminates signed zero (-0).
 */
export function sanitizeOpacity(value: number): number {
  if (Number.isNaN(value)) {
    return 0;
  }
  const clamped = Math.min(1, Math.max(0, value));
  return Math.abs(clamped) < 1e-6 ? 0 : Math.abs(clamped - 1) < 1e-6 ? 1 : Number(clamped.toFixed(6));
}

export interface CalculateFadeOpacityParams {
  currentFrame: number;
  mode?: FadeTransitionMode;
  direction?: 'in' | 'out';
  duration?: number;
  durationInFrames?: number;
  delay?: number;
  fromOpacity?: number;
  toOpacity?: number;
  reverse?: boolean;
  easing?: EasingPresetName | EasingFunction;
  inDuration?: number;
  holdDuration?: number;
  outDuration?: number;
}

/**
 * Calculates deterministic frame-based opacity for fade-in, fade-out,
 * in-out envelope, and dual-layer crossfade.
 */
export function calculateFadeOpacity(params: CalculateFadeOpacityParams): FadeTransitionMetrics {
  const mode: FadeTransitionMode =
    params.mode ?? (params.direction === 'out' ? 'out' : 'in');
  const duration = Math.max(1, params.duration ?? params.durationInFrames ?? 25);
  const delay = Math.max(0, params.delay ?? 0);
  const rawFrom = params.fromOpacity ?? 0;
  const rawTo = params.toOpacity ?? 1;
  const fromOpacity = sanitizeOpacity(rawFrom);
  const toOpacity = sanitizeOpacity(rawTo);
  const isReverse = Boolean(params.reverse);
  const currentFrame = params.currentFrame;

  const easingFn = (params.easing ? resolveEasing(params.easing) : undefined) ?? easeInOut;

  // -------------------------------------------------------------------------
  // Mode 1: Fade In
  // -------------------------------------------------------------------------
  if (mode === 'in') {
    const startFrame = delay;
    const endFrame = delay + duration;

    if (currentFrame < startFrame) {
      const initialOpacity = isReverse ? toOpacity : fromOpacity;
      return {
        opacity: initialOpacity,
        outgoingOpacity: 1 - initialOpacity,
        incomingOpacity: initialOpacity,
        progress: 0,
        isComplete: false,
        phase: 'pending',
      };
    }

    if (currentFrame >= endFrame) {
      const finalOpacity = isReverse ? fromOpacity : toOpacity;
      return {
        opacity: finalOpacity,
        outgoingOpacity: 1 - finalOpacity,
        incomingOpacity: finalOpacity,
        progress: 1,
        isComplete: true,
        phase: 'complete',
      };
    }

    const linearT = (currentFrame - startFrame) / duration;
    const effectiveT = isReverse ? 1 - linearT : linearT;
    const easedT = easingFn(effectiveT);
    const opacity = sanitizeOpacity(fromOpacity + (toOpacity - fromOpacity) * easedT);

    return {
      opacity,
      outgoingOpacity: sanitizeOpacity(1 - opacity),
      incomingOpacity: opacity,
      progress: Number(linearT.toFixed(6)),
      isComplete: false,
      phase: 'in',
    };
  }

  // -------------------------------------------------------------------------
  // Mode 2: Fade Out
  // -------------------------------------------------------------------------
  if (mode === 'out') {
    const startFrame = delay;
    const endFrame = delay + duration;

    if (currentFrame < startFrame) {
      const initialOpacity = isReverse ? fromOpacity : toOpacity;
      return {
        opacity: initialOpacity,
        outgoingOpacity: initialOpacity,
        incomingOpacity: 1 - initialOpacity,
        progress: 0,
        isComplete: false,
        phase: 'pending',
      };
    }

    if (currentFrame >= endFrame) {
      const finalOpacity = isReverse ? toOpacity : fromOpacity;
      return {
        opacity: finalOpacity,
        outgoingOpacity: finalOpacity,
        incomingOpacity: 1 - finalOpacity,
        progress: 1,
        isComplete: true,
        phase: 'complete',
      };
    }

    const linearT = (currentFrame - startFrame) / duration;
    const effectiveT = isReverse ? 1 - linearT : linearT;
    const easedT = easingFn(effectiveT);
    // In fade out: fades from toOpacity down to fromOpacity
    const opacity = sanitizeOpacity(toOpacity + (fromOpacity - toOpacity) * easedT);

    return {
      opacity,
      outgoingOpacity: opacity,
      incomingOpacity: sanitizeOpacity(1 - opacity),
      progress: Number(linearT.toFixed(6)),
      isComplete: false,
      phase: 'out',
    };
  }

  // -------------------------------------------------------------------------
  // Mode 3: In-Out (Fade In -> Hold -> Fade Out envelope)
  // -------------------------------------------------------------------------
  if (mode === 'in-out') {
    // Resolve phase timing durations
    let inD = params.inDuration;
    let holdD = params.holdDuration;
    let outD = params.outDuration;

    if (inD === undefined || holdD === undefined || outD === undefined) {
      inD = inD ?? Math.max(1, Math.round(duration * 0.35));
      holdD = holdD ?? Math.max(0, Math.round(duration * 0.3));
      outD = outD ?? Math.max(1, duration - inD - holdD);
    }

    const totalEnvelope = inD + holdD + outD;
    const startFrame = delay;
    const holdStartFrame = delay + inD;
    const outStartFrame = holdStartFrame + holdD;
    const endFrame = delay + totalEnvelope;

    if (currentFrame < startFrame) {
      return {
        opacity: fromOpacity,
        outgoingOpacity: 1 - fromOpacity,
        incomingOpacity: fromOpacity,
        progress: 0,
        isComplete: false,
        phase: 'pending',
      };
    }

    if (currentFrame >= endFrame) {
      return {
        opacity: fromOpacity,
        outgoingOpacity: 1 - fromOpacity,
        incomingOpacity: fromOpacity,
        progress: 1,
        isComplete: true,
        phase: 'complete',
      };
    }

    const totalProgress = Math.min(1, Math.max(0, (currentFrame - startFrame) / totalEnvelope));

    // Phase A: Ingress Fade In
    if (currentFrame < holdStartFrame) {
      const localT = (currentFrame - startFrame) / inD;
      const effectiveT = isReverse ? 1 - localT : localT;
      const easedT = easingFn(effectiveT);
      const opacity = sanitizeOpacity(fromOpacity + (toOpacity - fromOpacity) * easedT);
      return {
        opacity,
        outgoingOpacity: sanitizeOpacity(1 - opacity),
        incomingOpacity: opacity,
        progress: Number(totalProgress.toFixed(6)),
        isComplete: false,
        phase: 'in',
      };
    }

    // Phase B: Plateau Hold
    if (currentFrame < outStartFrame) {
      return {
        opacity: toOpacity,
        outgoingOpacity: sanitizeOpacity(1 - toOpacity),
        incomingOpacity: toOpacity,
        progress: Number(totalProgress.toFixed(6)),
        isComplete: false,
        phase: 'hold',
      };
    }

    // Phase C: Egress Fade Out
    const localT = (currentFrame - outStartFrame) / outD;
    const effectiveT = isReverse ? 1 - localT : localT;
    const easedT = easingFn(effectiveT);
    const opacity = sanitizeOpacity(toOpacity + (fromOpacity - toOpacity) * easedT);

    return {
      opacity,
      outgoingOpacity: sanitizeOpacity(1 - opacity),
      incomingOpacity: opacity,
      progress: Number(totalProgress.toFixed(6)),
      isComplete: false,
      phase: 'out',
    };
  }

  // -------------------------------------------------------------------------
  // Mode 4: Crossfade (Dual-Layer Cross-Dissolve)
  // -------------------------------------------------------------------------
  const startFrame = delay;
  const endFrame = delay + duration;

  if (currentFrame < startFrame) {
    const outgoing = isReverse ? fromOpacity : toOpacity;
    const incoming = isReverse ? toOpacity : fromOpacity;
    return {
      opacity: incoming,
      outgoingOpacity: outgoing,
      incomingOpacity: incoming,
      progress: 0,
      isComplete: false,
      phase: 'pending',
    };
  }

  if (currentFrame >= endFrame) {
    const outgoing = isReverse ? toOpacity : fromOpacity;
    const incoming = isReverse ? fromOpacity : toOpacity;
    return {
      opacity: incoming,
      outgoingOpacity: outgoing,
      incomingOpacity: incoming,
      progress: 1,
      isComplete: true,
      phase: 'complete',
    };
  }

  const linearT = (currentFrame - startFrame) / duration;
  const effectiveT = isReverse ? 1 - linearT : linearT;
  const easedT = easingFn(effectiveT);

  // Outgoing layer fades from toOpacity down to fromOpacity
  const outgoingOpacity = sanitizeOpacity(toOpacity + (fromOpacity - toOpacity) * easedT);
  // Incoming layer fades from fromOpacity up to toOpacity
  const incomingOpacity = sanitizeOpacity(fromOpacity + (toOpacity - fromOpacity) * easedT);

  return {
    opacity: incomingOpacity,
    outgoingOpacity,
    incomingOpacity,
    progress: Number(linearT.toFixed(6)),
    isComplete: false,
    phase: 'in',
  };
}
