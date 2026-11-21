/**
 * AnimatedPath Style & Motion Calculations
 * Pure mathematical functions for SVG path parsing, segment decomposition,
 * arc-to-cubic Bezier approximation, deterministic path sampling, bounding boxes,
 * and Remotion frame-based stroke drawing and motion-along-path kinetics.
 * Layer 2 of the Motion Graphics Framework.
 */

import type {
  PathAnimation,
  PathAnimationConfig,
  PathFillRevealTiming,
  PathFollowerConfig,
  PathPoint,
  AnimatedPathProps,
} from './types.ts';
import { clamp } from '../../utils/animation/clamp.ts';
import { resolveEasing, easeOutCubic } from '../../utils/animation/easing.ts';
import { createSpring } from '../../utils/animation/spring.ts';

export type SegmentType = 'line' | 'quadratic' | 'cubic';

export interface PathSegment {
  type: SegmentType;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  cx?: number;
  cy?: number;
  cx1?: number;
  cy1?: number;
  cx2?: number;
  cy2?: number;
  length: number;
  cumulativeLength: number;
}

export interface ParsedPath {
  d: string;
  segments: PathSegment[];
  totalLength: number;
  isClosed: boolean;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface PathBoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  boxWidth: number;
  boxHeight: number;
  viewBox: string;
}

export interface PathMotionState {
  progress: number;
  strokeProgress: number;
  fillProgress: number;
  followerProgress: number;
  opacity: number;
  fillOpacity: number;
  strokeOpacity: number;
  translateX: number;
  translateY: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  effectiveStrokeWidth: number;
  strokeDasharray: string | number | undefined;
  strokeDashoffset: number | undefined;
  pathLength: number;
  isAnimating: boolean;
  hasExited: boolean;
  followerPoint?: PathPoint;
}

/**
 * Tokenizes an SVG path data string into command letters and numeric coordinates.
 */
export function tokenizeSvgPath(d: string): (string | number)[] {
  const tokens: (string | number)[] = [];
  const regex = /([MmLlHhVvCcSsQqTtAaZz])|([-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?)/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(d)) !== null) {
    if (match[1]) {
      tokens.push(match[1]);
    } else if (match[2]) {
      const num = parseFloat(match[2]);
      if (!Number.isNaN(num)) {
        tokens.push(num);
      }
    }
  }

  return tokens;
}

/**
 * Calculates straight line length.
 */
function lineLength(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculates quadratic Bezier curve length using 16 subdivisions.
 */
function quadraticBezierLength(
  x1: number,
  y1: number,
  cx: number,
  cy: number,
  x2: number,
  y2: number
): number {
  let length = 0;
  let prevX = x1;
  let prevY = y1;
  const steps = 16;

  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const inv = 1 - t;
    const currX = inv * inv * x1 + 2 * inv * t * cx + t * t * x2;
    const currY = inv * inv * y1 + 2 * inv * t * cy + t * t * y2;
    const dx = currX - prevX;
    const dy = currY - prevY;
    length += Math.sqrt(dx * dx + dy * dy);
    prevX = currX;
    prevY = currY;
  }

  return length;
}

/**
 * Calculates cubic Bezier curve length using 16 subdivisions.
 */
function cubicBezierLength(
  x1: number,
  y1: number,
  cx1: number,
  cy1: number,
  cx2: number,
  cy2: number,
  x2: number,
  y2: number
): number {
  let length = 0;
  let prevX = x1;
  let prevY = y1;
  const steps = 16;

  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const inv = 1 - t;
    const currX =
      inv * inv * inv * x1 +
      3 * inv * inv * t * cx1 +
      3 * inv * t * t * cx2 +
      t * t * t * x2;
    const currY =
      inv * inv * inv * y1 +
      3 * inv * inv * t * cy1 +
      3 * inv * t * t * cy2 +
      t * t * t * y2;
    const dx = currX - prevX;
    const dy = currY - prevY;
    length += Math.sqrt(dx * dx + dy * dy);
    prevX = currX;
    prevY = currY;
  }

  return length;
}

/**
 * Converts an SVG elliptical arc into cubic Bezier curve segments.
 */
function arcToCubicBeziers(
  x1: number,
  y1: number,
  rxIn: number,
  ryIn: number,
  xAxisRotationDeg: number,
  largeArcFlag: number,
  sweepFlag: number,
  x2: number,
  y2: number
): Array<{ x1: number; y1: number; cx1: number; cy1: number; cx2: number; cy2: number; x2: number; y2: number }> {
  if (x1 === x2 && y1 === y2) return [];

  let rx = Math.abs(rxIn);
  let ry = Math.abs(ryIn);

  if (rx === 0 || ry === 0) {
    return [{ x1, y1, cx1: x1, cy1: y1, cx2: x2, cy2: y2, x2, y2 }];
  }

  const phi = (xAxisRotationDeg * Math.PI) / 180;
  const cosPhi = Math.cos(phi);
  const sinPhi = Math.sin(phi);

  const dx2 = (x1 - x2) / 2;
  const dy2 = (y1 - y2) / 2;
  const x1p = cosPhi * dx2 + sinPhi * dy2;
  const y1p = -sinPhi * dx2 + cosPhi * dy2;

  // Ensure radii are large enough
  const lambda = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  if (lambda > 1) {
    const sqrtLambda = Math.sqrt(lambda);
    rx *= sqrtLambda;
    ry *= sqrtLambda;
  }

  const sign = largeArcFlag === sweepFlag ? -1 : 1;
  const numerator = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p;
  const denominator = rx * rx * y1p * y1p + ry * ry * x1p * x1p;
  const sq = denominator === 0 ? 0 : Math.max(0, numerator / denominator);
  const coef = sign * Math.sqrt(sq);

  const cxp = coef * ((rx * y1p) / ry);
  const cyp = coef * (-(ry * x1p) / rx);

  const cx = cosPhi * cxp - sinPhi * cyp + (x1 + x2) / 2;
  const cy = sinPhi * cxp + cosPhi * cyp + (y1 + y2) / 2;

  const ux = (x1p - cxp) / rx;
  const uy = (y1p - cyp) / ry;
  const vx = (-x1p - cxp) / rx;
  const vy = (-y1p - cyp) / ry;

  const theta1 = Math.atan2(uy, ux);
  let deltaTheta = Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy);

  if (sweepFlag === 0 && deltaTheta > 0) {
    deltaTheta -= 2 * Math.PI;
  } else if (sweepFlag === 1 && deltaTheta < 0) {
    deltaTheta += 2 * Math.PI;
  }

  const segmentsCount = Math.max(Math.ceil(Math.abs(deltaTheta) / (Math.PI / 2)), 1);
  const delta = deltaTheta / segmentsCount;
  const beziers: Array<{
    x1: number;
    y1: number;
    cx1: number;
    cy1: number;
    cx2: number;
    cy2: number;
    x2: number;
    y2: number;
  }> = [];

  let currentTheta = theta1;
  let startX = x1;
  let startY = y1;

  for (let i = 0; i < segmentsCount; i++) {
    const nextTheta = currentTheta + delta;
    const alpha = Math.sin(delta) * (Math.sqrt(4 + 3 * Math.tan(delta / 2) * Math.tan(delta / 2)) - 1) / 3;

    const cosT1 = Math.cos(currentTheta);
    const sinT1 = Math.sin(currentTheta);
    const cosT2 = Math.cos(nextTheta);
    const sinT2 = Math.sin(nextTheta);

    // End point of sub-arc
    let endX = cosPhi * rx * cosT2 - sinPhi * ry * sinT2 + cx;
    let endY = sinPhi * rx * cosT2 + cosPhi * ry * sinT2 + cy;
    if (i === segmentsCount - 1) {
      endX = x2;
      endY = y2;
    }

    // Derivative vectors scaled by alpha
    const dx1 = -cosPhi * rx * sinT1 - sinPhi * ry * cosT1;
    const dy1 = -sinPhi * rx * sinT1 + cosPhi * ry * cosT1;
    const dx2b = -cosPhi * rx * sinT2 - sinPhi * ry * cosT2;
    const dy2b = -sinPhi * rx * sinT2 + cosPhi * ry * cosT2;

    const subCx1 = startX + alpha * dx1;
    const subCy1 = startY + alpha * dy1;
    const subCx2 = endX - alpha * dx2b;
    const subCy2 = endY - alpha * dy2b;

    beziers.push({
      x1: startX,
      y1: startY,
      cx1: subCx1,
      cy1: subCy1,
      cx2: subCx2,
      cy2: subCy2,
      x2: endX,
      y2: endY,
    });

    currentTheta = nextTheta;
    startX = endX;
    startY = endY;
  }

  return beziers;
}

/**
 * Parses an SVG path data string into an array of measurable geometric segments.
 */
export function parseSvgPath(d: string): ParsedPath {
  const tokens = tokenizeSvgPath(d);
  const segments: PathSegment[] = [];

  let curX = 0;
  let curY = 0;
  let subStartX = 0;
  let subStartY = 0;
  let prevCubicCx = 0;
  let prevCubicCy = 0;
  let prevQuadCx = 0;
  let prevQuadCy = 0;
  let prevCmd = '';
  let isClosed = false;

  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  function updateBounds(x: number, y: number) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }

  let totalCumulative = 0;

  function pushSegment(seg: Omit<PathSegment, 'cumulativeLength'>) {
    totalCumulative += seg.length;
    const segment: PathSegment = {
      ...seg,
      cumulativeLength: totalCumulative,
    };
    segments.push(segment);

    updateBounds(seg.x1, seg.y1);
    updateBounds(seg.x2, seg.y2);
    if (seg.cx !== undefined && seg.cy !== undefined) {
      updateBounds(seg.cx, seg.cy);
    }
    if (seg.cx1 !== undefined && seg.cy1 !== undefined) {
      updateBounds(seg.cx1, seg.cy1);
    }
    if (seg.cx2 !== undefined && seg.cy2 !== undefined) {
      updateBounds(seg.cx2, seg.cy2);
    }
  }

  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];
    const cmd = typeof token === 'string' ? token : prevCmd;

    if (typeof token === 'string') {
      i++;
    }

    switch (cmd) {
      case 'M':
      case 'm': {
        const isRel = cmd === 'm';
        const x = isRel ? curX + (tokens[i] as number) : (tokens[i] as number);
        const y = isRel ? curY + (tokens[i + 1] as number) : (tokens[i + 1] as number);
        i += 2;
        curX = x;
        curY = y;
        subStartX = x;
        subStartY = y;
        updateBounds(curX, curY);

        // Implicit subsequent line commands
        while (i < tokens.length && typeof tokens[i] === 'number') {
          const nextX = isRel ? curX + (tokens[i] as number) : (tokens[i] as number);
          const nextY = isRel ? curY + (tokens[i + 1] as number) : (tokens[i + 1] as number);
          i += 2;
          const len = lineLength(curX, curY, nextX, nextY);
          pushSegment({ type: 'line', x1: curX, y1: curY, x2: nextX, y2: nextY, length: len });
          curX = nextX;
          curY = nextY;
        }
        prevCmd = isRel ? 'l' : 'L';
        break;
      }

      case 'L':
      case 'l': {
        const isRel = cmd === 'l';
        while (i < tokens.length && typeof tokens[i] === 'number') {
          const x = isRel ? curX + (tokens[i] as number) : (tokens[i] as number);
          const y = isRel ? curY + (tokens[i + 1] as number) : (tokens[i + 1] as number);
          i += 2;
          const len = lineLength(curX, curY, x, y);
          pushSegment({ type: 'line', x1: curX, y1: curY, x2: x, y2: y, length: len });
          curX = x;
          curY = y;
        }
        prevCmd = cmd;
        break;
      }

      case 'H':
      case 'h': {
        const isRel = cmd === 'h';
        while (i < tokens.length && typeof tokens[i] === 'number') {
          const x = isRel ? curX + (tokens[i] as number) : (tokens[i] as number);
          i += 1;
          const len = lineLength(curX, curY, x, curY);
          pushSegment({ type: 'line', x1: curX, y1: curY, x2: x, y2: curY, length: len });
          curX = x;
        }
        prevCmd = cmd;
        break;
      }

      case 'V':
      case 'v': {
        const isRel = cmd === 'v';
        while (i < tokens.length && typeof tokens[i] === 'number') {
          const y = isRel ? curY + (tokens[i] as number) : (tokens[i] as number);
          i += 1;
          const len = lineLength(curX, curY, curX, y);
          pushSegment({ type: 'line', x1: curX, y1: curY, x2: curX, y2: y, length: len });
          curY = y;
        }
        prevCmd = cmd;
        break;
      }

      case 'C':
      case 'c': {
        const isRel = cmd === 'c';
        while (i < tokens.length && typeof tokens[i] === 'number') {
          const cx1 = isRel ? curX + (tokens[i] as number) : (tokens[i] as number);
          const cy1 = isRel ? curY + (tokens[i + 1] as number) : (tokens[i + 1] as number);
          const cx2 = isRel ? curX + (tokens[i + 2] as number) : (tokens[i + 2] as number);
          const cy2 = isRel ? curY + (tokens[i + 3] as number) : (tokens[i + 3] as number);
          const x = isRel ? curX + (tokens[i + 4] as number) : (tokens[i + 4] as number);
          const y = isRel ? curY + (tokens[i + 5] as number) : (tokens[i + 5] as number);
          i += 6;

          const len = cubicBezierLength(curX, curY, cx1, cy1, cx2, cy2, x, y);
          pushSegment({
            type: 'cubic',
            x1: curX,
            y1: curY,
            cx1,
            cy1,
            cx2,
            cy2,
            x2: x,
            y2: y,
            length: len,
          });

          prevCubicCx = cx2;
          prevCubicCy = cy2;
          curX = x;
          curY = y;
        }
        prevCmd = cmd;
        break;
      }

      case 'S':
      case 's': {
        const isRel = cmd === 's';
        while (i < tokens.length && typeof tokens[i] === 'number') {
          const cx2 = isRel ? curX + (tokens[i] as number) : (tokens[i] as number);
          const cy2 = isRel ? curY + (tokens[i + 1] as number) : (tokens[i + 1] as number);
          const x = isRel ? curX + (tokens[i + 2] as number) : (tokens[i + 2] as number);
          const y = isRel ? curY + (tokens[i + 3] as number) : (tokens[i + 3] as number);
          i += 4;

          const isPrevCubic = prevCmd === 'C' || prevCmd === 'c' || prevCmd === 'S' || prevCmd === 's';
          const cx1 = isPrevCubic ? 2 * curX - prevCubicCx : curX;
          const cy1 = isPrevCubic ? 2 * curY - prevCubicCy : curY;

          const len = cubicBezierLength(curX, curY, cx1, cy1, cx2, cy2, x, y);
          pushSegment({
            type: 'cubic',
            x1: curX,
            y1: curY,
            cx1,
            cy1,
            cx2,
            cy2,
            x2: x,
            y2: y,
            length: len,
          });

          prevCubicCx = cx2;
          prevCubicCy = cy2;
          curX = x;
          curY = y;
        }
        prevCmd = cmd;
        break;
      }

      case 'Q':
      case 'q': {
        const isRel = cmd === 'q';
        while (i < tokens.length && typeof tokens[i] === 'number') {
          const cx = isRel ? curX + (tokens[i] as number) : (tokens[i] as number);
          const cy = isRel ? curY + (tokens[i + 1] as number) : (tokens[i + 1] as number);
          const x = isRel ? curX + (tokens[i + 2] as number) : (tokens[i + 2] as number);
          const y = isRel ? curY + (tokens[i + 3] as number) : (tokens[i + 3] as number);
          i += 4;

          const len = quadraticBezierLength(curX, curY, cx, cy, x, y);
          pushSegment({
            type: 'quadratic',
            x1: curX,
            y1: curY,
            cx,
            cy,
            x2: x,
            y2: y,
            length: len,
          });

          prevQuadCx = cx;
          prevQuadCy = cy;
          curX = x;
          curY = y;
        }
        prevCmd = cmd;
        break;
      }

      case 'T':
      case 't': {
        const isRel = cmd === 't';
        while (i < tokens.length && typeof tokens[i] === 'number') {
          const x = isRel ? curX + (tokens[i] as number) : (tokens[i] as number);
          const y = isRel ? curY + (tokens[i + 1] as number) : (tokens[i + 1] as number);
          i += 2;

          const isPrevQuad = prevCmd === 'Q' || prevCmd === 'q' || prevCmd === 'T' || prevCmd === 't';
          const cx = isPrevQuad ? 2 * curX - prevQuadCx : curX;
          const cy = isPrevQuad ? 2 * curY - prevQuadCy : curY;

          const len = quadraticBezierLength(curX, curY, cx, cy, x, y);
          pushSegment({
            type: 'quadratic',
            x1: curX,
            y1: curY,
            cx,
            cy,
            x2: x,
            y2: y,
            length: len,
          });

          prevQuadCx = cx;
          prevQuadCy = cy;
          curX = x;
          curY = y;
        }
        prevCmd = cmd;
        break;
      }

      case 'A':
      case 'a': {
        const isRel = cmd === 'a';
        while (i < tokens.length && typeof tokens[i] === 'number') {
          const rx = tokens[i] as number;
          const ry = tokens[i + 1] as number;
          const rot = tokens[i + 2] as number;
          const largeArc = tokens[i + 3] as number;
          const sweep = tokens[i + 4] as number;
          const x = isRel ? curX + (tokens[i + 5] as number) : (tokens[i + 5] as number);
          const y = isRel ? curY + (tokens[i + 6] as number) : (tokens[i + 6] as number);
          i += 7;

          const beziers = arcToCubicBeziers(curX, curY, rx, ry, rot, largeArc, sweep, x, y);
          for (const b of beziers) {
            const len = cubicBezierLength(b.x1, b.y1, b.cx1, b.cy1, b.cx2, b.cy2, b.x2, b.y2);
            pushSegment({
              type: 'cubic',
              x1: b.x1,
              y1: b.y1,
              cx1: b.cx1,
              cy1: b.cy1,
              cx2: b.cx2,
              cy2: b.cy2,
              x2: b.x2,
              y2: b.y2,
              length: len,
            });
            prevCubicCx = b.cx2;
            prevCubicCy = b.cy2;
          }

          curX = x;
          curY = y;
        }
        prevCmd = cmd;
        break;
      }

      case 'Z':
      case 'z': {
        isClosed = true;
        if (curX !== subStartX || curY !== subStartY) {
          const len = lineLength(curX, curY, subStartX, subStartY);
          pushSegment({
            type: 'line',
            x1: curX,
            y1: curY,
            x2: subStartX,
            y2: subStartY,
            length: len,
          });
          curX = subStartX;
          curY = subStartY;
        }
        prevCmd = cmd;
        break;
      }

      default:
        // Ignore unhandled characters or advance
        i++;
        break;
    }
  }

  // Fallback boundaries if path was empty or zero-point
  if (!Number.isFinite(minX)) {
    minX = 0;
    minY = 0;
    maxX = 100;
    maxY = 100;
  }

  return {
    d,
    segments,
    totalLength: totalCumulative,
    isClosed: isClosed || /z/i.test(d),
    minX,
    minY,
    maxX,
    maxY,
  };
}

/**
 * Samples position (x, y) and tangent angle along the parsed path at distance.
 */
export function getPointAlongPath(
  segments: PathSegment[],
  totalLength: number,
  distance: number
): PathPoint {
  if (segments.length === 0 || totalLength <= 0) {
    return { x: 0, y: 0, angle: 0, distance: 0, progress: 0 };
  }

  const targetDist = clamp(distance, 0, totalLength);
  const progress = totalLength > 0 ? targetDist / totalLength : 0;

  // Find segment containing targetDist
  let targetSeg: PathSegment = segments[segments.length - 1];
  for (let s = 0; s < segments.length; s++) {
    if (targetDist <= segments[s].cumulativeLength || s === segments.length - 1) {
      targetSeg = segments[s];
      break;
    }
  }

  const segStartDist = targetSeg.cumulativeLength - targetSeg.length;
  const localDist = targetDist - segStartDist;
  const u = targetSeg.length > 0 ? clamp(localDist / targetSeg.length, 0, 1) : 0;

  let x = targetSeg.x1;
  let y = targetSeg.y1;
  let dx = 1;
  let dy = 0;

  if (targetSeg.type === 'line') {
    x = targetSeg.x1 + u * (targetSeg.x2 - targetSeg.x1);
    y = targetSeg.y1 + u * (targetSeg.y2 - targetSeg.y1);
    dx = targetSeg.x2 - targetSeg.x1;
    dy = targetSeg.y2 - targetSeg.y1;
  } else if (targetSeg.type === 'quadratic') {
    const cx = targetSeg.cx ?? (targetSeg.x1 + targetSeg.x2) / 2;
    const cy = targetSeg.cy ?? (targetSeg.y1 + targetSeg.y2) / 2;
    const inv = 1 - u;

    x = inv * inv * targetSeg.x1 + 2 * inv * u * cx + u * u * targetSeg.x2;
    y = inv * inv * targetSeg.y1 + 2 * inv * u * cy + u * u * targetSeg.y2;
    dx = 2 * inv * (cx - targetSeg.x1) + 2 * u * (targetSeg.x2 - cx);
    dy = 2 * inv * (cy - targetSeg.y1) + 2 * u * (targetSeg.y2 - cy);
  } else if (targetSeg.type === 'cubic') {
    const cx1 = targetSeg.cx1 ?? targetSeg.x1;
    const cy1 = targetSeg.cy1 ?? targetSeg.y1;
    const cx2 = targetSeg.cx2 ?? targetSeg.x2;
    const cy2 = targetSeg.cy2 ?? targetSeg.y2;
    const inv = 1 - u;

    x =
      inv * inv * inv * targetSeg.x1 +
      3 * inv * inv * u * cx1 +
      3 * inv * u * u * cx2 +
      u * u * u * targetSeg.x2;
    y =
      inv * inv * inv * targetSeg.y1 +
      3 * inv * inv * u * cy1 +
      3 * inv * u * u * cy2 +
      u * u * u * targetSeg.y2;
    dx =
      3 * inv * inv * (cx1 - targetSeg.x1) +
      6 * inv * u * (cx2 - cx1) +
      3 * u * u * (targetSeg.x2 - cx2);
    dy =
      3 * inv * inv * (cy1 - targetSeg.y1) +
      6 * inv * u * (cy2 - cy1) +
      3 * u * u * (targetSeg.y2 - cy2);
  }

  // Handle zero derivatives
  if (dx === 0 && dy === 0) {
    dx = targetSeg.x2 - targetSeg.x1 || 1;
    dy = targetSeg.y2 - targetSeg.y1 || 0;
  }

  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

  return {
    x,
    y,
    angle,
    distance: targetDist,
    progress,
  };
}

/**
 * Calculates SVG bounding box and viewport parameters.
 */
export function calculatePathBoundingBox(params: {
  parsed: ParsedPath;
  strokeWidth?: number;
  width?: number | string;
  height?: number | string;
  viewBox?: string;
  padding?: number;
}): PathBoundingBox {
  const { parsed, strokeWidth = 2, viewBox: customViewBox, padding = 4 } = params;

  if (customViewBox) {
    const parts = customViewBox
      .trim()
      .split(/[\s,]+/)
      .map((val) => parseFloat(val))
      .filter((n) => !Number.isNaN(n));
    if (parts.length === 4) {
      return {
        minX: parts[0],
        minY: parts[1],
        maxX: parts[0] + parts[2],
        maxY: parts[1] + parts[3],
        boxWidth: Math.max(1, parts[2]),
        boxHeight: Math.max(1, parts[3]),
        viewBox: customViewBox,
      };
    }
  }

  const extraPadding = Math.ceil(strokeWidth / 2) + padding;
  const minX = Math.floor(parsed.minX - extraPadding);
  const minY = Math.floor(parsed.minY - extraPadding);
  const maxX = Math.ceil(parsed.maxX + extraPadding);
  const maxY = Math.ceil(parsed.maxY + extraPadding);

  const boxWidth = Math.max(maxX - minX, 1);
  const boxHeight = Math.max(maxY - minY, 1);

  return {
    minX,
    minY,
    maxX,
    maxY,
    boxWidth,
    boxHeight,
    viewBox: `${minX} ${minY} ${boxWidth} ${boxHeight}`,
  };
}

/**
 * Normalizes props into a structured PathAnimationConfig.
 */
export function resolvePathAnimationConfig(props: Partial<AnimatedPathProps>): PathAnimationConfig {
  if (props.animate === false) {
    return { type: 'none' };
  }

  if (typeof props.animation === 'object' && props.animation !== null) {
    return {
      type: props.animation.type ?? 'draw-in',
      delay: props.animation.delay ?? props.delay ?? 0,
      duration: props.animation.duration ?? props.durationInFrames ?? 30,
      easing: props.animation.easing ?? props.easing,
      springPreset: props.animation.springPreset ?? props.springPreset,
      from: props.animation.from ?? props.from,
      to: props.animation.to ?? props.to,
      loop: props.animation.loop ?? false,
    };
  }

  const animType: PathAnimation =
    (typeof props.animation === 'string' ? props.animation : undefined) ?? 'draw-in';

  return {
    type: animType,
    delay: props.delay ?? 0,
    duration: props.durationInFrames ?? 30,
    easing: props.easing,
    springPreset: props.springPreset,
    from: props.from,
    to: props.to,
  };
}

/**
 * Computes frame-accurate motion kinetics for SVG stroke drawing, reveals, and follower movement.
 */
export function calculatePathMotion(params: {
  currentFrame: number;
  fps: number;
  totalLength: number;
  segments: PathSegment[];
  strokeWidth: number;
  userDasharray?: string | number;
  userDashoffset?: number;
  baseFillOpacity?: number;
  baseStrokeOpacity?: number;
  baseOpacity?: number;
  baseRotation?: number;
  baseX?: number;
  baseY?: number;
  baseScale?: number;
  baseScaleX?: number;
  baseScaleY?: number;
  config: PathAnimationConfig;
  fillRevealTiming?: PathFillRevealTiming;
  fillDelay?: number;
  fillDurationInFrames?: number;
  showFollower?: boolean;
  followerConfig?: PathFollowerConfig;
  followerProgressOverride?: number;
  exitFrame?: number;
  exitDurationInFrames?: number;
  exitAnimation?: 'fade-out' | 'scale-out' | 'draw-out';
}): PathMotionState {
  const {
    currentFrame,
    fps,
    totalLength,
    segments,
    strokeWidth,
    userDasharray,
    userDashoffset,
    baseFillOpacity = 1,
    baseStrokeOpacity = 1,
    baseOpacity = 1,
    baseRotation = 0,
    baseX = 0,
    baseY = 0,
    baseScale = 1,
    baseScaleX = 1,
    baseScaleY = 1,
    config,
    fillRevealTiming = 'with-draw',
    fillDelay = 0,
    fillDurationInFrames = 20,
    showFollower = false,
    followerConfig,
    followerProgressOverride,
    exitFrame,
    exitDurationInFrames = 12,
    exitAnimation = 'fade-out',
  } = params;

  const animType = config.type ?? 'draw-in';
  const delay = Math.max(0, config.delay ?? 0);
  const duration = Math.max(1, config.duration ?? 30);
  const isLoop = config.loop ?? false;

  // 1. Calculate Primary Progress (0 to 1)
  let rawProgress = 0;
  if (animType === 'none') {
    rawProgress = 1;
  } else if (currentFrame < delay) {
    rawProgress = 0;
  } else if (isLoop) {
    const elapsed = (currentFrame - delay) % duration;
    rawProgress = elapsed / duration;
  } else {
    rawProgress = clamp((currentFrame - delay) / duration, 0, 1);
  }

  // 2. Apply Easing / Spring physics
  let easedProgress = rawProgress;
  if (animType !== 'none') {
    if (config.springPreset) {
      const spring = createSpring({
        frame: Math.max(0, currentFrame - delay),
        fps,
        preset: config.springPreset,
      });
      easedProgress = spring;
    } else if (config.easing) {
      const easeFn = resolveEasing(config.easing) ?? easeOutCubic;
      easedProgress = easeFn(rawProgress);
    } else {
      easedProgress = easeOutCubic(rawProgress);
    }
  }

  // 3. Initialize State Variables
  let strokeProgress = 1;
  let opacity = baseOpacity;
  const strokeOpacity = baseStrokeOpacity;
  let fillProgress = 1;
  const translateX = baseX;
  const translateY = baseY;
  let rotation = baseRotation;
  let scaleX = baseScale * baseScaleX;
  let scaleY = baseScale * baseScaleY;
  let effectiveStrokeWidth = strokeWidth;
  let strokeDasharray: string | number | undefined = userDasharray;
  let strokeDashoffset: number | undefined = userDashoffset;

  // 4. Branch by Animation Type
  switch (animType) {
    case 'none':
      strokeProgress = 1;
      strokeDasharray = userDasharray;
      strokeDashoffset = userDashoffset;
      break;

    case 'draw-in':
    case 'progressive-reveal': {
      strokeProgress = clamp(easedProgress, 0, 1);
      strokeDasharray = `${totalLength} ${totalLength}`;
      const rawOffset = (1 - strokeProgress) * totalLength;
      strokeDashoffset = Math.abs(rawOffset) < 1e-6 ? 0 : rawOffset;
      break;
    }

    case 'draw-out': {
      strokeProgress = clamp(easedProgress, 0, 1);
      strokeDasharray = `${totalLength} ${totalLength}`;
      const rawOffset = strokeProgress * totalLength;
      strokeDashoffset = Math.abs(rawOffset) < 1e-6 ? 0 : rawOffset;
      break;
    }

    case 'reverse-draw': {
      strokeProgress = clamp(easedProgress, 0, 1);
      strokeDasharray = `${totalLength} ${totalLength}`;
      const rawOffset = (1 - strokeProgress) * -totalLength;
      strokeDashoffset = Math.abs(rawOffset) < 1e-6 ? 0 : rawOffset;
      break;
    }

    case 'fade-in': {
      strokeProgress = 1;
      opacity = clamp(easedProgress, 0, 1) * baseOpacity;
      break;
    }

    case 'fade-out': {
      strokeProgress = 1;
      opacity = (1 - clamp(easedProgress, 0, 1)) * baseOpacity;
      break;
    }

    case 'scale-in': {
      const fromVal = config.from ?? 0;
      const toVal = config.to ?? 1;
      const s = fromVal + easedProgress * (toVal - fromVal);
      scaleX *= s;
      scaleY *= s;
      break;
    }

    case 'scale-out': {
      const fromVal = config.from ?? 1;
      const toVal = config.to ?? 0;
      const s = fromVal + easedProgress * (toVal - fromVal);
      scaleX *= s;
      scaleY *= s;
      break;
    }

    case 'rotate': {
      const fromAngle = config.from ?? 0;
      const toAngle = config.to ?? 360;
      rotation = baseRotation + fromAngle + easedProgress * (toAngle - fromAngle);
      break;
    }

    case 'stroke-width': {
      const fromWidth = config.from ?? 0;
      const toWidth = config.to ?? strokeWidth;
      effectiveStrokeWidth = Math.max(0, fromWidth + easedProgress * (toWidth - fromWidth));
      break;
    }

    case 'fill-reveal': {
      strokeProgress = 1;
      fillProgress = clamp(easedProgress, 0, 1);
      break;
    }

    case 'motion-along-path': {
      strokeProgress = 1;
      break;
    }
  }

  // 5. Fill Reveal Sequencing
  if (animType === 'fill-reveal') {
    // Already set in switch
  } else if (fillRevealTiming === 'after-draw' && (animType === 'draw-in' || animType === 'reverse-draw')) {
    const drawEndFrame = delay + duration;
    if (currentFrame < drawEndFrame) {
      fillProgress = 0;
    } else {
      const fillDuration = Math.max(1, fillDurationInFrames);
      const fillRaw = clamp((currentFrame - drawEndFrame) / fillDuration, 0, 1);
      fillProgress = easeOutCubic(fillRaw);
    }
  } else if (fillRevealTiming === 'with-draw' && (animType === 'draw-in' || animType === 'reverse-draw')) {
    fillProgress = strokeProgress;
  } else if (fillRevealTiming === 'independent') {
    const fDelay = Math.max(0, fillDelay);
    const fDur = Math.max(1, fillDurationInFrames);
    if (currentFrame < fDelay) {
      fillProgress = 0;
    } else {
      const fRaw = clamp((currentFrame - fDelay) / fDur, 0, 1);
      fillProgress = easeOutCubic(fRaw);
    }
  } else {
    fillProgress = 1;
  }

  const effectiveFillOpacity = fillProgress * baseFillOpacity;

  // 6. Follower Kinetics & Point Sampling
  let followerPoint: PathPoint | undefined;
  let followerProgress = 0;

  const isFollowerActive = showFollower || (followerConfig?.enabled ?? false) || animType === 'motion-along-path';

  if (isFollowerActive) {
    if (followerProgressOverride !== undefined) {
      followerProgress = clamp(followerProgressOverride, 0, 1);
    } else if (animType === 'motion-along-path') {
      followerProgress = clamp(easedProgress, 0, 1);
    } else if (followerConfig?.duration !== undefined || followerConfig?.delay !== undefined) {
      const fDelay = followerConfig?.delay ?? 0;
      const fDur = Math.max(1, followerConfig?.duration ?? duration);
      const fLoop = followerConfig?.loop ?? false;

      let fRaw = 0;
      if (currentFrame < fDelay) {
        fRaw = 0;
      } else if (fLoop) {
        fRaw = ((currentFrame - fDelay) % fDur) / fDur;
      } else {
        fRaw = clamp((currentFrame - fDelay) / fDur, 0, 1);
      }

      if (followerConfig?.easing) {
        const easeFn = resolveEasing(followerConfig.easing) ?? easeOutCubic;
        followerProgress = easeFn(fRaw);
      } else {
        followerProgress = fRaw;
      }
    } else {
      // Follow stroke drawing tip by default
      followerProgress = strokeProgress;
    }

    const dist = followerProgress * totalLength;
    const sampled = getPointAlongPath(segments, totalLength, dist);
    const offsetAngle = followerConfig?.offsetAngle ?? 0;

    followerPoint = {
      ...sampled,
      angle: sampled.angle + offsetAngle,
    };
  }

  // 7. Exit Animations
  let hasExited = false;
  if (exitFrame !== undefined && currentFrame >= exitFrame) {
    const exitElapsed = currentFrame - exitFrame;
    const exitDuration = Math.max(1, exitDurationInFrames);
    const exitProgress = clamp(exitElapsed / exitDuration, 0, 1);

    if (exitAnimation === 'fade-out') {
      opacity *= 1 - exitProgress;
    } else if (exitAnimation === 'scale-out') {
      const s = 1 - exitProgress;
      scaleX *= s;
      scaleY *= s;
    } else if (exitAnimation === 'draw-out') {
      strokeDasharray = `${totalLength} ${totalLength}`;
      strokeDashoffset = exitProgress * totalLength;
    }

    if (exitProgress >= 1) {
      hasExited = true;
      opacity = 0;
    }
  }

  const isAnimating =
    animType !== 'none' &&
    (currentFrame >= delay && (isLoop || currentFrame <= delay + duration));

  return {
    progress: easedProgress,
    strokeProgress,
    fillProgress,
    followerProgress,
    opacity,
    fillOpacity: effectiveFillOpacity,
    strokeOpacity,
    translateX,
    translateY,
    rotation,
    scaleX,
    scaleY,
    effectiveStrokeWidth,
    strokeDasharray,
    strokeDashoffset,
    pathLength: totalLength,
    isAnimating,
    hasExited,
    followerPoint,
  };
}
