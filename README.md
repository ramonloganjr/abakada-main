<div align="center">
  <img src="public/assets/logo/og.png" alt="Abakada.org" width="100%" />

  <h1>Abakada.org</h1>

  <p>A curated directory of 1,000+ free and open-source productivity tools<br/>for Filipino students, educators, scholars, and professionals.</p>

  <p>
    <a href="https://abakada.org"><img src="https://img.shields.io/badge/Website-abakada.org-107f87?style=flat-square&logo=googlechrome&logoColor=white" alt="Website" /></a>
    <a href="mailto:hello@abakada.org"><img src="https://img.shields.io/badge/Email-hello@abakada.org-107f87?style=flat-square&logo=gmail&logoColor=white" alt="Email" /></a>
    <a href="LICENSE.md"><img src="https://img.shields.io/badge/License-MIT%20%7C%20CC%20BY%204.0-107f87?style=flat-square" alt="License" /></a>
    <img src="https://img.shields.io/badge/PRs-Welcome-107f87?style=flat-square" alt="PRs Welcome" />
    <img src="https://img.shields.io/badge/PWA-Ready-107f87?style=flat-square&logo=pwa&logoColor=white" alt="PWA Ready" />
  </p>

  <p>
    Built as a Progressive Web App with offline support, multi-language interface,<br/>and zero backend dependencies.
  </p>
</div>

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [GitHub Actions](#github-actions)
- [Deployment](#deployment)
- [Configuration](#configuration)
- [Browser Support](#browser-support)
- [Author](#author)
- [License](#license)
- [Contributing](#contributing)
- [Security](#security)

---

## Tech Stack

<table>
  <tr>
    <td align="center" width="110">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="36" /><br/>
      <sub><b>React 18</b></sub>
    </td>
    <td align="center" width="110">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg" width="36" /><br/>
      <sub><b>Vite 5</b></sub>
    </td>
    <td align="center" width="110">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="36" /><br/>
      <sub><b>JavaScript ESM</b></sub>
    </td>
    <td align="center" width="110">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" width="36" /><br/>
      <sub><b>CSS3</b></sub>
    </td>
    <td align="center" width="110">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" width="36" /><br/>
      <sub><b>HTML5</b></sub>
    </td>
    <td align="center" width="110">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="36" /><br/>
      <sub><b>Node.js</b></sub>
    </td>
    <td align="center" width="110">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apache/apache-original.svg" width="36" /><br/>
      <sub><b>Apache / cPanel</b></sub>
    </td>
    <td align="center" width="110">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" width="36" /><br/>
      <sub><b>Git</b></sub>
    </td>
    <td align="center" width="110">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" width="36" /><br/>
      <sub><b>GitHub</b></sub>
    </td>
  </tr>
</table>

**Core Dependencies**

| Package | Version | Purpose |
|:---|:---:|:---|
| `react` | ^18.3.1 | UI framework |
| `react-dom` | ^18.3.1 | DOM rendering |
| `react-router-dom` | ^6.28.0 | Client-side routing |
| `@vitejs/plugin-react` | ^4.3.4 | Babel/React transform for Vite |
| `vite` | ^5.4.11 | Build tool and dev server |

> No backend. No database. No external API calls. All data is served from static JSON files.

---

## Features

<details>
<summary><b>Tool Directory</b></summary>
<br/>

- 1,000+ free and open-source tools across 45+ categories
- Category-based filtering with sidebar navigation
- Full-text search with debounce and highlight
- Platform and tag filters
- Tool detail modal with description, platforms, license, tags, and direct download/visit links
- Featured Editor's Picks carousel section

</details>

<details>
<summary><b>Learning Paths</b></summary>
<br/>

- Curated learning paths organized by role (student, educator, developer, designer, researcher, accountant)
- Onboarding modal on first visit to select user role
- Per-path tool listings with progress tracking via `localStorage`
- Learning tool cards with structured content
- Sidebar collapsed by default on Learning Paths pages for focused content

</details>

<details>
<summary><b>Bookmarks</b></summary>
<br/>

- Save tools to a personal bookmark list
- Persisted in `localStorage` — no account required
- Dedicated Bookmarks page with full tool cards
- Bookmark count badge in header and mobile sidebar
- Sidebar collapsed by default on the Bookmarks page for a cleaner layout

</details>

<details>
<summary><b>Tool Comparison</b></summary>
<br/>

- Side-by-side comparison of up to 4 tools
- Comparison count badge in header and mobile sidebar
- Dedicated Compare page with structured attribute table
- Sidebar collapsed by default on the Compare page for a cleaner layout

</details>

<details>
<summary><b>Progressive Web App (PWA)</b></summary>
<br/>

- Service Worker with cache-first, network-first, and stale-while-revalidate strategies
- Full offline support with custom offline fallback page
- App shell pre-caching on install
- Background sync for bookmark operations via IndexedDB queue
- PWA install banner for all devices
  - iOS Safari: shows manual "Tap Share > Add to Home Screen" instruction
  - Android / Desktop Chrome / Edge: uses native `beforeinstallprompt` flow
- SW update notification banner (only on genuine updates, not first install)
- Web App Manifest with shortcuts, icons, and screenshots

</details>

<details>
<summary><b>Internationalization (i18n)</b></summary>
<br/>

- 4 languages: English, Filipino (Tagalog), Bisaya (Cebuano), Ilokano
- Language switcher in header
- Smooth opacity transition on language change
- Translations stored in static JSON files under `/assets/data/translations/`
- All UI strings translated including footer navigation links (Bookmarks, Comparison Tools, Learning Paths)

</details>

<details>
<summary><b>Theming</b></summary>
<br/>

- Light and dark mode with system preference detection
- Manual override persisted in `localStorage`
- Smooth theme transition via CSS class
- Design token system via CSS custom properties (colors, spacing, radius, shadows, typography)
- Antigravity-inspired design: glass-edge cards, dot grid backgrounds, layered depth

</details>

<details>
<summary><b>SEO</b></summary>
<br/>

- Full Open Graph and Twitter Card meta tags
- Structured data (JSON-LD): WebSite + SearchBox, Organization, WebPage, ItemList, FAQPage
- Geo targeting meta tags for the Philippines
- `sitemap.xml` with image sitemap and `lastmod` dates
- `robots.txt` with per-crawler rules and AI scraper blocks (GPTBot, CCBot, Claude-Web)
- Canonical URLs and `hreflang` for `en-PH` locale

</details>

<details>
<summary><b>Security</b></summary>
<br/>

- Content Security Policy headers via `.htaccess`, `_headers`, and `vercel.json`
- Rate limiter for rapid repeated requests
- Bot signal detection and DevTools detection
- Context menu and text selection disabled on tool card content
- Email obfuscation utility
- `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` headers

</details>

<details>
<summary><b>Performance</b></summary>
<br/>

- Code splitting with manual vendor chunk (`react`, `react-dom`, `react-router-dom`)
- Content-hash filenames for long-term browser caching
- Lazy-loaded page components via `React.lazy` + `Suspense`
- esbuild minification targeting ES2020
- Gzip compression via `.htaccess`
- Cache-Control headers: 1 year for hashed assets, no-cache for HTML
- Inter font served locally via `woff2` — no Google Fonts request
- Preconnect and DNS-prefetch hints in `<head>`

</details>

<details>
<summary><b>Accessibility</b></summary>
<br/>

- Skip to main content link
- ARIA roles and labels throughout
- Focus-visible outlines
- Reduced motion support via `prefers-reduced-motion`
- High contrast support via `prefers-contrast: high`
- Semantic HTML structure

</details>

<details>
<summary><b>Footer</b></summary>
<br/>

- Resources section with direct links to Bookmarks, Comparison Tools, and Learning Paths
- Quick Links section includes Education & Teaching category
- Compact visitor count pill showing icon, count, and last-updated date (fetched from `visitors.json`, populated by nightly GitHub Action via GA4 Data API)
- Social links: GitHub, Facebook, LinkedIn
- Abakada section with About, Official Partners, Partnerships, and Contact links

</details>

### Pages

| Route | Description |
|:---|:---|
| `/` | Home — tool directory with search, filters, featured section |
| `/learning-paths` | Learning path index (sidebar collapsed by default) |
| `/learning-paths/:id` | Individual learning path detail (sidebar collapsed by default) |
| `/bookmarks` | Saved tools (sidebar collapsed by default) |
| `/compare` | Tool comparison — up to 4 tools (sidebar collapsed by default) |
| `/about` | About Abakada |
| `/contact` | Contact page |
| `/faq` | Frequently Asked Questions |
| `/privacy` | Privacy Policy |
| `/partnerships` | Partnership information |
| `/partnership-deck` | Partnership presentation deck |
| `/official-partners` | Official partner logos by tier |
| `/sitemap` | HTML sitemap |

---

## Project Structure

```
abakada.org/
├── public/
│   ├── assets/
│   │   ├── data/
│   │   │   ├── tools.json              # All tool data
│   │   │   ├── learning-paths.json     # Learning path data
│   │   │   └── translations/           # i18n JSON files (en, tl, bis, ilo)
│   │   ├── fonts/                      # Self-hosted Inter woff2 files
│   │   └── logo/                       # Favicons, OG image, logos
│   ├── .htaccess                       # Apache: SPA routing, headers, gzip, cache
│   ├── _headers                        # Netlify/Cloudflare headers
│   ├── offline.html                    # Offline fallback page
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── site.webmanifest
│   └── sw.js                           # Service Worker
├── src/
│   ├── components/                     # Reusable UI components
│   ├── contexts/                       # React context providers
│   ├── hooks/                          # Custom React hooks
│   ├── lib/                            # Utility modules
│   ├── pages/                          # Route-level page components
│   ├── styles/                         # CSS (tokens, base, layout, components)
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
├── vercel.json
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/Abakada-org/abakada.org.git
cd abakada.org

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Output is placed in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

---

## Deployment

### cPanel / Shared Hosting (Apache)

1. Run `npm run build`
2. Upload the entire contents of `dist/` to your `public_html/` directory
3. In cPanel File Manager, enable **Show Hidden Files** to confirm `.htaccess` is present
4. The `.htaccess` file handles SPA routing, security headers, gzip, and cache control

### Vercel

Push to your connected GitHub repository. `vercel.json` handles SPA rewrites and security headers automatically.

### Netlify

Push to your connected GitHub repository. `public/_headers` handles security headers. Add a `_redirects` file or configure redirects in the Netlify dashboard for SPA routing:

```
/*  /index.html  200
```

---

## Configuration

### Adding or Updating Tools

Edit `public/assets/data/tools.json`. Each tool entry follows this structure:

```json
{
  "id": "unique-tool-id",
  "name": "Tool Name",
  "tagline": "Short one-line description",
  "description": "Full description",
  "category": "category-slug",
  "platforms": ["Windows", "macOS", "Linux", "Web"],
  "license": "MIT",
  "tags": ["tag1", "tag2"],
  "url": "https://tool-website.com",
  "download_url": "https://tool-website.com/download",
  "featured": false
}
```

### Adding Translations

Add or update keys in the corresponding file under `public/assets/data/translations/`:

| File | Language |
|:---|:---|
| `en.json` | English |
| `tl.json` | Filipino / Tagalog |
| `bis.json` | Bisaya / Cebuano |
| `ilo.json` | Ilokano |

### Updating the Service Worker Cache

Bump the `CACHE_NAME` version in `public/sw.js` on every production deploy:

```js
const CACHE_NAME = 'abakada-v3'; // increment on each deploy
```

---

## Browser Support

| Browser | Support |
|:---|:---:|
| Chrome / Edge 90+ | Full |
| Firefox 90+ | Full |
| Safari 14+ (macOS) | Full |
| Safari on iOS 14+ | Full (PWA via Add to Home Screen) |
| Samsung Internet 14+ | Full |
| Opera 76+ | Full |

---

## Author

<table>
  <tr>
    <td>
      <b><a href="https://ramonloganjr.com">Ramon Logan Jr.</a></b><br/>
      <sub>
        UAE-based full-stack developer and IT professional specializing in web development,<br/>
        design, cloud services, and cybersecurity.
      </sub>
      <br/><br/>
      <sub>
        Developer behind <a href="https://bettersolano.org">BetterSolano.org</a> &nbsp;|&nbsp;
        Founder of <a href="https://hellopinas.com">HelloPinas.com</a> &nbsp;|&nbsp;
        Contributor to <a href="https://bettergov.ph">BetterGov.ph</a> &nbsp;|&nbsp;
        Individual participant at the <a href="https://openjsf.org">OpenJS Foundation</a>
      </sub>
      <br/><br/>
      <a href="https://ramonloganjr.com"><img src="https://img.shields.io/badge/Website-ramonloganjr.com-107f87?style=flat-square&logo=googlechrome&logoColor=white" /></a>
      <a href="mailto:hello@abakada.org"><img src="https://img.shields.io/badge/Email-hello@abakada.org-107f87?style=flat-square&logo=gmail&logoColor=white" /></a>
      <a href="https://github.com/ramonloganjr"><img src="https://img.shields.io/badge/GitHub-ramonloganjr-107f87?style=flat-square&logo=github&logoColor=white" /></a>
    </td>
  </tr>
</table>

---

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![License: CC BY 4.0](https://img.shields.io/badge/License-CC_BY_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)

| Component | License |
|:---|:---|
| Source code | MIT License |
| Content, data, and documentation | CC BY 4.0 |

See [LICENSE.md](./LICENSE.md) for full terms. For partnership or licensing inquiries, contact [hello@abakada.org](mailto:hello@abakada.org).

---

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) in full before submitting any pull requests or issues.

---

## Security

To report a vulnerability, do not open a public issue. See [SECURITY.md](./SECURITY.md) for the private disclosure process and a full overview of the security architecture.
