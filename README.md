# Light Novel Parody Factory

**A browser-based studio for creating, generating, organizing, and reading original light-novel parodies.**  
**Edition:** Factory 14.x · **Creator attribution:** BLLSNVJ21

- [Open the repository](https://github.com/shreebalaji767/LIGHT-NOVEL-PARODY-FACTORY)
- [Open the GitHub Pages site](https://shreebalaji767.github.io/LIGHT-NOVEL-PARODY-FACTORY/)

## What it does

- **Novel Factory:** configure a story and generate a long-form manuscript.
- **Story planning:** build a story bible, seed, and blueprint before generation.
- **Procedural writing:** reproducible seeds and resumable generation checkpoints.
- **Local Library:** browse saved manuscripts in the browser.
- **Lazy chapter reader:** load chapter content as needed instead of opening one giant manuscript object.
- **Backup and restore:** export/import the versioned `LNPF-BACKUP` format.
- **Progressive Web App:** installable app shell and offline support where the browser and hosting origin support them.
- **Privacy-first storage:** no account or application server is required for the core local workflow.

## Start using it

1. Open the [site](https://shreebalaji767.github.io/LIGHT-NOVEL-PARODY-FACTORY/).
2. Choose **Create a Novel** and configure the story.
3. Review the story setup, then generate chapters.
4. Open **Library** to revisit saved work.
5. Export a backup periodically if the manuscripts matter to you.

Serve the repository through an HTTP server when testing locally. Browser storage and service-worker/PWA features do not work reliably from a `file://` URL.

## Architecture

This is a static, client-side web application built with HTML, CSS, and JavaScript.

- `index.html` — landing page and entry points
- `create.html` — story configuration and generation workflow
- `library.html` — saved manuscript library
- `reader.html` — chapter-by-chapter reader
- `css/` — interface styling
- `js/app.js` — procedural story engine and application logic
- `js/pwa.js` — install/offline app controls
- `sw.js` — service worker
- `manifest.webmanifest` — PWA metadata
- `icons/` — application icons
- `robots.txt` and `sitemap.xml` — search crawler discovery

## Data, privacy, and backups

The core app stores manuscripts in browser-local IndexedDB. Manuscripts are not automatically synced to other devices or backed up to a server. Clearing site data, changing browsers, or using a different device can make local manuscripts unavailable. Export a backup and keep it somewhere safe.

Generation is procedural and browser-side; it does not require a hosted AI API key. Review and edit generated text before publication.

## Search indexing

The repository includes root-level `robots.txt` and `sitemap.xml` for the GitHub Pages project URL. Submit the sitemap in Google Search Console after confirming the Pages URL is live. A sitemap helps discovery but does not guarantee indexing or ranking.

## Development checklist

- Test Create → Generate → Pause/Resume → Library → Reader.
- Test backup export and import with a small manuscript first.
- Verify storage migration with a copy of existing browser data before changing database schemas.
- Check mobile layout, keyboard navigation, and print/export flows.
- Validate `manifest.webmanifest`, service-worker caching, `robots.txt`, and `sitemap.xml` on the deployed site.

## Project scope

The core application runs without a backend or server database. Future hosted AI generation, account sync, or cloud storage should be optional services with clear privacy and cost disclosures.
