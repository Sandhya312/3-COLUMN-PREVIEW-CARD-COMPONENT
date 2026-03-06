# AGENTS.md

## Cursor Cloud specific instructions

This is a static HTML/CSS project (Frontend Mentor "3-Column Preview Card Component"). No build step, no framework, no package manager.

### Serving the site

Use any static file server. Quick options:
- `npx serve -l 3000 /workspace`
- `python3 -m http.server 3000`

The site loads Google Fonts via CDN, so internet access is required for correct rendering.

### JSON filter utility

`filter-json.js` is a Node.js CLI script that strips unwanted keys from an array of JSON objects.

```
node filter-json.js <input.json> [output.json]
```

Defaults: input = `raw-data.json`, output = `filtered-data.json`. The kept keys are configured in the `KEYS_TO_KEEP` array at the top of the script.

### Lint / Test / Build

There are no linters, test frameworks, or build tools configured for the static site. Validation is visual (open in browser).
