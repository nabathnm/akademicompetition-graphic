/**
 * UI Component Prop Types
 */

import { LucideIcon } from 'lucide-react';
import { BaseMotionProps } from '../types';

export interface BadgeProps extends BaseMotionProps {
  label: string;
  variant?: 'brand' | 'success' | 'warning' | 'neutral';
  icon?: LucideIcon;
}

export interface ButtonProps extends BaseMotionProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'glass';
  icon?: LucideIcon;
}

export interface MetricCardProps extends BaseMotionProps {
  label: string;
  value: string | number;
  changePercent?: number;
  icon?: LucideIcon;
}

export interface ProgressBarProps extends BaseMotionProps {
  progress: number; // 0 to 1
  color?: string;
  trackColor?: string;
  height?: number;
}
