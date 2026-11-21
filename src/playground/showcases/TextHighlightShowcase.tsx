/**
 * TextHighlightShowcase Component
 * Interactive showcase and diagnostic harness for the TextHighlight component.
 * Demonstrates all 10 highlight variants, targeted keyword extraction,
 * directional reveals, multi-keyword emphasis, and typography scale adaptability.
 */

import React, { useState } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { TextHighlight } from '../../components/typography/TextHighlight';
import { TextHighlightVariant, TextHighlightDirection } from '../../components/typography/types';
import { EasingPresetName } from '../../utils/animation/easing';
import { Colors } from '../../styles/colors';
import { Typography } from '../../styles/typography';
import { Spacing } from '../../styles/spacing';
import { formatTimecode } from '../../utils/timing/frame';

interface VariantMeta {
  variant: TextHighlightVariant;
  label: string;
  desc: string;
  defaultColor?: string;
  defaultBg?: string;
}

const ALL_VARIANTS: VariantMeta[] = [
  { variant: 'background', label: '1. Background', desc: 'Colored container expands behind text', defaultBg: 'rgba(0, 209, 255, 0.22)' },
  { variant: 'underline', label: '2. Underline', desc: 'Horizontal animated baseline rule', defaultColor: '#00D1FF' },
  { variant: 'marker', label: '3. Marker', desc: 'Organic translucent highlighter stroke', defaultBg: 'rgba(245, 158, 11, 0.35)' },
  { variant: 'box', label: '4. Box', desc: 'Animated SVG rectangle outline drawn around text', defaultColor: '#00D1FF' },
  { variant: 'circle', label: '5. Circle', desc: 'Hand-drawn SVG elliptical emphasis ring', defaultColor: '#F59E0B' },
  { variant: 'strike', label: '6. Strike', desc: 'Animated strikethrough drawing across center', defaultColor: '#EF4444' },
  { variant: 'gradient', label: '7. Gradient', desc: 'Multi-stop linear gradient backdrop reveal', defaultBg: 'linear-gradient(90deg, rgba(0, 209, 255, 0.3) 0%, rgba(168, 85, 247, 0.3) 100%)' },
  { variant: 'glow', label: '8. Glow', desc: 'Ambient soft blur halo with subtle scale pulse', defaultColor: '#00D1FF', defaultBg: 'rgba(0, 209, 255, 0.18)' },
  { variant: 'border-bottom', label: '9. Border Bottom', desc: 'Solid editorial baseline border', defaultColor: '#10B981' },
  { variant: 'bracket', label: '10. Bracket', desc: 'Framing typographic editorial brackets', defaultColor: '#00D1FF' },
];

export const TextHighlightShowcase: React.FC = () => {
  const currentFrame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Interactive sandbox state
  const [selectedVariant, setSelectedVariant] = useState<TextHighlightVariant>('marker');
  const [selectedDirection, setSelectedDirection] = useState<TextHighlightDirection>('left-to-right');
  const [highlightKeyword, setHighlightKeyword] = useState<string>('faster');
  const [duration, setDuration] = useState<number>(20);
  const [easing, setEasing] = useState<EasingPresetName>('easeOutCubic');
  const [isReverse, setIsReverse] = useState<boolean>(false);
  const [accentColor, setAccentColor] = useState<string>('#00D1FF');

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
          <span style={{ color: Colors.accent.emerald, fontWeight: 700 }}>● TEXT HIGHLIGHT SUITE</span>
          <span style={{ color: Colors.text.tertiary }}>|</span>
          <span style={{ color: Colors.text.secondary }}>10 EDITORIAL & ADVERTISING EMPHASIS VARIANTS</span>
        </div>
        <div style={{ display: 'flex', gap: Spacing.scale.md }}>
          <span>FRAME: <strong style={{ color: Colors.accent.cyan }}>{currentFrame} / {durationInFrames}</strong></span>
          <span>TIMECODE: <strong style={{ color: Colors.accent.emerald }}>{formatTimecode(currentFrame, fps)}</strong></span>
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
            <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.emerald }}>
              INTERACTIVE EMPHASIS & TARGETING LAB
            </span>
            <h3 style={{ ...Typography.headline.h4, color: Colors.text.primary, marginTop: 2 }}>
              Dynamic Keyword Extraction & Accent Tuning
            </h3>
          </div>
        </div>

        {/* Control toolbar */}
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
          {/* Variant dropdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              VARIANT
            </label>
            <select
              value={selectedVariant}
              onChange={(e) => setSelectedVariant(e.target.value as TextHighlightVariant)}
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

          {/* Direction toggle */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              DIRECTION
            </label>
            <div style={{ display: 'flex', gap: 4 }}>
              {(['left-to-right', 'center', 'right-to-left'] as TextHighlightDirection[]).map((dir) => (
                <button
                  key={dir}
                  onClick={() => setSelectedDirection(dir)}
                  style={{
                    backgroundColor: selectedDirection === dir ? Colors.accent.emerald : Colors.dark.surface3,
                    color: selectedDirection === dir ? '#000' : Colors.text.secondary,
                    border: `1px solid ${selectedDirection === dir ? Colors.accent.emerald : Colors.border.default}`,
                    borderRadius: Spacing.radius.sm,
                    padding: '6px 10px',
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {dir}
                </button>
              ))}
            </div>
          </div>

          {/* Keyword Target Filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              TARGET KEYWORD
            </label>
            <div style={{ display: 'flex', gap: 4 }}>
              {['faster', 'better', 'experiences', 'all'].map((kw) => (
                <button
                  key={kw}
                  onClick={() => setHighlightKeyword(kw === 'all' ? '' : kw)}
                  style={{
                    backgroundColor: (kw === 'all' ? highlightKeyword === '' : highlightKeyword === kw)
                      ? Colors.accent.cyan
                      : Colors.dark.surface3,
                    color: (kw === 'all' ? highlightKeyword === '' : highlightKeyword === kw)
                      ? '#000'
                      : Colors.text.secondary,
                    border: `1px solid ${Colors.border.default}`,
                    borderRadius: Spacing.radius.sm,
                    padding: '6px 10px',
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>

          {/* Duration Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              DURATION ({duration}f)
            </label>
            <div style={{ display: 'flex', gap: 4 }}>
              {[12, 18, 25, 36].map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  style={{
                    backgroundColor: duration === d ? Colors.accent.amber : Colors.dark.surface3,
                    color: duration === d ? '#000' : Colors.text.secondary,
                    border: `1px solid ${duration === d ? Colors.accent.amber : Colors.border.default}`,
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

          {/* Color Presets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              COLOR PRESET
            </label>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {[
                { name: 'Cyan', color: '#00D1FF' },
                { name: 'Emerald', color: '#10B981' },
                { name: 'Amber', color: '#F59E0B' },
                { name: 'Violet', color: '#A855F7' },
                { name: 'Rose', color: '#EF4444' },
              ].map((c) => (
                <button
                  key={c.name}
                  onClick={() => setAccentColor(c.color)}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    backgroundColor: c.color,
                    border: accentColor === c.color ? '2px solid #FFFFFF' : '2px solid transparent',
                    cursor: 'pointer',
                  }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Reverse Toggle */}
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
          <div style={{ textAlign: 'center', maxWidth: 800 }}>
            <TextHighlight
              text="Move faster with better experiences."
              highlight={highlightKeyword || undefined}
              variant={selectedVariant}
              startFrame={0}
              durationInFrames={duration}
              easing={easing}
              direction={selectedDirection}
              reverse={isReverse}
              color={accentColor}
              borderColor={accentColor}
              backgroundColor={selectedVariant === 'marker' ? `${accentColor}40` : `${accentColor}25`}
              style={{
                fontSize: 36,
                fontWeight: 800,
                letterSpacing: '-0.02em',
                lineHeight: 1.4,
              }}
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: All 10 Highlight Variants Grid */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.scale.md }}>
          <div>
            <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan }}>
              COMPREHENSIVE VARIANT MATRIX
            </span>
            <h3 style={{ ...Typography.headline.h4, color: Colors.text.primary, marginTop: 2 }}>
              10 Production Highlight Effects (Parallel Render)
            </h3>
          </div>
          <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            Start: Frame 0 · Duration: 24f
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
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
                padding: Spacing.scale.lg,
                display: 'flex',
                flexDirection: 'column',
                gap: Spacing.scale.sm,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: Colors.accent.emerald }}>
                  {v.label}
                </span>
                <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                  START: {idx * 2}f
                </span>
              </div>
              <p style={{ fontSize: 12, color: Colors.text.secondary, margin: 0 }}>
                {v.desc}
              </p>

              <div
                style={{
                  minHeight: 72,
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: Colors.dark.bgPrimary,
                  borderRadius: Spacing.radius.sm,
                  padding: `0 ${Spacing.scale.md}px`,
                  border: `1px solid ${Colors.border.subtle}`,
                  marginTop: Spacing.scale.xs,
                }}
              >
                <TextHighlight
                  text="Make every moment count."
                  highlight="moment"
                  variant={v.variant}
                  startFrame={idx * 2}
                  durationInFrames={20}
                  color={v.defaultColor}
                  backgroundColor={v.defaultBg}
                  borderColor={v.defaultColor}
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    letterSpacing: '-0.01em',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: Editorial Sentences & Multiple Targets Showcase */}
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
        <div>
          <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.amber }}>
            EDITORIAL ADVERTISING USE CASES
          </span>
          <h3 style={{ ...Typography.headline.h4, color: Colors.text.primary, marginTop: 2 }}>
            Multi-Keyword Emphasis & Composed Statements
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.scale.md }}>
          {/* Example A: Multi-keyword extraction with array target */}
          <div
            style={{
              padding: Spacing.scale.lg,
              backgroundColor: Colors.dark.bgPrimary,
              borderRadius: Spacing.radius.md,
              border: `1px solid ${Colors.border.default}`,
            }}
          >
            <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.accent.cyan, display: 'block', marginBottom: 8 }}>
              CASE 1: MULTI-KEYWORD TARGETING (ARRAY: ['PRECISION', 'SCALE'])
            </span>
            <TextHighlight
              text="Engineered for precision. Built for unprecedented scale."
              highlight={['precision', 'scale']}
              variant="background"
              startFrame={0}
              durationInFrames={22}
              backgroundColor="rgba(0, 209, 255, 0.25)"
              borderColor="#00D1FF"
              style={{
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                lineHeight: 1.5,
              }}
            />
          </div>

          {/* Example B: Underline and Marker combination */}
          <div
            style={{
              padding: Spacing.scale.lg,
              backgroundColor: Colors.dark.bgPrimary,
              borderRadius: Spacing.radius.md,
              border: `1px solid ${Colors.border.default}`,
            }}
          >
            <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.accent.amber, display: 'block', marginBottom: 8 }}>
              CASE 2: ORGANIC EDITORIAL HIGHLIGHT WITH MARKER VARIANT
            </span>
            <TextHighlight
              text="Redefining urban transit with zero emissions."
              highlight="zero emissions"
              variant="marker"
              startFrame={5}
              durationInFrames={24}
              backgroundColor="rgba(245, 158, 11, 0.4)"
              style={{
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                lineHeight: 1.5,
              }}
            />
          </div>

          {/* Example C: High-impact Box Emphasis */}
          <div
            style={{
              padding: Spacing.scale.lg,
              backgroundColor: Colors.dark.bgPrimary,
              borderRadius: Spacing.radius.md,
              border: `1px solid ${Colors.border.default}`,
            }}
          >
            <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.accent.emerald, display: 'block', marginBottom: 8 }}>
              CASE 3: GEOMETRIC VECTOR BOX EMPHASIS
            </span>
            <TextHighlight
              text="Unlock 10x performance across global networks."
              highlight="10x performance"
              variant="box"
              startFrame={10}
              durationInFrames={22}
              borderColor="#10B981"
              color="#10B981"
              style={{
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                lineHeight: 1.5,
              }}
            />
          </div>
        </div>
      </div>

      {/* SECTION 5: Typography Scale Verification */}
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
        <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.electricViolet }}>
          SCALE COMPATIBILITY
        </span>
        <h3 style={{ ...Typography.headline.h4, color: Colors.text.primary, margin: 0 }}>
          Typography Hierarchy Verification
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.scale.md, marginTop: Spacing.scale.sm }}>
          <div style={{ padding: Spacing.scale.md, backgroundColor: Colors.dark.bgPrimary, borderRadius: Spacing.radius.sm }}>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary, display: 'block', marginBottom: 4 }}>
              DISPLAY (44px)
            </span>
            <TextHighlight
              text="Accelerate your vision"
              highlight="Accelerate"
              variant="background"
              startFrame={0}
              style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.03em' }}
            />
          </div>

          <div style={{ padding: Spacing.scale.md, backgroundColor: Colors.dark.bgPrimary, borderRadius: Spacing.radius.sm }}>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary, display: 'block', marginBottom: 4 }}>
              HEADLINE (28px)
            </span>
            <TextHighlight
              text="Built for the modern mobile economy"
              highlight="mobile economy"
              variant="underline"
              startFrame={5}
              style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}
            />
          </div>

          <div style={{ padding: Spacing.scale.md, backgroundColor: Colors.dark.bgPrimary, borderRadius: Spacing.radius.sm }}>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary, display: 'block', marginBottom: 4 }}>
              BODY / CAPTION (15px)
            </span>
            <TextHighlight
              text="Optimized for seamless cross-platform Remotion rendering."
              highlight="seamless"
              variant="marker"
              startFrame={10}
              style={{ fontSize: 15, fontWeight: 500, color: Colors.text.secondary }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
