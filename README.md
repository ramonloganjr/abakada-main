<div align="center">
  <img src="public/assets/logo/og.png" alt="Abakada.org" width="100%" />

  <h1>Abakada.org</h1>

  <p>A curated, multilingual directory of 1,291 free and open-source productivity tools<br/>for Filipino students, educators, scholars, and professionals.</p>

  <p>
    <a href="https://www.gmanetwork.com/news/pinoyabroad/dispatch/989216/ofw-developersoftware-hub-filipino-students/story/"><img src="https://img.shields.io/badge/Featured%20In-GMA%20News%20Online-107f87?style=flat-square" alt="GMA News Online" /></a>
    <a href="https://theglobalfilipinomagazine.com/the-advocate-behind-a-growing-free-tech-movement-in-philippine-education/"><img src="https://img.shields.io/badge/Featured%20In-The%20Global%20Filipino%20Magazine-107f87?style=flat-square" alt="The Global Filipino Magazine" /></a>
    <a href="https://walastech.com/news/abakada-org-wants-to-close-the-software-gap-in-philippine-schools/"><img src="https://img.shields.io/badge/Featured%20In-Walastech-107f87?style=flat-square" alt="Walastech" /></a>
    <a href="https://tuguegarao.bomboradyo.com/ofw-developer-naglunsad-ng-libreng-software-hub-para-sa-mga-estudyanteng-pilipino/"><img src="https://img.shields.io/badge/Featured%20In-Bombo%20Radyo-107f87?style=flat-square" alt="Bombo Radyo" /></a>
  </p>

  <p>
    <a href="https://abakada.org"><img src="https://img.shields.io/badge/Website-abakada.org-107f87?style=flat-square&logo=googlechrome&logoColor=white" alt="Website" /></a>
    <a href="mailto:hello@abakada.org"><img src="https://img.shields.io/badge/Email-hello@abakada.org-107f87?style=flat-square&logo=gmail&logoColor=white" alt="Email" /></a>
    <a href="LICENSE.md"><img src="https://img.shields.io/badge/License-MIT%20%7C%20CC%20BY%204.0-107f87?style=flat-square" alt="License" /></a>
    <img src="https://img.shields.io/badge/PRs-Welcome-107f87?style=flat-square" alt="PRs Welcome" />
    <img src="https://img.shields.io/badge/PWA-Ready-107f87?style=flat-square&logo=pwa&logoColor=white" alt="PWA Ready" />
    <img src="https://img.shields.io/badge/i18n-4_languages-107f87?style=flat-square" alt="i18n" />
  </p>

  <p>
    Built as a Progressive Web App with offline support, four Philippine languages,<br/>
    static-site prerendering, and zero backend dependencies.
  </p>
</div>

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Pages & Routing](#pages--routing)
- [Localization (i18n)](#localization-i18n)
- [SEO, AEO & GEO](#seo-aeo--geo)
- [Performance](#performance)
- [Project Architecture](#project-architecture)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Production Build](#production-build)
- [Deployment](#deployment)
- [Configuration](#configuration)
- [GitHub Actions](#github-actions)
- [Browser Support](#browser-support)
- [Author](#author)
- [License](#license)
- [Contributing](#contributing)
- [Security](#security)

---

## Overview

Abakada.org is a static, hand-curated catalog of free and open-source software for Filipino learners. Every tool is manually verified for licensing, safety, and educational value. The site is a fully prerendered React Progressive Web App that ships as a folder of static files. No backend, no database, no user accounts, no telemetry.

| Metric | Value |
|:---|:---|
| Tools | 1,291 (manually curated) |
| Categories | 45+ |
| Learning paths | 10 |
| Languages | 4 (English, Tagalog, Ilokano, Bisaya) — 871 keys each, full parity |
| Prerendered HTML routes | 1,315 (14 static pages + 10 toolkits + 1,291 tools) |
| Offline | Full PWA + on-demand downloadable learning packs |
| Backend | None |
| User accounts | None (progress, bookmarks, and profile live in `localStorage`) |
| Tracking | None (Google Analytics is the only signal, anonymized IP) |

---

## Tech Stack

<table>
  <tr>
    <td align="center" width="110">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="36" /><br/>
      <sub><b>React 19</b></sub>
    </td>
    <td align="center" width="110">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg" width="36" /><br/>
      <sub><b>Vite</b></sub>
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
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg" width="36" /><br/>
      <sub><b>Vercel</b></sub>
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

**Core dependencies**

| Package | Purpose |
|:---|:---|
| `react`, `react-dom` | UI framework |
| `react-router-dom` | Client-side routing with language-prefixed routes |
| `react-helmet-async` | Per-page `<head>` management for SEO |
| `vite`, `@vitejs/plugin-react` | Build tool, dev server, JSX transform |

> No backend. No database. No external API calls at runtime. All catalog data is served from static JSON files.

---

## Features

<details open>
<summary><b>Tool Directory</b></summary>
<br/>

- 1,291 free and open-source tools across 45+ categories
- Category-based filtering with sidebar navigation
- Full-text search with debounce and result highlighting
- **Real-time synchronized search**: the header and sidebar search bars share a single source of truth (`SearchContext`) — typing into or clearing either bar mirrors to the other instantly, with no submit or page reload required
- Platform filters (Linux, macOS, Windows, Web, Android, iOS, self-hosted)
- Tag filters (privacy, python, automation, fast, CLI, terminal, rust, …)
- Per-tool detail page (`/tools/:id`) with FAQ schema, related tools, and JSON-LD `SoftwareApplication`
- Featured Editor's Picks carousel on the home page

</details>

<details>
<summary><b>Abakada Toolkit (cross-product discovery)</b></summary>
<br/>

- A native promotion of the companion **Abakada Toolkit** app at [toolkit.abakada.org](https://toolkit.abakada.org/), surfaced in two places without disrupting the primary conversion path:
  - **Hero spotlight**: a compact, premium discovery card on the home hero with a theme-aware accent glow (teal in light, cyan in dark, via `color-mix`), a gradient icon chip, a "New" badge, and an "Explore" CTA — visually subordinate to the primary hero CTAs above it
  - **Footer banner**: a teal **Toolkit** pill in the footer's Abakada column
- Both links open in a new tab with `rel="noopener noreferrer"` and an accessible "opens in a new tab" label
- Discoverability: listed in the HTML sitemap's **External Resources** section and as an absolute entry in `sitemap.xml`
- Fully localized (`home.toolkit.*`, `footer.toolkit*`) across all four languages; respects `prefers-reduced-motion`, with a `@supports` fallback for browsers without `color-mix()`

</details>

<details>
<summary><b>Learning Paths</b></summary>
<br/>

- 10 curated learning paths organized by role and goal:
  - Digital Foundations · Research Starter · Student Productivity · Teacher's Digital Classroom · Remote Team Collaboration · Workplace Productivity · Self-Directed Learner · Beginner Coding · Designer's Toolkit · Accountant's Essentials
- Onboarding modal on first visit prompts the user to choose a role (9 personas: Student, Educator, Professional, Self-Directed, New to Digital, Researcher, Developer, Designer, Accountant)
- Progress tracking persisted in `localStorage`, no account required
- Dedicated detail page per toolkit with stage-based accordion structure
- Hands-on task checklists per stage, persisted in `localStorage`
- Curriculum alignment section: DepEd K-12 and CHED framework tags displayed per toolkit
- `<CompletionCertificate />` component unlocked at 100% progress, printable/PDF-saveable
- Full i18n coverage: all UI strings in LearningPaths, LearningPathDetail, CompletionCertificate and the OnboardingModal are wired through `t()` across all four languages
- JSON-LD `Course` structured data per toolkit

</details>

<details>
<summary><b>Guided Micro-Lessons</b></summary>
<br/>

- Each learning-path stage can be studied as a paced, one-step-at-a-time **guided lesson** (`<MicroLesson />`) instead of a static checklist
- Steps are derived from the stage's existing learning objectives ("Learn") and hands-on tasks ("Try it") — no duplicated content
- **Read-aloud** via the Web Speech API (`speechSynthesis`), with a Filipino voice fallback (`fil-PH`) for Tagalog, Ilokano, and Bisaya — built for oral-first and low-literacy learners
- Text-first and low-bandwidth: no media, works offline, respects `prefers-reduced-motion`
- Task completion inside the lesson stays wired to the same `localStorage` progress as the checklist view

</details>

<details>
<summary><b>Offline Learning Packs</b></summary>
<br/>

- "Download for offline" on every learning path caches the entire pathway — its page shell, every recommended tool's detail shell, and the shared catalog/curriculum/translation data — into a **dedicated, durable Cache Storage bucket** (`abakada-packs`)
- The service worker is taught **never to purge** this bucket on deploy (unlike the versioned app-shell cache), so a downloaded pathway survives new releases
- Estimated download size shown up front (it matters on 2G); resilient per-asset download (one failed file never fails the pack); live progress; one-tap removal
- Designed for rural / unreliable-connectivity learners: download once on Wi-Fi, then study with no signal
- Managed from the Progress dashboard (list, total size, remove)

</details>

<details>
<summary><b>Learner Profile & Gamification (<code>/progress</code>)</b></summary>
<br/>

- A unified, **privacy-first** dashboard at `/progress` — no account, all state in `localStorage`
- **XP and a six-rung level ladder** (Newcomer → Explorer → Builder → Creator → Contributor → Advocate) mirroring the "consumer → creator → contributor" journey
- **Learning streaks** (current + longest, day-accurate) to reward consistency
- **Achievement badges** (12: First Steps, Explorer, Toolsmith, Hands-On, Stage Clear, Path Finisher, Scholar, Well-Rounded, Offline Ready, and three streak tiers)
- **Competency radar**: explored tools rolled up into the seven skill domains, rendered as a dependency-free SVG chart
- Per-path progress, "continue where you left off," headline stats, and downloaded-pack management
- Reactive across tabs via a lightweight change-event bus over `localStorage`; `noindex` (personal, not a public page)

</details>

<details>
<summary><b>Lite Mode (low-data / low-end devices)</b></summary>
<br/>

- Auto / On / Off data-saver toggle (on the Progress dashboard)
- **Auto** turns on when the device reports `Save-Data` or a 2G-class connection (`navigator.connection`)
- When active (`body.data-lite`), drops the featured carousel, decorative backgrounds, backdrop-blur, and large motion — cutting both bytes and render cost on cheap phones

</details>

<details>
<summary><b>Audience Pages</b></summary>
<br/>

- **Educators** (`/educators`): DepEd K-12 strand / CHED program browser that surfaces curriculum-aligned learning paths, a classroom starter kit, and a parent FAQ
- **Students** (`/students`): goal-based tool finder ("I want to…"), student learning paths with a "Start here" badge, free-vs-paid swaps, and a study-tips FAQ

</details>

<details>
<summary><b>Bookmarks</b></summary>
<br/>

- Save tools to a personal list, persisted entirely in `localStorage`
- Counter badge in header and mobile sidebar
- Dedicated `/bookmarks` page with full tool cards
- Background sync via IndexedDB queue when offline

</details>

<details>
<summary><b>Tool Comparison</b></summary>
<br/>

- Side-by-side comparison of up to 4 tools
- Counter badge in header and mobile sidebar
- Dedicated `/compare` page with structured attribute table
- Selection persists across navigation in `localStorage`

</details>

<details>
<summary><b>Glossary</b></summary>
<br/>

- 31 entries grouped into 10 thematic sections (Open-Source Licensing, Web Architecture, Search Visibility, Structured Data, Performance Metrics, Crawler Standards, AI, Software Properties, Audience & Localization, Educational Open Resources)
- Same legal-page layout pattern as Privacy Policy and Terms of Use for visual consistency
- JSON-LD `DefinedTermSet` for direct entity recognition
- Per-term anchor IDs for citation linking
- Localized intro and attribution sections in all four languages

</details>

<details>
<summary><b>Legal Pages</b></summary>
<br/>

- **Privacy Policy** (`/privacy`): 9 sections covering data collection, cookies, third-party links, security, and user rights
- **Terms of Use** (`/terms`): 17 enterprise-grade sections including:
  - Intellectual Property Rights and Abakada Marks
  - Acceptable Use Policy
  - Brand and Reputation Protection
  - Limitation of Liability (₱100 cap)
  - Indemnification
  - Governing Law (Republic of the Philippines)
- Both pages share the `legal-content` layout system for unified visual hierarchy

</details>

<details>
<summary><b>Partnerships</b></summary>
<br/>

- **Partnerships page** (`/partnerships`): three equal-weight partnership tiers, fully synced with the deck:
  - Community Supporter: for NGOs, schools, student organizations
  - Content & Editorial Partner: for educators, publishers, FOSS projects
  - Infrastructure Sponsor: for hosting/financial sponsors
- All three tiers rendered with identical visual weight, no "Recommended" badge or highlight on any tier
- Includes the same impact stats shown in the deck (1,291 tools · 45+ categories · 10 paths · 4 languages)
- **Partnership Deck** (`/partnership-deck`): 10-slide scroll-snap presentation with reveal-on-scroll animation, shared visual language and identical email CTA (`partnerships@abakada.org`) with the partnerships page; tier cards are visually equal with no featured/recommended callout
- **Download Pitch Deck**: dedicated download button on the CTA slide (slide 10) allowing users to directly download `Abakada-Impact-Pitch-Deck-2026.pdf` from `/assets/doc/`

</details>

<details>
<summary><b>Progressive Web App (PWA)</b></summary>
<br/>

- Service Worker with cache-first, network-first, and stale-while-revalidate strategies
- Full offline support with custom offline fallback page
- App-shell pre-cache on install
- **Two cache buckets**: a versioned app-shell cache (rotated each deploy) and a **durable `abakada-packs` bucket** for user-downloaded Offline Learning Packs that is never purged on release
- `CACHE_NAME` is **auto-versioned at build time** from the content-hashed asset fingerprints (`scripts/version-sw.mjs`), so a deploy can never ship a stale shell — no manual bump required
- Background sync for bookmark operations via IndexedDB queue
- App install via the header **Install App** button, shown only when the browser reports the app is installable (`usePWAInstall` over the native `beforeinstallprompt`). The earlier auto-popup "Add to Home Screen" banner has been retired in favor of this quieter, user-initiated entry point
- SW update notification banner: only on genuine updates, not first install
- Web App Manifest with shortcuts, icons, and screenshots

</details>

<details>
<summary><b>Internationalization (i18n)</b></summary>
<br/>

- 4 languages: English, Filipino (Tagalog), Ilokano, Bisaya (Cebuano)
- Language switcher in header
- URL-prefixed routes per language (`/`, `/tl`, `/ilo`, `/bis`, `/en`)
- Translation files stored at `public/assets/data/translations/{en,tl,ilo,bis}.json`
- **871 translation keys per language with full key parity** across all four files (enforced by the `i18n-parity` unit test; zero missing keys, zero English leakage)
- Full coverage of the newest modules — the Progress dashboard, guided micro-lessons, offline-pack UI, and Lite mode — translated natively, not machine-translated
- Brand/proper nouns and standard PH tech terms (Windows, GitHub, MIT, "API Development", "XP") are deliberately kept in English
- Complete Learning Paths module i18n: all UI strings in `LearningPaths.jsx`, `LearningPathDetail.jsx`, `CompletionCertificate.jsx`, and `OnboardingModal.jsx` wired through `t()`, no hardcoded English strings remain in the module
- New `learningPaths.*` keys include: difficulty labels, stats row, filter UI (tracks, levels, curriculum strands), DepEd/CHED authority labels, progress ring, stage body section headings, milestone messages, motivational nudge, certificate strings, and all 9 onboarding role labels
- `<html lang>` attribute syncs on language change (BIS maps to BCP-47 `ceb`)
- Native authoring: no machine translation
- Smooth opacity transition on language change

</details>

<details>
<summary><b>Theming</b></summary>
<br/>

- Light, dark, and system modes with auto-detection
- Manual override persisted in `localStorage`
- Smooth theme transition via CSS class
- Design token system via CSS custom properties (colors, spacing, radius, shadows, typography)
- Dot-grid backgrounds, glass-edge cards, layered depth

</details>

<details>
<summary><b>Loading Experience</b></summary>
<br/>

- Inline boot loader in `index.html`: glowing favicon with halo animation that renders before the JS bundle parses, automatically replaced by React on mount
- `<BrandLoader />` component with three variants (`block`, `inline`, `page`) used across:
  - React Suspense fallback for lazy routes
  - Initial `tools.json` fetch
  - Learning Paths and Learning Path Detail loading
- Theme-aware boot screen (auto-switches to dark background under `prefers-color-scheme: dark`)
- Respects `prefers-reduced-motion: reduce`, animation disabled, mark stays static
- All "Loading…" plain-text fallbacks have been removed in favor of the brand loader

</details>

<details>
<summary><b>Accessibility</b></summary>
<br/>

- Skip-to-main-content link
- ARIA roles, labels, and live regions throughout
- Focus-visible outlines on all interactive elements
- Semantic HTML (`<main>`, `<nav>`, `<article>`, `<section>`, `<dl>`, `<time>`)
- `prefers-reduced-motion` and `prefers-contrast: high` honored

</details>

<details>
<summary><b>Footer & Navigation</b></summary>
<br/>

- **Quick Links** column: All Tools · Bookmarks · Comparison Tools · Learning Paths · top categories
- **Resources** column: FAQ · Glossary · Contribute on GitHub · Open Source Initiative · Impact Pitch Deck (direct PDF download) · Privacy Policy · Terms of Use · Sitemap
- **Abakada** column: About · Official Partners · Partnerships · Contact, plus a **Toolkit** promo banner (teal pill) linking out to the companion app at [toolkit.abakada.org](https://toolkit.abakada.org/)
- **Featured In** strip: full-width press/media section below the column grid with theme-aware logo variants for GMA News Online, The Global Filipino Magazine, Walastech, and Bombo Radyo, each an external link (`target="_blank" rel="noopener noreferrer"`)
- All link labels translated across en/tl/ilo/bis
- Visitor count pill: improved contrast (medium font weight, accent-tinted icon, subtle filled background) showing total visitors and last update from `visitors.json`
- Header language switcher includes BIS, ILO, TL, EN with native and BCP-47 `<html lang>` mapping
- Header navigation includes a **My Progress** link (`/progress`) alongside Saved, Compare, and Learn
- **Global header search** (all pages) with a one-click **clear (×) button** that appears while typing, wipes the query, and refocuses the input — colors are theme-token driven for legibility in both Light and Dark modes. On the home desktop view the header and sidebar search bars are **synchronized in real time** through a shared `SearchContext` (single source of truth): editing or clearing either bar instantly updates the other
- Learning Paths header icon adopts accent color when the current route is `/learning-paths` or any sub-path, using `useLocation` + `stripLangPrefix` for language-prefix-aware route matching; `aria-current="section"` set for screen readers
- Theme-consistent iconography: the active-filter **"Clear filters"** control renders its icon in the same accent color as its label across both themes (icon drawn via a CSS `mask` so it inherits `currentColor`, fixing a dark-mode mismatch)

</details>

<details>
<summary><b>Security</b></summary>
<br/>

- Strict Content Security Policy single-sourced into `vercel.json` (the served header) and the `index.html` `<meta>` fallback
- Security headers: `Strict-Transport-Security`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`
- Console warning, context-menu disable, and selection disable on tool card content
- Passive bot signal collection (dev-only logging)
- Email obfuscation utility
- AI-scraper rules in `robots.txt` (GPTBot, CCBot, Claude-Web, etc.)

</details>

---

## Pages & Routing

Public routes are prerendered at build time and lazy-loaded via `React.lazy`. Each route also serves under language prefixes (`/tl`, `/ilo`, `/bis`, `/en`). On desktop, the global sidebar is an **intelligent auto-hide rail**: collapsed by default, it dismisses when you interact with the main content or press `Escape`; on mobile it is an off-canvas drawer with a scrim.

| Route | Description | Sidebar |
|:---|:---|:---:|
| `/` | Home: directory with search, filters, featured carousel | Inline filter sidebar |
| `/tools/:id` | Per-tool detail page with FAQ, related tools, structured data | Auto-hide |
| `/learning-paths` | Learning path index | Auto-hide |
| `/learning-paths/:id` | Learning path detail with guided micro-lessons + offline download | Auto-hide |
| `/educators` | DepEd/CHED curriculum browser, classroom kit, parent FAQ | Auto-hide |
| `/students` | Goal-based tool finder, student paths, study tips | Auto-hide |
| `/progress` | Learner profile: level, streak, badges, competency radar, downloads (`noindex`, not prerendered) | Auto-hide |
| `/bookmarks` | Saved tools | Auto-hide |
| `/compare` | Compare up to 4 tools | Auto-hide |
| `/glossary` | 31-entry glossary in 10 sections | Auto-hide |
| `/about` | About Abakada | Auto-hide |
| `/contact` | Contact page | Auto-hide |
| `/faq` | Frequently Asked Questions | Auto-hide |
| `/privacy` | Privacy Policy | Auto-hide |
| `/terms` | Terms of Use | Auto-hide |
| `/partnerships` | Partnership tiers and stats | Auto-hide |
| `/partnership-deck` | 10-slide presentation | Hidden |
| `/official-partners` | Official partner logos: BetterGov PH, Vaultera Labs, ElevenLabs | Auto-hide |
| `/sitemap` | HTML sitemap: all pages, features, and categories, plus an **External Resources** section (Abakada Toolkit, GitHub, OSI) | Auto-hide |

> The `<html lang>` attribute, `og:locale`, and `hreflang` alternates update automatically per route and language.

---

## Localization (i18n)

```
public/assets/data/translations/
├── en.json    English
├── tl.json    Filipino / Tagalog
├── ilo.json   Ilokano
└── bis.json   Bisaya / Cebuano (BCP-47: ceb)
```

- **871 keys per language** with verified parity across all four files
- Top-level groups: `meta`, `languages`, `nav`, `hero`, `home`, `trust`, `beginnerPicks`, `groups`, `categories`, `categoryDescriptions`, `tools`, `install`, `featured`, `platforms`, `search`, `filters`, `pagination`, `theme`, `footer`, `accessibility`, `common`, `health`, `license`, `time`, `pages`, `consent`, `pwa`, `bookmark`, `compare`, `learningPaths`, `onboarding`, `cta`, `breadcrumb`, `errors`, `deck`, `bookmarks`, `glossary`, `progress`
- Dynamic-prefix lookups: `groups.${id}`, `categories.${id}`, `learningPaths.role.${id}`, `learningPaths.${difficulty}`, `progress.level.${name}`, `progress.badge.${id}`
- The home `Toolkit` spotlight and footer `Toolkit` banner are localized via `home.toolkit.*` and `footer.toolkit*`
- Translations are authored editorially per language: no machine translation
- Adding a new key requires updating all four files; CI verifies parity at build time

**Language detection priority:**
1. URL prefix (`/tl/...`)
2. `localStorage` (`abakada-language`)
3. `navigator.language` (`tl`/`fil` → tl, `ilo` → ilo, `ceb`/`bis` → bis)
4. Default: `en`

---

## SEO, AEO & GEO

The site is built for traditional search engines (SEO), generative answer engines (GEO: ChatGPT, Perplexity, Bing Copilot, Google AI Overviews), and direct-answer surfaces (AEO: featured snippets, knowledge panels).

**Per-page `<head>` management** via `react-helmet-async` and a centralized `pageMeta` config:

- Page-specific `<title>` and meta description (≤ 60 chars / ≤ 160 chars)
- Open Graph and Twitter Card tags with locale-correct `og:locale`
- Canonical URLs and hreflang alternates per language (`en`, `tl`, `ilo`, `ceb`, `x-default`)
- Robots directives (`index, follow, max-snippet:-1, max-image-preview:large`)

**Structured data (JSON-LD)**: the catalog ships these schema.org types:

| Type | Where |
|:---|:---|
| `WebSite` + `SearchAction` | Site root |
| `Organization` | Site root |
| `EducationalOrganization` | Site root, with founder Person |
| `WebPage` | Home |
| `ItemList` | Home (top categories), Learning Paths |
| `BreadcrumbList` | Every page |
| `FAQPage` | FAQ + per-tool pages |
| `Course` | Each learning path |
| `SoftwareApplication` + `Review` + `Offer` | Each tool detail page |
| `DefinedTermSet` + `DefinedTerm` | Glossary |
| `AboutPage` | About |
| `ContactPage` | Contact |

**Crawler-aware delivery:**

- `sitemap.xml` regenerated on every build via `scripts/refresh-sitemap.js`
  - 1,317 URLs total: 15 static + 1 external (the Abakada Toolkit companion app) + 10 toolkits + 1,291 tools (the `noindex` `/progress` and `/bookmarks` are intentionally excluded)
  - Each internal URL carries hreflang alternates for all four languages; the external Toolkit URL is listed as an absolute `<loc>` with no hreflang
  - Image sitemap entry on the home route
- `llms.txt` published at the site root summarizing site purpose and key URLs
- `robots.txt` with per-bot rules: search retrievers allowed, training crawlers (GPTBot, CCBot, Claude-Web) blocked
- `scripts/prerender-shells.js` writes a static HTML shell per route after build, so first-byte already contains the correct title, description, canonical, and OG tags before JS executes

---

## Performance

| Optimization | Details |
|:---|:---|
| Code splitting | All pages lazy-loaded via `React.lazy` + `Suspense` |
| Vendor chunk | React, React Router, Helmet split into a long-lived cached bundle |
| Content-hash filenames | `entry-[hash].js`, `chunk-[hash].js`, `asset-[hash].ext` for `Cache-Control: max-age=31536000, immutable` |
| Inline boot loader | Glowing favicon SVG inside `#root`, renders before JS parses, replaced by React on mount |
| `tools.json` preload | `<link rel="preload" as="fetch" type="application/json" crossorigin>` so the 1.2 MB catalog downloads in parallel with JS |
| Font preloads | All 4 Inter weights as `font/woff2` with `crossorigin` |
| DNS prefetch + preconnect | Google Tag Manager, Google Analytics |
| Service Worker | App-shell precache + runtime cache strategies |
| Static prerendering | 1,315 HTML shells written by `scripts/prerender-shells.js` |
| Image hints | `loading="lazy"` + `decoding="async"` on below-the-fold images; `fetchpriority="high"` on the header logo |
| Minification | esbuild, ES2020 target, sourcemaps off in production |
| Compression | Brotli + gzip, automatic on the Vercel edge |
| Cache headers | `/assets/*` immutable for 1 year; HTML revalidates on every request |
| Web Vitals | `reportWebVitals()` instruments LCP, CLS, INP for monitoring |

**Bundle footprint (gzipped, latest build):**

| Chunk | Size |
|:---|---:|
| `vendor` (React + Router + Helmet) | 69.6 KB |
| CSS (full design system) | 32.2 KB |
| App entry (`index`, shell + contexts + header/footer) | 24.4 KB |
| `PartnershipDeck` | 11.1 KB |
| `LearningPathDetail` (stages + micro-lessons + offline) | 8.7 KB |
| `Home` (directory, hero, filters, Toolkit spotlight) | 6.5 KB |
| `Progress` (learner dashboard) | 5.2 KB |
| `LearningPaths` | 4.5 KB |
| Average page chunk | < 5 KB |
| Total build time | ~2.1 s |

---

## Project Architecture

```
abakada.org/
├── public/
│   ├── assets/
│   │   ├── data/
│   │   │   ├── tools.json                # All tool data (1,291 entries)
│   │   │   ├── tools-index.json          # Lightweight search index (prebuild-generated)
│   │   │   ├── learning-paths.json       # 10 toolkits with stages
│   │   │   ├── curriculum.json           # DepEd K-12 and CHED strand definitions
│   │   │   ├── visitors.json             # Updated hourly via GitHub Action
│   │   │   └── translations/             # i18n JSON files (en, tl, ilo, bis) — 871 keys each
│   │   ├── doc/                          # Downloadable documents (Pitch Deck PDF)
│   │   ├── fonts/                        # Self-hosted Inter woff2 files
│   │   ├── logo/                         # Favicons, OG image, brand logos
│   │   ├── partner/                      # Official partner logos (light + dark variants)
│   │   │                                 # BetterGov PH · Vaultera Labs · ElevenLabs
│   │   └── press/                        # Press / media logos (light + dark variants)
│   │                                     # GMA News Online · The Global Filipino Magazine
│   │                                     # Walastech · Bombo Radyo
│   ├── llms.txt                          # LLM-ingestion summary
│   ├── offline.html                      # Offline fallback page
│   ├── robots.txt                        # Per-bot rules incl. AI scraper blocks
│   ├── sitemap.xml                       # Generated at build time
│   ├── site.webmanifest                  # PWA manifest
│   └── sw.js                             # Service Worker
├── scripts/
│   ├── refresh-sitemap.js                # prebuild: regenerates sitemap.xml (static + external Toolkit + toolkits + tools)
│   ├── build-search-index.mjs            # prebuild: writes tools-index.json
│   ├── security-headers.mjs              # prebuild: generates headers artifacts
│   ├── prerender-shells.js               # postbuild: writes 1,315 static HTML shells
│   ├── verify-csp.mjs                    # postbuild: asserts CSP parity across configs
│   ├── version-sw.mjs                    # postbuild: stamps sw.js CACHE_NAME from hashes
│   ├── validate-data.mjs                 # JSON-Schema validation of catalog data
├── src/
│   ├── components/
│   │   ├── BrandLoader.jsx               # Glowing-favicon loading indicator
│   │   ├── CompletionCertificate.jsx     # Printable/PDF certificate, unlocked at 100% LP progress
│   │   ├── ErrorBoundary.jsx
│   │   ├── FeaturedCarousel.jsx
│   │   ├── Footer.jsx                    # "Featured In" press strip + PRESS data + Toolkit promo banner
│   │   ├── Header.jsx                    # Global search (shared SearchContext) + active-state accent on LP icon
│   │   ├── Icon.jsx
│   │   ├── LearningToolCard.jsx
│   │   ├── MicroLesson.jsx               # Paced guided lesson with read-aloud (TTS)
│   │   ├── OfflinePackButton.jsx         # Download/manage a path's offline pack
│   │   ├── OnboardingModal.jsx
│   │   ├── Pagination.jsx
│   │   ├── SEO.jsx                       # react-helmet-async wrapper
│   │   ├── Sidebar.jsx                   # Intelligent auto-hide rail / mobile drawer
│   │   ├── StaticPageLayout.jsx
│   │   ├── ToolCard.jsx
│   │   └── ToolModal.jsx
│   ├── contexts/
│   │   ├── BookmarkContext.jsx
│   │   ├── ComparisonContext.jsx
│   │   ├── I18nContext.jsx               # Language detection, URL routing, translations
│   │   ├── SearchContext.jsx             # Shared search state: header ⇄ sidebar single source of truth
│   │   └── ThemeContext.jsx
│   ├── hooks/
│   │   ├── useComparison.js
│   │   ├── useLiteMode.js                 # Data-saver mode (auto from connection)
│   │   ├── useLowBandwidth.js
│   │   ├── useProfile.js                  # Reactive XP/level/streak/badges/competencies
│   │   ├── useProgress.js                 # Per-toolkit explored tools (feeds the profile)
│   │   ├── usePWAInstall.js
│   │   ├── useSearch.js                    # Catalog scoring/filtering; debounces the shared SearchContext input
│   │   └── useVisitorCount.js
│   ├── lib/
│   │   ├── canonical.js                  # SITE_ORIGIN, hreflang, language helpers
│   │   ├── categoryGroups.js             # Category → skill-domain map (sidebar + radar)
│   │   ├── comparison.js
│   │   ├── curriculum.js                 # DepEd/CHED strand helpers
│   │   ├── downloadFile.js
│   │   ├── icons.js
│   │   ├── offlinePacks.js               # Build/download/remove durable offline packs
│   │   ├── pageMeta.js                   # Per-page <head> metadata
│   │   ├── profile.js                    # Pure XP/level/badge/competency/streak compute
│   │   ├── progressStore.js              # localStorage keys, activity log, change-event bus
│   │   ├── reportError.js                # Production error reporter (POST to VITE_ERROR_REPORT_URL)
│   │   ├── security.js
│   │   ├── studentGoals.js
│   │   └── vitals.js                     # Core Web Vitals reporter
│   ├── pages/
│   │   ├── About.jsx
│   │   ├── Bookmarks.jsx
│   │   ├── Compare.jsx
│   │   ├── Contact.jsx
│   │   ├── Educators.jsx                  # DepEd/CHED curriculum browser + classroom kit
│   │   ├── FAQ.jsx
│   │   ├── Glossary.jsx
│   │   ├── Home.jsx
│   │   ├── LearningPathDetail.jsx         # Stages, guided micro-lessons, offline download
│   │   ├── LearningPaths.jsx
│   │   ├── NotFound.jsx
│   │   ├── OfficialPartners.jsx
│   │   ├── Partnerships.jsx
│   │   ├── PartnershipDeck.jsx
│   │   ├── Privacy.jsx
│   │   ├── Progress.jsx                   # Learner profile: level, streak, badges, radar, packs
│   │   ├── Sitemap.jsx
│   │   ├── Students.jsx                   # Goal-based finder + student paths
│   │   ├── Terms.jsx
│   │   └── ToolDetail.jsx
│   ├── styles/
│   │   ├── animations.css                # Keyframes + BrandLoader animation
│   │   ├── base.css                      # Resets, typography
│   │   ├── components.css                # Per-component styles
│   │   ├── inter.css                     # Self-hosted font face
│   │   ├── layout.css                    # Grid, header, footer, sidebar layouts
│   │   └── themes.css                    # Light / dark CSS custom properties
│   ├── App.jsx                           # Routes, lazy loading, language-aware route checks
│   └── main.jsx                          # Entry point + service worker registration
├── .github/
│   └── workflows/
│       ├── ci.yml                        # Quality gate: lint, types, data, tests, build, audit
│       ├── fetch-visitors.yml            # Hourly GA4 visitor count → visitors.json → commit (triggers Vercel)
│       ├── lighthouse.yml                # Lighthouse CI on PRs
│       ├── sitemap-refresh.yml           # Scheduled sitemap regeneration
│       └── uptime.yml                    # Synthetic uptime monitoring
├── .lighthouserc.json                    # Lighthouse CI config
├── index.html                            # Inline boot loader + SEO meta
├── vercel.json                           # SPA rewrites + security headers
├── vite.config.js                        # Vendor split, content hashing, ES2020 target
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 24 (CI and Vercel both build on Node 24; `package.json` `engines` pins `24.x`)
- npm 9 or higher

### Installation

```bash
git clone https://github.com/ramonloganjr/abakada.org.git
cd abakada.org
npm install
```

### Run the dev server

```bash
npm run dev
```

Opens at `http://localhost:5173`. HMR is enabled. File changes apply instantly.

---

## Development Workflow

### Branching

- `main`: production; auto-deployed
- Feature branches use the pattern `feat/<short-description>`
- Bugfix branches use `fix/<short-description>`

### Common scripts

```bash
npm run dev            # Vite dev server with HMR (http://localhost:5173)
npm run lint           # ESLint over src/
npm run typecheck      # tsc --noEmit (JSDoc/types)
npm run validate:data  # JSON-Schema validation of tools / learning-paths data
npm test               # Node unit tests (tests/**/*.test.mjs)
npm run test:e2e       # Playwright e2e + accessibility (axe) suite
npm run sitemap        # Regenerate public/sitemap.xml from data
npm run build          # Production build (runs prebuild + build + postbuild)
npm run preview        # Preview the production bundle locally (http://localhost:4173)
```

The `build` lifecycle runs three phases:

1. `prebuild` →
   - `scripts/refresh-sitemap.js` — regenerates `public/sitemap.xml` from the data
   - `scripts/build-search-index.mjs` — writes the lightweight `tools-index.json`
   - `scripts/security-headers.mjs` — generates the headers artifacts
2. `build` → `vite build` produces `dist/` (vendor split, content-hashed assets, ES2020, esbuild minify)
3. `postbuild` →
   - `scripts/prerender-shells.js` — writes 1,315 static HTML shells (14 static + 10 toolkits + 1,291 tools)
   - `scripts/verify-csp.mjs` — fails the build if `vercel.json` carries no CSP, and (in strict hash mode) if any built inline script is not covered by it
   - `scripts/version-sw.mjs` — stamps `CACHE_NAME` in `dist/sw.js` from the asset fingerprints

### Working with translations

1. Add the new key to `public/assets/data/translations/en.json`
2. Add corresponding keys to `tl.json`, `ilo.json`, `bis.json`
3. Use it in JSX via `useI18n()`:
   ```jsx
   const { t } = useI18n()
   t('section.key', 'English fallback')
   ```
4. The fallback string serves as the source of truth if the key is missing

### Adding a new page

1. Create the component in `src/pages/`
2. Add a `lazy()` import and `<Route>` in `src/App.jsx`
3. Add metadata to `src/lib/pageMeta.js`
4. Add the path to `STATIC_SIDEBAR_PATHS` in `App.jsx` if it should use the collapsible sidebar
5. Add the path to `scripts/refresh-sitemap.js` and `scripts/prerender-shells.js`
6. Add corresponding translation keys to all four language files
7. Add a footer / sidebar link if the page should be discoverable

---

## Production Build

```bash
npm run build
```

Produces a fully static `dist/` containing:

- `dist/index.html`: root SPA shell (with inline boot loader)
- `dist/<route>/index.html`: 1,315 prerendered route shells (plus the root shell = 1,316 HTML files total)
- `dist/assets/*.js`: content-hashed JS chunks
- `dist/assets/*.css`: content-hashed CSS bundles
- `dist/assets/data/*`: JSON catalog and translations
- `dist/assets/fonts/*`: self-hosted Inter
- `dist/assets/logo/*`: brand assets
- `dist/sitemap.xml`, `dist/robots.txt`, `dist/llms.txt`, `dist/sw.js`, `dist/offline.html`, `dist/site.webmanifest`

Deploy the `dist/` folder verbatim. Every file in it is intended to be uploaded.

---

The site is a folder of static files. There is no server runtime, no environment variables required at runtime, and no build step on the host — everything is produced locally or in CI and uploaded as-is.

### Production deploy

Vercel's Git integration **is** the pipeline: every push to `main` builds and promotes to production, and every pull request gets its own preview URL. There is deliberately no deploy workflow in `.github/workflows/` — none is needed, and a second deployer would race Vercel for the same origin.

Build settings are pinned in [`vercel.json`](./vercel.json) rather than left to dashboard state or framework auto-detection:

| Setting | Value |
|:---|:---|
| `framework` | `vite` |
| `installCommand` | `npm ci` (lockfile-exact) |
| `buildCommand` | `npm run build` (runs `prebuild` and `postbuild`) |
| `outputDirectory` | `dist` |

The Node version comes from `engines.node` in `package.json` (`24.x`), matching `.nvmrc` and every CI workflow. Vercel does **not** read `.nvmrc`, so leaving a range there would build on Vercel's default major instead of the one CI tests.

`.vercelignore` keeps test, lint and docs files out of the deployment upload; everything `npm run build` reads stays in.

### What `vercel.json` provides

- **SPA fallback** — any route with no prerendered file serves `index.html`, so deep links such as `/learning-paths/beginner-coding` and `/tl/progress` survive a refresh. Real files are excluded from the rewrite: `/assets/*`, `sw.js`, `robots.txt`, `sitemap.xml`, `llms.txt`, `icons.svg`, `site.webmanifest`, `favicon*`, `offline.html`.
- **Prerendered routes win** — Vercel checks the filesystem before applying rewrites, so each of the 1,315 prerendered shells serves its own `<title>`, meta description, canonical and JSON-LD instead of the generic app shell. This is what keeps the SEO/AEO/GEO layer intact; verify it on a preview with `curl -s <url>/tools/vlc | grep '<title>'`.
- **Security headers** on every response — HSTS with preload, CSP, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, COOP/CORP.
- **Cache control** — `/assets/*` immutable for a year (content-hashed), `/assets/data/*` one hour plus `stale-while-revalidate`, `sw.js` never cached.
- **PDF handling** — `/assets/doc/*` forced to download via `Content-Disposition: attachment`.
- **Clean URLs** — `cleanUrls: true` and `trailingSlash: false`, matching the canonical URLs the prerenderer emits.

Brotli and gzip compression are automatic on Vercel's edge; there is nothing to configure.

### Visitor count

An hourly GitHub Action (`fetch-visitors.yml`) pulls the live GA4 total and commits `visitors.json` when it changes. That commit **is** the deploy trigger, so its message deliberately carries no `[skip ci]` marker: Vercel treats `[skip ci]`, `[ci skip]` and `[no ci]` as "do not deploy", which would freeze the live count at whatever the last unrelated deploy happened to ship. No GitHub workflow runs on push to `main`, so dropping the marker wakes nothing else.

`visitors.json` is **kept in `dist/`** so the Total Visitors badge is present after every deploy; a manual build ships a value at most ~1h stale. Run `git pull` before a manual build to ship the freshest committed value.

### Service Worker cache version

No manual action required: `CACHE_NAME` in `dist/sw.js` is stamped automatically from the build's asset fingerprints by `scripts/version-sw.mjs` (postbuild), so returning users always get fresh assets after a deploy. The durable `abakada-packs` bucket (downloaded Offline Learning Packs) is intentionally **not** rotated.

---

## Configuration

### Adding or updating tools

Edit `public/assets/data/tools.json`. Each entry:

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
  "lastReviewed": "2026-05-09",
  "featured": false
}
```

### Updating learning paths

Edit `public/assets/data/learning-paths.json`. Each toolkit references tool IDs by their `id` in `tools.json`.

### Updating page metadata

Edit `src/lib/pageMeta.js`. Each page exports a config object consumed by `<SEO />`:

```js
home: {
  title: 'Page Title',
  description: '≤ 160 chars',
  pathname: '/',
  jsonLd: breadcrumb([{ name: 'Home', path: '/' }])
}
```

---

## GitHub Actions

| Workflow | Trigger | Purpose |
|:---|:---|:---|
| `ci.yml` | `pull_request`, `push` | Quality gate: `lint` → `typecheck` → `validate:data` → `npm test` → `build` → `npm audit` (high). Red builds never merge. |
| `fetch-visitors.yml` | `schedule` (hourly) + manual | Pulls the cumulative `totalUsers` from the GA4 Data API into `visitors.json` and commits it, which triggers a Vercel production deploy. Skips when unchanged. |
| `lighthouse.yml` | `pull_request` | Runs Lighthouse CI against the preview URL |
| `sitemap-refresh.yml` | `schedule` | Regenerates `sitemap.xml` against current data |
| `uptime.yml` | `schedule` | Synthetic uptime / liveness monitoring of the live site |

Required repository secrets:

| Secret | Used by |
|:---|:---|
| `GA4_SERVICE_ACCOUNT_KEY` (full JSON key) | `fetch-visitors.yml`: GA4 Data API access |

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

See [LICENSE.md](./LICENSE.md) for full terms. For partnership or licensing inquiries, contact [partnerships@abakada.org](mailto:partnerships@abakada.org).

---

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) in full before submitting any pull requests or issues.

---

## Security

To report a vulnerability, do not open a public issue. See [SECURITY.md](./SECURITY.md) for the private disclosure process and a full overview of the security architecture.
