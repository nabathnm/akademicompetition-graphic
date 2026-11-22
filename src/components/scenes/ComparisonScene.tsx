/**
 * ComparisonScene Component
 * Layer 3 of the Motion Graphics Framework.
 *
 * Comparison scene template for presenting two or more visual states, products, features, or experiences.
 * Provides clear visual separation, synchronized/sequential panel reveals, and center divider lines.
 */

import React from 'react';
import { useCurrentFrame } from 'remotion';
import { SceneContainer } from './SceneContainer';
import type { ComparisonSceneProps } from './types';
import {
  calculateComparisonSceneKinematics,
  resolveComparisonSceneLayout,
} from './comparisonSceneStyle';
import { Colors } from '../../styles/colors';
import { Typography } from '../../styles/typography';
import { Spacing } from '../../styles/spacing';

export const ComparisonScene: React.FC<ComparisonSceneProps> = ({
  title,
  subtitle,
  description,
  label,
  leftContent,
  rightContent,
  leftLabel,
  rightLabel,
  leftDescription,
  rightDescription,
  leftIcon,
  rightIcon,
  divider = true,
  layout = 'side-by-side',
  animation,
  staggerDelay = 6,
  children,
  background,
  backgroundColor,
  backgroundImage,
  durationInFrames,
  delay = 0,
  width,
  height,
  padding,
  safeArea = true,
  sceneId = 'comparison-scene',
  debug = false,
  style,
  className,
}) => {
  const frame = useCurrentFrame();

  const kinematics = calculateComparisonSceneKinematics({
    frame,
    delay,
    staggerDelay,
    animation,
    layout,
  });

  const resolved = resolveComparisonSceneLayout(layout, divider);
  const showDivider = divider !== false;
  const dividerLabel = typeof divider === 'object' ? divider.label : undefined;

  return (
    <SceneContainer
      width={width}
      height={height}
      background={background}
      backgroundColor={backgroundColor}
      backgroundImage={backgroundImage}
      durationInFrames={durationInFrames}
      delay={delay}
      padding={padding}
      safeArea={safeArea}
      sceneId={sceneId}
      debug={debug}
      layout="custom"
      style={style}
      className={className}
    >
      <div style={resolved.containerStyle}>
        {/* Header Block */}
        {(title || subtitle || label || description) && (
          <div style={resolved.headerStyle}>
            {label && (
              <div
                style={{
                  opacity: kinematics.title.opacity,
                  transform: `translateY(${kinematics.title.translateY}px)`,
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    ...Typography.caption.eyebrow,
                    color: Colors.accent.cyan,
                    backgroundColor: `${Colors.accent.cyan}18`,
                    border: `1px solid ${Colors.accent.cyan}40`,
                    padding: '4px 12px',
                    borderRadius: 16,
                    display: 'inline-block',
                  }}
                >
                  {label}
                </span>
              </div>
            )}

            {title && (
              <h2
                style={{
                  ...Typography.headline.h1,
                  color: Colors.text.primary,
                  margin: 0,
                  opacity: kinematics.title.opacity,
                  transform: `translateY(${kinematics.title.translateY}px)`,
                }}
              >
                {title}
              </h2>
            )}

            {subtitle && (
              <div
                style={{
                  ...Typography.headline.h3,
                  color: Colors.text.secondary,
                  marginTop: 6,
                  opacity: kinematics.subtitle.opacity,
                  transform: `translateY(${kinematics.subtitle.translateY}px)`,
                }}
              >
                {subtitle}
              </div>
            )}

            {description && (
              <p
                style={{
                  ...Typography.body.large,
                  color: Colors.text.tertiary,
                  marginTop: 8,
                  marginBottom: 0,
                  opacity: kinematics.description.opacity,
                  transform: `translateY(${kinematics.description.translateY}px)`,
                }}
              >
                {description}
              </p>
            )}
          </div>
        )}

        {/* Comparison Panels Container */}
        <div style={resolved.panelsContainerStyle}>
          {/* Left / Top / Before Panel */}
          <div
            style={{
              ...resolved.leftPanelStyle,
              opacity: kinematics.leftPanel.opacity,
              transform: `translate3d(${kinematics.leftPanel.translateX}px, ${kinematics.leftPanel.translateY}px, 0) scale(${kinematics.leftPanel.scale * kinematics.leftHighlightPulse})`,
              willChange: 'transform, opacity',
            }}
          >
            {(leftLabel || leftIcon || leftDescription) && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {leftIcon}
                  {leftLabel && (
                    <span
                      style={{
                        ...Typography.caption.eyebrow,
                        fontSize: 12,
                        color: Colors.text.secondary,
                        backgroundColor: 'rgba(255,255,255,0.08)',
                        padding: '4px 10px',
                        borderRadius: 12,
                        fontWeight: 700,
                      }}
                    >
                      {leftLabel}
                    </span>
                  )}
                </div>
                {leftDescription && (
                  <p
                    style={{
                      fontSize: 13,
                      color: Colors.text.tertiary,
                      marginTop: 6,
                      lineHeight: 1.4,
                      margin: '6px 0 0 0',
                    }}
                  >
                    {leftDescription}
                  </p>
                )}
              </div>
            )}
            {leftContent}
          </div>

          {/* Center Divider Line */}
          {showDivider && (
            <div
              style={{
                ...resolved.dividerStyle,
                transform: resolved.isVertical
                  ? `scaleX(${kinematics.divider.scale})`
                  : `scaleY(${kinematics.divider.scale})`,
                opacity: kinematics.divider.opacity,
                transformOrigin: 'center',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {dividerLabel && (
                <div
                  style={{
                    position: 'absolute',
                    backgroundColor: Colors.dark.surface1,
                    border: `1px solid ${Colors.border.default}`,
                    padding: '4px 10px',
                    borderRadius: Spacing.radius.xs,
                    fontFamily: Typography.fontFamily.mono,
                    fontSize: 10,
                    fontWeight: 700,
                    color: Colors.text.secondary,
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {dividerLabel}
                </div>
              )}
            </div>
          )}

          {/* Right / Bottom / After Panel */}
          <div
            style={{
              ...resolved.rightPanelStyle,
              opacity: kinematics.rightPanel.opacity,
              transform: `translate3d(${kinematics.rightPanel.translateX}px, ${kinematics.rightPanel.translateY}px, 0) scale(${kinematics.rightPanel.scale * kinematics.rightHighlightPulse})`,
              willChange: 'transform, opacity',
            }}
          >
            {(rightLabel || rightIcon || rightDescription) && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {rightIcon}
                  {rightLabel && (
                    <span
                      style={{
                        ...Typography.caption.eyebrow,
                        fontSize: 12,
                        color: Colors.accent.cyan,
                        backgroundColor: `${Colors.accent.cyan}20`,
                        border: `1px solid ${Colors.accent.cyan}40`,
                        padding: '4px 10px',
                        borderRadius: 12,
                        fontWeight: 700,
                      }}
                    >
                      {rightLabel}
                    </span>
                  )}
                </div>
                {rightDescription && (
                  <p
                    style={{
                      fontSize: 13,
                      color: Colors.text.tertiary,
                      marginTop: 6,
                      lineHeight: 1.4,
                      margin: '6px 0 0 0',
                    }}
                  >
                    {rightDescription}
                  </p>
                )}
              </div>
            )}
            {rightContent}
          </div>
        </div>

        {children}
      </div>
    </SceneContainer>
  );
};
