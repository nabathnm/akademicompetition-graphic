/**
 * SceneSequence Showcase
 * Interactive motion graphics playground demonstrating SceneSequence:
 * - Two scenes in sequence
 * - Multiple scenes with different durations
 * - Scenes with configured delays between them
 * - Scenes with entrance and exit transitions
 * - A longer commercial advertisement pipeline containing several Scene Library components
 */

import React, { useMemo, useState } from 'react';
import {
  Film,
  Clock,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { Colors } from '../../styles/colors.ts';
import { Typography } from '../../styles/typography.ts';
import { SceneSequence } from '../../components/scenes/SceneSequence.tsx';
import { HeroScene } from '../../components/scenes/HeroScene.tsx';
import { ProductShowcaseScene } from '../../components/scenes/ProductShowcaseScene.tsx';
import { FeatureHighlightScene } from '../../components/scenes/FeatureHighlightScene.tsx';
import { CallToActionScene } from '../../components/scenes/CallToActionScene.tsx';
import { OutroScene } from '../../components/scenes/OutroScene.tsx';
import { SmartphoneMockup } from '../../components/mockups/SmartphoneMockup.tsx';
import type {
  SceneSequenceItemConfig,
  SceneTransitionConfig,
  SceneTransitionType,
} from '../../components/scenes/types.ts';

export type SequenceDemoPreset =
  | 'two-scenes'
  | 'different-durations'
  | 'with-delays'
  | 'with-transitions'
  | 'full-sequence';

export const SceneSequenceShowcase: React.FC = () => {
  // Controls state
  const [preset, setPreset] = useState<SequenceDemoPreset>('two-scenes');
  const [debugHud, setDebugHud] = useState<boolean>(true);
  const [allowOverlap, setAllowOverlap] = useState<boolean>(false);
  const [activeTransition, setActiveTransition] = useState<SceneTransitionType>('fade');

  // Shared mock screen for mockups
  const mockScreen = (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #091224 0%, #172a4d 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        color: '#ffffff',
        fontFamily: Typography.fontFamily.sans,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: `linear-gradient(135deg, ${Colors.accent.cyan}, ${Colors.accent.electricViolet})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}
      >
        <Sparkles size={24} color="#ffffff" />
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Nova Mobile 2.0</div>
      <div style={{ fontSize: 12, color: Colors.text.secondary }}>Next-Gen Cloud Workflow</div>
    </div>
  );

  // Transition config
  const transitionConfig: SceneTransitionConfig = useMemo(() => {
    return {
      type: activeTransition,
      durationInFrames: 15,
      direction: 'left',
    };
  }, [activeTransition]);

  // Generate sequence configurations based on active preset
  const scenes: SceneSequenceItemConfig[] = useMemo(() => {
    switch (preset) {
      case 'two-scenes':
        return [
          {
            id: 'intro-hero',
            name: '1. Brand Hero Intro',
            durationInFrames: 75,
            component: (
              <HeroScene
                headline="Build Fast. Ship Faster."
                subtitle="The next generation video motion graphics framework for commercial advertisements."
                eyebrow="REMOTION STUDIO 2026"
                cta="Explore Framework"
                layout="split-left"
                backgroundColor="#030712"
                heroVisual={
                  <SmartphoneMockup
                    model="flagship"
                    deviceColor="space-black"
                    screenContent={mockScreen}
                    floating={true}
                  />
                }
              />
            ),
          },
          {
            id: 'conversion-cta',
            name: '2. Call To Action',
            durationInFrames: 75,
            component: (
              <CallToActionScene
                headline="Start Creating in Seconds"
                description="Harness declarative React and deterministic timeline rendering today."
                primaryAction="Launch Studio Now"
                secondaryAction="Documentation"
                brand="AGY MOTION SYSTEM"
                layout="centered"
                backgroundColor="#020617"
              />
            ),
          },
        ];

      case 'different-durations':
        return [
          {
            id: 'teaser-hero',
            name: '1. Fast Teaser (40f)',
            durationInFrames: 40,
            component: (
              <HeroScene
                headline="Ultra Dynamic."
                subtitle="Hyper fast kinetic motion typography."
                eyebrow="LIGHTNING SPEED"
                layout="centered"
                backgroundColor="#030712"
              />
            ),
          },
          {
            id: 'deep-dive-product',
            name: '2. Deep Product Showcase (80f)',
            durationInFrames: 80,
            component: (
              <ProductShowcaseScene
                title="Flagship Workstation"
                subtitle="Designed for modern video engineering"
                description="8K canvas capabilities, deterministic spring kinematics, and instantaneous code-first previews."
                label="ENGINEERING EXCELLENCE"
                layout="product-right"
                backgroundColor="#0b1120"
                productVisual={
                  <SmartphoneMockup
                    model="flagship"
                    deviceColor="space-black"
                    screenContent={mockScreen}
                    floating={true}
                  />
                }
              />
            ),
          },
          {
            id: 'quick-outro',
            name: '3. Quick Outro (30f)',
            durationInFrames: 30,
            component: (
              <OutroScene
                brandName="NovaMotion"
                tagline="Precision motion code."
                website="novamotion.dev"
                layout="centered-brand"
                backgroundColor="#020617"
              />
            ),
          },
        ];

      case 'with-delays':
        return [
          {
            id: 'delay-scene-1',
            name: '1. Scene Alpha (45f)',
            durationInFrames: 45,
            component: (
              <HeroScene
                headline="Act One: The Challenge"
                subtitle="Traditional video authoring is fragmented and slow."
                eyebrow="PROLOGUE"
                layout="centered"
                backgroundColor="#030712"
              />
            ),
          },
          {
            id: 'delay-scene-2',
            name: '2. Scene Beta [Delay: 15f] (45f)',
            durationInFrames: 45,
            delayBefore: 15,
            component: (
              <FeatureHighlightScene
                title="Zero-Latency Sequences"
                description="Remotion Sequence elements isolate scene frames seamlessly with zero timing drift."
                label="CORE INNOVATION"
                benefit="100% frame-deterministic timeline sync"
                layout="text-left"
                backgroundColor="#0f172a"
              />
            ),
          },
          {
            id: 'delay-scene-3',
            name: '3. Scene Gamma [Delay: 15f] (30f)',
            durationInFrames: 30,
            delayBefore: 15,
            component: (
              <CallToActionScene
                headline="Ready to Elevate?"
                description="Step into the future of programmatic video generation."
                primaryAction="Get Started Free"
                brand="AGY PLATFORM"
                layout="centered"
                backgroundColor="#020617"
              />
            ),
          },
        ];

      case 'with-transitions':
        return [
          {
            id: 'trans-hero',
            name: `1. Hero (${activeTransition.toUpperCase()})`,
            durationInFrames: 50,
            transition: transitionConfig,
            component: (
              <HeroScene
                headline="Smooth Scene Transitions"
                subtitle="Fade, slide, zoom, and wipe between scenes effortlessly."
                eyebrow="LAYER 2 INTEGRATION"
                layout="centered"
                backgroundColor="#030712"
              />
            ),
          },
          {
            id: 'trans-feature',
            name: `2. Feature (${activeTransition.toUpperCase()})`,
            durationInFrames: 50,
            transition: transitionConfig,
            component: (
              <FeatureHighlightScene
                title="Kinetic Flow"
                description="Layer 2 transition wrappers automatically frame incoming and outgoing scene content."
                label="TRANSITION ENGINE"
                benefit="Smooth visual continuity across scene cuts"
                layout="text-right"
                backgroundColor="#090d16"
              />
            ),
          },
          {
            id: 'trans-cta',
            name: `3. CTA (${activeTransition.toUpperCase()})`,
            durationInFrames: 50,
            transition: transitionConfig,
            component: (
              <CallToActionScene
                headline="Seamless Transitions"
                description="Zero manual CSS keyframes or non-deterministic timers."
                primaryAction="Explore Transitions"
                brand="REMOTION"
                layout="centered"
                backgroundColor="#020617"
              />
            ),
          },
        ];

      case 'full-sequence':
      default:
        return [
          {
            id: 'full-hero',
            name: '1. Brand Intro (35f)',
            durationInFrames: 35,
            transition: { type: 'fade', durationInFrames: 10 },
            component: (
              <HeroScene
                headline="Introducing Nova"
                subtitle="The intelligent creative engine for modern digital products."
                eyebrow="COMMERCIAL RELEASE"
                layout="centered"
                backgroundColor="#030712"
              />
            ),
          },
          {
            id: 'full-product',
            name: '2. Flagship Product (35f)',
            durationInFrames: 35,
            transition: { type: 'fade', durationInFrames: 10 },
            component: (
              <ProductShowcaseScene
                title="Nova Studio Pro"
                subtitle="Infinite generative canvas"
                description="Automate high-impact motion campaigns directly from programmatic APIs."
                label="PRODUCT SUITE"
                layout="product-left"
                backgroundColor="#080e1a"
                productVisual={
                  <SmartphoneMockup
                    model="flagship"
                    deviceColor="space-black"
                    screenContent={mockScreen}
                    floating={true}
                  />
                }
              />
            ),
          },
          {
            id: 'full-feature',
            name: '3. Core Feature (30f)',
            durationInFrames: 30,
            transition: { type: 'fade', durationInFrames: 10 },
            component: (
              <FeatureHighlightScene
                title="Continuous Render Speed"
                description="Engineered on WebAssembly and Chromium headless rendering pipelines."
                label="PERFORMANCE"
                benefit="Up to 10x faster export than legacy NLEs"
                layout="text-right"
                backgroundColor="#0c1322"
              />
            ),
          },
          {
            id: 'full-cta',
            name: '4. Conversion Action (30f)',
            durationInFrames: 30,
            transition: { type: 'fade', durationInFrames: 10 },
            component: (
              <CallToActionScene
                headline="Join 50,000+ Creators"
                description="Start building your first dynamic video pipeline today."
                primaryAction="Start Free Trial"
                brand="NOVA MOTION"
                layout="centered"
                backgroundColor="#030712"
              />
            ),
          },
          {
            id: 'full-outro',
            name: '5. Brand Outro (20f)',
            durationInFrames: 20,
            transition: { type: 'fade', durationInFrames: 10 },
            component: (
              <OutroScene
                brandName="Nova Creative"
                tagline="Create without limits."
                website="nova.creative"
                socialHandle="@novacreative"
                layout="centered-brand"
                backgroundColor="#010409"
              />
            ),
          },
        ];
    }
  }, [preset, activeTransition, transitionConfig]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#02050e',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Controls Bar */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          right: 16,
          zIndex: 1000,
          backgroundColor: 'rgba(9, 14, 26, 0.88)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${Colors.border.default}`,
          borderRadius: 12,
          padding: '12px 18px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          fontFamily: Typography.fontFamily.sans,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}
      >
        {/* Preset Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              color: Colors.accent.cyan,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              marginRight: 6,
            }}
          >
            <Film size={14} /> Presets:
          </span>

          {(
            [
              ['two-scenes', 'Two Scenes'],
              ['different-durations', 'Different Durations'],
              ['with-delays', 'With Delays'],
              ['with-transitions', 'Transitions'],
              ['full-sequence', 'Full Sequence'],
            ] as const
          ).map(([key, label]) => {
            const isSelected = preset === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setPreset(key)}
                style={{
                  backgroundColor: isSelected ? Colors.accent.cyan : 'rgba(255,255,255,0.06)',
                  color: isSelected ? '#000000' : Colors.text.primary,
                  border: `1px solid ${isSelected ? Colors.accent.cyan : Colors.border.default}`,
                  borderRadius: 6,
                  padding: '5px 10px',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Feature Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {preset === 'with-transitions' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 11, color: Colors.text.secondary }}>Transition:</span>
              {(['fade', 'slide', 'zoom', 'wipe'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setActiveTransition(t)}
                  style={{
                    backgroundColor: activeTransition === t ? Colors.accent.electricViolet : 'rgba(255,255,255,0.06)',
                    color: activeTransition === t ? '#ffffff' : Colors.text.secondary,
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 4,
                    padding: '3px 8px',
                    fontSize: 10,
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => setAllowOverlap(!allowOverlap)}
            style={{
              backgroundColor: allowOverlap ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.06)',
              color: allowOverlap ? '#f87171' : Colors.text.secondary,
              border: `1px solid ${allowOverlap ? '#ef4444' : Colors.border.default}`,
              borderRadius: 6,
              padding: '5px 10px',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <ShieldAlert size={12} /> Overlap: {allowOverlap ? 'Allowed' : 'Prevented'}
          </button>

          <button
            type="button"
            onClick={() => setDebugHud(!debugHud)}
            style={{
              backgroundColor: debugHud ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.06)',
              color: debugHud ? '#34d399' : Colors.text.secondary,
              border: `1px solid ${debugHud ? '#10b981' : Colors.border.default}`,
              borderRadius: 6,
              padding: '5px 10px',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <Clock size={12} /> Debug HUD
          </button>
        </div>
      </div>

      {/* Main Orchestrated Sequence Container */}
      <div style={{ flex: 1, width: '100%', height: '100%', position: 'relative' }}>
        <SceneSequence
          scenes={scenes}
          allowOverlap={allowOverlap}
          debug={debugHud}
        />
      </div>
    </div>
  );
};
