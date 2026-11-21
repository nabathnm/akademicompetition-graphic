# UI Components (Layer 2)

Micro visual components inspired by mobile application interfaces and commercial dashboards.

## Available Components
- `AnimatedSearchBar`: Reusable composite search engine component simulating the complete user interaction flow: container entrance, input focus, typewriter typing, suggestions dropdown, item selection, submission feedback, loading spinner, and staggered result cards or empty state fallback. Reuses `AnimatedInput` and `AnimatedButton`. See [docs/ANIMATED_SEARCH_BAR.md](../../../docs/ANIMATED_SEARCH_BAR.md).
- `AnimatedButton`: Reusable interactive button simulating mobile CTA feedback, state transitions (`idle`, `hover`, `pressed`, `released`, `loading`, `success`, `error`, `disabled`), 6 visual variants (`primary`, `secondary`, `outline`, `ghost`, `text`, `icon-only`), 3 size presets, physics spring overshoot upon release, loading spinner, error shake, and entrance/exit transitions. See [docs/ANIMATED_BUTTON.md](../../../docs/ANIMATED_BUTTON.md).
- `AnimatedInput`: Realistic interactive input field with frame-based typing (reusing `useTyping`), focus ring, blinking cursor, 5 visual variants (`outlined`, `filled`, `minimal`, `underline`, `rounded`), 7 interaction states, and backspace text deletion. See [docs/ANIMATED_INPUT.md](../../../docs/ANIMATED_INPUT.md).

## Planned Components
- `Badge`: Status and indicator tags (e.g., "LIVE", "PREMIUM", "NEW").
- `MetricCard`: Floating stat cards with icon, label, and animated value.
- `ProgressBar`: Linear or radial determinate progress bars.
- `NotificationToast`: Mobile-style floating push alert.

## Conventions
- Styled strictly using `Colors` and `Spacing` tokens.
- Composable within mockup components or as standalone floating overlay elements.
