/**
 * HeroScene Component
 * Production-ready commercial hero scene template for introducing products, applications, and brands.
 * Establishes strong visual hierarchy with staggered kinetic typography, hero visual framing,
 * and decorative ambient layers.
 * Layer 3 of the Motion Graphics Framework.
 */

import React, { useMemo } from 'react';
import { useCurrentFrame } from 'remotion';
import type { HeroSceneProps } from './types.ts';
import { SceneContainer } from './SceneContainer.tsx';
import { calculateHeroStaggerMetrics, resolveHeroLayoutStyles } from './heroSceneStyle.ts';
import { Colors } from '../../styles/colors.ts';
import { Typography } from '../../styles/typography.ts';
import { Spacing } from '../../styles/spacing.ts';

export const HeroScene: React.FC<HeroSceneProps> = ({
  headline,
  subtitle,
  description,
  eyebrow,
  cta,
  onCtaClick,
  children,
  heroVisual,
  decorativeElements,
  layout = 'split-left',
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
  sceneId = 'hero-scene',
  debug = false,
  style,
  className,
}) => {
  const frame = useCurrentFrame();

  // Compute staggered kinematics for all content slots
  const stagger = useMemo(
    () =>
      calculateHeroStaggerMetrics({
        frame,
        delay,
        staggerDelay,
        animation,
      }),
    [frame, delay, staggerDelay, animation],
  );

  // Compute layout structure
  const layoutStyles = useMemo(() => resolveHeroLayoutStyles(layout), [layout]);

  // Main visual content
  const resolvedVisual = heroVisual ?? children;

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
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              opacity: stagger.decorations.opacity,
              transform: `translateY(${stagger.floatOffset}px)`,
              zIndex: 0,
            }}
          >
            {decorativeElements}
          </div>
        ) : undefined
      }
    >
      <div style={layoutStyles.containerStyle}>
        {/* Text Column / Block */}
        <div style={layoutStyles.textColStyle}>
          {/* Eyebrow / Category Tag */}
          {eyebrow && (
            <div
              style={{
                marginBottom: Spacing.scale.sm,
                opacity: stagger.eyebrow.opacity,
                transform: `translateY(${stagger.eyebrow.translateY}px)`,
              }}
            >
              {typeof eyebrow === 'string' ? (
                <span
                  style={{
                    ...Typography.caption.eyebrow,
                    color: Colors.accent.cyan,
                    backgroundColor: `${Colors.accent.cyan}18`,
                    border: `1px solid ${Colors.accent.cyan}40`,
                    padding: '4px 12px',
                    borderRadius: Spacing.radius.full,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: Colors.accent.cyan }} />
                  {eyebrow}
                </span>
              ) : (
                eyebrow
              )}
            </div>
          )}

          {/* Headline */}
          <div
            style={{
              marginBottom: Spacing.scale.md,
              opacity: stagger.headline.opacity,
              transform: `translateY(${stagger.headline.translateY}px)`,
              width: '100%',
            }}
          >
            {typeof headline === 'string' ? (
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
                {headline}
              </h1>
            ) : (
              headline
            )}
          </div>

          {/* Subtitle */}
          {subtitle && (
            <div
              style={{
                marginBottom: description ? Spacing.scale.sm : Spacing.scale.lg,
                opacity: stagger.subtitle.opacity,
                transform: `translateY(${stagger.subtitle.translateY}px)`,
                width: '100%',
              }}
            >
              {typeof subtitle === 'string' ? (
                <p
                  style={{
                    ...Typography.body.large,
                    color: Colors.accent.cyan,
                    margin: 0,
                    fontWeight: 500,
                    lineHeight: 1.4,
                  }}
                >
                  {subtitle}
                </p>
              ) : (
                subtitle
              )}
            </div>
          )}

          {/* Extended Description */}
          {description && (
            <div
              style={{
                marginBottom: Spacing.scale.lg,
                opacity: stagger.description.opacity,
                transform: `translateY(${stagger.description.translateY}px)`,
                maxWidth: '600px',
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

          {/* Call to Action Button */}
          {cta && (
            <div
              style={{
                marginTop: Spacing.scale.xs,
                opacity: stagger.cta.opacity,
                transform: `translateY(${stagger.cta.translateY}px)`,
              }}
            >
              {typeof cta === 'string' ? (
                <button
                  type="button"
                  onClick={onCtaClick}
                  style={{
                    padding: '12px 28px',
                    borderRadius: Spacing.radius.sm,
                    backgroundColor: Colors.accent.cyan,
                    color: '#000000',
                    fontFamily: Typography.fontFamily.display,
                    fontSize: 14,
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: `0 0 20px ${Colors.accent.cyan}40`,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  {cta}
                </button>
              ) : (
                cta
              )}
            </div>
          )}
        </div>

        {/* Hero Visual Column / Frame */}
        {resolvedVisual && (
          <div
            style={{
              ...layoutStyles.visualColStyle,
              opacity: stagger.visual.opacity,
              transform: `scale(${stagger.visual.scale}) translateY(${stagger.visual.translateY}px)`,
            }}
          >
            {resolvedVisual}
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
