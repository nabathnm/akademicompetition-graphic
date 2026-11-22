/**
 * TypographyScene Showcase
 * Interactive motion graphics playground demonstrating TypographyScene:
 * - Expressive typography centerpieces with kinetic reveals (WordReveal, CharacterReveal, TextMask, SplitText, AnimatedText)
 * - Dynamic TextHighlighting for emphasized target keywords
 * - 8 Layout variations: Centered, Left Aligned, Right Aligned, Oversized Headline, Multi-line, Split Text, Text with Graphics
 */

import React, { useState } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Type,
  Sparkles,
  Sliders,
  Layers,
} from 'lucide-react';
import { Colors } from '../../styles/colors.ts';
import { Typography } from '../../styles/typography.ts';
import { Spacing } from '../../styles/spacing.ts';
import { TypographyScene } from '../../components/scenes/TypographyScene.tsx';
import type {
  TypographySceneLayout,
  TypographySceneTextAnimation,
} from '../../components/scenes/types.ts';

export const TypographySceneShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // State
  const [layout, setLayout] = useState<TypographySceneLayout>('centered');
  const [headlineAnim, setHeadlineAnim] = useState<TypographySceneTextAnimation>('word-reveal');
  const [highlightVariant, setHighlightVariant] = useState<
    'background' | 'underline' | 'marker' | 'box' | 'circle' | 'gradient' | 'glow'
  >('background');
  const [staggerDelay, setStaggerDelay] = useState<number>(4);
  const [showSecondary, setShowSecondary] = useState<boolean>(true);
  const [showDescription, setShowDescription] = useState<boolean>(true);

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
            <Type size={20} color={Colors.accent.cyan} />
            <span
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: Colors.text.primary,
                fontFamily: Typography.fontFamily.sans,
              }}
            >
              TypographyScene
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
              LAYER 3 TEMPLATE
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
            Expressive kinetic typography templates turning words into the primary visual centerpiece.
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
          FRAME {frame} • {fps} FPS
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
        {/* Layout Mode */}
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
            LAYOUT
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {[
              { id: 'centered', label: 'Centered' },
              { id: 'left-aligned', label: 'Left' },
              { id: 'right-aligned', label: 'Right' },
              { id: 'oversized-headline', label: 'Oversized' },
              { id: 'multi-line', label: 'Multi-line' },
              { id: 'split-text', label: 'Split' },
              { id: 'text-with-graphics', label: 'Graphics' },
            ].map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setLayout(btn.id as TypographySceneLayout)}
                style={{
                  padding: '4px 8px',
                  borderRadius: Spacing.radius.xs,
                  border: `1px solid ${layout === btn.id ? Colors.accent.cyan : Colors.border.default}`,
                  backgroundColor: layout === btn.id ? `${Colors.accent.cyan}25` : Colors.dark.surface1,
                  color: layout === btn.id ? Colors.accent.cyan : Colors.text.secondary,
                  fontSize: 11,
                  fontWeight: layout === btn.id ? 700 : 500,
                  cursor: 'pointer',
                  fontFamily: Typography.fontFamily.mono,
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Kinetic Text Animation */}
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
            <Sliders size={13} color="#ec4899" />
            HEADLINE ANIMATION
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {[
              { id: 'word-reveal', label: 'WordReveal' },
              { id: 'character-reveal', label: 'Character' },
              { id: 'text-mask', label: 'TextMask' },
              { id: 'split-text', label: 'SplitText' },
              { id: 'slide-up', label: 'SlideUp' },
            ].map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setHeadlineAnim(btn.id as TypographySceneTextAnimation)}
                style={{
                  padding: '4px 8px',
                  borderRadius: Spacing.radius.xs,
                  border: `1px solid ${headlineAnim === btn.id ? '#ec4899' : Colors.border.default}`,
                  backgroundColor: headlineAnim === btn.id ? '#ec489925' : Colors.dark.surface1,
                  color: headlineAnim === btn.id ? '#ec4899' : Colors.text.secondary,
                  fontSize: 11,
                  fontWeight: headlineAnim === btn.id ? 700 : 500,
                  cursor: 'pointer',
                  fontFamily: Typography.fontFamily.mono,
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Text Highlight Variant */}
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
            <Sparkles size={13} color="#10b981" />
            HIGHLIGHT STYLE
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {(['background', 'underline', 'marker', 'box', 'glow'] as const).map((variant) => (
              <button
                key={variant}
                type="button"
                onClick={() => setHighlightVariant(variant)}
                style={{
                  padding: '4px 8px',
                  borderRadius: Spacing.radius.xs,
                  border: `1px solid ${highlightVariant === variant ? '#10b981' : Colors.border.default}`,
                  backgroundColor: highlightVariant === variant ? '#10b98125' : Colors.dark.surface1,
                  color: highlightVariant === variant ? '#10b981' : Colors.text.secondary,
                  fontSize: 11,
                  fontWeight: highlightVariant === variant ? 700 : 500,
                  cursor: 'pointer',
                  fontFamily: Typography.fontFamily.mono,
                }}
              >
                {variant}
              </button>
            ))}
          </div>
        </div>

        {/* Options */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: 11,
              fontFamily: Typography.fontFamily.mono,
              color: Colors.text.secondary,
              marginBottom: 6,
            }}
          >
            SLOTS & STAGGER
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: Colors.text.secondary }}>
              <input
                type="checkbox"
                checked={showSecondary}
                onChange={(e) => setShowSecondary(e.target.checked)}
              />
              Secondary
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: Colors.text.secondary }}>
              <input
                type="checkbox"
                checked={showDescription}
                onChange={(e) => setShowDescription(e.target.checked)}
              />
              Paragraph
            </label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              Stagger: {staggerDelay}f
            </span>
            <input
              type="range"
              min={1}
              max={8}
              value={staggerDelay}
              onChange={(e) => setStaggerDelay(Number(e.target.value))}
              style={{ width: 80 }}
            />
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
          backgroundColor: '#050811',
          position: 'relative',
        }}
      >
        <TypographyScene
          layout={layout}
          eyebrow="KINETIC TYPOGRAPHY"
          headline="Autonomous Intelligence at Scale"
          highlightedWords={['intelligence', 'scale']}
          secondaryHeadline={showSecondary ? 'Next-Generation Autonomous Motion Framework' : undefined}
          description={
            showDescription
              ? 'Standardizing video synthesis with deterministic mathematics, hardware mockups, and sub-frame rendering accuracy.'
              : undefined
          }
          decorativeElements={
            layout === 'text-with-graphics' ? (
              <div
                style={{
                  display: 'flex',
                  gap: 16,
                  alignItems: 'center',
                  backgroundColor: '#0a101f',
                  border: `1px solid ${Colors.accent.cyan}40`,
                  padding: '8px 16px',
                  borderRadius: 24,
                }}
              >
                <span style={{ fontSize: 12, color: Colors.accent.cyan, fontWeight: 700 }}>
                  ● 120 FPS DETERMINISTIC
                </span>
                <span style={{ fontSize: 12, color: Colors.text.tertiary }}>|</span>
                <span style={{ fontSize: 12, color: '#10b981', fontWeight: 700 }}>
                  ZERO HYDRATION JITTER
                </span>
              </div>
            ) : undefined
          }
          animation={{
            headlineAnimation: headlineAnim,
            highlightVariant: highlightVariant,
            staggerDelay: staggerDelay,
          }}
          safeArea={false}
          padding={32}
          background="radial-gradient(ellipse at 50% 30%, #0d1a33 0%, #040810 100%)"
        />
      </div>
    </div>
  );
};
