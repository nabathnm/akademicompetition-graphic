/**
 * Scene Library Types
 * Core contracts for scene templates, layers, background configurations, and timing.
 */

import React from 'react';

export type SceneBackgroundType = 'solid' | 'gradient' | 'grid' | 'asset';

export interface SceneBackgroundConfig {
  type: SceneBackgroundType;
  color?: string;
  gradient?: string;
  gridOpacity?: number;
  assetUrl?: string;
}

export interface SceneTimingConfig {
  /** Total duration in frames for the scene */
  durationInFrames: number;
  /** Duration of the entrance phase in frames */
  entranceDurationFrames: number;
  /** Duration of the exit phase in frames */
  exitDurationFrames: number;
}

export interface BaseSceneProps {
  /** Scene identifier */
  sceneId: string;
  /** Scene human-readable title */
  title?: string;
  /** Timing configuration */
  timing: SceneTimingConfig;
  /** Background configuration */
  background?: SceneBackgroundConfig;
  /** Child content to render in the content layer */
  children?: React.ReactNode;
  /** Optional foreground / HUD overlay */
  overlay?: React.ReactNode;
  /** Safe area padding in px (default 80) */
  safeAreaPadding?: number;
}

export interface SceneMetadata {
  id: string;
  name: string;
  description: string;
  defaultDurationFrames: number;
  recommendedFps: number;
  tags?: string[];
}
