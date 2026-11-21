# UI Components (Layer 2)

Micro visual components inspired by mobile application interfaces and commercial dashboards.

## Available Components
- `AnimatedNotification`: Frame-accurate, deterministic notification alert and toast component simulating mobile and web notifications (toasts, banners, floating alerts, compact tags, cards). Features 6 semantic types (`info`, `success`, `warning`, `error`, `message`, `custom`), 7 canvas-relative positions, 8 entrance and 4 exit animations, alert shake physics, synchronized linear progress bar, and optional CTA button. See [docs/ANIMATED_NOTIFICATION.md](../../../docs/ANIMATED_NOTIFICATION.md).
- `AnimatedCard`: Versatile container and content card component supporting 12 animation variants (`fade`, `slide-up`, `slide-down`, `slide-left`, `slide-right`, `scale`, `pop`, `flip`, `blur`, `float`, `expand`, `collapse`), 7 visual styles (`default`, `outlined`, `elevated`, `flat`, `image-card`, `horizontal`, `compact`), 7 interaction states (`idle`, `focused`, `selected`, `highlighted`, `expanded`, `collapsed`, `disabled`), composable slots (header, image, icon, title, description, content children, footer, action), and staggered collections. See [docs/ANIMATED_CARD.md](../../../docs/ANIMATED_CARD.md).
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
