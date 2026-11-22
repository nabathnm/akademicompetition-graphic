/**
 * Mockup Component Prop Types
 */

import type { EasingPresetName, EasingFunction } from '../../utils/animation/easing.ts';
import type { SpringPresetName } from '../../styles/motion.ts';
import { BaseMotionProps } from '../types.ts';

// ---------------------------------------------------------------------------
// DeviceFrame Types (Foundational Mockup Layer)
// ---------------------------------------------------------------------------

export type DeviceFrameAnimation =
  | 'none'
  | 'fade-in'
  | 'fade-out'
  | 'scale-in'
  | 'scale-out'
  | 'slide-in'
  | 'rotate'
  | 'pop'
  | 'spring';

export type DeviceSlideDirection = 'up' | 'down' | 'left' | 'right';

export type DeviceNotchType =
  | 'none'
  | 'punch-hole'
  | 'dynamic-island'
  | 'notch'
  | 'speaker';

export type DeviceShadowPreset = 'none' | 'subtle' | 'medium' | 'high' | 'floating';

export interface DeviceButtonConfig {
  side: 'left' | 'right';
  /** Position from top in percentage (0 to 100) or pixels */
  position: number;
  /** Length of the hardware button in pixels */
  length: number;
  /** Thickness extending outward in pixels (default: 3) */
  thickness?: number;
  /** Hardware button color */
  color?: string;
}

export interface DeviceFrameAnimationConfig {
  type?: DeviceFrameAnimation;
  delay?: number;
  duration?: number;
  direction?: DeviceSlideDirection;
  easing?: EasingPresetName | EasingFunction;
  springPreset?: SpringPresetName;
  from?: number;
  to?: number;
}

export interface DeviceFrameDimensions {
  width: number;
  height: number;
  frameThickness: number;
  borderRadius: number;
  screenWidth: number;
  screenHeight: number;
  screenRadius: number;
}

export interface DeviceFrameMotionState {
  progress: number;
  opacity: number;
  translateX: number;
  translateY: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  isAnimating: boolean;
  hasExited: boolean;
}

export interface DeviceFrameProps {
  /** Outer frame width in pixels (default: 320) */
  width?: number;
  /** Outer frame height in pixels (default: 640) */
  height?: number;
  /** Bezel / frame thickness in pixels (default: 12) */
  frameThickness?: number;
  /** Outer frame corner border radius in pixels (default: 38) */
  borderRadius?: number;
  /** Inner screen corner radius (auto-computed as max(0, borderRadius - frameThickness) if omitted) */
  screenRadius?: number;
  /** Outer frame material/bezel color (default: '#1e2430') */
  frameColor?: string;
  /** Inner screen background color or gradient (default: '#000000') */
  screenColor?: string;
  /** Outer bezel border stroke width (default: 1) */
  borderWidth?: number;
  /** Outer bezel border stroke color (default: 'rgba(255, 255, 255, 0.12)') */
  borderColor?: string;
  /** Inner bezel edge stroke width */
  innerBorderWidth?: number;
  /** Inner bezel edge stroke color */
  innerBorderColor?: string;
  /** 2D depth shadow preset or custom CSS box-shadow string (default: 'medium') */
  shadow?: DeviceShadowPreset | string;
  /** Custom shadow color */
  shadowColor?: string;
  /** Subtle diagonal glass glare reflection overlay across screen (default: true) */
  glare?: boolean;
  /** Camera / sensor notch cutout type ('none' | 'punch-hole' | 'dynamic-island' | 'notch' | 'speaker', default: 'none') */
  notch?: DeviceNotchType;
  /** Custom notch cutout width in pixels */
  notchWidth?: number;
  /** Custom notch cutout height in pixels */
  notchHeight?: number;
  /** Camera position relative to top bezel */
  cameraPosition?: 'top' | 'center' | 'left' | 'right';
  /** Hardware side volume/power buttons on the frame edge (boolean or custom array) */
  buttons?: boolean | DeviceButtonConfig[];
  /** Mock mobile status bar (time, wifi, battery) or custom status node */
  statusBar?: boolean | React.ReactNode;
  /** Home indicator bar at bottom of screen */
  homeBar?: boolean;
  /** Custom content rendered inside the screen */
  children?: React.ReactNode;
  /** Dedicated screen content prop (alternative to children) */
  screenContent?: React.ReactNode;
  /** Primary animation type shorthand or full config */
  animation?: DeviceFrameAnimation | DeviceFrameAnimationConfig;
  /** Whether animation is enabled (default: true) */
  animate?: boolean;
  /** Frame delay before entrance begins */
  delay?: number;
  /** Starting frame for entrance animation (alias for delay) */
  startFrame?: number;
  /** Duration in frames for entrance */
  durationInFrames?: number;
  /** Direction for slide entrance ('up' | 'down' | 'left' | 'right') */
  slideDirection?: DeviceSlideDirection;
  /** Easing function or preset */
  easing?: EasingPresetName | EasingFunction;
  /** Spring physics preset ('snappy', 'gentle', 'bouncy', etc.) */
  springPreset?: SpringPresetName;
  /** Exit transition frame trigger */
  exitFrame?: number;
  /** Duration in frames for exit transition */
  exitDurationInFrames?: number;
  /** Exit transition type */
  exitAnimation?: 'fade-out' | 'scale-out' | 'slide-down';
  /** Outer container styling */
  style?: React.CSSProperties;
  /** Inner screen container styling */
  screenStyle?: React.CSSProperties;
  /** Custom CSS class */
  className?: string;
}

// ---------------------------------------------------------------------------
// Specialized Mockup Types (Extensions of DeviceFrame)
// ---------------------------------------------------------------------------

export type SmartphoneModelPreset = 'custom' | 'compact' | 'flagship' | 'pro-max' | 'fold';

export interface SmartphoneFloatingConfig {
  /** Amplitude of vertical float in pixels (default: 8) */
  amplitude?: number;
  /** Floating cycle frequency in Hz (cycles per second, default: 0.5) */
  frequency?: number;
  /** Phase offset in radians (default: 0) */
  phase?: number;
}

export interface SmartphoneTiltConfig {
  /** Maximum tilt rotation angle in degrees (default: 3) */
  maxAngle?: number;
  /** Tilt cycle frequency in Hz (cycles per second, default: 0.35) */
  frequency?: number;
  /** Tilt axis */
  axis?: 'z' | 'both';
}

export interface SmartphoneScreenRevealConfig {
  /** Delay before screen content starts revealing in frames (default: 15) */
  delay?: number;
  /** Duration of screen reveal animation in frames (default: 15) */
  duration?: number;
  /** Reveal animation style (default: 'fade') */
  type?: 'fade' | 'wipe-up' | 'scale';
}

export interface SmartphoneMockupProps {
  /** Model preset with calibrated standard aspect ratios and dimensions */
  model?: SmartphoneModelPreset;
  /** Outer frame width in pixels (default: 320) */
  width?: number;
  /** Outer frame height in pixels (default: 660, or computed from aspectRatio) */
  height?: number;
  /** Screen aspect ratio (e.g. '9:19.5', '9:20', '9:16', '16:9', or numeric ratio) */
  aspectRatio?: string | number;
  /** Device frame bezel color (default: '#1a1f2c') */
  deviceColor?: string;
  /** Alternative alias for deviceColor */
  frameColor?: string;
  /** Screen background color (default: '#000000') */
  screenColor?: string;
  /** Bezel / frame thickness in pixels (default: 12) */
  frameThickness?: number;
  /** Outer frame corner border radius (default: 40) */
  borderRadius?: number;
  /** Inner screen corner radius (concentric default: max(0, borderRadius - frameThickness)) */
  screenRadius?: number;
  /** Camera cutout toggle or cutout type ('dynamic-island' | 'punch-hole' | 'notch' | 'speaker' | 'none', default: true -> 'dynamic-island') */
  showCamera?: boolean | DeviceNotchType;
  /** Specific camera cutout design */
  cameraCutout?: DeviceNotchType;
  /** Camera position relative to top bezel */
  cameraPosition?: 'top' | 'center' | 'left' | 'right';
  /** Show mobile status bar (boolean, 'light' or 'dark' theme for icon contrast, or custom node) */
  showStatusBar?: boolean | 'light' | 'dark' | React.ReactNode;
  /** Show bottom home indicator bar (default: true) */
  showHomeIndicator?: boolean;
  /** Show hardware side buttons (volume, power) (default: true) */
  showButtons?: boolean;
  /** Custom hardware buttons configuration */
  buttons?: boolean | DeviceButtonConfig[];
  /** 2D depth shadow preset or custom CSS box-shadow (default: 'medium') */
  shadow?: DeviceShadowPreset | string;
  /** Custom shadow color */
  shadowColor?: string;
  /** Subtle diagonal glass glare reflection overlay (default: true) */
  glare?: boolean;
  /** Whether to clip screen content to screen corner radius (default: true) */
  clipScreen?: boolean;
  /** Screenshot or image URL displayed inside the screen */
  screenshot?: string;
  /** Image object-fit mode when screenshot is provided (default: 'cover') */
  imageFit?: 'cover' | 'contain' | 'fill';
  /** Dedicated screen content prop (alternative to children) */
  screenContent?: React.ReactNode;
  /** Screen content children */
  children?: React.ReactNode;
  /** Primary entrance animation */
  animation?: DeviceFrameAnimation | DeviceFrameAnimationConfig;
  /** Whether entrance animation is enabled (default: true) */
  animate?: boolean;
  /** Frame delay before entrance starts (default: 0) */
  delay?: number;
  /** Starting frame for entrance animation (alias for delay) */
  startFrame?: number;
  /** Entrance animation duration in frames (default: 25) */
  durationInFrames?: number;
  /** Direction for slide entrance */
  slideDirection?: DeviceSlideDirection;
  /** Easing function or preset */
  easing?: EasingPresetName | EasingFunction;
  /** Spring preset for snappy entrance physics */
  springPreset?: SpringPresetName;
  /** Continuous subtle floating motion (boolean or custom config) */
  floating?: boolean | SmartphoneFloatingConfig;
  /** Continuous gentle tilt motion (boolean or custom config) */
  tilt?: boolean | SmartphoneTiltConfig;
  /** Sequential reveal transition for screen content */
  screenReveal?: boolean | SmartphoneScreenRevealConfig;
  /** Frame at which device exit transition begins */
  exitFrame?: number;
  /** Duration in frames for exit transition */
  exitDurationInFrames?: number;
  /** Exit transition type */
  exitAnimation?: 'fade-out' | 'scale-out' | 'slide-down';
  /** Outer container style */
  style?: React.CSSProperties;
  /** Screen container style */
  screenStyle?: React.CSSProperties;
  /** Custom CSS class name */
  className?: string;
}

export interface PhoneFrameProps extends BaseMotionProps {
  screenContent?: React.ReactNode;
  theme?: 'dark' | 'light';
  notchType?: 'dynamicIsland' | 'punchHole';
  tiltX?: number;
  tiltY?: number;
  scale?: number;
}

// ---------------------------------------------------------------------------
// BrowserWindowMockup Types
// ---------------------------------------------------------------------------

export type BrowserTheme = 'dark' | 'light';
export type BrowserVariant = 'minimal' | 'full';
export type BrowserControlsStyle = 'traffic-lights' | 'monochrome' | 'subtle';

export interface BrowserTab {
  id: string | number;
  title: string;
  icon?: React.ReactNode;
  active?: boolean;
  faviconColor?: string;
}

export interface BrowserScrollConfig {
  /** Starting frame for animated scroll (default: 30) */
  startFrame?: number;
  /** Duration in frames for scroll animation (default: 45) */
  duration?: number;
  /** Starting scroll offset in percentage 0-100 (default: 0) */
  from?: number;
  /** Target scroll offset in percentage 0-100 (default: 100) */
  to?: number;
  /** Total virtual content height in pixels to calculate scroll distance (default: 1200) */
  contentHeight?: number;
  /** Easing function or preset */
  easing?: EasingPresetName | EasingFunction;
}

export interface BrowserChromeRevealConfig {
  /** Delay in frames before chrome reveals (default: 0) */
  delay?: number;
  /** Duration in frames for chrome reveal (default: 15) */
  duration?: number;
}

export interface BrowserViewportRevealConfig {
  /** Delay in frames before viewport content reveals (default: 12) */
  delay?: number;
  /** Duration in frames for viewport reveal (default: 16) */
  duration?: number;
  /** Reveal style: 'fade' | 'wipe-up' | 'scale' (default: 'fade') */
  type?: 'fade' | 'wipe-up' | 'scale';
}

export interface BrowserThemeColors {
  windowBg: string;
  toolbarBg: string;
  tabBarBg: string;
  tabActiveBg: string;
  tabInactiveBg: string;
  tabActiveText: string;
  tabInactiveText: string;
  addressBarBg: string;
  addressBarBorder: string;
  addressBarText: string;
  addressBarIcon: string;
  borderColor: string;
  viewportBg: string;
  scrollbarTrack: string;
  scrollbarThumb: string;
}

export interface BrowserWindowMockupProps {
  /** Outer window width in pixels (default: 800) */
  width?: number;
  /** Outer window height in pixels (default: 520) */
  height?: number;
  /** Visual style: 'minimal' (compact single header) or 'full' (tabs + toolbar) (default: 'full') */
  variant?: BrowserVariant;
  /** Color scheme theme ('dark' | 'light', default: 'dark') */
  theme?: BrowserTheme;
  /** Custom color theme overrides */
  themeColors?: Partial<BrowserThemeColors>;
  /** Window title shown in tab or minimal title bar */
  title?: string;
  /** Current website URL */
  url?: string;
  /** Window tabs array for full variant */
  tabs?: BrowserTab[];
  /** Active tab identifier */
  activeTabId?: string | number;
  /** Show top browser toolbar (default: true) */
  showToolbar?: boolean;
  /** Show tab bar row in full variant (default: true) */
  showTabs?: boolean;
  /** Show URL address bar (default: true) */
  showAddressBar?: boolean;
  /** Show window control buttons (traffic lights) (default: true) */
  showWindowControls?: boolean;
  /** Window control buttons style ('traffic-lights' | 'monochrome' | 'subtle', default: 'traffic-lights') */
  windowControlsStyle?: BrowserControlsStyle;
  /** Show navigation buttons: back, forward, reload (default: true in full, false in minimal) */
  showNavigationButtons?: boolean;
  /** Show browser toolbar utility icons: bookmark, share, settings (default: true in full) */
  showToolbarIcons?: boolean;
  /** Outer window corner border radius in pixels (default: 14) */
  borderRadius?: number;
  /** Outer window border stroke width (default: 1) */
  borderWidth?: number;
  /** Outer window border stroke color */
  borderColor?: string;
  /** 2D depth shadow preset or custom CSS box-shadow (default: 'medium') */
  shadow?: DeviceShadowPreset | string;
  /** Custom shadow tint */
  shadowColor?: string;
  /** Show simulated vertical scrollbar in viewport (default: true) */
  showScrollbar?: boolean;
  /** Deterministic scroll progress: number 0-1 (or percentage 0-100) or frame-based scroll config */
  scrollProgress?: number | BrowserScrollConfig;
  /** Total virtual content height in pixels for scroll translation (default: 1200) */
  contentHeight?: number;
  /** Custom React children rendered inside the web viewport */
  children?: React.ReactNode;
  /** Dedicated screen content prop (alternative to children) */
  screenContent?: React.ReactNode;
  /** Primary entrance animation */
  animation?: DeviceFrameAnimation | DeviceFrameAnimationConfig;
  /** Master animation toggle (default: true) */
  animate?: boolean;
  /** Frame delay before entrance starts (default: 0) */
  delay?: number;
  /** Starting frame for entrance animation (alias for delay) */
  startFrame?: number;
  /** Entrance animation duration in frames (default: 25) */
  durationInFrames?: number;
  /** Direction for slide entrance */
  slideDirection?: DeviceSlideDirection;
  /** Easing curve */
  easing?: EasingPresetName | EasingFunction;
  /** Spring preset */
  springPreset?: SpringPresetName;
  /** Continuous subtle floating motion */
  floating?: boolean | SmartphoneFloatingConfig;
  /** Toolbar / chrome reveal animation */
  chromeReveal?: boolean | BrowserChromeRevealConfig;
  /** Viewport content reveal transition */
  viewportReveal?: boolean | BrowserViewportRevealConfig;
  /** Exit transition frame trigger */
  exitFrame?: number;
  /** Duration in frames for exit transition */
  exitDurationInFrames?: number;
  /** Exit transition type */
  exitAnimation?: 'fade-out' | 'scale-out' | 'slide-down';
  /** Outer window styling */
  style?: React.CSSProperties;
  /** Main viewport container styling */
  viewportStyle?: React.CSSProperties;
  /** Custom CSS class */
  className?: string;
}

// ---------------------------------------------------------------------------
// LaptopMockup Types
// ---------------------------------------------------------------------------

export type LaptopModelPreset = 'compact' | 'standard' | 'pro' | 'custom';
export type LaptopFinish = 'space-gray' | 'silver' | 'midnight' | 'starlight';

export interface LaptopOpeningConfig {
  /** Starting frame for opening animation (default: 0) */
  startFrame?: number;
  /** Duration in frames for opening animation (default: 30) */
  duration?: number;
  /** Starting tilt angle in degrees from hinge (default: 70 - semi-closed, where 0 is fully open) */
  fromAngle?: number;
  /** Ending tilt angle in degrees (default: 0 - fully open facing front) */
  toAngle?: number;
  /** Easing curve */
  easing?: EasingPresetName | EasingFunction;
}

export interface LaptopDimensions {
  width: number;
  height: number;
  lidWidth: number;
  lidHeight: number;
  bezelThickness: number;
  screenWidth: number;
  screenHeight: number;
  screenRadius: number;
  baseWidth: number;
  baseHeight: number;
  hingeWidth: number;
  hingeHeight: number;
  keyboardWidth: number;
  keyboardHeight: number;
  trackpadWidth: number;
  trackpadHeight: number;
  borderRadius: number;
}

export interface LaptopOpeningState {
  progress: number;
  angle: number;
  lidOpacity: number;
  isOpening: boolean;
  isComplete: boolean;
}

export interface LaptopMockupProps {
  /** Model size preset ('compact' | 'standard' | 'pro' | 'custom', default: 'standard') */
  model?: LaptopModelPreset;
  /** Convenient alias for model */
  preset?: LaptopModelPreset;
  /** Pre-configured hardware finish palette ('space-gray' | 'silver' | 'midnight' | 'starlight') */
  finish?: LaptopFinish | string;
  /** Outer laptop width in pixels (default: 680) */
  width?: number;
  /** Total laptop height including keyboard base deck (optional; auto-derived from aspect ratio and base) */
  height?: number;
  /** Screen aspect ratio (e.g. '16:10', '16:9', '3:2', or numeric ratio, default: '16:10') */
  screenAspectRatio?: string | number;
  /** Device chassis color (default: '#1e2430') */
  deviceColor?: string;
  /** Alternative alias for deviceColor */
  frameColor?: string;
  /** Screen viewport background color (default: '#000000') */
  screenColor?: string;
  /** Screen bezel thickness in pixels (default: 10) */
  bezelThickness?: number;
  /** Lid outer corner radius in pixels (default: 14) */
  borderRadius?: number;
  /** Inner screen corner radius (concentric default: max(0, borderRadius - bezelThickness)) */
  screenRadius?: number;
  /** Height of keyboard base deck in pixels (default: 100) */
  baseHeight?: number;
  /** Show keyboard keys layout on base deck (default: true) */
  showKeyboard?: boolean;
  /** Show trackpad on base deck (default: true) */
  showTrackpad?: boolean;
  /** Show hinge connecting lid and deck (default: true) */
  showHinge?: boolean;
  /** Show camera dot at top bezel (default: true) */
  showCamera?: boolean;
  /** Camera cutout style ('camera-dot' | 'punch-hole' | 'notch' | 'none', default: 'camera-dot') */
  cameraType?: 'camera-dot' | 'punch-hole' | 'notch' | 'none';
  /** 2D depth shadow preset or custom CSS box-shadow (default: 'medium') */
  shadow?: DeviceShadowPreset | string;
  /** Custom shadow tint */
  shadowColor?: string;
  /** Subtle diagonal glass glare reflection overlay across screen (default: true) */
  glare?: boolean;
  /** Screenshot image URL rendered inside screen viewport */
  screenshot?: string;
  /** Object fit mode for screenshot (default: 'cover') */
  imageFit?: 'cover' | 'contain' | 'fill';
  /** Custom React children rendered inside the screen viewport */
  children?: React.ReactNode;
  /** Dedicated screen content prop (alternative to children) */
  screenContent?: React.ReactNode;
  /** Primary entrance animation */
  animation?: DeviceFrameAnimation | DeviceFrameAnimationConfig;
  /** Master animation toggle (default: true) */
  animate?: boolean;
  /** Frame delay before entrance starts (default: 0) */
  delay?: number;
  /** Starting frame for entrance animation (alias for delay) */
  startFrame?: number;
  /** Entrance animation duration in frames (default: 25) */
  durationInFrames?: number;
  /** Direction for slide entrance */
  slideDirection?: DeviceSlideDirection;
  /** Easing curve */
  easing?: EasingPresetName | EasingFunction;
  /** Spring preset */
  springPreset?: SpringPresetName;
  /** Continuous subtle floating motion */
  floating?: boolean | SmartphoneFloatingConfig;
  /** Continuous gentle tilt motion */
  tilt?: boolean | SmartphoneTiltConfig;
  /** Deterministic laptop lid opening animation */
  openingAnimation?: boolean | LaptopOpeningConfig;
  /** Sequential reveal transition for screen content */
  screenReveal?: boolean | SmartphoneScreenRevealConfig;
  /** Exit transition frame trigger */
  exitFrame?: number;
  /** Duration in frames for exit transition */
  exitDurationInFrames?: number;
  /** Exit transition type */
  exitAnimation?: 'fade-out' | 'scale-out' | 'slide-down';
  /** Outer laptop container styling */
  style?: React.CSSProperties;
  /** Screen viewport container styling */
  screenStyle?: React.CSSProperties;
  /** Custom CSS class */
  className?: string;
}

export interface BrowserFrameProps extends BaseMotionProps {
  url?: string;
  theme?: 'dark' | 'light';
  windowTitle?: string;
}

export interface FloatingCardProps extends BaseMotionProps {
  elevation?: 'low' | 'medium' | 'high';
  borderGlow?: boolean;
}

// ---------------------------------------------------------------------------
// TabletMockup Types
// ---------------------------------------------------------------------------

export type TabletOrientation = 'portrait' | 'landscape';
export type TabletModelPreset = 'compact' | 'standard' | 'pro' | 'custom';
export type TabletFinish =
  | 'space-gray'
  | 'silver'
  | 'starlight'
  | 'midnight'
  | 'rose-gold'
  | 'sky-blue';

export interface TabletRotationConfig {
  /** Start frame for device rotation animation (default: 0) */
  startFrame?: number;
  /** Duration in frames for rotation animation (default: 30) */
  duration?: number;
  /** Starting angle in degrees (default: 0) */
  fromAngle?: number;
  /** Target ending angle in degrees (default: 90) */
  toAngle?: number;
  /** Easing function or preset */
  easing?: EasingPresetName | EasingFunction;
}

export interface TabletDimensions {
  width: number;
  height: number;
  orientation: TabletOrientation;
  frameThickness: number;
  borderRadius: number;
  screenRadius: number;
  screenWidth: number;
  screenHeight: number;
  aspectRatio: number;
}

export interface TabletMockupProps {
  /** Model size preset ('compact' | 'standard' | 'pro' | 'custom', default: 'standard') */
  model?: TabletModelPreset;
  /** Convenient alias for model */
  preset?: TabletModelPreset;
  /** Tablet orientation: 'portrait' (vertical) or 'landscape' (horizontal) (default: 'landscape') */
  orientation?: TabletOrientation;
  /** Outer tablet width in pixels (derived from preset and orientation if omitted) */
  width?: number;
  /** Outer tablet height in pixels (derived from preset and orientation if omitted) */
  height?: number;
  /** Screen aspect ratio (e.g. '4:3', '16:10', '3:2', or numeric ratio) */
  aspectRatio?: string | number;
  /** Pre-configured metallic hardware finish */
  finish?: TabletFinish | string;
  /** Custom device chassis color (default: '#1e2430' or finish color) */
  deviceColor?: string;
  /** Alternative alias for deviceColor */
  frameColor?: string;
  /** Screen background color (default: '#000000') */
  screenColor?: string;
  /** Frame/bezel border thickness in pixels (default: 16) */
  frameThickness?: number;
  /** Outer chassis corner radius in pixels (default: 26) */
  borderRadius?: number;
  /** Inner screen corner radius (concentric default: max(2, borderRadius - frameThickness)) */
  screenRadius?: number;
  /** Front camera dot on bezel (default: true) */
  showCamera?: boolean;
  /** Camera location on bezel ('top' | 'center' | 'left' | 'right', default: depends on orientation) */
  cameraPosition?: 'top' | 'center' | 'left' | 'right';
  /** Classic circular Touch ID home button (default: false) */
  showHomeButton?: boolean;
  /** Show tablet status bar (boolean, 'light' or 'dark' theme for contrast, or custom node) (default: true) */
  showStatusBar?: boolean | 'light' | 'dark' | React.ReactNode;
  /** Show bottom home gesture indicator bar (default: true) */
  showHomeIndicator?: boolean;
  /** Show magnetic stylus / Apple Pencil dock accent on chassis edge (default: false) */
  showStylus?: boolean;
  /** Hardware side volume and power buttons (default: true) */
  showButtons?: boolean;
  /** Custom buttons config */
  buttons?: boolean | DeviceButtonConfig[];
  /** 2D depth shadow preset or custom CSS box-shadow (default: 'medium') */
  shadow?: DeviceShadowPreset | string;
  /** Custom shadow tint */
  shadowColor?: string;
  /** Subtle diagonal glass glare reflection overlay across screen (default: true) */
  glare?: boolean;
  /** Screenshot image URL rendered inside screen viewport */
  screenshot?: string;
  /** Object fit mode for screenshot (default: 'cover') */
  imageFit?: 'cover' | 'contain' | 'fill';
  /** Custom React children rendered inside the screen viewport */
  children?: React.ReactNode;
  /** Dedicated screen content prop (alternative to children) */
  screenContent?: React.ReactNode;
  /** Primary entrance animation */
  animation?: DeviceFrameAnimation | DeviceFrameAnimationConfig;
  /** Master animation toggle (default: true) */
  animate?: boolean;
  /** Frame delay before entrance starts (default: 0) */
  delay?: number;
  /** Starting frame for entrance animation (alias for delay) */
  startFrame?: number;
  /** Entrance animation duration in frames (default: 25) */
  durationInFrames?: number;
  /** Direction for slide entrance */
  slideDirection?: DeviceSlideDirection;
  /** Easing curve */
  easing?: EasingPresetName | EasingFunction;
  /** Spring preset */
  springPreset?: SpringPresetName;
  /** Continuous subtle floating motion */
  floating?: boolean | SmartphoneFloatingConfig;
  /** Continuous gentle tilt motion */
  tilt?: boolean | SmartphoneTiltConfig;
  /** Static device rotation angle in degrees */
  deviceRotation?: number;
  /** Deterministic device orientation rotation animation */
  rotationAnimation?: boolean | TabletRotationConfig;
  /** Sequential reveal transition for screen content */
  screenReveal?: boolean | SmartphoneScreenRevealConfig;
  /** Exit transition frame trigger */
  exitFrame?: number;
  /** Duration in frames for exit transition */
  exitDurationInFrames?: number;
  /** Exit transition type */
  exitAnimation?: 'fade-out' | 'scale-out' | 'slide-down';
  /** Outer tablet container styling */
  style?: React.CSSProperties;
  /** Screen viewport container styling */
  screenStyle?: React.CSSProperties;
  /** Custom CSS class */
  className?: string;
}
