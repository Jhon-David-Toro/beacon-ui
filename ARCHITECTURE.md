# Architecture

How Beacon UI is put together, and why.

## Two layers, one direction

```text
app/  ──imports──▶  design-system/
```

`design-system/` knows nothing about services, incidents or routes. A badge has a `tone` (`success`, `warning`…), not a service status; the app maps statuses to tones in `app/core/format`. This keeps the components publishable as a package and usable in any product.

Inside `app/`, dependencies also point one way: `views` → `parts` → `core` → `data`. The shell (`AppRoot`) is the only place that knows every view.

## Web Components with Lit, without decorators

Properties are declared with `static properties` and `declare` fields, and defaults are set in the constructor. Lit supports this officially. It avoids two problems with decorators today: legacy TypeScript decorators are a non-standard dialect, and standard decorators still need a transform that not every toolchain applies (Vite 8 leaves them untouched for the browser). The code that ships is the code you read.

Every element registers itself through `defineElement`, which ignores a second registration of the same tag. Importing a component twice, or hot reloading it, never throws.

## Styling: SCSS into the shadow root

- **Global layer:** `styles/tokens.scss` turns SCSS maps (palette, type, spacing, radii, two themes) into custom properties on `:root`. Custom properties cross shadow boundaries, so they are the theming API. Runtime theme switches only change `data-theme` on `<html>`.
- **Component layer:** each component's `.scss` is imported with `?inline`, compiled by Vite and adopted with `unsafeCSS`. Shadow DOM already scopes the selectors, so there is no need for CSS Modules or naming schemes.
- **Shared mixins** (`_mixins.scss`, `_field.scss`) remove repetition at build time, with no runtime cost. They validate their arguments (`@error` on an unknown spacing step or type size).
- Public styling hooks are documented: `part="control"` on inner controls and `--bc-uptime-*` custom properties.

## Forms: the platform does the work

`FormControl` is an abstract base class around `ElementInternals`. Subclasses only answer three questions: what is my value (`formValue`), how do I reset (`resetValue`), and am I valid (`syncValidity`, which mirrors the inner native control's `ValidityState`). The browser then handles `FormData`, `:invalid`, `checkValidity()`, form reset and `<fieldset disabled>`.

Errors become visible after the first blur, or when the form is submitted (the `invalid` event), never on the first keystroke.

## State: context plus a plain observable

`IncidentStore` is a small class with `subscribe()`, no Lit import, and its own unit tests. `AppRoot` provides it through `@lit/context`; views read it with `StoreController`, a reactive controller that subscribes on connect, unsubscribes on disconnect and requests a render on change. There is no global singleton, so tests create a fresh store (in memory, `new IncidentStore(null)`) per app instance.

## Async data: `@lit/task`

Each view owns its requests through `Task`. Changing the task arguments (for example the service id in the URL) aborts the previous request through its `AbortSignal`; the mock API honours the signal like `fetch` would. Every task renders explicit pending, error and complete states, and errors are typed (`ServiceNotFoundError` becomes a "no such service" page, anything else becomes a retry message).

## Routing: a hash router as a controller

`Router` is a reactive controller of about forty lines over `hashchange` and a small pattern matcher. Hash routing works on GitHub Pages and any CDN without rewrites. After each navigation the shell updates `document.title` and moves focus to `<main>`, so keyboard and screen reader users land on the new content.

## Deterministic mock data

`services.mock.ts` builds every chart from a seeded generator (mulberry32). The same seed always yields the same latency and uptime, which keeps screenshots stable and lets tests assert exact values. Dates are relative to "now", so the data never looks stale.

## Testing strategy

All tests run in Chromium via Vitest browser mode. jsdom does not implement `ElementInternals` form association, `:modal`, `<dialog>` focus behaviour or real layout, and those are exactly the features worth testing here.

| Level          | Example                                                                      |
| -------------- | ---------------------------------------------------------------------------- |
| Pure functions | `toPoints`, `resolveRoute`, `percentile`, `reportFromFormData`               |
| Components     | Tabs keyboard model, text field in a real `<form>`, dialog closing on Escape |
| App flows      | Report an incident from the form to the service page and the toast           |
| Accessibility  | axe-core, WCAG 2.2 AA, every page, light and dark                            |
