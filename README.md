# Ricko Prayudha | Professional Portfolio

The source code for my professional portfolio and CV. This project is built using React, Vite, and Three.js, and is designed to reflect an IT Operations and infrastructure background.

## Technology Stack

- **Framework:** React 19, TypeScript, Vite 7
- **Visuals:** Three.js for the network scene, custom raster assets
- **Typography:** Self-hosted Fontsource packages (Barlow Condensed, DM Sans, IBM Plex Mono)
- **Testing:** Playwright, Axe-core

## Local Development

To run the portfolio locally:

```bash
npm install
npm run dev
```

To build the production bundle and generate the PDF CV:

```bash
npm run resume
npm run build
```

To run tests:

```bash
npm test
```

## Deployment

This repository is configured to deploy automatically to GitHub Pages via GitHub Actions whenever changes are pushed to the `main` branch.

## Editing Content

The content and career history are centralized in `src/content.ts`. This file drives both the web portfolio (English and Indonesian) and the generated PDF CV.

## Editorial and Privacy Note

See [docs/RESEARCH.md](docs/RESEARCH.md) for information on visual influences, evidence verification, and privacy boundaries. This repository deliberately excludes private contact information, internal diagrams, and actual operational credentials.
