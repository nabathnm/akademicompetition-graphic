# UI Components (Layer 2)

Micro visual components inspired by mobile application interfaces and commercial dashboards.

## Available Components
- `AnimatedInput`: Realistic interactive input field with frame-based typing (reusing `useTyping`), focus ring, blinking cursor, 5 visual variants (`outlined`, `filled`, `minimal`, `underline`, `rounded`), 7 interaction states, and backspace text deletion. See [docs/ANIMATED_INPUT.md](../../../docs/ANIMATED_INPUT.md).

## Planned Components
- `Badge`: Status and indicator tags (e.g., "LIVE", "PREMIUM", "NEW").
- `Button`: Sleek CTA pills and action buttons with scale-in feedback.
- `MetricCard`: Floating stat cards with icon, label, and animated value.
- `ProgressBar`: Linear or radial determinate progress bars.
- `NotificationToast`: Mobile-style floating push alert.

## Conventions
- Styled strictly using `Colors` and `Spacing` tokens.
- Composable within mockup components or as standalone floating overlay elements.
