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
import { AnimatedArrowShowcase } from './showcases/AnimatedArrowShowcase';
import { AnimatedPathShowcase } from './showcases/AnimatedPathShowcase';
import { ParticleSystemShowcase } from './showcases/ParticleSystemShowcase';
import { DeviceFrameShowcase } from './showcases/DeviceFrameShowcase';
import { SmartphoneMockupShowcase } from './showcases/SmartphoneMockupShowcase';
import { BrowserWindowMockupShowcase } from './showcases/BrowserWindowMockupShowcase';
import { LaptopMockupShowcase } from './showcases/LaptopMockupShowcase';
import { TabletMockupShowcase } from './showcases/TabletMockupShowcase';
import { FadeTransitionShowcase } from './showcases/FadeTransitionShowcase';
import { SlideTransitionShowcase } from './showcases/SlideTransitionShowcase';
import { ZoomTransitionShowcase } from './showcases/ZoomTransitionShowcase';
import { WipeTransitionShowcase } from './showcases/WipeTransitionShowcase';
import { MaskTransitionShowcase } from './showcases/MaskTransitionShowcase';
import { SplitTransitionShowcase } from './showcases/SplitTransitionShowcase';
import { MorphTransitionShowcase } from './showcases/MorphTransitionShowcase';
import { GlitchTransitionShowcase } from './showcases/GlitchTransitionShowcase';
import { SceneContainerShowcase } from './showcases/SceneContainerShowcase';
import { HeroSceneShowcase } from './showcases/HeroSceneShowcase';
import { ProductShowcaseSceneShowcase } from './showcases/ProductShowcaseSceneShowcase';
import { FeatureHighlightSceneShowcase } from './showcases/FeatureHighlightSceneShowcase';
import { TypographySceneShowcase } from './showcases/TypographySceneShowcase';
import { DeviceShowcaseSceneShowcase } from './showcases/DeviceShowcaseSceneShowcase';
import { ComparisonSceneShowcase } from './showcases/ComparisonSceneShowcase';
import { CallToActionSceneShowcase } from './showcases/CallToActionSceneShowcase';
import { OutroSceneShowcase } from './showcases/OutroSceneShowcase';
import { AdvertisementCompositionShowcase } from './showcases/AdvertisementCompositionShowcase';
import { SceneSequenceShowcase } from './showcases/SceneSequenceShowcase';
import { TimelineManagerShowcase } from './showcases/TimelineManagerShowcase';
import { TransitionControllerShowcase } from './showcases/TransitionControllerShowcase';
import { AudioTrackShowcase } from './showcases/AudioTrackShowcase';
import { BackgroundMusicShowcase } from './showcases/BackgroundMusicShowcase';
import { SoundEffectShowcase } from './showcases/SoundEffectShowcase';
import { GlobalAnimationConfigShowcase } from './showcases/GlobalAnimationConfigShowcase';
import { AdvertisementPreviewShowcase } from './showcases/AdvertisementPreviewShowcase';
import { ComponentIntegrationShowcase } from './showcases/ComponentIntegrationShowcase';
import { AudioTimelineSyncShowcase } from './showcases/AudioTimelineSyncShowcase';
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
import { AnimatedArrow } from '../components/graphics/AnimatedArrow';
import { AnimatedPath } from '../components/graphics/AnimatedPath';
import { ParticleSystem } from '../components/graphics/ParticleSystem';
import { DeviceFrame } from '../components/mockups/DeviceFrame';
import { SmartphoneMockup } from '../components/mockups/SmartphoneMockup';
import { BrowserWindowMockup } from '../components/mockups/BrowserWindowMockup';
import { LaptopMockup } from '../components/mockups/LaptopMockup';
import { TabletMockup } from '../components/mockups/TabletMockup';
import { FadeTransition } from '../components/transitions/FadeTransition';
import { SlideTransition } from '../components/transitions/SlideTransition';
import { ZoomTransition } from '../components/transitions/ZoomTransition';
import { WipeTransition } from '../components/transitions/WipeTransition';
import { MaskTransition } from '../components/transitions/MaskTransition';
import { SplitTransition } from '../components/transitions/SplitTransition';
import { MorphTransition } from '../components/transitions/MorphTransition';
import { GlitchTransition } from '../components/transitions/GlitchTransition';
import { TransitionController } from '../components/transitions/TransitionController';
import { SceneContainer } from '../components/scenes/SceneContainer';
import { HeroScene } from '../components/scenes/HeroScene';
import { ProductShowcaseScene } from '../components/scenes/ProductShowcaseScene';
import { FeatureHighlightScene } from '../components/scenes/FeatureHighlightScene';
import { TypographyScene } from '../components/scenes/TypographyScene';
import { DeviceShowcaseScene } from '../components/scenes/DeviceShowcaseScene';
import { ComparisonScene } from '../components/scenes/ComparisonScene';
import { CallToActionScene } from '../components/scenes/CallToActionScene';
import { OutroScene } from '../components/scenes/OutroScene';
import { AdvertisementComposition } from '../compositions/advertisements/AdvertisementComposition';
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
  scenes: {
    title: 'Scene Templates',
    description: 'Foundational container primitives, commercial hero compositions, and layout structures.',
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
  const [mockupsTab, setMockupsTab] = React.useState<'all' | 'tablet' | 'laptop' | 'browser' | 'smartphone' | 'device-frame'>('all');
  const [graphicsTab, setGraphicsTab] = React.useState<'animated-arrow' | 'animated-circle' | 'animated-line' | 'animated-shape' | 'animated-path' | 'particle-system' | 'all'>('all');
  const [transitionsTab, setTransitionsTab] = React.useState<'all' | 'controller' | 'glitch' | 'morph' | 'split' | 'mask' | 'wipe' | 'zoom' | 'slide' | 'fade'>('all');
  const [scenesTab, setScenesTab] = React.useState<
    | 'all'
    | 'container'
    | 'hero'
    | 'product'
    | 'feature'
    | 'typography'
    | 'device'
    | 'comparison'
    | 'cta'
    | 'outro'
    | 'ad-comp'
    | 'scene-sequence'
    | 'timeline-manager'
    | 'transition-controller'
    | 'audio-track'
    | 'background-music'
    | 'sound-effect'
    | 'global-animation-config'
    | 'advertisement-preview'
    | 'component-integration'
    | 'audio-timeline-sync'
  >('all');

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
              { id: 'animated-arrow', label: 'AnimatedArrow' },
              { id: 'animated-circle', label: 'AnimatedCircle' },
              { id: 'animated-line', label: 'AnimatedLine' },
              { id: 'animated-shape', label: 'AnimatedShape' },
              { id: 'animated-path', label: 'AnimatedPath' },
              { id: 'particle-system', label: 'ParticleSystem' },
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

          {(graphicsTab === 'all' || graphicsTab === 'animated-arrow') && (
            <div>
              {graphicsTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.amber, marginBottom: Spacing.scale.sm }}>
                  SECTION A: ANIMATEDARROW COMPONENT SUITE
                </div>
              )}
              <AnimatedArrowShowcase />
            </div>
          )}

          {(graphicsTab === 'all' || graphicsTab === 'animated-circle') && (
            <div style={{ marginTop: graphicsTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {graphicsTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan, marginBottom: Spacing.scale.sm }}>
                  SECTION B: ANIMATEDCIRCLE COMPONENT SUITE
                </div>
              )}
              <AnimatedCircleShowcase />
            </div>
          )}

          {(graphicsTab === 'all' || graphicsTab === 'animated-line') && (
            <div style={{ marginTop: graphicsTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {graphicsTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.emerald, marginBottom: Spacing.scale.sm }}>
                  SECTION C: ANIMATEDLINE COMPONENT SUITE
                </div>
              )}
              <AnimatedLineShowcase />
            </div>
          )}

          {(graphicsTab === 'all' || graphicsTab === 'animated-shape') && (
            <div style={{ marginTop: graphicsTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {graphicsTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.brand, marginBottom: Spacing.scale.sm }}>
                  SECTION D: ANIMATEDSHAPE COMPONENT SUITE
                </div>
              )}
              <AnimatedShapeShowcase />
            </div>
          )}

          {(graphicsTab === 'all' || graphicsTab === 'animated-path') && (
            <div style={{ marginTop: graphicsTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {graphicsTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan, marginBottom: Spacing.scale.sm }}>
                  SECTION E: ANIMATEDPATH COMPONENT SUITE
                </div>
              )}
              <AnimatedPathShowcase />
            </div>
          )}

          {(graphicsTab === 'all' || graphicsTab === 'particle-system') && (
            <div style={{ marginTop: graphicsTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {graphicsTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.amber, marginBottom: Spacing.scale.sm }}>
                  SECTION F: PARTICLESYSTEM COMPONENT SUITE
                </div>
              )}
              <ParticleSystemShowcase />
            </div>
          )}


        </div>
      )}

      {/* 0.4 Mockups Components Showcase Mode */}
      {viewMode === 'mockups' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.scale.xl }}>
          {/* Sub-navigation bar across Mockup Components */}
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
              MOCKUP COMPONENTS:
            </span>
            {[
              { id: 'all', label: 'All Mockups' },
              { id: 'tablet', label: 'TabletMockup' },
              { id: 'laptop', label: 'LaptopMockup' },
              { id: 'browser', label: 'BrowserWindowMockup' },
              { id: 'smartphone', label: 'SmartphoneMockup' },
              { id: 'device-frame', label: 'DeviceFrame' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setMockupsTab(tab.id as typeof mockupsTab)}
                style={{
                  padding: '6px 12px',
                  borderRadius: Spacing.radius.xs,
                  backgroundColor: mockupsTab === tab.id ? Colors.accent.cyan : Colors.dark.surface2,
                  border: `1px solid ${mockupsTab === tab.id ? Colors.accent.cyan : Colors.border.default}`,
                  color: mockupsTab === tab.id ? '#000000' : Colors.text.secondary,
                  fontFamily: Typography.fontFamily.mono,
                  fontSize: 11,
                  fontWeight: mockupsTab === tab.id ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {(mockupsTab === 'all' || mockupsTab === 'tablet') && (
            <div>
              {mockupsTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan, marginBottom: Spacing.scale.sm }}>
                  SECTION A: TABLETMOCKUP COMPONENT SUITE
                </div>
              )}
              <TabletMockupShowcase />
            </div>
          )}

          {(mockupsTab === 'all' || mockupsTab === 'laptop') && (
            <div style={{ marginTop: mockupsTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {mockupsTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.brandLight, marginBottom: Spacing.scale.sm }}>
                  SECTION B: LAPTOPMOCKUP COMPONENT SUITE
                </div>
              )}
              <LaptopMockupShowcase />
            </div>
          )}

          {(mockupsTab === 'all' || mockupsTab === 'browser') && (
            <div style={{ marginTop: mockupsTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {mockupsTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan, marginBottom: Spacing.scale.sm }}>
                  SECTION C: BROWSERWINDOWMOCKUP COMPONENT SUITE
                </div>
              )}
              <BrowserWindowMockupShowcase />
            </div>
          )}

          {(mockupsTab === 'all' || mockupsTab === 'smartphone') && (
            <div style={{ marginTop: mockupsTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {mockupsTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.emerald, marginBottom: Spacing.scale.sm }}>
                  SECTION D: SMARTPHONEMOCKUP COMPONENT SUITE
                </div>
              )}
              <SmartphoneMockupShowcase />
            </div>
          )}

          {(mockupsTab === 'all' || mockupsTab === 'device-frame') && (
            <div style={{ marginTop: mockupsTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {mockupsTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.amber, marginBottom: Spacing.scale.sm }}>
                  SECTION E: DEVICEFRAME COMPONENT SUITE
                </div>
              )}
              <DeviceFrameShowcase />
            </div>
          )}
        </div>
      )}

      {/* 0.5 Transitions Components Showcase Mode */}
      {viewMode === 'transitions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.scale.xl }}>
          {/* Sub-navigation bar across Transition Components */}
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
              TRANSITION COMPONENTS:
            </span>
            {[
              { id: 'all', label: 'All Transitions' },
              { id: 'controller', label: 'TransitionController' },
              { id: 'glitch', label: 'GlitchTransition' },
              { id: 'morph', label: 'MorphTransition' },
              { id: 'split', label: 'SplitTransition' },
              { id: 'mask', label: 'MaskTransition' },
              { id: 'wipe', label: 'WipeTransition' },
              { id: 'zoom', label: 'ZoomTransition' },
              { id: 'slide', label: 'SlideTransition' },
              { id: 'fade', label: 'FadeTransition' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTransitionsTab(tab.id as typeof transitionsTab)}
                style={{
                  padding: '6px 12px',
                  borderRadius: Spacing.radius.xs,
                  backgroundColor: transitionsTab === tab.id ? Colors.accent.cyan : Colors.dark.surface2,
                  border: `1px solid ${transitionsTab === tab.id ? Colors.accent.cyan : Colors.border.default}`,
                  color: transitionsTab === tab.id ? '#000000' : Colors.text.secondary,
                  fontFamily: Typography.fontFamily.mono,
                  fontSize: 11,
                  fontWeight: transitionsTab === tab.id ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {(transitionsTab === 'all' || transitionsTab === 'wipe') && (
            <div>
              {transitionsTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan, marginBottom: Spacing.scale.sm }}>
                  SECTION A: WIPETRANSITION COMPONENT SUITE
                </div>
              )}
              <WipeTransitionShowcase />
            </div>
          )}

          {(transitionsTab === 'all' || transitionsTab === 'zoom') && (
            <div style={{ marginTop: transitionsTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {transitionsTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: '#ec4899', marginBottom: Spacing.scale.sm }}>
                  SECTION B: ZOOMTRANSITION COMPONENT SUITE
                </div>
              )}
              <ZoomTransitionShowcase />
            </div>
          )}

          {(transitionsTab === 'all' || transitionsTab === 'slide') && (
            <div style={{ marginTop: transitionsTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {transitionsTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan, marginBottom: Spacing.scale.sm }}>
                  SECTION C: SLIDETRANSITION COMPONENT SUITE
                </div>
              )}
              <SlideTransitionShowcase />
            </div>
          )}

          {(transitionsTab === 'all' || transitionsTab === 'fade') && (
            <div style={{ marginTop: transitionsTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {transitionsTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.electricViolet, marginBottom: Spacing.scale.sm }}>
                  SECTION D: FADETRANSITION COMPONENT SUITE
                </div>
              )}
              <FadeTransitionShowcase />
            </div>
          )}

          {(transitionsTab === 'all' || transitionsTab === 'mask') && (
            <div style={{ marginTop: transitionsTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {transitionsTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan, marginBottom: Spacing.scale.sm }}>
                  SECTION E: MASKTRANSITION COMPONENT SUITE
                </div>
              )}
              <MaskTransitionShowcase />
            </div>
          )}

          {(transitionsTab === 'all' || transitionsTab === 'split') && (
            <div style={{ marginTop: transitionsTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {transitionsTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.emerald, marginBottom: Spacing.scale.sm }}>
                  SECTION F: SPLITTRANSITION COMPONENT SUITE
                </div>
              )}
              <SplitTransitionShowcase />
            </div>
          )}

          {(transitionsTab === 'all' || transitionsTab === 'morph') && (
            <div style={{ marginTop: transitionsTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {transitionsTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan, marginBottom: Spacing.scale.sm }}>
                  SECTION G: MORPHTRANSITION COMPONENT SUITE
                </div>
              )}
              <MorphTransitionShowcase />
            </div>
          )}

          {(transitionsTab === 'all' || transitionsTab === 'glitch') && (
            <div style={{ marginTop: transitionsTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {transitionsTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: '#ec4899', marginBottom: Spacing.scale.sm }}>
                  SECTION H: GLITCHTRANSITION COMPONENT SUITE
                </div>
              )}
              <GlitchTransitionShowcase />
            </div>
          )}

          {(transitionsTab === 'all' || transitionsTab === 'controller') && (
            <div style={{ marginTop: transitionsTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {transitionsTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.brand, marginBottom: Spacing.scale.sm }}>
                  SECTION I: TRANSITIONCONTROLLER ORCHESTRATOR
                </div>
              )}
              <TransitionControllerShowcase />
            </div>
          )}
        </div>
      )}

      {/* 0.6 Scene Components Showcase Mode */}
      {viewMode === 'scenes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.scale.xl }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: Spacing.scale.sm,
              backgroundColor: Colors.dark.surface1,
              padding: Spacing.scale.sm,
              borderRadius: Spacing.radius.md,
              border: `1px solid ${Colors.border.default}`,
              flexWrap: 'wrap',
            }}
          >
            <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary, marginRight: Spacing.scale.sm }}>
              SCENE TEMPLATES:
            </span>
            {[
              { id: 'all', label: 'All Scenes' },
              { id: 'container', label: 'SceneContainer' },
              { id: 'hero', label: 'HeroScene' },
              { id: 'product', label: 'ProductShowcaseScene' },
              { id: 'feature', label: 'FeatureHighlightScene' },
              { id: 'typography', label: 'TypographyScene' },
              { id: 'device', label: 'DeviceShowcaseScene' },
              { id: 'comparison', label: 'ComparisonScene' },
              { id: 'cta', label: 'CallToActionScene' },
              { id: 'outro', label: 'OutroScene' },
              { id: 'ad-comp', label: 'AdvertisementComposition' },
              { id: 'scene-sequence', label: 'SceneSequence' },
              { id: 'timeline-manager', label: 'TimelineManager' },
              { id: 'transition-controller', label: 'TransitionController' },
              { id: 'audio-track', label: 'AudioTrack' },
              { id: 'background-music', label: 'BackgroundMusic' },
              { id: 'sound-effect', label: 'SoundEffect' },
              { id: 'global-animation-config', label: 'GlobalAnimationConfig' },
              { id: 'advertisement-preview', label: 'AdvertisementPreview' },
              { id: 'component-integration', label: 'ComponentIntegration' },
              { id: 'audio-timeline-sync', label: 'AudioTimelineSync' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setScenesTab(tab.id as typeof scenesTab)}
                style={{
                  padding: '6px 12px',
                  borderRadius: Spacing.radius.xs,
                  backgroundColor: scenesTab === tab.id ? Colors.accent.cyan : Colors.dark.surface2,
                  border: `1px solid ${scenesTab === tab.id ? Colors.accent.cyan : Colors.border.default}`,
                  color: scenesTab === tab.id ? '#000000' : Colors.text.secondary,
                  fontFamily: Typography.fontFamily.mono,
                  fontSize: 11,
                  fontWeight: scenesTab === tab.id ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {(scenesTab === 'all' || scenesTab === 'container') && (
            <div>
              {scenesTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan, marginBottom: Spacing.scale.sm }}>
                  SECTION A: SCENECONTAINER FOUNDATION
                </div>
              )}
              <SceneContainerShowcase />
            </div>
          )}

          {(scenesTab === 'all' || scenesTab === 'hero') && (
            <div style={{ marginTop: scenesTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {scenesTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: '#ec4899', marginBottom: Spacing.scale.sm }}>
                  SECTION B: HEROSCENE TEMPLATE
                </div>
              )}
              <HeroSceneShowcase />
            </div>
          )}

          {(scenesTab === 'all' || scenesTab === 'product') && (
            <div style={{ marginTop: scenesTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {scenesTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan, marginBottom: Spacing.scale.sm }}>
                  SECTION C: PRODUCTSHOWCASESCENE TEMPLATE
                </div>
              )}
              <ProductShowcaseSceneShowcase />
            </div>
          )}

          {(scenesTab === 'all' || scenesTab === 'feature') && (
            <div style={{ marginTop: scenesTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {scenesTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.emerald, marginBottom: Spacing.scale.sm }}>
                  SECTION D: FEATUREHIGHLIGHTSCENE TEMPLATE
                </div>
              )}
              <FeatureHighlightSceneShowcase />
            </div>
          )}

          {(scenesTab === 'all' || scenesTab === 'typography') && (
            <div style={{ marginTop: scenesTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {scenesTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan, marginBottom: Spacing.scale.sm }}>
                  SECTION E: TYPOGRAPHYSCENE TEMPLATE
                </div>
              )}
              <TypographySceneShowcase />
            </div>
          )}

          {(scenesTab === 'all' || scenesTab === 'device') && (
            <div style={{ marginTop: scenesTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {scenesTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: '#ec4899', marginBottom: Spacing.scale.sm }}>
                  SECTION F: DEVICESHOWCASESCENE TEMPLATE
                </div>
              )}
              <DeviceShowcaseSceneShowcase />
            </div>
          )}

          {(scenesTab === 'all' || scenesTab === 'comparison') && (
            <div style={{ marginTop: scenesTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {scenesTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan, marginBottom: Spacing.scale.sm }}>
                  SECTION G: COMPARISONSCENE TEMPLATE
                </div>
              )}
              <ComparisonSceneShowcase />
            </div>
          )}

          {(scenesTab === 'all' || scenesTab === 'cta') && (
            <div style={{ marginTop: scenesTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {scenesTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: '#10b981', marginBottom: Spacing.scale.sm }}>
                  SECTION H: CALLTOACTIONSCENE TEMPLATE
                </div>
              )}
              <CallToActionSceneShowcase />
            </div>
          )}

          {(scenesTab === 'all' || scenesTab === 'outro') && (
            <div style={{ marginTop: scenesTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {scenesTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: '#ec4899', marginBottom: Spacing.scale.sm }}>
                  SECTION I: OUTROSCENE TEMPLATE
                </div>
              )}
              <OutroSceneShowcase />
            </div>
          )}

          {(scenesTab === 'all' || scenesTab === 'ad-comp') && (
            <div style={{ marginTop: scenesTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {scenesTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan, marginBottom: Spacing.scale.sm }}>
                  SECTION J: ADVERTISEMENTCOMPOSITION PIPELINE
                </div>
              )}
              <AdvertisementCompositionShowcase />
            </div>
          )}

          {(scenesTab === 'all' || scenesTab === 'scene-sequence') && (
            <div style={{ marginTop: scenesTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {scenesTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.emerald, marginBottom: Spacing.scale.sm }}>
                  SECTION K: SCENESEQUENCE TIMELINE
                </div>
              )}
              <SceneSequenceShowcase />
            </div>
          )}

          {(scenesTab === 'all' || scenesTab === 'timeline-manager') && (
            <div style={{ marginTop: scenesTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {scenesTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.electricViolet, marginBottom: Spacing.scale.sm }}>
                  SECTION L: TIMELINEMANAGER MULTI-TRACK SYSTEM
                </div>
              )}
              <TimelineManagerShowcase />
            </div>
          )}

          {(scenesTab === 'all' || scenesTab === 'transition-controller') && (
            <div style={{ marginTop: scenesTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {scenesTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.brand, marginBottom: Spacing.scale.sm }}>
                  SECTION M: TRANSITIONCONTROLLER BRIDGE
                </div>
              )}
              <TransitionControllerShowcase />
            </div>
          )}

          {(scenesTab === 'all' || scenesTab === 'audio-track') && (
            <div style={{ marginTop: scenesTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {scenesTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan, marginBottom: Spacing.scale.sm }}>
                  SECTION N: AUDIOTRACK SOUND LAYERS
                </div>
              )}
              <AudioTrackShowcase />
            </div>
          )}

          {(scenesTab === 'all' || scenesTab === 'background-music') && (
            <div style={{ marginTop: scenesTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {scenesTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.electricViolet, marginBottom: Spacing.scale.sm }}>
                  SECTION O: BACKGROUNDMUSIC AUDIO ABSTRACTION
                </div>
              )}
              <BackgroundMusicShowcase />
            </div>
          )}

          {(scenesTab === 'all' || scenesTab === 'sound-effect') && (
            <div style={{ marginTop: scenesTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {scenesTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: '#ec4899', marginBottom: Spacing.scale.sm }}>
                  SECTION P: SOUNDEFFECT EVENT SEQUENCER
                </div>
              )}
              <SoundEffectShowcase />
            </div>
          )}

          {(scenesTab === 'all' || scenesTab === 'global-animation-config') && (
            <div style={{ marginTop: scenesTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {scenesTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: '#3b82f6', marginBottom: Spacing.scale.sm }}>
                  SECTION Q: GLOBALANIMATIONCONFIG CONTROL CENTER
                </div>
              )}
              <GlobalAnimationConfigShowcase />
            </div>
          )}

          {(scenesTab === 'all' || scenesTab === 'advertisement-preview') && (
            <div style={{ marginTop: scenesTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {scenesTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: '#10b981', marginBottom: Spacing.scale.sm }}>
                  SECTION R: ADVERTISEMENTPREVIEW STUDIO PLAYER
                </div>
              )}
              <AdvertisementPreviewShowcase />
            </div>
          )}

          {(scenesTab === 'all' || scenesTab === 'component-integration') && (
            <div style={{ marginTop: scenesTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {scenesTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan, marginBottom: Spacing.scale.sm }}>
                  SECTION S: COMPONENT INTEGRATION TESTBED (ALL 5 LIBRARIES)
                </div>
              )}
              <ComponentIntegrationShowcase />
            </div>
          )}

          {(scenesTab === 'all' || scenesTab === 'audio-timeline-sync') && (
            <div style={{ marginTop: scenesTab === 'all' ? Spacing.scale.xxl : 0 }}>
              {scenesTab === 'all' && (
                <div style={{ ...Typography.caption.eyebrow, color: '#F59E0B', marginBottom: Spacing.scale.sm }}>
                  SECTION T: AUDIO & TIMELINE SYNCHRONIZATION TESTBED
                </div>
              )}
              <AudioTimelineSyncShowcase />
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
                    ) : item.id === 'graphic-animated-arrow' ? (
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
                        <AnimatedArrow
                          direction="right"
                          length={140}
                          curvature={-0.3}
                          arrowheadStyle="stealth"
                          arrowheadSize={14}
                          stroke={Colors.accent.amber}
                          strokeWidth={3}
                          headTiming="after-line"
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



                    ) : item.id === 'graphic-animated-path' ? (
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
                        <AnimatedPath
                          d="M 15 65 Q 60 10 105 65 T 195 65"
                          stroke={Colors.accent.cyan}
                          strokeWidth={3}
                          strokeLinecap="round"
                          animation="draw-in"
                          delay={0}
                          durationInFrames={20}
                          showFollower={true}
                          followerSize={5}
                          followerColor={Colors.accent.cyan}
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



                    ) : item.id === 'graphic-particle-system' ? (
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
                        <ParticleSystem
                          seed="overview-preview-particles"
                          particleCount={25}
                          shape={['circle', 'star']}
                          motionMode="float"
                          color={[Colors.accent.cyan, Colors.accent.amber, '#ffffff']}
                          bounds={{ width: 200, height: 80 }}
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



                    ) : item.id === 'mockup-device-frame' ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: Spacing.scale.sm,
                          padding: Spacing.scale.md,
                          width: '100%',
                          minHeight: 140,
                        }}
                      >
                        <DeviceFrame
                          width={110}
                          height={170}
                          frameThickness={5}
                          borderRadius={16}
                          notch="dynamic-island"
                          notchWidth={28}
                          notchHeight={7}
                          shadow="subtle"
                          animation="spring"
                          delay={0}
                          durationInFrames={20}
                        >
                          <div
                            style={{
                              width: '100%',
                              height: '100%',
                              backgroundColor: Colors.dark.surface2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <span style={{ fontSize: 9, color: Colors.accent.cyan, fontWeight: 700 }}>
                              App View
                            </span>
                          </div>
                        </DeviceFrame>
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



                    ) : item.id === 'mockup-phone' ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: Spacing.scale.sm,
                          padding: Spacing.scale.md,
                          width: '100%',
                          minHeight: 140,
                        }}
                      >
                        <SmartphoneMockup
                          width={110}
                          height={175}
                          frameThickness={5}
                          borderRadius={18}
                          cameraCutout="dynamic-island"
                          showStatusBar={false}
                          showHomeIndicator={true}
                          shadow="subtle"
                          animation="spring"
                          floating={{ amplitude: 4, frequency: 0.5 }}
                          tilt={{ maxAngle: 2, frequency: 0.35 }}
                          delay={0}
                          durationInFrames={20}
                        >
                          <div
                            style={{
                              width: '100%',
                              height: '100%',
                              backgroundColor: Colors.dark.surface2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <span style={{ fontSize: 9, color: Colors.accent.emerald, fontWeight: 700 }}>
                              Mobile UI
                            </span>
                          </div>
                        </SmartphoneMockup>
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



                    ) : item.id === 'mockup-browser' ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: Spacing.scale.sm,
                          padding: Spacing.scale.md,
                          width: '100%',
                          minHeight: 140,
                        }}
                      >
                        <BrowserWindowMockup
                          width={220}
                          height={140}
                          variant="minimal"
                          theme="dark"
                          url="https://acme.io"
                          shadow="subtle"
                          animation="spring"
                          delay={0}
                          durationInFrames={20}
                        >
                          <div
                            style={{
                              width: '100%',
                              height: '100%',
                              backgroundColor: Colors.dark.surface2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <span style={{ fontSize: 9, color: Colors.accent.cyan, fontWeight: 700 }}>
                              Web App View
                            </span>
                          </div>
                        </BrowserWindowMockup>
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


                    ) : item.id === 'mockup-laptop' ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: Spacing.scale.sm,
                          padding: Spacing.scale.md,
                          width: '100%',
                          minHeight: 140,
                        }}
                      >
                        <LaptopMockup
                          width={200}
                          preset="compact"
                          finish="space-gray"
                          shadow="subtle"
                          animation="spring"
                          delay={0}
                          durationInFrames={20}
                        >
                          <div
                            style={{
                              width: '100%',
                              height: '100%',
                              backgroundColor: Colors.dark.surface2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <span style={{ fontSize: 9, color: Colors.accent.cyan, fontWeight: 700 }}>
                              SaaS App View
                            </span>
                          </div>
                        </LaptopMockup>
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


                    ) : item.id === 'mockup-tablet' ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: Spacing.scale.sm,
                          padding: Spacing.scale.md,
                          width: '100%',
                          minHeight: 140,
                        }}
                      >
                        <TabletMockup
                          width={220}
                          orientation="landscape"
                          preset="compact"
                          finish="space-gray"
                          shadow="subtle"
                          animation="spring"
                          delay={0}
                          durationInFrames={20}
                        >
                          <div
                            style={{
                              width: '100%',
                              height: '100%',
                              backgroundColor: Colors.dark.surface2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <span style={{ fontSize: 9, color: Colors.accent.cyan, fontWeight: 700 }}>
                              Tablet Canvas
                            </span>
                          </div>
                        </TabletMockup>
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

                    ) : item.id === 'trans-fade' ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: Spacing.scale.sm,
                          padding: Spacing.scale.md,
                          width: '100%',
                          minHeight: 140,
                        }}
                      >
                        <FadeTransition
                          mode="crossfade"
                          duration={25}
                          delay={0}
                          style={{ width: '100%', height: 90 }}
                          fromContent={
                            <div
                              style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: Colors.dark.surface2,
                                border: `1px solid ${Colors.accent.electricViolet}40`,
                                borderRadius: Spacing.radius.sm,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <span style={{ fontSize: 10, color: Colors.accent.electricViolet, fontWeight: 700 }}>
                                Outgoing Scene A
                              </span>
                            </div>
                          }
                          toContent={
                            <div
                              style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: Colors.dark.surface1,
                                border: `1px solid ${Colors.accent.cyan}40`,
                                borderRadius: Spacing.radius.sm,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <span style={{ fontSize: 10, color: Colors.accent.cyan, fontWeight: 700 }}>
                                Incoming Scene B
                              </span>
                            </div>
                          }
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
                    ) : item.id === 'trans-slide' ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: Spacing.scale.sm,
                          padding: Spacing.scale.md,
                          width: '100%',
                          minHeight: 140,
                        }}
                      >
                        <SlideTransition
                          mode="replace"
                          direction="left"
                          duration={25}
                          delay={0}
                          fade={true}
                          clip={true}
                          style={{ width: '100%', height: 90 }}
                          fromContent={
                            <div
                              style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: Colors.dark.surface2,
                                border: `1px solid ${Colors.accent.electricViolet}40`,
                                borderRadius: Spacing.radius.sm,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <span style={{ fontSize: 10, color: Colors.accent.electricViolet, fontWeight: 700 }}>
                                Outgoing Scene A
                              </span>
                            </div>
                          }
                          toContent={
                            <div
                              style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: Colors.dark.surface1,
                                border: `1px solid ${Colors.accent.cyan}40`,
                                borderRadius: Spacing.radius.sm,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <span style={{ fontSize: 10, color: Colors.accent.cyan, fontWeight: 700 }}>
                                Sliding Scene B
                              </span>
                            </div>
                          }
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
                    ) : item.id === 'trans-zoom' ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: Spacing.scale.sm,
                          padding: Spacing.scale.md,
                          width: '100%',
                          minHeight: 140,
                        }}
                      >
                        <ZoomTransition
                          mode="replace"
                          duration={25}
                          delay={0}
                          fade={true}
                          clip={true}
                          style={{ width: '100%', height: 90 }}
                          fromContent={
                            <div
                              style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: Colors.dark.surface2,
                                border: `1px solid ${Colors.accent.electricViolet}40`,
                                borderRadius: Spacing.radius.sm,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <span style={{ fontSize: 10, color: Colors.accent.electricViolet, fontWeight: 700 }}>
                                Outgoing Scene A
                              </span>
                            </div>
                          }
                          toContent={
                            <div
                              style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: Colors.dark.surface1,
                                border: '1px solid rgba(236, 72, 153, 0.4)',
                                borderRadius: Spacing.radius.sm,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <span style={{ fontSize: 10, color: '#ec4899', fontWeight: 700 }}>
                                Zooming Scene B
                              </span>
                            </div>
                          }
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
                    ) : item.id === 'trans-wipe' ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: Spacing.scale.sm,
                          padding: Spacing.scale.md,
                          width: '100%',
                          minHeight: 140,
                        }}
                      >
                        <WipeTransition
                          mode="replace"
                          direction="left-to-right"
                          duration={25}
                          delay={0}
                          edgeColor={Colors.accent.cyan}
                          edgeWidth={3}
                          style={{ width: '100%', height: 90 }}
                          fromContent={
                            <div
                              style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: Colors.dark.surface2,
                                border: `1px solid ${Colors.accent.electricViolet}40`,
                                borderRadius: Spacing.radius.sm,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <span style={{ fontSize: 10, color: Colors.accent.electricViolet, fontWeight: 700 }}>
                                Outgoing Scene A
                              </span>
                            </div>
                          }
                          toContent={
                            <div
                              style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: Colors.dark.surface1,
                                border: `1px solid ${Colors.accent.cyan}40`,
                                borderRadius: Spacing.radius.sm,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <span style={{ fontSize: 10, color: Colors.accent.cyan, fontWeight: 700 }}>
                                Wiping Scene B
                              </span>
                            </div>
                          }
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
                    ) : item.id === 'trans-mask' ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: Spacing.scale.sm,
                          padding: Spacing.scale.md,
                          width: '100%',
                          minHeight: 140,
                        }}
                      >
                        <MaskTransition
                          maskType="polygon"
                          shape="star"
                          mode="replace"
                          duration={25}
                          delay={0}
                          rotation={45}
                          style={{ width: '100%', height: 90 }}
                          fromContent={
                            <div
                              style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#1e1b4b',
                                border: `1px solid ${Colors.accent.electricViolet}40`,
                                borderRadius: Spacing.radius.sm,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <span style={{ fontSize: 10, color: Colors.accent.electricViolet, fontWeight: 700 }}>
                                Outgoing Scene A
                              </span>
                            </div>
                          }
                          toContent={
                            <div
                              style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#064e3b',
                                border: `1px solid ${Colors.accent.cyan}40`,
                                borderRadius: Spacing.radius.sm,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <span style={{ fontSize: 10, color: Colors.accent.cyan, fontWeight: 700 }}>
                                Star Masked Scene B
                              </span>
                            </div>
                          }
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
                    ) : item.id === 'trans-split' ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: Spacing.scale.sm,
                          padding: Spacing.scale.md,
                          width: '100%',
                          minHeight: 140,
                        }}
                      >
                        <SplitTransition
                          splitDirection="vertical"
                          panelCount={3}
                          mode="replace"
                          movementDirection="outward"
                          duration={25}
                          delay={0}
                          staggerDelay={2}
                          style={{ width: '100%', height: 90 }}
                          fromContent={
                            <div
                              style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#1e1b4b',
                                border: `1px solid ${Colors.accent.electricViolet}40`,
                                borderRadius: Spacing.radius.sm,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <span style={{ fontSize: 10, color: Colors.accent.electricViolet, fontWeight: 700 }}>
                                Outgoing Scene A
                              </span>
                            </div>
                          }
                          toContent={
                            <div
                              style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#064e3b',
                                border: `1px solid ${Colors.accent.emerald}40`,
                                borderRadius: Spacing.radius.sm,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <span style={{ fontSize: 10, color: Colors.accent.emerald, fontWeight: 700 }}>
                                Split Scene B
                              </span>
                            </div>
                          }
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
                    ) : item.id === 'trans-morph' ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: Spacing.scale.sm,
                          padding: Spacing.scale.md,
                          width: '100%',
                          minHeight: 140,
                        }}
                      >
                        <MorphTransition
                          fromPath="circle"
                          toPath="star"
                          fromFill="#06b6d4"
                          toFill="#a855f7"
                          fromStroke="#22d3ee"
                          toStroke="#c084fc"
                          fromStrokeWidth={2}
                          toStrokeWidth={3}
                          initialRotation={0}
                          finalRotation={180}
                          duration={30}
                          delay={0}
                          width={80}
                          height={80}
                          style={{ filter: 'drop-shadow(0 0 12px rgba(6, 182, 212, 0.4))' }}
                        />
                        <span
                          style={{
                            fontSize: 10,
                            fontFamily: Typography.fontFamily.mono,
                            color: Colors.accent.cyan,
                            marginTop: Spacing.scale.xs,
                          }}
                        >
                          ● PRODUCTION READY COMPONENT
                        </span>
                      </div>
                    ) : item.id === 'trans-glitch' ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: Spacing.scale.sm,
                          padding: Spacing.scale.md,
                          width: '100%',
                          minHeight: 140,
                        }}
                      >
                        <GlitchTransition
                          mode="replace"
                          intensity={1.2}
                          frequency={0.8}
                          duration={30}
                          sliceCount={8}
                          seed={2077}
                          style={{ width: '100%', height: 90 }}
                          fromContent={
                            <div
                              style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#030712',
                                border: `1px solid ${Colors.accent.cyan}60`,
                                borderRadius: Spacing.radius.sm,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 6,
                              }}
                            >
                              <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.accent.cyan, fontWeight: 700 }}>
                                SIGNAL ALPHA
                              </span>
                            </div>
                          }
                          toContent={
                            <div
                              style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#180512',
                                border: '1px solid #ec489980',
                                borderRadius: Spacing.radius.sm,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 6,
                              }}
                            >
                              <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: '#ec4899', fontWeight: 700 }}>
                                BREACH OVERRIDE
                              </span>
                            </div>
                          }
                        />
                        <span
                          style={{
                            fontSize: 10,
                            fontFamily: Typography.fontFamily.mono,
                            color: '#ec4899',
                            marginTop: Spacing.scale.xs,
                          }}
                        >
                          ● PRODUCTION READY COMPONENT
                        </span>
                      </div>
                    ) : item.id === 'trans-controller' ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: Spacing.scale.sm,
                          padding: Spacing.scale.md,
                          width: '100%',
                          minHeight: 140,
                        }}
                      >
                        <TransitionController
                          boundaryFrame={15}
                          transition={{ type: 'slide', direction: 'left', durationInFrames: 15 }}
                          style={{ width: '100%', height: 90 }}
                          fromContent={
                            <div
                              style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#0B132B',
                                border: `1px solid ${Colors.accent.brand}80`,
                                borderRadius: Spacing.radius.sm,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 6,
                              }}
                            >
                              <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.accent.brand, fontWeight: 700 }}>
                                SCENE ALPHA
                              </span>
                            </div>
                          }
                          toContent={
                            <div
                              style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#1C2541',
                                border: `1px solid ${Colors.accent.cyan}80`,
                                borderRadius: Spacing.radius.sm,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 6,
                              }}
                            >
                              <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.accent.cyan, fontWeight: 700 }}>
                                SCENE BETA
                              </span>
                            </div>
                          }
                        />
                        <span
                          style={{
                            fontSize: 10,
                            fontFamily: Typography.fontFamily.mono,
                            color: Colors.accent.brand,
                            marginTop: Spacing.scale.xs,
                          }}
                        >
                          ● ORCHESTRATOR READY
                        </span>
                      </div>
                    ) : item.id === 'scene-container' ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: Spacing.scale.sm,
                          padding: Spacing.scale.md,
                          width: '100%',
                          minHeight: 140,
                        }}
                      >
                        <SceneContainer
                          layout="centered"
                          background="radial-gradient(circle at 50% 30%, rgba(6, 182, 212, 0.25) 0%, #050811 75%)"
                          safeArea={16}
                          padding={12}
                          style={{ width: '100%', height: 95, borderRadius: Spacing.radius.sm, border: `1px solid ${Colors.accent.cyan}40` }}
                        >
                          <span style={{ fontSize: 9, fontFamily: Typography.fontFamily.mono, color: Colors.accent.cyan, letterSpacing: '0.05em' }}>
                            SCENE CONTAINER
                          </span>
                          <span style={{ fontSize: 13, fontWeight: 800, color: '#ffffff', marginTop: 2 }}>
                            Standardized Canvas
                          </span>
                        </SceneContainer>
                        <span
                          style={{
                            fontSize: 10,
                            fontFamily: Typography.fontFamily.mono,
                            color: Colors.accent.cyan,
                            marginTop: Spacing.scale.xs,
                          }}
                        >
                          ● PRODUCTION READY COMPONENT
                        </span>
                      </div>
                    ) : item.id === 'scene-hero' ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: Spacing.scale.sm,
                          padding: Spacing.scale.md,
                          width: '100%',
                          minHeight: 140,
                        }}
                      >
                        <HeroScene
                          layout="split-left"
                          headline="Autonomous AI"
                          subtitle="Core Engine v2"
                          eyebrow="HERO"
                          staggerDelay={2}
                          safeArea={false}
                          padding={10}
                          style={{ width: '100%', height: 95, borderRadius: Spacing.radius.sm, border: `1px solid ${Colors.accent.emerald}40` }}
                        >
                          <div
                            style={{
                              width: 50,
                              height: 70,
                              backgroundColor: '#0a101d',
                              border: `1px solid ${Colors.accent.cyan}60`,
                              borderRadius: 6,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <span style={{ fontSize: 8, color: Colors.accent.cyan, fontFamily: Typography.fontFamily.mono }}>
                              DEVICE
                            </span>
                          </div>
                        </HeroScene>
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
                    ) : item.id === 'scene-product-showcase' ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: Spacing.scale.sm,
                          padding: Spacing.scale.md,
                          width: '100%',
                          minHeight: 140,
                        }}
                      >
                        <ProductShowcaseScene
                          layout="center-product"
                          title="Aura Pro"
                          subtitle="Spatial Engine"
                          safeArea={false}
                          padding={10}
                          style={{ width: '100%', height: 95, borderRadius: Spacing.radius.sm, border: `1px solid ${Colors.accent.cyan}40` }}
                        >
                          <div
                            style={{
                              width: 50,
                              height: 70,
                              backgroundColor: '#0a101d',
                              border: `1px solid ${Colors.accent.cyan}60`,
                              borderRadius: 6,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <span style={{ fontSize: 8, color: Colors.accent.cyan, fontFamily: Typography.fontFamily.mono }}>
                              AURA
                            </span>
                          </div>
                        </ProductShowcaseScene>
                        <span
                          style={{
                            fontSize: 10,
                            fontFamily: Typography.fontFamily.mono,
                            color: Colors.accent.cyan,
                            marginTop: Spacing.scale.xs,
                          }}
                        >
                          ● PRODUCTION READY COMPONENT
                        </span>
                      </div>
                    ) : item.id === 'scene-feature-highlight' ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: Spacing.scale.sm,
                          padding: Spacing.scale.md,
                          width: '100%',
                          minHeight: 140,
                        }}
                      >
                        <FeatureHighlightScene
                          layout="text-left"
                          title="Edge Ingest"
                          benefit="10x Faster"
                          description="Real-time consensus"
                          safeArea={false}
                          padding={10}
                          style={{ width: '100%', height: 95, borderRadius: Spacing.radius.sm, border: `1px solid ${Colors.accent.emerald}40` }}
                        >
                          <div
                            style={{
                              width: 50,
                              height: 70,
                              backgroundColor: '#050a14',
                              border: `1px solid ${Colors.accent.emerald}60`,
                              borderRadius: 6,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <span style={{ fontSize: 8, color: Colors.accent.emerald, fontFamily: Typography.fontFamily.mono }}>
                              EDGE
                            </span>
                          </div>
                        </FeatureHighlightScene>
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
                    ) : item.id === 'scene-typography' ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: Spacing.scale.sm,
                          padding: Spacing.scale.md,
                          width: '100%',
                          minHeight: 140,
                        }}
                      >
                        <TypographyScene
                          layout="centered"
                          eyebrow="TYPO"
                          headline="Autonomous Scale"
                          highlightedWords={['scale']}
                          safeArea={false}
                          padding={10}
                          style={{ width: '100%', height: 95, borderRadius: Spacing.radius.sm, border: `1px solid ${Colors.accent.cyan}40` }}
                        />
                        <span
                          style={{
                            fontSize: 10,
                            fontFamily: Typography.fontFamily.mono,
                            color: Colors.accent.cyan,
                            marginTop: Spacing.scale.xs,
                          }}
                        >
                          ● PRODUCTION READY COMPONENT
                        </span>
                      </div>
                    ) : item.id === 'scene-device-showcase' ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: Spacing.scale.sm,
                          padding: Spacing.scale.md,
                          width: '100%',
                          minHeight: 140,
                        }}
                      >
                        <DeviceShowcaseScene
                          layout="single-centered"
                          label="ECOSYSTEM"
                          title="Unified OS"
                          safeArea={false}
                          padding={8}
                          style={{ width: '100%', height: 95, borderRadius: Spacing.radius.sm, border: `1px solid #ec489940` }}
                        >
                          <div
                            style={{
                              width: '100%',
                              height: '100%',
                              backgroundColor: '#090e1a',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <span style={{ fontSize: 7, color: '#ec4899', fontFamily: Typography.fontFamily.mono }}>
                              APP
                            </span>
                          </div>
                        </DeviceShowcaseScene>
                        <span
                          style={{
                            fontSize: 10,
                            fontFamily: Typography.fontFamily.mono,
                            color: '#ec4899',
                            marginTop: Spacing.scale.xs,
                          }}
                        >
                          ● PRODUCTION READY COMPONENT
                        </span>
                      </div>
                    ) : item.id === 'scene-comparison' ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: Spacing.scale.sm,
                          padding: Spacing.scale.md,
                          width: '100%',
                          minHeight: 140,
                        }}
                      >
                        <ComparisonScene
                          layout="side-by-side"
                          label="VS"
                          leftLabel="OLD"
                          rightLabel="NEW"
                          leftContent={<div style={{ width: '100%', height: 40, backgroundColor: '#090d16', borderRadius: 4 }} />}
                          rightContent={<div style={{ width: '100%', height: 40, backgroundColor: '#071626', border: `1px solid ${Colors.accent.cyan}60`, borderRadius: 4 }} />}
                          safeArea={false}
                          padding={8}
                          style={{ width: '100%', height: 95, borderRadius: Spacing.radius.sm, border: `1px solid ${Colors.accent.cyan}40` }}
                        />
                        <span
                          style={{
                            fontSize: 10,
                            fontFamily: Typography.fontFamily.mono,
                            color: Colors.accent.cyan,
                            marginTop: Spacing.scale.xs,
                          }}
                        >
                          ● PRODUCTION READY COMPONENT
                        </span>
                      </div>
                    ) : item.id === 'scene-cta' ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: Spacing.scale.sm,
                          padding: Spacing.scale.md,
                          width: '100%',
                          minHeight: 140,
                        }}
                      >
                        <CallToActionScene
                          layout="centered"
                          brand="CTA"
                          headline="Launch Now"
                          primaryAction="Explore"
                          safeArea={false}
                          padding={8}
                          style={{ width: '100%', height: 95, borderRadius: Spacing.radius.sm, border: `1px solid #10b98140` }}
                        />
                        <span
                          style={{
                            fontSize: 10,
                            fontFamily: Typography.fontFamily.mono,
                            color: '#10b981',
                            marginTop: Spacing.scale.xs,
                          }}
                        >
                          ● PRODUCTION READY COMPONENT
                        </span>
                      </div>
                    ) : item.id === 'scene-outro' ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: Spacing.scale.sm,
                          padding: Spacing.scale.md,
                          width: '100%',
                          minHeight: 140,
                        }}
                      >
                        <OutroScene
                          layout="centered-brand"
                          brandName="ANTIGRAVITY"
                          website="antigravity.io"
                          safeArea={false}
                          padding={8}
                          style={{ width: '100%', height: 95, borderRadius: Spacing.radius.sm, border: `1px solid #ec489940` }}
                        />
                        <span
                          style={{
                            fontSize: 10,
                            fontFamily: Typography.fontFamily.mono,
                            color: '#ec4899',
                            marginTop: Spacing.scale.xs,
                          }}
                        >
                          ● PRODUCTION READY COMPONENT
                        </span>
                      </div>
                    ) : item.id === 'scene-advertisement-composition' ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: Spacing.scale.sm,
                          padding: Spacing.scale.md,
                          width: '100%',
                          minHeight: 140,
                        }}
                      >
                        <AdvertisementComposition
                          durationInFrames={150}
                          safeArea={false}
                          debug={false}
                          background="linear-gradient(135deg, #091326 0%, #040711 100%)"
                          style={{ width: '100%', height: 95, borderRadius: Spacing.radius.sm, border: `1px solid ${Colors.accent.cyan}40` }}
                        >
                          <div
                            style={{
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              textAlign: 'center',
                            }}
                          >
                            <span style={{ fontSize: 9, color: Colors.accent.cyan, fontFamily: Typography.fontFamily.mono, fontWeight: 700 }}>
                              MULTI-SCENE PIPELINE
                            </span>
                          </div>
                        </AdvertisementComposition>
                        <span
                          style={{
                            fontSize: 10,
                            fontFamily: Typography.fontFamily.mono,
                            color: Colors.accent.cyan,
                            marginTop: Spacing.scale.xs,
                          }}
                        >
                          ● PRODUCTION READY COMPONENT
                        </span>
                      </div>
                    ) : item.id === 'scene-sequence' ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: Spacing.scale.sm,
                          padding: Spacing.scale.md,
                          width: '100%',
                          minHeight: 140,
                        }}
                      >
                        <div
                          style={{
                            width: '100%',
                            height: 95,
                            borderRadius: Spacing.radius.sm,
                            border: `1px solid ${Colors.accent.emerald}40`,
                            background: 'linear-gradient(135deg, #021a12 0%, #03080e 100%)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                            padding: 8,
                          }}
                        >
                          <div style={{ display: 'flex', gap: 6, width: '90%', height: 18, background: 'rgba(255,255,255,0.06)', borderRadius: 4, padding: 3 }}>
                            <div style={{ flex: 1, height: '100%', background: Colors.accent.cyan, borderRadius: 2 }} />
                            <div style={{ flex: 2, height: '100%', background: Colors.accent.electricViolet, borderRadius: 2 }} />
                            <div style={{ flex: 1, height: '100%', background: Colors.accent.emerald, borderRadius: 2 }} />
                          </div>
                          <span style={{ fontSize: 9, color: Colors.accent.emerald, fontFamily: Typography.fontFamily.mono, fontWeight: 700 }}>
                            SEQUENTIAL TIMELINE ENGINE
                          </span>
                        </div>
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
                    ) : item.id === 'timeline-manager' ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: Spacing.scale.sm,
                          padding: Spacing.scale.md,
                          width: '100%',
                          minHeight: 140,
                        }}
                      >
                        <div
                          style={{
                            width: '100%',
                            height: 95,
                            borderRadius: Spacing.radius.sm,
                            border: `1px solid ${Colors.accent.electricViolet}40`,
                            background: 'linear-gradient(135deg, #130924 0%, #03060f 100%)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                            padding: 8,
                          }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, width: '90%' }}>
                            <div style={{ height: 6, background: Colors.accent.cyan, borderRadius: 2, width: '80%' }} />
                            <div style={{ height: 4, background: Colors.accent.electricViolet, borderRadius: 2, width: '40%', marginLeft: '20%' }} />
                            <div style={{ height: 5, background: '#ec4899', borderRadius: 2, width: '100%' }} />
                          </div>
                          <span style={{ fontSize: 9, color: Colors.accent.electricViolet, fontFamily: Typography.fontFamily.mono, fontWeight: 700 }}>
                            CENTRAL TIMING SYSTEM
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: 10,
                            fontFamily: Typography.fontFamily.mono,
                            color: Colors.accent.electricViolet,
                            marginTop: Spacing.scale.xs,
                          }}
                        >
                          ● PRODUCTION READY COMPONENT
                        </span>
                      </div>
                    ) : item.id === 'audio-track' ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: Spacing.scale.sm,
                          padding: Spacing.scale.md,
                          width: '100%',
                          minHeight: 140,
                        }}
                      >
                        <div
                          style={{
                            width: '100%',
                            height: 95,
                            borderRadius: Spacing.radius.sm,
                            border: `1px solid ${Colors.accent.cyan}40`,
                            background: 'linear-gradient(135deg, #061e29 0%, #030811 100%)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            padding: 10,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 24 }}>
                            {[12, 20, 16, 24, 18, 10, 22, 14, 8].map((h, i) => (
                              <div
                                key={i}
                                style={{
                                  width: 4,
                                  height: `${h}px`,
                                  backgroundColor: Colors.accent.cyan,
                                  borderRadius: 2,
                                  opacity: 0.85,
                                }}
                              />
                            ))}
                          </div>
                          <span style={{ fontSize: 9, color: Colors.accent.cyan, fontFamily: Typography.fontFamily.mono, fontWeight: 700 }}>
                            DETERMINISTIC AUDIO LAYER
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: 10,
                            fontFamily: Typography.fontFamily.mono,
                            color: Colors.accent.cyan,
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
