---
description: "Use when creating or changing Angular components, templates, routes, services, or styles under src/. Covers this repository's Angular and accessibility conventions."
applyTo: 'src/**/*.ts, src/**/*.html, src/**/*.scss'
---

# Angular and TypeScript

- Keep TypeScript strict and use `unknown` rather than `any` when a value's type is not known. Follow the established patterns in `src/app/`.
- Prefer standalone Angular components (the default in this Angular version), signals for local state, and `computed()` for derived state. Do not explicitly set `standalone: true` or `ChangeDetectionStrategy.OnPush`. For new component APIs, prefer `input()`, `output()`, and `model()` where appropriate; avoid needless rewrites of existing APIs.
- Use `@if`, `@for`, and `@switch` in new templates. Prefer class and style bindings over `ngClass` and `ngStyle`.
- Put host bindings in the decorator's `host` object rather than using `@HostBinding` or `@HostListener`. Do not assume globals such as `new Date()` are available in templates.
- Keep components focused. Use `inject()` for dependencies and follow the existing `@Injectable({ providedIn: 'root' })` service pattern.
- Use lazy loading for new feature routes where appropriate; do not restructure unrelated existing routes.
- Use `NgOptimizedImage` for static images where applicable; it does not support inline base64 images.
- Use Reactive Forms or Signal Forms for new forms rather than template-driven forms. Keep templates simple and use relative paths for component templates and styles.
- Keep keyboard operation, focus behavior, semantic markup, ARIA, and WCAG AA contrast in mind. Run relevant accessibility checks and add or update tests for behavior.
