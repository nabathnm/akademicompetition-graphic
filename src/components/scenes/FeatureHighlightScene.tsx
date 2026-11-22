/**
 * FeatureHighlightScene Component
 * Production-ready feature highlight scene template for showcasing key product capabilities and benefits.
 * Features staggered kinetic typography, benefit callout pills, and visual callout annotations.
 * Layer 3 of the Motion Graphics Framework.
 */

import React, { useMemo } from 'react';
import { useCurrentFrame } from 'remotion';
import type { FeatureHighlightSceneProps } from './types.ts';
import { SceneContainer } from './SceneContainer.tsx';
import {
  calculateFeatureHighlightKinematics,
  resolveAnnotationPosition,
  resolveFeatureHighlightLayout,
} from './featureHighlightSceneStyle.ts';
import { Colors } from '../../styles/colors.ts';
import { Typography } from '../../styles/typography.ts';
import { Spacing } from '../../styles/spacing.ts';

export const FeatureHighlightScene: React.FC<FeatureHighlightSceneProps> = ({
  title,
  description,
  label,
  benefit,
  icon,
  children,
  featureVisual,
  annotations = [],
  decorativeElements,
  layout = 'text-left',
  background,
  backgroundColor = Colors.dark.bgPrimary,
  backgroundImage,
  animation,
  staggerDelay = 4,
  durationInFrames,
  delay = 0,
  width,
  height,
  padding = 64,
  safeArea = true,
  sceneId = 'feature-highlight-scene',
  debug = false,
  style,
  className,
}) => {
  const frame = useCurrentFrame();

  // Compute kinematics
  const kinematics = useMemo(
    () =>
      calculateFeatureHighlightKinematics({
        frame,
        delay,
        staggerDelay,
        animation,
        annotationCount: annotations.length,
      }),
    [frame, delay, staggerDelay, animation, annotations.length],
  );

  // Compute layout structure
  const layoutStyles = useMemo(() => resolveFeatureHighlightLayout(layout), [layout]);

  // Main visual content (featureVisual slot or children)
  const resolvedVisual = featureVisual ?? children;

  return (
    <SceneContainer
      sceneId={sceneId}
      debug={debug}
      width={width}
      height={height}
      background={background}
      backgroundColor={backgroundColor}
      backgroundImage={backgroundImage}
      padding={padding}
      safeArea={safeArea}
      durationInFrames={durationInFrames}
      delay={delay}
      layout="custom"
      style={style}
      className={className}
      backgroundContent={
        decorativeElements ? (
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
            {decorativeElements}
          </div>
        ) : undefined
      }
    >
      <div style={layoutStyles.containerStyle}>
        {/* Text Column / Block */}
        <div style={layoutStyles.textColStyle}>
          {/* Label / Feature Identifier */}
          {label && (
            <div
              style={{
                marginBottom: Spacing.scale.sm,
                opacity: kinematics.label.opacity,
                transform: `translateY(${kinematics.label.translateY}px)`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {icon && <span style={{ display: 'inline-flex' }}>{icon}</span>}
              {typeof label === 'string' ? (
                <span
                  style={{
                    ...Typography.caption.eyebrow,
                    color: Colors.accent.cyan,
                    backgroundColor: `${Colors.accent.cyan}18`,
                    border: `1px solid ${Colors.accent.cyan}40`,
                    padding: '4px 12px',
                    borderRadius: Spacing.radius.full,
                  }}
                >
                  {label}
                </span>
              ) : (
                label
              )}
            </div>
          )}

          {/* Feature Title */}
          <div
            style={{
              marginBottom: Spacing.scale.sm,
              opacity: kinematics.title.opacity,
              transform: `translateY(${kinematics.title.translateY}px)`,
              width: '100%',
            }}
          >
            {typeof title === 'string' ? (
              <h1
                style={{
                  ...Typography.headline.h1,
                  color: Colors.text.primary,
                  margin: 0,
                  letterSpacing: '-0.03em',
                  fontWeight: 800,
                  lineHeight: 1.15,
                }}
              >
                {title}
              </h1>
            ) : (
              title
            )}
          </div>

          {/* Benefit Statement Pill */}
          {benefit && (
            <div
              style={{
                marginBottom: Spacing.scale.md,
                opacity: kinematics.benefit.opacity,
                transform: `scale(${kinematics.benefitPulse}) translateY(${kinematics.benefit.translateY}px)`,
                transformOrigin: 'left center',
              }}
            >
              {typeof benefit === 'string' ? (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 14px',
                    backgroundColor: 'rgba(16, 185, 129, 0.12)',
                    border: `1px solid ${Colors.accent.emerald}60`,
                    borderRadius: Spacing.radius.xs,
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: Colors.accent.emerald }} />
                  <span
                    style={{
                      fontSize: 13,
                      fontFamily: Typography.fontFamily.mono,
                      fontWeight: 700,
                      color: Colors.accent.emerald,
                    }}
                  >
                    {benefit}
                  </span>
                </div>
              ) : (
                benefit
              )}
            </div>
          )}

          {/* Detailed Feature Narrative */}
          <div
            style={{
              opacity: kinematics.description.opacity,
              transform: `translateY(${kinematics.description.translateY}px)`,
              maxWidth: '620px',
            }}
          >
            {typeof description === 'string' ? (
              <p
                style={{
                  ...Typography.body.large,
                  color: Colors.text.secondary,
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {description}
              </p>
            ) : (
              description
            )}
          </div>
        </div>

        {/* Feature Visual Area */}
        {resolvedVisual && (
          <div style={layoutStyles.visualColStyle}>
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: kinematics.visual.opacity,
                transform: `scale(${kinematics.visual.scale}) translateY(${kinematics.visual.translateY}px)`,
                transformOrigin: 'center',
              }}
            >
              {resolvedVisual}

              {/* Callout Annotations */}
              {annotations.map((anno, idx) => {
                const slot = kinematics.annotations[idx] ?? { opacity: 1, scale: 1, translateY: 0 };
                const pos = resolveAnnotationPosition(anno);
                const accentColor = anno.color ?? Colors.accent.cyan;
                return (
                  <div
                    key={anno.id ?? idx}
                    style={{
                      ...pos,
                      opacity: slot.opacity,
                      transform: `scale(${slot.scale}) translateY(${slot.translateY}px)`,
                      transformOrigin: 'center',
                      backgroundColor: 'rgba(10, 15, 26, 0.9)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      border: `1px solid ${accentColor}60`,
                      borderRadius: Spacing.radius.sm,
                      padding: '8px 12px',
                      boxShadow: `0 8px 24px rgba(0, 0, 0, 0.5), 0 0 15px ${accentColor}25`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      zIndex: 10,
                      pointerEvents: 'none',
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: accentColor,
                        boxShadow: `0 0 8px ${accentColor}`,
                      }}
                    />
                    <div>
                      {anno.badge && (
                        <div style={{ fontSize: 9, fontFamily: Typography.fontFamily.mono, color: accentColor, textTransform: 'uppercase' }}>
                          {anno.badge}
                        </div>
                      )}
                      {anno.title && (
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#ffffff' }}>
                          {anno.title}
                        </div>
                      )}
                      {anno.description && (
                        <div style={{ fontSize: 10, color: Colors.text.secondary }}>
                          {anno.description}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
