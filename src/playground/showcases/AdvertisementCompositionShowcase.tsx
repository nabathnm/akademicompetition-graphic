/**
 * AdvertisementComposition Showcase
 * Interactive motion graphics playground demonstrating AdvertisementComposition:
 * - Multi-scene assembly pipeline (HeroScene -> FeatureHighlightScene -> CallToActionScene)
 * - Custom backgrounds and spotlight backdrops
 * - Audio layer integration with deterministic volume fades
 * - Broadcast safe area margins and live telemetry debugging HUD
 */

import React, { useMemo, useState } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Film,
  Layers,
  Sparkles,
  Shield,
} from 'lucide-react';
import { Colors } from '../../styles/colors.ts';
import { Typography } from '../../styles/typography.ts';
import { Spacing } from '../../styles/spacing.ts';
import { AdvertisementComposition } from '../../compositions/advertisements/AdvertisementComposition.tsx';
import { HeroScene } from '../../components/scenes/HeroScene.tsx';
import { FeatureHighlightScene } from '../../components/scenes/FeatureHighlightScene.tsx';
import { CallToActionScene } from '../../components/scenes/CallToActionScene.tsx';
import { SmartphoneMockup } from '../../components/mockups/SmartphoneMockup.tsx';
import type { SceneItemConfig } from '../../compositions/types.ts';

export const AdvertisementCompositionShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // State
  const [preset, setPreset] = useState<'multi-scene' | 'custom-bg' | 'basic' | 'global-config'>('multi-scene');
  const [safeArea, setSafeArea] = useState<boolean>(true);
  const [debugHud, setDebugHud] = useState<boolean>(true);
  const [bgStyle, setBgStyle] = useState<'gradient' | 'spotlight' | 'dark'>('gradient');

  // Background resolution
  const resolvedBg = useMemo(() => {
    switch (bgStyle) {
      case 'spotlight':
        return 'radial-gradient(circle at 50% 20%, #112347 0%, #03050c 100%)';
      case 'gradient':
        return 'linear-gradient(135deg, #091326 0%, #040711 50%, #0c1833 100%)';
      case 'dark':
      default:
        return '#040711';
    }
  }, [bgStyle]);

  // Multi-scene sequence definition
  const demoScenes: SceneItemConfig[] = useMemo(() => {
    return [
      {
        id: 'scene-1-hero',
        name: 'Hero Introduction',
        durationInFrames: 50,
        component: (
          <HeroScene
            headline="Autonomous Video Intelligence"
            subtitle="Commercial Engine v4"
            eyebrow="INTRODUCING"
            layout="split-left"
            safeArea={false}
            padding={16}
            style={{ width: '100%', height: '100%' }}
          >
            <div style={{ transform: 'scale(0.72)', transformOrigin: 'center' }}>
              <SmartphoneMockup
                width={240}
                height={480}
                deviceColor="#0d1424"
                animate={false}
                screenContent={
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#050a16',
                      padding: 16,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ fontSize: 10, color: Colors.accent.cyan, fontWeight: 700 }}>
                      SYSTEM ONLINE
                    </div>
                    <div style={{ fontSize: 16, color: '#ffffff', fontWeight: 800 }}>
                      Antigravity 4.0
                    </div>
                  </div>
                }
              />
            </div>
          </HeroScene>
        ),
      },
      {
        id: 'scene-2-features',
        name: 'Feature Spotlight',
        durationInFrames: 50,
        component: (
          <FeatureHighlightScene
            title="Sub-Frame Accuracy"
            description="Eliminate browser timer drift with 100% deterministic React rendering."
            benefit="120 FPS Fidelity"
            label="PERFORMANCE"
            layout="text-left"
            safeArea={false}
            padding={16}
            style={{ width: '100%', height: '100%' }}
          >
            <div
              style={{
                width: 320,
                height: 220,
                backgroundColor: '#09152b',
                border: `1px solid ${Colors.accent.cyan}50`,
                borderRadius: 16,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: `0 0 32px ${Colors.accent.cyan}20`,
              }}
            >
              <div style={{ fontSize: 12, color: Colors.accent.cyan, fontWeight: 700 }}>
                ● HARDWARE SYNC
              </div>
              <div style={{ fontSize: 32, color: '#ffffff', fontWeight: 850, marginTop: 8 }}>
                0.0 ms
              </div>
              <div style={{ fontSize: 11, color: Colors.text.tertiary, marginTop: 4 }}>
                Zero Frame Drop Tolerance
              </div>
            </div>
          </FeatureHighlightScene>
        ),
      },
      {
        id: 'scene-3-cta',
        name: 'Conversion Action',
        durationInFrames: 50,
        component: (
          <CallToActionScene
            brand="START TODAY"
            headline="Synthesize Video at Scale"
            description="Transform code into high-conversion commercial video assets."
            primaryAction={{
              label: 'Launch Framework',
              variant: 'primary',
            }}
            layout="centered"
            safeArea={false}
            padding={16}
            style={{ width: '100%', height: '100%' }}
          />
        ),
      },
    ];
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: Spacing.scale.lg,
        width: '100%',
        backgroundColor: Colors.dark.surface1,
        borderRadius: Spacing.radius.lg,
        padding: Spacing.scale.xl,
        border: `1px solid ${Colors.border.default}`,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: Spacing.scale.md,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.sm }}>
            <Film size={20} color={Colors.accent.cyan} />
            <span
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: Colors.text.primary,
                fontFamily: Typography.fontFamily.sans,
              }}
            >
              AdvertisementComposition
            </span>
            <span
              style={{
                fontSize: 10,
                fontFamily: Typography.fontFamily.mono,
                backgroundColor: `${Colors.accent.cyan}20`,
                color: Colors.accent.cyan,
                padding: '2px 8px',
                borderRadius: 4,
                border: `1px solid ${Colors.accent.cyan}40`,
              }}
            >
              LAYER 4 ASSEMBLY PIPELINE
            </span>
          </div>
          <div
            style={{
              fontSize: 12,
              color: Colors.text.secondary,
              marginTop: 4,
              fontFamily: Typography.fontFamily.sans,
            }}
          >
            The root composition container orchestrating multiple scenes, audio layers, and safe areas into a unified ad video.
          </div>
        </div>

        <div
          style={{
            fontFamily: Typography.fontFamily.mono,
            fontSize: 11,
            color: Colors.text.tertiary,
            backgroundColor: Colors.dark.surface2,
            padding: '4px 10px',
            borderRadius: Spacing.radius.xs,
            border: `1px solid ${Colors.border.default}`,
          }}
        >
          FRAME {frame} / {durationInFrames} • {fps} FPS
        </div>
      </div>

      {/* Control Panel */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: Spacing.scale.md,
          backgroundColor: Colors.dark.surface2,
          padding: Spacing.scale.md,
          borderRadius: Spacing.radius.md,
          border: `1px solid ${Colors.border.default}`,
        }}
      >
        {/* Preset Mode */}
        <div>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11,
              fontFamily: Typography.fontFamily.mono,
              color: Colors.text.secondary,
              marginBottom: 6,
            }}
          >
            <Layers size={13} color={Colors.accent.cyan} />
            PIPELINE MODE
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {[
              { id: 'multi-scene', label: 'Multi-Scene' },
              { id: 'custom-bg', label: 'Custom BG' },
              { id: 'basic', label: 'Single Scene' },
              { id: 'global-config', label: 'Telemetry' },
            ].map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setPreset(btn.id as typeof preset)}
                style={{
                  padding: '4px 8px',
                  borderRadius: Spacing.radius.xs,
                  border: `1px solid ${preset === btn.id ? Colors.accent.cyan : Colors.border.default}`,
                  backgroundColor: preset === btn.id ? `${Colors.accent.cyan}25` : Colors.dark.surface1,
                  color: preset === btn.id ? Colors.accent.cyan : Colors.text.secondary,
                  fontSize: 11,
                  fontWeight: preset === btn.id ? 700 : 500,
                  cursor: 'pointer',
                  fontFamily: Typography.fontFamily.mono,
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Background Selector */}
        <div>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11,
              fontFamily: Typography.fontFamily.mono,
              color: Colors.text.secondary,
              marginBottom: 6,
            }}
          >
            <Sparkles size={13} color="#ec4899" />
            BACKGROUND
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {[
              { id: 'gradient', label: 'Gradient' },
              { id: 'spotlight', label: 'Spotlight' },
              { id: 'dark', label: 'Solid Dark' },
            ].map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setBgStyle(btn.id as typeof bgStyle)}
                style={{
                  padding: '4px 8px',
                  borderRadius: Spacing.radius.xs,
                  border: `1px solid ${bgStyle === btn.id ? '#ec4899' : Colors.border.default}`,
                  backgroundColor: bgStyle === btn.id ? '#ec489925' : Colors.dark.surface1,
                  color: bgStyle === btn.id ? '#ec4899' : Colors.text.secondary,
                  fontSize: 11,
                  fontWeight: bgStyle === btn.id ? 700 : 500,
                  cursor: 'pointer',
                  fontFamily: Typography.fontFamily.mono,
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Telemetry & Guides */}
        <div>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11,
              fontFamily: Typography.fontFamily.mono,
              color: Colors.text.secondary,
              marginBottom: 6,
            }}
          >
            <Shield size={13} color="#10b981" />
            STANDARDS & HUD
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: Colors.text.secondary }}>
              <input
                type="checkbox"
                checked={safeArea}
                onChange={(e) => setSafeArea(e.target.checked)}
              />
              Safe Area Guide (60px)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: Colors.text.secondary }}>
              <input
                type="checkbox"
                checked={debugHud}
                onChange={(e) => setDebugHud(e.target.checked)}
              />
              Telemetry HUD
            </label>
          </div>
        </div>
      </div>

      {/* Live Preview Canvas */}
      <div
        style={{
          width: '100%',
          height: 480,
          borderRadius: Spacing.radius.md,
          overflow: 'hidden',
          border: `1px solid ${Colors.border.default}`,
          backgroundColor: '#040711',
          position: 'relative',
        }}
      >
        <AdvertisementComposition
          compositionId="commercial-spot-preview"
          durationInFrames={150}
          background={resolvedBg}
          safeArea={safeArea}
          debug={debugHud}
          scenes={preset === 'multi-scene' ? demoScenes : undefined}
        >
          {preset !== 'multi-scene' && (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                gap: 16,
              }}
            >
              <div
                style={{
                  ...Typography.caption.eyebrow,
                  color: Colors.accent.cyan,
                  backgroundColor: `${Colors.accent.cyan}18`,
                  padding: '4px 12px',
                  borderRadius: 16,
                  border: `1px solid ${Colors.accent.cyan}40`,
                }}
              >
                SINGLE SCENE COMPOSITION
              </div>
              <h2 style={{ ...Typography.headline.h1, color: '#ffffff', margin: 0 }}>
                Autonomous Assembly Ready
              </h2>
              <p style={{ ...Typography.body.large, color: Colors.text.tertiary, maxWidth: 600 }}>
                This composition container standardizes timeline scheduling, audio layering, and broadcast safe areas for any combination of scenes.
              </p>
            </div>
          )}
        </AdvertisementComposition>
      </div>
    </div>
  );
};
