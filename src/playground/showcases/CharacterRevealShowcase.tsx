/**
 * CharacterRevealShowcase Component
 * Interactive showcase and diagnostic harness for the CharacterReveal component.
 * Demonstrates all 12 variants (including elastic & wave), grapheme segmentation,
 * emoji/multilingual fidelity, stagger benchmarks, and reverse sequence order.
 */

import React, { useState } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { CharacterReveal } from '../../components/typography/CharacterReveal';
import { CharacterRevealVariant } from '../../components/typography/types';
import { Colors } from '../../styles/colors';
import { Typography } from '../../styles/typography';
import { Spacing } from '../../styles/spacing';
import { formatTimecode } from '../../utils/timing/frame';

const ALL_VARIANTS: Array<{ variant: CharacterRevealVariant; label: string; desc: string }> = [
  { variant: 'fade', label: '1. Fade', desc: 'Sequential character opacity alpha entrance' },
  { variant: 'slide-up', label: '2. Slide Up', desc: 'Each glyph rises vertically (Y+24 → 0)' },
  { variant: 'slide-down', label: '3. Slide Down', desc: 'Each glyph descends from top (Y-24 → 0)' },
  { variant: 'slide-left', label: '4. Slide Left', desc: 'Horizontal character entry from right' },
  { variant: 'slide-right', label: '5. Slide Right', desc: 'Horizontal character entry from left' },
  { variant: 'scale', label: '6. Scale', desc: 'Linear/eased glyph zoom (0.8 → 1.0)' },
  { variant: 'pop', label: '7. Pop (Spring)', desc: 'Snappy spring scale physics per glyph' },
  { variant: 'blur', label: '8. Blur', desc: 'Gaussian blur-to-clear (8px → 0px)' },
  { variant: 'rotate', label: '9. Rotate', desc: 'Angular letter tilt (-15° → 0°)' },
  { variant: 'fade-slide-up', label: '10. Fade + Slide', desc: 'Coordinated opacity and vertical rise' },
  { variant: 'elastic', label: '11. Elastic', desc: 'Underdamped spring with snappy rebound' },
  { variant: 'wave', label: '12. Wave', desc: 'Sinusoidal vertical ripple across characters' },
];

export const CharacterRevealShowcase: React.FC = () => {
  const currentFrame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Interactive controls state
  const [selectedVariant, setSelectedVariant] = useState<CharacterRevealVariant>('wave');
  const [staggerSpeed, setStaggerSpeed] = useState<number>(1);
  const [charDuration, setCharDuration] = useState<number>(14);
  const [fontSize, setFontSize] = useState<number>(36);
  const [isReverse, setIsReverse] = useState<boolean>(false);

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
          <span style={{ color: Colors.accent.electricViolet, fontWeight: 700 }}>● CHARACTER REVEAL SUITE</span>
          <span style={{ color: Colors.text.tertiary }}>|</span>
          <span style={{ color: Colors.text.secondary }}>12 GRAPHEME-AWARE VARIANTS</span>
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
          gap: Spacing.scale.md,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: Spacing.scale.sm }}>
          <div>
            <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.electricViolet }}>
              LIVE INTERACTIVE CHARACTER BENCHMARK
            </span>
            <h3 style={{ ...Typography.headline.h4, color: Colors.text.primary, marginTop: 2 }}>
              Fine-Grained Glyphic Tuning
            </h3>
          </div>

          {/* Quick-toggle parameter pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.sm, flexWrap: 'wrap' }}>
            {/* Reverse Toggle */}
            <button
              onClick={() => setIsReverse(!isReverse)}
              style={{
                padding: '6px 12px',
                backgroundColor: isReverse ? Colors.accent.brand : Colors.dark.surface2,
                border: `1px solid ${isReverse ? Colors.accent.brandLight : Colors.border.default}`,
                borderRadius: Spacing.radius.sm,
                color: isReverse ? '#000' : Colors.text.primary,
                fontWeight: 600,
                fontSize: 11,
                cursor: 'pointer',
              }}
            >
              {isReverse ? 'Reverse: ON (End → Start)' : 'Reverse: OFF (Normal)'}
            </button>

            {/* Stagger Speed pills */}
            {[
              { label: 'Fast (1f)', val: 1 },
              { label: 'Normal (2f)', val: 2 },
              { label: 'Slow (4f)', val: 4 },
            ].map((s) => (
              <button
                key={s.val}
                onClick={() => setStaggerSpeed(s.val)}
                style={{
                  padding: '6px 10px',
                  backgroundColor: staggerSpeed === s.val ? Colors.accent.cyan : Colors.dark.surface2,
                  border: `1px solid ${staggerSpeed === s.val ? Colors.accent.cyan : Colors.border.default}`,
                  borderRadius: Spacing.radius.sm,
                  color: staggerSpeed === s.val ? '#000' : Colors.text.secondary,
                  fontWeight: 600,
                  fontSize: 11,
                  cursor: 'pointer',
                }}
              >
                {s.label}
              </button>
            ))}

            {/* Character Duration pills */}
            {[
              { label: 'Snappy (10f)', val: 10 },
              { label: 'Fluid (14f)', val: 14 },
              { label: 'Cinematic (22f)', val: 22 },
            ].map((d) => (
              <button
                key={d.val}
                onClick={() => setCharDuration(d.val)}
                style={{
                  padding: '6px 10px',
                  backgroundColor: charDuration === d.val ? Colors.accent.amber : Colors.dark.surface2,
                  border: `1px solid ${charDuration === d.val ? Colors.accent.amber : Colors.border.default}`,
                  borderRadius: Spacing.radius.sm,
                  color: charDuration === d.val ? '#000' : Colors.text.secondary,
                  fontWeight: 600,
                  fontSize: 11,
                  cursor: 'pointer',
                }}
              >
                {d.label}
              </button>
            ))}

            {/* Font Size pills */}
            {[
              { label: '24px', val: 24 },
              { label: '36px', val: 36 },
              { label: '48px', val: 48 },
            ].map((f) => (
              <button
                key={f.val}
                onClick={() => setFontSize(f.val)}
                style={{
                  padding: '6px 10px',
                  backgroundColor: fontSize === f.val ? Colors.accent.emerald : Colors.dark.surface2,
                  border: `1px solid ${fontSize === f.val ? Colors.accent.emerald : Colors.border.default}`,
                  borderRadius: Spacing.radius.sm,
                  color: fontSize === f.val ? '#000' : Colors.text.secondary,
                  fontWeight: 600,
                  fontSize: 11,
                  cursor: 'pointer',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Stage Display */}
        <div
          style={{
            minHeight: 140,
            backgroundColor: Colors.dark.surface2,
            borderRadius: Spacing.radius.md,
            border: `1px solid ${Colors.border.subtle}`,
            padding: Spacing.scale.xl,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <CharacterReveal
            key={`${selectedVariant}-${staggerSpeed}-${charDuration}-${fontSize}-${isReverse}`}
            text="CREATE SOMETHING AMAZING"
            variant={selectedVariant}
            startFrame={5}
            staggerDelay={staggerSpeed}
            characterDuration={charDuration}
            reverse={isReverse}
            style={{
              fontSize,
              fontWeight: 800,
              color: Colors.text.primary,
              letterSpacing: '0.04em',
              textAlign: 'center',
              lineHeight: 1.25,
            }}
            characterStyle={(_, i) => {
              if (i >= 7 && i <= 15) return { color: Colors.accent.cyan };
              if (i >= 17) return { color: Colors.accent.electricViolet };
              return {};
            }}
          />
        </div>
      </div>

      {/* SECTION 3: Grid of All 12 Animation Variants */}
      <div>
        <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan, marginBottom: Spacing.scale.sm }}>
          ALL 12 ANIMATION VARIANTS (TRIGGER: FRAME 5 · STAGGER: 1f · DURATION: 14f)
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: Spacing.scale.md,
          }}
        >
          {ALL_VARIANTS.map((item) => (
            <div
              key={item.variant}
              onClick={() => setSelectedVariant(item.variant)}
              style={{
                backgroundColor: selectedVariant === item.variant ? Colors.dark.surface2 : Colors.dark.surface1,
                border: `1px solid ${selectedVariant === item.variant ? Colors.accent.electricViolet : Colors.border.default}`,
                borderRadius: Spacing.radius.md,
                padding: Spacing.scale.md,
                display: 'flex',
                flexDirection: 'column',
                gap: Spacing.scale.sm,
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: Colors.text.primary }}>
                  {item.label}
                </span>
                <span
                  style={{
                    fontSize: 9,
                    fontFamily: Typography.fontFamily.mono,
                    padding: '2px 6px',
                    borderRadius: Spacing.radius.xs,
                    backgroundColor: selectedVariant === item.variant ? Colors.accent.electricViolet : Colors.dark.surface3,
                    color: selectedVariant === item.variant ? '#fff' : Colors.text.tertiary,
                    fontWeight: 700,
                  }}
                >
                  {item.variant.toUpperCase()}
                </span>
              </div>

              <span style={{ fontSize: 11, color: Colors.text.secondary, minHeight: 28 }}>
                {item.desc}
              </span>

              {/* Rendered Live Component */}
              <div
                style={{
                  height: 60,
                  backgroundColor: Colors.dark.bgPrimary,
                  borderRadius: Spacing.radius.sm,
                  border: `1px solid ${Colors.border.subtle}`,
                  display: 'flex',
                  alignItems: 'center',
                  padding: `0 ${Spacing.scale.md}px`,
                  overflow: 'hidden',
                }}
              >
                <CharacterReveal
                  text="NEXT GEN MOBILITY"
                  variant={item.variant}
                  startFrame={5}
                  staggerDelay={1}
                  characterDuration={14}
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    color: Colors.text.primary,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: Wave & Elastic Physics Deep Dive */}
      <div>
        <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.amber, marginBottom: Spacing.scale.sm }}>
          PHYSICS SHOWCASE: WAVE PROPAGATION & ELASTIC BOUNCE
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: Spacing.scale.md,
          }}
        >
          {/* Wave Variant */}
          <div
            style={{
              backgroundColor: Colors.dark.surface1,
              border: `1px solid ${Colors.border.default}`,
              borderRadius: Spacing.radius.md,
              padding: Spacing.scale.md,
              display: 'flex',
              flexDirection: 'column',
              gap: Spacing.scale.xs,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: Colors.text.primary }}>
                Wave Variant (Sinusoidal Ripple)
              </span>
              <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.accent.cyan }}>
                amplitude: 24px · crest peak
              </span>
            </div>
            <span style={{ fontSize: 11, color: Colors.text.secondary }}>
              Propagates an arched sinusoidal wave crest across staggered characters.
            </span>
            <div
              style={{
                height: 72,
                backgroundColor: Colors.dark.bgPrimary,
                borderRadius: Spacing.radius.sm,
                border: `1px solid ${Colors.border.subtle}`,
                display: 'flex',
                alignItems: 'center',
                padding: `0 ${Spacing.scale.md}px`,
                marginTop: Spacing.scale.xs,
              }}
            >
              <CharacterReveal
                text="RIPPLE THROUGH SPACE"
                variant="wave"
                startFrame={5}
                staggerDelay={2}
                characterDuration={18}
                waveAmplitude={26}
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  color: Colors.accent.cyan,
                }}
              />
            </div>
          </div>

          {/* Elastic Variant */}
          <div
            style={{
              backgroundColor: Colors.dark.surface1,
              border: `1px solid ${Colors.border.default}`,
              borderRadius: Spacing.radius.md,
              padding: Spacing.scale.md,
              display: 'flex',
              flexDirection: 'column',
              gap: Spacing.scale.xs,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: Colors.text.primary }}>
                Elastic Variant (Underdamped Spring)
              </span>
              <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.accent.electricViolet }}>
                damping: 9 · mass: 0.7 · stiffness: 240
              </span>
            </div>
            <span style={{ fontSize: 11, color: Colors.text.secondary }}>
              High-rebound mechanical wobble with synchronized scale and vertical overshoot.
            </span>
            <div
              style={{
                height: 72,
                backgroundColor: Colors.dark.bgPrimary,
                borderRadius: Spacing.radius.sm,
                border: `1px solid ${Colors.border.subtle}`,
                display: 'flex',
                alignItems: 'center',
                padding: `0 ${Spacing.scale.md}px`,
                marginTop: Spacing.scale.xs,
              }}
            >
              <CharacterReveal
                text="SNAPPY MECHANICAL BOUNCE"
                variant="elastic"
                startFrame={5}
                staggerDelay={1}
                characterDuration={20}
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: '0.03em',
                  color: Colors.accent.electricViolet,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: Multilingual & Emoji Grapheme Fidelity */}
      <div>
        <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.emerald, marginBottom: Spacing.scale.sm }}>
          MULTILINGUAL & EMOJI GRAPHEME SEGMENTATION
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: Spacing.scale.md,
          }}
        >
          {[
            { label: 'Emoji & Symbols', text: 'UBER 🚀 ✦ ★', variant: 'pop' as CharacterRevealVariant, color: Colors.accent.amber },
            { label: 'Japanese (Kanji)', text: '都市交通の未来', variant: 'fade-slide-up' as CharacterRevealVariant, color: Colors.accent.cyan },
            { label: 'Arabic Script', text: 'مرحبا بك في أوبر', variant: 'fade-slide-up' as CharacterRevealVariant, color: Colors.accent.emerald },
            { label: 'Accented Latin', text: 'Café & München', variant: 'slide-up' as CharacterRevealVariant, color: Colors.accent.electricViolet },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                backgroundColor: Colors.dark.surface1,
                border: `1px solid ${Colors.border.default}`,
                borderRadius: Spacing.radius.md,
                padding: Spacing.scale.md,
                display: 'flex',
                flexDirection: 'column',
                gap: Spacing.scale.xs,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: Colors.text.primary }}>
                  {item.label}
                </span>
                <span style={{ fontSize: 9, fontFamily: Typography.fontFamily.mono, color: item.color }}>
                  Intl.Segmenter
                </span>
              </div>
              <div
                style={{
                  height: 54,
                  backgroundColor: Colors.dark.bgPrimary,
                  borderRadius: Spacing.radius.sm,
                  border: `1px solid ${Colors.border.subtle}`,
                  display: 'flex',
                  alignItems: 'center',
                  padding: `0 ${Spacing.scale.md}px`,
                  marginTop: 4,
                }}
              >
                <CharacterReveal
                  text={item.text}
                  variant={item.variant}
                  startFrame={5}
                  staggerDelay={2}
                  characterDuration={14}
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 6: Sequential vs. Reverse Reveal Comparison */}
      <div>
        <div style={{ ...Typography.caption.eyebrow, color: Colors.text.secondary, marginBottom: Spacing.scale.sm }}>
          REVEAL ORDER: SEQUENTIAL (A → Z) VS. REVERSE (Z → A)
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: Spacing.scale.md,
          }}
        >
          {/* Normal Sequential */}
          <div
            style={{
              backgroundColor: Colors.dark.surface1,
              border: `1px solid ${Colors.border.default}`,
              borderRadius: Spacing.radius.md,
              padding: Spacing.scale.md,
              display: 'flex',
              flexDirection: 'column',
              gap: Spacing.scale.xs,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: Colors.text.primary }}>
                Normal Sequential Reveal
              </span>
              <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.accent.cyan }}>
                Order: Left → Right
              </span>
            </div>
            <div
              style={{
                height: 56,
                backgroundColor: Colors.dark.bgPrimary,
                borderRadius: Spacing.radius.sm,
                border: `1px solid ${Colors.border.subtle}`,
                display: 'flex',
                alignItems: 'center',
                padding: `0 ${Spacing.scale.md}px`,
                marginTop: Spacing.scale.xs,
              }}
            >
              <CharacterReveal
                text="STREAMLINED URBAN TRANSIT"
                variant="fade-slide-up"
                startFrame={5}
                staggerDelay={1}
                characterDuration={14}
                reverse={false}
                style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.04em' }}
              />
            </div>
          </div>

          {/* Reverse Reveal */}
          <div
            style={{
              backgroundColor: Colors.dark.surface1,
              border: `1px solid ${Colors.border.default}`,
              borderRadius: Spacing.radius.md,
              padding: Spacing.scale.md,
              display: 'flex',
              flexDirection: 'column',
              gap: Spacing.scale.xs,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: Colors.text.primary }}>
                Reverse Reveal (reverse: true)
              </span>
              <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.accent.brand }}>
                Order: Right → Left
              </span>
            </div>
            <div
              style={{
                height: 56,
                backgroundColor: Colors.dark.bgPrimary,
                borderRadius: Spacing.radius.sm,
                border: `1px solid ${Colors.border.subtle}`,
                display: 'flex',
                alignItems: 'center',
                padding: `0 ${Spacing.scale.md}px`,
                marginTop: Spacing.scale.xs,
              }}
            >
              <CharacterReveal
                text="STREAMLINED URBAN TRANSIT"
                variant="fade-slide-up"
                startFrame={5}
                staggerDelay={1}
                characterDuration={14}
                reverse={true}
                style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.04em' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 7: Typography Scale Matrix */}
      <div>
        <div style={{ ...Typography.caption.eyebrow, color: Colors.text.secondary, marginBottom: Spacing.scale.sm }}>
          TYPOGRAPHY SCALE HIERARCHY
        </div>

        <div
          style={{
            backgroundColor: Colors.dark.surface1,
            border: `1px solid ${Colors.border.default}`,
            borderRadius: Spacing.radius.md,
            padding: Spacing.scale.lg,
            display: 'flex',
            flexDirection: 'column',
            gap: Spacing.scale.lg,
          }}
        >
          {/* Display Hero */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              DISPLAY (38px · BOLD 800)
            </span>
            <CharacterReveal
              text="THE FUTURE IS AUTONOMOUS"
              variant="wave"
              startFrame={5}
              staggerDelay={1}
              characterDuration={16}
              style={{
                fontSize: 38,
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: Colors.text.primary,
              }}
            />
          </div>

          {/* Headline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              HEADLINE (24px · SEMIBOLD 600)
            </span>
            <CharacterReveal
              text="Every journey calculated with millisecond accuracy"
              variant="fade-slide-up"
              startFrame={8}
              staggerDelay={1}
              characterDuration={14}
              style={{
                fontSize: 24,
                fontWeight: 600,
                color: Colors.text.secondary,
              }}
            />
          </div>

          {/* Subhead */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              SUBHEAD (16px · MEDIUM 500)
            </span>
            <CharacterReveal
              text="Global mobility infrastructure powering 10,000+ cities."
              variant="fade-slide-up"
              startFrame={12}
              staggerDelay={1}
              characterDuration={12}
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: Colors.accent.emerald,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
