# Optional Analytics Consent

Copy this example into `src/lib/analytics/consent.ts` if your public site enables optional analytics categories such as performance analytics or session replay.

Install the consent package when it is available in your package registry:

```bash
npm install @ooopsstudio/analytics-consent
```

This optional example is not part of the base template install so clean template clones can build without unpublished optional packages.

The package defaults to:

- `analytics: true`
- `performance: false`
- `replay: false`

Anonymous analytics can run by default. Performance analytics and replay should load only after visitor consent.

The banner uses provider-neutral copy and can be themed with template tokens:

```css
:root {
  --ooops-consent-bg: var(--color-surface);
  --ooops-consent-text: var(--color-text);
  --ooops-consent-muted: var(--color-muted);
  --ooops-consent-border: var(--color-border);
  --ooops-consent-accent: var(--color-accent);
  --ooops-consent-accent-text: var(--color-accent-contrast);
}
```
