#!/usr/bin/env node
// =============================================================================
// package-cpanel.mjs — bundle the built dist/ into a single, ready-to-upload
// ZIP for cPanel (Apache) shared hosting.
//
// The archive stores dist/'s CONTENTS at its root (not a nested dist/ folder),
// so a maintainer can upload it into public_html/ in cPanel File Manager and
// "Extract" — index.html, .htaccess and assets/ land exactly where Apache
// serves them, with no further moves.
//
// Run AFTER a production build:  npm run build && node scripts/package-cpanel.mjs
// or simply:                     npm run package:cpanel
// =============================================================================
import { existsSync, mkdirSync, readdirSync, statSync, rmSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, resolve, join } from 'node:path'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')
const RELEASE = join(ROOT, 'release')

function fail(msg) {
  console.error(`\n[package-cpanel] ERROR: ${msg}\n`)
  process.exit(1)
}

// 1. Sanity-check the build output. These files MUST be present for a working
//    cPanel deploy — .htaccess in particular is what makes SPA routing, headers,
//    compression and caching work on Apache.
if (!existsSync(DIST)) fail('dist/ not found. Run `npm run build` first.')

const REQUIRED = ['index.html', '.htaccess', 'sw.js', 'site.webmanifest', 'robots.txt', 'sitemap.xml', 'offline.html', 'assets']
const missing = REQUIRED.filter((f) => !existsSync(join(DIST, f)))
if (missing.length) fail(`dist/ is missing required files: ${missing.join(', ')}. Re-run \`npm run build\`.`)

// 2. Prepare an output filename: abakada-cpanel-<UTC timestamp>.zip
mkdirSync(RELEASE, { recursive: true })
const stamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 12) // YYYYMMDDHHMM
const outFile = join(RELEASE, `abakada-cpanel-${stamp}.zip`)
if (existsSync(outFile)) rmSync(outFile)

// 3. Zip dist/'s contents at archive root, cross-platform.
//    Windows  -> PowerShell Compress-Archive (ships with Windows).
//    POSIX    -> `zip -r` run from inside dist/ ("." includes dotfiles).
const isWin = process.platform === 'win32'
try {
  if (isWin) {
    // NOTE: Do NOT use `Compress-Archive` — Windows PowerShell 5.1 writes ZIP
    // entry names with BACKSLASH separators, which violates the ZIP spec and
    // makes Linux/cPanel unzip extract literal "assets\file.js" names into the
    // root (a broken deploy). Build the archive with .NET ZipArchive instead and
    // set every entry name explicitly with forward slashes. `-Force` on
    // Get-ChildItem includes dotfiles like .htaccess.
    const ps = [
      "Add-Type -AssemblyName System.IO.Compression.FileSystem;",
      `$src='${DIST}'; $dest='${outFile}';`,
      "$zip=[System.IO.Compression.ZipFile]::Open($dest,'Create');",
      "try {",
      "  Get-ChildItem -LiteralPath $src -Recurse -Force -File | ForEach-Object {",
      "    $rel=$_.FullName.Substring($src.Length).TrimStart('\\','/').Replace('\\','/');",
      "    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip,$_.FullName,$rel,[System.IO.Compression.CompressionLevel]::Optimal) | Out-Null",
      "  }",
      "} finally { $zip.Dispose() }",
    ].join(' ')
    execFileSync('powershell', ['-NoProfile', '-NonInteractive', '-Command', ps], { stdio: 'inherit' })
  } else {
    // -r recurse, -q quiet, -X no extra attrs; run inside dist so paths are
    // relative and dotfiles (".") are included. `zip` writes forward slashes.
    execFileSync('zip', ['-r', '-q', '-X', outFile, '.'], { cwd: DIST, stdio: 'inherit' })
  }
} catch (err) {
  fail(`zip step failed: ${err.message}\nOn Windows ensure PowerShell is available; on Linux/macOS install the \`zip\` utility.`)
}

if (!existsSync(outFile)) fail('archive was not created.')

// 4. Report.
const sizeMB = (statSync(outFile).size / (1024 * 1024)).toFixed(2)
const topLevel = readdirSync(DIST).length
console.log('\n[package-cpanel] cPanel package ready')
console.log(`  file:    ${outFile.replace(ROOT + '\\', '').replace(ROOT + '/', '')}`)
console.log(`  size:    ${sizeMB} MB`)
console.log(`  entries: ${topLevel} top-level items from dist/ (contents at archive root)`)
console.log('\n  Upload this .zip to public_html/ in cPanel File Manager, then "Extract".')
console.log('  Enable "Show Hidden Files (dotfiles)" to confirm .htaccess extracted.\n')
