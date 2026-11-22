/**
 * HeroScene Showcase
 * Interactive motion graphics playground demonstrating HeroScene:
 * - Layout variations: Centered, Split Left, Split Right, Full-Screen Visual with Glassmorphism Card
 * - Different headline lengths & text hierarchy
 * - Hero visual integrations: SmartphoneMockup, LaptopMockup, and Vector Graphics
 * - Staggered kinetic typography and ambient floating decorative layers
 * - Customizable animation timing and safe area margins
 */

import React, { useState } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Sparkles,
  Smartphone,
  Laptop,
  Layers,
  Columns,
  Sliders,
  Type,
} from 'lucide-react';
import { Colors } from '../../styles/colors.ts';
import { Typography } from '../../styles/typography.ts';
import { Spacing } from '../../styles/spacing.ts';
import { HeroScene } from '../../components/scenes/HeroScene.tsx';
import { SmartphoneMockup } from '../../components/mockups/SmartphoneMockup.tsx';
import { LaptopMockup } from '../../components/mockups/LaptopMockup.tsx';
import type { HeroSceneLayout } from '../../components/scenes/types.ts';

const HEADLINE_PRESETS = [
  {
    id: 'punchy',
    label: 'Short Punchy',
    headline: 'HyperScale AI',
    subtitle: 'Next-Generation Autonomous Intelligence Engine',
    desc: 'Empowering engineering teams with real-time distributed telemetry and deterministic decision pipelines.',
  },
  {
    id: 'commercial',
    label: 'Commercial Standard',
    headline: 'Architecting The Autonomous Future',
    subtitle: 'Unified Cloud & Edge Intelligence Platform',
    desc: 'Deploy resilient machine learning models globally across distributed edge clusters with zero downtime.',
  },
  {
    id: 'editorial',
    label: 'Editorial Headline',
    headline: 'A Quantum Leap in Mobility & Spatial Computing',
    subtitle: 'Redefining Human-Machine Interactive Experience',
    desc: 'Engineered from the ground up for seamless spatial interactions, tactile micro-feedback, and unmatched visual fidelity.',
  },
];

export const HeroSceneShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // State
  const [layout, setLayout] = useState<HeroSceneLayout>('split-left');
  const [headlinePreset, setHeadlinePreset] = useState<string>('commercial');
  const [visualType, setVisualType] = useState<'smartphone' | 'laptop' | 'card'>('smartphone');
  const [staggerDelay, setStaggerDelay] = useState<number>(4);
  const [showEyebrow, setShowEyebrow] = useState<boolean>(true);
  const [showCta, setShowCta] = useState<boolean>(true);
  const [showDecorations, setShowDecorations] = useState<boolean>(true);

  const selectedText = HEADLINE_PRESETS.find((h) => h.id === headlinePreset) ?? HEADLINE_PRESETS[1];

  // Render Visual Slot
  const renderVisual = () => {
    if (visualType === 'smartphone') {
      return (
        <div style={{ transform: 'scale(0.85)', transformOrigin: 'center' }}>
          <SmartphoneMockup
            width={260}
            height={520}
            deviceColor="#090d16"
            screenContent={
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#0a101d',
                  padding: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: 10, color: Colors.accent.cyan, fontWeight: 700 }}>
                    MOBILITY LIVE
                  </div>
                  <div style={{ fontSize: 16, color: '#ffffff', fontWeight: 800, marginTop: 4 }}>
                    $128,490.00
                  </div>
                </div>
                <div style={{ height: 60, backgroundColor: '#131b2e', borderRadius: 8, padding: 8 }}>
                  <div style={{ fontSize: 9, color: Colors.text.tertiary }}>SIGNAL STREAM</div>
                  <div style={{ width: '80%', height: 4, backgroundColor: Colors.accent.cyan, marginTop: 12, borderRadius: 2 }} />
                </div>
              </div>
            }
          />
        </div>
      );
    }

    if (visualType === 'laptop') {
      return (
        <div style={{ transform: 'scale(0.75)', transformOrigin: 'center' }}>
          <LaptopMockup
            width={580}
            height={340}
            deviceColor="#0f172a"
            screenContent={
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#030712',
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, color: Colors.accent.cyan, fontFamily: Typography.fontFamily.mono }}>
                    CORE ENGINE DIAGNOSTIC
                  </span>
                  <span style={{ fontSize: 10, color: '#10b981' }}>● ONLINE</span>
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#ffffff' }}>
                  99.998% SYSTEM STABILITY
                </div>
                <div style={{ height: 8, backgroundColor: '#1e293b', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: '92%', height: '100%', backgroundColor: Colors.accent.cyan }} />
                </div>
              </div>
            }
          />
        </div>
      );
    }

    // Default Graphic Card Visual
    return (
      <div
        style={{
          width: 360,
          height: 260,
          backgroundColor: '#0f172a',
          border: `2px solid ${Colors.accent.cyan}40`,
          borderRadius: Spacing.radius.lg,
          padding: Spacing.scale.lg,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: `0 0 50px ${Colors.accent.cyan}20`,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan }}>ANALYTICS HUB</span>
          <span style={{ fontSize: 10, color: '#10b981', fontFamily: Typography.fontFamily.mono }}>REALTIME</span>
        </div>
        <div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#ffffff', letterSpacing: '-1px' }}>
            +284.6%
          </div>
          <div style={{ fontSize: 12, color: Colors.text.secondary, marginTop: 4 }}>
            Compound Network Throughput
          </div>
        </div>
        <div style={{ height: 6, backgroundColor: Colors.dark.surface2, borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ width: '85%', height: '100%', backgroundColor: Colors.accent.cyan }} />
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        backgroundColor: Colors.dark.surface1,
        borderRadius: Spacing.radius.lg,
        border: `1px solid ${Colors.border.default}`,
        padding: Spacing.scale.xl,
        display: 'flex',
        flexDirection: 'column',
        gap: Spacing.scale.xl,
      }}
    >
      {/* 1. Header & Live Telemetry Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: Spacing.scale.md }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.sm, marginBottom: 4 }}>
            <Sparkles size={20} color={Colors.accent.cyan} />
            <span style={{ ...Typography.headline.h3, color: Colors.text.primary }}>
              HeroScene
            </span>
            <span
              style={{
                fontSize: 11,
                fontFamily: Typography.fontFamily.mono,
                color: Colors.accent.cyan,
                backgroundColor: `${Colors.accent.cyan}18`,
                border: `1px solid ${Colors.accent.cyan}40`,
                padding: '2px 8px',
                borderRadius: Spacing.radius.xs,
              }}
            >
              COMMERCIAL TEMPLATE
            </span>
          </div>
          <p style={{ ...Typography.body.small, color: Colors.text.secondary, maxWidth: 640 }}>
            Flexible commercial hero scene template establishing strong visual hierarchy with kinetic typography,
            hardware mockups, staggered reveals, and ambient decorative layers.
          </p>
        </div>

        {/* Realtime Telemetry Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: Spacing.scale.md,
            backgroundColor: Colors.dark.surface2,
            padding: `${Spacing.scale.sm}px ${Spacing.scale.md}px`,
            borderRadius: Spacing.radius.sm,
            border: `1px solid ${Colors.border.default}`,
            fontFamily: Typography.fontFamily.mono,
            fontSize: 11,
          }}
        >
          <div>
            <span style={{ color: Colors.text.tertiary }}>FRAME: </span>
            <span style={{ color: Colors.accent.cyan, fontWeight: 700 }}>{frame}</span>
            <span style={{ color: Colors.text.tertiary }}> | FPS: {fps}</span>
          </div>
          <div style={{ width: 1, height: 16, backgroundColor: Colors.border.default }} />
          <div>
            <span style={{ color: Colors.text.tertiary }}>LAYOUT: </span>
            <span style={{ color: '#ec4899', fontWeight: 700 }}>{layout.toUpperCase()}</span>
          </div>
          <div style={{ width: 1, height: 16, backgroundColor: Colors.border.default }} />
          <div>
            <span style={{ color: Colors.text.tertiary }}>STAGGER: </span>
            <span style={{ color: Colors.accent.emerald, fontWeight: 700 }}>{staggerDelay}f</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Canvas Live Preview */}
      <div
        style={{
          width: '100%',
          minHeight: 380,
          backgroundColor: '#030508',
          borderRadius: Spacing.radius.md,
          border: `1px solid ${Colors.border.default}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: Spacing.scale.xl,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ width: '100%', maxWidth: 840, height: 340, position: 'relative', borderRadius: Spacing.radius.md, overflow: 'hidden' }}>
          <HeroScene
            layout={layout}
            headline={selectedText.headline}
            subtitle={selectedText.subtitle}
            description={selectedText.desc}
            eyebrow={showEyebrow ? 'ENTERPRISE INTELLIGENCE 2026' : undefined}
            cta={showCta ? 'Explore Framework →' : undefined}
            staggerDelay={staggerDelay}
            background="radial-gradient(circle at 60% 30%, rgba(6, 182, 212, 0.15) 0%, #030712 75%)"
            safeArea={false}
            padding={28}
            decorativeElements={
              showDecorations ? (
                <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                  <div
                    style={{
                      position: 'absolute',
                      top: '10%',
                      right: '15%',
                      width: 250,
                      height: 250,
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, transparent 70%)',
                      filter: 'blur(30px)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '5%',
                      left: '20%',
                      width: 200,
                      height: 200,
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%)',
                      filter: 'blur(30px)',
                    }}
                  />
                </div>
              ) : undefined
            }
          >
            {renderVisual()}
          </HeroScene>
        </div>
      </div>

      {/* 3. Controls Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: Spacing.scale.lg,
        }}
      >
        {/* Panel 1: Layout Arrangement */}
        <div
          style={{
            backgroundColor: Colors.dark.surface2,
            padding: Spacing.scale.md,
            borderRadius: Spacing.radius.sm,
            border: `1px solid ${Colors.border.default}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.xs, marginBottom: Spacing.scale.sm }}>
            <Columns size={14} color={Colors.accent.cyan} />
            <span style={{ ...Typography.caption.eyebrow, color: Colors.text.primary }}>
              LAYOUT STRUCTURE
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
            {(
              [
                { id: 'split-left', label: 'Split Left' },
                { id: 'split-right', label: 'Split Right' },
                { id: 'centered', label: 'Centered' },
                { id: 'full-screen-visual', label: 'Full Screen' },
              ] as { id: HeroSceneLayout; label: string }[]
            ).map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLayout(l.id)}
                style={{
                  padding: '6px 8px',
                  borderRadius: Spacing.radius.xs,
                  border: `1px solid ${layout === l.id ? Colors.accent.cyan : Colors.border.default}`,
                  backgroundColor: layout === l.id ? `${Colors.accent.cyan}25` : Colors.dark.surface1,
                  color: layout === l.id ? Colors.accent.cyan : Colors.text.secondary,
                  fontFamily: Typography.fontFamily.mono,
                  fontSize: 10,
                  fontWeight: layout === l.id ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Visual slot selector */}
          <div style={{ marginTop: Spacing.scale.md }}>
            <div style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary, marginBottom: 4 }}>
              HERO VISUAL SLOT
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[
                { id: 'smartphone', label: 'Phone', icon: Smartphone },
                { id: 'laptop', label: 'Laptop', icon: Laptop },
                { id: 'card', label: 'Card', icon: Layers },
              ].map((v) => {
                const IconComponent = v.icon;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVisualType(v.id as typeof visualType)}
                    style={{
                      flex: 1,
                      padding: '5px 6px',
                      borderRadius: Spacing.radius.xs,
                      border: `1px solid ${visualType === v.id ? '#ec4899' : Colors.border.default}`,
                      backgroundColor: visualType === v.id ? 'rgba(236, 72, 153, 0.15)' : Colors.dark.surface1,
                      color: visualType === v.id ? '#ec4899' : Colors.text.secondary,
                      fontSize: 10,
                      fontFamily: Typography.fontFamily.mono,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4,
                      cursor: 'pointer',
                    }}
                  >
                    <IconComponent size={12} />
                    <span>{v.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Panel 2: Text Length & Presets */}
        <div
          style={{
            backgroundColor: Colors.dark.surface2,
            padding: Spacing.scale.md,
            borderRadius: Spacing.radius.sm,
            border: `1px solid ${Colors.border.default}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.xs, marginBottom: Spacing.scale.sm }}>
            <Type size={14} color={Colors.accent.cyan} />
            <span style={{ ...Typography.caption.eyebrow, color: Colors.text.primary }}>
              HEADLINE PRESET
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {HEADLINE_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setHeadlinePreset(p.id)}
                style={{
                  padding: '6px 10px',
                  borderRadius: Spacing.radius.xs,
                  border: `1px solid ${headlinePreset === p.id ? Colors.accent.cyan : Colors.border.default}`,
                  backgroundColor: headlinePreset === p.id ? `${Colors.accent.cyan}20` : Colors.dark.surface1,
                  color: headlinePreset === p.id ? Colors.accent.cyan : Colors.text.secondary,
                  fontSize: 11,
                  fontFamily: Typography.fontFamily.mono,
                  display: 'flex',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                }}
              >
                <span>{p.label}</span>
                {headlinePreset === p.id && <span style={{ color: Colors.accent.cyan }}>● ACTIVE</span>}
              </button>
            ))}
          </div>

          {/* Stagger Delay Buttons */}
          <div style={{ marginTop: Spacing.scale.md }}>
            <div style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary, marginBottom: 4 }}>
              STAGGER DELAY: {staggerDelay}f
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[2, 4, 6, 8].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setStaggerDelay(d)}
                  style={{
                    flex: 1,
                    padding: '4px 6px',
                    borderRadius: Spacing.radius.xs,
                    border: `1px solid ${staggerDelay === d ? Colors.accent.emerald : Colors.border.default}`,
                    backgroundColor: staggerDelay === d ? Colors.dark.surface3 : Colors.dark.surface1,
                    color: staggerDelay === d ? Colors.accent.emerald : Colors.text.secondary,
                    fontSize: 10,
                    cursor: 'pointer',
                  }}
                >
                  {d}f
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Panel 3: Content Slot Toggles */}
        <div
          style={{
            backgroundColor: Colors.dark.surface2,
            padding: Spacing.scale.md,
            borderRadius: Spacing.radius.sm,
            border: `1px solid ${Colors.border.default}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.xs, marginBottom: Spacing.scale.sm }}>
            <Sliders size={14} color={Colors.accent.cyan} />
            <span style={{ ...Typography.caption.eyebrow, color: Colors.text.primary }}>
              CONTENT SLOT TOGGLES
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { label: 'Category Eyebrow', state: showEyebrow, setter: setShowEyebrow },
              { label: 'Call to Action Button', state: showCta, setter: setShowCta },
              { label: 'Ambient Decorations', state: showDecorations, setter: setShowDecorations },
            ].map((toggle) => (
              <button
                key={toggle.label}
                type="button"
                onClick={() => toggle.setter(!toggle.state)}
                style={{
                  padding: '8px 10px',
                  borderRadius: Spacing.radius.xs,
                  border: `1px solid ${toggle.state ? Colors.accent.emerald : Colors.border.default}`,
                  backgroundColor: toggle.state ? 'rgba(16, 185, 129, 0.15)' : Colors.dark.surface1,
                  color: toggle.state ? Colors.accent.emerald : Colors.text.tertiary,
                  fontFamily: Typography.fontFamily.mono,
                  fontSize: 10,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <span>{toggle.label}</span>
                <span style={{ fontWeight: 700 }}>{toggle.state ? 'SHOWN' : 'HIDDEN'}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Generated Code Snippet */}
      <div
        style={{
          backgroundColor: Colors.dark.surface2,
          padding: Spacing.scale.md,
          borderRadius: Spacing.radius.sm,
          border: `1px solid ${Colors.border.default}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.xs, marginBottom: Spacing.scale.xs }}>
          <Sparkles size={14} color={Colors.accent.cyan} />
          <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan }}>
            REMOTION CODE IMPLEMENTATION
          </span>
        </div>
        <pre
          style={{
            margin: 0,
            padding: Spacing.scale.sm,
            backgroundColor: '#05070a',
            borderRadius: Spacing.radius.xs,
            border: `1px solid ${Colors.border.default}`,
            fontFamily: Typography.fontFamily.mono,
            fontSize: 11,
            color: '#a5f3fc',
            overflowX: 'auto',
            lineHeight: 1.5,
          }}
        >
          {`<HeroScene
  layout="${layout}"
  headline="${selectedText.headline}"
  subtitle="${selectedText.subtitle}"
  description="${selectedText.desc}"${showEyebrow ? '\n  eyebrow="ENTERPRISE INTELLIGENCE 2026"' : ''}${showCta ? '\n  cta="Explore Framework →"' : ''}
  staggerDelay={${staggerDelay}}
>
  <${visualType === 'smartphone' ? 'SmartphoneMockup' : visualType === 'laptop' ? 'LaptopMockup' : 'GraphicCard'} />
</HeroScene>`}
        </pre>
      </div>
    </div>
  );
};
