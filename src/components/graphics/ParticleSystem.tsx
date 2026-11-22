/**
 * ParticleSystem Component
 * Reusable Remotion graphic component providing frame-accurate, deterministic particle simulation
 * supporting seeded generation, diverse geometric shapes (circle, square, ring, star, triangle, cross),
 * rich spatial distributions, and procedural kinetics (float, rise, fall, drift, burst, vortex).
 * Layer 2 of the Motion Graphics Framework.
 */

import React from 'react';
import { useCurrentFrame } from 'remotion';
import type { ParticleLiveState, ParticleSystemProps } from './types.ts';
import { generateParticles, calculateParticleStates } from './particleSystemStyle.ts';

const DEFAULT_BOUNDS = { width: 400, height: 300 };

/**
 * Renders SVG geometry for a given particle state.
 */
function renderParticleShape(p: ParticleLiveState): React.ReactNode {
  const half = p.size / 2;

  switch (p.shape) {
    case 'square':
      return (
        <rect
          x={-half}
          y={-half}
          width={p.size}
          height={p.size}
          rx={1}
          fill={p.color}
        />
      );

    case 'ring':
      return (
        <circle
          r={half}
          fill="none"
          stroke={p.color}
          strokeWidth={Math.max(1, p.size * 0.25)}
        />
      );

    case 'triangle': {
      const topY = -p.size * 0.58;
      const botY = p.size * 0.38;
      const w = p.size * 0.5;
      return (
        <polygon
          points={`0,${topY} ${w},${botY} ${-w},${botY}`}
          fill={p.color}
        />
      );
    }

    case 'star': {
      // 4-point sparkle star
      const rOuter = half * 1.25;
      const rInner = half * 0.35;
      const points = `0,${-rOuter} ${rInner},${-rInner} ${rOuter},0 ${rInner},${rInner} 0,${rOuter} ${-rInner},${rInner} ${-rOuter},0 ${-rInner},${-rInner}`;
      return <polygon points={points} fill={p.color} />;
    }

    case 'cross': {
      const arm = half * 0.85;
      const strokeW = Math.max(1.2, p.size * 0.28);
      return (
        <g stroke={p.color} strokeWidth={strokeW} strokeLinecap="round">
          <line x1={-arm} y1={0} x2={arm} y2={0} />
          <line x1={0} y1={-arm} x2={0} y2={arm} />
        </g>
      );
    }

    case 'circle':
    case 'custom':
    default:
      return <circle r={half} fill={p.color} />;
  }
}

const ParticleSystemBase: React.FC<ParticleSystemProps> = (props) => {
  const {
    seed,
    particleCount,
    shape,
    distribution,
    motionMode,
    direction,
    angle,
    bounds = DEFAULT_BOUNDS,
    origin,
    size,
    color,
    opacity,
    speed,
    rotationSpeed,
    wobble,
    scaleVariation,
    fadeInOut,
    loop,
    delay,
    durationInFrames,
    customPositions,
    animate = true,
    renderParticle,
    exitFrame,
    exitDurationInFrames = 15,
    exitAnimation = 'fade-out',
    style,
    svgStyle,
    className,
    children,
  } = props;

  const currentFrame = useCurrentFrame();

  const width = bounds.width || DEFAULT_BOUNDS.width;
  const height = bounds.height || DEFAULT_BOUNDS.height;

  // Memoize stable serialization keys for array/object parameters to prevent invalidating static particles
  const sizeKey = Array.isArray(size) ? size.join(',') : String(size);
  const colorKey = Array.isArray(color) ? color.join(',') : String(color);
  const shapeKey = Array.isArray(shape) ? shape.join(',') : String(shape);
  const boundsKey = `${width}x${height}`;
  const originKey = origin ? `${origin.x},${origin.y}` : '';
  const customPosKey = customPositions ? customPositions.map((p) => `${p.x},${p.y}`).join('|') : '';

  // 1. Memoize static particle generation per configuration parameters
  const particles = React.useMemo(() => {
    return generateParticles({
      seed,
      particleCount,
      shape,
      distribution,
      direction,
      angle,
      bounds,
      origin,
      size,
      color,
      opacity,
      speed,
      rotationSpeed,
      customPositions,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    seed,
    particleCount,
    shapeKey,
    distribution,
    direction,
    angle,
    boundsKey,
    originKey,
    sizeKey,
    colorKey,
    opacity,
    speed,
    rotationSpeed,
    customPosKey,
  ]);

  // 2. Compute instantaneous frame-accurate positions and transforms
  const liveStates = React.useMemo(() => {
    return calculateParticleStates({
      particles,
      currentFrame: animate ? currentFrame : 0,
      config: {
        motionMode,
        direction,
        angle,
        bounds,
        origin,
        speed,
        rotationSpeed,
        wobble,
        scaleVariation,
        fadeInOut,
        loop,
        delay,
        durationInFrames,
      },
      exitFrame,
      exitDurationInFrames,
      exitAnimation,
    });
  }, [
    particles,
    animate,
    currentFrame,
    motionMode,
    direction,
    angle,
    bounds,
    origin,
    speed,
    rotationSpeed,
    wobble,
    scaleVariation,
    fadeInOut,
    loop,
    delay,
    durationInFrames,
    exitFrame,
    exitDurationInFrames,
    exitAnimation,
  ]);


  return (
    <div
      className={className}
      style={{
        position: 'relative',
        display: 'inline-block',
        width,
        height,
        overflow: 'hidden',
        pointerEvents: 'none',
        ...style,
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          overflow: 'visible',
          ...svgStyle,
        }}
      >
        {liveStates.map((particle, index) => {
          if (particle.opacity <= 0.001 || particle.scale <= 0.001) {
            return null;
          }

          // Cull particles that have drifted beyond visible rendering bounds
          if (
            particle.x < -80 ||
            particle.x > width + 80 ||
            particle.y < -80 ||
            particle.y > height + 80
          ) {
            return null;
          }

          const transform = `translate(${particle.x.toFixed(2)}, ${particle.y.toFixed(2)}) rotate(${particle.rotation.toFixed(1)}) scale(${particle.scale.toFixed(3)})`;

          return (
            <g
              key={particle.id}
              transform={transform}
              opacity={particle.opacity}
            >
              {renderParticle
                ? renderParticle(particle, index)
                : renderParticleShape(particle)}
            </g>
          );
        })}
      </svg>

      {/* Optional overlaid content */}
      {children}
    </div>
  );
};

export const ParticleSystem = React.memo(ParticleSystemBase);
