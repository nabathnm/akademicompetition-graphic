/**
 * Typography Component Prop Types
 */

import { BaseMotionProps } from '../types';

export interface HeadlineProps extends BaseMotionProps {
  text: string;
  level?: 'h1' | 'h2' | 'h3' | 'h4';
  color?: string;
  animate?: boolean;
}

export interface DisplayHeroProps extends BaseMotionProps {
  title: string;
  subtitle?: string;
  highlightWords?: string[];
  highlightColor?: string;
}

export interface AnimatedCounterProps extends BaseMotionProps {
  fromValue: number;
  toValue: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  color?: string;
}

export interface KineticTextProps extends BaseMotionProps {
  text: string;
  splitBy?: 'words' | 'characters' | 'lines';
  staggerFrames?: number;
}
