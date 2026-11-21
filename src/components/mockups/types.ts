/**
 * Mockup Component Prop Types
 */

import { BaseMotionProps } from '../types';

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
