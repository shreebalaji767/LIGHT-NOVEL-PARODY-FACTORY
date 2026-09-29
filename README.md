# LIGHT NOVEL PARODY FACTORY

Static, local-first light-novel parody generator with a Jekyll-inspired gothic literary interface.

## Principles
- No login/signup
- No backend
- No database
- Novels saved in the browser with IndexedDB
- Reader and reading progress are local
- 200–1000 chapters
- Approximately 800 words per chapter
- Multi-genre parody configuration

## Assembly/WebAssembly direction
The UI/storage prototype is separated from the generation engine. The next engine milestone is to replace the procedural JavaScript chapter generator with a WebAssembly module compiled from Assembly source.

Assembly -> WebAssembly -> browser

## Run
Serve with any static HTTP server. IndexedDB and WebAssembly should be tested from a served origin rather than file://.
