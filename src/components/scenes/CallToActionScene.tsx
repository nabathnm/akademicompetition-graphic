/**
 * CallToActionScene Component
 * Layer 3 of the Motion Graphics Framework.
 *
 * Dedicated scene template for highlighting a primary action through strong typography,
 * visual hierarchy, interactive AnimatedButtons, and optional supporting product visuals or device mockups.
 */

import React from 'react';
import { useCurrentFrame } from 'remotion';
import { SceneContainer } from './SceneContainer';
import type { CallToActionItem, CallToActionSceneProps } from './types';
import {
  calculateCallToActionSceneKinematics,
  resolveCallToActionSceneLayout,
} from './callToActionSceneStyle';
import { AnimatedButton } from '../ui/AnimatedButton';
import { Colors } from '../../styles/colors';
import { Typography } from '../../styles/typography';

export const CallToActionScene: React.FC<CallToActionSceneProps> = ({
  headline,
  description,
  primaryAction,
  secondaryAction,
  brand,
  logo,
  productVisual,
  deviceMockup,
  decorativeElements,
  layout = 'centered',
  children,
  animation,
  staggerDelay = 4,
  background,
  backgroundColor,
  backgroundImage,
  durationInFrames,
  delay = 0,
  width,
  height,
  padding,
  safeArea = true,
  sceneId = 'cta-scene',
  debug = false,
  style,
  className,
}) => {
  const frame = useCurrentFrame();

  const kinematics = calculateCallToActionSceneKinematics({
    frame,
    delay,
    staggerDelay,
    animation,
  });

  const resolved = resolveCallToActionSceneLayout(layout);
  const visualSlot = deviceMockup ?? productVisual ?? children;

  // Normalize primary CTA
  const primaryItem: CallToActionItem = React.useMemo(() => {
    if (typeof primaryAction === 'string') {
      return { label: primaryAction, variant: 'primary', size: 'large' };
    }
    return { variant: 'primary', size: 'large', ...primaryAction };
  }, [primaryAction]);

  // Normalize secondary CTA
  const secondaryItem: CallToActionItem | undefined = React.useMemo(() => {
    if (!secondaryAction) return undefined;
    if (typeof secondaryAction === 'string') {
      return { label: secondaryAction, variant: 'outline', size: 'large' };
    }
    return { variant: 'outline', size: 'large', ...secondaryAction };
  }, [secondaryAction]);

  const renderTextBlock = () => (
    <div style={resolved.textColStyle}>
      {/* Brand Eyebrow / Logo */}
      {(brand || logo) && (
        <div
          style={{
            opacity: kinematics.brand.opacity,
            transform: `translateY(${kinematics.brand.translateY}px)`,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          {logo}
          {brand && (
            <span
              style={{
                ...Typography.caption.eyebrow,
                color: Colors.accent.cyan,
                backgroundColor: `${Colors.accent.cyan}18`,
                border: `1px solid ${Colors.accent.cyan}40`,
                padding: '4px 14px',
                borderRadius: 16,
                display: 'inline-block',
                fontWeight: 700,
              }}
            >
              {brand}
            </span>
          )}
        </div>
      )}

      {/* Main Headline */}
      <h1
        style={{
          fontSize: layout === 'full-screen-typography' ? 76 : 56,
          lineHeight: 1.1,
          letterSpacing: '-0.035em',
          fontWeight: 850,
          color: Colors.text.primary,
          margin: 0,
          opacity: kinematics.headline.opacity,
          transform: `translateY(${kinematics.headline.translateY}px)`,
          fontFamily: Typography.fontFamily.sans,
        }}
      >
        {headline}
      </h1>

      {/* Description */}
      {description && (
        <p
          style={{
            fontSize: 20,
            lineHeight: 1.5,
            color: Colors.text.tertiary,
            margin: 0,
            maxWidth: 680,
            opacity: kinematics.description.opacity,
            transform: `translateY(${kinematics.description.translateY}px)`,
            fontFamily: Typography.fontFamily.sans,
          }}
        >
          {description}
        </p>
      )}

      {/* Action Buttons Group */}
      <div
        style={{
          ...resolved.buttonGroupStyle,
          opacity: kinematics.buttons.opacity,
          transform: `translateY(${kinematics.buttons.translateY}px) scale(${kinematics.buttons.scale})`,
          willChange: 'transform, opacity',
        }}
      >
        {/* Primary CTA Button with Harmonic Pulse */}
        <div
          style={{
            transform: `scale(${kinematics.buttonPulse})`,
            transformOrigin: 'center',
          }}
        >
          <AnimatedButton
            label={primaryItem.label}
            variant={primaryItem.variant ?? 'primary'}
            size={primaryItem.size ?? 'large'}
            icon={primaryItem.icon}
            startFrame={delay + (animation?.buttonDelay ?? staggerDelay * 3)}
          />
        </div>

        {/* Secondary CTA Button */}
        {secondaryItem && (
          <AnimatedButton
            label={secondaryItem.label}
            variant={secondaryItem.variant ?? 'outline'}
            size={secondaryItem.size ?? 'large'}
            icon={secondaryItem.icon}
            startFrame={delay + (animation?.buttonDelay ?? staggerDelay * 3) + 2}
          />
        )}
      </div>

      {/* Ambient decorative elements */}
      {decorativeElements && (
        <div style={{ marginTop: 12 }}>
          {decorativeElements}
        </div>
      )}
    </div>
  );

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
        {renderTextBlock()}

        {/* Visual Slot in Split Layouts */}
        {resolved.isSplit && (
          <div
            style={{
              ...resolved.visualColStyle,
              opacity: kinematics.visual.opacity,
              transform: `scale(${kinematics.visual.scale}) translateY(${kinematics.visual.translateY}px)`,
              willChange: 'transform, opacity',
            }}
          >
            {visualSlot}
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
