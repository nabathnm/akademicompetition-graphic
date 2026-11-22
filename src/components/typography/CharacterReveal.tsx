/**
 * CharacterReveal Component
 * Reusable Remotion typography component that progressively animates individual characters.
 * Layer 2 of the Motion Graphics Framework.
 */

import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { CharacterRevealProps } from './types';
import {
  segmentCharacters,
  calculateCharacterRevealStyle,
  calculateCharacterRevealTiming,
} from './characterRevealStyle';

export {
  segmentCharacters,
  calculateCharacterRevealStyle,
  calculateCharacterRevealTiming,
};

const CharacterRevealBase: React.FC<CharacterRevealProps> = ({
  text,
  variant = 'fade-slide-up',
  startFrame = 0,
  durationInFrames,
  staggerDelay = 1,
  characterDuration = 14,
  exitFrame,
  exitDurationInFrames = 10,
  exitStaggerDelay,
  delay = 0,
  easing = 'easeOutCubic',
  springPreset = 'snappy',
  distance = 24,
  initialScale = 0.8,
  initialRotation = -15,
  initialBlur = 8,
  waveAmplitude = 24,
  waveFrequency = 0.4,
  reverse = false,
  reverseVisualOrder = false,
  direction = 'both',
  preserveWhitespace = true,
  animateSpaces = false,
  style,
  characterStyle,
  className,
  characterClassName,
  as: Component = 'div',
  align = 'left',
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Grapheme segmentation and word grouping
  const { wordGroups, totalAnimatableChars } = useMemo(
    () => segmentCharacters(text, { preserveWhitespace, animateSpaces }),
    [text, preserveWhitespace, animateSpaces]
  );

  // 2. Visual display order (preserves reading order by default)
  const displayWordGroups = useMemo(() => {
    if (!reverseVisualOrder) return wordGroups;
    return [...wordGroups].reverse().map((g) => ({
      ...g,
      characters: [...g.characters].reverse(),
    }));
  }, [wordGroups, reverseVisualOrder]);

  const containerStyle: React.CSSProperties = {
    textAlign: align,
    whiteSpace: 'pre-wrap',
    wordBreak: 'normal',
    ...style,
  };

  return (
    <Component className={className} style={containerStyle}>
      {displayWordGroups.map((group) => (
        <React.Fragment key={group.id}>
          {/* Word wrapper prevents mid-word line breaking */}
          <span
            style={{
              display: 'inline-block',
              whiteSpace: 'nowrap',
            }}
          >
            {group.characters.map((token) => {
              // Calculate independent motion style for this character
              const motionStyle = calculateCharacterRevealStyle({
                currentFrame,
                fps,
                totalChars: totalAnimatableChars,
                charIndex: token.charIndex,
                variant,
                startFrame,
                durationInFrames,
                staggerDelay,
                characterDuration,
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
                waveAmplitude,
                waveFrequency,
                reverse,
                direction,
              });

              // Custom character styling callback or object
              const customCharStyle =
                typeof characterStyle === 'function'
                  ? characterStyle(token.char, token.charIndex)
                  : characterStyle;

              const combinedTransform = [
                customCharStyle?.transform,
                motionStyle.transform,
              ]
                .filter(Boolean)
                .join(' ') || undefined;

              const combinedFilter = [
                customCharStyle?.filter,
                motionStyle.filter,
              ]
                .filter(Boolean)
                .join(' ') || undefined;

              const combinedOpacity =
                customCharStyle?.opacity !== undefined
                  ? Number(customCharStyle.opacity) * motionStyle.opacity
                  : motionStyle.opacity;

              const customCharClass =
                typeof characterClassName === 'function'
                  ? characterClassName(token.char, token.charIndex)
                  : characterClassName;

              return (
                <span
                  key={token.id}
                  className={customCharClass}
                  style={{
                    display: 'inline-block',
                    ...customCharStyle,
                    opacity: combinedOpacity,
                    transform: combinedTransform,
                    filter: combinedFilter,
                    visibility: motionStyle.visibility,
                  }}
                >
                  {token.char}
                </span>
              );
            })}
          </span>

          {/* Whitespace spacer enables natural line wrapping between words */}
          {group.trailingSpace && (
            <span
              aria-hidden="true"
              style={{
                display: 'inline',
                whiteSpace: 'pre-wrap',
              }}
            >
              {group.trailingSpace}
            </span>
          )}
        </React.Fragment>
      ))}
    </Component>
  );
};

export const CharacterReveal = React.memo(CharacterRevealBase);
