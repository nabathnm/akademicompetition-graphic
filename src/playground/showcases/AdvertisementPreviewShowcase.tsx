/**
 * AdvertisementPreview Showcase
 * Interactive motion graphics playground demonstrating:
 * - Minimal two-scene composition assembly
 * - Multi-scene commercial sequence (Hero, Features, Comparison, Outro)
 * - Seamless transitions between sequential scenes (Fade, Slide, Wipe)
 * - Layered audio integration (BackgroundMusic + SoundEffect cues)
 * - Global animation pacing and reduced-motion static preview
 *
 * Layer 4 of the Motion Graphics Framework.
 */

import React, { useMemo, useState } from 'react';
import {
  EyeOff,
  FastForward,
  Film,
  Layers,
  Monitor,
  Music,
  Sparkles,
} from 'lucide-react';
import { Colors } from '../../styles/colors.ts';
import { Typography } from '../../styles/typography.ts';
import { AdvertisementPreview } from '../../compositions/advertisements/AdvertisementPreview.tsx';
import type { SceneSequenceItemConfig } from '../../components/scenes/types.ts';
import { SceneContainer } from '../../components/scenes/SceneContainer.tsx';
import { SILENT_AUDIO_DATA_URI } from '../../components/audio/audioTrackStyle.ts';

export type PreviewDemoPreset =
  | 'minimal-two-scene'
  | 'multi-scene-flow'
  | 'audiovisual-mix'
  | 'fast-commercial'
  | 'reduced-motion';

export const AdvertisementPreviewShowcase: React.FC = () => {
  // Preset state
  const [preset, setPreset] = useState<PreviewDemoPreset>('multi-scene-flow');

  // Interactive preview toggles
  const [showSafeArea, setShowSafeArea] = useState<boolean>(true);
  const [showDebugHud, setShowDebugHud] = useState<boolean>(true);
  const [showTimelineRuler, setShowTimelineRuler] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  // Apply preset configs
  const applyPreset = (newPreset: PreviewDemoPreset) => {
    setPreset(newPreset);
    switch (newPreset) {
      case 'minimal-two-scene':
        setSpeedMultiplier(1.0);
        setReducedMotion(false);
        break;

      case 'multi-scene-flow':
        setSpeedMultiplier(1.0);
        setReducedMotion(false);
        break;

      case 'audiovisual-mix':
        setSpeedMultiplier(1.0);
        setReducedMotion(false);
        break;

      case 'fast-commercial':
        setSpeedMultiplier(1.5);
        setReducedMotion(false);
        break;

      case 'reduced-motion':
        setSpeedMultiplier(1.0);
        setReducedMotion(true);
        break;
    }
  };

  // Mock scenes for the active preset
  const previewScenes: SceneSequenceItemConfig[] = useMemo(() => {
    switch (preset) {
      case 'minimal-two-scene':
        return [
          {
            id: 'scene-hero',
            durationInFrames: 50,
            transition: { type: 'fade', durationInFrames: 15 },
            scene: (
              <SceneContainer
                sceneId="scene-hero"
                background="linear-gradient(135deg, #0A0F1D 0%, #1E1B4B 100%)"
                layout="centered"
              >
                <div style={{ textAlign: 'center', padding: 32 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#818CF8', letterSpacing: '0.1em' }}>
                    SCENE 01 · HERO HEADLINE
                  </span>
                  <h2 style={{ fontSize: 36, fontWeight: 800, color: '#F8FAFC', margin: '12px 0 8px 0' }}>
                    Next-Gen Motion Framework
                  </h2>
                  <p style={{ fontSize: 16, color: '#94A3B8', maxWidth: 480, margin: '0 auto' }}>
                    High-performance deterministic animation pipeline powered by Remotion.
                  </p>
                </div>
              </SceneContainer>
            ),
          },
          {
            id: 'scene-cta',
            durationInFrames: 50,
            scene: (
              <SceneContainer
                sceneId="scene-cta"
                background="linear-gradient(135deg, #0F172A 0%, #064E3B 100%)"
                layout="centered"
              >
                <div style={{ textAlign: 'center', padding: 32 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#34D399', letterSpacing: '0.1em' }}>
                    SCENE 02 · CALL TO ACTION
                  </span>
                  <h2 style={{ fontSize: 36, fontWeight: 800, color: '#F8FAFC', margin: '12px 0 16px 0' }}>
                    Get Started Today
                  </h2>
                  <div
                    style={{
                      display: 'inline-block',
                      padding: '12px 28px',
                      borderRadius: 8,
                      backgroundColor: '#10B981',
                      color: '#000000',
                      fontWeight: 700,
                      fontSize: 15,
                    }}
                  >
                    Start Free Trial
                  </div>
                </div>
              </SceneContainer>
            ),
          },
        ];

      case 'multi-scene-flow':
      case 'audiovisual-mix':
      case 'fast-commercial':
      case 'reduced-motion':
      default:
        return [
          {
            id: '01-hero',
            durationInFrames: 45,
            transition: { type: 'slide', durationInFrames: 14, direction: 'left' },
            scene: (
              <SceneContainer
                sceneId="01-hero"
                background="linear-gradient(135deg, #090D16 0%, #1E1B4B 100%)"
                layout="centered"
              >
                <div style={{ textAlign: 'center', padding: 24 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#818CF8' }}>
                    ACT I · PRODUCT HERO
                  </span>
                  <h2 style={{ fontSize: 32, fontWeight: 800, color: '#F8FAFC', margin: '8px 0' }}>
                    The Advertising Engine
                  </h2>
                  <p style={{ fontSize: 14, color: '#94A3B8' }}>
                    Deterministic scene orchestration at 60 FPS
                  </p>
                </div>
              </SceneContainer>
            ),
          },
          {
            id: '02-features',
            durationInFrames: 45,
            transition: { type: 'wipe', durationInFrames: 14, direction: 'leftToRight' },
            scene: (
              <SceneContainer
                sceneId="02-features"
                background="linear-gradient(135deg, #0B1329 0%, #064E3B 100%)"
                layout="centered"
              >
                <div style={{ textAlign: 'center', padding: 24 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#34D399' }}>
                    ACT II · KEY HIGHLIGHTS
                  </span>
                  <h2 style={{ fontSize: 32, fontWeight: 800, color: '#F8FAFC', margin: '8px 0' }}>
                    Synchronized Audio & Visuals
                  </h2>
                  <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 12 }}>
                    <span style={{ fontSize: 12, color: '#A7F3D0', backgroundColor: 'rgba(16, 185, 129, 0.2)', padding: '4px 10px', borderRadius: 6 }}>
                      Multi-Track Ducking
                    </span>
                    <span style={{ fontSize: 12, color: '#A7F3D0', backgroundColor: 'rgba(16, 185, 129, 0.2)', padding: '4px 10px', borderRadius: 6 }}>
                      Event Sound Effects
                    </span>
                  </div>
                </div>
              </SceneContainer>
            ),
          },
          {
            id: '03-comparison',
            durationInFrames: 45,
            transition: { type: 'zoom', durationInFrames: 14 },
            scene: (
              <SceneContainer
                sceneId="03-comparison"
                background="linear-gradient(135deg, #180D2B 0%, #4C1D95 100%)"
                layout="centered"
              >
                <div style={{ textAlign: 'center', padding: 24 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#C084FC' }}>
                    ACT III · PERFORMANCE
                  </span>
                  <h2 style={{ fontSize: 32, fontWeight: 800, color: '#F8FAFC', margin: '8px 0' }}>
                    10x Faster Video Rendering
                  </h2>
                  <p style={{ fontSize: 14, color: '#DDD6FE' }}>
                    Cloud-native parallel composition pipeline
                  </p>
                </div>
              </SceneContainer>
            ),
          },
          {
            id: '04-outro',
            durationInFrames: 45,
            scene: (
              <SceneContainer
                sceneId="04-outro"
                background="linear-gradient(135deg, #111827 0%, #030712 100%)"
                layout="centered"
              >
                <div style={{ textAlign: 'center', padding: 24 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#F59E0B' }}>
                    ACT IV · BRAND OUTRO
                  </span>
                  <h2 style={{ fontSize: 32, fontWeight: 800, color: '#F8FAFC', margin: '8px 0 16px 0' }}>
                    Remotion Advertising Suite
                  </h2>
                  <div
                    style={{
                      display: 'inline-block',
                      padding: '10px 24px',
                      borderRadius: 8,
                      backgroundColor: '#3B82F6',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    Build Your Campaign
                  </div>
                </div>
              </SceneContainer>
            ),
          },
        ];
    }
  }, [preset]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#090D16',
        color: '#F8FAFC',
        fontFamily: Typography.fontFamily.sans,
        padding: '32px 40px',
        boxSizing: 'border-box',
      }}
    >
      {/* 1. Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div
            style={{
              padding: 6,
              borderRadius: 8,
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              color: '#3B82F6',
            }}
          >
            <Film size={20} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
            AdvertisementPreview Studio Player
          </h1>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 12,
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              color: '#3B82F6',
              letterSpacing: '0.05em',
            }}
          >
            LAYER 4 ASSEMBLY PREVIEW
          </span>
        </div>
        <p style={{ margin: 0, color: Colors.text.tertiary, fontSize: 14 }}>
          Unified studio preview entry point assembling multi-scene compositions, transitions,
          background score, sound effects, and safe area guides with complete temporal consistency.
        </p>
      </div>

      {/* 2. Preset Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
        {(
          [
            { id: 'multi-scene-flow', label: 'Multi-Scene Commercial (4 Acts)', icon: Layers },
            { id: 'minimal-two-scene', label: 'Minimal Two-Scene (Hero + CTA)', icon: Monitor },
            { id: 'audiovisual-mix', label: 'Audiovisual (BGM + SFX Chimes)', icon: Music },
            { id: 'fast-commercial', label: 'High Pacing (1.5x Speed)', icon: FastForward },
            { id: 'reduced-motion', label: 'Reduced Motion Preview', icon: EyeOff },
          ] as const
        ).map((item) => {
          const Icon = item.icon;
          const isSelected = preset === item.id;
          return (
            <button
              key={item.id}
              onClick={() => applyPreset(item.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: isSelected ? 600 : 500,
                backgroundColor: isSelected ? '#3B82F6' : 'rgba(255, 255, 255, 0.04)',
                color: isSelected ? '#FFFFFF' : '#CBD5E1',
                border: isSelected ? '1px solid transparent' : '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={14} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* 3. Controls Panel */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: 16,
          marginBottom: 24,
          padding: 16,
          backgroundColor: '#0F172A',
          borderRadius: 12,
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Speed Multiplier */}
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: Colors.text.tertiary, marginBottom: 6 }}>
            ANIMATION PACING ({speedMultiplier}x)
          </label>
          <select
            value={speedMultiplier}
            onChange={(e) => setSpeedMultiplier(Number(e.target.value))}
            style={{
              width: '100%',
              padding: '6px 10px',
              borderRadius: 6,
              backgroundColor: '#1E293B',
              color: '#F8FAFC',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: 13,
            }}
          >
            <option value={0.75}>0.75x (Cinematic)</option>
            <option value={1.0}>1.0x (Standard)</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x (Fast Spot)</option>
            <option value={2.0}>2.0x (Rapid)</option>
          </select>
        </div>

        {/* Viewport Toggles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12 }}>
            <input
              type="checkbox"
              checked={showSafeArea}
              onChange={(e) => setShowSafeArea(e.target.checked)}
              style={{ accentColor: '#3B82F6' }}
            />
            <span style={{ color: showSafeArea ? '#3B82F6' : '#CBD5E1' }}>Safe Area Guides (60px)</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12 }}>
            <input
              type="checkbox"
              checked={showDebugHud}
              onChange={(e) => setShowDebugHud(e.target.checked)}
              style={{ accentColor: Colors.accent.emerald }}
            />
            <span style={{ color: showDebugHud ? Colors.accent.emerald : '#CBD5E1' }}>Telemetry Diagnostics HUD</span>
          </label>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12 }}>
            <input
              type="checkbox"
              checked={showTimelineRuler}
              onChange={(e) => setShowTimelineRuler(e.target.checked)}
              style={{ accentColor: Colors.accent.electricViolet }}
            />
            <span style={{ color: showTimelineRuler ? Colors.accent.electricViolet : '#CBD5E1' }}>
              Timeline Scrubber Ruler
            </span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12 }}>
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={(e) => setReducedMotion(e.target.checked)}
              style={{ accentColor: '#EF4444' }}
            />
            <span style={{ color: reducedMotion ? '#EF4444' : '#CBD5E1' }}>Reduced Motion Mode</span>
          </label>
        </div>
      </div>

      {/* 4. Assembled Preview Canvas Viewport */}
      <div
        style={{
          width: '100%',
          height: 480,
          backgroundColor: '#000000',
          borderRadius: 16,
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7)',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: 24,
        }}
      >
        <AdvertisementPreview
          width={1920}
          height={1080}
          title={preset === 'minimal-two-scene' ? 'Minimal 2-Scene Spot' : 'Full Commercial Showcase'}
          compositionId={preset}
          scenes={previewScenes}
          animation={{
            speedMultiplier,
            reducedMotion,
            defaultTransitionDuration: 14,
          }}
          backgroundMusic={
            preset === 'audiovisual-mix'
              ? {
                  src: SILENT_AUDIO_DATA_URI,
                  volume: 0.75,
                  fadeInFrames: 15,
                  fadeOutFrames: 25,
                  toneFrequency: 240,
                }
              : undefined
          }
          soundEffects={
            preset === 'audiovisual-mix'
              ? [
                  { triggerFrame: 10, preset: 'whoosh' },
                  { triggerFrame: 45, preset: 'ui-click' },
                  { triggerFrame: 90, preset: 'notification' },
                  { triggerFrame: 135, preset: 'success' },
                ]
              : undefined
          }
          safeArea={showSafeArea}
          debug={showDebugHud}
          showTimeline={showTimelineRuler}
          style={{
            transform: 'scale(0.44)',
            transformOrigin: 'top left',
            width: 1920,
            height: 1080,
          }}
        />
      </div>

      {/* 5. Architecture Highlights */}
      <div
        style={{
          padding: 20,
          backgroundColor: '#0F172A',
          borderRadius: 12,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          fontSize: 13,
          lineHeight: 1.6,
          color: Colors.text.tertiary,
        }}
      >
        <div style={{ color: '#F8FAFC', fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={16} color="#3B82F6" />
          AdvertisementPreview Architecture Highlights:
        </div>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>
            <strong>Deterministic Parity:</strong> Renders directly through <code>&lt;AdvertisementComposition&gt;</code>, ensuring 100% visual and temporal match with final Remotion MP4 exports.
          </li>
          <li>
            <strong>Integrated Pipeline:</strong> Coordinates <code>SceneSequence</code>, scene transitions, <code>BackgroundMusic</code>, <code>SoundEffectGroup</code>, and <code>GlobalAnimationConfig</code> in a unified declarative API.
          </li>
          <li>
            <strong>Development-Time Diagnostics:</strong> Displays frame-accurate SMPTE timecode, scene boundary monitors, broadcast safe area overlays, and actionable validation feedback.
          </li>
          <li>
            <strong>Safe Fallback Guidance:</strong> Presents a clean, helpful onboarding state when scenes are not yet specified, preventing blank black screen confusion.
          </li>
        </ul>
      </div>
    </div>
  );
};
