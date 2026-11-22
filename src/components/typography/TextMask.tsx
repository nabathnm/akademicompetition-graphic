/**
 * TextMask Component
 * Reusable Remotion typography component that reveals text through clipping and masking techniques.
 * Layer 2 of the Motion Graphics Framework.
 */

import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { TextMaskProps } from './types';
import {
  calculateTextMaskStyle,
  calculateLineMaskTiming,
  parseMaskLines,
} from './textMaskStyle';

export {
  calculateTextMaskStyle,
  calculateLineMaskTiming,
  parseMaskLines,
};

export const TextMask: React.FC<TextMaskProps> = ({
  children,
  text,
  variant = 'bottom-reveal',
  startFrame = 0,
  delay,
  durationInFrames = 20,
  exitFrame,
  exitDurationInFrames = 14,
  easing = 'easeOutCubic',
  direction = 'both',
  distance = '100%',
  staggerDelay = 4,
  lineDuration = 18,
  reverse = false,
  overflow = 'hidden',
  maskColor,
  showMaskBounds = false,
  lines,
  style,
  contentStyle,
  className,
  as: Component = 'div',
  align,
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const effectiveStartFrame = delay !== undefined && startFrame === 0 ? delay : startFrame;
  const resolvedText = text ?? (typeof children === 'string' ? children : '');

  // If variant is line-reveal, parse text into discrete lines
  const parsedLines = useMemo(
    () => (variant === 'line-reveal' ? parseMaskLines(resolvedText, lines) : []),
    [variant, resolvedText, lines]
  );

  // Line-by-line reveal branch
  if (variant === 'line-reveal' && parsedLines.length > 0) {
    const timing = calculateLineMaskTiming(parsedLines.length, {
      startFrame: effectiveStartFrame,
      staggerDelay,
      lineDuration,
      durationInFrames,
      reverse,
    });

    const containerStyle: React.CSSProperties = {
      textAlign: align,
      position: 'relative',
      outline: showMaskBounds ? '1px dashed #00D1FF' : undefined,
      ...style,
    };

    return (
      <Component className={className} style={containerStyle}>
        {parsedLines.map((line, idx) => {
          const lineTiming = timing.getLineTiming(idx);
          const lineStyle = calculateTextMaskStyle({
            currentFrame,
            fps,
            variant: 'mask-slide-up',
            startFrame: lineTiming.lineStartFrame,
            durationInFrames: lineTiming.lineDuration,
            exitFrame,
            exitDurationInFrames,
            easing,
            direction,
            distance,
            reverse: false,
          });

          return (
            <div
              key={`line-${idx}`}
              style={{
                overflow: 'hidden',
                display: 'block',
                position: 'relative',
                paddingBottom: '0.15em',
                marginBottom: '-0.15em',
                outline: showMaskBounds ? '1px dotted rgba(0, 209, 255, 0.5)' : undefined,
              }}
            >
              <div
                style={{
                  transform: lineStyle.transform,
                  opacity: lineStyle.opacity,
                  visibility: lineStyle.visibility,
                  display: 'block',
                  ...contentStyle,
                }}
              >
                {line}
              </div>
            </div>
          );
        })}
      </Component>
    );
  }

  // General masking branch (CSS clip-path / transform)
  const motionStyle = calculateTextMaskStyle({
    currentFrame,
    fps,
    variant,
    startFrame: effectiveStartFrame,
    durationInFrames,
    exitFrame,
    exitDurationInFrames,
    easing,
    direction,
    distance,
    reverse,
  });

  const isSlideVariant = variant === 'mask-slide-up';

  const containerStyle: React.CSSProperties = {
    overflow: isSlideVariant ? 'hidden' : overflow,
    textAlign: align,
    position: 'relative',
    display: 'inline-block',
    paddingBottom: isSlideVariant ? '0.18em' : undefined,
    marginBottom: isSlideVariant ? '-0.18em' : undefined,
    outline: showMaskBounds ? '1px dashed #00D1FF' : undefined,
    ...style,
  };

  const innerStyle: React.CSSProperties = {
    clipPath: motionStyle.clipPath,
    transform: motionStyle.transform,
    opacity: motionStyle.opacity,
    visibility: motionStyle.visibility,
    display: 'block',
    ...contentStyle,
  };

  return (
    <Component className={className} style={containerStyle}>
      <div style={innerStyle}>
        {children ?? text}
      </div>

      {/* Optional decorative color wipe block */}
      {maskColor && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: maskColor,
            clipPath: motionStyle.clipPath,
            pointerEvents: 'none',
            mixBlendMode: 'difference',
          }}
        />
      )}
    </Component>
  );
};
