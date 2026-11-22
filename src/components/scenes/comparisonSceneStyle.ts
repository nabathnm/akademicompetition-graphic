/**
 * ComparisonScene Mathematical and Layout Engine
 * Layer 3 of the Motion Graphics Framework.
 */

import React from 'react';
import type {
  ComparisonDividerConfig,
  ComparisonSceneAnimationConfig,
  ComparisonSceneLayout,
} from './types.ts';
import { clamp } from '../../utils/animation/clamp.ts';
import { easeOut } from '../../utils/animation/easing.ts';

export interface ComparisonSlotMetrics {
  opacity: number;
  translateX: number;
  translateY: number;
  scale: number;
  progress: number;
  isSettled: boolean;
}

export interface ComparisonDividerMetrics {
  scale: number;
  opacity: number;
  progress: number;
  isSettled: boolean;
}

export interface ComparisonSceneKinematics {
  title: ComparisonSlotMetrics;
  subtitle: ComparisonSlotMetrics;
  description: ComparisonSlotMetrics;
  leftPanel: ComparisonSlotMetrics;
  rightPanel: ComparisonSlotMetrics;
  divider: ComparisonDividerMetrics;
  leftHighlightPulse: number;
  rightHighlightPulse: number;
}

export interface ComparisonSceneKinematicsOptions {
  frame: number;
  delay?: number;
  staggerDelay?: number;
  animation?: ComparisonSceneAnimationConfig;
  layout?: ComparisonSceneLayout;
}

/**
 * Calculates deterministic kinematics for comparison title, left/right panels, divider line, and highlight pulses.
 */
export function calculateComparisonSceneKinematics(
  options: ComparisonSceneKinematicsOptions,
): ComparisonSceneKinematics {
  const {
    frame,
    delay = 0,
    staggerDelay: globalStagger = 6,
    animation,
    layout = 'side-by-side',
  } = options;

  const config = animation ?? {};
  const stagger = config.staggerDelay ?? globalStagger;
  const sequential = config.sequentialReveal !== false;
  const panelDuration = config.panelDuration ?? 20;
  const panelAnim = config.panelAnimation ?? 'slide-opposite';
  const highlightSide = config.highlightSide ?? 'none';

  const titleStart = delay;
  const subtitleStart = delay + 4;
  const descStart = delay + 8;
  const leftStart = delay + stagger;
  const rightStart = sequential ? delay + stagger * 2 : leftStart;
  const dividerStart = delay + (config.dividerDelay ?? 4);

  const computeText = (startFrame: number, duration = 16, dist = 20): ComparisonSlotMetrics => {
    if (frame < startFrame) {
      return { opacity: 0, translateX: 0, translateY: dist, scale: 1, progress: 0, isSettled: false };
    }
    const raw = clamp((frame - startFrame) / duration, 0, 1);
    const prog = easeOut(raw);
    return {
      opacity: prog,
      translateX: 0,
      translateY: dist * (1 - prog),
      scale: 1,
      progress: prog,
      isSettled: raw >= 1,
    };
  };

  const computePanel = (
    startFrame: number,
    side: 'left' | 'right',
  ): ComparisonSlotMetrics => {
    if (panelAnim === 'none') {
      return { opacity: 1, translateX: 0, translateY: 0, scale: 1, progress: 1, isSettled: true };
    }

    if (frame < startFrame) {
      const initX =
        panelAnim === 'slide-opposite'
          ? (side === 'left' ? -60 : 60)
          : 0;
      const initY =
        layout === 'top-and-bottom' && panelAnim === 'slide-opposite'
          ? (side === 'left' ? -40 : 40)
          : panelAnim === 'slide-up'
            ? 40
            : 0;
      return {
        opacity: 0,
        translateX: initX,
        translateY: initY,
        scale: panelAnim === 'scale' ? 0.8 : 1,
        progress: 0,
        isSettled: false,
      };
    }

    const raw = clamp((frame - startFrame) / panelDuration, 0, 1);
    const prog = easeOut(raw);
    const transX =
      panelAnim === 'slide-opposite'
        ? (side === 'left' ? -60 : 60) * (1 - prog)
        : 0;
    const transY =
      layout === 'top-and-bottom' && panelAnim === 'slide-opposite'
        ? (side === 'left' ? -40 : 40) * (1 - prog)
        : panelAnim === 'slide-up'
          ? 40 * (1 - prog)
          : 0;
    const scl = panelAnim === 'scale' ? 0.8 + 0.2 * prog : 1;

    return {
      opacity: prog,
      translateX: transX,
      translateY: transY,
      scale: scl,
      progress: prog,
      isSettled: raw >= 1,
    };
  };

  // Divider line reveal
  let divScale = 1;
  let divOpacity = 1;
  let divProgress = 1;
  let divSettled = true;

  if (config.dividerReveal !== false) {
    if (frame < dividerStart) {
      divScale = 0;
      divOpacity = 0;
      divProgress = 0;
      divSettled = false;
    } else {
      const raw = clamp((frame - dividerStart) / 18, 0, 1);
      divProgress = easeOut(raw);
      divScale = divProgress;
      divOpacity = divProgress;
      divSettled = raw >= 1;
    }
  }

  // Highlight pulse sine waves
  const leftHighlightPulse =
    highlightSide === 'left' ? 1 + Math.sin(frame * 0.08) * 0.02 : 1;
  const rightHighlightPulse =
    highlightSide === 'right' ? 1 + Math.sin(frame * 0.08) * 0.02 : 1;

  return {
    title: computeText(titleStart, 16, 20),
    subtitle: computeText(subtitleStart, 16, 16),
    description: computeText(descStart, 16, 14),
    leftPanel: computePanel(leftStart, 'left'),
    rightPanel: computePanel(rightStart, 'right'),
    divider: {
      scale: divScale,
      opacity: divOpacity,
      progress: divProgress,
      isSettled: divSettled,
    },
    leftHighlightPulse,
    rightHighlightPulse,
  };
}

export interface ComparisonResolvedLayout {
  containerStyle: React.CSSProperties;
  headerStyle: React.CSSProperties;
  panelsContainerStyle: React.CSSProperties;
  leftPanelStyle: React.CSSProperties;
  rightPanelStyle: React.CSSProperties;
  dividerStyle: React.CSSProperties;
  isVertical: boolean;
}

/**
 * Resolves CSS layout styles for the 6 ComparisonScene layouts.
 */
export function resolveComparisonSceneLayout(
  layout: ComparisonSceneLayout = 'side-by-side',
  dividerConfig?: boolean | ComparisonDividerConfig,
): ComparisonResolvedLayout {
  const dividerThickness = typeof dividerConfig === 'object' ? (dividerConfig.thickness ?? 2) : 2;
  const dividerColor = typeof dividerConfig === 'object' ? (dividerConfig.color ?? 'rgba(255,255,255,0.15)') : 'rgba(255,255,255,0.15)';

  switch (layout) {
    case 'top-and-bottom':
      return {
        containerStyle: {
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
        },
        headerStyle: { textAlign: 'center', maxWidth: 800 },
        panelsContainerStyle: {
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          width: '100%',
          position: 'relative',
          gap: 24,
        },
        leftPanelStyle: { flex: 1, width: '100%', position: 'relative' },
        rightPanelStyle: { flex: 1, width: '100%', position: 'relative' },
        dividerStyle: {
          width: '100%',
          height: dividerThickness,
          backgroundColor: dividerColor,
          margin: '0 auto',
        },
        isVertical: true,
      };

    case 'before-and-after':
      return {
        containerStyle: {
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
        },
        headerStyle: { textAlign: 'center', maxWidth: 900 },
        panelsContainerStyle: {
          display: 'flex',
          flexDirection: 'row',
          flex: 1,
          width: '100%',
          position: 'relative',
          gap: 32,
        },
        leftPanelStyle: {
          flex: 1,
          position: 'relative',
          borderRadius: 16,
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          overflow: 'hidden',
        },
        rightPanelStyle: {
          flex: 1,
          position: 'relative',
          borderRadius: 16,
          backgroundColor: 'rgba(6, 182, 212, 0.04)',
          border: '1px solid rgba(6, 182, 212, 0.35)',
          overflow: 'hidden',
          boxShadow: '0 0 30px rgba(6, 182, 212, 0.12)',
        },
        dividerStyle: {
          width: dividerThickness,
          height: '100%',
          backgroundColor: dividerColor,
        },
        isVertical: false,
      };

    case 'left-and-right':
      return {
        containerStyle: {
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          gap: 24,
        },
        headerStyle: { textAlign: 'left', maxWidth: 800 },
        panelsContainerStyle: {
          display: 'flex',
          flexDirection: 'row',
          flex: 1,
          width: '100%',
          position: 'relative',
          gap: 40,
        },
        leftPanelStyle: { flex: 1.2, position: 'relative' },
        rightPanelStyle: { flex: 0.9, position: 'relative' },
        dividerStyle: {
          width: dividerThickness,
          height: '100%',
          backgroundColor: dividerColor,
        },
        isVertical: false,
      };

    case 'split-screen':
      return {
        containerStyle: {
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
        },
        headerStyle: { position: 'absolute', top: 32, left: '50%', transform: 'translateX(-50%)', zIndex: 10, textAlign: 'center' },
        panelsContainerStyle: {
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          height: '100%',
          position: 'relative',
        },
        leftPanelStyle: { flex: 1, height: '100%', position: 'relative' },
        rightPanelStyle: { flex: 1, height: '100%', position: 'relative' },
        dividerStyle: {
          width: dividerThickness,
          height: '100%',
          backgroundColor: dividerColor,
        },
        isVertical: false,
      };

    case 'custom':
      return {
        containerStyle: { display: 'flex', width: '100%', height: '100%' },
        headerStyle: {},
        panelsContainerStyle: { display: 'flex', flex: 1, position: 'relative' },
        leftPanelStyle: { position: 'relative' },
        rightPanelStyle: { position: 'relative' },
        dividerStyle: { backgroundColor: dividerColor },
        isVertical: false,
      };

    case 'side-by-side':
    default:
      return {
        containerStyle: {
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 28,
        },
        headerStyle: { textAlign: 'center', maxWidth: 900 },
        panelsContainerStyle: {
          display: 'flex',
          flexDirection: 'row',
          flex: 1,
          width: '100%',
          position: 'relative',
          gap: 36,
        },
        leftPanelStyle: { flex: 1, position: 'relative' },
        rightPanelStyle: { flex: 1, position: 'relative' },
        dividerStyle: {
          width: dividerThickness,
          height: '100%',
          backgroundColor: dividerColor,
        },
        isVertical: false,
      };
  }
}
