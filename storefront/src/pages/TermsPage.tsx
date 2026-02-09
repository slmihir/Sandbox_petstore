import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';

const COMPANY = 'PawParadise';
const SUPPORT_EMAIL = 'support@pawparadise.com';

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: [
      `By accessing or using the ${COMPANY} website, mobile applications, and any related services (collectively, the "Services"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Services.`,
      `We reserve the right to modify these terms at any time. Continued use of the Services after changes constitutes acceptance of the modified terms. It is your responsibility to review these terms periodically.`,
    ],
  },
  {
    title: '2. Account Registration',
    content: [
      `To access certain features of our Services, you may need to create an account. You agree to:`,
      `• Provide accurate, current, and complete information during registration`,
      `• Maintain and update your account information to keep it accurate and current`,
      `• Keep your password confidential and not share it with others`,
      `• Accept responsibility for all activities that occur under your account`,
      `• Notify us immediately of any unauthorized use of your account`,
      `We reserve the right to suspend or terminate accounts that violate these terms or that have been inactive for an extended period.`,
    ],
  },
  {
    title: '3. Products & Pricing',
    content: [
      `We strive to provide accurate product descriptions, images, and pricing. However:`,
      `• Product images are for illustration purposes and may vary slightly from the actual product`,
      `• Prices are subject to change without notice`,
      `• We reserve the right to correct any pricing errors and to cancel orders placed at incorrect prices`,
      `• Product availability is not guaranteed and may change at any time`,
      `• Promotional offers and discount codes are subject to specific terms and may be modified or discontinued at our discretion`,
    ],
  },
  {
    title: '4. Orders & Payment',
    content: [
      `By placing an order through our website, you are making an offer to purchase the selected products. Order acceptance and fulfillment are subject to:`,
      `• Product availability at the time of processing`,
      `• Verification of payment information`,
      `• Validation of shipping address`,
      `We accept major credit cards, debit cards, and other payment methods as displayed at checkout. All payments are processed through secure, PCI-compliant payment gateways. You represent that you are authorized to use the payment method provided.`,
      `We reserve the right to refuse or cancel any order for reasons including suspected fraud, product unavailability, or pricing errors.`,
    ],
  },
  {
    title: '5. Shipping & Delivery',
    content: [
      `Shipping times and costs are estimates and may vary based on destination, carrier, and product availability. Please review our Shipping & Returns page for detailed shipping information.`,
      `• Standard shipping typically takes 3-5 business days within the continental United States`,
      `• Free standard shipping is available on orders over $49`,
      `• We are not responsible for delays caused by carriers, customs, weather, or other events outside our control`,
      `• Risk of loss transfers to you upon delivery to the shipping carrier`,
    ],
  },
  {
    title: '6. Returns & Refunds',
    content: [
      `We want you to be completely satisfied with your purchase. Our return policy allows:`,
      `• Returns of unopened items within 30 days of delivery for a full refund`,
      `• Defective or damaged products may be returned or exchanged at any time with proof of purchase`,
      `• Return shipping costs are the responsibility of the customer unless the return is due to our error`,
      `• Refunds are processed within 5-7 business days after we receive the returned item`,
      `Please refer to our Shipping & Returns page for complete return instructions and eligibility details.`,
    ],
  },
  {
    title: '7. Intellectual Property',
    content: [
      `All content on the ${COMPANY} website, including text, graphics, logos, images, product descriptions, and software, is the property of ${COMPANY} or its content suppliers and is protected by copyright, trademark, and other intellectual property laws.`,
      `You may not reproduce, distribute, modify, display, or create derivative works from any content on our website without prior written consent from ${COMPANY}.`,
      `The ${COMPANY} name, logo, and all related product names, designs, and slogans are trademarks of ${COMPANY}. You may not use these marks without our prior written permission.`,
    ],
  },
  {
    title: '8. User Conduct',
    content: [
      `When using our Services, you agree not to:`,
      `• Use the Services for any unlawful purpose or in violation of these terms`,
      `• Submit false, misleading, or fraudulent information`,
      `• Attempt to interfere with the proper functioning of the website`,
      `• Upload or transmit viruses, malware, or other harmful code`,
      `• Harvest or collect information about other users without their consent`,
      `• Post reviews or content that is defamatory, obscene, or violates third-party rights`,
      `• Use automated systems (bots, scrapers) to access our Services without permission`,
    ],
  },
  {
    title: '9. Limitation of Liability',
    content: [
      `To the fullest extent permitted by applicable law, ${COMPANY} shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our Services, including but not limited to loss of profits, data, or goodwill.`,
      `Our total liability for any claim arising from these terms or our Services shall not exceed the amount you paid to ${COMPANY} in the twelve (12) months preceding the claim.`,
      `Some jurisdictions do not allow the exclusion or limitation of certain damages. In such cases, our liability will be limited to the maximum extent permitted by law.`,
    ],
  },
  {
    title: '10. Governing Law',
    content: [
      `These Terms of Service shall be governed by and construed in accordance with the laws of the United States, without regard to conflict of law principles.`,
      `Any disputes arising from these terms or your use of our Services shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association, unless otherwise required by applicable law.`,
    ],
  },
  {
    title: '11. Contact Us',
    content: [
      `If you have questions about these Terms of Service, please contact us:`,
      `**Email:** ${SUPPORT_EMAIL}`,
      `**Phone:** 1-800-555-PAWS`,
    ],
  },
];

export default function TermsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-18 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 backdrop-blur rounded-2xl mb-5">
            <FileText className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">Terms of Service</h1>
          <p className="text-indigo-100 max-w-lg mx-auto">
            Please read these terms carefully before using our website and services.
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
            <span className="font-semibold">Last Updated:</span> February 1, 2026 &mdash; These terms govern your use of all {COMPANY} services effective from the date listed.
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
