/**
 * SceneSequence Component
 * Layer 3 of the Motion Graphics Framework.
 *
 * Provides a declarative timeline orchestrator for arranging multiple Scene Library
 * components into a sequential advertisement timeline without manually calculating
 * frame math, start offsets, delays, or transition wrappers.
 */

import React, { useMemo, useEffect } from 'react';
import { Sequence, useCurrentFrame } from 'remotion';
import type {
  SceneSequenceProps,
  SceneSequenceItemConfig,
  SceneSequenceItemProps,
  ScheduledSceneItem,
  SceneItemRenderProps,
} from './types.ts';
import {
  calculateSequenceSchedule,
  getPrimaryActiveSceneAtFrame,
  resolveSceneTransitions,
  validateSceneSequence,
} from './sceneSequenceStyle.ts';
import { Colors } from '../../styles/colors.ts';
import { Typography } from '../../styles/typography.ts';
import { TransitionController } from '../transitions/TransitionController.tsx';

/**
 * Helper component for declarative JSX child syntax in SceneSequence:
 * <SceneSequence>
 *   <SceneSequenceItem id="s1" durationInFrames={60}><HeroScene ... /></SceneSequenceItem>
 * </SceneSequence>
 */
export const SceneSequenceItem: React.FC<SceneSequenceItemProps> = ({ children }) => {
  return <>{children}</>;
};

// Assign display name for child type inspection
SceneSequenceItem.displayName = 'SceneSequenceItem';

/**
 * SceneSequence Orchestrator
 */
export const SceneSequence: React.FC<SceneSequenceProps> = ({
  scenes: propScenes,
  defaultDelay = 0,
  defaultTransition,
  allowOverlap = false,
  debug = false,
  style,
  className,
  onScheduleCalculated,
  children,
}) => {
  const currentFrame = useCurrentFrame();

  // Extract scenes from props array OR parse from declarative <SceneSequenceItem> children
  const parsedScenes: SceneSequenceItemConfig[] = useMemo(() => {
    if (propScenes && propScenes.length > 0) {
      return propScenes;
    }

    const childScenes: SceneSequenceItemConfig[] = [];

    React.Children.forEach(children, (child, idx) => {
      if (React.isValidElement<SceneSequenceItemProps>(child)) {
        const itemProps = child.props;
        childScenes.push({
          id: itemProps.id || `scene-${idx + 1}`,
          name: itemProps.name,
          durationInFrames: itemProps.durationInFrames || 60,
          startFrame: itemProps.startFrame,
          delayBefore: itemProps.delayBefore,
          delayAfter: itemProps.delayAfter,
          transition: itemProps.transition,
          entranceTransition: itemProps.entranceTransition,
          exitTransition: itemProps.exitTransition,
          allowOverlap: itemProps.allowOverlap,
          props: itemProps.props,
          style: itemProps.style,
          className: itemProps.className,
          component: itemProps.children,
        });
      }
    });

    return childScenes;
  }, [propScenes, children]);

  // Validation
  const validation = useMemo(() => {
    return validateSceneSequence(parsedScenes, {
      defaultDelay,
      allowOverlap,
    });
  }, [parsedScenes, defaultDelay, allowOverlap]);

  // Schedule calculation
  const schedule: ScheduledSceneItem[] = useMemo(() => {
    return calculateSequenceSchedule(parsedScenes, {
      defaultDelay,
      allowOverlap,
    });
  }, [parsedScenes, defaultDelay, allowOverlap]);

  // Notify schedule calculation callback
  useEffect(() => {
    if (onScheduleCalculated && schedule.length > 0) {
      onScheduleCalculated(schedule);
    }
  }, [schedule, onScheduleCalculated]);

  // Development warnings
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      if (!validation.isValid) {
        console.error('[SceneSequence] Configuration Errors:', validation.errors);
      }
      if (validation.warnings.length > 0) {
        console.warn('[SceneSequence] Configuration Warnings:', validation.warnings);
      }
    }
  }, [validation]);

  // Active scene tracking
  const primaryActiveScene = useMemo(() => {
    return getPrimaryActiveSceneAtFrame(schedule, currentFrame);
  }, [schedule, currentFrame]);

  // Total calculated duration
  const totalDuration = useMemo(() => {
    if (schedule.length === 0) return 0;
    return Math.max(...schedule.map((s) => s.computedEndFrame));
  }, [schedule]);

  /**
   * Renders the scene content wrapped in transitions if configured
   */
  const renderSceneWithTransitions = (scene: ScheduledSceneItem) => {
    const { entrance, exit } = resolveSceneTransitions(scene, defaultTransition);

    // Render inner content
    let content: React.ReactNode;
    if (typeof scene.component === 'function') {
      const renderProps: SceneItemRenderProps = {
        frame: Math.max(0, currentFrame - scene.computedStartFrame),
        durationInFrames: scene.durationInFrames,
        sceneId: scene.id,
        isActive: currentFrame >= scene.computedStartFrame && currentFrame < scene.computedEndFrame,
        progress: (currentFrame - scene.computedStartFrame) / Math.max(1, scene.durationInFrames),
        globalFrame: currentFrame,
      };
      content = (scene.component as (props: SceneItemRenderProps) => React.ReactNode)(renderProps);
    } else {
      content = scene.component;
    }

    // Wrap in TransitionController for unified entrance / exit envelopes across all 8 transition types
    const wrappedContent = (
      <TransitionController
        sceneDurationInFrames={scene.durationInFrames}
        entrance={entrance}
        exit={exit}
        style={{ width: '100%', height: '100%' }}
      >
        {content}
      </TransitionController>
    );

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          ...scene.style,
        }}
        className={scene.className}
      >
        {wrappedContent}
      </div>
    );
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        ...style,
      }}
      className={className}
    >
      {/* Sequenced Scenes */}
      {schedule.map((scene) => (
        <Sequence
          key={scene.id}
          from={scene.computedStartFrame}
          durationInFrames={scene.durationInFrames}
          name={scene.name ?? scene.id}
          layout="none"
        >
          {renderSceneWithTransitions(scene)}
        </Sequence>
      ))}

      {/* Visual Debug HUD Overlay */}
      {debug && (
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            right: 12,
            backgroundColor: 'rgba(5, 12, 24, 0.92)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${Colors.border.default}`,
            borderRadius: 8,
            padding: '10px 14px',
            fontFamily: Typography.fontFamily.mono,
            fontSize: 11,
            color: Colors.text.primary,
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            pointerEvents: 'none',
          }}
        >
          {/* Timeline Bar with color-coded scenes */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: 8,
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderRadius: 4,
              overflow: 'hidden',
              display: 'flex',
            }}
          >
            {schedule.map((scene, idx) => {
              const colors = [
                Colors.accent.cyan,
                Colors.accent.electricViolet,
                Colors.accent.brand,
                Colors.accent.emerald,
                '#f59e0b',
                '#ec4899',
              ];
              const sceneColor = colors[idx % colors.length];
              const leftPct = (scene.computedStartFrame / Math.max(1, totalDuration)) * 100;
              const widthPct = (scene.durationInFrames / Math.max(1, totalDuration)) * 100;

              return (
                <div
                  key={`hud-bar-${scene.id}`}
                  style={{
                    position: 'absolute',
                    left: `${leftPct}%`,
                    width: `${widthPct}%`,
                    height: '100%',
                    backgroundColor: sceneColor,
                    opacity: currentFrame >= scene.computedStartFrame && currentFrame < scene.computedEndFrame ? 1 : 0.45,
                    borderRight: '1px solid rgba(0,0,0,0.4)',
                  }}
                  title={`${scene.name ?? scene.id} (${scene.computedStartFrame}f - ${scene.computedEndFrame}f)`}
                />
              );
            })}

            {/* Current Frame Scrubber Indicator */}
            <div
              style={{
                position: 'absolute',
                left: `${(currentFrame / Math.max(1, totalDuration)) * 100}%`,
                top: 0,
                bottom: 0,
                width: 2,
                backgroundColor: '#ffffff',
                boxShadow: '0 0 6px rgba(255,255,255,0.8)',
                zIndex: 10,
              }}
            />
          </div>

          {/* Telemetry info row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: Colors.accent.cyan, fontWeight: 700 }}>
                ● TIMELINE
              </span>
              <span>
                FRAME {currentFrame} / {totalDuration} ({((currentFrame / Math.max(1, totalDuration)) * 100).toFixed(1)}%)
              </span>
              <span>SCENES: {schedule.length}</span>
            </div>

            <div>
              {primaryActiveScene ? (
                <span style={{ color: Colors.accent.emerald, fontWeight: 700 }}>
                  ACTIVE: {primaryActiveScene.name ?? primaryActiveScene.id} [{primaryActiveScene.computedStartFrame}f - {primaryActiveScene.computedEndFrame}f]
                </span>
              ) : (
                <span style={{ color: Colors.text.tertiary }}>
                  GAP / NO ACTIVE SCENE
                </span>
              )}
            </div>
          </div>

          {/* Errors / Warnings */}
          {validation.errors.length > 0 && (
            <div style={{ color: '#ef4444', fontSize: 10 }}>
              ERRORS: {validation.errors.join(' | ')}
            </div>
          )}
          {validation.warnings.length > 0 && (
            <div style={{ color: '#f59e0b', fontSize: 10 }}>
              WARNINGS: {validation.warnings.join(' | ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
