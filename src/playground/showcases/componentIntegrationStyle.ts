/**
 * Component Integration Style & Calculation Utilities
 * Pure mathematical helpers and layout resolvers for multi-library component integration.
 */

import { Colors } from '../../styles/colors.ts';

export type IntegrationScenarioId =
  | 'card-typography'
  | 'button-device'
  | 'graphics-typography'
  | 'smartphone-ui'
  | 'scene-transitions'
  | 'all-in-scene';

export interface IntegrationScenarioMeta {
  id: IntegrationScenarioId;
  title: string;
  subtitle: string;
  categoryTags: string[];
  description: string;
}

export const INTEGRATION_SCENARIOS: IntegrationScenarioMeta[] = [
  {
    id: 'card-typography',
    title: 'AnimatedText inside AnimatedCard',
    subtitle: 'Typography & UI Composition',
    categoryTags: ['UI', 'Typography'],
    description:
      'Nested AnimatedText titles and body copy inside an AnimatedCard with synchronized spring physics and layered stagger.',
  },
  {
    id: 'button-device',
    title: 'AnimatedButton inside DeviceFrame',
    subtitle: 'Mockup & Interactive UI',
    categoryTags: ['Mockups', 'UI'],
    description:
      'Multiple AnimatedButton instances contained within a hardware DeviceFrame bezel, responding to simulated press and hover states.',
  },
  {
    id: 'graphics-typography',
    title: 'Graphic Components with Typography',
    subtitle: 'SVG Vectors & Dynamic Text',
    categoryTags: ['Graphics', 'Typography'],
    description:
      'AnimatedArrow pointing dynamically to TextHighlight emphasis, accented with an AnimatedCircle callout badge and AnimatedLine divider.',
  },
  {
    id: 'smartphone-ui',
    title: 'Multiple UI Components in SmartphoneMockup',
    subtitle: 'Complex Mobile Screen Assembly',
    categoryTags: ['Mockups', 'UI'],
    description:
      'SmartphoneMockup hosting AnimatedNotification, AnimatedSearchBar with typing, AnimatedCard, Checkbox, and Button without clipping.',
  },
  {
    id: 'scene-transitions',
    title: 'Scene Components with Transitions',
    subtitle: 'Layer 3 Cross-Scene Sequencing',
    categoryTags: ['Scenes', 'Transitions'],
    description:
      'TransitionController bridging full HeroScene and ProductShowcaseScene with configurable transition modes and timing.',
  },
  {
    id: 'all-in-scene',
    title: 'Multi-Component Scene Integration',
    subtitle: 'Full Framework Unification',
    categoryTags: ['Scenes', 'Typography', 'UI', 'Graphics', 'Mockups'],
    description:
      'Unified SceneContainer containing Typography, SmartphoneMockup, UI Cards, Curved SVG Arrow, and ParticleSystem.',
  },
];

/**
 * Validates integration prop normalization between startFrame and delay.
 */
export function resolveEffectiveTiming(props: { startFrame?: number; delay?: number }): number {
  if (props.delay !== undefined && props.delay !== 0) return props.delay;
  if (props.startFrame !== undefined) return props.startFrame;
  return 0;
}

/**
 * Calculates responsive bounding box and connecting coordinates for an arrow pointing to a text element.
 */
export function calculateAnnotationCoordinates(source: { x: number; y: number }, target: { x: number; y: number }): {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  deltaX: number;
  deltaY: number;
  distance: number;
} {
  const deltaX = target.x - source.x;
  const deltaY = target.y - source.y;
  const distance = Math.round(Math.hypot(deltaX, deltaY));

  return {
    startX: source.x,
    startY: source.y,
    endX: target.x,
    endY: target.y,
    deltaX,
    deltaY,
    distance,
  };
}

/**
 * Calculates nested stagger offsets for an array of items starting at a base offset.
 */
export function calculateNestedSequenceStagger(
  baseOffset: number,
  itemCount: number,
  staggerInterval: number,
): Array<{ startFrame: number; index: number }> {
  return Array.from({ length: itemCount }, (_, index) => ({
    index,
    startFrame: baseOffset + index * staggerInterval,
  }));
}

/**
 * Checks whether a component fits within a container without overflow.
 */
export function validateContainerFit(
  container: { width: number; height: number },
  content: { width: number; height: number; padding?: number },
): { fits: boolean; horizontalOverflow: number; verticalOverflow: number } {
  const pad = content.padding ?? 0;
  const totalW = content.width + pad * 2;
  const totalH = content.height + pad * 2;

  const horizontalOverflow = Math.max(0, totalW - container.width);
  const verticalOverflow = Math.max(0, totalH - container.height);

  return {
    fits: horizontalOverflow === 0 && verticalOverflow === 0,
    horizontalOverflow,
    verticalOverflow,
  };
}

/**
 * Resolves theme styling for integration showcase cards.
 */
export function getIntegrationTheme(active: boolean): {
  backgroundColor: string;
  borderColor: string;
  color: string;
} {
  if (active) {
    return {
      backgroundColor: 'rgba(0, 209, 255, 0.12)',
      borderColor: Colors.accent.cyan,
      color: Colors.accent.cyan,
    };
  }

  return {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderColor: 'rgba(255, 255, 255, 0.10)',
    color: Colors.text.secondary,
  };
}
