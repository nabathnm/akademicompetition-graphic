/**
 * TextHighlight Component
 * Reusable Remotion typography component that animates visual emphasis behind, around, or underneath selected text.
 * Layer 2 of the Motion Graphics Framework.
 */

import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { TextHighlightProps } from './types';
import {
  calculateTextHighlightStyle,
  parseTextSegments,
} from './textHighlightStyle';

export {
  calculateTextHighlightStyle,
  parseTextSegments,
};

export const TextHighlight: React.FC<TextHighlightProps> = ({
  children,
  text,
  highlight,
  segments,
  variant = 'background',
  startFrame = 0,
  durationInFrames = 18,
  exitFrame,
  exitDurationInFrames = 12,
  easing = 'easeOutCubic',
  color,
  backgroundColor,
  borderColor,
  thickness = 3,
  padding = '0.1em 0.35em',
  borderRadius = 4,
  underlineOffset = 2,
  highlightWidth,
  highlightHeight,
  direction = 'left-to-right',
  reverse = false,
  style,
  highlightStyle,
  className,
  highlightClassName,
  as: Component = 'span',
  align,
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Calculate deterministic highlight animation progress & styles
  const motionStyle = calculateTextHighlightStyle({
    currentFrame,
    fps,
    variant,
    startFrame,
    durationInFrames,
    exitFrame,
    exitDurationInFrames,
    easing,
    direction,
    reverse,
  });

  // 2. Parse text into structured segments (targeted vs unhighlighted)
  const parsedSegments = useMemo(
    () => parseTextSegments(text, highlight, segments),
    [text, highlight, segments]
  );

  // Helper renderer for the visual highlight effect behind/around a target node
  const renderHighlightDecoration = () => {
    switch (variant) {
      case 'underline': {
        return (
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: underlineOffset,
              height: thickness,
              width: highlightWidth,
              backgroundColor: borderColor || color || '#00D1FF',
              borderRadius: 2,
              clipPath: motionStyle.clipPath,
              opacity: motionStyle.opacity,
              visibility: motionStyle.visibility,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        );
      }

      case 'border-bottom': {
        return (
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: underlineOffset,
              height: thickness,
              width: highlightWidth,
              backgroundColor: borderColor || color || '#00D1FF',
              clipPath: motionStyle.clipPath,
              opacity: motionStyle.opacity,
              visibility: motionStyle.visibility,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        );
      }

      case 'strike': {
        return (
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: '50%',
              height: thickness,
              width: highlightWidth,
              backgroundColor: color || '#EF4444',
              borderRadius: 2,
              clipPath: motionStyle.clipPath,
              opacity: motionStyle.opacity,
              visibility: motionStyle.visibility,
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />
        );
      }

      case 'marker': {
        return (
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '12%',
              bottom: '6%',
              left: '-4px',
              right: '-4px',
              backgroundColor: backgroundColor || 'rgba(245, 158, 11, 0.35)',
              borderRadius: '3px 6px 4px 5px',
              transform: 'rotate(-0.8deg)',
              clipPath: motionStyle.clipPath,
              opacity: motionStyle.opacity,
              visibility: motionStyle.visibility,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        );
      }

      case 'gradient': {
        return (
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background:
                backgroundColor ||
                'linear-gradient(90deg, rgba(0, 209, 255, 0.25) 0%, rgba(168, 85, 247, 0.25) 100%)',
              borderRadius,
              clipPath: motionStyle.clipPath,
              opacity: motionStyle.opacity,
              visibility: motionStyle.visibility,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        );
      }

      case 'box': {
        const strokeColor = borderColor || color || '#00D1FF';
        const numThickness = typeof thickness === 'number' ? thickness : 2;
        return (
          <svg
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: '-2px -4px',
              width: 'calc(100% + 8px)',
              height: 'calc(100% + 4px)',
              pointerEvents: 'none',
              zIndex: 0,
              visibility: motionStyle.visibility,
            }}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <rect
              x="2"
              y="2"
              width="96"
              height="96"
              rx={typeof borderRadius === 'number' ? borderRadius * 2 : 6}
              fill="none"
              stroke={strokeColor}
              strokeWidth={numThickness * 2}
              pathLength={100}
              strokeDasharray="100 100"
              strokeDashoffset={motionStyle.strokeDashoffset ?? 0}
            />
          </svg>
        );
      }

      case 'circle': {
        const strokeColor = borderColor || color || '#F59E0B';
        const numThickness = typeof thickness === 'number' ? thickness : 2;
        return (
          <svg
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: '-4px -8px',
              width: 'calc(100% + 16px)',
              height: 'calc(100% + 8px)',
              pointerEvents: 'none',
              zIndex: 0,
              visibility: motionStyle.visibility,
            }}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <ellipse
              cx="50"
              cy="50"
              rx="47"
              ry="45"
              fill="none"
              stroke={strokeColor}
              strokeWidth={numThickness * 2}
              pathLength={100}
              strokeDasharray="100 100"
              strokeDashoffset={motionStyle.strokeDashoffset ?? 0}
            />
          </svg>
        );
      }

      case 'glow': {
        const glowColor = color || '#00D1FF';
        return (
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius,
              backgroundColor: backgroundColor || 'rgba(0, 209, 255, 0.15)',
              filter: `blur(6px) drop-shadow(0 0 10px ${glowColor})`,
              opacity: motionStyle.opacity,
              transform: motionStyle.transform,
              visibility: motionStyle.visibility,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        );
      }

      case 'bracket': {
        const bracketColor = borderColor || color || '#00D1FF';
        const numThickness = typeof thickness === 'number' ? thickness : 2;
        return (
          <>
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: '-8px',
                width: 6,
                borderLeft: `${numThickness}px solid ${bracketColor}`,
                borderTop: `${numThickness}px solid ${bracketColor}`,
                borderBottom: `${numThickness}px solid ${bracketColor}`,
                transform: motionStyle.transform,
                opacity: motionStyle.opacity,
                visibility: motionStyle.visibility,
                pointerEvents: 'none',
              }}
            />
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: '-8px',
                width: 6,
                borderRight: `${numThickness}px solid ${bracketColor}`,
                borderTop: `${numThickness}px solid ${bracketColor}`,
                borderBottom: `${numThickness}px solid ${bracketColor}`,
                transform: motionStyle.transform ? `scaleX(-1) ${motionStyle.transform}` : undefined,
                opacity: motionStyle.opacity,
                visibility: motionStyle.visibility,
                pointerEvents: 'none',
              }}
            />
          </>
        );
      }

      case 'background':
      default: {
        return (
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: backgroundColor || 'rgba(0, 209, 255, 0.2)',
              border: borderColor ? `1px solid ${borderColor}` : undefined,
              borderRadius,
              width: highlightWidth,
              height: highlightHeight,
              clipPath: motionStyle.clipPath,
              opacity: motionStyle.opacity,
              visibility: motionStyle.visibility,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        );
      }
    }
  };

  const containerStyle: React.CSSProperties = {
    textAlign: align,
    display: 'inline',
    ...style,
  };

  // Branch 1: If raw children provided without explicit text, highlight children directly
  if (!text && parsedSegments.length === 0 && children) {
    return (
      <Component className={className} style={containerStyle}>
        <span
          className={highlightClassName}
          style={{
            position: 'relative',
            display: 'inline-block',
            padding,
            ...highlightStyle,
          }}
        >
          {renderHighlightDecoration()}
          <span style={{ position: 'relative', zIndex: 1, color }}>
            {children}
          </span>
        </span>
      </Component>
    );
  }

  // Branch 2: Render segmented text (targeted word or entire sentence)
  return (
    <Component className={className} style={containerStyle}>
      {parsedSegments.map((segment, idx) => {
        if (!segment.highlighted) {
          return <React.Fragment key={idx}>{segment.text}</React.Fragment>;
        }

        return (
          <span
            key={idx}
            className={highlightClassName}
            style={{
              position: 'relative',
              display: 'inline-block',
              padding,
              ...highlightStyle,
            }}
          >
            {renderHighlightDecoration()}
            <span style={{ position: 'relative', zIndex: 1, color }}>
              {segment.text}
            </span>
          </span>
        );
      })}
    </Component>
  );
};
