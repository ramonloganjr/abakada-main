import { Link } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import StaticPageLayout from '../components/StaticPageLayout'
import SEO from '../components/SEO'
import { pageMeta } from '../lib/pageMeta'

export default function Terms() {
  const { t, lang } = useI18n()
  return (
    <>
    <SEO {...pageMeta.terms} lang={lang} />
    <StaticPageLayout
      breadcrumb={t('breadcrumb.terms', 'Terms of Use')}
      heroTitle={t('pages.terms.heroTitle', 'Terms of Use')}
      heroSubtitle={`${t('pages.terms.lastUpdated', 'Last updated')}: May 9, 2026`}
    >
      <section className="content-section">
        <div className="container">
          <article className="legal-content">
            <div className="legal-intro">
              <p>
                Welcome to <strong>Abakada.org</strong> (the "Site," "Platform," or "Service"), an
                independent civic-tech project owned and maintained by <strong>Ramon Logan Jr.</strong>
                {' '}("Owner," "we," "our," or "us"). These Terms of Use (the "Terms") constitute a
                legally binding agreement between you (the "User," "you," or "your") and the Owner
                governing your access to and use of the Site, including all content, features,
                functionality, software, learning paths, tool directories, comparisons, glossaries,
                bookmarks, and related services.
              </p>
              <p>
                By accessing, browsing, installing, or otherwise using the Site, you acknowledge that
                you have read, understood, and agree to be bound by these Terms in their entirety,
                together with our <Link to="/privacy">Privacy Policy</Link>. If you do not agree to
                any provision of these Terms, you must immediately discontinue use of the Site.
              </p>
            </div>

            <section className="legal-section">
              <h2>1. Acceptance of Terms</h2>
              <p>
                Your continued use of the Site constitutes irrevocable acceptance of these Terms and
                any modifications hereto. We reserve the right to update, amend, or replace these
                Terms at any time, in our sole discretion, without prior notice. The "Last updated"
                date at the top of this page reflects the most recent revision. It is your
                responsibility to review these Terms periodically to remain informed of any changes.
              </p>
            </section>

            <section className="legal-section">
              <h2>2. Eligibility</h2>
              <p>
                The Site is intended for users of all ages who can lawfully enter into a binding
                agreement under the laws of their jurisdiction. By using the Site, you represent and
                warrant that (a) you have the legal capacity to accept these Terms, (b) your use of
                the Site does not violate any applicable law or regulation, and (c) all information
                you provide is accurate and truthful.
              </p>
            </section>

            <section className="legal-section">
              <h2>3. Intellectual Property Rights</h2>
              <p>
                All content, design, layout, graphics, illustrations, logos, trademarks, service
                marks, trade names, domain names, source code, software, databases, compilations,
                editorial selections, learning paths, glossaries, copy, taxonomies, curated tool
                listings, descriptions, and all other materials on the Site (collectively, the
                "Platform Assets") are the exclusive property of the Owner or are used under license,
                and are protected by Philippine and international copyright, trademark, trade secret,
                and other intellectual property laws.
              </p>
              <p>
                The "Abakada" name, the Abakada wordmark and logo, the Site's color palette and
                visual identity, and all related branding elements (collectively, the "Abakada
                Marks") are protected trademarks of Ramon Logan Jr. and may not be used without
                express prior written permission. Nothing in these Terms grants you any license or
                right to use the Abakada Marks.
              </p>
              <p>
                Source code published in the Site's public repositories is licensed under the MIT
                License. Editorial content (tool descriptions, learning paths, glossary entries) is
                licensed under Creative Commons Attribution 4.0 International (CC BY 4.0), unless
                otherwise indicated. All other rights are expressly reserved.
              </p>
            </section>

            <section className="legal-section">
              <h2>4. License to Use the Site</h2>
              <p>
                Subject to your continuous compliance with these Terms, the Owner grants you a
                limited, non-exclusive, non-transferable, non-sublicensable, revocable license to
                access and use the Site for personal, educational, and lawful informational purposes
                only. This license does not permit, and you shall not:
              </p>
              <ul>
                <li>Reproduce, duplicate, copy, sell, resell, exploit, or commercially distribute any portion of the Platform Assets without express prior written authorization;</li>
                <li>Modify, adapt, translate, reverse-engineer, decompile, or disassemble any portion of the Site, except as expressly permitted by applicable open-source licenses;</li>
                <li>Use any data-mining, robots, scrapers, or similar data-gathering and extraction tools to harvest content at scale without prior written consent;</li>
                <li>Frame, mirror, or otherwise replicate the Site or any of the Platform Assets on any other website, application, or service;</li>
                <li>Use the Site, the Abakada Marks, or any Platform Assets in any manner that suggests affiliation, sponsorship, or endorsement by the Owner without prior written authorization;</li>
                <li>Use any meta tags or hidden text using the Abakada Marks or any other intellectual property of the Owner; or</li>
                <li>Use the Site in any manner that could disable, overburden, damage, or impair the Site or interfere with any other party's use.</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>5. Acceptable Use Policy</h2>
              <p>You agree that you will not, and will not permit any third party to:</p>
              <ul>
                <li>Use the Site for any unlawful, fraudulent, defamatory, harassing, threatening, abusive, hateful, discriminatory, obscene, or otherwise objectionable purpose;</li>
                <li>Violate the privacy, intellectual property, or other rights of any person or entity;</li>
                <li>Attempt to gain unauthorized access to any portion of the Site, related systems, accounts, servers, or networks connected to the Site;</li>
                <li>Introduce any virus, worm, Trojan horse, malware, ransomware, spyware, or other malicious code;</li>
                <li>Engage in automated use of the system, including but not limited to using scripts to send comments, messages, or excessive volumes of requests;</li>
                <li>Impersonate any person or misrepresent your affiliation with any entity;</li>
                <li>Bypass, disable, or otherwise interfere with security-related features of the Site or features that prevent or restrict use or copying of any content; or</li>
                <li>Use the Site for any commercial solicitation, spamming, phishing, or pyramid scheme.</li>
              </ul>
              <p>
                The Owner reserves the unilateral right to investigate, suspend, or permanently ban
                any User believed to have violated this Acceptable Use Policy, and to cooperate with
                law-enforcement authorities in the prosecution of violators.
              </p>
            </section>

            <section className="legal-section">
              <h2>6. User-Submitted Content & Contributions</h2>
              <p>
                If you submit feedback, suggestions, ideas, tool nominations, translations, code
                contributions via GitHub, or any other materials to the Site (collectively,
                "User Submissions"), you grant the Owner a perpetual, irrevocable, worldwide,
                royalty-free, sub-licensable, transferable license to use, reproduce, modify, adapt,
                publish, translate, distribute, display, and create derivative works from such User
                Submissions in any media now known or hereafter developed, without compensation or
                attribution beyond what is voluntarily granted by the Owner.
              </p>
              <p>
                You represent and warrant that (a) you own or control all rights in and to your User
                Submissions, (b) the User Submissions do not infringe the intellectual property,
                privacy, or other rights of any third party, and (c) the User Submissions comply
                with these Terms and all applicable law.
              </p>
            </section>

            <section className="legal-section">
              <h2>7. Third-Party Tools, Links, and Resources</h2>
              <p>
                The Site provides a curated directory of third-party open-source tools, websites,
                and resources (the "Listed Tools"). The Owner does not own, develop, host, control,
                or guarantee the availability, accuracy, completeness, security, legality, or
                quality of any Listed Tool. References to or descriptions of any Listed Tool do not
                constitute endorsement, sponsorship, or affiliation. Your use of any Listed Tool is
                at your sole risk and is governed entirely by the terms, licenses, and privacy
                policies of the relevant third-party provider.
              </p>
              <p>
                The Owner expressly disclaims all liability for any harm, loss, damage, expense, or
                injury arising out of or related to your use of any Listed Tool or third-party
                website linked from the Site.
              </p>
            </section>

            <section className="legal-section">
              <h2>8. Disclaimer of Warranties</h2>
              <p>
                THE SITE, ALL PLATFORM ASSETS, AND ALL LISTED TOOLS ARE PROVIDED ON AN
                <strong> "AS IS" AND "AS AVAILABLE" </strong>BASIS, WITHOUT ANY WARRANTIES OF ANY
                KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW,
                THE OWNER DISCLAIMS ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES
                OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, ACCURACY,
                COMPLETENESS, RELIABILITY, AND UNINTERRUPTED OR ERROR-FREE OPERATION.
              </p>
              <p>
                The Owner does not warrant that the Site will meet your requirements, that any
                content will be accurate or up-to-date, that defects will be corrected, or that the
                Site or its servers are free of viruses or other harmful components.
              </p>
            </section>

            <section className="legal-section">
              <h2>9. Limitation of Liability</h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL THE OWNER,
                RAMON LOGAN JR., HIS HEIRS, ASSIGNS, CONTRIBUTORS, VOLUNTEERS, AGENTS, OR PARTNERS
                BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR
                PUNITIVE DAMAGES (INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, REVENUE, DATA,
                GOODWILL, REPUTATIONAL HARM, BUSINESS INTERRUPTION, OR COST OF SUBSTITUTE
                SERVICES) ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF (OR INABILITY TO USE)
                THE SITE, ANY LISTED TOOL, OR ANY CONTENT, EVEN IF THE OWNER HAS BEEN ADVISED OF
                THE POSSIBILITY OF SUCH DAMAGES.
              </p>
              <p>
                IN ALL CASES, THE OWNER'S TOTAL CUMULATIVE LIABILITY ARISING OUT OF OR RELATING TO
                THESE TERMS OR THE SITE, REGARDLESS OF THE FORM OF ACTION (CONTRACT, TORT,
                STATUTE, OR OTHERWISE), SHALL NOT EXCEED ONE HUNDRED PHILIPPINE PESOS (₱100.00).
                THIS LIMITATION REFLECTS THE NON-COMMERCIAL, FREE-OF-CHARGE NATURE OF THE SITE.
              </p>
            </section>

            <section className="legal-section">
              <h2>10. Indemnification</h2>
              <p>
                You agree to defend, indemnify, and hold harmless the Owner, Ramon Logan Jr., and
                all contributors, volunteers, partners, and affiliates from and against any and all
                claims, demands, damages, losses, liabilities, costs, and expenses (including
                reasonable attorneys' fees) arising out of or in any way connected with (a) your
                access to or use of the Site, (b) your violation of these Terms, (c) your violation
                of any third-party right (including intellectual property or privacy rights), or (d)
                any User Submission you submit to the Site.
              </p>
            </section>

            <section className="legal-section">
              <h2>11. Brand & Reputation Protection</h2>
              <p>
                You shall not use the Site, the Abakada Marks, or any content, screenshot, logo, or
                excerpt thereof in any manner that:
              </p>
              <ul>
                <li>Disparages, defames, or harms the reputation of the Owner, Ramon Logan Jr., the Abakada brand, or any contributor or partner;</li>
                <li>Falsely implies sponsorship, partnership, certification, endorsement, or affiliation with Abakada or its Owner;</li>
                <li>Promotes any product, service, organization, or political position in a manner that could mislead the public into believing such promotion is endorsed by Abakada;</li>
                <li>Violates any applicable advertising, consumer-protection, or unfair-competition law; or</li>
                <li>Could otherwise reasonably be expected to bring the Abakada brand or its Owner into public disrepute.</li>
              </ul>
              <p>
                Any unauthorized use of the Abakada Marks or any conduct described in this Section
                will be considered a material breach of these Terms and may result in immediate
                termination of your license, in addition to any other legal remedies available to
                the Owner under applicable law.
              </p>
            </section>

            <section className="legal-section">
              <h2>12. Termination</h2>
              <p>
                The Owner may, in its sole discretion and without prior notice or liability,
                suspend, restrict, or permanently terminate your access to the Site (in whole or in
                part) for any reason, including but not limited to (a) violation of these Terms, (b)
                conduct that the Owner reasonably believes is harmful to the Site, other users, the
                Owner, or any third party, or (c) compliance with any law-enforcement request or
                legal obligation. All provisions of these Terms which by their nature should survive
                termination (including ownership, warranty disclaimers, indemnity, and limitations
                of liability) shall survive.
              </p>
            </section>

            <section className="legal-section">
              <h2>13. Privacy</h2>
              <p>
                Your use of the Site is also governed by our{' '}
                <Link to="/privacy">Privacy Policy</Link>, which is incorporated into these Terms by
                reference. The Site collects no personal data on its servers, uses no advertising
                trackers, and stores user state (bookmarks, theme, language, comparison selections)
                exclusively in your local browser storage.
              </p>
            </section>

            <section className="legal-section">
              <h2>14. Governing Law & Dispute Resolution</h2>
              <p>
                These Terms shall be governed by, construed under, and enforced in accordance with
                the laws of the <strong>Republic of the Philippines</strong>, without regard to its
                conflict-of-laws principles. The exclusive venue for any action, suit, or proceeding
                arising out of or relating to these Terms or the Site shall be the proper courts
                located in the Philippines, and you consent to the personal jurisdiction of such
                courts.
              </p>
              <p>
                Before filing any formal action, the parties agree to make a good-faith effort to
                resolve any dispute through direct, written negotiation initiated by emailing{' '}
                <a href="mailto:hello@abakada.org">hello@abakada.org</a>.
              </p>
            </section>

            <section className="legal-section">
              <h2>15. Severability & Waiver</h2>
              <p>
                If any provision of these Terms is held by a court of competent jurisdiction to be
                invalid, illegal, or unenforceable, the remaining provisions shall continue in full
                force and effect. The Owner's failure to enforce any right or provision of these
                Terms shall not constitute a waiver of such right or provision.
              </p>
            </section>

            <section className="legal-section">
              <h2>16. Entire Agreement</h2>
              <p>
                These Terms, together with the Privacy Policy and any other legal notices published
                by the Owner on the Site, constitute the entire and exclusive agreement between you
                and the Owner regarding the Site and supersede all prior or contemporaneous
                understandings, communications, or agreements, whether written or oral.
              </p>
            </section>

            <section className="legal-section">
              <h2>17. Contact</h2>
              <p>
                Questions, concerns, or notices regarding these Terms (including takedown requests,
                trademark inquiries, partnership questions, or notices of alleged infringement)
                may be directed to:
              </p>
              <p>
                <strong>Ramon Logan Jr.</strong><br />
                Founder &amp; Maintainer, Abakada.org<br />
                Email: <a href="mailto:hello@abakada.org">hello@abakada.org</a><br />
                Or via our <Link to="/contact">contact page</Link>.
              </p>
            </section>
          </article>
        </div>
      </section>
    </StaticPageLayout>
    </>
  )
}
