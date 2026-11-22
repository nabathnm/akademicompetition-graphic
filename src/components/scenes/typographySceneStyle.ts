/**
 * TypographyScene Mathematical and Layout Engine
 * Layer 3 of the Motion Graphics Framework.
 */

import React from 'react';
import type {
  TypographySceneAnimationConfig,
  TypographySceneLayout,
} from './types.ts';
import { clamp } from '../../utils/animation/clamp.ts';
import { easeOut } from '../../utils/animation/easing.ts';

export interface TypographySlotMetrics {
  opacity: number;
  translateY: number;
  scale: number;
  progress: number;
  isSettled: boolean;
}

export interface TypographySceneKinematics {
  eyebrow: TypographySlotMetrics;
  headline: TypographySlotMetrics;
  secondary: TypographySlotMetrics;
  description: TypographySlotMetrics;
  highlight: TypographySlotMetrics;
  decorative: TypographySlotMetrics;
}

export interface TypographySceneKinematicsOptions {
  frame: number;
  delay?: number;
  staggerDelay?: number;
  animation?: TypographySceneAnimationConfig;
}

/**
 * Calculates deterministic kinematics for eyebrow, headline, secondary headline, description, highlights, and decorative elements.
 */
export function calculateTypographySceneKinematics(
  options: TypographySceneKinematicsOptions,
): TypographySceneKinematics {
  const { frame, delay = 0, staggerDelay: globalStagger = 4, animation } = options;

  const config = animation ?? {};
  const stagger = config.staggerDelay ?? globalStagger;

  const eyebrowStart = delay + (config.eyebrowDelay ?? 0);
  const headlineStart = delay + (config.headlineDelay ?? stagger * 1);
  const secondaryStart = delay + (config.secondaryDelay ?? stagger * 2);
  const descStart = delay + (config.descriptionDelay ?? stagger * 3);
  const highlightStart = delay + (config.highlightDelay ?? stagger * 3);
  const decorativeStart = delay + stagger * 2;

  const computeSlot = (
    startFrame: number,
    animType: 'slide-up' | 'fade' | 'pop' | 'none' = 'slide-up',
    duration = 18,
    slideDistance = 28,
  ): TypographySlotMetrics => {
    if (animType === 'none') {
      return { opacity: 1, translateY: 0, scale: 1, progress: 1, isSettled: true };
    }

    if (frame < startFrame) {
      return {
        opacity: 0,
        translateY: animType === 'slide-up' ? slideDistance : 0,
        scale: animType === 'pop' ? 0.8 : 1,
        progress: 0,
        isSettled: false,
      };
    }

    const raw = clamp((frame - startFrame) / duration, 0, 1);
    const progress = easeOut(raw);

    return {
      opacity: progress,
      translateY: animType === 'slide-up' ? slideDistance * (1 - progress) : 0,
      scale: animType === 'pop' ? 0.8 + 0.2 * progress : 1,
      progress,
      isSettled: raw >= 1,
    };
  };

  const secAnim = config.secondaryAnimation ?? 'slide-up';
  const descAnim = config.descriptionAnimation ?? 'slide-up';
  const highlightDuration = config.highlightDuration ?? 16;

  return {
    eyebrow: computeSlot(eyebrowStart, 'fade', 14, 15),
    headline: computeSlot(headlineStart, 'slide-up', 20, 32),
    secondary: computeSlot(secondaryStart, secAnim, 18, 24),
    description: computeSlot(descStart, descAnim, 20, 24),
    highlight: computeSlot(highlightStart, 'fade', highlightDuration, 0),
    decorative: computeSlot(decorativeStart, 'pop', 24, 0),
  };
}

export interface TypographySceneResolvedLayout {
  containerStyle: React.CSSProperties;
  eyebrowStyle: React.CSSProperties;
  headlineStyle: React.CSSProperties;
  secondaryStyle: React.CSSProperties;
  descriptionStyle: React.CSSProperties;
  contentColStyle?: React.CSSProperties;
  sideColStyle?: React.CSSProperties;
}

/**
 * Resolves CSS layout styles for the 8 TypographyScene layouts.
 */
export function resolveTypographySceneLayout(
  layout: TypographySceneLayout = 'centered',
  alignment?: 'left' | 'center' | 'right',
): TypographySceneResolvedLayout {
  const baseAlign = alignment ?? (layout === 'left-aligned' ? 'left' : layout === 'right-aligned' ? 'right' : 'center');

  switch (layout) {
    case 'left-aligned':
      return {
        containerStyle: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          textAlign: 'left',
          width: '100%',
          maxWidth: 960,
          margin: '0 auto',
        },
        eyebrowStyle: { marginBottom: 14 },
        headlineStyle: { fontSize: 64, lineHeight: 1.12, letterSpacing: '-0.03em', fontWeight: 800, marginBottom: 20 },
        secondaryStyle: { fontSize: 32, lineHeight: 1.25, fontWeight: 600, marginBottom: 16 },
        descriptionStyle: { fontSize: 20, lineHeight: 1.5, maxWidth: 680 },
      };

    case 'right-aligned':
      return {
        containerStyle: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'center',
          textAlign: 'right',
          width: '100%',
          maxWidth: 960,
          margin: '0 auto',
        },
        eyebrowStyle: { marginBottom: 14 },
        headlineStyle: { fontSize: 64, lineHeight: 1.12, letterSpacing: '-0.03em', fontWeight: 800, marginBottom: 20 },
        secondaryStyle: { fontSize: 32, lineHeight: 1.25, fontWeight: 600, marginBottom: 16 },
        descriptionStyle: { fontSize: 20, lineHeight: 1.5, maxWidth: 680 },
      };

    case 'oversized-headline':
      return {
        containerStyle: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: baseAlign === 'left' ? 'flex-start' : baseAlign === 'right' ? 'flex-end' : 'center',
          justifyContent: 'center',
          textAlign: baseAlign,
          width: '100%',
          maxWidth: 1200,
          margin: '0 auto',
        },
        eyebrowStyle: { marginBottom: 16 },
        headlineStyle: { fontSize: 92, lineHeight: 1.05, letterSpacing: '-0.04em', fontWeight: 900, marginBottom: 24 },
        secondaryStyle: { fontSize: 30, lineHeight: 1.3, fontWeight: 500, marginBottom: 16 },
        descriptionStyle: { fontSize: 18, lineHeight: 1.5, maxWidth: 600 },
      };

    case 'multi-line':
      return {
        containerStyle: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: baseAlign === 'left' ? 'flex-start' : baseAlign === 'right' ? 'flex-end' : 'center',
          justifyContent: 'center',
          textAlign: baseAlign,
          width: '100%',
          maxWidth: 1040,
          margin: '0 auto',
          gap: 8,
        },
        eyebrowStyle: { marginBottom: 12 },
        headlineStyle: { fontSize: 72, lineHeight: 1.1, letterSpacing: '-0.035em', fontWeight: 850, marginBottom: 16 },
        secondaryStyle: { fontSize: 28, lineHeight: 1.35, fontWeight: 600, marginBottom: 14 },
        descriptionStyle: { fontSize: 19, lineHeight: 1.6, maxWidth: 640 },
      };

    case 'split-text':
      return {
        containerStyle: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: 1200,
          gap: 60,
          margin: '0 auto',
        },
        contentColStyle: {
          flex: 1.2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          textAlign: 'left',
        },
        sideColStyle: {
          flex: 0.9,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          textAlign: 'left',
          gap: 16,
        },
        eyebrowStyle: { marginBottom: 12 },
        headlineStyle: { fontSize: 60, lineHeight: 1.15, letterSpacing: '-0.03em', fontWeight: 800 },
        secondaryStyle: { fontSize: 26, lineHeight: 1.3, fontWeight: 600 },
        descriptionStyle: { fontSize: 18, lineHeight: 1.6 },
      };

    case 'text-with-graphics':
      return {
        containerStyle: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: baseAlign === 'left' ? 'flex-start' : baseAlign === 'right' ? 'flex-end' : 'center',
          justifyContent: 'center',
          textAlign: baseAlign,
          width: '100%',
          maxWidth: 1000,
          margin: '0 auto',
          position: 'relative',
        },
        eyebrowStyle: { marginBottom: 14 },
        headlineStyle: { fontSize: 68, lineHeight: 1.1, letterSpacing: '-0.03em', fontWeight: 850, marginBottom: 20 },
        secondaryStyle: { fontSize: 30, lineHeight: 1.3, fontWeight: 600, marginBottom: 16 },
        descriptionStyle: { fontSize: 19, lineHeight: 1.55, maxWidth: 660 },
      };

    case 'custom':
      return {
        containerStyle: {
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
        },
        eyebrowStyle: {},
        headlineStyle: { fontSize: 48, fontWeight: 700 },
        secondaryStyle: { fontSize: 24, fontWeight: 500 },
        descriptionStyle: { fontSize: 16 },
      };

    case 'centered':
    default:
      return {
        containerStyle: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
          maxWidth: 960,
          margin: '0 auto',
        },
        eyebrowStyle: { marginBottom: 16 },
        headlineStyle: { fontSize: 64, lineHeight: 1.15, letterSpacing: '-0.03em', fontWeight: 800, marginBottom: 20 },
        secondaryStyle: { fontSize: 30, lineHeight: 1.3, fontWeight: 600, marginBottom: 16 },
        descriptionStyle: { fontSize: 20, lineHeight: 1.5, maxWidth: 680 },
      };
  }
}

export interface TextSegment {
  text: string;
  isHighlight: boolean;
  key: string;
}

/**
 * Splits plain text into segments marking matched words for dynamic TextHighlighting.
 */
export function splitTextWithHighlights(
  text: string,
  highlightedWords: string[] = [],
): TextSegment[] {
  if (!text || highlightedWords.length === 0) {
    return [{ text, isHighlight: false, key: 'seg-0' }];
  }

  // Create clean lookup set of lowercased target words
  const normalizedTargets = highlightedWords.map((w) => w.trim().toLowerCase()).filter(Boolean);
  if (normalizedTargets.length === 0) {
    return [{ text, isHighlight: false, key: 'seg-0' }];
  }

  // Split text by word boundaries while capturing spaces
  const tokens = text.split(/(\s+)/);
  const segments: TextSegment[] = [];

  tokens.forEach((token, idx) => {
    const cleanWord = token.replace(/^[^\w]+|[^\w]+$/g, '').toLowerCase();
    const isMatch = cleanWord !== '' && normalizedTargets.includes(cleanWord);

    segments.push({
      text: token,
      isHighlight: isMatch,
      key: `seg-${idx}-${cleanWord}`,
    });
  });

  return segments;
}
