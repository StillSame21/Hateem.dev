# docs/

`resume-page.artifact.html` — the Claude Artifact bundle Hateem exported as the
visual reference for `/resume` (`src/app/resume/page.tsx`). It is a `<x-dc>`
template (Anthropic's Artifact runtime DSL: `sc-for`, `sc-if`, `{{ var }}`)
with React 18 UMD inlined as base64 — it needs that runtime's JS to render and
is **not served by the site**. Its content was ported into
`src/content/resume.ts` and its look ported into `src/app/resume/page.tsx`.
Kept here as a design source, not a live page.
