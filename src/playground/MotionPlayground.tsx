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
import { TextMaskShowcase } from './showcases/TextMaskShowcase';
import { TextHighlightShowcase } from './showcases/TextHighlightShowcase';
import { SplitTextShowcase } from './showcases/SplitTextShowcase';
import { AnimatedInputShowcase } from './showcases/AnimatedInputShowcase';
import { AnimatedButtonShowcase } from './showcases/AnimatedButtonShowcase';
import { AnimatedSearchBarShowcase } from './showcases/AnimatedSearchBarShowcase';
import { AnimatedCardShowcase } from './showcases/AnimatedCardShowcase';
import { AnimatedNotificationShowcase } from './showcases/AnimatedNotificationShowcase';
import { AnimatedToggleShowcase } from './showcases/AnimatedToggleShowcase';
import { AnimatedCheckboxShowcase } from './showcases/AnimatedCheckboxShowcase';
import { AnimatedShapeShowcase } from './showcases/AnimatedShapeShowcase';
import { AnimatedLineShowcase } from './showcases/AnimatedLineShowcase';
import { AnimatedCircleShowcase } from './showcases/AnimatedCircleShowcase';
import { AnimatedText } from '../components/typography/AnimatedText';
import { WordReveal } from '../components/typography/WordReveal';
import { CharacterReveal } from '../components/typography/CharacterReveal';
import { TextMask } from '../components/typography/TextMask';
import { TextHighlight } from '../components/typography/TextHighlight';
import { SplitText } from '../components/typography/SplitText';
import { AnimatedInput } from '../components/ui/AnimatedInput';
import { AnimatedButton } from '../components/ui/AnimatedButton';
import { AnimatedSearchBar } from '../components/ui/AnimatedSearchBar';
import { AnimatedCard } from '../components/ui/AnimatedCard';
import { AnimatedNotification } from '../components/ui/AnimatedNotification';
import { AnimatedToggle } from '../components/ui/AnimatedToggle';
import { AnimatedCheckbox } from '../components/ui/AnimatedCheckbox';
import { AnimatedShape } from '../components/graphics/AnimatedShape';
import { AnimatedLine } from '../components/graphics/AnimatedLine';
import { AnimatedCircle } from '../components/graphics/AnimatedCircle';
import { Search, ArrowRight } from 'lucide-react';
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
  const [typoTab, setTypoTab] = React.useState<'split-text' | 'text-highlight' | 'text-mask' | 'character-reveal' | 'word-reveal' | 'animated-text' | 'all'>('all');
  const [uiTab, setUiTab] = React.useState<'animated-checkbox' | 'animated-toggle' | 'animated-notification' | 'animated-card' | 'animated-search-bar' | 'animated-button' | 'animated-input' | 'all'>('all');
  const [graphicsTab, setGraphicsTab] = React.useState<'animated-circle' | 'animated-line' | 'animated-shape' | 'all'>('all');

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

      {/* 0.2 UI Components Showcase Mode */}
      {viewMode === 'ui' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.scale.xl }}>
          {/* Sub-navigation bar across all UI Components */}
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
              UI COMPONENTS:
            </span>
            {[
              { id: 'all', label: 'All UI Components' },
              { id: 'animated-checkbox', label: 'AnimatedCheckbox (Phase 3.7)' },
              { id: 'animated-toggle', label: 'AnimatedToggle (Phase 3.6)' },
              { id: 'animated-notification', label: 'AnimatedNotification (Phase 3.5)' },
              { id: 'animated-card', label: 'AnimatedCard (Phase 3.4)' },
              { id: 'animated-search-bar', label: 'AnimatedSearchBar (Phase 3.3)' },
              { id: 'animated-button', label: 'AnimatedButton (Phase 3.2)' },
              { id: 'animated-input', label: 'AnimatedInput (Phase 3.1)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setUiTab(tab.id as 'animated-checkbox' | 'animated-toggle' | 'animated-notification' | 'animated-card' | 'animated-search-bar' | 'animated-button' | 'animated-input' | 'all')}
                style={{
                  padding: '6px 14px',
                  backgroundColor: uiTab === tab.id ? Colors.accent.brand : Colors.dark.surface2,
                  border: `1px solid ${uiTab === tab.id ? Colors.accent.brand : Colors.border.default}`,
                  borderRadius: Spacing.radius.sm,
                  color: uiTab === tab.id ? '#fff' : Colors.text.secondary,
                  fontWeight: 700,
                  fontSize: 11,
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {(uiTab === 'all' || uiTab === 'animated-checkbox') && (
            <div>
              {uiTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan, marginBottom: Spacing.scale.sm }}>
                  SECTION A: ANIMATEDCHECKBOX COMPONENT SUITE
                </div>
              )}
              <AnimatedCheckboxShowcase />
            </div>
          )}

          {(uiTab === 'all' || uiTab === 'animated-toggle') && (
            <div style={{ marginTop: uiTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {uiTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.emerald, marginBottom: Spacing.scale.sm }}>
                  SECTION B: ANIMATEDTOGGLE COMPONENT SUITE
                </div>
              )}
              <AnimatedToggleShowcase />
            </div>
          )}

          {(uiTab === 'all' || uiTab === 'animated-notification') && (
            <div style={{ marginTop: uiTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {uiTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.electricViolet, marginBottom: Spacing.scale.sm }}>
                  SECTION C: ANIMATEDNOTIFICATION COMPONENT SUITE
                </div>
              )}
              <AnimatedNotificationShowcase />
            </div>
          )}

          {(uiTab === 'all' || uiTab === 'animated-card') && (
            <div style={{ marginTop: uiTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {uiTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.amber, marginBottom: Spacing.scale.sm }}>
                  SECTION D: ANIMATEDCARD COMPONENT SUITE
                </div>
              )}
              <AnimatedCardShowcase />
            </div>
          )}

          {(uiTab === 'all' || uiTab === 'animated-search-bar') && (
            <div style={{ marginTop: uiTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {uiTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan, marginBottom: Spacing.scale.sm }}>
                  SECTION E: ANIMATEDSEARCHBAR COMPONENT SUITE
                </div>
              )}
              <AnimatedSearchBarShowcase />
            </div>
          )}

          {(uiTab === 'all' || uiTab === 'animated-button') && (
            <div style={{ marginTop: uiTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {uiTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.brand, marginBottom: Spacing.scale.sm }}>
                  SECTION F: ANIMATEDBUTTON COMPONENT SUITE
                </div>
              )}
              <AnimatedButtonShowcase />
            </div>
          )}

          {(uiTab === 'all' || uiTab === 'animated-input') && (
            <div style={{ marginTop: uiTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {uiTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.emerald, marginBottom: Spacing.scale.sm }}>
                  SECTION G: ANIMATEDINPUT COMPONENT SUITE
                </div>
              )}
              <AnimatedInputShowcase />
            </div>
          )}
        </div>
      )}

      {/* 0.1 Typography Showcase Mode */}
      {viewMode === 'typography' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.scale.xl }}>
          {/* Sub-navigation bar across all 6 Typography Components */}
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
              { id: 'split-text', label: 'SplitText (Phase 2.6)' },
              { id: 'text-highlight', label: 'TextHighlight (Phase 2.5)' },
              { id: 'text-mask', label: 'TextMask (Phase 2.4)' },
              { id: 'character-reveal', label: 'CharacterReveal (Phase 2.3)' },
              { id: 'word-reveal', label: 'WordReveal (Phase 2.2)' },
              { id: 'animated-text', label: 'AnimatedText (Phase 2.1)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTypoTab(tab.id as 'split-text' | 'text-highlight' | 'text-mask' | 'character-reveal' | 'word-reveal' | 'animated-text' | 'all')}
                style={{
                  padding: '6px 14px',
                  backgroundColor: typoTab === tab.id ? Colors.accent.cyan : Colors.dark.surface2,
                  border: `1px solid ${typoTab === tab.id ? Colors.accent.cyan : Colors.border.default}`,
                  borderRadius: Spacing.radius.sm,
                  color: typoTab === tab.id ? '#000' : Colors.text.secondary,
                  fontWeight: 700,
                  fontSize: 11,
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {(typoTab === 'all' || typoTab === 'split-text') && (
            <div>
              {typoTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan, marginBottom: Spacing.scale.sm }}>
                  SECTION A: SPLITTEXT COMPONENT SUITE
                </div>
              )}
              <SplitTextShowcase />
            </div>
          )}

          {(typoTab === 'all' || typoTab === 'text-highlight') && (
            <div style={{ marginTop: typoTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {typoTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.emerald, marginBottom: Spacing.scale.sm }}>
                  SECTION B: TEXTHIGHLIGHT COMPONENT SUITE
                </div>
              )}
              <TextHighlightShowcase />
            </div>
          )}

          {(typoTab === 'all' || typoTab === 'text-mask') && (
            <div style={{ marginTop: typoTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {typoTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.amber, marginBottom: Spacing.scale.sm }}>
                  SECTION C: TEXTMASK COMPONENT SUITE
                </div>
              )}
              <TextMaskShowcase />
            </div>
          )}

          {(typoTab === 'all' || typoTab === 'character-reveal') && (
            <div style={{ marginTop: typoTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {typoTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.electricViolet, marginBottom: Spacing.scale.sm }}>
                  SECTION D: CHARACTERREVEAL COMPONENT SUITE
                </div>
              )}
              <CharacterRevealShowcase />
            </div>
          )}

          {(typoTab === 'all' || typoTab === 'word-reveal') && (
            <div style={{ marginTop: typoTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {typoTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan, marginBottom: Spacing.scale.sm }}>
                  SECTION E: WORDREVEAL COMPONENT SUITE
                </div>
              )}
              <WordRevealShowcase />
            </div>
          )}

          {(typoTab === 'all' || typoTab === 'animated-text') && (
            <div style={{ marginTop: typoTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {typoTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.brand, marginBottom: Spacing.scale.sm }}>
                  SECTION F: ANIMATEDTEXT COMPONENT SUITE
                </div>
              )}
              <AnimatedTextShowcase />
            </div>
          )}
        </div>
      )}

      {/* 0.3 Graphics Components Showcase Mode */}
      {viewMode === 'graphics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.scale.xl }}>
          {/* Sub-navigation bar across Graphics Components */}
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
              GRAPHICS COMPONENTS:
            </span>
            {[
              { id: 'all', label: 'All Graphics' },
              { id: 'animated-circle', label: 'AnimatedCircle' },
              { id: 'animated-line', label: 'AnimatedLine' },
              { id: 'animated-shape', label: 'AnimatedShape' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setGraphicsTab(tab.id as typeof graphicsTab)}
                style={{
                  padding: '6px 12px',
                  borderRadius: Spacing.radius.xs,
                  backgroundColor: graphicsTab === tab.id ? Colors.accent.cyan : Colors.dark.surface2,
                  border: `1px solid ${graphicsTab === tab.id ? Colors.accent.cyan : Colors.border.default}`,
                  color: graphicsTab === tab.id ? '#000000' : Colors.text.secondary,
                  fontFamily: Typography.fontFamily.mono,
                  fontSize: 11,
                  fontWeight: graphicsTab === tab.id ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {(graphicsTab === 'all' || graphicsTab === 'animated-circle') && (
            <div>
              {graphicsTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan, marginBottom: Spacing.scale.sm }}>
                  SECTION A: ANIMATEDCIRCLE COMPONENT SUITE
                </div>
              )}
              <AnimatedCircleShowcase />
            </div>
          )}

          {(graphicsTab === 'all' || graphicsTab === 'animated-line') && (
            <div style={{ marginTop: graphicsTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {graphicsTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.emerald, marginBottom: Spacing.scale.sm }}>
                  SECTION B: ANIMATEDLINE COMPONENT SUITE
                </div>
              )}
              <AnimatedLineShowcase />
            </div>
          )}

          {(graphicsTab === 'all' || graphicsTab === 'animated-shape') && (
            <div style={{ marginTop: graphicsTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {graphicsTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.brand, marginBottom: Spacing.scale.sm }}>
                  SECTION C: ANIMATEDSHAPE COMPONENT SUITE
                </div>
              )}
              <AnimatedShapeShowcase />
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
                    ) : item.id === 'typo-text-mask' ? (
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
                        <TextMask
                          variant="bottom-reveal"
                          text="ENGINEERED TO MOVE CITIES"
                          startFrame={0}
                          durationInFrames={20}
                          showMaskBounds={true}
                          style={{
                            fontSize: 16,
                            fontWeight: 800,
                            color: Colors.accent.amber,
                            letterSpacing: '-0.02em',
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
                    ) : item.id === 'typo-text-highlight' ? (
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
                        <TextHighlight
                          text="Make every moment count."
                          highlight="moment"
                          variant="marker"
                          startFrame={0}
                          durationInFrames={20}
                          backgroundColor="rgba(245, 158, 11, 0.4)"
                          style={{
                            fontSize: 16,
                            fontWeight: 700,
                            color: Colors.text.primary,
                            letterSpacing: '-0.01em',
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
                    ) : item.id === 'typo-split-text' ? (
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
                        <SplitText
                          text="OPTIMIZED FOR IMPACT"
                          splitBy="word"
                          variant="flip-up"
                          startFrame={0}
                          staggerDelay={4}
                          segmentDuration={18}
                          style={{
                            fontSize: 16,
                            fontWeight: 800,
                            color: Colors.accent.cyan,
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
                    ) : item.id === 'ui-animated-checkbox' ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: Spacing.scale.sm,
                          padding: Spacing.scale.md,
                          width: '100%',
                          minHeight: 120,
                        }}
                      >
                        <AnimatedCheckbox
                          size="medium"
                          animationVariant="combined"
                          defaultChecked={false}
                          checked={true}
                          checkFrame={12}
                          durationInFrames={12}
                          label="Trip PIN Verified"
                          description="4-digit security code confirmed"
                        />
                        <span
                          style={{
                            fontSize: 10,
                            fontFamily: Typography.fontFamily.mono,
                            color: Colors.accent.emerald,
                            marginTop: Spacing.scale.xs,
                          }}
                        >
                          ● PRODUCTION READY COMPONENT
                        </span>
                      </div>
                    ) : item.id === 'ui-animated-toggle' ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: Spacing.scale.sm,
                          padding: Spacing.scale.md,
                          width: '100%',
                          minHeight: 120,
                        }}
                      >
                        <AnimatedToggle
                          size="medium"
                          animationVariant="combined"
                          defaultChecked={false}
                          checked={true}
                          toggleFrame={12}
                          durationInFrames={12}
                          label="Auto-Accept Rides"
                          description="Priority driver mode"
                        />
                        <span
                          style={{
                            fontSize: 10,
                            fontFamily: Typography.fontFamily.mono,
                            color: Colors.accent.emerald,
                            marginTop: Spacing.scale.xs,
                          }}
                        >
                          ● PRODUCTION READY COMPONENT
                        </span>
                      </div>
                    ) : item.id === 'ui-animated-notification' ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: Spacing.scale.xs,
                          padding: Spacing.scale.md,
                          width: '100%',
                          minHeight: 120,
                          position: 'relative',
                        }}
                      >
                        <AnimatedNotification
                          type="success"
                          variant="toast"
                          title="Driver Arrived"
                          description="Your Tesla Model S is outside"
                          timestamp="Just now"
                          position="center"
                          startFrame={0}
                          durationInFrames={20}
                          showProgress={true}
                          progressDuration={60}
                        />
                        <span
                          style={{
                            fontSize: 10,
                            fontFamily: Typography.fontFamily.mono,
                            color: Colors.accent.emerald,
                            marginTop: Spacing.scale.sm,
                          }}
                        >
                          ● PRODUCTION READY COMPONENT
                        </span>
                      </div>
                    ) : item.id === 'ui-animated-card' ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: Spacing.scale.xs,
                          padding: Spacing.scale.md,
                          width: '100%',
                        }}
                      >
                        <AnimatedCard
                          title="Uber Black"
                          description="Premium luxury rides with top drivers"
                          variant="elevated"
                          size="sm"
                          animation="pop"
                          startFrame={0}
                          durationInFrames={14}
                          badge="VIP"
                          width="100%"
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
                    ) : item.id === 'ui-animated-search-bar' ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: Spacing.scale.xs,
                          padding: Spacing.scale.md,
                          width: '100%',
                        }}
                      >
                        <AnimatedSearchBar
                          value="SFO Airport"
                          placeholder="Where to?"
                          variant="rounded"
                          size="sm"
                          startFrame={0}
                          focusFrame={6}
                          typingStartFrame={12}
                          suggestionStartFrame={999}
                          resultsStartFrame={999}
                          showSubmitButton={true}
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
                    ) : item.id === 'ui-animated-button' ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: Spacing.scale.xs,
                          padding: Spacing.scale.md,
                          width: '100%',
                        }}
                      >
                        <AnimatedButton
                          label="Confirm Ride"
                          variant="primary"
                          size="md"
                          startFrame={0}
                          hoverFrame={10}
                          pressFrame={20}
                          releaseFrame={28}
                          showTrailingIcon={true}
                          trailingIcon={ArrowRight}
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
                    ) : item.id === 'ui-animated-input' ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: Spacing.scale.xs,
                          padding: Spacing.scale.md,
                          width: '100%',
                        }}
                      >
                        <AnimatedInput
                          value="san francisco, ca"
                          placeholder="Where to?"
                          variant="outlined"
                          size="sm"
                          startFrame={0}
                          focusFrame={6}
                          typingStartFrame={12}
                          typingSpeed={2}
                          showLeadingIcon={true}
                          leadingIcon={Search}
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
                    ) : item.id === 'graphic-animated-circle' ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: Spacing.scale.sm,
                          padding: Spacing.scale.md,
                          width: '100%',
                          minHeight: 120,
                        }}
                      >
                        <AnimatedCircle
                          radius={32}
                          stroke={Colors.accent.cyan}
                          strokeWidth={5}
                          progress={0.78}
                          showTrack={true}
                          animation="progress"
                          delay={0}
                          durationInFrames={20}
                        >
                          <span style={{ fontSize: 11, fontWeight: 800, fontFamily: Typography.fontFamily.mono }}>
                            78%
                          </span>
                        </AnimatedCircle>
                        <span
                          style={{
                            fontSize: 10,
                            fontFamily: Typography.fontFamily.mono,
                            color: Colors.accent.emerald,
                            marginTop: Spacing.scale.xs,
                          }}
                        >
                          ● PRODUCTION READY COMPONENT
                        </span>
                      </div>
                    ) : item.id === 'graphic-animated-line' ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: Spacing.scale.sm,
                          padding: Spacing.scale.md,
                          width: '100%',
                          minHeight: 120,
                        }}
                      >
                        <AnimatedLine
                          orientation="horizontal"
                          length={140}
                          stroke={Colors.accent.cyan}
                          strokeWidth={3}
                          strokeLinecap="round"
                          animation="draw-in"
                          delay={0}
                          durationInFrames={20}
                        />
                        <span
                          style={{
                            fontSize: 10,
                            fontFamily: Typography.fontFamily.mono,
                            color: Colors.accent.emerald,
                            marginTop: Spacing.scale.xs,
                          }}
                        >
                          ● PRODUCTION READY COMPONENT
                        </span>
                      </div>
                    ) : item.id === 'graphic-animated-shape' ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: Spacing.scale.sm,
                          padding: Spacing.scale.md,
                          width: '100%',
                          minHeight: 120,
                        }}
                      >
                        <AnimatedShape
                          shape="rounded-rectangle"
                          width={68}
                          height={68}
                          borderRadius={14}
                          fill="rgba(39, 110, 241, 0.2)"
                          stroke={Colors.accent.brand}
                          strokeWidth={2.5}
                          animation="combined"
                          delay={0}
                          durationInFrames={18}
                        />
                        <span
                          style={{
                            fontSize: 10,
                            fontFamily: Typography.fontFamily.mono,
                            color: Colors.accent.emerald,
                            marginTop: Spacing.scale.xs,
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
