import { Link } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import StaticPageLayout from '../components/StaticPageLayout'
import SEO from '../components/SEO'
import { pageMeta } from '../lib/pageMeta'

export default function Privacy() {
  const { t, lang } = useI18n()
  return (
    <>
    <SEO {...pageMeta.privacy} lang={lang} />
    <StaticPageLayout
      breadcrumb={t('breadcrumb.privacy', 'Privacy Policy')}
      heroTitle={t('pages.privacy.heroTitle', 'Privacy Policy')}
      heroSubtitle={`${t('pages.privacy.lastUpdated', 'Last updated')}: January 16, 2026`}
    >
      <section className="content-section">
        <div className="container">
          <article className="legal-content">
            <div className="legal-intro">
              <p>At Abakada ("we," "our," or "us"), we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <strong>abakada.org</strong> (the "Site").</p>
            </div>
            <section className="legal-section">
              <h2>1. Information We Collect</h2>
              <p>When you visit our Site, we may automatically collect certain information about your device, including browser type, operating system, referring website addresses, time and date of your visit, and pages viewed.</p>
            </section>
            <section className="legal-section">
              <h2>2. How We Use Your Information</h2>
              <p>We use the information we collect to operate and maintain our Site, improve user experience, respond to your inquiries, analyze usage patterns, and comply with legal obligations.</p>
            </section>
            <section className="legal-section">
              <h2>3. Information Sharing</h2>
              <p>We do not sell, trade, or rent your personal information to third parties. We may share information with service providers who assist us in operating our Site, or when required by law.</p>
            </section>
            <section className="legal-section">
              <h2>4. Cookies</h2>
              <p>Our Site uses cookies to enhance your browsing experience. Essential cookies are required for basic Site functionality, such as remembering your theme preference and language selection.</p>
            </section>
            <section className="legal-section">
              <h2>5. Third-Party Links</h2>
              <p>Our Site contains links to third-party websites. We are not responsible for the privacy practices or content of these external sites.</p>
            </section>
            <section className="legal-section">
              <h2>6. Data Security</h2>
              <p>We implement appropriate technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction.</p>
            </section>
            <section className="legal-section">
              <h2>7. Your Rights</h2>
              <p>Depending on your location, you may have certain rights regarding your personal information, including access, correction, deletion, and portability. Contact us at <a href="mailto:hello@abakada.org">hello@abakada.org</a> to exercise these rights.</p>
            </section>
            <section className="legal-section">
              <h2>8. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.</p>
            </section>
            <section className="legal-section">
              <h2>9. Contact Us</h2>
              <p>If you have questions about this Privacy Policy, please contact us at <a href="mailto:hello@abakada.org">hello@abakada.org</a> or visit our <Link to="/contact">contact page</Link>.</p>
            </section>
          </article>
        </div>
      </section>
    </StaticPageLayout>
    </>
  )
}
