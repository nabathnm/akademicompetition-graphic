/**
 * Transition Component Prop Types
 */

import { BaseMotionProps } from '../types';

export interface WipeTransitionProps extends BaseMotionProps {
  direction?: 'leftToRight' | 'rightToLeft' | 'topToBottom' | 'bottomToTop';
  color?: string;
}

export interface SlideTransitionProps extends BaseMotionProps {
  direction?: 'horizontal' | 'vertical';
  distance?: number;
}

export interface ZoomTransitionProps extends BaseMotionProps {
  type?: 'zoomIn' | 'zoomOut';
  maxScale?: number;
}
