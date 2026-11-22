/**
 * WordReveal Component
 * Reusable Remotion typography component that progressively animates text word-by-word.
 * Layer 2 of the Motion Graphics Framework.
 */

import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { WordRevealProps } from './types';
import {
  segmentText,
  calculateWordRevealStyle,
  calculateWordRevealTiming,
} from './wordRevealStyle';

export { segmentText, calculateWordRevealStyle, calculateWordRevealTiming };

const WordRevealBase: React.FC<WordRevealProps> = ({
  text,
  variant = 'fade-slide-up',
  startFrame = 0,
  durationInFrames,
  staggerDelay = 3,
  wordDuration = 18,
  exitFrame,
  exitDurationInFrames = 12,
  exitStaggerDelay,
  delay = 0,
  easing = 'easeOutCubic',
  springPreset = 'snappy',
  distance = 30,
  initialScale = 0.85,
  initialRotation = -8,
  initialBlur = 10,
  reverse = false,
  reverseVisualOrder = false,
  direction = 'both',
  preserveWhitespace = true,
  separator = /\s+/,
  style,
  wordStyle,
  className,
  wordClassName,
  as: Component = 'div',
  align = 'left',
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Predictable word & whitespace token segmentation
  const tokens = useMemo(
    () => segmentText(text, separator, preserveWhitespace),
    [text, separator, preserveWhitespace]
  );

  const totalWords = useMemo(
    () => tokens.filter((t) => t.isWord).length,
    [tokens]
  );

  // 2. Visual token display order (default maintains sentence order)
  const displayTokens = useMemo(() => {
    if (!reverseVisualOrder) return tokens;
    return [...tokens].reverse();
  }, [tokens, reverseVisualOrder]);

  const containerStyle: React.CSSProperties = {
    textAlign: align,
    whiteSpace: 'pre-wrap',
    wordBreak: 'normal',
    ...style,
  };

  return (
    <Component className={className} style={containerStyle}>
      {displayTokens.map((token) => {
        // Render whitespace / delimiter tokens without transformation
        if (!token.isWord) {
          return (
            <span
              key={token.id}
              aria-hidden="true"
              style={{
                display: 'inline',
                whiteSpace: 'pre-wrap',
              }}
            >
              {token.text}
            </span>
          );
        }

        // Calculate independent motion style for this word token
        const motionStyle = calculateWordRevealStyle({
          currentFrame,
          fps,
          totalWords,
          wordIndex: token.wordIndex,
          variant,
          startFrame,
          durationInFrames,
          staggerDelay,
          wordDuration,
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
        });

        // Resolve optional custom word styling (object or callback)
        const customWordStyle =
          typeof wordStyle === 'function'
            ? wordStyle(token.text, token.wordIndex)
            : wordStyle;

        const combinedTransform = [
          customWordStyle?.transform,
          motionStyle.transform,
        ]
          .filter(Boolean)
          .join(' ') || undefined;

        const combinedFilter = [
          customWordStyle?.filter,
          motionStyle.filter,
        ]
          .filter(Boolean)
          .join(' ') || undefined;

        const combinedOpacity =
          customWordStyle?.opacity !== undefined
            ? Number(customWordStyle.opacity) * motionStyle.opacity
            : motionStyle.opacity;

        const customWordClass =
          typeof wordClassName === 'function'
            ? wordClassName(token.text, token.wordIndex)
            : wordClassName;

        return (
          <span
            key={token.id}
            className={customWordClass}
            style={{
              display: 'inline-block',
              ...customWordStyle,
              opacity: combinedOpacity,
              transform: combinedTransform,
              filter: combinedFilter,
              visibility: motionStyle.visibility,
            }}
          >
            {token.text}
          </span>
        );
      })}
    </Component>
  );
};

export const WordReveal = React.memo(WordRevealBase);
