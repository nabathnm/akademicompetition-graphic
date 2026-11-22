/**
 * OutroScene Component
 * Layer 3 of the Motion Graphics Framework.
 *
 * Dedicated brand closing scene template for presenting brand identity, logo, tagline,
 * website domain, social handles, and optional closing CTA.
 */

import React from 'react';
import { useCurrentFrame } from 'remotion';
import { SceneContainer } from './SceneContainer';
import type { OutroSceneProps } from './types';
import {
  calculateOutroSceneKinematics,
  resolveOutroSceneLayout,
} from './outroSceneStyle';
import { Colors } from '../../styles/colors';
import { Typography } from '../../styles/typography';

export const OutroScene: React.FC<OutroSceneProps> = ({
  brandName,
  logo,
  tagline,
  website,
  socialHandle,
  cta,
  supportingText,
  decorativeElements,
  layout = 'centered-brand',
  children,
  animation,
  staggerDelay = 5,
  background,
  backgroundColor,
  backgroundImage,
  durationInFrames,
  delay = 0,
  width,
  height,
  padding,
  safeArea = true,
  sceneId = 'outro-scene',
  debug = false,
  style,
  className,
}) => {
  const frame = useCurrentFrame();

  const kinematics = calculateOutroSceneKinematics({
    frame,
    delay,
    staggerDelay,
    animation,
  });

  const resolved = resolveOutroSceneLayout(layout);
  const logoContent = logo ?? children;

  const renderLogo = () => (
    <div
      style={{
        ...resolved.logoWrapperStyle,
        opacity: kinematics.logo.opacity,
        transform: `translate3d(0, ${kinematics.logo.translateY + kinematics.logoFloating}px, 0) scale(${kinematics.logo.scale})`,
        willChange: 'transform, opacity',
      }}
    >
      {logoContent}
    </div>
  );

  const renderBrandText = () => (
    <div style={resolved.brandBlockStyle}>
      {brandName && (
        <h1
          style={{
            ...Typography.headline.h1,
            fontSize: 48,
            fontWeight: 850,
            letterSpacing: '-0.03em',
            color: Colors.text.primary,
            margin: 0,
            opacity: kinematics.brand.opacity,
            transform: `translateY(${kinematics.brand.translateY}px)`,
          }}
        >
          {brandName}
        </h1>
      )}

      {tagline && (
        <p
          style={{
            ...Typography.headline.h3,
            fontSize: 24,
            fontWeight: 500,
            color: Colors.text.secondary,
            margin: 0,
            maxWidth: 640,
            opacity: kinematics.tagline.opacity,
            transform: `translateY(${kinematics.tagline.translateY}px)`,
          }}
        >
          {tagline}
        </p>
      )}
    </div>
  );

  const renderMeta = () => (
    <div
      style={{
        ...resolved.metaBlockStyle,
        opacity: kinematics.meta.opacity,
        transform: `translateY(${kinematics.meta.translateY}px)`,
      }}
    >
      {website && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: Typography.fontFamily.mono,
            fontSize: 14,
            color: Colors.accent.cyan,
            backgroundColor: `${Colors.accent.cyan}14`,
            border: `1px solid ${Colors.accent.cyan}35`,
            padding: '6px 16px',
            borderRadius: 20,
            fontWeight: 600,
          }}
        >
          <span>●</span>
          <span>{website}</span>
        </div>
      )}

      {socialHandle && (
        <div
          style={{
            fontFamily: Typography.fontFamily.mono,
            fontSize: 14,
            color: Colors.text.secondary,
          }}
        >
          {socialHandle}
        </div>
      )}

      {cta && <div>{cta}</div>}

      {supportingText && (
        <div
          style={{
            fontSize: 12,
            color: Colors.text.tertiary,
            fontFamily: Typography.fontFamily.sans,
          }}
        >
          {supportingText}
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
        {layout === 'tagline-above-logo' ? (
          <>
            {renderBrandText()}
            {renderLogo()}
            {renderMeta()}
          </>
        ) : (
          <>
            {renderLogo()}
            {renderBrandText()}
            {renderMeta()}
          </>
        )}

        {/* Ambient decorative elements */}
        {decorativeElements && (
          <div style={{ marginTop: 16 }}>
            {decorativeElements}
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
