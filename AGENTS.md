# AGENTS.md

This file is for future coding agents and maintainers working inside this repository.

## Objective

Maintain and evolve a small, premium, single-page landing page for `RS Live Technologies`.

The current site is not a general marketing template. It is deliberately restrained, image-led, and editorial. Any change that pushes it toward a generic SaaS or agency landing page is probably the wrong move unless the user explicitly changes the brief.

## Repo Reality

- Framework: `React + Vite + TypeScript`
- Main code lives in `src/main.tsx` and `src/styles.css`
- There is no router, no state library, and no component library
- The app is intentionally small; do not over-architect it
- Generated output lives in `dist/`
- Image assets live in `src/assets/`

## Commands

Install:

```bash
npm install
```

Run dev server:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Preview production output:

```bash
npm run preview
```

## Architectural Guidance

- Keep `src/main.tsx` as composition glue for a few small page sections.
- If the page grows, split sections into local component files under `src/`, but do it only when the split reduces real complexity.
- Keep styling centralized or at least token-driven. If you add new files, preserve the existing custom property system for color, spacing, width, and motion.
- Do not introduce a heavy UI library for this project unless the user explicitly asks for it.
- Do not add client-side data plumbing, CMS abstractions, or routing scaffolding without a concrete use case.

## Design Constraints

- Preserve the monochrome editorial direction unless the brief changes.
- The page should remain photography-dominant.
- Copy stays minimal. Avoid filler sections, fake testimonials, metrics, service cards, and decorative UI clutter.
- Motion should remain quiet: slow reveal, gentle drift, subtle hover states.
- Maintain a premium feel on mobile, not just desktop.
- Respect `prefers-reduced-motion`.

## Content Constraints

Current visible content is intentionally sparse:

- Brand: `RS Live Technologies`
- Slogan: `We make lives.`
- Brand line: `Image, signal, and systems for living experiences.`
- Visual rhythm section and three selected moments
- Contact path via `mailto:studio@rslivetech.com`

Do not expand this into a conventional services page unless explicitly asked.

## Asset Guidance

- Existing images are local generated PNGs in `src/assets/`.
- `concept-direction.png` is a reference artifact, not a runtime dependency.
- If replacing or adding hero/gallery imagery, keep the same tonal family: monochrome, haze, stage/control/installation atmosphere, high-quality editorial framing.
- Prefer optimized modern formats for new production assets when practical.

## Verification Standard

For any visible UI change:

1. Run `npm run build`.
2. Verify in browser, not just by static inspection.
3. Check desktop and mobile.
4. Confirm there is no horizontal overflow.
5. Confirm image crops, text wrapping, and fixed header behavior still hold up.
6. Preserve the first-view composition: slogan, hero image, and a visible hint of the next section.

## Things To Avoid

- Adding unnecessary dependencies
- Turning the page into a card-heavy template
- Introducing bright accent colors without a new brief
- Replacing the layout with generic centered marketing blocks
- Breaking the balance between large type and large imagery
- Treating `dist/` as source of truth

## Source Of Truth

- Composition and copy: [src/main.tsx](/Users/imrsp/Documents/Codex/RSlivetech-landingpage/src/main.tsx)
- Visual system and responsive behavior: [src/styles.css](/Users/imrsp/Documents/Codex/RSlivetech-landingpage/src/styles.css)
- Runtime scripts and package metadata: [package.json](/Users/imrsp/Documents/Codex/RSlivetech-landingpage/package.json)
