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

export interface PhoneFrameProps extends BaseMotionProps {
  screenContent?: React.ReactNode;
  theme?: 'dark' | 'light';
  notchType?: 'dynamicIsland' | 'punchHole';
  tiltX?: number;
  tiltY?: number;
  scale?: number;
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
