/**
 * WordRevealShowcase Component
 * Interactive showcase and diagnostic harness for the WordReveal component.
 * Demonstrates all 10 variants, stagger timing, reverse reveal, multi-line wrapping, keyword highlights, and typography scales.
 */

import React, { useState } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { WordReveal } from '../../components/typography/WordReveal';
import { WordRevealVariant } from '../../components/typography/types';
import { Colors } from '../../styles/colors';
import { Typography } from '../../styles/typography';
import { Spacing } from '../../styles/spacing';
import { formatTimecode } from '../../utils/timing/frame';

const ALL_VARIANTS: Array<{ variant: WordRevealVariant; label: string; desc: string }> = [
  { variant: 'fade', label: '1. Fade', desc: 'Sequential word opacity alpha entrance' },
  { variant: 'slide-up', label: '2. Slide Up', desc: 'Each word rises from bottom (Y+30 → 0)' },
  { variant: 'slide-down', label: '3. Slide Down', desc: 'Each word descends from top (Y-30 → 0)' },
  { variant: 'slide-left', label: '4. Slide Left', desc: 'Horizontal stagger from right (X+30 → 0)' },
  { variant: 'slide-right', label: '5. Slide Right', desc: 'Horizontal stagger from left (X-30 → 0)' },
  { variant: 'scale', label: '6. Scale', desc: 'Progressive word zoom from 0.85 → 1.0' },
  { variant: 'pop', label: '7. Pop (Spring)', desc: 'Snappy spring physics per word' },
  { variant: 'blur', label: '8. Blur', desc: 'Gaussian blur-to-clear per word' },
  { variant: 'rotate', label: '9. Rotate', desc: 'Subtle rotational word entry (-8° → 0°)' },
  { variant: 'fade-slide-up', label: '10. Fade + Slide', desc: 'Coordinated opacity and vertical rise' },
];

export const WordRevealShowcase: React.FC = () => {
  const currentFrame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Interactive controls
  const [selectedVariant, setSelectedVariant] = useState<WordRevealVariant>('fade-slide-up');
  const [staggerSpeed, setStaggerSpeed] = useState<number>(3);
  const [wordDuration, setWordDuration] = useState<number>(18);
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
      {/* SECTION 1: Telemetry & Live Frame Bar */}
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
          <span style={{ color: Colors.accent.cyan, fontWeight: 700 }}>● WORD REVEAL SUITE</span>
          <span style={{ color: Colors.text.tertiary }}>|</span>
          <span style={{ color: Colors.text.secondary }}>SEQUENTIAL STAGGER PIPELINE</span>
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
            <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan }}>
              LIVE INTERACTIVE WORD REVEAL BENCHMARK
            </span>
            <h3 style={{ ...Typography.headline.h4, color: Colors.text.primary, marginTop: 2 }}>
              Dynamic Parameter Tuning
            </h3>
          </div>

          {/* Quick-toggle parameter pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.sm, flexWrap: 'wrap' }}>
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
              {isReverse ? 'Reverse: ON (Last → First)' : 'Reverse: OFF (Normal)'}
            </button>

            {/* Stagger Speed buttons */}
            {[
              { label: 'Tight (2f)', val: 2 },
              { label: 'Standard (3f)', val: 3 },
              { label: 'Relaxed (6f)', val: 6 },
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

            {/* Word Duration buttons */}
            {[
              { label: 'Fast (12f)', val: 12 },
              { label: 'Normal (18f)', val: 18 },
              { label: 'Cinematic (30f)', val: 30 },
            ].map((d) => (
              <button
                key={d.val}
                onClick={() => setWordDuration(d.val)}
                style={{
                  padding: '6px 10px',
                  backgroundColor: wordDuration === d.val ? Colors.accent.amber : Colors.dark.surface2,
                  border: `1px solid ${wordDuration === d.val ? Colors.accent.amber : Colors.border.default}`,
                  borderRadius: Spacing.radius.sm,
                  color: wordDuration === d.val ? '#000' : Colors.text.secondary,
                  fontWeight: 600,
                  fontSize: 11,
                  cursor: 'pointer',
                }}
              >
                {d.label}
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
          <WordReveal
            key={`${selectedVariant}-${staggerSpeed}-${wordDuration}-${isReverse}`}
            text="Move faster with better experiences across every journey"
            variant={selectedVariant}
            startFrame={5}
            staggerDelay={staggerSpeed}
            wordDuration={wordDuration}
            reverse={isReverse}
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: Colors.text.primary,
              letterSpacing: '-0.02em',
              textAlign: 'center',
              lineHeight: 1.25,
              maxWidth: 800,
            }}
            wordStyle={(word) => {
              if (word.toLowerCase().includes('faster')) return { color: Colors.accent.cyan };
              if (word.toLowerCase().includes('better')) return { color: Colors.accent.emerald };
              if (word.toLowerCase().includes('journey')) return { color: Colors.accent.electricViolet };
              return {};
            }}
          />
        </div>
      </div>

      {/* SECTION 3: Grid of All 10 Animation Variants */}
      <div>
        <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan, marginBottom: Spacing.scale.sm }}>
          ALL 10 ANIMATION VARIANTS (TRIGGER: FRAME 5 · STAGGER: 3f · DURATION: 18f)
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
                border: `1px solid ${selectedVariant === item.variant ? Colors.accent.cyan : Colors.border.default}`,
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
                    backgroundColor: selectedVariant === item.variant ? Colors.accent.cyan : Colors.dark.surface3,
                    color: selectedVariant === item.variant ? '#000' : Colors.text.tertiary,
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
                  height: 64,
                  backgroundColor: Colors.dark.bgPrimary,
                  borderRadius: Spacing.radius.sm,
                  border: `1px solid ${Colors.border.subtle}`,
                  display: 'flex',
                  alignItems: 'center',
                  padding: `0 ${Spacing.scale.md}px`,
                  overflow: 'hidden',
                }}
              >
                <WordReveal
                  text="Move faster together"
                  variant={item.variant}
                  startFrame={5}
                  staggerDelay={3}
                  wordDuration={18}
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    color: Colors.text.primary,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: Stagger Timing Comparison */}
      <div>
        <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.emerald, marginBottom: Spacing.scale.sm }}>
          STAGGER INTERVAL COMPARISON (START: FRAME 5 · 5 WORDS)
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: Spacing.scale.md,
          }}
        >
          {[
            { label: 'Tight Stagger (2f delay)', delay: 2, dur: 14, color: Colors.accent.cyan },
            { label: 'Standard Stagger (4f delay)', delay: 4, dur: 18, color: Colors.accent.brand },
            { label: 'Cinematic Stagger (8f delay)', delay: 8, dur: 24, color: Colors.accent.amber },
          ].map((cfg) => (
            <div
              key={cfg.label}
              style={{
                backgroundColor: Colors.dark.surface1,
                border: `1px solid ${Colors.border.default}`,
                borderRadius: Spacing.radius.md,
                padding: Spacing.scale.md,
                display: 'flex',
                flexDirection: 'column',
                gap: Spacing.scale.sm,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: Colors.text.primary }}>
                  {cfg.label}
                </span>
                <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: cfg.color }}>
                  Span: {(4 * cfg.delay) + cfg.dur}f
                </span>
              </div>

              <div
                style={{
                  height: 60,
                  backgroundColor: Colors.dark.bgPrimary,
                  borderRadius: Spacing.radius.sm,
                  border: `1px solid ${Colors.border.subtle}`,
                  display: 'flex',
                  alignItems: 'center',
                  padding: `0 ${Spacing.scale.md}px`,
                }}
              >
                <WordReveal
                  text="Precision in every motion"
                  variant="fade-slide-up"
                  startFrame={5}
                  staggerDelay={cfg.delay}
                  wordDuration={cfg.dur}
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: Colors.text.primary,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 5: Reveal Order & Reversal Comparison */}
      <div>
        <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.electricViolet, marginBottom: Spacing.scale.sm }}>
          REVEAL ORDER: SEQUENTIAL (LEFT-TO-RIGHT) VS. REVERSE (RIGHT-TO-LEFT)
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: Spacing.scale.md,
          }}
        >
          {/* Normal Sequential Reveal */}
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
                Normal Reveal Order
              </span>
              <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.accent.cyan }}>
                Order: 0 → 1 → 2 → 3 → 4
              </span>
            </div>
            <span style={{ fontSize: 11, color: Colors.text.secondary }}>
              Words animate sequentially in reading order (first word first).
            </span>
            <div
              style={{
                height: 64,
                backgroundColor: Colors.dark.bgPrimary,
                borderRadius: Spacing.radius.sm,
                border: `1px solid ${Colors.border.subtle}`,
                display: 'flex',
                alignItems: 'center',
                padding: `0 ${Spacing.scale.md}px`,
                marginTop: Spacing.scale.xs,
              }}
            >
              <WordReveal
                text="Move faster with better experiences"
                variant="fade-slide-up"
                startFrame={5}
                staggerDelay={4}
                wordDuration={18}
                reverse={false}
                style={{ fontSize: 17, fontWeight: 700 }}
              />
            </div>
          </div>

          {/* Reverse Reveal Order */}
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
                Reverse Reveal Order (reverse: true)
              </span>
              <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.accent.brand }}>
                Order: 4 → 3 → 2 → 1 → 0
              </span>
            </div>
            <span style={{ fontSize: 11, color: Colors.text.secondary }}>
              Sentence layout stays intact; words appear from end to start.
            </span>
            <div
              style={{
                height: 64,
                backgroundColor: Colors.dark.bgPrimary,
                borderRadius: Spacing.radius.sm,
                border: `1px solid ${Colors.border.subtle}`,
                display: 'flex',
                alignItems: 'center',
                padding: `0 ${Spacing.scale.md}px`,
                marginTop: Spacing.scale.xs,
              }}
            >
              <WordReveal
                text="Move faster with better experiences"
                variant="fade-slide-up"
                startFrame={5}
                staggerDelay={4}
                wordDuration={18}
                reverse={true}
                style={{ fontSize: 17, fontWeight: 700 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 6: Multi-Line Wrapping & Whitespace Preservation */}
      <div>
        <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.amber, marginBottom: Spacing.scale.sm }}>
          MULTI-LINE HEADLINES & WHITESPACE PRESERVATION
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: Spacing.scale.md,
          }}
        >
          {/* Multi-line wrapping in constrained width */}
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
            <span style={{ fontSize: 13, fontWeight: 600, color: Colors.text.primary }}>
              Responsive Multi-Line Text Wrapping
            </span>
            <span style={{ fontSize: 11, color: Colors.text.secondary }}>
              Wraps naturally between words without mid-word breaks or overflow glitches.
            </span>
            <div
              style={{
                backgroundColor: Colors.dark.bgPrimary,
                borderRadius: Spacing.radius.sm,
                border: `1px solid ${Colors.border.subtle}`,
                padding: Spacing.scale.md,
                maxWidth: 380,
                marginTop: Spacing.scale.xs,
              }}
            >
              <WordReveal
                text="Engineered for modern mobility, seamless deliveries, and smart autonomous futures."
                variant="fade-slide-up"
                startFrame={5}
                staggerDelay={3}
                wordDuration={18}
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  lineHeight: 1.4,
                  color: Colors.text.primary,
                }}
              />
            </div>
          </div>

          {/* Explicit Newlines & Multiple Spaces */}
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
            <span style={{ fontSize: 13, fontWeight: 600, color: Colors.text.primary }}>
              Preserved Newlines (\n) & Multi-Spaces
            </span>
            <span style={{ fontSize: 11, color: Colors.text.secondary }}>
              Line breaks and intentional spacing preserved with whiteSpace: 'pre-wrap'.
            </span>
            <div
              style={{
                backgroundColor: Colors.dark.bgPrimary,
                borderRadius: Spacing.radius.sm,
                border: `1px solid ${Colors.border.subtle}`,
                padding: Spacing.scale.md,
                marginTop: Spacing.scale.xs,
              }}
            >
              <WordReveal
                text={'Next-Generation Mobility.\nDesigned for Global Scale.\nDelivered on Demand.'}
                variant="pop"
                springPreset="snappy"
                startFrame={5}
                staggerDelay={4}
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  lineHeight: 1.5,
                  color: Colors.accent.cyan,
                }}
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
          {/* Display */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              DISPLAY (40px · BOLD 800)
            </span>
            <WordReveal
              text="Go anywhere. Get anything."
              variant="fade-slide-up"
              startFrame={5}
              staggerDelay={4}
              wordDuration={20}
              style={{
                fontSize: 40,
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: Colors.text.primary,
              }}
            />
          </div>

          {/* Headline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              HEADLINE (26px · SEMIBOLD 600)
            </span>
            <WordReveal
              text="Empowering smarter rides and seamless urban connections."
              variant="fade-slide-up"
              startFrame={8}
              staggerDelay={3}
              wordDuration={18}
              style={{
                fontSize: 26,
                fontWeight: 600,
                letterSpacing: '-0.01em',
                color: Colors.text.secondary,
              }}
            />
          </div>

          {/* Subhead / Eyebrow */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              SUBHEAD (18px · MEDIUM 500)
            </span>
            <WordReveal
              text="Available across 10,000 cities worldwide."
              variant="fade-slide-up"
              startFrame={12}
              staggerDelay={3}
              wordDuration={16}
              style={{
                fontSize: 18,
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
