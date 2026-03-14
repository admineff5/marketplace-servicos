# Decision Log

## Architecture: Auth Redirection (v0.9.31)
- **Decision:** Moved `/register` bypass to the absolute beginning of `middleware.ts`.
- **Reason:** Client users were being trapped in session-check redirections even when trying to access the registration page.
- **Outcome:** Total freedom of movement for all roles to the registration flow.

## UI: Dynamic Showcase (v0.9.28)
- **Decision:** Implemented client-side theme detection (`next-themes`) for home showcase images.
- **Reason:** Ensuring the landing page visuals match the user's active mode (Light/Dark).
- **Outcome:** Premium first impression regardless of user preference.

## Branding: Petrol Tone (v0.9.5)
- **Decision:** Switch from Neon Blue to Cyan-700 in Light Mode.
- **Reason:** Accessibility was poor, and the blue felt "cheap" compare to the dashboard petrol tone.
- **Outcome:** Unified, professional brand identity.
