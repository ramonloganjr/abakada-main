<div align="center">

# Security Policy

<p>
  <a href="mailto:hello@abakada.org"><img src="https://img.shields.io/badge/Report-hello@abakada.org-c0392b?style=flat-square&logo=gmail&logoColor=white" alt="Report" /></a>
  <img src="https://img.shields.io/badge/Disclosure-Coordinated-107f87?style=flat-square" alt="Coordinated Disclosure" />
  <img src="https://img.shields.io/badge/Bug%20Bounty-None-6b7280?style=flat-square" alt="No Bug Bounty" />
</p>

<p>This document defines the security policy for <a href="https://abakada.org">Abakada.org</a>, covering supported versions, vulnerability reporting, response timelines, disclosure process, and the security architecture of the production build.</p>

</div>

---

## Table of Contents

- [Supported Versions](#supported-versions)
- [Scope](#scope)
- [Reporting a Vulnerability](#reporting-a-vulnerability)
- [Response Process](#response-process)
- [Disclosure Policy](#disclosure-policy)
- [Security Architecture](#security-architecture)
- [Known Limitations](#known-limitations)
- [Contact](#contact)

---

## Supported Versions

Only the current production release of Abakada.org is actively maintained and receives security updates. No support is provided for older builds or self-hosted forks.

| Version | Supported |
|:---|:---:|
| Current (production) | Yes |
| Older / forked builds | No |

---

## Scope

### In Scope

| Category | Examples |
|:---|:---|
| Cross-site scripting (XSS) | Reflected, stored, or DOM-based XSS |
| CSP bypass | Content Security Policy misconfiguration or bypass |
| Data exposure | Sensitive data exposed via client-side code or static assets |
| Service Worker | Cache poisoning or SW exploitation |
| Clickjacking | UI redress attacks |
| Open redirect | Unvalidated redirect vulnerabilities |
| Insecure references | Direct object references in static data files |
| Supply chain | Malicious dependency injection |

### Out of Scope

- Vulnerabilities in third-party tools listed in the directory. Report those directly to the respective project
- Denial of service attacks against the hosting infrastructure
- Social engineering attacks targeting the maintainer or contributors
- Issues requiring physical access to a user's device
- Self-XSS or attacks requiring highly unlikely victim actions
- Theoretical vulnerabilities without a working proof of concept
- Automated scanner output submitted without manual verification

---

## Reporting a Vulnerability

> Do not report security vulnerabilities through public GitHub Issues, pull requests, or discussions. Public disclosure before a fix is in place puts users at risk.

Send your report privately to:

| Field | Value |
|:---|:---|
| Email | [hello@abakada.org](mailto:hello@abakada.org) |
| Subject | `[SECURITY] Brief description of the issue` |

### What to Include

A complete report must contain:

1. A clear description of the vulnerability and its potential impact
2. The affected URL, component, or file
3. Step-by-step instructions to reproduce the issue
4. Proof of concept code, payload, or screenshot if applicable
5. Your severity assessment: Critical, High, Medium, or Low
6. Your suggested remediation, if available
7. Your name or handle for attribution, if you wish to be credited

Incomplete reports that cannot be reproduced may be deprioritized or closed without action.

---

## Response Process

### Timeline

| Stage | Target Timeframe |
|:---|:---:|
| Acknowledgement of receipt | Within 72 hours |
| Initial assessment and severity classification | Within 7 days |
| Patch development and testing | Depends on severity |
| Production deployment | As soon as patch is verified |
| Public disclosure (if applicable) | After patch is live |

### Severity Classification

| Severity | Description | Target Patch Time |
|:---:|:---|:---:|
| Critical | Remote code execution, full data exposure, authentication bypass | 24 – 48 hours |
| High | Significant data exposure, persistent XSS, CSP bypass | 3 – 7 days |
| Medium | Reflected XSS, open redirect, information leakage | 7 – 14 days |
| Low | Minor information disclosure, non-exploitable misconfiguration | 30 days |

These are targets, not guarantees. Complex issues may require additional time.

---

## Disclosure Policy

Abakada.org follows a **coordinated disclosure** model:

- The reporter is asked to keep the vulnerability confidential until a fix has been deployed
- The maintainer will notify the reporter when the fix is live
- Public disclosure may be published after the fix, with credit to the reporter if requested
- If the maintainer fails to respond within **14 days** of the initial report, the reporter may proceed with limited public disclosure after notifying [hello@abakada.org](mailto:hello@abakada.org) of their intent

Abakada.org does not operate a bug bounty program. Contributions are recognized through public credit in the changelog or security advisory, at the reporter's discretion.

---

## Security Architecture

### HTTP Security Headers

Applied via `vercel.json`, with the CSP additionally mirrored into the `index.html` `<meta>` as an in-document fallback. Both are written from one definition by `scripts/security-headers.mjs` at build time, and `scripts/verify-csp.mjs` fails the build if the policy is missing:

| Header | Purpose |
|:---|:---|
| `Content-Security-Policy` | Restricts resource origins |
| `X-Frame-Options: DENY` | Prevents clickjacking |
| `X-Content-Type-Options: nosniff` | Prevents MIME sniffing |
| `Referrer-Policy: strict-origin-when-cross-origin` | Controls referrer information |
| `Permissions-Policy` | Disables unused browser APIs (camera, microphone, geolocation) |
| `Strict-Transport-Security` | Enforces HTTPS with long max-age |

### Client-Side Protections

| Protection | Implementation |
|:---|:---|
| URL validation | `isSafeUrl()` runs before any external link is rendered |
| Rate limiting | Throttles rapid repeated interactions |
| Bot detection | Signals checked on page load |
| DevTools detection | Console warning issued |
| Content protection | Context menu and text selection disabled on tool card content |
| Email obfuscation | Email addresses obfuscated in source |

### Data Handling

- No user accounts, no authentication, no server-side session management
- No personally identifiable information is collected or stored server-side
- All user preferences (bookmarks, theme, language) are stored in `localStorage` on the user's own device
- No third-party analytics, tracking scripts, or advertising networks

### Dependencies

- Minimal runtime dependencies: `react`, `react-dom`, `react-router-dom`
- No backend framework, no ORM, no database driver
- Dependencies are reviewed manually before any version update

### Robots and Scraping

- `robots.txt` blocks known AI scrapers and data harvesters (GPTBot, CCBot, Claude-Web, and others)
- No API endpoints are exposed

---

## Known Limitations

- Abakada.org is a fully static site. Security controls are limited to what can be enforced at the CDN/hosting layer and in the browser. There is no server-side request validation.
- `localStorage` data is not encrypted. Users on shared devices should be aware that bookmarks and preferences are accessible to anyone with access to the browser profile.
- The Service Worker caches application assets locally. Users should clear their browser cache if they suspect a compromised cached version.

---

## Contact

<table>
  <tr>
    <td>
      <b>Security reports</b><br/>
      <a href="mailto:hello@abakada.org">hello@abakada.org</a>
    </td>
    <td>
      <b>Maintainer</b><br/>
      <a href="https://ramonloganjr.com"><b>Ramon Logan Jr.</b></a>
    </td>
    <td>
      <b>Website</b><br/>
      <a href="https://abakada.org">abakada.org</a>
    </td>
  </tr>
</table>
