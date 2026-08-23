# YatraSetu AI Coding Instructions (CLAUDE.md)

## 1. Mission & Source of Truth
- Build YatraSetu strictly according to `/docs` and the specifications in PRD/SRS/TRD.
- Do not invent product features, add out-of-scope modules (e.g. Budget, Notifications, Admin, Offline mode), or contradict requirements.

## 2. Priority Hierarchy
PRD/SRS → UX/Wireframes/Design System → TRD → Database → API → Security → Testing → Deployment → CLAUDE.md.

## 3. Core Architectural Rules
- **Stack**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Supabase (Postgres, Auth, Storage, RLS), Google Maps Platform (server/client adapter with fallback), AI Provider Abstraction.
- **Data Integrity**: Never fabricate live factual infrastructure data (fuel stations, mechanics, hospitals, routes). If live APIs are unavailable, gracefully fallback to verified regional datasets and explicitly tag data as `fallback` or `unavailable`.
- **Security**: Never expose server secrets or service-role keys. Enforce authorization server-side and via PostgreSQL Row Level Security (RLS). Validate all inputs using runtime schemas (Zod).
- **Component Design**: Modular, reusable components with full state coverage: Loading (Skeletons), Empty, Success, Error, Validation.
- **Bus Booking**: Implement external redirect integration (RedBus / State Transport deep-links).

## 4. Definition of Done
1. Feature works according to the documentation.
2. Existing functionality is preserved without regressions.
3. Security boundaries & RLS policies are strictly enforced.
4. Responsive UI implemented (Mobile, Tablet, Desktop).
5. Unit and Integration tests pass.
6. Typecheck and lint pass.
7. Documentation remains consistent.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
