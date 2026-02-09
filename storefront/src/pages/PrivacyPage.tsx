import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

const COMPANY = 'PawParadise';
const SUPPORT_EMAIL = 'support@pawparadise.com';

const sections = [
  {
    title: '1. Information We Collect',
    content: [
      `When you visit our website or place an order, we may collect the following types of information:`,
      `**Personal Information:** Name, email address, shipping address, billing address, phone number, and payment information when you make a purchase or create an account.`,
      `**Usage Data:** Information about how you interact with our website, including pages visited, time spent on pages, links clicked, and browsing patterns.`,
      `**Device Information:** IP address, browser type, operating system, device identifiers, and other technical data collected through cookies and similar technologies.`,
      `**Communications:** Any messages, reviews, or feedback you submit through our contact forms, customer support channels, or product review features.`,
    ],
  },
  {
    title: '2. How We Use Your Information',
    content: [
      `We use the information we collect for the following purposes:`,
      `• Process and fulfill your orders, including shipping and payment processing`,
      `• Communicate with you about your orders, account, and customer service inquiries`,
      `• Send promotional emails and newsletters (with your consent)`,
      `• Improve our website, products, and services based on usage patterns and feedback`,
      `• Prevent fraud and ensure the security of our platform`,
      `• Comply with legal obligations and enforce our terms of service`,
    ],
  },
  {
    title: '3. Information Sharing',
    content: [
      `We do not sell, trade, or rent your personal information to third parties. We may share your information with:`,
      `**Service Providers:** Trusted third-party companies that help us operate our business, such as payment processors, shipping carriers, and email service providers. These providers are contractually obligated to protect your data.`,
      `**Legal Requirements:** We may disclose your information when required by law, in response to a court order, or to protect the rights, safety, or property of ${COMPANY}, our customers, or others.`,
      `**Business Transfers:** In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.`,
    ],
  },
  {
    title: '4. Data Security',
    content: [
      `We implement industry-standard security measures to protect your personal information, including:`,
      `• SSL/TLS encryption for all data transmitted between your browser and our servers`,
      `• Secure payment processing through PCI-compliant payment gateways`,
      `• Regular security audits and vulnerability assessments`,
      `• Access controls limiting employee access to personal data on a need-to-know basis`,
      `While we strive to protect your information, no method of transmission over the internet is 100% secure. We encourage you to use strong passwords and keep your account credentials confidential.`,
    ],
  },
  {
    title: '5. Cookies & Tracking Technologies',
    content: [
      `We use cookies and similar technologies to enhance your browsing experience. These include:`,
      `**Essential Cookies:** Required for the website to function properly, such as maintaining your shopping cart and login session.`,
      `**Analytics Cookies:** Help us understand how visitors interact with our website so we can improve performance and user experience.`,
      `**Marketing Cookies:** Used to deliver relevant advertisements and track the effectiveness of our marketing campaigns.`,
      `You can control cookie preferences through your browser settings. Disabling certain cookies may affect website functionality.`,
    ],
  },
  {
    title: '6. Your Rights & Choices',
    content: [
      `You have the following rights regarding your personal information:`,
      `• **Access:** Request a copy of the personal data we hold about you`,
      `• **Correction:** Request corrections to inaccurate or incomplete information`,
      `• **Deletion:** Request deletion of your personal data, subject to legal obligations`,
      `• **Opt-Out:** Unsubscribe from marketing communications at any time via the link in our emails`,
      `• **Data Portability:** Request your data in a structured, machine-readable format`,
      `To exercise any of these rights, please contact us at ${SUPPORT_EMAIL}.`,
    ],
  },
  {
    title: '7. Children\'s Privacy',
    content: [
      `Our website is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us immediately and we will take steps to delete such data.`,
    ],
  },
  {
    title: '8. Changes to This Policy',
    content: [
      `We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by posting the updated policy on this page with a revised "Last Updated" date. We encourage you to review this policy periodically.`,
    ],
  },
  {
    title: '9. Contact Us',
    content: [
      `If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:`,
      `**Email:** ${SUPPORT_EMAIL}`,
      `**Phone:** 1-800-555-PAWS`,
      `We aim to respond to all inquiries within 48 business hours.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-18 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 backdrop-blur rounded-2xl mb-5">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">Privacy Policy</h1>
          <p className="text-indigo-100 max-w-lg mx-auto">
            Your privacy matters to us. This policy explains how we collect, use, and protect your personal information.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-10">
          <p className="text-sm text-indigo-700">
            <span className="font-semibold">Last Updated:</span> February 1, 2026 &mdash; This policy is effective as of the date listed and applies to all users of the {COMPANY} website and services.
          </p>
        </div>

        <div className="space-y-10">
          {sections.map(section => (
            <div key={section.title}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h2>
              <div className="space-y-3">
                {section.content.map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-gray-600 leading-relaxed text-sm"
                    dangerouslySetInnerHTML={{
                      __html: paragraph
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-800">$1</strong>')
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
