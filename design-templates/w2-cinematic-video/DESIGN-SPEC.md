# W2 Weather — cinematic vertical promo

Status: autonomous free-creation mode, production release candidate  
Source: Figma file `Weather Android V2 - Re Design`, section `360:73720`  
Format: 1080×1920, 30fps, 900 frames, exactly 30 seconds

## Product brief

W2 is a mobile weather product that combines immediate conditions, hourly and
30-day forecasts, precipitation/humidity/wind/UV/AQI, sun and moon information,
radar, and tide data in one vertically navigable interface.

Audience: mobile users planning travel, outdoor time, commuting, or daily routines.  
Campaign objective: product-awareness/app-install creative.  
Primary promise: see the important weather signals before they affect the day.  
Language: English, matching the supplied interface.  
Data policy: use the frozen demonstration values already present in Figma. They
are treated as mock design content, not current weather or a live forecast.

## Requirement-to-execution decisions

| Requirement | Execution decision | Evidence in output |
|---|---|---|
| “Absolutely cinematic” | Deep atmospheric stage, controlled 2.5D camera, one signature radar wipe, one accelerando montage, film-style SFX | Shots 1, 4, 5 and 6 |
| Use W2/Figma elements | Six complete Figma screens and nine exported component cards are the product imagery | `public/screens/`, `public/elements/` |
| Paid-social use | Portrait 9:16; copy remains inside 8% safe zones | All shots |
| 30 seconds | Single 900-frame composition at 30fps | `src/timeline.ts` |
| Production-ready | Deterministic rendering, source attribution, no-BGM master, five visual iterations, final independent review | `out/qa/`, `QA-REPORT.md` |

## Visual directions considered

1. **Atmospheric Forecast Cinema — selected.** W2's bright sky becomes a
   volumetric blue environment; its navy glass cards become physical slabs;
   cyan/orange chart colors become motion accents. This preserves the product
   while adding depth and ceremony.
2. **Liquid Weather Glass — rejected.** More translucent blur and fluid blobs
   would fit weather semantically, but the result risks generic glassmorphism
   and weakens the dense data UI.
3. **Mission Control — rejected.** HUD grids and neon telemetry could look
   dramatic, but would misrepresent the friendly consumer product as a
   specialist forecasting console.

## Brand and motion tokens

- Atmosphere: `#06101f`, `#0a2340`, `#087ed0`, `#10a7ec`
- Surface: `#1f2b3c`, `#334256`, translucent white at 8–18%
- Text: `#f7fbff`, secondary `#b7c8d9`
- Data accents: cyan `#16d9f4`, warm orange `#ff9d18`, yellow `#ffd62f`, green `#49d39a`
- Typeface: SF Pro Display/system sans; strong condensed uppercase only for
  campaign headlines, never for in-product UI.
- Corners: 28–40px for campaign surfaces; source UI preserves Figma radii.
- Energy: medium-high consumer premium, calm opening to launch peak.
- Main entrance: 28–42 frames, cubic ease-out; physical landings may use
  `cubic-bezier(0.34, 1.4, 0.44, 1)` with restrained overshoot.
- Camera: stable, no shake; perspective tilt stays within 10° for readable UI.
- Lighting: one outline sweep on the hero, one radar sweep transition, one
  finale stage-light event. No repeated glints.

## Function-to-shot mapping

| Product function | Shotcraft card / style | Source |
|---|---|---|
| Today's weather and hourly trend | `spotlight-hero-card` | Today screen + Today chart component |
| 30-day forecast breadth | `radial-ripple-phone-chips` | 30-day screen |
| Rain, humidity, wind, UV, AQI | `gauge-readout-moves / needle-sweep-selftest` | exported metric and AQI cards |
| Radar and tide | `wipe-transitions / clock-wipe` | radar + daily tide cards/screens |
| Feature breadth crescendo | `beat-cut-moves / beat-cut-accelerando` | six W2 screen crops |
| Brand memory and recap | `outro-group-photo-launch` | representative Figma components |

## Final storyboard and frame plan

| # | Time | Frames | Shot | New information / key motion |
|---|---:|---:|---|---|
| 1 | 0.0–4.0s | 0–119 | Sky Lock | Today screen rises from cloud shadow; spotlight finds the hourly chart, lifts it, traces once, then reseats. Caption: “SEE THE DAY AHEAD.” |
| 2 | 4.0–9.5s | 120–284 | Forecast Orbit | Central phone slowly scrolls the 30-day page while four blue atmospheric rings breathe. Feature chips arrive separately: “HOURLY” and “30 DAYS”. |
| 3 | 9.5–14.0s | 285–419 | Signal Self-test | Genuine metric cards form a readable console. Three restrained instrument needles sweep and settle. Caption: “RAIN. WIND. UV. AIR.” |
| 4 | 14.0–18.5s | 420–554 | Radar to Tide | A 72-segment radar sweep reveals the tide screen. The luminous scan edge is the only transition effect. Caption: “RADAR AND TIDE — ONE VIEW.” |
| 5 | 18.5–23.0s | 555–689 | Forecast Accelerando | Six crops of the same W2 product cut at shrinking 16→12→8→6→4-frame intervals, then freeze for readability. Caption: “EVERY SIGNAL. ONE FORECAST.” |
| 6 | 23.0–30.0s | 690–899 | W2 Launch | Forecast, metric, AQI, sun, radar and tide components fly from four directions into a clean group portrait. W2 wordmark lands at the energy peak; “KNOW WHAT’S NEXT.” holds more than one second. |

## Acceptance frames

- Shot 1: 36, 74, 110
- Shot 2: 150, 220, 270
- Shot 3: 305, 350, 405
- Shot 4: 445, 490, 540
- Shot 5: 575, 630, 675
- Shot 6: 715, 770, 845, 890

The storyboard is internally approved for autonomous production: every required
function has one distinct motion language, no feature repeats as the hero, the
opening has one focal subject, and the closing reserves a true brand hold.

