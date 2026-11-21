/**
 * Motion Tokens
 * Frame-based animation parameters for Remotion.
 * Standardized at 30 FPS (can scale to 60 FPS via frame conversion helpers).
 * Built with physics-informed spring configurations and standard easing curves.
 */

export const Motion = {
  // Standard frame durations (calibrated for 30 FPS)
  frames: {
    instant: 5,     // ~0.16s - Quick micro-interactions / state toggles
    fast: 12,       // ~0.40s - Crisp UI transitions, tooltips, tags
    normal: 20,     // ~0.66s - Standard component entrances / card reveals
    slow: 32,       // ~1.06s - Scene transitions, prominent heroes
    deliberate: 48, // ~1.60s - Expressive brand movements, smooth camera pans
    extended: 60,   // ~2.00s - Background ambient loops, grand unfolds
  },

  // Stagger intervals for list / multi-element reveals (in frames)
  stagger: {
    tight: 2,       // Snappy cascading elements
    normal: 4,      // Standard card or word cascades
    relaxed: 6,     // Deliberate, impactful item arrivals
    dramatic: 10,   // Full sentence or heavy scene asset reveals
  },

  // Spring physics presets for Remotion's spring() function
  springs: {
    // Snappy: Minimal overshoot, high responsiveness (Signature Uber/Apple feel)
    snappy: {
      damping: 15,
      mass: 0.6,
      stiffness: 200,
      overshootClamping: false,
    },
    // Smooth: Balanced natural momentum for general UI elements
    smooth: {
      damping: 20,
      mass: 1.0,
      stiffness: 120,
      overshootClamping: false,
    },
    // Gentle: Soft deceleration, elegant brand and typography arrivals
    gentle: {
      damping: 26,
      mass: 1.2,
      stiffness: 80,
      overshootClamping: false,
    },
    // Bouncy: Noticeable playful elastic bounce
    bouncy: {
      damping: 10,
      mass: 0.7,
      stiffness: 160,
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
    standard: [0.2, 0.0, 0.0, 1.0] as const,    // Decelerating entrance
    emphasized: [0.05, 0.7, 0.1, 1.0] as const, // Expressive curve
    decelerate: [0.0, 0.0, 0.2, 1.0] as const,  // Fast in, settle smooth
    accelerate: [0.4, 0.0, 1.0, 1.0] as const,  // Exit velocity
    linear: [0.0, 0.0, 1.0, 1.0] as const,
  },
} as const;

export type MotionTokens = typeof Motion;
export type SpringPresetName = keyof typeof Motion.springs;
