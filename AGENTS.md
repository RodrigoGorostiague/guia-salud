# Agent Notes

- Read the exact Expo docs for this repo version before changing app code: https://docs.expo.dev/versions/v56.0.0/

## Commands

- Install deps: `npm install`
- Start dev server: `npm run start`
- Open Android: `npm run android`
- Open iOS: `npm run ios`
- Open web: `npm run web`
- Lint: `npm run lint`

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

## Config Quirks

- `app.json` enables `reactCompiler: true`; avoid patterns that fight the React Compiler.
- Web output is configured as `static`.
- App orientation is locked to `portrait`.

## Safety Notes

- Do not run `npm run reset-project` unless the user explicitly asks for it. The script moves or deletes `src` and recreates a blank `src/app`.
- Do not assume the package/app name is a typo fix opportunity: the verified current name/slug/scheme use `guia-aslud` / `guiaaslud`.

## Docs Drift

- `README.md` is still mostly the default Expo starter README. Trust `package.json`, `app.json`, `tsconfig.json`, and files under `src/` over README prose when they conflict.
