/**
 * MotionPlayground Composition Component
 * Dedicated development environment for testing, previewing, and evaluating motion components.
 * Layer 1 of the Motion Graphics Framework.
 */

import React from 'react';
import { MotionPlaygroundProps } from './types';
import { PlaygroundShell } from './layouts/PlaygroundShell';
import { CategorySection } from './components/CategorySection';
import { ShowcaseCard } from './components/ShowcaseCard';
import { StageCanvas } from './components/StageCanvas';
import { VariantComparator } from './components/VariantComparator';
import { SHOWCASE_REGISTRY } from './showcases/showcaseRegistry';
import { PlaceholderShowcase } from './showcases/PlaceholderShowcase';
import { MotionUtilitiesShowcase } from './showcases/MotionUtilitiesShowcase';
import { AnimatedTextShowcase } from './showcases/AnimatedTextShowcase';
import { WordRevealShowcase } from './showcases/WordRevealShowcase';
import { CharacterRevealShowcase } from './showcases/CharacterRevealShowcase';
import { AnimatedText } from '../components/typography/AnimatedText';
import { WordReveal } from '../components/typography/WordReveal';
import { CharacterReveal } from '../components/typography/CharacterReveal';
import { ComponentCategory } from '../components/types';
import { Colors } from '../styles/colors';
import { Typography } from '../styles/typography';
import { Spacing } from '../styles/spacing';

const CATEGORY_METADATA: Record<ComponentCategory, { title: string; description: string }> = {
  motion: {
    title: 'Motion Primitives',
    description: 'Atomic spatial animators, coordinate transforms, reveals, and staggers.',
  },
  typography: {
    title: 'Kinetic Typography',
    description: 'High-contrast display heroes, counters, and split-text choreographies.',
  },
  ui: {
    title: 'UI Components',
    description: 'Interactive mobility cards, CTA buttons, metrics, and progress bars.',
  },
  mockups: {
    title: 'Mockup Components',
    description: 'Device hardware frames, perspective tilts, and interface viewports.',
  },
  graphics: {
    title: 'Shape & Graphic Components',
    description: 'Ambient coordinate grids, atmospheric blurs, and animated paths.',
  },
  transitions: {
    title: 'Transition Components',
    description: 'Directional wipes, camera slides, and cross-scene transitions.',
  },
};

export const MotionPlayground: React.FC<MotionPlaygroundProps> = ({
  selectedCategory = 'all',
  viewMode = 'overview',
  showGrid = true,
  variantA = 'Snappy (damping: 15, mass: 0.6, stiffness: 200)',
  variantB = 'Smooth (damping: 20, mass: 1.0, stiffness: 120)',
}) => {
  const [typoTab, setTypoTab] = React.useState<'character-reveal' | 'word-reveal' | 'animated-text' | 'all'>('all');

  // Filter registered showcases
  const filteredShowcases =
    selectedCategory === 'all'
      ? SHOWCASE_REGISTRY
      : SHOWCASE_REGISTRY.filter((s) => s.category === selectedCategory);

  // Group by category
  const categoriesToRender =
    selectedCategory === 'all'
      ? (Object.keys(CATEGORY_METADATA) as ComponentCategory[])
      : [selectedCategory];

  return (
    <PlaygroundShell selectedCategory={selectedCategory} viewMode={viewMode}>
      {/* 0. Utilities & Hooks Diagnostic Mode */}
      {viewMode === 'utilities' && (
        <MotionUtilitiesShowcase />
      )}

      {/* 0.1 Typography Showcase Mode */}
      {viewMode === 'typography' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.scale.xl }}>
          {/* Sub-navigation bar across all 3 Typography Components */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: Spacing.scale.sm,
              backgroundColor: Colors.dark.surface1,
              padding: `${Spacing.scale.sm}px ${Spacing.scale.md}px`,
              borderRadius: Spacing.radius.md,
              border: `1px solid ${Colors.border.default}`,
              flexWrap: 'wrap',
            }}
          >
            <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary, marginRight: Spacing.scale.sm }}>
              TYPOGRAPHY COMPONENTS:
            </span>
            {[
              { id: 'all', label: 'All Typography' },
              { id: 'character-reveal', label: 'CharacterReveal (Phase 2.3)' },
              { id: 'word-reveal', label: 'WordReveal (Phase 2.2)' },
              { id: 'animated-text', label: 'AnimatedText (Phase 2.1)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTypoTab(tab.id as 'character-reveal' | 'word-reveal' | 'animated-text' | 'all')}
                style={{
                  padding: '6px 14px',
                  backgroundColor: typoTab === tab.id ? Colors.accent.electricViolet : Colors.dark.surface2,
                  border: `1px solid ${typoTab === tab.id ? Colors.accent.electricViolet : Colors.border.default}`,
                  borderRadius: Spacing.radius.sm,
                  color: typoTab === tab.id ? '#fff' : Colors.text.secondary,
                  fontWeight: 700,
                  fontSize: 11,
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {(typoTab === 'all' || typoTab === 'character-reveal') && (
            <div>
              {typoTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.electricViolet, marginBottom: Spacing.scale.sm }}>
                  SECTION A: CHARACTERREVEAL COMPONENT SUITE
                </div>
              )}
              <CharacterRevealShowcase />
            </div>
          )}

          {(typoTab === 'all' || typoTab === 'word-reveal') && (
            <div style={{ marginTop: typoTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {typoTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan, marginBottom: Spacing.scale.sm }}>
                  SECTION B: WORDREVEAL COMPONENT SUITE
                </div>
              )}
              <WordRevealShowcase />
            </div>
          )}

          {(typoTab === 'all' || typoTab === 'animated-text') && (
            <div style={{ marginTop: typoTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {typoTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.brand, marginBottom: Spacing.scale.sm }}>
                  SECTION C: ANIMATEDTEXT COMPONENT SUITE
                </div>
              )}
              <AnimatedTextShowcase />
            </div>
          )}
        </div>
      )}

      {/* 1. Overview Mode: Grid of Categories & Blueprint Cards */}
      {viewMode === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.scale.xxl }}>
          {/* Top Diagnostic Banner */}
          <div
            style={{
              padding: Spacing.scale.md,
              backgroundColor: Colors.dark.surface1,
              borderRadius: Spacing.radius.md,
              border: `1px solid ${Colors.border.default}`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.scale.sm }}>
              <div>
                <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan }}>
                  PHASE 2 ENGINE · LIVE DIAGNOSTIC SHOWCASE
                </span>
                <h3 style={{ ...Typography.headline.h4, color: Colors.text.primary, marginTop: 2 }}>
                  Motion Utilities & Hooks Testbed
                </h3>
              </div>
              <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                Deterministic Frame Pipeline Active
              </span>
            </div>
            <MotionUtilitiesShowcase />
          </div>

          {categoriesToRender.map((catKey) => {
            const catItems = filteredShowcases.filter((s) => s.category === catKey);
            const meta = CATEGORY_METADATA[catKey];

            return (
              <CategorySection
                key={catKey}
                category={catKey}
                title={meta.title}
                description={meta.description}
                count={catItems.length}
              >
                {catItems.map((item) => (
                  <ShowcaseCard
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    category={item.category}
                    description={item.description}
                    variants={item.variants}
                    status={item.status}
                  >
                    {item.id === 'typo-animated-text' ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: Spacing.scale.xs,
                          padding: Spacing.scale.md,
                        }}
                      >
                        <AnimatedText
                          variant="fade-slide-up"
                          startFrame={0}
                          durationInFrames={20}
                          style={{
                            fontSize: 22,
                            fontWeight: 700,
                            color: Colors.accent.cyan,
                            letterSpacing: '-0.02em',
                          }}
                        >
                          AnimatedText
                        </AnimatedText>
                        <span
                          style={{
                            fontSize: 10,
                            fontFamily: Typography.fontFamily.mono,
                            color: Colors.accent.emerald,
                          }}
                        >
                          ● PRODUCTION READY COMPONENT
                        </span>
                      </div>
                    ) : item.id === 'typo-word-reveal' ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: Spacing.scale.xs,
                          padding: Spacing.scale.md,
                        }}
                      >
                        <WordReveal
                          text="Move faster with better experiences"
                          variant="fade-slide-up"
                          startFrame={0}
                          staggerDelay={3}
                          wordDuration={18}
                          style={{
                            fontSize: 18,
                            fontWeight: 700,
                            color: Colors.accent.cyan,
                            letterSpacing: '-0.02em',
                            textAlign: 'center',
                          }}
                          wordStyle={(word) => (word === 'better' ? { color: Colors.accent.emerald } : {})}
                        />
                        <span
                          style={{
                            fontSize: 10,
                            fontFamily: Typography.fontFamily.mono,
                            color: Colors.accent.emerald,
                            marginTop: 4,
                          }}
                        >
                          ● PRODUCTION READY COMPONENT
                        </span>
                      </div>
                    ) : item.id === 'typo-character-reveal' ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: Spacing.scale.xs,
                          padding: Spacing.scale.md,
                        }}
                      >
                        <CharacterReveal
                          text="CREATE SOMETHING AMAZING"
                          variant="wave"
                          startFrame={0}
                          staggerDelay={1}
                          characterDuration={14}
                          waveAmplitude={18}
                          style={{
                            fontSize: 16,
                            fontWeight: 800,
                            color: Colors.accent.electricViolet,
                            letterSpacing: '0.04em',
                            textAlign: 'center',
                          }}
                        />
                        <span
                          style={{
                            fontSize: 10,
                            fontFamily: Typography.fontFamily.mono,
                            color: Colors.accent.emerald,
                            marginTop: 4,
                          }}
                        >
                          ● PRODUCTION READY COMPONENT
                        </span>
                      </div>
                    ) : (
                      <PlaceholderShowcase definition={item} />
                    )}
                  </ShowcaseCard>
                ))}
              </CategorySection>
            );
          })}
        </div>
      )}

      {/* 2. Variant Comparison Mode: A/B Motion Testing */}
      {viewMode === 'comparison' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.scale.lg }}>
          <VariantComparator
            title="Spring Physics Tuning Harness"
            variantAName={variantA}
            variantAMeta={{ damping: 15, mass: 0.6, stiffness: 200 }}
            variantAPreview={
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: Spacing.scale.sm,
                }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: Spacing.radius.md,
                    backgroundColor: Colors.accent.brand,
                    border: `2px solid ${Colors.accent.brandLight}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  SNAPPY
                </div>
                <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.secondary }}>
                  Fast settle · Minimal overshoot
                </span>
              </div>
            }
            variantBName={variantB}
            variantBMeta={{ damping: 20, mass: 1.0, stiffness: 120 }}
            variantBPreview={
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: Spacing.scale.sm,
                }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: Spacing.radius.md,
                    backgroundColor: Colors.accent.electricViolet,
                    border: `2px solid ${Colors.accent.electricViolet}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  SMOOTH
                </div>
                <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.secondary }}>
                  Fluid deceleration · Balanced momentum
                </span>
              </div>
            }
          />
        </div>
      )}

      {/* 3. Isolated Stage Mode: Centered Canvas with Safe Guides */}
      {viewMode === 'isolated' && (
        <StageCanvas showGrid={showGrid} aspectRatioLabel="ISOLATED COMPONENT BENCHMARK">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              maxWidth: 600,
              padding: Spacing.scale.xl,
              backgroundColor: Colors.dark.surface1,
              borderRadius: Spacing.radius.lg,
              border: `1px solid ${Colors.border.default}`,
            }}
          >
            <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.brand, marginBottom: 8 }}>
              STAGE RESERVED
            </span>
            <h3 style={{ ...Typography.headline.h3, color: Colors.text.primary, marginBottom: 8 }}>
              Individual Component Test Canvas
            </h3>
            <p style={{ ...Typography.body.small, color: Colors.text.secondary, lineHeight: 1.5 }}>
              This isolated stage provides an unencumbered environment to test individual motion components,
              tune spring physics parameters, and verify deterministic frame boundaries.
            </p>
          </div>
        </StageCanvas>
      )}
    </PlaygroundShell>
  );
};
