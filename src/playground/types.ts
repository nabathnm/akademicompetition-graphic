/**
 * Motion Playground Types
 * Contracts for the isolated component testing and evaluation environment.
 */

import React from 'react';
import { ComponentCategory } from '../components/types';

export type PlaygroundViewMode =
  | 'overview'
  | 'utilities'
  | 'typography'
  | 'ui'
  | 'mockups'
  | 'graphics'
  | 'transitions'
  | 'scenes'
  | 'comparison'
  | 'isolated';

export interface MotionPlaygroundProps {
  /** Active category filter ('all' displays all categories) */
  selectedCategory?: ComponentCategory | 'all';
  /** View layout mode */
  viewMode?: PlaygroundViewMode;
  /** Active component ID when in isolated mode */
  activeComponentId?: string;
  /** Variant A name for side-by-side comparison */
  variantA?: string;
  /** Variant B name for side-by-side comparison */
  variantB?: string;
  /** Toggle subtle alignment grid */
  showGrid?: boolean;
}

export interface ShowcaseDefinition {
  id: string;
  name: string;
  category: ComponentCategory;
  description: string;
  variants: string[];
  status: 'planned' | 'in-development' | 'ready';
  component?: React.ComponentType<{ variant?: string }>;
}
