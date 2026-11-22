/**
 * TypographyScene Component
 * Layer 3 of the Motion Graphics Framework.
 *
 * Typography-focused scene template turning expressive kinetic text into the primary visual centerpiece.
 * Seamlessly composes Layer 2 Typography primitives (AnimatedText, WordReveal, CharacterReveal, TextMask, TextHighlight, SplitText).
 */

import React from 'react';
import { useCurrentFrame } from 'remotion';
import { SceneContainer } from './SceneContainer';
import type { TypographySceneProps } from './types';
import {
  calculateTypographySceneKinematics,
  resolveTypographySceneLayout,
  splitTextWithHighlights,
} from './typographySceneStyle';
import { AnimatedText } from '../typography/AnimatedText';
import { WordReveal } from '../typography/WordReveal';
import { CharacterReveal } from '../typography/CharacterReveal';
import { TextMask } from '../typography/TextMask';
import { TextHighlight } from '../typography/TextHighlight';
import { SplitText } from '../typography/SplitText';
import { Colors } from '../../styles/colors';
import { Typography } from '../../styles/typography';

export const TypographyScene: React.FC<TypographySceneProps> = ({
  headline,
  secondaryHeadline,
  description,
  paragraph,
  eyebrow,
  label,
  highlightedWords = [],
  highlightColor,
  layout = 'centered',
  alignment,
  decorativeElements,
  animation,
  staggerDelay = 4,
  headlineStyle: customHeadlineStyle,
  secondaryStyle: customSecondaryStyle,
  descriptionStyle: customDescriptionStyle,
  eyebrowStyle: customEyebrowStyle,
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
  sceneId = 'typography-scene',
  debug = false,
  style,
  className,
}) => {
  const frame = useCurrentFrame();

  const kinematics = calculateTypographySceneKinematics({
    frame,
    delay,
    staggerDelay,
    animation,
  });

  const resolved = resolveTypographySceneLayout(layout, alignment);
  const headlineAnim = animation?.headlineAnimation ?? 'word-reveal';
  const highlightVariant = animation?.highlightVariant ?? 'background';
  const effectiveDescription = description ?? paragraph;
  const effectiveEyebrow = eyebrow ?? label;

  // Render headline text according to chosen kinetic variant or highlights
  const renderHeadlineContent = () => {
    if (typeof headline !== 'string') {
      return headline;
    }

    // When highlighted words are defined and no character/split text override is explicitly requested
    if (highlightedWords.length > 0 && (headlineAnim === 'word-reveal' || headlineAnim === 'none' || headlineAnim === 'slide-up')) {
      const segments = splitTextWithHighlights(headline, highlightedWords);
      return (
        <span style={{ display: 'inline' }}>
          {segments.map((seg) => {
            if (seg.isHighlight) {
              return (
                <TextHighlight
                  key={seg.key}
                  variant={highlightVariant}
                  color={highlightColor ?? Colors.accent.cyan}
                  startFrame={delay + (animation?.highlightDelay ?? staggerDelay * 3)}
                  durationInFrames={animation?.highlightDuration ?? 16}
                >
                  {seg.text}
                </TextHighlight>
              );
            }
            return <React.Fragment key={seg.key}>{seg.text}</React.Fragment>;
          })}
        </span>
      );
    }

    switch (headlineAnim) {
      case 'character-reveal':
        return (
          <CharacterReveal
            text={headline}
            variant="slide-up"
            startFrame={delay + (animation?.headlineDelay ?? staggerDelay * 1)}
            durationInFrames={20}
            staggerDelay={2}
          />
        );

      case 'text-mask':
        return (
          <TextMask
            text={headline}
            variant="bottom-reveal"
            startFrame={delay + (animation?.headlineDelay ?? staggerDelay * 1)}
            durationInFrames={22}
          />
        );

      case 'split-text':
        return (
          <SplitText
            text={headline}
            splitBy="word"
            variant="slide-up"
            startFrame={delay + (animation?.headlineDelay ?? staggerDelay * 1)}
            staggerDelay={2}
          />
        );

      case 'fade':
      case 'pop':
      case 'slide-up':
        return (
          <AnimatedText
            variant={headlineAnim}
            startFrame={delay + (animation?.headlineDelay ?? staggerDelay * 1)}
            durationInFrames={20}
          >
            {headline}
          </AnimatedText>
        );

      case 'word-reveal':
      default:
        return (
          <WordReveal
            text={headline}
            variant="slide-up"
            startFrame={delay + (animation?.headlineDelay ?? staggerDelay * 1)}
            durationInFrames={18}
            staggerDelay={3}
          />
        );
    }
  };

  const isSplitLayout = layout === 'split-text';

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
        {/* If split layout, render in 2 columns */}
        {isSplitLayout ? (
          <>
            <div style={resolved.contentColStyle}>
              {/* Eyebrow / Label */}
              {effectiveEyebrow && (
                <div
                  style={{
                    opacity: kinematics.eyebrow.opacity,
                    transform: `translateY(${kinematics.eyebrow.translateY}px)`,
                    ...resolved.eyebrowStyle,
                    ...customEyebrowStyle,
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
                    {effectiveEyebrow}
                  </span>
                </div>
              )}

              {/* Main Headline */}
              <div
                style={{
                  color: Colors.text.primary,
                  fontFamily: Typography.fontFamily.sans,
                  ...resolved.headlineStyle,
                  ...customHeadlineStyle,
                }}
              >
                {renderHeadlineContent()}
              </div>

              {/* Decorative element in split layout */}
              {decorativeElements && (
                <div
                  style={{
                    opacity: kinematics.decorative.opacity,
                    transform: `scale(${kinematics.decorative.scale})`,
                    marginTop: 20,
                  }}
                >
                  {decorativeElements}
                </div>
              )}
            </div>

            <div style={resolved.sideColStyle}>
              {/* Secondary Headline */}
              {secondaryHeadline && (
                <div
                  style={{
                    opacity: kinematics.secondary.opacity,
                    transform: `translateY(${kinematics.secondary.translateY}px)`,
                    color: Colors.text.secondary,
                    fontFamily: Typography.fontFamily.sans,
                    ...resolved.secondaryStyle,
                    ...customSecondaryStyle,
                  }}
                >
                  {secondaryHeadline}
                </div>
              )}

              {/* Description Paragraph */}
              {effectiveDescription && (
                <div
                  style={{
                    opacity: kinematics.description.opacity,
                    transform: `translateY(${kinematics.description.translateY}px)`,
                    color: Colors.text.tertiary,
                    fontFamily: Typography.fontFamily.sans,
                    ...resolved.descriptionStyle,
                    ...customDescriptionStyle,
                  }}
                >
                  {effectiveDescription}
                </div>
              )}

              {children}
            </div>
          </>
        ) : (
          /* Standard stacked layouts */
          <>
            {/* Eyebrow / Label */}
            {effectiveEyebrow && (
              <div
                style={{
                  opacity: kinematics.eyebrow.opacity,
                  transform: `translateY(${kinematics.eyebrow.translateY}px)`,
                  ...resolved.eyebrowStyle,
                  ...customEyebrowStyle,
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
                  {effectiveEyebrow}
                </span>
              </div>
            )}

            {/* Main Headline */}
            <div
              style={{
                color: Colors.text.primary,
                fontFamily: Typography.fontFamily.sans,
                ...resolved.headlineStyle,
                ...customHeadlineStyle,
              }}
            >
              {renderHeadlineContent()}
            </div>

            {/* Secondary Headline */}
            {secondaryHeadline && (
              <div
                style={{
                  opacity: kinematics.secondary.opacity,
                  transform: `translateY(${kinematics.secondary.translateY}px)`,
                  color: Colors.text.secondary,
                  fontFamily: Typography.fontFamily.sans,
                  ...resolved.secondaryStyle,
                  ...customSecondaryStyle,
                }}
              >
                {secondaryHeadline}
              </div>
            )}

            {/* Description Paragraph */}
            {effectiveDescription && (
              <div
                style={{
                  opacity: kinematics.description.opacity,
                  transform: `translateY(${kinematics.description.translateY}px)`,
                  color: Colors.text.tertiary,
                  fontFamily: Typography.fontFamily.sans,
                  ...resolved.descriptionStyle,
                  ...customDescriptionStyle,
                }}
              >
                {effectiveDescription}
              </div>
            )}

            {/* Decorative element */}
            {decorativeElements && (
              <div
                style={{
                  opacity: kinematics.decorative.opacity,
                  transform: `scale(${kinematics.decorative.scale})`,
                  marginTop: 24,
                }}
              >
                {decorativeElements}
              </div>
            )}

            {children}
          </>
        )}
      </div>
    </SceneContainer>
  );
};
