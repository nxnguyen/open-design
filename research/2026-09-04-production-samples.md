# Production sample direction — 2026-09-04

## Decision

Build the no-code design demo as a focused fork of OpenDesign instead of a separate Next.js application.

OpenDesign already provides the costly platform capabilities: local SQLite persistence, native Codex CLI runtime discovery, prompt/skill composition, design systems, streamed runs, project file workspaces, sandboxed HTML preview, export, and production container packaging. The fork should add high-signal templates and seeded review projects instead of duplicating those systems.

## Sources checked

- `README.md`, `QUICKSTART.md`, `docs/architecture.md`
- `design-templates/mobile-app/`, `design-templates/mobile-onboarding/`
- `design-templates/social-carousel/`, `design-templates/magazine-poster/`
- `scripts/seed-test-projects.ts`
- Upstream repository and Apache-2.0 license: <https://github.com/nexu-io/open-design>

## Product slice

Exactly three production samples:

1. **Lingo Travel Translator** — a focused mobile translation home screen.
2. **Finpath First Money Plan** — a three-screen mobile onboarding flow.
3. **NomadTalk Travel Campaign** — one ad direction composed at 9:16, 4:5, and 1:1, with a generated background visual and code-native copy, product UI, brand, and CTA.

Each sample is a self-contained HTML artifact that can be opened, duplicated, and iterated with Codex inside the normal OpenDesign project workflow.

## Risk-first prototype

The highest-risk surface is the ad sample because its generated raster must crop cleanly in three ratios while preserving reliable copy and product UI. Generate only the visual background with GPT Image; compose all text and controls in HTML/CSS. Validate all three crops in the running sandboxed preview.

## Alternative considered

Continue the standalone `codex_design_studio` app. It has a smaller attack surface and a simpler guided wizard, but would need to recreate project chat, streaming, runtime adapters, file management, design-system selection, export, packaging, and mature preview isolation. Keeping it as a checkpoint is useful, but extending OpenDesign is the lower-risk production path.

## Acceptance gates

- Node 24 and pnpm 10.33.2 baseline.
- `pnpm guard`, `pnpm typecheck`, relevant web/daemon/template tests and web build.
- Exactly three seed projects created through the supported project/artifact path.
- Desktop and narrow-browser review of the project list and each artifact.
- At least five documented visual iterations; every counted iteration includes a concrete finding and a code/content correction.
- No external font or image network dependency in the sample artifacts.

## Reproduce the review workspace

Use the existing root command surface; no new lifecycle or aggregate alias is added:

```bash
export OD_DATA_DIR="$PWD/.tmp/production-samples-data"
pnpm seed:test-projects --offline --data-dir "$OD_DATA_DIR" \
  --decks 0 --webs 0 --default-plugins 0 --community-plugins 0 \
  --production-samples 3
pnpm tools-dev run web --daemon-port 17456 --web-port 17573 \
  --namespace production-samples
```

Open `http://127.0.0.1:17573`, choose **Local Agent → Codex CLI** during first-run onboarding, then review the three projects under **Recent projects**.

## Final self-review

- **Correctness:** the black-box seed test creates exactly three projects and verifies two mobile UI artifacts plus one ad artifact. All three were also opened through the real OpenDesign project route.
- **Readability:** the TypeScript change extends the existing fixture/source-kind pattern; it does not introduce a parallel seeder or lifecycle command.
- **Architecture:** no app, daemon, contract, authentication, storage, or preview-runtime source was changed. The new content stays in the first-party `design-templates/` boundary and is consumed by the existing seed path.
- **Security:** templates contain no credentials, remote scripts, trackers, external fonts, or external asset requests. Interactive samples only mutate their own DOM.
- **Performance:** the generated raster is loaded once through the existing local asset route. Seeding is bounded by the requested count and remains capped by the three-item fixture list.

Verification completed on Node 24 / pnpm 10.33.2:

- `pnpm guard`
- `pnpm typecheck`
- `pnpm --filter @open-design/web build`
- production-sample seed test
- localized-content and iframe-shell template tests
- browser review of all three seeded projects with five before/after rounds

Verdict: **approved for the fork branch**. No blocking correctness, architecture, security, or performance findings remain.
