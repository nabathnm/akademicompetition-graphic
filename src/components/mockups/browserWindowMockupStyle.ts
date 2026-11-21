/**
 * BrowserWindowMockup Style & Motion Calculations
 * Pure mathematical functions for browser dimension layout, viewport calculation,
 * color theme resolution, deterministic frame-based scroll kinematics, and chrome/viewport reveals.
 * Layer 2 / Layer 3 of the Motion Graphics Framework.
 */

import type {
  BrowserChromeRevealConfig,
  BrowserScrollConfig,
  BrowserTheme,
  BrowserThemeColors,
  BrowserVariant,
  BrowserViewportRevealConfig,
  BrowserWindowMockupProps,
} from './types.ts';
import { clamp } from '../../utils/animation/clamp.ts';
import { resolveEasing, easeOutCubic } from '../../utils/animation/easing.ts';

export const BROWSER_THEME_PALETTES: Record<BrowserTheme, BrowserThemeColors> = {
  dark: {
    windowBg: '#131823',
    toolbarBg: '#1a202c',
    tabBarBg: '#131823',
    tabActiveBg: '#1a202c',
    tabInactiveBg: 'transparent',
    tabActiveText: '#f1f5f9',
    tabInactiveText: '#94a3b8',
    addressBarBg: '#10141d',
    addressBarBorder: 'rgba(255, 255, 255, 0.1)',
    addressBarText: '#cbd5e1',
    addressBarIcon: '#64748b',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    viewportBg: '#0b0f17',
    scrollbarTrack: 'rgba(255, 255, 255, 0.04)',
    scrollbarThumb: 'rgba(255, 255, 255, 0.25)',
  },
  light: {
    windowBg: '#e2e8f0',
    toolbarBg: '#f8fafc',
    tabBarBg: '#e2e8f0',
    tabActiveBg: '#f8fafc',
    tabInactiveBg: 'transparent',
    tabActiveText: '#0f172a',
    tabInactiveText: '#64748b',
    addressBarBg: '#ffffff',
    addressBarBorder: 'rgba(0, 0, 0, 0.12)',
    addressBarText: '#334155',
    addressBarIcon: '#94a3b8',
    borderColor: 'rgba(0, 0, 0, 0.12)',
    viewportBg: '#ffffff',
    scrollbarTrack: 'rgba(0, 0, 0, 0.04)',
    scrollbarThumb: 'rgba(0, 0, 0, 0.25)',
  },
};

/**
 * Resolves complete theme colors with user overrides.
 */
export function resolveBrowserThemeColors(
  theme: BrowserTheme = 'dark',
  overrides?: Partial<BrowserThemeColors>
): BrowserThemeColors {
  const base = BROWSER_THEME_PALETTES[theme] ?? BROWSER_THEME_PALETTES.dark;
  if (!overrides) {
    return base;
  }
  return {
    ...base,
    ...overrides,
  };
}

/**
 * Computes top browser chrome height depending on variant and active rows.
 */
export function calculateBrowserChromeHeight(
  variant: BrowserVariant = 'full',
  showToolbar = true,
  showTabs = true
): number {
  if (variant === 'minimal') {
    return showToolbar ? 40 : 0;
  }

  // Full browser variant
  const tabsHeight = showTabs ? 36 : 0;
  const toolbarHeight = showToolbar ? 42 : 0;
  return tabsHeight + toolbarHeight;
}

export interface BrowserWindowDimensions {
  width: number;
  height: number;
  chromeHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  borderRadius: number;
  borderWidth: number;
}

/**
 * Resolves outer window dimensions and inner web viewport bounding box.
 */
export function resolveBrowserDimensions(
  props: Partial<BrowserWindowMockupProps> = {}
): BrowserWindowDimensions {
  const width = Math.max(280, props.width ?? 800);
  const height = Math.max(160, props.height ?? 520);
  const borderWidth = Math.max(0, props.borderWidth ?? 1);
  const borderRadius = Math.max(0, props.borderRadius ?? 14);

  const variant = props.variant ?? 'full';
  const showToolbar = props.showToolbar ?? true;
  const showTabs = props.showTabs ?? (variant === 'full');

  const chromeHeight = calculateBrowserChromeHeight(variant, showToolbar, showTabs);
  const viewportWidth = Math.max(0, width - borderWidth * 2);
  const viewportHeight = Math.max(0, height - chromeHeight - borderWidth * 2);

  return {
    width,
    height,
    chromeHeight,
    viewportWidth,
    viewportHeight,
    borderRadius,
    borderWidth,
  };
}

export interface BrowserScrollMetrics {
  progress: number;
  scrollY: number;
  thumbHeight: number;
  thumbTop: number;
  maxScroll: number;
  isScrolling: boolean;
}

/**
 * Computes deterministic frame-accurate vertical scroll offset and scrollbar thumb geometry.
 */
export function calculateScrollMetrics(params: {
  currentFrame: number;
  scrollProgress?: number | BrowserScrollConfig;
  viewportHeight: number;
  contentHeight?: number;
}): BrowserScrollMetrics {
  const { currentFrame, scrollProgress, viewportHeight } = params;

  const rawContentHeight =
    params.contentHeight ??
    (typeof scrollProgress === 'object' && scrollProgress !== null
      ? scrollProgress.contentHeight
      : undefined);
  const contentHeight = Math.max(viewportHeight, rawContentHeight ?? 1200);
  const maxScroll = Math.max(0, contentHeight - viewportHeight);

  if (scrollProgress === undefined || scrollProgress === null) {
    const thumbHeight = Math.max(24, Math.round((viewportHeight / contentHeight) * viewportHeight));
    return {
      progress: 0,
      scrollY: 0,
      thumbHeight,
      thumbTop: 0,
      maxScroll,
      isScrolling: false,
    };
  }

  let progress = 0;
  let isScrolling = false;

  if (typeof scrollProgress === 'number') {
    progress = scrollProgress <= 1 ? clamp(scrollProgress, 0, 1) : clamp(scrollProgress / 100, 0, 1);
  } else {
    const startFrame = scrollProgress.startFrame ?? 25;
    const duration = Math.max(1, scrollProgress.duration ?? 45);
    const from = scrollProgress.from ?? 0;
    const to = scrollProgress.to ?? 100;
    const fromPct = from <= 1 ? from : from / 100;
    const toPct = to <= 1 ? to : to / 100;

    const easeFn = resolveEasing(scrollProgress.easing) ?? easeOutCubic;

    if (currentFrame < startFrame) {
      progress = clamp(fromPct, 0, 1);
    } else if (currentFrame >= startFrame + duration) {
      progress = clamp(toPct, 0, 1);
    } else {
      const t = (currentFrame - startFrame) / duration;
      const eased = easeFn(t);
      progress = clamp(fromPct + eased * (toPct - fromPct), 0, 1);
      isScrolling = true;
    }
  }

  const rawScrollY = Math.round(-progress * maxScroll * 1000) / 1000;
  const scrollY = Math.abs(rawScrollY) < 1e-6 ? 0 : rawScrollY;
  const thumbHeight = Math.max(24, Math.round((viewportHeight / contentHeight) * viewportHeight));
  const thumbTop = Math.round(progress * (viewportHeight - thumbHeight));

  return {
    progress,
    scrollY,
    thumbHeight,
    thumbTop,
    maxScroll,
    isScrolling,
  };
}

export interface ChromeRevealState {
  opacity: number;
  translateY: number;
  isRevealing: boolean;
}

/**
 * Calculates top browser chrome reveal animation.
 */
export function calculateChromeRevealState(params: {
  currentFrame: number;
  config?: boolean | BrowserChromeRevealConfig;
}): ChromeRevealState {
  const { currentFrame, config } = params;

  if (!config) {
    return { opacity: 1, translateY: 0, isRevealing: false };
  }

  const delay = typeof config === 'object' && config.delay !== undefined ? config.delay : 0;
  const duration = typeof config === 'object' && config.duration !== undefined ? Math.max(1, config.duration) : 15;

  if (currentFrame < delay) {
    return { opacity: 0, translateY: -12, isRevealing: false };
  }

  const elapsed = currentFrame - delay;
  const rawProgress = clamp(elapsed / duration, 0, 1);
  const eased = easeOutCubic(rawProgress);
  const rawTranslateY = Math.round(-12 * (1 - eased) * 100) / 100;
  const translateY = Math.abs(rawTranslateY) < 1e-6 ? 0 : rawTranslateY;

  return {
    opacity: eased,
    translateY,
    isRevealing: rawProgress < 1,
  };
}

export interface ViewportRevealState {
  opacity: number;
  translateY: number;
  scale: number;
  isRevealing: boolean;
}

/**
 * Calculates web viewport content reveal transition following window entrance.
 */
export function calculateViewportRevealState(params: {
  currentFrame: number;
  config?: boolean | BrowserViewportRevealConfig;
}): ViewportRevealState {
  const { currentFrame, config } = params;

  if (!config) {
    return { opacity: 1, translateY: 0, scale: 1, isRevealing: false };
  }

  const delay = typeof config === 'object' && config.delay !== undefined ? config.delay : 12;
  const duration = typeof config === 'object' && config.duration !== undefined ? Math.max(1, config.duration) : 16;
  const type = typeof config === 'object' && config.type !== undefined ? config.type : 'fade';

  if (currentFrame < delay) {
    return {
      opacity: 0,
      translateY: type === 'wipe-up' ? 20 : 0,
      scale: type === 'scale' ? 0.96 : 1,
      isRevealing: false,
    };
  }

  const elapsed = currentFrame - delay;
  const rawProgress = clamp(elapsed / duration, 0, 1);
  const eased = easeOutCubic(rawProgress);

  let translateY = 0;
  let scale = 1;

  if (type === 'wipe-up') {
    translateY = 20 * (1 - eased);
  } else if (type === 'scale') {
    scale = 0.96 + 0.04 * eased;
  }

  const rawTranslateY = Math.round(translateY * 100) / 100;
  const cleanTranslateY = Math.abs(rawTranslateY) < 1e-6 ? 0 : rawTranslateY;

  return {
    opacity: eased,
    translateY: cleanTranslateY,
    scale: Math.round(scale * 1000) / 1000,
    isRevealing: rawProgress < 1,
  };
}
