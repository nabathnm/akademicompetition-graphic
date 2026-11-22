/**
 * TransitionController Component
 * Centralized, frame-accurate Remotion transition orchestrator connecting
 * the Transition Library with Scene Library, SceneSequence, and AdvertisementComposition.
 *
 * Supports:
 * 1. Adjacent Scene Transitions (crossfade, slide replace, zoom replace, wipe replace, mask replace, split replace, glitch replace)
 * 2. Single Scene Entrance/Exit Envelopes
 * 3. Timing window alignment: 'center', 'lead-in', 'lead-out'
 * 4. Graceful fallbacks and instantaneous cuts when disabled or unsupported
 * 5. Full frame-level determinism with useCurrentFrame()
 *
 * Layer 2 / Layer 3 Bridge of the Motion Graphics Framework.
 */

import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Colors } from '../../styles/colors.ts';
import type { TransitionControllerProps } from './transitionControllerTypes.ts';
import {
  calculateTransitionWindow,
  normalizeTransitionType,
  resolveAdjacentTransition,
  resolveSceneEnvelope,
  validateTransitionConfig,
} from './transitionControllerStyle.ts';
import { FadeTransition } from './FadeTransition.tsx';
import { SlideTransition } from './SlideTransition.tsx';
import { ZoomTransition } from './ZoomTransition.tsx';
import { WipeTransition } from './WipeTransition.tsx';
import { MaskTransition } from './MaskTransition.tsx';
import { SplitTransition } from './SplitTransition.tsx';
import { MorphTransition } from './MorphTransition.tsx';
import { GlitchTransition } from './GlitchTransition.tsx';
import type {
  MaskType,
  SlideDirection,
  SplitDirection,
  WipeDirection,
} from './types.ts';

export const TransitionController: React.FC<TransitionControllerProps> = (props) => {
  const {
    transition,
    fromContent,
    outgoing: outgoingAlias,
    toContent,
    incoming: incomingAlias,
    boundaryFrame = 0,
    sceneDurationInFrames,
    entrance,
    exit,
    currentFrame: frameOverride,
    style,
    className,
    debug = false,
    children,
    ...restConfig
  } = props;

  // Resolve frame (use prop override if passed, otherwise useCurrentFrame)
  const remotionFrame = useCurrentFrame();
  const currentFrame = frameOverride !== undefined ? frameOverride : remotionFrame;

  // Detect mode: Adjacent scenes vs Single scene envelope
  const childrenArray = React.Children.toArray(children);
  const outgoingScene = fromContent ?? outgoingAlias ?? (childrenArray.length >= 2 ? childrenArray[0] : null);
  const incomingScene = toContent ?? incomingAlias ?? (childrenArray.length >= 2 ? childrenArray[1] : null);

  const isAdjacentMode = Boolean(outgoingScene && incomingScene);

  // -------------------------------------------------------------------------
  // MODE 1: ADJACENT SCENE TRANSITIONS
  // -------------------------------------------------------------------------
  if (isAdjacentMode) {
    // Merge transition config from props and object
    const mergedConfig = {
      ...restConfig,
      ...(transition || {}),
    };

    const resolved = resolveAdjacentTransition(mergedConfig);
    const window = calculateTransitionWindow({
      boundaryFrame,
      durationInFrames: resolved.durationInFrames,
      alignment: resolved.alignment,
    });

    const validation = validateTransitionConfig(resolved);

    // Development console warnings
    if (process.env.NODE_ENV !== 'production' && (!validation.isValid || validation.warnings.length > 0)) {
      if (validation.warnings.length > 0) {
        console.warn('[TransitionController] Warning:', validation.warnings.join('; '));
      }
      if (!validation.isValid) {
        console.error('[TransitionController] Error:', validation.errors.join('; '));
      }
    }

    // Direct cut if disabled, duration is zero, or type is 'none' / 'cut'
    if (resolved.disabled || window.durationInFrames <= 0 || resolved.type === 'none' || resolved.type === 'cut') {
      const activeCut = currentFrame < boundaryFrame ? outgoingScene : incomingScene;
      return (
        <div className={className} style={{ width: '100%', height: '100%', position: 'relative', ...style }}>
          {activeCut}
          {debug && (
            <DebugOverlay
              mode="Adjacent (Instant Cut)"
              type="cut"
              currentFrame={currentFrame}
              boundaryFrame={boundaryFrame}
              window={window}
            />
          )}
        </div>
      );
    }

    const phase = window.getTransitionPhase(currentFrame);

    // Before transition window: render outgoing scene cleanly
    if (phase === 'before') {
      return (
        <div className={className} style={{ width: '100%', height: '100%', position: 'relative', ...style }}>
          {outgoingScene}
          {debug && (
            <DebugOverlay
              mode="Adjacent (Pre-Transition)"
              type={resolved.type}
              currentFrame={currentFrame}
              boundaryFrame={boundaryFrame}
              window={window}
            />
          )}
        </div>
      );
    }

    // After transition window: render incoming scene cleanly
    if (phase === 'after') {
      return (
        <div className={className} style={{ width: '100%', height: '100%', position: 'relative', ...style }}>
          {incomingScene}
          {debug && (
            <DebugOverlay
              mode="Adjacent (Post-Transition)"
              type={resolved.type}
              currentFrame={currentFrame}
              boundaryFrame={boundaryFrame}
              window={window}
            />
          )}
        </div>
      );
    }

    // Within transition window: render coordinated transition component
    let transitionElement: React.ReactNode;

    switch (resolved.type) {
      case 'slide':
        transitionElement = (
          <SlideTransition
            mode="replace"
            direction={(resolved.direction as SlideDirection) || 'left'}
            durationInFrames={window.durationInFrames}
            delay={window.startFrame}
            easing={resolved.easing}
            fade={resolved.fade}
            spring={resolved.spring}
            springPreset={resolved.springPreset}
            overshoot={resolved.overshoot}
            fromContent={outgoingScene}
            toContent={incomingScene}
            style={{ width: '100%', height: '100%' }}
            {...(resolved.customProps || {})}
          />
        );
        break;

      case 'zoom':
        transitionElement = (
          <ZoomTransition
            mode="replace"
            durationInFrames={window.durationInFrames}
            delay={window.startFrame}
            easing={resolved.easing}
            fade={resolved.fade}
            spring={resolved.spring}
            springPreset={resolved.springPreset}
            overshoot={resolved.overshoot}
            fromContent={outgoingScene}
            toContent={incomingScene}
            style={{ width: '100%', height: '100%' }}
            {...(resolved.customProps || {})}
          />
        );
        break;

      case 'wipe':
        transitionElement = (
          <WipeTransition
            mode="replace"
            direction={(resolved.direction as WipeDirection) || 'left-to-right'}
            durationInFrames={window.durationInFrames}
            delay={window.startFrame}
            easing={resolved.easing}
            fade={resolved.fade}
            edgeStyle={resolved.edgeStyle}
            edgeColor={resolved.edgeColor}
            edgeWidth={resolved.edgeWidth}
            fromContent={outgoingScene}
            toContent={incomingScene}
            style={{ width: '100%', height: '100%' }}
            {...(resolved.customProps || {})}
          />
        );
        break;

      case 'mask':
        transitionElement = (
          <MaskTransition
            mode="replace"
            maskType={(resolved.maskType as MaskType) || 'circle'}
            origin={resolved.origin || resolved.maskOrigin || 'center'}
            shape={resolved.shape || 'star'}
            polygonPoints={resolved.polygonPoints}
            pathData={resolved.pathData || resolved.d}
            cornerRadius={resolved.cornerRadius}
            rotation={resolved.rotation}
            scaleMultiplier={resolved.scaleMultiplier}
            durationInFrames={window.durationInFrames}
            delay={window.startFrame}
            easing={resolved.easing}
            fade={resolved.fade}
            fromContent={outgoingScene}
            toContent={incomingScene}
            style={{ width: '100%', height: '100%' }}
            {...(resolved.customProps || {})}
          />
        );
        break;

      case 'split':
        transitionElement = (
          <SplitTransition
            mode="replace"
            splitDirection={(resolved.splitDirection as SplitDirection) || (resolved.direction as SplitDirection) || 'vertical'}
            panelCount={resolved.panelCount}
            rows={resolved.rows}
            cols={resolved.cols}
            movementDirection={resolved.movementDirection || 'outward'}
            distance={resolved.distance || '100%'}
            panelGap={resolved.panelGap}
            staggerDelay={resolved.staggerDelay}
            staggerOrder={resolved.staggerOrder}
            durationInFrames={window.durationInFrames}
            delay={window.startFrame}
            easing={resolved.easing}
            fade={resolved.fade}
            fromContent={outgoingScene}
            toContent={incomingScene}
            style={{ width: '100%', height: '100%' }}
            {...(resolved.customProps || {})}
          />
        );
        break;

      case 'glitch':
        transitionElement = (
          <GlitchTransition
            mode="replace"
            intensity={resolved.intensity ?? 1.0}
            frequency={resolved.frequency ?? 0.6}
            sliceCount={resolved.sliceCount ?? 8}
            rgbOffset={resolved.rgbOffset ?? 12}
            jitter={resolved.jitter ?? 6}
            noise={resolved.noise ?? 0.4}
            seed={resolved.seed ?? 42}
            pixelSize={resolved.pixelSize ?? 4}
            enableRgbSplit={resolved.enableRgbSplit ?? true}
            enableSlices={resolved.enableSlices ?? true}
            enableJitter={resolved.enableJitter ?? true}
            enableNoise={resolved.enableNoise ?? true}
            enableFlicker={resolved.enableFlicker ?? true}
            enableScanlines={resolved.enableScanlines ?? true}
            durationInFrames={window.durationInFrames}
            delay={window.startFrame}
            fromContent={outgoingScene}
            toContent={incomingScene}
            style={{ width: '100%', height: '100%' }}
            {...(resolved.customProps || {})}
          />
        );
        break;

      case 'morph':
        transitionElement = (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <FadeTransition
              mode="crossfade"
              durationInFrames={window.durationInFrames}
              delay={window.startFrame}
              fromContent={outgoingScene}
              toContent={incomingScene}
              style={{ width: '100%', height: '100%' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <MorphTransition
                fromPath={resolved.fromPath || 'M 20 20 H 80 V 80 H 20 Z'}
                toPath={resolved.toPath || 'M 50 15 A 35 35 0 1 0 50 85 A 35 35 0 1 0 50 15'}
                fromFill={resolved.fromFill || Colors.accent.brand}
                toFill={resolved.toFill || Colors.accent.electricViolet}
                fromStroke={resolved.fromStroke}
                toStroke={resolved.toStroke}
                fromStrokeWidth={resolved.fromStrokeWidth}
                toStrokeWidth={resolved.toStrokeWidth}
                durationInFrames={window.durationInFrames}
                delay={window.startFrame}
                easing={resolved.easing}
                {...(resolved.customProps || {})}
              />
            </div>
          </div>
        );
        break;

      case 'fade':
      default:
        transitionElement = (
          <FadeTransition
            mode="crossfade"
            durationInFrames={window.durationInFrames}
            delay={window.startFrame}
            easing={resolved.easing}
            fromContent={outgoingScene}
            toContent={incomingScene}
            style={{ width: '100%', height: '100%' }}
            {...(resolved.customProps || {})}
          />
        );
        break;
    }

    return (
      <div className={className} style={{ width: '100%', height: '100%', position: 'relative', ...style }}>
        {transitionElement}
        {debug && (
          <DebugOverlay
            mode="Adjacent (Active)"
            type={resolved.type}
            currentFrame={currentFrame}
            boundaryFrame={boundaryFrame}
            window={window}
          />
        )}
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // MODE 2: SINGLE SCENE ENVELOPE (ENTRANCE / EXIT)
  // -------------------------------------------------------------------------
  const sceneDuration = sceneDurationInFrames ?? 90;
  const envelope = resolveSceneEnvelope({
    entrance: entrance ?? transition,
    exit,
    sceneDurationInFrames: sceneDuration,
  });

  let wrappedContent: React.ReactNode = childrenArray.length > 0 ? childrenArray[0] : children;

  // Optimized combined fade in-out envelope
  if (envelope.canUseCombinedInOut) {
    wrappedContent = (
      <FadeTransition
        mode="in-out"
        inDuration={envelope.entrance.durationInFrames}
        outDuration={envelope.exit.durationInFrames}
        durationInFrames={sceneDuration}
        easing={envelope.entrance.easing}
        style={{ width: '100%', height: '100%' }}
      >
        {wrappedContent}
      </FadeTransition>
    );
  } else {
    // 1. Entrance Transition Wrap
    if (!envelope.entrance.disabled && (envelope.entrance.durationInFrames ?? 0) > 0) {
      const entDur = envelope.entrance.durationInFrames!;
      const entType = normalizeTransitionType(envelope.entrance.type);

      switch (entType) {
        case 'slide':
          wrappedContent = (
            <SlideTransition
              mode="enter"
              direction={(envelope.entrance.direction as SlideDirection) || 'left'}
              durationInFrames={entDur}
              easing={envelope.entrance.easing}
              fade={envelope.entrance.fade}
              spring={envelope.entrance.spring}
              springPreset={envelope.entrance.springPreset}
              overshoot={envelope.entrance.overshoot}
              style={{ width: '100%', height: '100%' }}
            >
              {wrappedContent}
            </SlideTransition>
          );
          break;

        case 'zoom':
          wrappedContent = (
            <ZoomTransition
              mode="in"
              durationInFrames={entDur}
              easing={envelope.entrance.easing}
              fade={envelope.entrance.fade}
              spring={envelope.entrance.spring}
              springPreset={envelope.entrance.springPreset}
              overshoot={envelope.entrance.overshoot}
              style={{ width: '100%', height: '100%' }}
            >
              {wrappedContent}
            </ZoomTransition>
          );
          break;

        case 'wipe':
          wrappedContent = (
            <WipeTransition
              mode="reveal"
              direction={(envelope.entrance.direction as WipeDirection) || 'left-to-right'}
              durationInFrames={entDur}
              easing={envelope.entrance.easing}
              fade={envelope.entrance.fade}
              edgeStyle={envelope.entrance.edgeStyle}
              edgeColor={envelope.entrance.edgeColor}
              edgeWidth={envelope.entrance.edgeWidth}
              style={{ width: '100%', height: '100%' }}
            >
              {wrappedContent}
            </WipeTransition>
          );
          break;

        case 'mask':
          wrappedContent = (
            <MaskTransition
              mode="reveal"
              maskType={(envelope.entrance.maskType as MaskType) || 'circle'}
              origin={envelope.entrance.origin || 'center'}
              shape={envelope.entrance.shape || 'star'}
              polygonPoints={envelope.entrance.polygonPoints}
              pathData={envelope.entrance.pathData || envelope.entrance.d}
              durationInFrames={entDur}
              easing={envelope.entrance.easing}
              fade={envelope.entrance.fade}
              style={{ width: '100%', height: '100%' }}
            >
              {wrappedContent}
            </MaskTransition>
          );
          break;

        case 'split':
          wrappedContent = (
            <SplitTransition
              mode="enter"
              splitDirection={(envelope.entrance.splitDirection as SplitDirection) || 'vertical'}
              durationInFrames={entDur}
              easing={envelope.entrance.easing}
              fade={envelope.entrance.fade}
              style={{ width: '100%', height: '100%' }}
            >
              {wrappedContent}
            </SplitTransition>
          );
          break;

        case 'glitch':
          wrappedContent = (
            <GlitchTransition
              mode="in"
              durationInFrames={entDur}
              intensity={envelope.entrance.intensity ?? 1.0}
              frequency={envelope.entrance.frequency ?? 0.6}
              style={{ width: '100%', height: '100%' }}
            >
              {wrappedContent}
            </GlitchTransition>
          );
          break;

        case 'fade':
        default:
          wrappedContent = (
            <FadeTransition
              mode="in"
              durationInFrames={entDur}
              easing={envelope.entrance.easing}
              style={{ width: '100%', height: '100%' }}
            >
              {wrappedContent}
            </FadeTransition>
          );
          break;
      }
    }

    // 2. Exit Transition Wrap
    if (!envelope.exit.disabled && (envelope.exit.durationInFrames ?? 0) > 0) {
      const exitDur = envelope.exit.durationInFrames!;
      const exitDelay = Math.max(0, sceneDuration - exitDur);
      const exitType = normalizeTransitionType(envelope.exit.type);

      switch (exitType) {
        case 'slide':
          wrappedContent = (
            <SlideTransition
              mode="exit"
              direction={(envelope.exit.direction as SlideDirection) || 'right'}
              durationInFrames={exitDur}
              delay={exitDelay}
              easing={envelope.exit.easing}
              fade={envelope.exit.fade}
              spring={envelope.exit.spring}
              springPreset={envelope.exit.springPreset}
              overshoot={envelope.exit.overshoot}
              style={{ width: '100%', height: '100%' }}
            >
              {wrappedContent}
            </SlideTransition>
          );
          break;

        case 'zoom':
          wrappedContent = (
            <ZoomTransition
              mode="out"
              durationInFrames={exitDur}
              delay={exitDelay}
              easing={envelope.exit.easing}
              fade={envelope.exit.fade}
              spring={envelope.exit.spring}
              springPreset={envelope.exit.springPreset}
              overshoot={envelope.exit.overshoot}
              style={{ width: '100%', height: '100%' }}
            >
              {wrappedContent}
            </ZoomTransition>
          );
          break;

        case 'wipe':
          wrappedContent = (
            <WipeTransition
              mode="hide"
              direction={(envelope.exit.direction as WipeDirection) || 'left-to-right'}
              durationInFrames={exitDur}
              delay={exitDelay}
              easing={envelope.exit.easing}
              fade={envelope.exit.fade}
              style={{ width: '100%', height: '100%' }}
            >
              {wrappedContent}
            </WipeTransition>
          );
          break;

        case 'mask':
          wrappedContent = (
            <MaskTransition
              mode="hide"
              maskType={(envelope.exit.maskType as MaskType) || 'circle'}
              origin={envelope.exit.origin || 'center'}
              shape={envelope.exit.shape || 'star'}
              polygonPoints={envelope.exit.polygonPoints}
              pathData={envelope.exit.pathData || envelope.exit.d}
              durationInFrames={exitDur}
              delay={exitDelay}
              easing={envelope.exit.easing}
              fade={envelope.exit.fade}
              style={{ width: '100%', height: '100%' }}
            >
              {wrappedContent}
            </MaskTransition>
          );
          break;

        case 'split':
          wrappedContent = (
            <SplitTransition
              mode="exit"
              splitDirection={(envelope.exit.splitDirection as SplitDirection) || 'vertical'}
              durationInFrames={exitDur}
              delay={exitDelay}
              easing={envelope.exit.easing}
              fade={envelope.exit.fade}
              style={{ width: '100%', height: '100%' }}
            >
              {wrappedContent}
            </SplitTransition>
          );
          break;

        case 'glitch':
          wrappedContent = (
            <GlitchTransition
              mode="out"
              durationInFrames={exitDur}
              delay={exitDelay}
              intensity={envelope.exit.intensity ?? 1.0}
              frequency={envelope.exit.frequency ?? 0.6}
              style={{ width: '100%', height: '100%' }}
            >
              {wrappedContent}
            </GlitchTransition>
          );
          break;

        case 'fade':
        default:
          wrappedContent = (
            <FadeTransition
              mode="out"
              durationInFrames={exitDur}
              delay={exitDelay}
              easing={envelope.exit.easing}
              style={{ width: '100%', height: '100%' }}
            >
              {wrappedContent}
            </FadeTransition>
          );
          break;
      }
    }
  }

  return (
    <div className={className} style={{ width: '100%', height: '100%', position: 'relative', ...style }}>
      {wrappedContent}
      {debug && (
        <DebugOverlay
          mode="Single Envelope"
          type={`${envelope.entrance.type}->${envelope.exit.type}`}
          currentFrame={currentFrame}
          boundaryFrame={0}
          window={{
            startFrame: 0,
            endFrame: sceneDuration,
            durationInFrames: sceneDuration,
            alignment: 'center',
            getNormalizedProgress: (f: number) => f / Math.max(1, sceneDuration),
          }}
        />
      )}
    </div>
  );
};

/**
 * Internal Telemetry & Debug HUD Overlay.
 */
interface DebugOverlayProps {
  mode: string;
  type: string;
  currentFrame: number;
  boundaryFrame: number;
  window: {
    startFrame: number;
    endFrame: number;
    durationInFrames: number;
    alignment: string;
    getNormalizedProgress: (frame: number) => number;
  };
}

const DebugOverlay: React.FC<DebugOverlayProps> = ({
  mode,
  type,
  currentFrame,
  boundaryFrame,
  window,
}) => {
  const progress = Math.round(window.getNormalizedProgress(currentFrame) * 100);

  return (
    <div
      style={{
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: 'rgba(15, 23, 42, 0.88)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: 8,
        padding: '10px 14px',
        color: '#F8FAFC',
        fontFamily: 'monospace',
        fontSize: 12,
        lineHeight: 1.5,
        zIndex: 9999,
        pointerEvents: 'none',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.35)',
        minWidth: 200,
      }}
    >
      <div style={{ color: Colors.accent.brand, fontWeight: 700, marginBottom: 4 }}>
        ⚡ TransitionController HUD
      </div>
      <div>Mode: <span style={{ color: '#E2E8F0' }}>{mode}</span></div>
      <div>Type: <span style={{ color: '#38BDF8', fontWeight: 600 }}>{type}</span></div>
      <div>Frame: <span style={{ color: '#FACC15' }}>{currentFrame}</span> (Bnd: {boundaryFrame})</div>
      <div>Window: [{window.startFrame} .. {window.endFrame}] ({window.durationInFrames}f, {window.alignment})</div>
      <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ flex: 1, height: 4, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', backgroundColor: Colors.accent.brand }} />
        </div>
        <span style={{ fontSize: 11, color: '#94A3B8' }}>{progress}%</span>
      </div>
    </div>
  );
};
