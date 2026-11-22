/**
 * GlitchTransition Component
 *
 * Deterministic digital glitch transition for Remotion motion graphics.
 * Supports horizontal slice tearing, RGB chromatic aberration separation,
 * vertical jitter, digital noise blocks, CRT scanlines, and strobe flicker.
 *
 * Layer 2 of the Motion Graphics Framework.
 */

import React, { useMemo } from 'react';
import { useCurrentFrame } from 'remotion';
import type { GlitchTransitionProps } from './types';
import { calculateGlitchMetrics, hashSeed } from './glitchTransitionStyle';

export const GlitchTransition: React.FC<GlitchTransitionProps> = (props) => {
  const {
    children,
    fromContent,
    outgoingContent,
    toContent,
    incomingContent,
    mode = 'in',
    intensity = 1.0,
    frequency = 0.6,
    duration = 30,
    durationInFrames,
    delay = 0,
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
    width = '100%',
    height = '100%',
    style,
    className,
  } = props;

  const frame = useCurrentFrame();

  const metrics = useMemo(() => {
    return calculateGlitchMetrics({
      frame,
      mode,
      intensity,
      frequency,
      duration,
      durationInFrames,
      delay,
      sliceCount,
      rgbOffset,
      jitter,
      noise,
      seed,
      pixelSize,
      enableRgbSplit,
      enableSlices,
      enableJitter,
      enableNoise,
      enableFlicker,
      enableScanlines,
      reverse,
    });
  }, [
    frame,
    mode,
    intensity,
    frequency,
    duration,
    durationInFrames,
    delay,
    sliceCount,
    rgbOffset,
    jitter,
    noise,
    seed,
    pixelSize,
    enableRgbSplit,
    enableSlices,
    enableJitter,
    enableNoise,
    enableFlicker,
    enableScanlines,
    reverse,
  ]);

  // Resolve content layers
  const resolvedFrom = fromContent ?? outgoingContent ?? (Array.isArray(children) ? children[0] : null);
  const resolvedTo = toContent ?? incomingContent ?? (Array.isArray(children) ? children[1] : children);

  let activeContent: React.ReactNode = resolvedTo;
  if (mode === 'replace') {
    activeContent = metrics.activeLayer === 'from' ? resolvedFrom : resolvedTo;
  } else if (mode === 'out') {
    activeContent = resolvedFrom ?? children;
  }

  // Deterministic SVG filter IDs based on seed
  const filterSeed = useMemo(() => hashSeed(seed), [seed]);
  const redFilterId = `glitch-red-${filterSeed}`;
  const cyanFilterId = `glitch-cyan-${filterSeed}`;

  // If glitch is completely inactive and settled
  if (!metrics.isGlitchFrame || metrics.envelope <= 0) {
    return (
      <div
        className={className}
        style={{
          width,
          height,
          position: 'relative',
          opacity: metrics.opacity,
          ...style,
        }}
      >
        {activeContent}
      </div>
    );
  }

  // Active Glitch Rendering
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width,
        height,
        overflow: 'hidden',
        opacity: metrics.opacity,
        transform: `translate(${metrics.jitterX}px, ${metrics.jitterY}px)`,
        filter: metrics.flickerBrightness !== 1 ? `brightness(${metrics.flickerBrightness})` : undefined,
        ...style,
      }}
    >
      {/* Hidden SVG Filters for Chromatic Aberration Channel Isolation */}
      {enableRgbSplit && (
        <svg
          style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none', visibility: 'hidden' }}
          aria-hidden="true"
        >
          <defs>
            <filter id={redFilterId} colorInterpolationFilters="sRGB">
              <feColorMatrix
                type="matrix"
                values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              />
            </filter>
            <filter id={cyanFilterId} colorInterpolationFilters="sRGB">
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"
              />
            </filter>
          </defs>
        </svg>
      )}

      {/* Sliced Layer Strips */}
      {metrics.slices.map((slice) => (
        <div
          key={slice.index}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            clipPath: `polygon(0% ${slice.topPercent}%, 100% ${slice.topPercent}%, 100% ${slice.bottomPercent}%, 0% ${slice.bottomPercent}%)`,
            transform: `translate(${slice.displacementX}px, ${slice.displacementY}px)`,
          }}
        >
          {activeContent}
        </div>
      ))}

      {/* Chromatic Aberration: Red / Magenta Channel Layer */}
      {enableRgbSplit && (metrics.rgbOffsetX !== 0 || metrics.rgbOffsetY !== 0) && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            transform: `translate(${metrics.rgbOffsetX}px, ${metrics.rgbOffsetY}px)`,
            mixBlendMode: 'screen',
            opacity: Math.min(0.7, metrics.envelope * 0.65),
            filter: `url(#${redFilterId})`,
            pointerEvents: 'none',
          }}
        >
          {activeContent}
        </div>
      )}

      {/* Chromatic Aberration: Cyan Channel Layer */}
      {enableRgbSplit && (metrics.rgbOffsetX !== 0 || metrics.rgbOffsetY !== 0) && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            transform: `translate(${-metrics.rgbOffsetX}px, ${-metrics.rgbOffsetY}px)`,
            mixBlendMode: 'screen',
            opacity: Math.min(0.7, metrics.envelope * 0.65),
            filter: `url(#${cyanFilterId})`,
            pointerEvents: 'none',
          }}
        >
          {activeContent}
        </div>
      )}

      {/* Digital Noise Blocks */}
      {enableNoise &&
        metrics.noiseBlocks.map((block) => (
          <div
            key={block.id}
            style={{
              position: 'absolute',
              left: `${block.x}%`,
              top: `${block.y}%`,
              width: block.width,
              height: block.height,
              backgroundColor: block.color,
              opacity: block.opacity,
              pointerEvents: 'none',
              mixBlendMode: 'overlay',
            }}
          />
        ))}

      {/* CRT Scanlines Overlay */}
      {enableScanlines && metrics.scanlineOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(0,0,0,0.3) 0px, rgba(0,0,0,0.3) 1px, transparent 1px, transparent 2px)',
            opacity: metrics.scanlineOpacity,
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
};
