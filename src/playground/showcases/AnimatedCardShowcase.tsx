/**
 * AnimatedCardShowcase Component
 * Interactive showcase and diagnostic harness for the AnimatedCard component.
 * Demonstrates all 12 animation variants, 7 visual presentation styles,
 * 7 interaction states, staggered card collections, and floating cards.
 * Layer 2 of the Motion Graphics Framework.
 */

import React, { useState } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Car,
  ShieldCheck,
  Sparkles,
  Zap,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { AnimatedCard } from '../../components/ui/AnimatedCard';
import {
  AnimatedCardAnimation,
  AnimatedCardVariant,
  AnimatedCardState,
  AnimatedCardSize,
} from '../../components/ui/types';
import { Colors } from '../../styles/colors';
import { Typography } from '../../styles/typography';
import { Spacing } from '../../styles/spacing';
import { formatTimecode } from '../../utils/timing/frame';

const ALL_ANIMATIONS: { id: AnimatedCardAnimation; label: string }[] = [
  { id: 'fade', label: '1. Fade' },
  { id: 'slide-up', label: '2. Slide Up' },
  { id: 'slide-down', label: '3. Slide Down' },
  { id: 'slide-left', label: '4. Slide Left' },
  { id: 'slide-right', label: '5. Slide Right' },
  { id: 'scale', label: '6. Scale' },
  { id: 'pop', label: '7. Pop (Spring)' },
  { id: 'flip', label: '8. Flip 3D' },
  { id: 'blur', label: '9. Blur' },
  { id: 'float', label: '10. Float' },
  { id: 'expand', label: '11. Expand' },
  { id: 'collapse', label: '12. Collapse' },
];

const ALL_VARIANTS: { id: AnimatedCardVariant; label: string; desc: string }[] = [
  { id: 'default', label: 'Default', desc: 'Surface1 container with subtle border' },
  { id: 'outlined', label: 'Outlined', desc: 'Crisp boundary without shadow' },
  { id: 'elevated', label: 'Elevated', desc: 'Deep floating drop shadow and surface2' },
  { id: 'flat', label: 'Flat', desc: 'Border-free flat surface presentation' },
  { id: 'image-card', label: 'Image Card', desc: 'Hero photo header with content body' },
  { id: 'horizontal', label: 'Horizontal', desc: 'Row layout with left icon/photo' },
  { id: 'compact', label: 'Compact', desc: 'Tight margins for dense dashboards' },
];

export const AnimatedCardShowcase: React.FC = () => {
  const currentFrame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Interactive controls
  const [selectedAnimation, setSelectedAnimation] = useState<AnimatedCardAnimation>('pop');
  const [selectedVariant, setSelectedVariant] = useState<AnimatedCardVariant>('elevated');
  const [selectedSize, setSelectedSize] = useState<AnimatedCardSize>('md');
  const [cardTitle, setCardTitle] = useState<string>('Uber Premier Reserve');
  const [cardDesc, setCardDesc] = useState<string>('Luxury black car service with extended 15-minute pickup window.');
  const [cardState, setCardState] = useState<AnimatedCardState>('idle');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: Spacing.scale.xl,
        width: '100%',
        color: Colors.text.primary,
        fontFamily: Typography.fontFamily.sans,
      }}
    >
      {/* SECTION 1: Telemetry Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: `${Spacing.scale.sm}px ${Spacing.scale.md}px`,
          backgroundColor: Colors.dark.surface1,
          border: `1px solid ${Colors.border.default}`,
          borderRadius: Spacing.radius.md,
          fontFamily: Typography.fontFamily.mono,
          fontSize: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.sm }}>
          <span style={{ color: Colors.accent.brandLight, fontWeight: 700 }}>● ANIMATED CARD SUITE</span>
          <span style={{ color: Colors.text.tertiary }}>|</span>
          <span style={{ color: Colors.text.secondary }}>
            ANIMATION: <strong style={{ color: Colors.accent.cyan, textTransform: 'uppercase' }}>{selectedAnimation}</strong> ·
            VARIANT: <strong style={{ color: Colors.accent.amber, textTransform: 'uppercase' }}>{selectedVariant}</strong>
          </span>
        </div>
        <div style={{ display: 'flex', gap: Spacing.scale.md }}>
          <span>FRAME: <strong style={{ color: Colors.accent.cyan }}>{currentFrame} / {durationInFrames}</strong></span>
          <span>TIMECODE: <strong style={{ color: Colors.accent.amber }}>{formatTimecode(currentFrame, fps)}</strong></span>
        </div>
      </div>

      {/* SECTION 2: Interactive Playground Sandbox */}
      <div
        style={{
          backgroundColor: Colors.dark.surface1,
          border: `1px solid ${Colors.border.default}`,
          borderRadius: Spacing.radius.lg,
          padding: Spacing.scale.lg,
          display: 'flex',
          flexDirection: 'column',
          gap: Spacing.scale.lg,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: Spacing.scale.sm }}>
          <div>
            <h3 style={{ ...Typography.headline.h3, margin: 0, color: Colors.text.primary }}>
              Interactive Card Sandbox
            </h3>
            <p style={{ ...Typography.body.small, margin: '4px 0 0 0', color: Colors.text.secondary }}>
              Tune motion physics, visual styling, sizes, and interaction states in real-time.
            </p>
          </div>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: Spacing.radius.xs,
              backgroundColor: Colors.dark.surface2,
              fontFamily: Typography.fontFamily.mono,
              fontSize: 11,
              color: Colors.accent.emerald,
              border: `1px solid ${Colors.border.subtle}`,
            }}
          >
            ● COMPOSABLE CARD
          </span>
        </div>

        {/* Controls Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: Spacing.scale.md,
            padding: Spacing.scale.md,
            backgroundColor: Colors.dark.surface2,
            borderRadius: Spacing.radius.md,
          }}
        >
          {/* Card Title Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              CARD TITLE
            </label>
            <input
              type="text"
              value={cardTitle}
              onChange={(e) => setCardTitle(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: Spacing.radius.xs,
                backgroundColor: Colors.dark.surface3,
                border: `1px solid ${Colors.border.default}`,
                color: Colors.text.primary,
                fontSize: 13,
                fontFamily: Typography.fontFamily.sans,
              }}
            />
          </div>

          {/* Animation Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              ANIMATION VARIANT
            </label>
            <select
              value={selectedAnimation}
              onChange={(e) => setSelectedAnimation(e.target.value as AnimatedCardAnimation)}
              style={{
                padding: '6px 10px',
                borderRadius: Spacing.radius.xs,
                backgroundColor: Colors.dark.surface3,
                border: `1px solid ${Colors.border.default}`,
                color: Colors.text.primary,
                fontSize: 12,
                fontFamily: Typography.fontFamily.sans,
              }}
            >
              {ALL_ANIMATIONS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>

          {/* Visual Variant Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              VISUAL VARIANT
            </label>
            <select
              value={selectedVariant}
              onChange={(e) => setSelectedVariant(e.target.value as AnimatedCardVariant)}
              style={{
                padding: '6px 10px',
                borderRadius: Spacing.radius.xs,
                backgroundColor: Colors.dark.surface3,
                border: `1px solid ${Colors.border.default}`,
                color: Colors.text.primary,
                fontSize: 12,
                fontFamily: Typography.fontFamily.sans,
              }}
            >
              {ALL_VARIANTS.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>

          {/* Size Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              SIZE PRESET
            </label>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['sm', 'md', 'lg'] as AnimatedCardSize[]).map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: Spacing.radius.xs,
                    backgroundColor: selectedSize === sz ? Colors.accent.cyan : Colors.dark.surface3,
                    border: `1px solid ${selectedSize === sz ? Colors.accent.cyan : Colors.border.default}`,
                    color: selectedSize === sz ? '#000' : Colors.text.secondary,
                    fontSize: 11,
                    cursor: 'pointer',
                    fontWeight: 700,
                  }}
                >
                  {sz.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* State Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              INTERACTION STATE
            </label>
            <select
              value={cardState}
              onChange={(e) => setCardState(e.target.value as AnimatedCardState)}
              style={{
                padding: '6px 10px',
                borderRadius: Spacing.radius.xs,
                backgroundColor: Colors.dark.surface3,
                border: `1px solid ${Colors.border.default}`,
                color: Colors.text.primary,
                fontSize: 12,
                fontFamily: Typography.fontFamily.sans,
              }}
            >
              {(['idle', 'focused', 'selected', 'highlighted', 'expanded', 'collapsed', 'disabled'] as AnimatedCardState[]).map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Interactive Sandbox Preview */}
        <div
          style={{
            padding: Spacing.scale.xxl,
            backgroundColor: Colors.black,
            borderRadius: Spacing.radius.md,
            border: `1px solid ${Colors.border.default}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 280,
          }}
        >
          <AnimatedCard
            title={cardTitle}
            description={cardDesc}
            variant={selectedVariant}
            size={selectedSize}
            animation={selectedAnimation}
            state={cardState}
            startFrame={0}
            durationInFrames={14}
            icon={Sparkles}
            badge="Top Choice"
            width={380}
            action={
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 12,
                  fontWeight: 700,
                  color: Colors.accent.brandLight,
                }}
              >
                <span>Reserve</span>
                <ArrowRight size={14} />
              </div>
            }
          />
        </div>
      </div>

      {/* SECTION 3: All 12 Animation Variants Matrix */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: Spacing.scale.md,
        }}
      >
        <div>
          <h3 style={{ ...Typography.headline.h3, margin: 0, color: Colors.text.primary }}>
            12 Animation Variants Matrix
          </h3>
          <p style={{ ...Typography.body.small, margin: '4px 0 0 0', color: Colors.text.secondary }}>
            Deterministic entrance motion patterns calculated frame-by-frame via pure easing and spring physics.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: Spacing.scale.md,
          }}
        >
          {ALL_ANIMATIONS.map((anim, idx) => (
            <div
              key={anim.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: Spacing.scale.xs,
                padding: Spacing.scale.md,
                backgroundColor: Colors.dark.surface1,
                border: `1px solid ${Colors.border.default}`,
                borderRadius: Spacing.radius.md,
              }}
            >
              <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.accent.brandLight, fontWeight: 700 }}>
                {anim.label}
              </span>
              <div
                style={{
                  padding: Spacing.scale.md,
                  backgroundColor: Colors.black,
                  borderRadius: Spacing.radius.sm,
                  border: `1px solid ${Colors.border.subtle}`,
                  display: 'flex',
                  justifyContent: 'center',
                  minHeight: 120,
                  alignItems: 'center',
                }}
              >
                <AnimatedCard
                  title={anim.label.split('. ')[1]}
                  description="Frame-accurate motion"
                  variant="default"
                  size="sm"
                  animation={anim.id}
                  startFrame={idx * 3}
                  durationInFrames={12}
                  icon={Zap}
                  width="100%"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: Card Collection with Stagger Animation */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: Spacing.scale.md,
        }}
      >
        <div>
          <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.brandLight }}>
            COLLECTION CHOREOGRAPHY
          </span>
          <h3 style={{ ...Typography.headline.h3, margin: '4px 0 0 0', color: Colors.text.primary }}>
            Mobility Fleet Tier Stagger
          </h3>
          <p style={{ ...Typography.body.small, margin: '4px 0 0 0', color: Colors.text.secondary }}>
            Cascading card list entrance simulating product tier selection with delay offsets and active states.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: Spacing.scale.lg,
            padding: Spacing.scale.xl,
            backgroundColor: Colors.dark.surface1,
            border: `1px solid ${Colors.border.default}`,
            borderRadius: Spacing.radius.lg,
          }}
        >
          {[
            {
              title: 'UberX',
              desc: 'Affordable, compact rides for everyday travel.',
              price: '$24.50',
              eta: '4 min away',
              badge: 'Popular',
              icon: Car,
              state: 'idle' as AnimatedCardState,
            },
            {
              title: 'Uber Comfort',
              desc: 'Newer cars with extra legroom and quiet mode.',
              price: '$32.00',
              eta: '6 min away',
              badge: 'Top Rated',
              icon: ShieldCheck,
              state: 'selected' as AnimatedCardState,
            },
            {
              title: 'Uber Black',
              desc: 'Premium black luxury sedans with professional drivers.',
              price: '$54.00',
              eta: '8 min away',
              badge: 'VIP',
              icon: Sparkles,
              state: 'highlighted' as AnimatedCardState,
            },
          ].map((tier, idx) => (
            <AnimatedCard
              key={tier.title}
              title={tier.title}
              description={tier.desc}
              variant="elevated"
              size="md"
              animation="slide-up"
              startFrame={0}
              delay={idx * 6}
              durationInFrames={14}
              icon={tier.icon}
              badge={tier.badge}
              state={tier.state}
              footer={
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: Colors.text.tertiary }}>
                  <Clock size={12} />
                  <span>{tier.eta}</span>
                </div>
              }
              action={
                <span style={{ fontSize: 15, fontWeight: 700, color: Colors.text.primary }}>
                  {tier.price}
                </span>
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};
