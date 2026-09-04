# Barcode & QR code scanner — campaign system

The ad system uses the app's official teal-and-monochrome identity as a restrained, high-contrast utility palette.

```css
:root {
  --bg: oklch(14% 0.018 172);
  --surface: oklch(20% 0.024 172);
  --fg: oklch(100% 0 0);
  --muted: oklch(76% 0.012 172);
  --border: oklch(34% 0.028 172);
  --accent: oklch(64.88% 0.1258 172.03);
}
```

- Display: `"Avenir Next Condensed", "Helvetica Neue", sans-serif`
- Body: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- Mono: `"SFMono-Regular", Consolas, "Liberation Mono", monospace`

Observed visual rules:

1. Use the official app teal (`#00a786`, measured from the app icon) as the sole chromatic accent.
2. Keep the QR geometry crisp, square, and high contrast against white.
3. Pair compact utility labels with very bold, condensed benefit-led headlines.
4. Frame authentic in-app imagery inside simple Android hardware geometry.
5. Use generous dark negative space so the green scanning action reads immediately.
