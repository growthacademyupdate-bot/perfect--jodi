## Project rules

- Demo state lives in one localStorage-backed store (src/lib/store.ts) with all mutations in src/lib/actions.ts — the brief requires a frontend-only demo with no backend.
- Member and admin routes are guarded client-side by AuthGate after hydration, because the session only exists in localStorage.
- The admin shell stays visually separate from the public site.
