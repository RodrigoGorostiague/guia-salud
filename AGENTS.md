# Agent Notes

- Read the exact Expo docs for this repo version before changing app code: https://docs.expo.dev/versions/v56.0.0/

## Commands

- Install deps: `npm install`
- Install Expo-compatible deps: `npx expo install <packages>`
- Start dev server: `npm run start`
- Open Android: `npm run android`
- Open iOS: `npm run ios`
- Open web: `npm run web`
- Lint: `npm run lint`
- Type check: `npx tsc --noEmit`

## Repo Shape

- This is a single Expo app.
- The real route directory is `src/app`, not `app`.
- `package.json` uses `expo-router/entry` as the app entrypoint.
- Keep `src/app` thin: use it for Expo Router routes and layouts, and place screen composition under `src/screens`.

## Routing

- Routing is file-based with Expo Router.
- `app.json` has `experiments.typedRoutes: true`; keep route changes compatible with typed routes.

## TypeScript And Imports

- `tsconfig.json` has `strict: true`.
- Prefer the configured aliases:
  - `@/*` -> `src/*`
  - `@/assets/*` -> `assets/*`

## Current Foundation

- The starter demo was reset. The current app foundation lives in:
  - `src/theme/` for design tokens
  - `src/components/base/` for reusable UI primitives
  - `src/screens/home/` for the initial Home screen
- Reuse those primitives before adding new ad hoc screen-level styles.

## Triage Flow

- The symptom assessment lives under `src/features/triage/` and is data-driven: keep question copy/rules in `data.ts` and flow logic in `engine.ts`.
- The first symptom screen should stay short. Use `Otros sintomas` to branch into second/third-level symptom lists instead of showing one long initial list.
- The triage should progress from common/mild symptoms toward contextual red flags. Do not start with a universal emergency checklist unless explicitly requested.
- Keep health copy simple and conversational. Prefer phrases like `Me cuesta respirar`, `Me desmaye`, `Me duele mucho la cabeza` over medical jargon.
- Autocuidado may mention OTC/pharmacy support, but do not recommend antibiotics, steroids, opioids, benzodiazepines, or prescription medication without evaluation.

## Establishments And Maps

- Map/location dependencies are `react-native-maps` and `expo-location`, installed with `npx expo install`.
- `expo-location` is configured for foreground location only. Do not add background location unless there is an explicit product requirement.
- The in-app map is currently a stakeholder-friendly placeholder: it uses the user's real foreground location and demo establishments with coordinates rebased around that location.
- In-app tiles use CARTO raster tiles (`basemaps.cartocdn.com`) with visible `OpenStreetMap · CARTO` attribution. Do not use `tile.openstreetmap.org` directly; it can return 403 and is not appropriate for app tile hotlinking.
- Each establishment should offer `Como llegar` by opening the device maps app with destination coordinates. Prefer this over adding Google Maps API key/SDK cost until there is a clear need.
- Future real nearby search should be behind an app/backend service boundary, for example `/establishments/nearby?lat=...&lng=...&type=...`, so providers can change without rewriting the UI.
- Provider options for real establishments: Google Places for best commercial quality, OpenStreetMap/Overpass for lower-cost MVP, or curated backend data for controlled regions.

## Config Quirks

- `app.json` enables `reactCompiler: true`; avoid patterns that fight the React Compiler.
- Web output is configured as `static`.
- App orientation is locked to `portrait`.

## Safety Notes

- Do not run `npm run reset-project` unless the user explicitly asks for it. The script moves or deletes `src` and recreates a blank `src/app`.
- Do not assume the package/app name is a typo fix opportunity: the verified current name/slug/scheme use `guia-aslud` / `guiaaslud`.

## Docs Drift

- `README.md` is still mostly the default Expo starter README. Trust `package.json`, `app.json`, `tsconfig.json`, and files under `src/` over README prose when they conflict.
