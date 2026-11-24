/**
 * Scene 2: Brand Reintroduction
 * Reintroduces the brand identity with a high-impact logo reveal,
 * energetic kinetic typography, and polished technical accents.
 *
 * Duration: 120 frames (4.0 seconds at 30 FPS)
 * Copy: "Akademi Competition is back!" / "Platform belajar dan persiapan kompetisi."
 */

import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { AKADEMI_RELAUNCH_CONFIG } from '../akademiRelaunchConfig.ts';
import { AkademiLogo } from '../../../../assets/icons/AkademiLogo.tsx';
import { SplitText } from '../../../../components/typography/SplitText.tsx';
import { AnimatedText } from '../../../../components/typography/AnimatedText.tsx';
import { AnimatedCircle } from '../../../../components/graphics/AnimatedCircle.tsx';
import { AnimatedLine } from '../../../../components/graphics/AnimatedLine.tsx';
import { Typography } from '../../../../styles/typography.ts';

export const AkademiBrandScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { copy, theme } = AKADEMI_RELAUNCH_CONFIG;

  // Logo entrance spring physics
  const logoScale = spring({
    frame: frame - 6,
    fps,
    config: { damping: 12, mass: 0.7, stiffness: 160 },
  });

  // Continuous subtle floating hover animation
  const floatY = Math.sin(frame * 0.08) * 8;

  // Eyebrow entrance
  const eyebrowOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 48px',
        textAlign: 'center',
      }}
    >
      {/* Background Aura Rings */}
      <div
        style={{
          position: 'absolute',
          top: '36%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          opacity: 0.4,
        }}
      >
        <AnimatedCircle
          radius={180}
          strokeWidth={2}
          stroke={theme.accentGold}
          animation="pulse"
          fill="none"
          durationInFrames={50}
        />
      </div>

      {/* Eyebrow Label */}
      <div
        style={{
          opacity: eyebrowOpacity,
          marginBottom: 32,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span
          style={{
            fontFamily: Typography.fontFamily.mono,
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: '0.24em',
            color: theme.accentGold,
            textTransform: 'uppercase',
          }}
        >
          {copy.scene2.eyebrow}
        </span>
      </div>

      {/* Central Brand Emblem */}
      <div
        style={{
          transform: `scale(${Math.max(0, logoScale)}) translateY(${floatY}px)`,
          opacity: Math.max(0, Math.min(1, logoScale)),
          marginBottom: 44,
          filter: 'drop-shadow(0 12px 36px rgba(0, 240, 255, 0.28))',
        }}
      >
        <AkademiLogo
          variant="stacked"
          size={110}
          accentColor={theme.accentCyan}
          secondaryColor={theme.accentGold}
        />
      </div>

      {/* Main Kinetic Reintroduction Headline */}
      <div style={{ maxWidth: 880, marginBottom: 20 }}>
        <SplitText
          text={copy.scene2.headline}
          mode="word"
          variant="pop"
          staggerFrames={5}
          startDelay={20}
          durationInFrames={24}
          springPreset="bouncy"
          style={{
            fontFamily: Typography.fontFamily.sans,
            fontSize: 72,
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            textShadow: '0 4px 24px rgba(0, 0, 0, 0.7)',
          }}
        />
      </div>

      {/* Center Divider Line */}
      <div style={{ width: 280, height: 3, margin: '8px auto 24px' }}>
        <AnimatedLine
          x1={0}
          y1={1}
          x2={280}
          y2={1}
          stroke={theme.accentCyan}
          strokeWidth={3}
          animation="reveal-center"
          startFrame={35}
          durationInFrames={25}
        />
      </div>

      {/* Supporting Copy Description */}
      <div style={{ maxWidth: 740 }}>
        <AnimatedText
          text={copy.scene2.subheadline}
          variant="fade-slide-up"
          delay={45}
          durationInFrames={24}
          style={{
            fontFamily: Typography.fontFamily.sans,
            fontSize: 28,
            fontWeight: 500,
            color: theme.textSecondary,
            lineHeight: 1.45,
          }}
        />
      </div>
    </div>
  );
};
