/**
 * Motion Tokens & Configuration
 * Centralized frame-based animation parameters for Remotion.
 * Standardized at 30 FPS base (scales deterministically across any FPS).
 * Built with physics-informed spring configurations and standard cubic-bezier curves.
 */

export const MOTION = {
  // Standard frame durations (calibrated for 30 FPS)
  duration: {
    instant: 5,     // ~0.16s - Quick micro-interactions / state toggles
    fast: 10,       // ~0.33s - Crisp UI transitions, tooltips, tags
    normal: 18,     // ~0.60s - Standard component entrances / card reveals
    slow: 30,       // ~1.00s - Scene transitions, prominent heroes
    deliberate: 48, // ~1.60s - Expressive brand movements, smooth camera pans
    extended: 60,   // ~2.00s - Background ambient loops, grand unfolds
  },

  // Stagger intervals for list / multi-element reveals (in frames)
  stagger: {
    tight: 3,       // Snappy cascading elements
    normal: 6,      // Standard card or word cascades
    relaxed: 10,    // Deliberate, impactful item arrivals
    dramatic: 16,   // Full sentence or heavy scene asset reveals
  },

  // Spring physics presets for Remotion's spring() function
  spring: {
    // Gentle: Smooth movement, minimal overshoot, suitable for subtle UI movement
    gentle: {
      damping: 26,
      mass: 1.2,
      stiffness: 80,
      overshootClamping: false,
    },
    // Smooth: Balanced damping and stiffness, suitable for standard transitions
    smooth: {
      damping: 20,
      mass: 1.0,
      stiffness: 120,
      overshootClamping: false,
    },
    // Bouncy: Noticeable overshoot, suitable for buttons, cards, playful elements
    bouncy: {
      damping: 10,
      mass: 0.7,
      stiffness: 160,
      overshootClamping: false,
    },
    // Snappy: Fast response, minimal overshoot, suitable for short UI interactions
    snappy: {
      damping: 15,
      mass: 0.6,
      stiffness: 200,
      overshootClamping: false,
    },
    // Heavy: Slower and weightier movement, suitable for large visual elements
    heavy: {
      damping: 32,
      mass: 2.0,
      stiffness: 90,
      overshootClamping: false,
    },
    // Stiff: High rigidity with no bounce, mechanical precision
    stiff: {
      damping: 28,
      mass: 0.5,
      stiffness: 300,
      overshootClamping: true,
    },
  },

  // Standard Cubic-Bezier Easing curves for Remotion interpolate()
  // Format: [x1, y1, x2, y2]
  easing: {
    linear: [0.0, 0.0, 1.0, 1.0] as const,
    easeIn: [0.42, 0.0, 1.0, 1.0] as const,
    easeOut: [0.0, 0.0, 0.58, 1.0] as const,
    easeInOut: [0.42, 0.0, 0.58, 1.0] as const,
    easeInCubic: [0.32, 0.0, 0.67, 0.0] as const,
    easeOutCubic: [0.33, 1.0, 0.68, 1.0] as const,
    easeInOutCubic: [0.65, 0.0, 0.35, 1.0] as const,
    easeInExpo: [0.7, 0.0, 0.84, 0.0] as const,
    easeOutExpo: [0.16, 1.0, 0.3, 1.0] as const,
    easeInOutExpo: [0.87, 0.0, 0.13, 1.0] as const,
    easeInQuart: [0.5, 0.0, 0.75, 0.0] as const,
    easeOutQuart: [0.25, 1.0, 0.5, 1.0] as const,
    easeInOutQuart: [0.76, 0.0, 0.24, 1.0] as const,
    // Brand signature curves
    standard: [0.2, 0.0, 0.0, 1.0] as const,    // Decelerating entrance
    emphasized: [0.05, 0.7, 0.1, 1.0] as const, // Expressive curve
    decelerate: [0.0, 0.0, 0.2, 1.0] as const,  // Fast in, settle smooth
    accelerate: [0.4, 0.0, 1.0, 1.0] as const,  // Exit velocity
  },
} as const;

// Backward-compatible alias matching Phase 1 naming
export const Motion = {
  frames: MOTION.duration,
  stagger: MOTION.stagger,
  springs: MOTION.spring,
  easing: MOTION.easing,
} as const;

export type MotionConfig = typeof MOTION;
export type MotionTokens = typeof Motion;
export type SpringPresetName = keyof typeof MOTION.spring;
export type EasingCurveName = keyof typeof MOTION.easing;
