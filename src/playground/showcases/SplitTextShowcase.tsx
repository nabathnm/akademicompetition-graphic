/**
 * SplitTextShowcase Component
 * Interactive showcase and diagnostic harness for the SplitText component.
 * Demonstrates all 5 split modes (line, word, character, sentence, custom),
 * 14 animation variants, seeded deterministic random stagger, and typography scale adaptability.
 */

import React, { useState } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { SplitText } from '../../components/typography/SplitText';
import {
  SplitTextMode,
  SplitTextVariant,
  SplitTextCustomSegment,
} from '../../components/typography/types';
import { EasingPresetName } from '../../utils/animation/easing';
import { Colors } from '../../styles/colors';
import { Typography } from '../../styles/typography';
import { Spacing } from '../../styles/spacing';
import { formatTimecode } from '../../utils/timing/frame';

interface VariantMeta {
  variant: SplitTextVariant;
  label: string;
  desc: string;
}

const ALL_VARIANTS: VariantMeta[] = [
  { variant: 'slide-up', label: '1. Slide Up', desc: 'Translates upward with clamped alpha fade' },
  { variant: 'slide-down', label: '2. Slide Down', desc: 'Translates downward from top bounds' },
  { variant: 'slide-left', label: '3. Slide Left', desc: 'Translates leftward into rest position' },
  { variant: 'slide-right', label: '4. Slide Right', desc: 'Translates rightward into rest position' },
  { variant: 'fade', label: '5. Fade', desc: 'Pure opacity alpha interpolation' },
  { variant: 'scale', label: '6. Scale', desc: 'Expands from compact scale to unity' },
  { variant: 'pop', label: '7. Pop', desc: 'Physics spring overshoot with snappy settle' },
  { variant: 'rotate', label: '8. Rotate', desc: 'Subtle rotational angle settle' },
  { variant: 'blur', label: '9. Blur', desc: 'Transitions from soft blur to sharp focus' },
  { variant: 'flip-up', label: '10. Flip Up', desc: '3D perspective X-axis flip upward from bottom' },
  { variant: 'flip-down', label: '11. Flip Down', desc: '3D perspective X-axis flip downward from top' },
  { variant: 'stagger', label: '12. Stagger', desc: 'Combined scale and upward elevation entrance' },
  { variant: 'wave', label: '13. Wave', desc: 'Sinusoidal crest trajectory per segment' },
  { variant: 'random-stagger', label: '14. Random Stagger', desc: 'Seeded deterministic pseudo-random sequence' },
];

const SPLIT_MODES: Array<{ mode: SplitTextMode; label: string; desc: string }> = [
  { mode: 'word', label: 'Word Split', desc: 'Splits on spaces; preserves word grouping' },
  { mode: 'character', label: 'Character Split', desc: 'Splits into graphemes; preserves words' },
  { mode: 'line', label: 'Line Split', desc: 'Splits on newlines into block elements' },
  { mode: 'sentence', label: 'Sentence Split', desc: 'Splits on sentence punctuation bounds' },
  { mode: 'custom', label: 'Custom Split', desc: 'Explicitly configured segment tokens' },
];

const DEMO_CUSTOM_SEGMENTS: SplitTextCustomSegment[] = [
  { text: 'ENGINEERED', id: 'c-1', style: { color: Colors.accent.cyan } },
  { text: 'FOR', id: 'c-2', style: { color: Colors.text.tertiary } },
  { text: 'SCALE', id: 'c-3', style: { color: Colors.accent.emerald } },
  { text: 'AND', id: 'c-4', style: { color: Colors.text.tertiary } },
  { text: 'PERFORMANCE', id: 'c-5', style: { color: Colors.accent.amber } },
];

const DEMO_TEXT_MULTILINE = `Redefining urban mobility.\nBuilt for unprecedented scale.\nPowered by intelligent motion.`;
const DEMO_TEXT_SENTENCES = `Make every moment count. Engineered for precision and velocity. Built for the modern mobile economy.`;
const DEMO_TEXT_WORDS = `Move faster with better experiences.`;

export const SplitTextShowcase: React.FC = () => {
  const currentFrame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Interactive controls
  const [selectedMode, setSelectedMode] = useState<SplitTextMode>('word');
  const [selectedVariant, setSelectedVariant] = useState<SplitTextVariant>('slide-up');
  const [staggerDelay, setStaggerDelay] = useState<number>(3);
  const [segmentDuration, setSegmentDuration] = useState<number>(18);
  const [isReverse, setIsReverse] = useState<boolean>(false);
  const [seed, setSeed] = useState<number>(42);
  const [easing, setEasing] = useState<EasingPresetName>('easeOutCubic');

  // Text selection based on mode
  const activeDemoText =
    selectedMode === 'line'
      ? DEMO_TEXT_MULTILINE
      : selectedMode === 'sentence'
      ? DEMO_TEXT_SENTENCES
      : DEMO_TEXT_WORDS;

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
          <span style={{ color: Colors.accent.cyan, fontWeight: 700 }}>● SPLIT TEXT SUITE</span>
          <span style={{ color: Colors.text.tertiary }}>|</span>
          <span style={{ color: Colors.text.secondary }}>5 SPLIT MODES · 14 ANIMATION VARIANTS · SEEDED STAGGER</span>
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
        <div>
          <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan }}>
            INTERACTIVE SEGMENTATION & TIMING LAB
          </span>
          <h3 style={{ ...Typography.headline.h4, color: Colors.text.primary, marginTop: 2 }}>
            Configurable Split Modes & Animation Physics
          </h3>
        </div>

        {/* Controls Toolbar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: Spacing.scale.md,
            padding: Spacing.scale.md,
            backgroundColor: Colors.dark.surface2,
            borderRadius: Spacing.radius.md,
            border: `1px solid ${Colors.border.default}`,
            alignItems: 'center',
          }}
        >
          {/* Split Mode Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              SPLIT MODE
            </label>
            <div style={{ display: 'flex', gap: 4 }}>
              {SPLIT_MODES.map((m) => (
                <button
                  key={m.mode}
                  onClick={() => setSelectedMode(m.mode)}
                  style={{
                    backgroundColor: selectedMode === m.mode ? Colors.accent.cyan : Colors.dark.surface3,
                    color: selectedMode === m.mode ? '#000' : Colors.text.secondary,
                    border: `1px solid ${selectedMode === m.mode ? Colors.accent.cyan : Colors.border.default}`,
                    borderRadius: Spacing.radius.sm,
                    padding: '6px 10px',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Variant Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              VARIANT ({ALL_VARIANTS.length})
            </label>
            <select
              value={selectedVariant}
              onChange={(e) => setSelectedVariant(e.target.value as SplitTextVariant)}
              style={{
                backgroundColor: Colors.dark.surface3,
                color: Colors.text.primary,
                border: `1px solid ${Colors.border.default}`,
                borderRadius: Spacing.radius.sm,
                padding: '6px 10px',
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              {ALL_VARIANTS.map((v) => (
                <option key={v.variant} value={v.variant}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>

          {/* Stagger Delay */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              STAGGER ({staggerDelay}f)
            </label>
            <div style={{ display: 'flex', gap: 4 }}>
              {[1, 2, 3, 5, 8].map((s) => (
                <button
                  key={s}
                  onClick={() => setStaggerDelay(s)}
                  style={{
                    backgroundColor: staggerDelay === s ? Colors.accent.emerald : Colors.dark.surface3,
                    color: staggerDelay === s ? '#000' : Colors.text.secondary,
                    border: `1px solid ${staggerDelay === s ? Colors.accent.emerald : Colors.border.default}`,
                    borderRadius: Spacing.radius.sm,
                    padding: '6px 8px',
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {s}f
                </button>
              ))}
            </div>
          </div>

          {/* Segment Duration */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              DURATION ({segmentDuration}f)
            </label>
            <div style={{ display: 'flex', gap: 4 }}>
              {[12, 16, 22, 30].map((d) => (
                <button
                  key={d}
                  onClick={() => setSegmentDuration(d)}
                  style={{
                    backgroundColor: segmentDuration === d ? Colors.accent.amber : Colors.dark.surface3,
                    color: segmentDuration === d ? '#000' : Colors.text.secondary,
                    border: `1px solid ${segmentDuration === d ? Colors.accent.amber : Colors.border.default}`,
                    borderRadius: Spacing.radius.sm,
                    padding: '6px 8px',
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {d}f
                </button>
              ))}
            </div>
          </div>

          {/* Random Seed (relevant when random-stagger selected) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              SEED ({seed})
            </label>
            <div style={{ display: 'flex', gap: 4 }}>
              {[42, 1337, 2026].map((sd) => (
                <button
                  key={sd}
                  onClick={() => setSeed(sd)}
                  style={{
                    backgroundColor: seed === sd ? Colors.accent.electricViolet : Colors.dark.surface3,
                    color: seed === sd ? '#FFF' : Colors.text.secondary,
                    border: `1px solid ${seed === sd ? Colors.accent.electricViolet : Colors.border.default}`,
                    borderRadius: Spacing.radius.sm,
                    padding: '6px 8px',
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {sd}
                </button>
              ))}
            </div>
          </div>

          {/* Easing Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              EASING
            </label>
            <select
              value={easing}
              onChange={(e) => setEasing(e.target.value as EasingPresetName)}
              style={{
                backgroundColor: Colors.dark.surface3,
                color: Colors.text.primary,
                border: `1px solid ${Colors.border.default}`,
                borderRadius: Spacing.radius.sm,
                padding: '6px 8px',
                fontSize: 11,
                cursor: 'pointer',
              }}
            >
              {(['easeOutCubic', 'easeOutExpo', 'easeInOutCubic', 'linear'] as EasingPresetName[]).map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>

          {/* Reverse Button */}
          <button
            onClick={() => setIsReverse(!isReverse)}
            style={{
              padding: '6px 12px',
              backgroundColor: isReverse ? Colors.accent.crimson : Colors.dark.surface3,
              border: `1px solid ${isReverse ? Colors.accent.crimson : Colors.border.default}`,
              borderRadius: Spacing.radius.sm,
              color: isReverse ? '#FFF' : Colors.text.secondary,
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: 18,
            }}
          >
            {isReverse ? 'REVERSE: ON' : 'REVERSE: OFF'}
          </button>
        </div>

        {/* Live Interactive Preview Stage */}
        <div
          style={{
            minHeight: 180,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.dark.bgPrimary,
            borderRadius: Spacing.radius.md,
            border: `1px solid ${Colors.border.default}`,
            padding: Spacing.scale.xl,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: 840 }}>
            {selectedMode === 'custom' ? (
              <SplitText
                segments={DEMO_CUSTOM_SEGMENTS}
                splitBy="custom"
                variant={selectedVariant}
                startFrame={0}
                staggerDelay={staggerDelay}
                segmentDuration={segmentDuration}
                reverse={isReverse}
                seed={seed}
                easing={easing}
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  display: 'flex',
                  gap: Spacing.scale.md,
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              />
            ) : (
              <SplitText
                text={activeDemoText}
                splitBy={selectedMode}
                variant={selectedVariant}
                startFrame={0}
                staggerDelay={staggerDelay}
                segmentDuration={segmentDuration}
                reverse={isReverse}
                seed={seed}
                easing={easing}
                style={{
                  fontSize: selectedMode === 'line' ? 26 : 34,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  lineHeight: selectedMode === 'line' ? 1.6 : 1.35,
                  color: Colors.text.primary,
                }}
                segmentStyle={(seg) => {
                  if (seg.text.toLowerCase().includes('precision') || seg.text.toLowerCase().includes('better')) {
                    return { color: Colors.accent.emerald };
                  }
                  if (seg.text.toLowerCase().includes('scale')) {
                    return { color: Colors.accent.cyan };
                  }
                  return {};
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* SECTION 3: Side-by-Side Split Mode Comparator */}
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
        <div>
          <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.amber }}>
            CROSS-MODE ARCHITECTURAL COMPARATOR
          </span>
          <h3 style={{ ...Typography.headline.h4, color: Colors.text.primary, marginTop: 2 }}>
            Same Text Animated Under Different Segmentation Boundaries
          </h3>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: Spacing.scale.md,
          }}
        >
          {/* Card 1: Word Split */}
          <div
            style={{
              padding: Spacing.scale.md,
              backgroundColor: Colors.dark.bgPrimary,
              borderRadius: Spacing.radius.md,
              border: `1px solid ${Colors.border.default}`,
              display: 'flex',
              flexDirection: 'column',
              gap: Spacing.scale.sm,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.accent.cyan, fontWeight: 700 }}>
                MODE: WORD SPLIT
              </span>
              <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                Stagger: 3f
              </span>
            </div>
            <SplitText
              text="Move faster with better experiences."
              splitBy="word"
              variant="slide-up"
              startFrame={0}
              staggerDelay={3}
              segmentDuration={16}
              style={{ fontSize: 18, fontWeight: 700 }}
            />
          </div>

          {/* Card 2: Character Split */}
          <div
            style={{
              padding: Spacing.scale.md,
              backgroundColor: Colors.dark.bgPrimary,
              borderRadius: Spacing.radius.md,
              border: `1px solid ${Colors.border.default}`,
              display: 'flex',
              flexDirection: 'column',
              gap: Spacing.scale.sm,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.accent.electricViolet, fontWeight: 700 }}>
                MODE: CHARACTER SPLIT
              </span>
              <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                Stagger: 1f
              </span>
            </div>
            <SplitText
              text="CREATE SOMETHING AMAZING"
              splitBy="character"
              variant="wave"
              startFrame={0}
              staggerDelay={1}
              segmentDuration={14}
              style={{ fontSize: 16, fontWeight: 800, letterSpacing: '0.04em' }}
            />
          </div>

          {/* Card 3: Line Split */}
          <div
            style={{
              padding: Spacing.scale.md,
              backgroundColor: Colors.dark.bgPrimary,
              borderRadius: Spacing.radius.md,
              border: `1px solid ${Colors.border.default}`,
              display: 'flex',
              flexDirection: 'column',
              gap: Spacing.scale.sm,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.accent.emerald, fontWeight: 700 }}>
                MODE: LINE SPLIT
              </span>
              <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                Stagger: 6f
              </span>
            </div>
            <SplitText
              text={`Redefining urban transit.\nZero emissions.\nUnprecedented scale.`}
              splitBy="line"
              variant="flip-up"
              startFrame={0}
              staggerDelay={6}
              segmentDuration={20}
              style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.5 }}
            />
          </div>

          {/* Card 4: Seeded Random Stagger */}
          <div
            style={{
              padding: Spacing.scale.md,
              backgroundColor: Colors.dark.bgPrimary,
              borderRadius: Spacing.radius.md,
              border: `1px solid ${Colors.border.default}`,
              display: 'flex',
              flexDirection: 'column',
              gap: Spacing.scale.sm,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.accent.amber, fontWeight: 700 }}>
                MODE: RANDOM STAGGER
              </span>
              <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                Seed: 42 · Stagger: 3f
              </span>
            </div>
            <SplitText
              text="Optimized for seamless performance."
              splitBy="word"
              variant="random-stagger"
              seed={42}
              startFrame={0}
              staggerDelay={3}
              segmentDuration={16}
              style={{ fontSize: 18, fontWeight: 700 }}
            />
          </div>
        </div>
      </div>

      {/* SECTION 4: 14 Animation Variants Grid */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.scale.md }}>
          <div>
            <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.electricViolet }}>
              VARIANT CATALOG
            </span>
            <h3 style={{ ...Typography.headline.h4, color: Colors.text.primary, marginTop: 2 }}>
              14 Production Animation Variants (Parallel Live Render)
            </h3>
          </div>
          <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            Start: Frame 0 · Stagger: 2f
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: Spacing.scale.md,
          }}
        >
          {ALL_VARIANTS.map((v, idx) => (
            <div
              key={v.variant}
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
                <span style={{ fontSize: 12, fontWeight: 700, color: Colors.accent.cyan }}>
                  {v.label}
                </span>
                <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                  OFFSET: {idx}f
                </span>
              </div>
              <p style={{ fontSize: 11, color: Colors.text.secondary, margin: 0 }}>
                {v.desc}
              </p>

              <div
                style={{
                  minHeight: 56,
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: Colors.dark.bgPrimary,
                  borderRadius: Spacing.radius.sm,
                  padding: `0 ${Spacing.scale.md}px`,
                  border: `1px solid ${Colors.border.subtle}`,
                  marginTop: Spacing.scale.xs,
                }}
              >
                <SplitText
                  text="Accelerate your vision"
                  splitBy="word"
                  variant={v.variant}
                  startFrame={idx}
                  staggerDelay={2}
                  segmentDuration={16}
                  style={{ fontSize: 16, fontWeight: 700 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
