# Production sample visual QA

Date: 2026-09-04  
Runtime: OpenDesign web + daemon through `pnpm tools-dev`, Chromium, desktop and built-in Mobile preview modes.  
Data isolation: `.tmp/production-samples-data` through an explicit `OD_DATA_DIR`.

The browser review was performed on the actual seeded OpenDesign projects, not on the source files opened directly. Every counted round produced a concrete correction and a second screenshot.

| Round | Surface | Finding | Correction | Evidence |
| --- | --- | --- | --- | --- |
| 1 | Lingo · Mobile | The design rationale consumed the first mobile viewport and pushed the app UI below the fold. | At `<=420px`, hide the rationale and present the prototype as a full-height, frameless app screen. | [before](iteration-01-lingo-mobile-before.png) · [after](iteration-01-lingo-mobile-after.png) |
| 2 | Finpath · Desktop | The three-step onboarding story wrapped into a 2+1 grid, hiding the trust step below the first view. | Use a fluid three-column artboard in narrow desktop/tablet previews. | [before](iteration-02-finpath-desktop-before.png) · [after](iteration-02-finpath-desktop-after.png) |
| 3 | Finpath · Mobile | The campaign explanation pushed the first screen CTA below the viewport. | Condense the mobile header and use horizontal scroll-snap, retaining a visible next-screen cue. | [before](iteration-03-finpath-mobile-before.png) · [after](iteration-03-finpath-mobile-after.png) |
| 4 | NomadTalk · Desktop | The `1060px` breakpoint showed only two of the three required campaign ratios in OpenDesign's desktop preview. | Keep all three ratio-aware columns down to `780px`, with safer flexible minimum widths. | [before](iteration-04-nomadtalk-desktop-before.png) · [after](iteration-04-nomadtalk-desktop-after.png) |
| 5 | NomadTalk · Mobile | The 9:16 creative was valid, but its CTA fell outside the first review viewport. | Condense campaign metadata and scale only the mobile review rendition to 260px; export ratio remains 9:16. | [before](iteration-05-nomadtalk-mobile-before.png) · [after](iteration-05-nomadtalk-mobile-after.png) |

## Interaction checks

- Lingo's microphone state toggles `aria-pressed`, accessible label, pulse styling, and status copy.
- Lingo's language swap changes both language controls without external dependencies.
- Finpath goal choices remain mutually exclusive through `aria-pressed`.
- All sample imagery and scripts are local. The HTML contains no tracker, remote font, or remote asset URL.

## Known upstream development noise

When optional integrations are not configured, the development console reports failed status requests for Vela and AMR. The three samples do not call either integration and their preview assets load through OpenDesign's existing `/api/skills/:id/...` compatibility route.

