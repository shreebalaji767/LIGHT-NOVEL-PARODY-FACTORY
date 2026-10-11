const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));

const required = [
  'index.html', 'create.html', 'library.html', 'reader.html',
  'css/jekyll.css', 'js/storage.js', 'js/app.js', 'js/library.js',
  'js/reader.js', 'js/pwa.js', 'sw.js', 'manifest.webmanifest',
  'robots.txt', 'sitemap.xml', 'offline.html'
];
for (const file of required) {
  assert.ok(exists(file), `Required application file is missing: ${file}`);
}

const manifest = JSON.parse(read('manifest.webmanifest'));
assert.ok(manifest.name, 'PWA manifest must have a name');
assert.ok(manifest.start_url, 'PWA manifest must have a start URL');
assert.ok(Array.isArray(manifest.icons) && manifest.icons.length, 'PWA manifest must declare icons');

const robots = read('robots.txt');
assert.match(robots, /^User-agent:\s*\*/m, 'robots.txt must declare a wildcard user-agent');
assert.match(robots, /Sitemap:\s*https:\/\/shreebalaji767\.github\.io\/LIGHT-NOVEL-PARODY-FACTORY\/sitemap\.xml/i,
  'robots.txt must point to the deployed sitemap');

const sitemap = read('sitemap.xml');
assert.match(sitemap, /<urlset\b/, 'sitemap must contain a urlset');
for (const page of ['/', '/create.html', '/library.html', '/reader.html']) {
  assert.ok(sitemap.includes(`https://shreebalaji767.github.io/LIGHT-NOVEL-PARODY-FACTORY${page}`),
    `Sitemap is missing expected page: ${page}`);
}

for (const page of ['index.html', 'create.html', 'library.html', 'reader.html']) {
  const html = read(page);
  assert.match(html, /<title>[^<]+<\/title>/i, `${page} must have a title`);
  assert.match(html, /<meta name="description"/i, `${page} must have a meta description`);
  for (const match of html.matchAll(/<(?:script|link)\b[^>]*(?:src|href)="([^"]+)"[^>]*>/gi)) {
    const url = match[1];
    if (/^(?:https?:|#|\/\/|data:|mailto:)/i.test(url)) continue;
    const localPath = decodeURIComponent(url.split(/[?#]/)[0]);
    if (!localPath || localPath.endsWith('/')) continue;
    assert.ok(exists(path.join(path.dirname(page), localPath)),
      `${page} references missing local asset: ${localPath}`);
  }
}

const sw = read('sw.js');
assert.match(sw, /addAll\(APP_SHELL\)/, 'Service worker should precache its app shell');
for (const asset of [...sw.matchAll(/'\.\/([^']+)'/g)].map((m) => m[1])) {
  if (asset.startsWith('http')) continue;
  assert.ok(exists(asset), `Service worker precache asset is missing: ${asset}`);
}

console.log('Quality smoke checks passed: required files, page assets, metadata, PWA manifest, service worker and sitemap.');
