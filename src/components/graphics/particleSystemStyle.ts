/**
 * ParticleSystem Style & Mathematical Engine
 * Pure mathematical functions for seeded PRNG, deterministic particle generation,
 * spatial distributions, and frame-accurate motion kinetics (float, rise, fall, burst, vortex).
 * Layer 2 of the Motion Graphics Framework.
 */

import type {
  ParticleBounds,
  ParticleDefinition,
  ParticleLiveState,
  ParticleMotionMode,
  ParticleOrigin,
  ParticleShape,
  ParticleSystemConfig,
} from './types.ts';
import { clamp } from '../../utils/animation/clamp.ts';

/**
 * 32-bit FNV-1a hash function for strings and numbers.
 */
export function hashSeed(seed: string | number): number {
  if (typeof seed === 'number') {
    return (seed | 0) || 1;
  }
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 16777619) >>> 0;
  }
  return h || 1;
}

export interface SeededPrng {
  next(): number;
  range(min: number, max: number): number;
  choice<T>(items: readonly T[]): T;
}

/**
 * Creates a deterministic Mulberry32 pseudo-random number generator.
 */
export function createPrng(seed: string | number): SeededPrng {
  let s = hashSeed(seed);

  return {
    next(): number {
      s |= 0;
      s = (s + 0x6d2b79f5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    },
    range(min: number, max: number): number {
      return min + this.next() * (max - min);
    },
    choice<T>(items: readonly T[]): T {
      if (items.length === 0) {
        throw new Error('Cannot choose from empty array');
      }
      const idx = Math.floor(this.next() * items.length);
      return items[Math.min(idx, items.length - 1)];
    },
  };
}

/**
 * Normalizes a number or tuple into a [min, max] range.
 */
export function resolveRange(
  val: number | [number, number] | undefined,
  defaultRange: [number, number]
): [number, number] {
  if (val === undefined) return defaultRange;
  if (Array.isArray(val)) return [val[0], val[1]];
  return [val, val];
}

/**
 * Resolves color palette from single color or color array.
 */
export function resolveColorPalette(
  color: string | string[] | undefined,
  defaultPalette: string[]
): string[] {
  if (!color) return defaultPalette;
  if (Array.isArray(color)) return color.length > 0 ? color : defaultPalette;
  return [color];
}

const DEFAULT_BOUNDS: ParticleBounds = { width: 400, height: 300 };
const DEFAULT_COLORS = ['#00D1FF', '#276EF1', '#0E8345', '#FFC043', '#ffffff'];

/**
 * Generates an array of deterministic static particle definitions.
 */
export function generateParticles(config: ParticleSystemConfig = {}): ParticleDefinition[] {
  const {
    seed = 42,
    particleCount = 40,
    shape = 'circle',
    distribution = 'random',
    direction = 'up',
    angle: customAngle,
    bounds = DEFAULT_BOUNDS,
    origin,
    size,
    color,
    opacity,
    speed,
    rotationSpeed,
    customPositions,
  } = config;

  const count = Math.max(1, Math.min(particleCount, 500));
  const prng = createPrng(seed);

  const [minSize, maxSize] = resolveRange(size, [3, 8]);
  const [minOpacity, maxOpacity] = resolveRange(opacity, [0.3, 0.9]);
  const [minSpeed, maxSpeed] = resolveRange(speed, [0.8, 1.6]);
  const [minRot, maxRot] = resolveRange(rotationSpeed, [-2, 2]);

  const palette = resolveColorPalette(color, DEFAULT_COLORS);
  const shapes: ParticleShape[] = Array.isArray(shape) ? shape : [shape];

  const width = bounds.width || DEFAULT_BOUNDS.width;
  const height = bounds.height || DEFAULT_BOUNDS.height;
  const center: ParticleOrigin = origin ?? { x: width / 2, y: height / 2 };

  const particles: ParticleDefinition[] = [];

  // Compute grid sizing if needed
  const cols = Math.max(1, Math.ceil(Math.sqrt((count * width) / height)));
  const rows = Math.max(1, Math.ceil(count / cols));
  const cellW = width / cols;
  const cellH = height / rows;

  for (let i = 0; i < count; i++) {
    let x0 = 0;
    let y0 = 0;

    switch (distribution) {
      case 'grid': {
        const c = i % cols;
        const r = Math.floor(i / cols) % rows;
        const jitterX = prng.range(-cellW * 0.25, cellW * 0.25);
        const jitterY = prng.range(-cellH * 0.25, cellH * 0.25);
        x0 = (c + 0.5) * cellW + jitterX;
        y0 = (r + 0.5) * cellH + jitterY;
        break;
      }

      case 'radial': {
        const radAngle = prng.range(0, Math.PI * 2);
        const maxRadius = Math.min(width, height) * 0.45;
        const dist = prng.range(10, maxRadius);
        x0 = center.x + Math.cos(radAngle) * dist;
        y0 = center.y + Math.sin(radAngle) * dist;
        break;
      }

      case 'circular': {
        const circAngle = (i / count) * Math.PI * 2 + prng.range(-0.1, 0.1);
        const maxR = Math.min(width, height) * 0.4;
        const r = maxR * Math.sqrt(prng.next()); // uniform disk
        x0 = center.x + Math.cos(circAngle) * r;
        y0 = center.y + Math.sin(circAngle) * r;
        break;
      }

      case 'custom': {
        if (customPositions && customPositions.length > 0) {
          const pt = customPositions[i % customPositions.length];
          x0 = pt.x + prng.range(-4, 4);
          y0 = pt.y + prng.range(-4, 4);
        } else {
          x0 = prng.range(0, width);
          y0 = prng.range(0, height);
        }
        break;
      }

      case 'random':
      default: {
        x0 = prng.range(0, width);
        y0 = prng.range(0, height);
        break;
      }
    }

    // Determine particle motion angle
    let particleAngle = 0;
    if (customAngle !== undefined) {
      particleAngle = customAngle;
    } else {
      switch (direction) {
        case 'up':
          particleAngle = -90 + prng.range(-15, 15);
          break;
        case 'down':
          particleAngle = 90 + prng.range(-15, 15);
          break;
        case 'left':
          particleAngle = 180 + prng.range(-15, 15);
          break;
        case 'right':
          particleAngle = 0 + prng.range(-15, 15);
          break;
        case 'radial':
          particleAngle = (Math.atan2(y0 - center.y, x0 - center.x) * 180) / Math.PI;
          break;
        case 'drift':
          particleAngle = -45 + prng.range(-20, 20);
          break;
        case 'omni':
        default:
          particleAngle = prng.range(0, 360);
          break;
      }
    }

    particles.push({
      id: i,
      initialX: x0,
      initialY: y0,
      size: prng.range(minSize, maxSize),
      color: prng.choice(palette),
      baseOpacity: prng.range(minOpacity, maxOpacity),
      shape: prng.choice(shapes),
      angle: particleAngle,
      speed: prng.range(minSpeed, maxSpeed),
      rotationSpeed: prng.range(minRot, maxRot),
      phase: prng.range(0, Math.PI * 2),
      wobbleSpeed: prng.range(0.04, 0.1),
      wobbleAmp: prng.range(6, 16),
      lifeOffset: i / count,
    });
  }

  return particles;
}

/**
 * Calculates instantaneous state for all particles at currentFrame.
 */
export function calculateParticleStates(params: {
  particles: ParticleDefinition[];
  currentFrame: number;
  config: ParticleSystemConfig;
  exitFrame?: number;
  exitDurationInFrames?: number;
  exitAnimation?: 'fade-out' | 'scale-out';
}): ParticleLiveState[] {
  const {
    particles,
    currentFrame,
    config,
    exitFrame,
    exitDurationInFrames = 15,
    exitAnimation = 'fade-out',
  } = params;

  const delay = Math.max(0, config.delay ?? 0);
  const duration = Math.max(1, config.durationInFrames ?? 60);
  const loop = config.loop ?? true;
  const motionMode: ParticleMotionMode = config.motionMode ?? 'float';
  const bounds = config.bounds ?? DEFAULT_BOUNDS;
  const width = bounds.width || DEFAULT_BOUNDS.width;
  const height = bounds.height || DEFAULT_BOUNDS.height;
  const origin: ParticleOrigin = config.origin ?? { x: width / 2, y: height / 2 };

  const scaleVariation = config.scaleVariation ?? true;
  const fadeInOut = config.fadeInOut ?? true;

  const f = Math.max(0, currentFrame - delay);

  // Exit transition progress
  let globalExitOpacity = 1;
  let globalExitScale = 1;
  if (exitFrame !== undefined && currentFrame >= exitFrame) {
    const exitElapsed = currentFrame - exitFrame;
    const exitProgress = clamp(exitElapsed / Math.max(1, exitDurationInFrames), 0, 1);
    if (exitAnimation === 'fade-out') {
      globalExitOpacity = 1 - exitProgress;
    } else if (exitAnimation === 'scale-out') {
      globalExitScale = 1 - exitProgress;
    }
  }

  return particles.map((p) => {
    // 1. Compute lifecycle normalized progress u in [0, 1]
    let u = 0;
    let tCycle = f;

    if (loop) {
      u = ((f / duration) + p.lifeOffset) % 1.0;
      tCycle = u * duration;
    } else {
      u = clamp(f / duration, 0, 1);
      tCycle = f;
    }

    // 2. Compute motion displacement
    let dx = 0;
    let dy = 0;

    switch (motionMode) {
      case 'float': {
        // Gentle organic floating drift with harmonic sway
        const wobble = Math.sin(tCycle * p.wobbleSpeed + p.phase) * p.wobbleAmp;
        const drift = Math.cos(tCycle * p.wobbleSpeed * 0.7 + p.phase) * (p.wobbleAmp * 0.5);
        dx = wobble;
        dy = drift - tCycle * (p.speed * 0.4);
        break;
      }

      case 'rise': {
        // Continuous upward vertical floating with horizontal sway
        const sway = Math.sin(tCycle * p.wobbleSpeed + p.phase) * p.wobbleAmp;
        dx = sway;
        dy = -tCycle * (p.speed * 2.2);
        break;
      }

      case 'fall': {
        // Continuous downward falling with sway
        const sway = Math.sin(tCycle * p.wobbleSpeed + p.phase) * p.wobbleAmp;
        dx = sway;
        dy = tCycle * (p.speed * 2.2);
        break;
      }

      case 'drift': {
        // Linear directional travel along vector angle
        const rad = (p.angle * Math.PI) / 180;
        const dist = tCycle * (p.speed * 2.0);
        const sway = Math.sin(tCycle * p.wobbleSpeed + p.phase) * (p.wobbleAmp * 0.4);
        dx = Math.cos(rad) * dist + sway;
        dy = Math.sin(rad) * dist + sway;
        break;
      }

      case 'radial-expansion': {
        // Uniform radial outward expansion from initial coordinates
        const rad = (p.angle * Math.PI) / 180;
        const dist = tCycle * (p.speed * 2.5);
        dx = Math.cos(rad) * dist;
        dy = Math.sin(rad) * dist;
        break;
      }

      case 'burst': {
        // Explosive burst with cubic ease-out deceleration
        const eased = 1 - Math.pow(1 - u, 3);
        const burstDist = eased * (p.speed * 120);
        const rad = (p.angle * Math.PI) / 180;
        dx = Math.cos(rad) * burstDist;
        dy = Math.sin(rad) * burstDist;
        break;
      }

      case 'vortex': {
        // Spiral orbital rotation around center origin
        const currentAngle = (p.angle * Math.PI) / 180 + tCycle * 0.04 * p.speed;
        const r = 20 + tCycle * (p.speed * 1.8);
        const spiralX = origin.x + Math.cos(currentAngle) * r;
        const spiralY = origin.y + Math.sin(currentAngle) * r;
        dx = spiralX - p.initialX;
        dy = spiralY - p.initialY;
        break;
      }

      case 'none':
      default:
        dx = 0;
        dy = 0;
        break;
    }

    // 3. Compute final wrapped position
    let finalX = p.initialX + dx;
    let finalY = p.initialY + dy;

    if (loop && motionMode !== 'burst' && motionMode !== 'radial-expansion' && motionMode !== 'vortex') {
      // Seamless wrap-around viewport bounds
      finalX = ((finalX % width) + width) % width;
      finalY = ((finalY % height) + height) % height;
    }

    // 4. Compute rotation
    const rotation = p.phase * (180 / Math.PI) + f * p.rotationSpeed;

    // 5. Compute scale variation
    let scale = 1;
    if (scaleVariation) {
      if (Array.isArray(scaleVariation)) {
        const [minS, maxS] = scaleVariation;
        scale = minS + ((Math.sin(u * Math.PI * 2 + p.phase) + 1) / 2) * (maxS - minS);
      } else {
        scale = 0.75 + 0.25 * Math.sin(u * Math.PI * 2 + p.phase);
      }
    }
    scale *= globalExitScale;

    // 6. Compute opacity with fade-in / fade-out lifecycle envelope
    let opacity = p.baseOpacity;
    if (fadeInOut) {
      const inWindow = 0.15;
      const outWindow = 0.15;
      let envelope = 1;

      if (u < inWindow) {
        envelope = u / inWindow;
      } else if (u > 1 - outWindow) {
        envelope = (1 - u) / outWindow;
      }
      opacity = p.baseOpacity * clamp(envelope, 0, 1);
    }
    opacity *= globalExitOpacity;

    return {
      id: p.id,
      x: finalX,
      y: finalY,
      rotation,
      scale: Math.max(0, scale),
      opacity: clamp(opacity, 0, 1),
      size: p.size,
      color: p.color,
      shape: p.shape,
    };
  });
}
