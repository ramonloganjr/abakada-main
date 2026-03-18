# Contributing Guidelines

Thank you for your interest in contributing to Abakada.org. This document outlines the standards, processes, and expectations for all contributors. Please read it in full before submitting any contribution.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Who Can Contribute](#who-can-contribute)
3. [What You Can Contribute](#what-you-can-contribute)
4. [What Is Not Accepted](#what-is-not-accepted)
5. [Getting Started](#getting-started)
6. [Branch Naming](#branch-naming)
7. [Commit Message Standards](#commit-message-standards)
8. [Pull Request Process](#pull-request-process)
9. [Code Standards](#code-standards)
10. [Adding or Updating Tools](#adding-or-updating-tools)
11. [Translation Contributions](#translation-contributions)
12. [Reporting Bugs](#reporting-bugs)
13. [Security Vulnerabilities](#security-vulnerabilities)
14. [Licensing](#licensing)

---

## Code of Conduct

All contributors are expected to maintain a respectful, professional, and constructive environment. The following behaviors will result in immediate removal from the project:

- Harassment, discrimination, or personal attacks of any kind
- Submitting malicious, deceptive, or intentionally broken code
- Plagiarism or misrepresentation of authorship
- Spamming issues, pull requests, or discussions

The project maintainer reserves the right to reject any contribution and ban any contributor without prior notice if these standards are violated.

---

## Who Can Contribute

Contributions are welcome from anyone, provided they comply with these guidelines. By submitting a contribution, you confirm that:

- You are the original author of the submitted work, or have the legal right to submit it
- Your contribution does not violate any third-party license, copyright, or intellectual property rights
- You agree to license your contribution under the terms described in [LICENSE.md](./LICENSE.md)

---

## What You Can Contribute

- Bug fixes with a clear description of the problem and the fix
- Performance improvements with measurable justification
- Accessibility improvements
- New tool entries to `tools.json` that meet the quality criteria
- Translation corrections or additions for supported languages
- Documentation improvements
- UI/UX improvements that align with the existing design system

---

## What Is Not Accepted

- Contributions that introduce external runtime dependencies without prior discussion
- Rewrites or refactors of core architecture without an approved proposal
- Tool entries for paid, proprietary, or non-open-source software
- Tool entries for tools that are abandoned, unmaintained, or have known security issues
- Duplicate tool entries
- Unsolicited redesigns or theme changes
- AI-generated content submitted without human review and verification
- Changes to `LICENSE.md`, `CONTRIBUTING.md`, or `README.md` without maintainer approval

---

## Getting Started

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/your-username/abakada.org.git
cd abakada.org

# Install dependencies
npm install

# Start the development server
npm run dev
```

Before making any changes, ensure your fork is up to date with the main branch:

```bash
git remote add upstream https://github.com/abakada-org/abakada.org.git
git fetch upstream
git checkout main
git merge upstream/main
```

---

## Branch Naming

All branches must follow this naming convention:

| Type | Pattern | Example |
|---|---|---|
| Bug fix | `fix/short-description` | `fix/modal-close-on-escape` |
| Feature | `feat/short-description` | `feat/filter-by-license` |
| Tool data | `data/tool-name` | `data/add-libreoffice` |
| Translation | `i18n/language-code` | `i18n/tl-corrections` |
| Documentation | `docs/short-description` | `docs/update-readme` |
| Performance | `perf/short-description` | `perf/reduce-bundle-size` |

Do not work directly on `main`. Pull requests from `main` branches of forks will be rejected.

---

## Commit Message Standards

All commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

**Format:**

```
<type>(<scope>): <short summary>
```

**Types:**

| Type | When to Use |
|---|---|
| `feat` | A new feature or capability |
| `fix` | A bug fix |
| `perf` | A performance improvement |
| `refactor` | Code change that is neither a fix nor a feature |
| `style` | CSS or formatting changes only |
| `docs` | Documentation changes only |
| `data` | Changes to `tools.json` or `learning-paths.json` |
| `i18n` | Translation file changes |
| `chore` | Build config, tooling, or dependency updates |

**Rules:**

- The summary must be in lowercase and imperative mood: `fix modal close behavior`, not `Fixed modal` or `Fixes modal`
- Maximum 72 characters in the subject line
- Do not end the subject line with a period
- Reference issue numbers in the body when applicable: `Closes #42`

**Examples:**

```
feat(search): add debounce to search input
fix(sidebar): correct collapsed state on route change
data(tools): add LibreOffice to productivity category
i18n(tl): correct translation for "download" key
perf(build): split vendor chunk to improve cache hit rate
```

---

## Pull Request Process

1. Ensure your branch is up to date with `upstream/main` before opening a PR
2. Run the build and confirm it passes with no errors: `npm run build`
3. Test your changes in both light and dark mode
4. Test on at least one mobile viewport (375px width minimum)
5. Fill out the pull request template completely — incomplete PRs will be closed
6. One pull request per concern — do not bundle unrelated changes
7. Do not force-push to a PR branch after review has started
8. All review comments must be resolved before a PR can be merged
9. The maintainer may request changes, close, or reject any PR at their discretion

**Pull Request Title Format:**

Follow the same Conventional Commits format as commit messages:

```
feat(learning-paths): add developer role path
fix(pwa): prevent install banner on standalone mode
```

---

## Code Standards

### General

- Write clean, readable, self-documenting code
- Remove all `console.log` statements before submitting
- Do not leave commented-out code blocks in the final submission
- Keep functions small and single-purpose
- Avoid introducing new global state unless absolutely necessary

### JavaScript / JSX

- Use ES modules (`import`/`export`) — no CommonJS
- Use functional React components only — no class components
- Use hooks for state and side effects
- Destructure props at the function signature level
- Avoid inline styles except for dynamic values that cannot be expressed in CSS
- All event handler props must be prefixed with `on`: `onClick`, `onChange`, `onClose`
- Use `type="button"` on all `<button>` elements that are not form submit buttons

### CSS

- Use CSS custom properties (design tokens) from `src/styles/themes.css` — do not hardcode color values
- Follow the existing BEM-inspired naming convention: `.block__element--modifier`
- Do not use `!important` except to override third-party styles
- All new component styles go in `src/styles/components.css`
- All layout changes go in `src/styles/layout.css`
- Every new visual component must include a `prefers-reduced-motion` rule if it uses animation or transition

### Accessibility

- All interactive elements must be keyboard accessible
- All images must have meaningful `alt` text, or `alt=""` if purely decorative
- Use semantic HTML elements (`<nav>`, `<main>`, `<section>`, `<article>`, `<button>`, etc.)
- Do not remove `focus-visible` outlines
- ARIA attributes must be used correctly and only when native HTML semantics are insufficient

---

## Adding or Updating Tools

Tool data lives in `public/assets/data/tools.json`.

### Criteria for Inclusion

A tool must meet all of the following to be accepted:

- Free to use with no mandatory paid tier for core functionality
- Open-source or source-available with a recognized license (MIT, GPL, Apache, MPL, etc.)
- Actively maintained — last commit or release within the past 24 months
- Has a stable, publicly accessible website or repository
- Relevant to the needs of Filipino students, educators, scholars, or professionals

### Required Fields

```json
{
  "id": "unique-kebab-case-id",
  "name": "Tool Name",
  "tagline": "One sentence, under 80 characters",
  "description": "Two to four sentences. Factual, no marketing language.",
  "category": "existing-category-slug",
  "platforms": ["Windows", "macOS", "Linux", "Web", "Android", "iOS"],
  "license": "MIT",
  "tags": ["tag1", "tag2"],
  "url": "https://tool-website.com",
  "download_url": "https://tool-website.com/download",
  "featured": false
}
```

### Rules

- `id` must be unique across the entire file — check before submitting
- `tagline` must be factual and neutral — no superlatives, no marketing language
- `description` must be original — do not copy text from the tool's website
- `category` must be an existing category slug — do not create new categories without prior discussion
- `platforms` must only include platforms the tool genuinely supports
- `url` and `download_url` must be direct, stable URLs — no redirect chains or affiliate links
- `featured` must always be `false` in contributions — featured status is set by the maintainer only

---

## Translation Contributions

Translation files are located in `public/assets/data/translations/`.

Supported languages:

| File | Language |
|---|---|
| `en.json` | English |
| `tl.json` | Filipino / Tagalog |
| `bis.json` | Bisaya / Cebuano |
| `ilo.json` | Ilokano |

### Rules

- Do not add new translation keys — only correct or improve existing values
- Translations must be natural and idiomatic — avoid direct machine translation
- Maintain the exact same JSON key structure as `en.json`
- Do not alter the English (`en.json`) file unless correcting a factual error
- If you are proposing a new language, open an issue first for discussion before submitting a PR

---

## Reporting Bugs

Open a GitHub Issue with the following information:

1. A clear, descriptive title
2. Steps to reproduce the issue
3. Expected behavior
4. Actual behavior
5. Browser name and version
6. Device type and operating system
7. Screenshots or screen recordings if applicable

Issues that do not include sufficient information to reproduce the bug will be closed without action.

---

## Security Vulnerabilities

Do not report security vulnerabilities through public GitHub Issues.

Send a detailed report directly to: [hello@abakada.org](mailto:hello@abakada.org)

Include:
- A description of the vulnerability
- Steps to reproduce or proof of concept
- Potential impact assessment
- Your suggested remediation if applicable

You will receive a response within 72 hours. Please allow reasonable time for the issue to be assessed and patched before any public disclosure.

---

## Licensing

By submitting a contribution to this repository, you agree that:

- Your code contributions are licensed under the **MIT License**
- Your content contributions (data, translations, documentation) are licensed under **CC BY 4.0**
- You grant the project maintainer the right to use, modify, and distribute your contribution under these terms
- You will not submit contributions that conflict with these license terms

See [LICENSE.md](./LICENSE.md) for full license text.

---

Maintained by [Ramon Logan Jr.](https://ramonloganjr.com) — [hello@abakada.org](mailto:hello@abakada.org)
