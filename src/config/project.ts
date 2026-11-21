/**
 * Project and Framework Configuration
 * Global metadata and layer definitions for the motion graphics framework.
 */

export const PROJECT_CONFIG = {
  name: 'Motion Graphics Framework',
  version: '1.0.0',
  description: 'Scalable Remotion framework for high-end commercial motion graphics',
  styleInspiration: 'Modern premium tech and mobility brands (e.g. Uber)',
  
  layers: {
    PLAYGROUND: {
      id: 'MotionPlayground',
      title: 'Layer 1: Motion Playground',
      description: 'Isolated development and evaluation environment for components and variants',
    },
    COMPONENTS: {
      id: 'ComponentLibrary',
      title: 'Layer 2: Component Library',
      description: 'Reusable atomic motion primitives, typography, UI, and mockups',
    },
    SCENES: {
      id: 'SceneLibrary',
      title: 'Layer 3: Scene Library',
      description: 'Multi-component visual sections with coherent entrance and exit timings',
    },
    ADVERTISEMENTS: {
      id: 'AdComposition',
      title: 'Layer 4: Advertisement Composition',
      description: 'Final assembly combining scenes, audio tracks, and broadcast delivery configs',
    },
  },
} as const;
