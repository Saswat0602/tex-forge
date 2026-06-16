# AGENTS.md — TexForge

Operating guide for any agent (or human) writing code in this repo. TexForge is a Next.js web app for writing, managing, compiling, previewing, and downloading LaTeX documents in the browser. This file is law for code style, architecture, and quality bar. If a request conflicts with this file, follow this file and flag the conflict.

---

## 1. Tech Stack & Project Shape

- **Framework:** Next.js (App Router), TypeScript strict mode, React Server Components by default.
- **Styling:** Tailwind CSS + CSS variables for theming. No inline style objects except for dynamic computed values (e.g. editor width).
- **State:** Server state via React Server Components / Route Handlers + `fetch` cache. Client state via Zustand (small, scoped stores) — no Redux, no Context-as-a-store for anything beyond theme/auth session.
- **Editor:** CodeMirror 6 (LaTeX mode) — loaded only on the client, lazy.
- **Compilation:** LaTeX compile runs server-side (Route Handler / queued worker) or via WASM engine (e.g. swiftlatex/texlive.js) — never block the main thread either way.
- **PDF Preview:** `react-pdf` / `pdf.js` — lazy loaded, client-only.
- **Storage:** Document content + metadata in DB (Postgres via Prisma) or object storage for large assets; never store compiled PDFs in app memory beyond the request lifecycle.
- **Validation:** Zod for all external input — API payloads, form data, env vars.

```
src/
  app/                    # routes, layouts, route handlers
    (marketing)/
    (dashboard)/
      projects/
      editor/[docId]/
    api/
  components/
    ui/                   # dumb, reusable, no business logic
    editor/               # editor-specific composite components
    preview/
  features/                # business logic grouped by domain
    documents/
      actions.ts          # server actions
      queries.ts          # data access
      schema.ts           # zod schemas
      types.ts
    compilation/
    projects/
    auth/
  lib/
    db.ts
    cache.ts
    logger.ts
    utils.ts
  hooks/
  stores/                 # zustand stores
  types/                  # shared/global types only
  workers/                 # web workers (compile, lint)
```

Rule: **no business logic in `components/` or `app/`.** Routes and components call into `features/*`. This is non-negotiable — it's what keeps the app testable and prevents duplicate logic.

---

## 2. TypeScript Rules

- `strict: true`, `noUncheckedIndexedAccess: true`, `noImplicitAny`, no `any` ever. Use `unknown` + narrowing, or generics.
- No type assertions (`as`) unless narrowing a `unknown` from an external boundary (API response, JSON.parse) and immediately validated by Zod right after — assertion without validation is a bug, not a shortcut.
- Every function exported from `features/*` has explicit param and return types. Inferred return types are fine for tiny private helpers only.
- Discriminated unions for state machines (compile status, doc save status) instead of multiple booleans:

```ts
type CompileState =
  | { status: 'idle' }
  | { status: 'compiling'; startedAt: number }
  | { status: 'success'; pdfUrl: string; durationMs: number }
  | { status: 'error'; log: string };
```

Never `{ isCompiling: boolean; isError: boolean; isSuccess: boolean }` — that's an invalid-state generator.

- Domain types live once, in `features/<domain>/types.ts`, and are imported everywhere else. Never redeclare a shape that already exists — if you're about to write an interface, grep for it first.
- Use `satisfies` over `as` when shaping literals against a type.

---

## 3. No Duplicate Logic — Mandatory Checks Before Writing Code

Before adding any function, the agent must:

1. **Grep first.** Search `features/`, `lib/`, `hooks/`, `utils.ts` for an existing implementation or near-match (debounce, slugify, formatBytes, parseLatexErrors, etc.). If one exists, extend or import it — don't fork it.
2. **One source of truth per concern:**
   - LaTeX parsing/validation logic → `features/compilation/`
   - File/document CRUD → `features/documents/`
   - Auth/session checks → `features/auth/`
   - Formatting/date/byte-size helpers → `lib/utils.ts`
3. **No copy-pasted API handlers.** Shared logic between a Route Handler and a Server Action goes into a `features/*/service.ts` function that both call.
4. **No re-implemented debounce/throttle/deepEqual/etc.** Use a small utility lib (e.g. `es-toolkit` over `lodash` for tree-shaking) or one hand-written, tested version in `lib/utils.ts`. Pick one. Never both.

---

## 4. Performance — Non-Negotiables

This app must feel instant. Compilation is the only allowed "slow" operation, and even that must never block the UI.

### Code splitting & lazy loading
- **Editor (CodeMirror), PDF viewer (pdf.js/react-pdf), and the LaTeX compile engine (WASM) are always dynamically imported, client-only, with `ssr: false`:**

```ts
const LatexEditor = dynamic(() => import('@/components/editor/LatexEditor'), {
  ssr: false,
  loading: () => <EditorSkeleton />,
});
```

- Any component that pulls in a heavy third-party library (charting, syntax highlighting themes, icon packs beyond what's used) is dynamically imported.
- Route-level code splitting is automatic via App Router segments — keep each route's `page.tsx` lean; push heavy widgets into dynamically imported children, not the page shell.
- WASM LaTeX engine binary is fetched once, cached (Cache API / IndexedDB), never re-fetched per compile.

### Rendering strategy
- Default to Server Components. A component becomes a Client Component only when it needs interactivity, browser APIs, or state — and the `'use client'` boundary should sit as low/deep in the tree as possible (wrap the interactive leaf, not the whole page).
- Static/marketing pages: fully static (`generateStaticParams` / static rendering).
- Dashboard/project list: Server Component fetch + streaming (`loading.tsx`, `<Suspense>`), not client-side `useEffect` fetching.
- Editor page: Server Component shell (layout, doc metadata) wrapping a client island for the editor + preview.

### Data fetching
- No waterfalls. Parallelize independent fetches with `Promise.all` in the same Server Component, or use parallel route segments.
- Cache reads with Next's `fetch` cache / `unstable_cache` for anything not user-mutated every keystroke (project lists, user settings). Tag-based revalidation (`revalidateTag`) on mutation — never blanket `revalidatePath('/')`.
- Document content autosave: debounce client writes (e.g. 800ms–1.5s) and batch — never fire a network request per keystroke. Use optimistic UI updates with rollback on failure.

### Compilation pipeline
- Compilation is debounced/queued, cancellable (AbortController) if the user edits again before it finishes — never let two compiles race and show a stale PDF.
- Heavy compute (LaTeX parsing for live error markers, diffing) goes into a **Web Worker**, not the main thread.
- Show a skeleton/previous-PDF-frozen state while recompiling — never a blank flash.

### Asset & bundle hygiene
- `next/image` for every image, with explicit `sizes`/`priority` only on LCP images.
- `next/font` for fonts, self-hosted, `display: swap`.
- Run `@next/bundle-analyzer` before merging anything that adds a dependency. Any single dependency adding >50kb gz must be justified or dynamically imported.
- No moment.js, no full lodash, no unused icon-library barrel imports (`import { Icon } from 'lib'` patterns that pull the whole tree — use specific paths or a tree-shakeable icon lib).

### Avoiding re-render bottlenecks
- Memoize expensive derived values (`useMemo`) and stable callbacks passed to memoized children (`useCallback`) — but don't cargo-cult it onto cheap computations; profile first.
- Editor content state lives in a ref/imperative CodeMirror instance, not in React state on every keystroke — React state updates only for things the UI actually needs to re-render on (save status, error count), not raw text.
- Virtualize long lists (project list, file tree, compile log) with `react-virtual`/`react-window` once they can exceed ~50 items.

---

## 5. Business Logic Boundaries

- **Server Actions** (`features/*/actions.ts`) are the only place mutations happen from the client. They: validate input with Zod → check auth/ownership → call the domain service → revalidate the right tag → return a typed result (`{ ok: true, data } | { ok: false, error }`), never throw raw errors to the client.
- **Domain services** (`features/*/service.ts`) contain the actual rules (e.g. "a free-tier user can have at most 3 active projects", "compilation is rate-limited per user per minute"). These are pure-ish, testable, framework-agnostic functions — no `next/headers`, no `NextRequest` inside them.
- **Route Handlers** (`app/api/**/route.ts`) are for things Server Actions can't do well: webhooks, file streaming downloads (compiled PDF/zip), third-party callbacks. They follow the same validate → authorize → service → respond shape.
- Authorization is checked at the service layer, not just the route/middleware layer — never trust that middleware alone gates access to a resource a user doesn't own.
- All errors are typed domain errors (`class DocumentNotFoundError extends AppError`), caught at the boundary, mapped to user-safe messages. No leaking stack traces or DB errors to the client.

---

## 6. Code Style

- Functions: small, single-purpose, named for what they do (`compileLatexDocument`, not `handleStuff`).
- No dead code, no commented-out blocks, no `console.log` left in — use the shared `lib/logger.ts`.
- Co-locate tests next to the code (`service.test.ts` beside `service.ts`).
- Imports ordered: external → internal absolute (`@/...`) → relative. Enforced via ESLint, not manual diligence.
- Every new util/component is checked against step 3 (no duplicates) and given a single clear file location per the structure in section 1 — don't scatter related logic across random files.
- Comments explain *why*, not *what* the code already says.

---

## 7. Definition of Done (checklist before considering a task complete)

1. Strict TypeScript compiles, no `any`, no unchecked assertions.
2. No duplicate function/logic introduced — grepped first.
3. Heavy/browser-only modules (editor, PDF viewer, WASM compiler) are dynamically imported, `ssr: false`, with a loading state.
4. No unnecessary Client Components — boundary pushed as deep as possible.
5. No data-fetch waterfalls; caching/revalidation tags used correctly.
6. No main-thread blocking work (compile/parse heavy logic in a worker).
7. Business logic lives in `features/*`, not in components or route files.
8. Errors are typed and handled at the boundary; nothing throws raw to the client.
9. Bundle impact considered for any new dependency.
10. Lists/large data are virtualized if they can grow unbounded.