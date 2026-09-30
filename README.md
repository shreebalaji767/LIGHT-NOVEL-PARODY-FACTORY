# LIGHT NOVEL PARODY FACTORY

**Factory 13.0** — a static, local-first light-novel parody studio with a gothic literary interface.

## Architecture
- Static GitHub Pages compatible site
- No backend
- No server database
- Browser-local IndexedDB persistence
- PWA/offline app shell
- Author attribution: **BLLSNVJ21**
- Original procedural stories only
- 200–1000 chapter configuration
- Approximately 800 words per generated chapter

## Story pipeline

**CONFIGURE → STORY BIBLE → SEED → BLUEPRINT → GENERATE → CHECKPOINT → RESUME → LIBRARY → READ**

The seeded engine makes procedural choices reproducible when the same seed is supplied. Generation checkpoints retain the story state and RNG state so interrupted generation can continue from the saved point.

## Storage 5.0 + Lazy Reader 13.0

Large manuscripts are no longer stored as one giant IndexedDB object. The reader also loads only the chapter being read, while chapter titles/metadata are indexed separately.

The browser database now uses:
- `novels` — lightweight book metadata and generation state
- `chapters` — one record per chapter, keyed by novel ID + chapter index
- `chapterIndex` — lightweight chapter navigation metadata
- `meta` — application metadata

Existing schema-2/legacy chapter data are migrated automatically during the IndexedDB upgrade. Legacy v1 books are also imported when available.

The Library loads lightweight metadata for fast browsing. Full chapter data is assembled only when a book is opened or exported.

## Backup

Library export uses the versioned `LNPF-BACKUP` format and includes complete chapter data. Imports are validated before being written into the local chapter store.

## Run

Serve with any static HTTP server. IndexedDB, service workers and PWA features should be tested from a served origin rather than `file://`.

## WebAssembly direction

The current generation engine is JavaScript and deliberately self-contained. A future experimental path can compile an isolated procedural engine to WebAssembly:

**Engine → WebAssembly → browser**
