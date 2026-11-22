/**
 * SplitTransition Pure Mathematical Engine & Styling Logic
 * Frame-accurate calculation of multi-panel partitions, clipping insets,
 * directional displacement vectors, staggered timing envelopes,
 * and dual-layer panel replacements.
 */

import { easeOut, easeInOut, resolveEasing } from '../../utils/animation/easing.ts';
import type { EasingFunction, EasingPresetName } from '../../utils/animation/easing.ts';
import { createSpring } from '../../utils/animation/spring.ts';
import type { SpringPresetName } from '../../styles/motion.ts';
import type {
  SplitDirection,
  SplitMovementDirection,
  SplitPanelMetrics,
  SplitStaggerOrder,
  SplitTransitionMetrics,
  SplitTransitionMode,
} from './types.ts';

/**
 * Sanitizes numeric values to prevent IEEE-754 signed negative zero (-0)
 * and floating point inaccuracy.
 */
export function sanitizeSplitNumber(val: number): number {
  if (Number.isNaN(val) || Math.abs(val) < 1e-6) {
    return 0;
  }
  return Number(val.toFixed(4));
}

/**
 * Normalizes input split direction into canonical direction.
 */
export function normalizeSplitDirection(
  dir?: SplitDirection
): 'horizontal' | 'vertical' | 'quadrants' | 'grid' {
  if (!dir || dir === 'vertical') {
    return 'vertical';
  }
  if (dir === 'horizontal') {
    return 'horizontal';
  }
  if (dir === 'quadrants') {
    return 'quadrants';
  }
  if (dir === 'grid') {
    return 'grid';
  }
  return 'vertical';
}

/**
 * Normalizes input movement direction.
 */
export function normalizeSplitMovement(
  mov?: SplitMovementDirection
): 'outward' | 'inward' | 'opposite' | 'alternate' | 'directional' | 'left' | 'right' | 'up' | 'down' {
  if (!mov || mov === 'outward') {
    return 'outward';
  }
  if (mov === 'inward') {
    return 'inward';
  }
  if (mov === 'opposite' || mov === 'alternate') {
    return 'opposite';
  }
  if (mov === 'left') {
    return 'left';
  }
  if (mov === 'right') {
    return 'right';
  }
  if (mov === 'up') {
    return 'up';
  }
  if (mov === 'down') {
    return 'down';
  }
  return 'outward';
}

/**
 * Normalizes input transition mode.
 */
export function normalizeSplitMode(
  mode?: SplitTransitionMode
): 'enter' | 'exit' | 'enter-exit' | 'replace' {
  if (!mode || mode === 'enter' || mode === 'in' || mode === 'reveal') {
    return 'enter';
  }
  if (mode === 'exit' || mode === 'out' || mode === 'hide') {
    return 'exit';
  }
  if (mode === 'enter-exit' || mode === 'in-out') {
    return 'enter-exit';
  }
  if (mode === 'replace') {
    return 'replace';
  }
  return 'enter';
}

/**
 * Resolves panel row and column counts based on split direction and configuration.
 */
export function resolveSplitGrid(params: {
  splitDirection?: SplitDirection;
  panelCount?: number;
  rows?: number;
  cols?: number;
}): { totalRows: number; totalCols: number; count: number } {
  const dir = normalizeSplitDirection(params.splitDirection);

  if (dir === 'vertical') {
    const cols = Math.max(2, Math.floor(params.panelCount ?? 2));
    return { totalRows: 1, totalCols: cols, count: cols };
  }

  if (dir === 'horizontal') {
    const rows = Math.max(2, Math.floor(params.panelCount ?? 2));
    return { totalRows: rows, totalCols: 1, count: rows };
  }

  if (dir === 'quadrants') {
    return { totalRows: 2, totalCols: 2, count: 4 };
  }

  // Grid
  const r = Math.max(1, Math.floor(params.rows ?? 2));
  const c = Math.max(1, Math.floor(params.cols ?? 2));
  return { totalRows: r, totalCols: c, count: r * c };
}

/**
 * Calculates CSS clipPath inset rectangle for panel (row, col) within a totalRows x totalCols grid.
 */
export function calculatePanelClipInset(
  row: number,
  col: number,
  totalRows: number,
  totalCols: number,
  panelGap = 0
): string {
  const top = (row / totalRows) * 100;
  const bottom = (1 - (row + 1) / totalRows) * 100;
  const left = (col / totalCols) * 100;
  const right = (1 - (col + 1) / totalCols) * 100;

  if (panelGap > 0) {
    const halfGap = panelGap / 2;
    return `inset(calc(${sanitizeSplitNumber(top)}% + ${halfGap}px) calc(${sanitizeSplitNumber(right)}% + ${halfGap}px) calc(${sanitizeSplitNumber(bottom)}% + ${halfGap}px) calc(${sanitizeSplitNumber(left)}% + ${halfGap}px))`;
  }

  return `inset(${sanitizeSplitNumber(top)}% ${sanitizeSplitNumber(right)}% ${sanitizeSplitNumber(bottom)}% ${sanitizeSplitNumber(left)}%)`;
}

/**
 * Computes displacement vector (dirX, dirY) for panel (row, col).
 */
export function calculatePanelMovementVector(
  row: number,
  col: number,
  totalRows: number,
  totalCols: number,
  movement: string,
  splitDirection: string
): { dirX: number; dirY: number } {
  const cleanMovement = movement.toLowerCase();

  if (cleanMovement === 'left') {
    return { dirX: -1, dirY: 0 };
  }
  if (cleanMovement === 'right') {
    return { dirX: 1, dirY: 0 };
  }
  if (cleanMovement === 'up') {
    return { dirX: 0, dirY: -1 };
  }
  if (cleanMovement === 'down') {
    return { dirX: 0, dirY: 1 };
  }

  if (cleanMovement === 'opposite' || cleanMovement === 'alternate') {
    if (splitDirection === 'vertical') {
      // Alternating columns move Up and Down
      return { dirX: 0, dirY: col % 2 === 0 ? -1 : 1 };
    }
    if (splitDirection === 'horizontal') {
      // Alternating rows move Left and Right
      return { dirX: row % 2 === 0 ? -1 : 1, dirY: 0 };
    }
    // Quadrants / Grid: checkerboard alternating
    return { dirX: (row + col) % 2 === 0 ? -1 : 1, dirY: 0 };
  }

  // Outward / Inward
  let dirX = 0;
  let dirY = 0;

  if (splitDirection === 'vertical') {
    const centerCol = (totalCols - 1) / 2;
    dirX = col <= centerCol ? -1 : 1;
    dirY = 0;
  } else if (splitDirection === 'horizontal') {
    const centerRow = (totalRows - 1) / 2;
    dirX = 0;
    dirY = row <= centerRow ? -1 : 1;
  } else {
    // Quadrants or Grid
    const centerCol = (totalCols - 1) / 2;
    const centerRow = (totalRows - 1) / 2;
    dirX = col <= centerCol ? -1 : 1;
    dirY = row <= centerRow ? -1 : 1;
  }

  if (cleanMovement === 'inward') {
    dirX = -dirX;
    dirY = -dirY;
  }

  return { dirX, dirY };
}

/**
 * Computes stagger sequencing index for sequential panel reveals.
 */
export function calculateStaggerRank(
  index: number,
  row: number,
  col: number,
  totalRows: number,
  totalCols: number,
  order: SplitStaggerOrder = 'start-to-end'
): number {
  const totalCount = totalRows * totalCols;

  switch (order) {
    case 'start-to-end':
      return index;
    case 'end-to-start':
      return totalCount - 1 - index;
    case 'center-out': {
      const centerCol = (totalCols - 1) / 2;
      const centerRow = (totalRows - 1) / 2;
      const dist = Math.abs(col - centerCol) + Math.abs(row - centerRow);
      return Math.round(dist * 2);
    }
    case 'edges-in': {
      const centerCol = (totalCols - 1) / 2;
      const centerRow = (totalRows - 1) / 2;
      const maxDist = centerCol + centerRow;
      const dist = Math.abs(col - centerCol) + Math.abs(row - centerRow);
      return Math.round((maxDist - dist) * 2);
    }
    default:
      return index;
  }
}

export interface CalculateSplitMetricsParams {
  currentFrame: number;
  splitDirection?: SplitDirection;
  panelCount?: number;
  rows?: number;
  cols?: number;
  mode?: SplitTransitionMode;
  movementDirection?: SplitMovementDirection;
  distance?: number | string;
  panelGap?: number;
  staggerDelay?: number;
  staggerOrder?: SplitStaggerOrder;
  duration?: number;
  durationInFrames?: number;
  delay?: number;
  easing?: EasingPresetName | EasingFunction;
  fade?: boolean;
  fromOpacity?: number;
  toOpacity?: number;
  spring?: boolean | string;
  springPreset?: string;
  overshoot?: boolean;
  reverse?: boolean;
  inDuration?: number;
  holdDuration?: number;
  outDuration?: number;
}

/**
 * Frame-accurate calculation of SplitTransition animation metrics.
 */
export function calculateSplitMetrics(
  params: CalculateSplitMetricsParams
): SplitTransitionMetrics {
  const {
    currentFrame,
    splitDirection: rawSplitDirection,
    panelCount,
    rows: customRows,
    cols: customCols,
    mode: rawMode,
    movementDirection: rawMovement,
    distance = '100%',
    panelGap = 0,
    staggerDelay = 0,
    staggerOrder = 'start-to-end',
    duration,
    durationInFrames,
    delay = 0,
    easing = 'easeOut',
    fade = false,
    fromOpacity = 0,
    toOpacity = 1,
    spring,
    springPreset,
    overshoot,
    reverse = false,
    inDuration,
    holdDuration,
    outDuration,
  } = params;

  const splitDirection = normalizeSplitDirection(rawSplitDirection);
  const mode = normalizeSplitMode(rawMode);
  const movement = normalizeSplitMovement(rawMovement);

  const { totalRows, totalCols, count } = resolveSplitGrid({
    splitDirection,
    panelCount,
    rows: customRows,
    cols: customCols,
  });

  const baseDuration = durationInFrames ?? duration ?? 25;

  // Parse distance into numeric value and CSS unit
  let distValue = 100;
  let distUnit = '%';
  if (typeof distance === 'number') {
    distValue = distance;
    distUnit = 'px';
  } else if (typeof distance === 'string') {
    const parsed = parseFloat(distance);
    distValue = Number.isNaN(parsed) ? 100 : parsed;
    distUnit = distance.includes('px') ? 'px' : '%';
  }

  // -------------------------------------------------------------------------
  // Enter-Exit Envelope Mode
  // -------------------------------------------------------------------------
  if (mode === 'enter-exit') {
    const inLen = inDuration ?? Math.max(1, Math.round(baseDuration * 0.35));
    const outLen = outDuration ?? Math.max(1, Math.round(baseDuration * 0.35));
    const holdLen = holdDuration ?? Math.max(0, baseDuration - inLen - outLen);
    const totalEnvelope = inLen + holdLen + outLen;

    const panels: SplitPanelMetrics[] = [];
    let allComplete = true;

    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / totalCols);
      const col = i % totalCols;
      const staggerRank = calculateStaggerRank(i, row, col, totalRows, totalCols, staggerOrder);
      const panelDelay = delay + staggerRank * staggerDelay;

      const relFrame = currentFrame - panelDelay;
      const clipPath = calculatePanelClipInset(row, col, totalRows, totalCols, panelGap);
      const { dirX, dirY } = calculatePanelMovementVector(
        row,
        col,
        totalRows,
        totalCols,
        movement,
        splitDirection
      );

      let phaseProgress = 0;
      let displacementFactor = 0; // 0 = at home (0,0), 1 = fully offset
      let opacity = 1;

      const easingFn: EasingFunction =
        (typeof easing === 'function' ? easing : resolveEasing(easing ?? easeInOut)) ?? easeInOut;

      if (relFrame < 0) {
        // Pending entrance: at offset position
        displacementFactor = 1;
        opacity = fade ? fromOpacity : 1;
        allComplete = false;
      } else if (relFrame < inLen) {
        // Entering phase
        phaseProgress = relFrame / inLen;
        const eased = easingFn(phaseProgress);
        displacementFactor = 1 - eased; // moves from 1 -> 0
        opacity = fade ? fromOpacity + eased * (toOpacity - fromOpacity) : 1;
        allComplete = false;
      } else if (relFrame < inLen + holdLen) {
        // Hold phase
        phaseProgress = 1;
        displacementFactor = 0; // at home
        opacity = toOpacity;
        allComplete = false;
      } else if (relFrame < totalEnvelope) {
        // Exiting phase
        phaseProgress = (relFrame - inLen - holdLen) / outLen;
        const eased = easingFn(phaseProgress);
        displacementFactor = eased; // moves from 0 -> 1
        opacity = fade ? toOpacity - eased * (toOpacity - fromOpacity) : 1;
        allComplete = false;
      } else {
        // Complete
        displacementFactor = 1;
        opacity = fade ? fromOpacity : 1;
      }

      const rawX = sanitizeSplitNumber(dirX * distValue * displacementFactor);
      const rawY = sanitizeSplitNumber(dirY * distValue * displacementFactor);

      panels.push({
        index: i,
        row,
        col,
        totalRows,
        totalCols,
        clipPath,
        translateX: `${rawX}${distUnit}`,
        translateY: `${rawY}${distUnit}`,
        rawX,
        rawY,
        opacity: sanitizeSplitNumber(opacity),
        progress: sanitizeSplitNumber(Math.max(0, Math.min(1, relFrame / totalEnvelope))),
      });
    }

    const overallRel = currentFrame - delay;
    const isComplete = overallRel >= totalEnvelope && allComplete;
    const phase: 'pending' | 'in' | 'hold' | 'out' | 'complete' =
      overallRel < 0
        ? 'pending'
        : overallRel < inLen
          ? 'in'
          : overallRel < inLen + holdLen
            ? 'hold'
            : overallRel < totalEnvelope
              ? 'out'
              : 'complete';

    return {
      panels,
      progress: sanitizeSplitNumber(Math.max(0, Math.min(1, overallRel / totalEnvelope))),
      isComplete,
      phase,
    };
  }

  // -------------------------------------------------------------------------
  // Standard Modes (Enter, Exit, Replace)
  // -------------------------------------------------------------------------
  const panels: SplitPanelMetrics[] = [];
  let allComplete = true;

  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / totalCols);
    const col = i % totalCols;
    const staggerRank = calculateStaggerRank(i, row, col, totalRows, totalCols, staggerOrder);
    const panelDelay = delay + staggerRank * staggerDelay;

    const relFrame = currentFrame - panelDelay;
    const clipPath = calculatePanelClipInset(row, col, totalRows, totalCols, panelGap);
    const { dirX, dirY } = calculatePanelMovementVector(
      row,
      col,
      totalRows,
      totalCols,
      movement,
      splitDirection
    );

    let panelProgress = 0;
    if (relFrame < 0) {
      panelProgress = 0;
      allComplete = false;
    } else if (relFrame >= baseDuration) {
      panelProgress = 1;
    } else {
      panelProgress = relFrame / baseDuration;
      allComplete = false;
    }

    if (reverse) {
      panelProgress = 1 - panelProgress;
    }

    // Evaluate progression curve
    let easedProgress = panelProgress;
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
      easedProgress = reverse ? Math.max(0, 1.0 - springVal) : springVal;
    } else {
      const easingFn: EasingFunction =
        (typeof easing === 'function' ? easing : resolveEasing(easing ?? easeOut)) ?? easeOut;
      easedProgress = easingFn(panelProgress);
    }

    // Calculate displacement factor
    // For 'enter': starts at 1 (offset) and settles to 0 (home)
    // For 'exit' or 'replace': starts at 0 (home) and moves to 1 (offset)
    let displacementFactor = 0;
    let opacity = 1;

    if (mode === 'enter') {
      displacementFactor = 1 - easedProgress;
      if (fade) {
        opacity = fromOpacity + easedProgress * (toOpacity - fromOpacity);
      }
    } else {
      // 'exit' or 'replace'
      displacementFactor = easedProgress;
      if (fade) {
        opacity = toOpacity - easedProgress * (toOpacity - fromOpacity);
      }
    }

    const rawX = sanitizeSplitNumber(dirX * distValue * displacementFactor);
    const rawY = sanitizeSplitNumber(dirY * distValue * displacementFactor);

    panels.push({
      index: i,
      row,
      col,
      totalRows,
      totalCols,
      clipPath,
      translateX: `${rawX}${distUnit}`,
      translateY: `${rawY}${distUnit}`,
      rawX,
      rawY,
      opacity: sanitizeSplitNumber(opacity),
      progress: sanitizeSplitNumber(panelProgress),
    });
  }

  const overallRel = currentFrame - delay;
  const maxDelay = delay + (count - 1) * staggerDelay;
  const overallTotal = maxDelay - delay + baseDuration;
  const isComplete = overallRel >= overallTotal && allComplete;
  const phase =
    overallRel < 0 ? 'pending' : isComplete ? 'complete' : mode === 'exit' ? 'out' : 'in';

  // In replace mode, generate outgoing and incoming panels
  if (mode === 'replace') {
    // Outgoing panels split and move away
    // Incoming panels stay at home (revealed as outgoing panels part)
    const incomingPanels: SplitPanelMetrics[] = panels.map((p) => ({
      ...p,
      translateX: '0%',
      translateY: '0%',
      rawX: 0,
      rawY: 0,
      opacity: 1,
    }));

    return {
      panels,
      progress: sanitizeSplitNumber(Math.max(0, Math.min(1, overallRel / overallTotal))),
      isComplete,
      phase,
      outgoingPanels: panels,
      incomingPanels,
    };
  }

  return {
    panels,
    progress: sanitizeSplitNumber(Math.max(0, Math.min(1, overallRel / overallTotal))),
    isComplete,
    phase,
  };
}
