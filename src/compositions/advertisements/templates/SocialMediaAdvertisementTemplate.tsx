/**
 * SocialMediaAdvertisementTemplate Component
 * Production-ready vertical social media advertisement template.
 * Layer 4 of the Motion Graphics Framework.
 *
 * Tailored for vertical short-form platforms (Instagram Reels, TikTok, YouTube Shorts):
 * - 1080 × 1920 (9:16) native vertical canvas
 * - Built-in platform safe-area margin compliance
 * - Layered background support (ambient spotlight, particle canvas, technical grid)
 * - Multi-scene timeline sequencing with deterministic transitions
 * - Integrated background music and frame-accurate sound effect triggers
 */

import React, { useMemo } from 'react';
import { AdvertisementComposition } from '../AdvertisementComposition.tsx';
import type {
  SocialMediaAdvertisementTemplateProps,
} from './socialMediaTemplateTypes.ts';
import { SOCIAL_SAFE_AREAS } from './socialMediaTemplateTypes.ts';
import { ParticleSystem } from '../../../components/graphics/ParticleSystem.tsx';
import { Colors } from '../../../styles/colors.ts';

export const SocialMediaAdvertisementTemplate: React.FC<SocialMediaAdvertisementTemplateProps> = ({
  id = 'social-media-ad-template',
  width = 1080,
  height = 1920,
  durationInFrames,
  platform = 'general',
  scenes,
  backgroundMusic,
  soundEffects,
  audio,
  animation,
  showBackgroundParticles = true,
  particleCount = 28,
  background = 'radial-gradient(ellipse at 50% 20%, #0d1a36 0%, #030712 65%, #010409 100%)',
  backgroundColor = Colors.dark.bgPrimary,
  debug = false,
  style,
  className,
}) => {
  const safeAreaInsets = SOCIAL_SAFE_AREAS[platform];

  // Compose background layers (atmospheric lighting + subtle particles)
  const backgroundContent = useMemo(() => {
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {/* Ambient Top Spotlight */}
        <div
          style={{
            position: 'absolute',
            top: -200,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 1200,
            height: 900,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 240, 255, 0.08) 0%, rgba(59, 130, 246, 0.04) 40%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        {/* Ambient Bottom Spotlight */}
        <div
          style={{
            position: 'absolute',
            bottom: -150,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 1000,
            height: 700,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.06) 0%, transparent 60%)',
            filter: 'blur(70px)',
          }}
        />

        {/* Subtle Ambient Particle Dust */}
        {showBackgroundParticles && (
          <ParticleSystem
            particleCount={particleCount}
            seed={77}
            size={[2, 6]}
            opacity={[0.15, 0.55]}
            color={['#00f0ff', '#38bdf8', '#f59e0b', '#ffffff']}
            motionMode="drift"
            speed={0.4}
            bounds={{
              width,
              height,
            }}
          />
        )}
      </div>
    );
  }, [showBackgroundParticles, particleCount, width, height]);

  // Compute safe area padding from insets
  const safeAreaPadding = useMemo(() => {
    return {
      top: safeAreaInsets.top,
      bottom: safeAreaInsets.bottom,
      left: safeAreaInsets.left,
      right: safeAreaInsets.right,
    };
  }, [safeAreaInsets]);

  return (
    <AdvertisementComposition
      compositionId={id}
      width={width}
      height={height}
      durationInFrames={durationInFrames}
      scenes={scenes}
      background={background}
      backgroundColor={backgroundColor}
      backgroundContent={backgroundContent}
      backgroundMusic={backgroundMusic}
      soundEffects={soundEffects}
      audio={audio}
      animation={animation}
      safeArea={true}
      padding={safeAreaPadding}
      debug={debug}
      style={style}
      className={className}
    />
  );
};
