# AGENTS.md

This file defines the current maintenance contract for coding agents and contributors working in this repository.

## Working Documentation

- Keep `AGENTS.md` local and ignored by Git; it records maintenance guidance for this checkout.
- Put future project communications and technical documentation in `/docs` by default. The `/docs` directory is ignored by Git and is not part of the public repository.
- Keep the root `README.MD` very brief and suitable for a public repository; do not put technical details there.

## Objective

Maintain a small, premium, single-page brand site for `RS Live Technologies`.

The site presents large-format live sound work as one continuous path:

`Signal → Mixing → System`

It is not a generic agency, SaaS, equipment catalogue, or conventional services page. Preserve its editorial restraint unless the user explicitly changes the brief.

## Repository Reality

- Runtime: semantic HTML, handwritten CSS, native JavaScript, high-resolution raster illustrations, and small inline SVG icons
- Tooling: zero-dependency Node.js scripts
- Entry point and all visible copy: `index.html`
- Visual system and responsive behavior: `src/styles.css`
- Runtime behavior: `src/main.js`
- Generated output: `dist/`
- Both source and built `index.html` must work when opened directly through `file://`
- No React, Vite, TypeScript, router, state library, component library, CMS, or third-party runtime dependency
- Node.js requirement: `>=18.17`

The app is intentionally small. Do not over-architect it.

## Commands

No dependency installation is required.

```bash
npm run build
npm run dev
npm run preview
```

`npm run preview` serves `dist/` at port `4173` by default. `HOST` and `PORT` may be overridden through environment variables.

Directly opening either root `index.html` or `dist/index.html` must remain a supported runtime path. HTTP preview is for development convenience, not a runtime requirement.

If recursive file watching fails with `EMFILE`, run `npm run build` followed by `npm run preview`; do not treat the operating-system watch limit as an application failure.

## Page Composition

The current navigation has exactly three destinations:

- `Work`
- `Approach`
- `Contact`

The page sequence is:

1. Fixed header
2. Hero with `We make lives.` and the stadium sound illustration
3. `One continuous path.` workflow
4. Working approach and multi-position response illustration
5. Contact band
6. Minimal footer

Do not add a separate About page, modal system, gallery, service-card grid, or additional navigation item without a concrete new requirement.

## Design Contract

- Preserve the warm near-black paper background, ivory hierarchy, and restrained terracotta accent.
- Preserve the dark Claude-inspired editorial character without copying Claude product UI literally.
- Keep the balance of large serif display type and quiet sans-serif interface text.
- The three production visuals are high-resolution PNG illustrations derived from the approved effect images. Keep visible copy and controls code-native.
- Illustrations should be legible, technically plausible, and restrained rather than obscurely abstract.
- The hero should communicate the energy and scale of a stadium show without neon, beams, screens, gradients, or spectacle for its own sake.
- Loudspeaker arrays must face the audience and sound-field geometry must read coherently.
- Final response traces should be broadly flat but imperfect, with visible variation between measurement positions.
- Motion must remain subtle and support hierarchy; do not animate the raster artwork merely to add activity.
- Maintain a premium first view and equal care on mobile.
- Respect `prefers-reduced-motion`.

## Content Contract

Keep these elements unless the user explicitly changes them:

- Brand: `RS Live Technologies`
- Slogan: `We make lives.`
- Brand line: `Signal, mixing, and systems for living experiences.`
- Workflow: `Signal → Mixing → System`
- Contact: `studio@rslive.tech`

The workflow is one complete path, not “3 ways” and not three unrelated offerings.

Content concerns sound design only. Do not mention lighting or use lighting and large-format screens as visual themes. Keep technical meaning present but abstract: avoid turning clocking, redundancy, AoIP, protocol coordination, acoustical modelling, measurement, and tuning into a dense specification list unless requested.

Avoid filler sections, invented claims, testimonials, metrics, client logos, pricing, FAQ blocks, badges, or marketing jargon.

## Architectural Guidance

- Keep page structure and image references in `index.html` while the site remains this small.
- Keep styling centralized and token-driven in `src/styles.css`.
- Keep `src/main.js` limited to behavior that CSS and semantic HTML cannot provide cleanly.
- Keep browser runtime JavaScript as a classic deferred script. Do not introduce ES module loading, runtime fetches, root-relative asset paths, or server-only assumptions without preserving direct `file://` execution.
- Prefer HTML anchors and native browser behavior over custom navigation code.
- Reuse the existing media-window, spacing, typography, and responsive primitives before creating one-off styles.
- Keep production image assets under `src/assets/`; do not reference files from generated-image or temporary directories.
- If the page genuinely grows, split by meaningful responsibility only after the split reduces complexity.
- Do not introduce dependencies, routing, data plumbing, or abstraction layers without a concrete use case.

## Accessibility

- Preserve the skip link and semantic landmark structure.
- Keep heading order coherent and anchor IDs stable.
- Give informative production images concise, meaningful `alt` text.
- Mark decorative inline SVG icons `aria-hidden="true"`.
- Preserve visible keyboard focus and sufficient contrast.
- Never make content visibility depend permanently on JavaScript or animation.

## Build Behavior

`scripts/build.mjs` checks `file://` compatibility and local references, recreates `dist/`, writes root HTML with 12-character SHA-256 fingerprints on CSS, JS, and image resources, omits PNG masters when JPEG derivatives exist, and copies `_headers`. Treat source files as authoritative and never edit `dist/` directly.

`scripts/dev.mjs` builds, starts the server, and watches `index.html` plus `src/`. `scripts/serve.mjs` revalidates HTML, applies immutable caching to fingerprinted files, returns true 404s, limits methods to GET/HEAD, rejects traversal, and sends baseline security headers. `_headers` carries the corresponding production policy for Netlify and Cloudflare Pages.

## Verification Standard

For every visible UI change:

1. Run `npm run build`.
2. Run `git diff --check`.
3. Verify the built site in a browser.
4. Check desktop and mobile viewports.
5. Confirm there is no horizontal overflow.
6. Confirm the fixed header and all three navigation anchors work.
7. Confirm image crops, loudspeaker direction, asset sharpness, and text wrapping remain correct.
8. Confirm the console has no errors or warnings.
9. Confirm the reduced-motion experience remains complete.
10. Confirm both root `index.html` and `dist/index.html` remain directly openable through `file://` with working Header state and local assets.

Preserve unrelated worktree changes and report any environmental limitation separately from application failures.

## Things to Avoid

- Generic centered marketing blocks or card-heavy templates
- Bright or numerous accent colors
- Photos, video backgrounds, equipment glamour shots, lighting beams, or screen walls
- Excessive parallax, hover effects, scroll choreography, or looping animation
- Copy that over-explains the technical workflow
- Editing generated `dist/` as source
- Adding dependencies for behavior already covered by the platform

## Source of Truth

- Composition, copy, semantics, and image references: [index.html](/Users/imrsp/Documents/GitHub/RSlivetech-landingpage-2/index.html)
- Visual system, motion, and responsive behavior: [src/styles.css](/Users/imrsp/Documents/GitHub/RSlivetech-landingpage-2/src/styles.css)
- Runtime behavior: [src/main.js](/Users/imrsp/Documents/GitHub/RSlivetech-landingpage-2/src/main.js)
- Build and runtime metadata: [package.json](/Users/imrsp/Documents/GitHub/RSlivetech-landingpage-2/package.json)
- Architecture notes: [docs/architecture.md](/Users/imrsp/Documents/GitHub/RSlivetech-landingpage-2/docs/architecture.md)
- Naming conventions: [docs/naming-conventions.md](/Users/imrsp/Documents/GitHub/RSlivetech-landingpage-2/docs/naming-conventions.md)
