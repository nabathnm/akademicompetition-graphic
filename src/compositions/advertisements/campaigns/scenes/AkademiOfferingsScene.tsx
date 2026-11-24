/**
 * Scene 3: What You Can Find
 * Showcases the 3 key platform offerings through staggered interactive cards,
 * clear iconography, and structured visual hierarchy.
 *
 * Duration: 180 frames (6.0 seconds at 30 FPS)
 * Offerings:
 * 1. Bootcamp
 * 2. Materi Persiapan Lomba
 * 3. Digital Learning Resources
 */

import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Rocket, BookOpen, Laptop, CheckCircle2 } from 'lucide-react';
import { AKADEMI_RELAUNCH_CONFIG } from '../akademiRelaunchConfig.ts';
import { WordReveal } from '../../../../components/typography/WordReveal.tsx';
import { AnimatedCard } from '../../../../components/ui/AnimatedCard.tsx';
import { Typography } from '../../../../styles/typography.ts';

interface OfferingCardItemProps {
  index: number;
  title: string;
  description: string;
  icon: 'Rocket' | 'BookOpen' | 'Laptop';
  accent: string;
  startDelay: number;
}

const OfferingCardItem: React.FC<OfferingCardItemProps> = ({
  index,
  title,
  description,
  icon,
  accent,
  startDelay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startDelay,
    fps,
    config: { damping: 14, mass: 0.6, stiffness: 180 },
  });

  const getIcon = () => {
    switch (icon) {
      case 'Rocket':
        return <Rocket size={28} color={accent} />;
      case 'BookOpen':
        return <BookOpen size={28} color={accent} />;
      case 'Laptop':
        return <Laptop size={28} color={accent} />;
    }
  };

  return (
    <div
      style={{
        transform: `translateY(${interpolate(progress, [0, 1], [40, 0])}px) scale(${interpolate(progress, [0, 1], [0.94, 1])})`,
        opacity: progress,
        width: '100%',
        maxWidth: 760,
        marginBottom: 20,
      }}
    >
      <AnimatedCard
        variant="elevated"
        style={{
          width: '100%',
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.92) 0%, rgba(11, 17, 32, 0.96) 100%)',
          border: `1.5px solid ${accent}44`,
          boxShadow: `0 12px 30px rgba(0, 0, 0, 0.5), 0 0 20px ${accent}18`,
          borderRadius: 20,
          padding: '24px 28px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, textAlign: 'left' }}>
          {/* Accent Icon Container */}
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 16,
              background: `linear-gradient(135deg, ${accent}22 0%, ${accent}08 100%)`,
              border: `1px solid ${accent}66`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {getIcon()}
          </div>

          {/* Text Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span
                style={{
                  fontFamily: Typography.fontFamily.mono,
                  fontSize: 13,
                  fontWeight: 800,
                  color: accent,
                  letterSpacing: '0.12em',
                }}
              >
                0{index + 1}
              </span>
              <h3
                style={{
                  fontFamily: Typography.fontFamily.sans,
                  fontSize: 26,
                  fontWeight: 800,
                  color: '#ffffff',
                  margin: 0,
                }}
              >
                {title}
              </h3>
            </div>
            <p
              style={{
                fontFamily: Typography.fontFamily.sans,
                fontSize: 17,
                color: '#94a3b8',
                lineHeight: 1.45,
                margin: 0,
              }}
            >
              {description}
            </p>
          </div>

          {/* Verified Check Indicator */}
          <div style={{ opacity: 0.7, alignSelf: 'center' }}>
            <CheckCircle2 size={20} color={accent} />
          </div>
        </div>
      </AnimatedCard>
    </div>
  );
};

export const AkademiOfferingsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { copy, theme } = AKADEMI_RELAUNCH_CONFIG;

  const eyebrowOpacity = interpolate(frame, [0, 15], [0, 1], {
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
        padding: '0 44px',
        textAlign: 'center',
      }}
    >
      {/* Eyebrow Label */}
      <div
        style={{
          opacity: eyebrowOpacity,
          marginBottom: 16,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <span
          style={{
            fontFamily: Typography.fontFamily.mono,
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: '0.22em',
            color: theme.accentCyan,
            textTransform: 'uppercase',
          }}
        >
          {copy.scene3.eyebrow}
        </span>
      </div>

      {/* Main Scene Headline */}
      <div style={{ maxWidth: 840, marginBottom: 36 }}>
        <WordReveal
          text={copy.scene3.headline}
          variant="slide-up"
          staggerDelay={3}
          delay={6}
          durationInFrames={20}
          springPreset="snappy"
          style={{
            fontFamily: Typography.fontFamily.sans,
            fontSize: 54,
            fontWeight: 900,
            lineHeight: 1.18,
            letterSpacing: '-0.02em',
            color: '#ffffff',
          }}
        />
      </div>

      {/* 3 Staggered Offering Cards */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {copy.scene3.offerings.map((item, idx) => (
          <OfferingCardItem
            key={item.id}
            index={idx}
            title={item.title}
            description={item.description}
            icon={item.icon as 'Rocket' | 'BookOpen' | 'Laptop'}
            accent={item.accent}
            startDelay={20 + idx * 24}
          />
        ))}
      </div>
    </div>
  );
};
