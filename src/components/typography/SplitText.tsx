/**
 * SplitText Component
 * Advanced Remotion typography component that segments text into lines, words, characters, sentences,
 * or custom defined units and animates each segment independently.
 * Layer 2 of the Motion Graphics Framework.
 */

import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import {
  SplitTextProps,
  SplitTextSegment,
} from './types';
import {
  splitTextIntoSegments,
  calculateSplitTextStyle,
  createDeterministicShuffle,
} from './splitTextStyle';

export {
  splitTextIntoSegments,
  calculateSplitTextStyle,
  createDeterministicShuffle,
};

const SplitTextBase: React.FC<SplitTextProps> = ({
  text,
  segments: customSegments,
  splitBy = 'word',
  variant = 'slide-up',
  startFrame = 0,
  durationInFrames,
  staggerDelay = 2,
  segmentDuration = 16,
  exitFrame,
  exitDurationInFrames = 12,
  exitStaggerDelay,
  delay = 0,
  easing = 'easeOutCubic',
  springPreset = 'snappy',
  distance = 30,
  initialScale = 0.85,
  initialRotation = -10,
  initialBlur = 8,
  reverse = false,
  direction = 'both',
  seed = 42,
  style,
  segmentStyle,
  className,
  segmentClassName,
  align,
  preserveWhitespace = true,
  as: Component = 'div',
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Segment text into structured tokens
  const segments: SplitTextSegment[] = useMemo(() => {
    return splitTextIntoSegments(text, splitBy, customSegments, preserveWhitespace);
  }, [text, splitBy, customSegments, preserveWhitespace]);

  // 2. Precompute deterministic random shuffle indices if using random-stagger variant
  const shuffledIndices = useMemo(() => {
    if (variant === 'random-stagger') {
      return createDeterministicShuffle(segments.length, seed);
    }
    return undefined;
  }, [segments.length, variant, seed]);

  const containerStyle: React.CSSProperties = {
    textAlign: align,
    ...style,
  };

  // If no segments exist, return empty container
  if (segments.length === 0) {
    return <Component className={className} style={containerStyle} />;
  }

  // Render Strategy A: Line splitting (each line is a block element)
  if (splitBy === 'line') {
    return (
      <Component className={className} style={containerStyle}>
        {segments.map((segment, idx) => {
          const animStyle = calculateSplitTextStyle({
            currentFrame,
            fps,
            totalSegments: segments.length,
            segmentIndex: idx,
            variant,
            startFrame,
            durationInFrames,
            staggerDelay,
            segmentDuration,
            exitFrame,
            exitDurationInFrames,
            exitStaggerDelay,
            delay,
            easing,
            springPreset,
            distance,
            initialScale,
            initialRotation,
            initialBlur,
            reverse,
            direction,
            seed,
            shuffledIndices,
          });

          const customStyle = typeof segmentStyle === 'function' ? segmentStyle(segment, idx) : segmentStyle;
          const customClass = typeof segmentClassName === 'function' ? segmentClassName(segment, idx) : segmentClassName;

          return (
            <div
              key={segment.id}
              className={customClass}
              style={{
                display: 'block',
                opacity: animStyle.opacity,
                transform: animStyle.transform,
                filter: animStyle.filter,
                transformOrigin: animStyle.transformOrigin,
                visibility: animStyle.visibility,
                ...customStyle,
              }}
            >
              {segment.text}
            </div>
          );
        })}
      </Component>
    );
  }

  // Render Strategy B: Character splitting with word-level grouping to protect against line breaks
  if (splitBy === 'character' && text && !customSegments) {
    // Group characters into words to preserve natural layout line-wrapping
    return (
      <Component className={className} style={containerStyle}>
        {segments.map((segment, idx) => {
          const animStyle = calculateSplitTextStyle({
            currentFrame,
            fps,
            totalSegments: segments.length,
            segmentIndex: idx,
            variant,
            startFrame,
            durationInFrames,
            staggerDelay,
            segmentDuration,
            exitFrame,
            exitDurationInFrames,
            exitStaggerDelay,
            delay,
            easing,
            springPreset,
            distance,
            initialScale,
            initialRotation,
            initialBlur,
            reverse,
            direction,
            seed,
            shuffledIndices,
          });

          const customStyle = typeof segmentStyle === 'function' ? segmentStyle(segment, idx) : segmentStyle;
          const customClass = typeof segmentClassName === 'function' ? segmentClassName(segment, idx) : segmentClassName;

          // If character is whitespace, render as inline space
          if (/^\s+$/.test(segment.text)) {
            return (
              <span key={segment.id} style={{ display: 'inline', whiteSpace: 'pre' }}>
                {segment.text}
              </span>
            );
          }

          return (
            <span
              key={segment.id}
              className={customClass}
              style={{
                display: 'inline-block',
                opacity: animStyle.opacity,
                transform: animStyle.transform,
                filter: animStyle.filter,
                transformOrigin: animStyle.transformOrigin,
                visibility: animStyle.visibility,
                ...customStyle,
              }}
            >
              {segment.text}
            </span>
          );
        })}
      </Component>
    );
  }

  // Render Strategy C: Words, Sentences, and Custom Segments
  return (
    <Component className={className} style={containerStyle}>
      {segments.map((segment, idx) => {
        const animStyle = calculateSplitTextStyle({
          currentFrame,
          fps,
          totalSegments: segments.length,
          segmentIndex: idx,
          variant,
          startFrame,
          durationInFrames,
          staggerDelay,
          segmentDuration,
          exitFrame,
          exitDurationInFrames,
          exitStaggerDelay,
          delay,
          easing,
          springPreset,
          distance,
          initialScale,
          initialRotation,
          initialBlur,
          reverse,
          direction,
          seed,
          shuffledIndices,
        });

        const customStyle = typeof segmentStyle === 'function' ? segmentStyle(segment, idx) : segmentStyle;
        const customClass = typeof segmentClassName === 'function' ? segmentClassName(segment, idx) : segmentClassName;

        return (
          <React.Fragment key={segment.id}>
            <span
              className={customClass}
              style={{
                display: 'inline-block',
                opacity: animStyle.opacity,
                transform: animStyle.transform,
                filter: animStyle.filter,
                transformOrigin: animStyle.transformOrigin,
                visibility: animStyle.visibility,
                ...customStyle,
              }}
            >
              {segment.text}
            </span>
            {segment.trailingSpace && (
              <span style={{ display: 'inline', whiteSpace: 'pre' }}>
                {segment.trailingSpace}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </Component>
  );
};

export const SplitText = React.memo(SplitTextBase);
