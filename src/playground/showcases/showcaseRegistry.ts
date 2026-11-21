/**
 * Playground Showcase Registry
 * Declarative catalog of components and blueprints planned across all 6 categories.
 * Future components register their showcase wrappers here without altering the playground shell.
 */

import { ShowcaseDefinition } from '../types';

export const SHOWCASE_REGISTRY: ShowcaseDefinition[] = [
  // 1. Motion Primitives
  {
    id: 'motion-reveal',
    name: 'Reveal Primitive',
    category: 'motion',
    description: 'Masked directional entry with clipped bounds and spring settle',
    variants: ['SlideUp', 'SlideDown', 'SlideLeft', 'SlideRight'],
    status: 'planned',
  },
  {
    id: 'motion-fade',
    name: 'Fade Primitive',
    category: 'motion',
    description: 'Clamped deterministic alpha opacity interpolation',
    variants: ['Linear', 'Decelerate', 'FastIn'],
    status: 'planned',
  },
  {
    id: 'motion-scale',
    name: 'ScaleIn Primitive',
    category: 'motion',
    description: 'Transform scale with configurable physics spring origin',
    variants: ['Snappy', 'Gentle', 'Bouncy', 'Stiff'],
    status: 'planned',
  },
  {
    id: 'motion-stagger',
    name: 'StaggerGroup',
    category: 'motion',
    description: 'Calculates frame offsets for cascading list child entrances',
    variants: ['Tight (2f)', 'Normal (4f)', 'Relaxed (8f)'],
    status: 'planned',
  },

  // 2. Typography
  {
    id: 'typo-display-hero',
    name: 'DisplayHero',
    category: 'typography',
    description: 'High-impact 96px headline with accent keyword highlights',
    variants: ['SingleLine', 'MultiLine', 'WithEyebrow'],
    status: 'planned',
  },
  {
    id: 'typo-headline',
    name: 'Headline',
    category: 'typography',
    description: 'Hierarchical section title with character/word reveal',
    variants: ['H1', 'H2', 'H3', 'H4'],
    status: 'planned',
  },
  {
    id: 'typo-counter',
    name: 'AnimatedCounter',
    category: 'typography',
    description: 'Deterministic rolling numeric stats with prefix/suffix',
    variants: ['Currency', 'Percentage', 'Rating', 'Volume'],
    status: 'planned',
  },
  {
    id: 'typo-kinetic',
    name: 'KineticText',
    category: 'typography',
    description: 'Word-by-word choreographed statement animator',
    variants: ['StaggerWords', 'CascadeLetters'],
    status: 'planned',
  },

  // 3. UI Components
  {
    id: 'ui-badge',
    name: 'Badge',
    category: 'ui',
    description: 'High-contrast tag pill with optional Lucide icon',
    variants: ['Brand', 'Success', 'Warning', 'Neutral'],
    status: 'planned',
  },
  {
    id: 'ui-button',
    name: 'Button',
    category: 'ui',
    description: 'Commercial CTA pill with hover/scale feedback simulation',
    variants: ['Primary', 'Secondary', 'Glass'],
    status: 'planned',
  },
  {
    id: 'ui-metric-card',
    name: 'MetricCard',
    category: 'ui',
    description: 'Floating analytical stat card with delta badge',
    variants: ['DarkSurface', 'Glassmorphism', 'BorderHighlight'],
    status: 'planned',
  },
  {
    id: 'ui-progress-bar',
    name: 'ProgressBar',
    category: 'ui',
    description: 'Horizontal determinate progress indicator',
    variants: ['BrandAccent', 'GradientFill', 'TrackOnly'],
    status: 'planned',
  },

  // 4. Mockups
  {
    id: 'mockup-phone',
    name: 'PhoneFrame',
    category: 'mockups',
    description: 'Sleek device bezel with perspective tilt and dynamic screen slot',
    variants: ['FrontFlat', 'IsometricLeft', 'PerspectiveTilt'],
    status: 'planned',
  },
  {
    id: 'mockup-browser',
    name: 'BrowserFrame',
    category: 'mockups',
    description: 'Clean minimal dark browser window with navigation bar',
    variants: ['FullWindow', 'Tabbed', 'Frameless'],
    status: 'planned',
  },
  {
    id: 'mockup-floating-card',
    name: 'FloatingCard',
    category: 'mockups',
    description: 'Elevated 3D card surface with soft diffuse ambient shadow',
    variants: ['LowElevation', 'HighElevation', 'BorderGlow'],
    status: 'planned',
  },

  // 5. Graphics
  {
    id: 'graphic-grid-bg',
    name: 'GridBackground',
    category: 'graphics',
    description: 'Geometric coordinate matrix for technical mobility backdrops',
    variants: ['DotMatrix', 'SubtleLines', 'Crosshairs'],
    status: 'planned',
  },
  {
    id: 'graphic-gradient-mesh',
    name: 'GradientMesh',
    category: 'graphics',
    description: 'Deep atmospheric radial blur background layer',
    variants: ['SpotlightBlue', 'VioletGlow', 'Monochrome'],
    status: 'planned',
  },
  {
    id: 'graphic-vector-path',
    name: 'VectorPath',
    category: 'graphics',
    description: 'Animated SVG stroke path simulating route or chart drawing',
    variants: ['RouteLine', 'CurveChart', 'GeometricReticle'],
    status: 'planned',
  },

  // 6. Transitions
  {
    id: 'trans-wipe',
    name: 'WipeTransition',
    category: 'transitions',
    description: 'Directional solid bar or angled curtain wipe',
    variants: ['LeftToRight', 'RightToLeft', 'TopToBottom'],
    status: 'planned',
  },
  {
    id: 'trans-slide',
    name: 'SlideTransition',
    category: 'transitions',
    description: 'Coordinated camera-like push and pull scene shift',
    variants: ['PushHorizontal', 'PushVertical'],
    status: 'planned',
  },
  {
    id: 'trans-zoom',
    name: 'ZoomTransition',
    category: 'transitions',
    description: 'Scale in-place with subtle motion blur simulation',
    variants: ['ZoomIn', 'ZoomOut'],
    status: 'planned',
  },
];
