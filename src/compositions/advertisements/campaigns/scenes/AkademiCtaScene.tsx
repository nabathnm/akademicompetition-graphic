/**
 * Scene 5: Closing & Call-To-Action (CTA)
 * High-conversion closing scene with floating brand emblem, kinetic headline,
 * interactive CTA button, and memorable domain lockup.
 *
 * Duration: 210 frames (7.0 seconds at 30 FPS)
 * Headline: "Let's achieve more together!"
 * Supporting: "Jelajahi bootcamp dan materi persiapan kompetisi sekarang."
 * CTA: "Jelajahi Sekarang"
 * Website: akademicompetition.com
 */

import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Globe, ArrowRight } from 'lucide-react';
import { AKADEMI_RELAUNCH_CONFIG } from '../akademiRelaunchConfig.ts';
import { AkademiLogo } from '../../../../assets/icons/AkademiLogo.tsx';
import { WordReveal } from '../../../../components/typography/WordReveal.tsx';
import { AnimatedText } from '../../../../components/typography/AnimatedText.tsx';
import { AnimatedButton } from '../../../../components/ui/AnimatedButton.tsx';
import { AnimatedCircle } from '../../../../components/graphics/AnimatedCircle.tsx';
import { Typography } from '../../../../styles/typography.ts';

export const AkademiCtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { copy, theme } = AKADEMI_RELAUNCH_CONFIG;

  // Logo entrance
  const logoProgress = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.6, stiffness: 170 },
  });

  // CTA button entrance
  const ctaProgress = spring({
    frame: frame - 40,
    fps,
    config: { damping: 12, mass: 0.5, stiffness: 190 },
  });

  // Website pill entrance
  const websiteProgress = spring({
    frame: frame - 60,
    fps,
    config: { damping: 13, mass: 0.6, stiffness: 180 },
  });

  // Subtle floating motion
  const floatY = Math.sin(frame * 0.08) * 6;

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
      {/* Background Subtle Rings */}
      <div
        style={{
          position: 'absolute',
          top: '35%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          opacity: 0.35,
        }}
      >
        <AnimatedCircle
          radius={220}
          strokeWidth={1.5}
          stroke={theme.accentCyan}
          animation="pulse"
          fill="none"
          durationInFrames={60}
        />
      </div>

      {/* Brand Emblem at Top */}
      <div
        style={{
          transform: `scale(${logoProgress}) translateY(${floatY}px)`,
          opacity: logoProgress,
          marginBottom: 36,
          filter: 'drop-shadow(0 8px 30px rgba(0, 240, 255, 0.3))',
        }}
      >
        <AkademiLogo
          variant="stacked"
          size={96}
          accentColor={theme.accentCyan}
          secondaryColor={theme.accentGold}
        />
      </div>

      {/* Main Closing Headline */}
      <div style={{ maxWidth: 840, marginBottom: 20 }}>
        <WordReveal
          text={copy.scene5.headline}
          variant="slide-up"
          staggerDelay={4}
          delay={15}
          durationInFrames={20}
          springPreset="snappy"
          style={{
            fontFamily: Typography.fontFamily.sans,
            fontSize: 64,
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.7)',
          }}
        />
      </div>

      {/* Supporting Copy */}
      <div style={{ maxWidth: 740, marginBottom: 44 }}>
        <AnimatedText
          text={copy.scene5.subheadline}
          variant="fade-slide-up"
          delay={30}
          durationInFrames={24}
          style={{
            fontFamily: Typography.fontFamily.sans,
            fontSize: 24,
            fontWeight: 500,
            color: theme.textSecondary,
            lineHeight: 1.45,
          }}
        />
      </div>

      {/* Interactive CTA Button */}
      <div
        style={{
          transform: `scale(${ctaProgress}) translateY(${interpolate(ctaProgress, [0, 1], [30, 0])}px)`,
          opacity: ctaProgress,
          marginBottom: 36,
        }}
      >
        <AnimatedButton
          variant="primary"
          size="large"
          pressFrame={80}
          releaseFrame={88}
          style={{
            minWidth: 320,
            padding: '20px 48px',
            fontSize: 22,
            fontWeight: 800,
            borderRadius: 999,
            background: `linear-gradient(135deg, ${theme.accentCyan} 0%, #2563eb 100%)`,
            color: '#ffffff',
            boxShadow: '0 10px 32px rgba(0, 240, 255, 0.4), 0 0 20px rgba(37, 99, 235, 0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            cursor: 'pointer',
          }}
        >
          <span>{copy.scene5.ctaText}</span>
          <ArrowRight size={22} color="#ffffff" />
        </AnimatedButton>
      </div>

      {/* Persistent Official Website Lockup Pill */}
      <div
        style={{
          transform: `scale(${websiteProgress}) translateY(${interpolate(websiteProgress, [0, 1], [20, 0])}px)`,
          opacity: websiteProgress,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
          padding: '14px 32px',
          borderRadius: 16,
          background: 'rgba(11, 17, 32, 0.85)',
          border: `1.5px solid ${theme.accentGold}88`,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5), 0 0 16px rgba(245, 158, 11, 0.2)',
        }}
      >
        <Globe size={22} color={theme.accentGold} />
        <span
          style={{
            fontFamily: Typography.fontFamily.mono,
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: '0.04em',
            color: '#ffffff',
          }}
        >
          {copy.scene5.domain}
        </span>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: theme.accentCyan,
            boxShadow: `0 0 8px ${theme.accentCyan}`,
            marginLeft: 4,
          }}
        />
      </div>
    </div>
  );
};
