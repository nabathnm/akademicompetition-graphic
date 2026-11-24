/**
 * AkademiCompetitionRelaunch Composition Component
 * Layer 4 Commercial Advertisement Production.
 *
 * A complete, polished 28-second vertical social media advertisement for Akademi Competition
 * built strictly with the Remotion Motion Graphics Framework and Advertisement Template Library.
 *
 * Specifications:
 * - Resolution: 1080 × 1920 (9:16 vertical)
 * - Frame Rate: 30 FPS
 * - Duration: 840 frames (28.0 seconds)
 * - Platform: Instagram Reels / TikTok / YouTube Shorts compliant
 * - Reuses: SocialMediaAdvertisementTemplate, SceneSequence, TimelineManager,
 *   WordReveal, SplitText, CharacterReveal, AnimatedText, AnimatedCard, AnimatedButton,
 *   BrowserWindowMockup, ParticleSystem, AnimatedCircle, AnimatedLine, BackgroundMusic, SoundEffect.
 */

import React, { useMemo } from 'react';
import { SocialMediaAdvertisementTemplate } from './templates/SocialMediaAdvertisementTemplate.tsx';
import { AKADEMI_RELAUNCH_CONFIG } from './campaigns/akademiRelaunchConfig.ts';
import { AkademiHookScene } from './campaigns/scenes/AkademiHookScene.tsx';
import { AkademiBrandScene } from './campaigns/scenes/AkademiBrandScene.tsx';
import { AkademiOfferingsScene } from './campaigns/scenes/AkademiOfferingsScene.tsx';
import { AkademiDomainScene } from './campaigns/scenes/AkademiDomainScene.tsx';
import { AkademiCtaScene } from './campaigns/scenes/AkademiCtaScene.tsx';
import type { SceneItemConfig } from '../types.ts';
import type { BackgroundMusicProps } from '../../components/audio/backgroundMusicTypes.ts';
import type { SoundEffectProps } from '../../components/audio/soundEffectTypes.ts';

export interface AkademiCompetitionRelaunchProps {
  /** Toggle safe area guide lines and diagnostic telemetry HUD */
  debug?: boolean;
  /** Custom background override */
  background?: string;
  /** Toggle ambient background particles */
  showBackgroundParticles?: boolean;
}

export const AkademiCompetitionRelaunch: React.FC<AkademiCompetitionRelaunchProps> = ({
  debug = false,
  background,
  showBackgroundParticles = true,
}) => {
  const { timing } = AKADEMI_RELAUNCH_CONFIG;

  // Define the 5 sequenced scenes with varied transitions
  const scenes: SceneItemConfig[] = useMemo(() => {
    return [
      // Scene 1: Opening Hook (0–4s / 120 frames)
      {
        id: timing.scene1Hook.id,
        name: 'Scene 1: Opening Hook',
        durationInFrames: timing.scene1Hook.durationInFrames,
        transition: {
          type: 'zoom',
          durationInFrames: timing.scene1Hook.transitionDuration,
        },
        component: <AkademiHookScene />,
      },

      // Scene 2: Brand Reintroduction (4–8s / 120 frames)
      {
        id: timing.scene2Brand.id,
        name: 'Scene 2: Brand Reintroduction',
        durationInFrames: timing.scene2Brand.durationInFrames,
        transition: {
          type: 'wipe',
          durationInFrames: timing.scene2Brand.transitionDuration,
          direction: 'left',
        },
        component: <AkademiBrandScene />,
      },

      // Scene 3: What You Can Find (8–14s / 180 frames)
      {
        id: timing.scene3Offerings.id,
        name: 'Scene 3: Platform Offerings',
        durationInFrames: timing.scene3Offerings.durationInFrames,
        transition: {
          type: 'slide',
          durationInFrames: timing.scene3Offerings.transitionDuration,
          direction: 'left',
        },
        component: <AkademiOfferingsScene />,
      },

      // Scene 4: New Domain Announcement (14–21s / 210 frames)
      {
        id: timing.scene4Domain.id,
        name: 'Scene 4: New Domain Announcement',
        durationInFrames: timing.scene4Domain.durationInFrames,
        transition: {
          type: 'zoom',
          durationInFrames: timing.scene4Domain.transitionDuration,
        },
        component: <AkademiDomainScene />,
      },

      // Scene 5: Closing & CTA (21–28s / 210 frames)
      {
        id: timing.scene5Closing.id,
        name: 'Scene 5: Closing & CTA',
        durationInFrames: timing.scene5Closing.durationInFrames,
        component: <AkademiCtaScene />,
      },
    ];
  }, [timing]);

  // Coordinated Background Music Layer with volume automation
  const backgroundMusic: BackgroundMusicProps = useMemo(() => {
    return {
      id: 'akademi-bgm-soundtrack',
      name: 'Modern Tech Motivation Theme',
      volume: 0.65,
      fadeInFrames: 15,
      fadeOutFrames: 45,
      loop: true,
      keyframes: [
        { frame: 0, volume: 0 },
        { frame: 15, volume: 0.65 },
        { frame: 410, volume: 0.65 },
        { frame: 430, volume: 0.5 }, // Duck slightly during domain reveal
        { frame: 620, volume: 0.5 },
        { frame: 640, volume: 0.65 },
        { frame: 800, volume: 0.65 },
        { frame: 840, volume: 0 }, // Fade to silence at composition end
      ],
    };
  }, []);

  // Frame-accurate synchronized sound effects across transitions and reveals
  const soundEffects: SoundEffectProps[] = useMemo(() => {
    return [
      // Scene 1 SFX
      { id: 'sfx-hook-whoosh', preset: 'whoosh', triggerFrame: 0, volume: 0.75 },
      { id: 'sfx-hook-pop', preset: 'pop', triggerFrame: 12, volume: 0.7 },

      // Scene 2 SFX (Brand reintroduction)
      { id: 'sfx-brand-whoosh', preset: 'whoosh', triggerFrame: 120, volume: 0.8 },
      { id: 'sfx-brand-chime', preset: 'notification', triggerFrame: 135, volume: 0.85 },

      // Scene 3 SFX (Offerings card reveals)
      { id: 'sfx-offerings-whoosh', preset: 'whoosh', triggerFrame: 240, volume: 0.8 },
      { id: 'sfx-card-1', preset: 'ui-click', triggerFrame: 260, volume: 0.75 },
      { id: 'sfx-card-2', preset: 'ui-click', triggerFrame: 285, volume: 0.75 },
      { id: 'sfx-card-3', preset: 'ui-click', triggerFrame: 310, volume: 0.75 },

      // Scene 4 SFX (New domain announcement)
      { id: 'sfx-domain-whoosh', preset: 'whoosh', triggerFrame: 420, volume: 0.85 },
      { id: 'sfx-domain-reveal', preset: 'notification', triggerFrame: 440, volume: 0.9 },

      // Scene 5 SFX (Closing lockup & CTA settle)
      { id: 'sfx-closing-whoosh', preset: 'whoosh', triggerFrame: 630, volume: 0.8 },
      { id: 'sfx-cta-success', preset: 'success', triggerFrame: 650, volume: 0.95 },
    ];
  }, []);

  return (
    <SocialMediaAdvertisementTemplate
      id="AkademiCompetitionRelaunch"
      title="Akademi Competition Relaunch Advertisement"
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={840}
      platform="reels"
      scenes={scenes}
      backgroundMusic={backgroundMusic}
      soundEffects={soundEffects}
      showBackgroundParticles={showBackgroundParticles}
      background={background}
      debug={debug}
    />
  );
};
