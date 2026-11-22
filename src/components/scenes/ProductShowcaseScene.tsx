/**
 * ProductShowcaseScene Component
 * Production-ready product showcase scene template placing physical or digital products at the center of attention.
 * Supports continuous floating hover physics, floating detail callout badges, and versatile layouts.
 * Layer 3 of the Motion Graphics Framework.
 */

import React, { useMemo } from 'react';
import { Img, useCurrentFrame } from 'remotion';
import type { ProductShowcaseSceneProps } from './types.ts';
import { SceneContainer } from './SceneContainer.tsx';
import {
  calculateProductShowcaseKinematics,
  resolveDetailBadgePosition,
  resolveProductShowcaseLayout,
} from './productShowcaseSceneStyle.ts';
import { Colors } from '../../styles/colors.ts';
import { Typography } from '../../styles/typography.ts';
import { Spacing } from '../../styles/spacing.ts';

export const ProductShowcaseScene: React.FC<ProductShowcaseSceneProps> = ({
  title,
  subtitle,
  description,
  label,
  supportingText,
  children,
  productVisual,
  productImage,
  details = [],
  decorativeElements,
  layout = 'center-product',
  background,
  backgroundColor = Colors.dark.bgPrimary,
  backgroundImage,
  animation,
  durationInFrames,
  delay = 0,
  width,
  height,
  padding = 64,
  safeArea = true,
  sceneId = 'product-showcase-scene',
  debug = false,
  style,
  className,
}) => {
  const frame = useCurrentFrame();

  // Compute kinematics
  const kinematics = useMemo(
    () =>
      calculateProductShowcaseKinematics({
        frame,
        delay,
        animation,
        detailCount: details.length,
      }),
    [frame, delay, animation, details.length],
  );

  // Compute layout structure
  const layoutStyles = useMemo(() => resolveProductShowcaseLayout(layout), [layout]);

  // Main visual content (children or productVisual slot or productImage)
  const resolvedVisual = useMemo(() => {
    if (productVisual) return productVisual;
    if (children) return children;
    if (productImage) {
      return (
        <Img
          src={productImage}
          alt={typeof title === 'string' ? title : 'Product'}
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
        />
      );
    }
    return null;
  }, [productVisual, children, productImage, title]);

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
        {/* Text Block */}
        <div style={layoutStyles.textColStyle}>
          {/* Label / Badge */}
          {label && (
            <div
              style={{
                marginBottom: Spacing.scale.sm,
                opacity: kinematics.label.opacity,
                transform: `translateY(${kinematics.label.translateY}px)`,
              }}
            >
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

          {/* Product Title */}
          <div
            style={{
              marginBottom: Spacing.scale.xs,
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
                  lineHeight: 1.1,
                }}
              >
                {title}
              </h1>
            ) : (
              title
            )}
          </div>

          {/* Subtitle */}
          {subtitle && (
            <div
              style={{
                marginBottom: Spacing.scale.sm,
                opacity: kinematics.subtitle.opacity,
                transform: `translateY(${kinematics.subtitle.translateY}px)`,
                width: '100%',
              }}
            >
              {typeof subtitle === 'string' ? (
                <p
                  style={{
                    ...Typography.body.large,
                    color: Colors.accent.cyan,
                    margin: 0,
                    fontWeight: 600,
                  }}
                >
                  {subtitle}
                </p>
              ) : (
                subtitle
              )}
            </div>
          )}

          {/* Description */}
          {description && (
            <div
              style={{
                marginBottom: Spacing.scale.md,
                opacity: kinematics.description.opacity,
                transform: `translateY(${kinematics.description.translateY}px)`,
                maxWidth: '620px',
              }}
            >
              {typeof description === 'string' ? (
                <p
                  style={{
                    ...Typography.body.medium,
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
          )}

          {/* Supporting Text / Pricing */}
          {supportingText && (
            <div
              style={{
                opacity: kinematics.supportingText.opacity,
                transform: `translateY(${kinematics.supportingText.translateY}px)`,
              }}
            >
              {typeof supportingText === 'string' ? (
                <span
                  style={{
                    ...Typography.caption.eyebrow,
                    color: Colors.accent.emerald,
                    fontFamily: Typography.fontFamily.mono,
                  }}
                >
                  {supportingText}
                </span>
              ) : (
                supportingText
              )}
            </div>
          )}
        </div>

        {/* Product Visual Area */}
        {resolvedVisual && (
          <div style={layoutStyles.visualColStyle}>
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: kinematics.product.opacity,
                transform: `scale(${kinematics.product.scale}) translateY(${kinematics.product.translateY + kinematics.floatY}px) rotate(${kinematics.tiltAngle}deg)`,
                transformOrigin: 'center',
              }}
            >
              {resolvedVisual}

              {/* Floating Detail Badges */}
              {details.map((item, idx) => {
                const badgeSlot = kinematics.details[idx] ?? { opacity: 1, scale: 1, translateY: 0 };
                const posStyle = resolveDetailBadgePosition(item);
                return (
                  <div
                    key={item.id ?? idx}
                    style={{
                      ...posStyle,
                      opacity: badgeSlot.opacity,
                      transform: `scale(${badgeSlot.scale}) translateY(${badgeSlot.translateY}px)`,
                      transformOrigin: 'center',
                      backgroundColor: 'rgba(10, 15, 26, 0.85)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      border: `1px solid ${Colors.border.default}`,
                      borderRadius: Spacing.radius.sm,
                      padding: '8px 14px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      zIndex: 10,
                      minWidth: 100,
                      pointerEvents: 'none',
                    }}
                  >
                    <span style={{ fontSize: 9, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary, textTransform: 'uppercase' }}>
                      {item.label}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: Colors.accent.cyan }}>
                      {item.value}
                    </span>
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
