/**
 * Scene Components Type Definitions
 * Layer 3 of the Motion Graphics Framework.
 */

import React from 'react';
import type { EasingFunction, EasingPresetName } from '../../utils/animation/easing';
export type {
  SceneAnimationType,
  SceneSlideDirection,
  SceneAnimationConfig,
} from '../../config/animation/animationConfigTypes';
import type {
  SceneAnimationType,
  SceneAnimationConfig,
} from '../../config/animation/animationConfigTypes';

export type SceneLayoutMode =
  | 'centered'
  | 'full-bleed'
  | 'split'
  | 'top-aligned'
  | 'bottom-aligned'
  | 'custom';

export type SceneHorizontalAlignment = 'left' | 'center' | 'right' | 'space-between';
export type SceneVerticalAlignment = 'top' | 'center' | 'bottom' | 'space-between';

export interface SceneAlignment {
  horizontal?: SceneHorizontalAlignment;
  vertical?: SceneVerticalAlignment;
}

export type ScenePaddingValue = number | string;

export interface ScenePaddingObject {
  top?: ScenePaddingValue;
  bottom?: ScenePaddingValue;
  left?: ScenePaddingValue;
  right?: ScenePaddingValue;
}

export type ScenePadding = ScenePaddingValue | ScenePaddingObject;

export interface SceneContainerProps {
  /** Scene container width in pixels or CSS value (default: composition width or '100%') */
  width?: number | string;
  /** Scene container height in pixels or CSS value (default: composition height or '100%') */
  height?: number | string;
  /** Combined CSS background (e.g. gradient, solid, or image) */
  background?: string;
  /** Solid background color override */
  backgroundColor?: string;
  /** Background image URL or path */
  backgroundImage?: string;
  /** Additional React node rendered in background layer behind content */
  backgroundContent?: React.ReactNode;
  /** Scene content layout mode (default: 'centered') */
  layout?: SceneLayoutMode;
  /** Horizontal alignment shorthand */
  horizontalAlignment?: SceneHorizontalAlignment;
  /** Vertical alignment shorthand */
  verticalAlignment?: SceneVerticalAlignment;
  /** Combined alignment object */
  alignment?: SceneAlignment;
  /** Inner content padding (uniform number/string or directional object) */
  padding?: ScenePadding;
  /** Broadcast safe area margin (boolean for default 60px, or custom pixel number) */
  safeArea?: boolean | number;
  /** Content overflow behavior (default: 'hidden') */
  overflow?: 'hidden' | 'visible' | 'clip';
  /** Optional scene identifier for debugging and profiling */
  sceneId?: string;
  /** Displays a visual debugging overlay with scene ID, dimensions, and safe area boundary */
  debug?: boolean;
  /** Total scene duration in frames for coordinating exit transitions */
  durationInFrames?: number;
  /** Frame delay before scene becomes active */
  delay?: number;
  /** Scene-level entrance and exit animation config or preset name */
  animation?: SceneAnimationConfig | SceneAnimationType;
  /** Custom inline style overrides */
  style?: React.CSSProperties;
  /** Custom CSS class name */
  className?: string;
  /** Scene content children */
  children?: React.ReactNode;
}

export interface SceneAnimationMetrics {
  opacity: number;
  translateX: number;
  translateY: number;
  scale: number;
  progress: number;
  phase: 'pending' | 'enter' | 'active' | 'exit' | 'complete';
}

/* ========================================================================= */
/* HeroScene Types                                                           */
/* ========================================================================= */

export type HeroSceneLayout =
  | 'centered'
  | 'split-left'
  | 'split-right'
  | 'full-screen-visual'
  | 'custom';

export interface HeroSceneAnimationConfig {
  /** Base stagger delay between sequential elements in frames (default: 4) */
  staggerDelay?: number;
  /** Explicit delay for eyebrow in frames */
  eyebrowDelay?: number;
  /** Explicit delay for headline in frames */
  headlineDelay?: number;
  /** Explicit delay for subtitle in frames */
  subtitleDelay?: number;
  /** Explicit delay for description in frames */
  descriptionDelay?: number;
  /** Explicit delay for CTA in frames */
  ctaDelay?: number;
  /** Explicit delay for hero visual in frames */
  visualDelay?: number;
  /** Explicit delay for decorative elements in frames */
  decorativeDelay?: number;
  /** Text entrance animation style ('slide-up' | 'fade' | 'none', default: 'slide-up') */
  textAnimation?: 'slide-up' | 'fade' | 'none';
  /** Visual entrance animation style ('scale' | 'slide-up' | 'fade' | 'none', default: 'scale') */
  visualAnimation?: 'scale' | 'slide-up' | 'fade' | 'none';
  /** Whether to enable floating subtle animation on decorative elements */
  floatingDecorations?: boolean;
}

export interface HeroSceneProps {
  /** Main hero headline text or custom element */
  headline: React.ReactNode;
  /** Supporting subtitle text or element */
  subtitle?: React.ReactNode;
  /** Extended body description text or element */
  description?: React.ReactNode;
  /** Eyebrow badge or category pill */
  eyebrow?: React.ReactNode;
  /** Call to action button label or custom element */
  cta?: React.ReactNode;
  /** Optional click or action callback for CTA button */
  onCtaClick?: () => void;
  /** Main hero visual content (rendered inside visual slot) */
  children?: React.ReactNode;
  /** Hero visual content slot alias */
  heroVisual?: React.ReactNode;
  /** Decorative graphic elements (e.g. ambient particles, gradient meshes, orbs) */
  decorativeElements?: React.ReactNode;
  /** Layout structure variation (default: 'split-left') */
  layout?: HeroSceneLayout;
  /** Container CSS background */
  background?: string;
  /** Solid background color override */
  backgroundColor?: string;
  /** Background image URL or path */
  backgroundImage?: string;
  /** Fine-grained animation configuration */
  animation?: HeroSceneAnimationConfig;
  /** Global stagger delay shortcut in frames (default: 4) */
  staggerDelay?: number;
  /** Total scene duration in frames */
  durationInFrames?: number;
  /** Delay before hero scene entrance starts in frames */
  delay?: number;
  /** Scene container width in pixels or CSS value */
  width?: number | string;
  /** Scene container height in pixels or CSS value */
  height?: number | string;
  /** Inner content padding */
  padding?: ScenePadding;
  /** Broadcast safe area margin (boolean or custom pixels) */
  safeArea?: boolean | number;
  /** Scene identifier for debugging */
  sceneId?: string;
  /** Debug overlay toggle */
  debug?: boolean;
  /** Custom inline style overrides */
  style?: React.CSSProperties;
  /** Custom CSS class name */
  className?: string;
}

/* ========================================================================= */
/* ProductShowcaseScene Types                                                */
/* ========================================================================= */

export type ProductShowcaseLayout =
  | 'center-product'
  | 'product-left'
  | 'product-right'
  | 'full-screen'
  | 'floating-details'
  | 'custom';

export interface ProductDetailItem {
  id?: string;
  label: string;
  value: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  x?: number;
  y?: number;
  icon?: React.ReactNode;
}

export interface ProductShowcaseAnimationConfig {
  /** Stagger delay between content elements in frames (default: 4) */
  staggerDelay?: number;
  /** Product entrance animation style ('scale' | 'fade' | 'slide-up' | 'none', default: 'scale') */
  productEntrance?: 'scale' | 'fade' | 'slide-up' | 'none';
  /** Product entrance duration in frames (default: 20) */
  productDuration?: number;
  /** Whether to enable subtle continuous floating hover motion on product visual (default: true) */
  productFloating?: boolean;
  /** Whether to enable subtle continuous tilt/rotation on product visual (default: false) */
  productRotation?: boolean;
  /** Text entrance animation style ('slide-up' | 'fade' | 'none', default: 'slide-up') */
  textEntrance?: 'slide-up' | 'fade' | 'none';
  /** Delay before text entrance starts in frames */
  textDelay?: number;
  /** Delay before floating details entrance starts in frames */
  detailsDelay?: number;
  /** Amplitude of floating motion in pixels (default: 10) */
  floatingOffset?: number;
  /** Speed coefficient for floating sine wave (default: 0.06) */
  floatingSpeed?: number;
}

export interface ProductShowcaseSceneProps {
  /** Main product title */
  title: React.ReactNode;
  /** Supporting product subtitle or model designation */
  subtitle?: React.ReactNode;
  /** Product description paragraph or technical summary */
  description?: React.ReactNode;
  /** Category badge, release tag, or brand label */
  label?: React.ReactNode;
  /** Optional secondary supporting text, price, or availability */
  supportingText?: React.ReactNode;
  /** Main product visual content */
  children?: React.ReactNode;
  /** Main product visual slot alias */
  productVisual?: React.ReactNode;
  /** Product image URL fallback */
  productImage?: string;
  /** Callout detail spec badges floating around or next to product */
  details?: ProductDetailItem[];
  /** Ambient decorative graphic elements */
  decorativeElements?: React.ReactNode;
  /** Layout arrangement variation (default: 'center-product') */
  layout?: ProductShowcaseLayout;
  /** CSS background */
  background?: string;
  /** Solid background color override */
  backgroundColor?: string;
  /** Background image URL or path */
  backgroundImage?: string;
  /** Animation configuration */
  animation?: ProductShowcaseAnimationConfig;
  /** Total scene duration in frames */
  durationInFrames?: number;
  /** Delay before scene entrance starts in frames */
  delay?: number;
  /** Container width in pixels or CSS value */
  width?: number | string;
  /** Container height in pixels or CSS value */
  height?: number | string;
  /** Inner content padding */
  padding?: ScenePadding;
  /** Broadcast safe area margin (boolean or custom pixels) */
  safeArea?: boolean | number;
  /** Scene identifier for debugging */
  sceneId?: string;
  /** Debug overlay toggle */
  debug?: boolean;
  /** Custom inline style overrides */
  style?: React.CSSProperties;
  /** Custom CSS class name */
  className?: string;
}

/* ========================================================================= */
/* FeatureHighlightScene Types                                               */
/* ========================================================================= */

export type FeatureHighlightLayout =
  | 'text-left'
  | 'text-right'
  | 'centered'
  | 'full-visual'
  | 'with-annotations'
  | 'custom';

export interface FeatureAnnotationItem {
  id?: string;
  title?: string;
  description?: string;
  x?: number;
  y?: number;
  position?: 'top' | 'bottom' | 'left' | 'right';
  badge?: string;
  arrow?: boolean;
  color?: string;
}

export interface FeatureHighlightAnimationConfig {
  /** Base stagger delay between sequential elements in frames (default: 4) */
  staggerDelay?: number;
  /** Explicit delay for title in frames */
  titleDelay?: number;
  /** Explicit delay for description in frames */
  descriptionDelay?: number;
  /** Explicit delay for benefit statement in frames */
  benefitDelay?: number;
  /** Explicit delay for feature visual in frames */
  visualDelay?: number;
  /** Explicit delay for annotation callouts in frames */
  annotationsDelay?: number;
  /** Feature visual entrance style ('slide-up' | 'scale' | 'fade' | 'none', default: 'slide-up') */
  visualAnimation?: 'slide-up' | 'scale' | 'fade' | 'none';
  /** Text entrance style ('slide-up' | 'fade' | 'none', default: 'slide-up') */
  textAnimation?: 'slide-up' | 'fade' | 'none';
  /** Annotation callout entrance style ('pop' | 'fade' | 'slide' | 'none', default: 'pop') */
  annotationAnimation?: 'pop' | 'fade' | 'slide' | 'none';
  /** Whether to enable continuous ambient breathing highlight on benefit pill */
  highlightPulse?: boolean;
}

export interface FeatureHighlightSceneProps {
  /** Feature title or capability headline */
  title: React.ReactNode;
  /** Detailed feature explanation or narrative */
  description: React.ReactNode;
  /** Category badge or feature identifier */
  label?: React.ReactNode;
  /** Highlighted benefit statement (e.g. "10x Faster Ingestion") */
  benefit?: React.ReactNode;
  /** Feature icon or glyph */
  icon?: React.ReactNode;
  /** Main feature visual content */
  children?: React.ReactNode;
  /** Main feature visual slot alias */
  featureVisual?: React.ReactNode;
  /** Callout annotation pins positioned over or beside the visual */
  annotations?: FeatureAnnotationItem[];
  /** Ambient decorative graphic elements */
  decorativeElements?: React.ReactNode;
  /** Layout structure variation (default: 'text-left') */
  layout?: FeatureHighlightLayout;
  /** Container CSS background */
  background?: string;
  /** Solid background color override */
  backgroundColor?: string;
  /** Background image URL or path */
  backgroundImage?: string;
  /** Fine-grained animation timing configuration */
  animation?: FeatureHighlightAnimationConfig;
  /** Global stagger delay shortcut in frames (default: 4) */
  staggerDelay?: number;
  /** Total scene duration in frames */
  durationInFrames?: number;
  /** Delay before feature scene entrance starts in frames */
  delay?: number;
  /** Container width in pixels or CSS value */
  width?: number | string;
  /** Container height in pixels or CSS value */
  height?: number | string;
  /** Inner content padding */
  padding?: ScenePadding;
  /** Broadcast safe area margin (boolean or custom pixels) */
  safeArea?: boolean | number;
  /** Scene identifier for debugging */
  sceneId?: string;
  /** Debug overlay toggle */
  debug?: boolean;
  /** Custom inline style overrides */
  style?: React.CSSProperties;
  /** Custom CSS class name */
  className?: string;
}

/* ========================================================================= */
/* TypographyScene Types                                                     */
/* ========================================================================= */

export type TypographySceneLayout =
  | 'centered'
  | 'left-aligned'
  | 'right-aligned'
  | 'oversized-headline'
  | 'multi-line'
  | 'split-text'
  | 'text-with-graphics'
  | 'custom';

export type TypographySceneTextAnimation =
  | 'word-reveal'
  | 'character-reveal'
  | 'text-mask'
  | 'split-text'
  | 'slide-up'
  | 'fade'
  | 'pop'
  | 'none';

export interface TypographySceneAnimationConfig {
  /** Base stagger delay between sequential elements in frames (default: 4) */
  staggerDelay?: number;
  /** Explicit delay for eyebrow in frames */
  eyebrowDelay?: number;
  /** Explicit delay for headline in frames */
  headlineDelay?: number;
  /** Explicit delay for secondary headline in frames */
  secondaryDelay?: number;
  /** Explicit delay for description/paragraph in frames */
  descriptionDelay?: number;
  /** Explicit delay for text highlights in frames */
  highlightDelay?: number;
  /** Headline animation style (default: 'word-reveal') */
  headlineAnimation?: TypographySceneTextAnimation;
  /** Secondary headline animation style (default: 'slide-up') */
  secondaryAnimation?: 'slide-up' | 'fade' | 'none';
  /** Description animation style (default: 'slide-up') */
  descriptionAnimation?: 'slide-up' | 'fade' | 'none';
  /** Text highlight reveal animation style */
  highlightVariant?:
    | 'background'
    | 'underline'
    | 'marker'
    | 'box'
    | 'circle'
    | 'gradient'
    | 'glow';
  /** Duration for text highlight transition in frames (default: 15) */
  highlightDuration?: number;
}

export interface TypographySceneProps {
  /** Main primary headline text or React element */
  headline: React.ReactNode;
  /** Secondary headline or supporting sub-header */
  secondaryHeadline?: React.ReactNode;
  /** Supporting description paragraph or body copy */
  description?: React.ReactNode;
  /** Alias for description */
  paragraph?: React.ReactNode;
  /** Category eyebrow badge or section label */
  eyebrow?: React.ReactNode;
  /** Optional badge or tag label */
  label?: React.ReactNode;
  /** Words within headline or text to dynamically highlight */
  highlightedWords?: string[];
  /** Highlight color override */
  highlightColor?: string;
  /** Layout structure variation (default: 'centered') */
  layout?: TypographySceneLayout;
  /** Text alignment across container (default: 'center' for centered layout, 'left' for left-aligned) */
  alignment?: 'left' | 'center' | 'right';
  /** Decorative graphic elements (badges, particle bursts, geometric lines) */
  decorativeElements?: React.ReactNode;
  /** Fine-grained animation timing and kinetic presets */
  animation?: TypographySceneAnimationConfig;
  /** Global stagger delay shortcut in frames (default: 4) */
  staggerDelay?: number;
  /** Main headline inline style overrides */
  headlineStyle?: React.CSSProperties;
  /** Secondary headline inline style overrides */
  secondaryStyle?: React.CSSProperties;
  /** Description paragraph inline style overrides */
  descriptionStyle?: React.CSSProperties;
  /** Eyebrow inline style overrides */
  eyebrowStyle?: React.CSSProperties;
  /** Main children visual or custom layout element */
  children?: React.ReactNode;
  /** Container CSS background */
  background?: string;
  /** Solid background color override */
  backgroundColor?: string;
  /** Background image URL or path */
  backgroundImage?: string;
  /** Total scene duration in frames */
  durationInFrames?: number;
  /** Delay before typography scene entrance starts in frames */
  delay?: number;
  /** Container width in pixels or CSS value */
  width?: number | string;
  /** Container height in pixels or CSS value */
  height?: number | string;
  /** Inner content padding */
  padding?: ScenePadding;
  /** Broadcast safe area margin (boolean or custom pixels) */
  safeArea?: boolean | number;
  /** Scene identifier for debugging */
  sceneId?: string;
  /** Debug overlay toggle */
  debug?: boolean;
  /** Custom inline style overrides */
  style?: React.CSSProperties;
  /** Custom CSS class name */
  className?: string;
}

/* ========================================================================= */
/* DeviceShowcaseScene Types                                                 */
/* ========================================================================= */

export type DeviceShowcaseLayout =
  | 'single-centered'
  | 'device-left'
  | 'text-left'
  | 'multiple-devices'
  | 'device-overlap'
  | 'device-stack'
  | 'custom';

export type DeviceShowcaseDeviceType =
  | 'smartphone'
  | 'tablet'
  | 'laptop'
  | 'browser'
  | 'frame';

export interface DeviceItemConfig {
  /** Unique identifier for keying and targeting */
  id?: string;
  /** Hardware device type */
  type: DeviceShowcaseDeviceType;
  /** Custom screen content rendered inside device viewport */
  screenContent?: React.ReactNode;
  /** Screenshot image fallback */
  screenshot?: string;
  /** Device title badge or platform label */
  title?: string;
  /** Device frame width in pixels */
  width?: number;
  /** Device frame height in pixels */
  height?: number;
  /** Visual scale multiplier */
  scale?: number;
  /** Horizontal position (pixels or CSS percentage) */
  x?: number | string;
  /** Vertical position (pixels or CSS percentage) */
  y?: number | string;
  /** CSS z-index layering */
  zIndex?: number;
  /** Bezel or chassis finish color */
  deviceColor?: string;
  /** Model size preset */
  model?: string;
  /** Tablet screen orientation */
  orientation?: 'portrait' | 'landscape';
  /** Browser URL (for browser window mockup) */
  url?: string;
  /** Browser window title (for browser window mockup) */
  browserTitle?: string;
  /** Floating hover animation toggle or config */
  floating?: boolean | { amplitude?: number; frequency?: number; phase?: number };
  /** Tilt rotation animation toggle or config */
  tilt?: boolean | { maxAngle?: number; frequency?: number };
  /** Entrance animation type */
  animation?: 'scale' | 'slide-up' | 'slide-left' | 'slide-right' | 'fade' | 'none';
  /** Entrance frame delay */
  delay?: number;
  /** Entrance duration in frames */
  durationInFrames?: number;
  /** Device container inline style */
  style?: React.CSSProperties;
}

export interface DeviceAnnotationItem {
  id?: string;
  title: string;
  description?: string;
  x?: number | string;
  y?: number | string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  badge?: string;
  arrow?: boolean;
  color?: string;
}

export interface DeviceShowcaseAnimationConfig {
  /** Base stagger delay between sequential devices/text in frames (default: 6) */
  staggerDelay?: number;
  /** Delay before headline entrance starts in frames */
  titleDelay?: number;
  /** Delay before subtitle entrance starts in frames */
  subtitleDelay?: number;
  /** Delay before devices entrance starts in frames */
  devicesDelay?: number;
  /** Delay before annotations entrance starts in frames */
  annotationsDelay?: number;
  /** Global floating hover animation on devices (default: true) */
  floating?: boolean;
  /** Global floating amplitude in pixels (default: 8) */
  floatingAmplitude?: number;
  /** Global floating frequency in Hz (default: 0.05) */
  floatingSpeed?: number;
  /** Text entrance animation style ('slide-up' | 'fade' | 'none', default: 'slide-up') */
  textAnimation?: 'slide-up' | 'fade' | 'none';
  /** Annotations entrance animation style ('pop' | 'fade' | 'slide' | 'none', default: 'pop') */
  annotationAnimation?: 'pop' | 'fade' | 'slide' | 'none';
}

export interface DeviceShowcaseSceneProps {
  /** Main showcase headline title */
  title: React.ReactNode;
  /** Supporting subtitle or platform descriptor */
  subtitle?: React.ReactNode;
  /** Extended body description copy */
  description?: React.ReactNode;
  /** Category badge or release pill */
  label?: React.ReactNode;
  /** Primary showcase device */
  primaryDevice?: DeviceItemConfig;
  /** Array of secondary or companion devices */
  secondaryDevices?: DeviceItemConfig[];
  /** Unified array of devices (alternative to primary/secondary) */
  devices?: DeviceItemConfig[];
  /** Callout annotations pointing to hardware or software elements */
  annotations?: DeviceAnnotationItem[];
  /** Ambient decorative graphic elements */
  decorativeElements?: React.ReactNode;
  /** Layout arrangement variation (default: 'single-centered') */
  layout?: DeviceShowcaseLayout;
  /** Container CSS background */
  background?: string;
  /** Solid background color override */
  backgroundColor?: string;
  /** Background image URL or path */
  backgroundImage?: string;
  /** Fine-grained animation timing configuration */
  animation?: DeviceShowcaseAnimationConfig;
  /** Global stagger delay shortcut in frames (default: 6) */
  staggerDelay?: number;
  /** Fallback content rendered inside primary device or canvas */
  children?: React.ReactNode;
  /** Total scene duration in frames */
  durationInFrames?: number;
  /** Delay before scene entrance starts in frames */
  delay?: number;
  /** Container width in pixels or CSS value */
  width?: number | string;
  /** Container height in pixels or CSS value */
  height?: number | string;
  /** Inner content padding */
  padding?: ScenePadding;
  /** Broadcast safe area margin (boolean or custom pixels) */
  safeArea?: boolean | number;
  /** Scene identifier for debugging */
  sceneId?: string;
  /** Debug overlay toggle */
  debug?: boolean;
  /** Custom inline style overrides */
  style?: React.CSSProperties;
  /** Custom CSS class name */
  className?: string;
}

/* ========================================================================= */
/* ComparisonScene Types                                                     */
/* ========================================================================= */

export type ComparisonSceneLayout =
  | 'side-by-side'
  | 'top-and-bottom'
  | 'before-and-after'
  | 'left-and-right'
  | 'split-screen'
  | 'custom';

export interface ComparisonDividerConfig {
  /** Divider stroke/fill color */
  color?: string;
  /** Divider thickness in pixels (default: 2) */
  thickness?: number;
  /** Optional divider center pill label (e.g. "VS" or "BEFORE / AFTER") */
  label?: string;
  /** Position percentage of divider from 0 to 100 (default: 50) */
  position?: number;
}

export interface ComparisonSceneAnimationConfig {
  /** Base stagger delay between panels in frames (default: 6) */
  staggerDelay?: number;
  /** Panel entrance animation style ('slide-opposite' | 'fade' | 'scale' | 'slide-up' | 'none', default: 'slide-opposite') */
  panelAnimation?: 'slide-opposite' | 'fade' | 'scale' | 'slide-up' | 'none';
  /** Entrance duration in frames for panels (default: 22) */
  panelDuration?: number;
  /** Whether panels reveal sequentially (default: true) or simultaneously */
  sequentialReveal?: boolean;
  /** Whether to animate divider reveal (default: true) */
  dividerReveal?: boolean;
  /** Delay before divider starts revealing in frames (default: 4) */
  dividerDelay?: number;
  /** Side to visually emphasize with highlight glow ('left' | 'right' | 'none', default: 'none') */
  highlightSide?: 'left' | 'right' | 'none';
}

export interface ComparisonSceneProps {
  /** Comparison scene main title */
  title?: React.ReactNode;
  /** Supporting subtitle or comparison context */
  subtitle?: React.ReactNode;
  /** Extended body description copy */
  description?: React.ReactNode;
  /** Category eyebrow badge or section label */
  label?: React.ReactNode;
  /** Left (or Top / Before) comparison panel content */
  leftContent?: React.ReactNode;
  /** Right (or Bottom / After) comparison panel content */
  rightContent?: React.ReactNode;
  /** Left panel title label */
  leftLabel?: React.ReactNode;
  /** Right panel title label */
  rightLabel?: React.ReactNode;
  /** Left panel description copy */
  leftDescription?: React.ReactNode;
  /** Right panel description copy */
  rightDescription?: React.ReactNode;
  /** Left panel icon or glyph */
  leftIcon?: React.ReactNode;
  /** Right panel icon or glyph */
  rightIcon?: React.ReactNode;
  /** Center divider configuration (boolean or custom config) */
  divider?: boolean | ComparisonDividerConfig;
  /** Layout variation (default: 'side-by-side') */
  layout?: ComparisonSceneLayout;
  /** Fine-grained animation timing and kinematics */
  animation?: ComparisonSceneAnimationConfig;
  /** Global stagger delay shortcut in frames (default: 6) */
  staggerDelay?: number;
  /** Fallback content rendered inside comparison area */
  children?: React.ReactNode;
  /** Container CSS background */
  background?: string;
  /** Solid background color override */
  backgroundColor?: string;
  /** Background image URL or path */
  backgroundImage?: string;
  /** Total scene duration in frames */
  durationInFrames?: number;
  /** Delay before scene entrance starts in frames */
  delay?: number;
  /** Container width in pixels or CSS value */
  width?: number | string;
  /** Container height in pixels or CSS value */
  height?: number | string;
  /** Inner content padding */
  padding?: ScenePadding;
  /** Broadcast safe area margin (boolean or custom pixels) */
  safeArea?: boolean | number;
  /** Scene identifier for debugging */
  sceneId?: string;
  /** Debug overlay toggle */
  debug?: boolean;
  /** Custom inline style overrides */
  style?: React.CSSProperties;
  /** Custom CSS class name */
  className?: string;
}

/* ========================================================================= */
/* CallToActionScene Types                                                   */
/* ========================================================================= */

export type CallToActionSceneLayout =
  | 'centered'
  | 'left-aligned'
  | 'cta-with-product'
  | 'cta-with-device'
  | 'full-screen-typography'
  | 'custom';

export interface CallToActionItem {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'text';
  size?: 'small' | 'medium' | 'large';
}

export interface CallToActionAnimationConfig {
  /** Base stagger delay between sequential elements in frames (default: 4) */
  staggerDelay?: number;
  /** Delay before headline entrance starts in frames */
  headlineDelay?: number;
  /** Delay before description entrance starts in frames */
  descriptionDelay?: number;
  /** Delay before button group entrance starts in frames */
  buttonDelay?: number;
  /** Delay before visual entrance starts in frames */
  visualDelay?: number;
  /** Headline animation style ('word-reveal' | 'character-reveal' | 'slide-up' | 'fade' | 'none', default: 'word-reveal') */
  headlineAnimation?: 'word-reveal' | 'character-reveal' | 'slide-up' | 'fade' | 'none';
  /** Button entrance animation style ('scale' | 'pop' | 'slide-up' | 'fade' | 'none', default: 'pop') */
  buttonAnimation?: 'scale' | 'pop' | 'slide-up' | 'fade' | 'none';
  /** Whether to enable continuous subtle ambient breathing pulse on primary CTA button */
  buttonPulse?: boolean;
  /** Visual entrance style ('scale' | 'slide-up' | 'fade' | 'none', default: 'scale') */
  visualAnimation?: 'scale' | 'slide-up' | 'fade' | 'none';
}

export interface CallToActionSceneProps {
  /** Main primary CTA headline */
  headline: React.ReactNode;
  /** Supporting description copy */
  description?: React.ReactNode;
  /** Primary CTA button configuration or label */
  primaryAction: string | CallToActionItem;
  /** Optional secondary CTA button configuration or label */
  secondaryAction?: string | CallToActionItem;
  /** Brand name or category eyebrow */
  brand?: React.ReactNode;
  /** Brand logo or icon visual */
  logo?: React.ReactNode;
  /** Product visual element */
  productVisual?: React.ReactNode;
  /** Device mockup element (e.g. SmartphoneMockup) */
  deviceMockup?: React.ReactNode;
  /** Ambient decorative graphic elements */
  decorativeElements?: React.ReactNode;
  /** Layout structure variation (default: 'centered') */
  layout?: CallToActionSceneLayout;
  /** Fallback content rendered inside visual slot */
  children?: React.ReactNode;
  /** Fine-grained animation configuration */
  animation?: CallToActionAnimationConfig;
  /** Global stagger delay shortcut in frames (default: 4) */
  staggerDelay?: number;
  /** Container CSS background */
  background?: string;
  /** Solid background color override */
  backgroundColor?: string;
  /** Background image URL or path */
  backgroundImage?: string;
  /** Total scene duration in frames */
  durationInFrames?: number;
  /** Delay before scene entrance starts in frames */
  delay?: number;
  /** Container width in pixels or CSS value */
  width?: number | string;
  /** Container height in pixels or CSS value */
  height?: number | string;
  /** Inner content padding */
  padding?: ScenePadding;
  /** Broadcast safe area margin (boolean or custom pixels) */
  safeArea?: boolean | number;
  /** Scene identifier for debugging */
  sceneId?: string;
  /** Debug overlay toggle */
  debug?: boolean;
  /** Custom inline style overrides */
  style?: React.CSSProperties;
  /** Custom CSS class name */
  className?: string;
}

/* ========================================================================= */
/* OutroScene Types                                                          */
/* ========================================================================= */

export type OutroSceneLayout =
  | 'centered-brand'
  | 'logo-above-tagline'
  | 'tagline-above-logo'
  | 'left-aligned'
  | 'brand-with-cta'
  | 'full-screen-logo'
  | 'custom';

export interface OutroSceneAnimationConfig {
  /** Base stagger delay between sequential elements in frames (default: 5) */
  staggerDelay?: number;
  /** Delay before logo entrance starts in frames */
  logoDelay?: number;
  /** Delay before brand name entrance starts in frames */
  brandDelay?: number;
  /** Delay before tagline entrance starts in frames */
  taglineDelay?: number;
  /** Delay before links / CTA entrance starts in frames */
  metaDelay?: number;
  /** Logo entrance animation style ('scale' | 'fade' | 'pop' | 'slide-up' | 'none', default: 'scale') */
  logoAnimation?: 'scale' | 'fade' | 'pop' | 'slide-up' | 'none';
  /** Brand name animation style ('word-reveal' | 'slide-up' | 'fade' | 'none', default: 'slide-up') */
  brandAnimation?: 'word-reveal' | 'slide-up' | 'fade' | 'none';
  /** Tagline animation style ('slide-up' | 'fade' | 'none', default: 'slide-up') */
  taglineAnimation?: 'slide-up' | 'fade' | 'none';
  /** Whether to enable continuous subtle floating motion on logo (default: true) */
  floatingLogo?: boolean;
}

export interface OutroSceneProps {
  /** Brand name text or element */
  brandName?: React.ReactNode;
  /** Brand logo mark or React visual element */
  logo?: React.ReactNode;
  /** Brand tagline or slogan */
  tagline?: React.ReactNode;
  /** Website URL string (e.g. "antigravity.io") */
  website?: string;
  /** Social media handle (e.g. "@antigravity_ai") */
  socialHandle?: string;
  /** Closing CTA button label or custom element */
  cta?: React.ReactNode;
  /** Optional supporting copy, copyright, or licensing */
  supportingText?: React.ReactNode;
  /** Ambient decorative graphic elements */
  decorativeElements?: React.ReactNode;
  /** Layout arrangement variation (default: 'centered-brand') */
  layout?: OutroSceneLayout;
  /** Fallback content rendered inside brand logo slot */
  children?: React.ReactNode;
  /** Fine-grained animation timing configuration */
  animation?: OutroSceneAnimationConfig;
  /** Global stagger delay shortcut in frames (default: 5) */
  staggerDelay?: number;
  /** Container CSS background */
  background?: string;
  /** Solid background color override */
  backgroundColor?: string;
  /** Background image URL or path */
  backgroundImage?: string;
  /** Total scene duration in frames */
  durationInFrames?: number;
  /** Delay before scene entrance starts in frames */
  delay?: number;
  /** Container width in pixels or CSS value */
  width?: number | string;
  /** Container height in pixels or CSS value */
  height?: number | string;
  /** Inner content padding */
  padding?: ScenePadding;
  /** Broadcast safe area margin (boolean or custom pixels) */
  safeArea?: boolean | number;
  /** Scene identifier for debugging */
  sceneId?: string;
  /** Debug overlay toggle */
  debug?: boolean;
  /** Custom inline style overrides */
  style?: React.CSSProperties;
  /** Custom CSS class name */
  className?: string;
}

/* ========================================================================= */
/* SceneSequence Types                                                       */
/* ========================================================================= */

export type SceneTransitionType =
  | 'fade'
  | 'slide'
  | 'zoom'
  | 'wipe'
  | 'mask'
  | 'split'
  | 'morph'
  | 'glitch'
  | 'none'
  | 'cut';

export interface SceneTransitionConfig {
  /** Transition type preset */
  type?: SceneTransitionType;
  /** Transition duration in frames (default: 15) */
  durationInFrames?: number;
  /** Direction for directional transitions (slide, wipe, split) */
  direction?: 'left' | 'right' | 'top' | 'bottom' | string;
  /** Easing curve preset name or custom function */
  easing?: EasingPresetName | EasingFunction;
  /** Whether transition is disabled */
  disabled?: boolean;
  /** Additional custom props passed to transition */
  customProps?: Record<string, unknown>;
}

export interface SceneItemRenderProps {
  /** Local frame within the scene (0 to durationInFrames - 1) */
  frame: number;
  /** Total duration allocated for this scene */
  durationInFrames: number;
  /** Unique ID of this scene */
  sceneId: string;
  /** Whether the scene is currently active */
  isActive: boolean;
  /** Progress through this scene's lifespan (0 to 1) */
  progress: number;
  /** Global frame in the parent composition timeline */
  globalFrame: number;
}

export interface SceneSequenceItemConfig {
  /** Unique scene identifier */
  id: string;
  /** Human-readable scene name for debugging, logging, and telemetry */
  name?: string;
  /** Scene component element, FC, or render function */
  component?:
    | React.ReactNode
    | React.FC<SceneItemRenderProps>
    | ((props: SceneItemRenderProps) => React.ReactNode);
  /** Alternative alias for component */
  scene?: React.ReactNode;
  /** Duration in frames allocated for this scene */
  durationInFrames: number;
  /** Explicit starting frame offset (if omitted, auto-calculated sequentially from previous scene) */
  startFrame?: number;
  /** Optional delay in frames before this scene starts */
  delayBefore?: number;
  /** Optional delay in frames after this scene finishes before next scene starts */
  delayAfter?: number;
  /** Optional transition configuration (applies to entrance or both in/out) */
  transition?: SceneTransitionConfig;
  /** Optional transition specifically for scene entrance */
  entranceTransition?: SceneTransitionConfig;
  /** Optional transition specifically for scene exit */
  exitTransition?: SceneTransitionConfig;
  /** Explicit flag to permit overlap with preceding scene (default: false) */
  allowOverlap?: boolean;
  /** Scene-specific custom arbitrary properties passed down to render callback */
  props?: Record<string, unknown>;
  /** Optional inline style override for this scene's sequence wrapper */
  style?: React.CSSProperties;
  /** Optional className for this scene's sequence wrapper */
  className?: string;
}

export interface ScheduledSceneItem extends SceneSequenceItemConfig {
  /** Resolved frame where scene begins in the parent sequence */
  computedStartFrame: number;
  /** Resolved frame where scene ends in the parent sequence */
  computedEndFrame: number;
  /** Resolved index in the sequence order */
  sequenceIndex: number;
}

export interface SceneSequenceValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  totalCalculatedDuration: number;
}

export interface SequenceScheduleOptions {
  /** Default delay in frames between scenes when delayBefore is omitted */
  defaultDelay?: number;
  /** Global flag to permit scene overlap when startFrame is manually set (default: false) */
  allowOverlap?: boolean;
  /** Total timeline duration to clamp or pad against */
  totalDurationInFrames?: number;
}

export interface SceneSequenceProps {
  /** Array of scene configurations to sequence */
  scenes?: SceneSequenceItemConfig[];
  /** Default duration in frames between scenes when delayBefore is not specified (default: 0) */
  defaultDelay?: number;
  /** Default transition applied to scenes without explicit transition configuration */
  defaultTransition?: SceneTransitionConfig;
  /** Global flag to permit scene overlap when startFrame is manually set (default: false) */
  allowOverlap?: boolean;
  /** Visual telemetry debugging overlay (scene list, active frame, timing boundaries) */
  debug?: boolean;
  /** Custom inline style for container */
  style?: React.CSSProperties;
  /** Custom CSS class name */
  className?: string;
  /** Callback fired with calculated schedule for external telemetry/controls */
  onScheduleCalculated?: (schedule: ScheduledSceneItem[]) => void;
  /** Declarative JSX children (supports <SceneSequenceItem> components or standard React nodes) */
  children?: React.ReactNode;
}

export interface SceneSequenceItemProps extends Omit<SceneSequenceItemConfig, 'component'> {
  children?:
    | React.ReactNode
    | React.FC<SceneItemRenderProps>
    | ((props: SceneItemRenderProps) => React.ReactNode);
}
