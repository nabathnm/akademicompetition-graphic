/**
 * Spacing and Layout Tokens
 * Built on an 8-point geometric grid with 4px micro-increments.
 * Includes video-specific safe areas and layout offsets for 1920x1080 canvas.
 */

export const Spacing = {
  // Base 8-point scale (with 4px micro steps)
  scale: {
    none: 0,
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
    huge: 96,
    giant: 128,
  },

  // Border Radius Scale
  radius: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    full: 9999,
  },

  // Video Canvas Bounds (Safe title & action zones for 1920x1080)
  canvas: {
    width: 1920,
    height: 1080,
    actionSafePadding: 64,  // 3.3% margin
    titleSafePadding: 96,   // 5% margin
    gutter: 32,
    maxContentWidth: 1440,
  },

  // Component Layout Offsets
  layout: {
    cardPadding: 28,
    cardGap: 24,
    sectionGap: 64,
    headerHeight: 88,
    sidebarWidth: 320,
  },

  // Z-Index Elevation Hierarchy
  zIndex: {
    background: 0,
    ambientDecor: 10,
    content: 20,
    card: 30,
    floatingUI: 40,
    overlay: 50,
    modalOrInspect: 60,
    debugHUD: 100,
  },
} as const;

export type SpacingSystem = typeof Spacing;
