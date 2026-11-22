/**
 * BrowserWindowMockup Component
 * Polished, generic desktop browser window mockup container for Remotion motion graphics.
 * Displays websites, landing pages, dashboards, and custom web applications inside a realistic
 * browser frame with configurable chrome (tabs, navigation, URL bar), deterministic scroll kinematics,
 * and Remotion entrance and reveal transitions.
 * Layer 2 / Layer 3 of the Motion Graphics Framework.
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Lock,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Plus,
  Star,
  Share2,
  MoreHorizontal,
} from 'lucide-react';
import type { BrowserTab, BrowserWindowMockupProps } from './types.ts';
import {
  calculateDeviceMotion,
  resolveDeviceFrameAnimationConfig,
  resolveDeviceShadow,
} from './deviceFrameStyle.ts';
import { calculateContinuousFloating } from './smartphoneMockupStyle.ts';
import {
  calculateChromeRevealState,
  calculateScrollMetrics,
  calculateViewportRevealState,
  resolveBrowserDimensions,
  resolveBrowserThemeColors,
} from './browserWindowMockupStyle.ts';

const BrowserWindowMockupBase: React.FC<BrowserWindowMockupProps> = ({
  width = 800,
  height = 520,
  variant = 'full',
  theme = 'dark',
  themeColors,
  title = 'Untitled Document',
  url = 'https://acme.io',
  tabs,
  activeTabId,
  showToolbar = true,
  showTabs = true,
  showAddressBar = true,
  showWindowControls = true,
  windowControlsStyle = 'traffic-lights',
  showNavigationButtons,
  showToolbarIcons,
  borderRadius = 14,
  borderWidth = 1,
  borderColor,
  shadow = 'medium',
  shadowColor,
  showScrollbar = true,
  scrollProgress,
  contentHeight = 1200,
  children,
  screenContent,
  animation = 'spring',
  animate = true,
  delay = 0,
  durationInFrames = 25,
  slideDirection = 'up',
  easing,
  springPreset = 'snappy',
  floating = false,
  chromeReveal = false,
  viewportReveal = false,
  exitFrame,
  exitDurationInFrames = 15,
  exitAnimation = 'fade-out',
  style,
  viewportStyle,
  className,
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Resolve theme palette (memoized across frames)
  const colors = React.useMemo(() => {
    return resolveBrowserThemeColors(theme, themeColors);
  }, [theme, themeColors]);
  const resolvedBorderColor = borderColor ?? colors.borderColor;

  // 2. Resolve geometry & viewport dimensions (memoized across frames)
  const dims = React.useMemo(() => {
    return resolveBrowserDimensions({
      width,
      height,
      variant,
      showToolbar,
      showTabs,
      borderRadius,
      borderWidth,
    });
  }, [width, height, variant, showToolbar, showTabs, borderRadius, borderWidth]);

  // 3. Resolve entrance & exit kinetics (memoized across frames)
  const animConfig = React.useMemo(() => {
    return resolveDeviceFrameAnimationConfig({
      animation,
      animate,
      delay,
      durationInFrames,
      slideDirection,
      easing,
      springPreset,
    });
  }, [animation, animate, delay, durationInFrames, slideDirection, easing, springPreset]);

  const motion = calculateDeviceMotion({
    currentFrame,
    fps,
    config: animConfig,
    exitFrame,
    exitDurationInFrames,
    exitAnimation,
  });

  // 4. Resolve continuous floating motion
  const floatY = calculateContinuousFloating({
    currentFrame,
    fps,
    config: floating,
    delay,
  });

  // 5. Resolve reveals & scrolling
  const chromeRevealState = calculateChromeRevealState({
    currentFrame,
    config: chromeReveal,
  });

  const viewportRevealState = calculateViewportRevealState({
    currentFrame,
    config: viewportReveal,
  });

  const scroll = calculateScrollMetrics({
    currentFrame,
    scrollProgress,
    viewportHeight: dims.viewportHeight,
    contentHeight,
  });

  const resolvedShadow = resolveDeviceShadow(shadow, shadowColor);

  // 6. Navigation & toolbar icons defaults based on variant
  const hasNavButtons = showNavigationButtons ?? (variant === 'full');
  const hasToolbarIcons = showToolbarIcons ?? (variant === 'full');

  // 7. Resolve tabs
  const resolvedTabs: BrowserTab[] = React.useMemo(() => {
    if (tabs && tabs.length > 0) return tabs;
    return [{ id: 'tab-1', title, active: true }];
  }, [tabs, title]);

  if (motion.hasExited) {
    return null;
  }

  // Window control buttons
  const renderWindowControls = () => {
    if (!showWindowControls) return null;

    let dotColors = ['#ff5f57', '#febc2e', '#28c840'];
    if (windowControlsStyle === 'monochrome') {
      dotColors = ['#64748b', '#475569', '#334155'];
    } else if (windowControlsStyle === 'subtle') {
      const c = theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';
      dotColors = [c, c, c];
    }

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, paddingLeft: 4 }}>
        {dotColors.map((color, idx) => (
          <div
            key={idx}
            style={{
              width: 11,
              height: 11,
              borderRadius: '50%',
              backgroundColor: color,
              boxShadow: 'inset 0 0 1px rgba(0, 0, 0, 0.25)',
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: dims.width,
        height: dims.height,
        opacity: motion.opacity,
        transform: `translate3d(${motion.translateX}px, ${motion.translateY + floatY}px, 0) scale(${motion.scaleX}, ${motion.scaleY}) rotate(${motion.rotation}deg)`,
        transformOrigin: 'center center',
        willChange: 'transform, opacity',
        ...style,
      }}
    >
      {/* Outer Browser Window Frame */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          backgroundColor: colors.windowBg,
          borderRadius: dims.borderRadius,
          border: dims.borderWidth > 0 ? `${dims.borderWidth}px solid ${resolvedBorderColor}` : undefined,
          boxShadow: resolvedShadow,
          boxSizing: 'border-box',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Subtle Outer Bezel Edge Highlight */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: dims.borderRadius,
            boxShadow:
              theme === 'dark'
                ? 'inset 0 1px 1px rgba(255, 255, 255, 0.12)'
                : 'inset 0 1px 1px rgba(255, 255, 255, 0.6)',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        />

        {/* ------------------------------------------------------------- */}
        {/* TOP BROWSER CHROME (Tabs & Toolbar)                           */}
        {/* ------------------------------------------------------------- */}
        <div
          style={{
            opacity: chromeRevealState.opacity,
            transform: `translate3d(0, ${chromeRevealState.translateY}px, 0)`,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 5,
          }}
        >
          {/* A. Minimal Browser Header (Single 40px row) */}
          {variant === 'minimal' && showToolbar && (
            <div
              style={{
                height: 40,
                backgroundColor: colors.toolbarBg,
                borderBottom: `1px solid ${resolvedBorderColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 14px',
                gap: 12,
                boxSizing: 'border-box',
              }}
            >
              {/* Left: Window Controls */}
              <div style={{ display: 'flex', alignItems: 'center', minWidth: 60 }}>
                {renderWindowControls()}
              </div>

              {/* Center: Address Bar or Window Title */}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center', maxWidth: 460 }}>
                {showAddressBar ? (
                  <div
                    style={{
                      width: '100%',
                      height: 26,
                      backgroundColor: colors.addressBarBg,
                      border: `1px solid ${colors.addressBarBorder}`,
                      borderRadius: 6,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      padding: '0 10px',
                      fontSize: 11,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                      color: colors.addressBarText,
                    }}
                  >
                    <Lock size={11} color={colors.addressBarIcon} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {url}
                    </span>
                  </div>
                ) : (
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: colors.tabActiveText,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {title}
                  </span>
                )}
              </div>

              {/* Right Spacer */}
              <div style={{ minWidth: 60 }} />
            </div>
          )}

          {/* B. Full Browser Header: Row 1 - Tab Bar (36px) */}
          {variant === 'full' && showTabs && (
            <div
              style={{
                height: 36,
                backgroundColor: colors.tabBarBg,
                display: 'flex',
                alignItems: 'center',
                padding: '0 12px',
                gap: 12,
                borderBottom: `1px solid ${resolvedBorderColor}`,
                boxSizing: 'border-box',
              }}
            >
              {/* Window Controls */}
              {renderWindowControls()}

              {/* Tabs Strip */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: 4,
                  height: '100%',
                  overflow: 'hidden',
                  flex: 1,
                  paddingTop: 4,
                }}
              >
                {resolvedTabs.map((tab) => {
                  const isActive = activeTabId !== undefined ? tab.id === activeTabId : (tab.active ?? false);

                  return (
                    <div
                      key={tab.id}
                      style={{
                        height: 28,
                        padding: '0 12px',
                        backgroundColor: isActive ? colors.tabActiveBg : colors.tabInactiveBg,
                        borderTopLeftRadius: 7,
                        borderTopRightRadius: 7,
                        border: isActive ? `1px solid ${resolvedBorderColor}` : '1px solid transparent',
                        borderBottom: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        fontSize: 11,
                        color: isActive ? colors.tabActiveText : colors.tabInactiveText,
                        fontWeight: isActive ? 600 : 400,
                        maxWidth: 180,
                        minWidth: 100,
                        cursor: 'default',
                        userSelect: 'none',
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: tab.faviconColor ?? (isActive ? '#276ef1' : colors.addressBarIcon),
                        }}
                      />
                      <span
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          flex: 1,
                        }}
                      >
                        {tab.title}
                      </span>
                    </div>
                  );
                })}

                {/* New Tab Button */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 22,
                    height: 22,
                    borderRadius: 4,
                    color: colors.tabInactiveText,
                    marginBottom: 2,
                  }}
                >
                  <Plus size={13} />
                </div>
              </div>
            </div>
          )}

          {/* C. Full Browser Header: Row 2 - Toolbar (42px) */}
          {variant === 'full' && showToolbar && (
            <div
              style={{
                height: 42,
                backgroundColor: colors.toolbarBg,
                borderBottom: `1px solid ${resolvedBorderColor}`,
                display: 'flex',
                alignItems: 'center',
                padding: '0 14px',
                gap: 12,
                boxSizing: 'border-box',
              }}
            >
              {/* Navigation Controls: Back, Forward, Reload */}
              {hasNavButtons && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: colors.addressBarIcon }}>
                  <ArrowLeft size={15} style={{ opacity: 0.6 }} />
                  <ArrowRight size={15} style={{ opacity: 0.4 }} />
                  <RotateCw size={14} style={{ opacity: 0.75 }} />
                </div>
              )}

              {/* URL Address Bar */}
              {showAddressBar && (
                <div
                  style={{
                    flex: 1,
                    height: 28,
                    backgroundColor: colors.addressBarBg,
                    border: `1px solid ${colors.addressBarBorder}`,
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 10px',
                    fontSize: 11,
                    color: colors.addressBarText,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden', flex: 1 }}>
                    <Lock size={12} color={colors.addressBarIcon} />
                    <span
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontWeight: 400,
                      }}
                    >
                      {url}
                    </span>
                  </div>

                  <RotateCw size={12} color={colors.addressBarIcon} style={{ opacity: 0.65 }} />
                </div>
              )}

              {/* Toolbar Action Icons */}
              {hasToolbarIcons && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: colors.addressBarIcon }}>
                  <Star size={14} style={{ opacity: 0.7 }} />
                  <Share2 size={14} style={{ opacity: 0.7 }} />
                  <MoreHorizontal size={15} style={{ opacity: 0.7 }} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* MAIN WEB VIEWPORT                                             */}
        {/* ------------------------------------------------------------- */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: dims.viewportHeight,
            backgroundColor: colors.viewportBg,
            overflow: 'hidden',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            ...viewportStyle,
          }}
        >
          {/* Scrollable Viewport Content Layer */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              minHeight: '100%',
              opacity: viewportRevealState.opacity,
              transform: `translate3d(0, ${scroll.scrollY + viewportRevealState.translateY}px, 0) scale(${viewportRevealState.scale})`,
              transformOrigin: 'top center',
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box',
            }}
          >
            {children ?? screenContent}
          </div>

          {/* Simulated Determinate Vertical Scrollbar */}
          {showScrollbar && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                width: 8,
                backgroundColor: colors.scrollbarTrack,
                pointerEvents: 'none',
                zIndex: 20,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  right: 1.5,
                  top: scroll.thumbTop,
                  width: 5,
                  height: scroll.thumbHeight,
                  backgroundColor: colors.scrollbarThumb,
                  borderRadius: 3,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const BrowserWindowMockup = React.memo(BrowserWindowMockupBase);
