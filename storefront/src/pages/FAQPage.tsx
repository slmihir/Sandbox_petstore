import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft, ChevronDown, Headphones, Phone } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  items: FAQItem[];
}

const faqCategories: FAQCategory[] = [
  {
    title: 'Orders & Shipping',
    items: [
      {
        question: 'How long does shipping take?',
        answer: 'Standard shipping takes 3-5 business days within the continental United States. Expedited shipping (2-3 days) and overnight options are also available at checkout. Orders placed before 2PM ET on business days are processed the same day.',
      },
      {
        question: 'Is shipping free?',
        answer: 'Yes! We offer free standard shipping on all orders over $49. For orders under $49, standard shipping is $5.99. Expedited and overnight shipping are available at additional cost regardless of order total.',
      },
      {
        question: 'How do I track my order?',
        answer: 'Once your order ships, you will receive a confirmation email with a tracking number and a link to track your package. You can also view your order status by logging into your account on our website.',
      },
      {
        question: 'Do you ship internationally?',
        answer: 'Currently, we ship within the United States (all 50 states). We are actively working on expanding our shipping to Canada and select international destinations. Sign up for our newsletter to be notified when international shipping becomes available.',
      },
      {
        question: 'Can I change or cancel my order?',
        answer: 'You can modify or cancel your order within 1 hour of placing it by contacting our support team. Once an order enters the processing stage, changes may not be possible. Please reach out as soon as possible for the best chance of modification.',
      },
    ],
  },
  {
    title: 'Returns & Refunds',
    items: [
      {
        question: 'What is your return policy?',
        answer: 'We accept returns on unopened items within 30 days of delivery for a full refund. Defective or damaged products can be returned at any time. Please visit our Shipping & Returns page for complete details and instructions on how to initiate a return.',
      },
      {
        question: 'How do I return an item?',
        answer: 'Contact our support team at support@pawparadise.com or call 1-800-555-PAWS to get a Return Merchandise Authorization (RMA) number. Pack the item securely, include the RMA number, and ship it back to us. Refunds are processed within 5-7 business days after we receive the item.',
      },
      {
        question: 'When will I receive my refund?',
        answer: 'Refunds are processed within 5-7 business days after we receive and inspect the returned item. The refund will be issued to your original payment method. Depending on your bank, it may take an additional 3-5 business days to appear on your statement.',
      },
      {
        question: 'Do I have to pay for return shipping?',
        answer: 'Return shipping costs are the responsibility of the customer for standard returns. However, if the return is due to a defective product or an error on our part (wrong item shipped), we will provide a prepaid return label at no cost to you.',
      },
    ],
  },
  {
    title: 'Products & Quality',
    items: [
      {
        question: 'Are your products vet-approved?',
        answer: 'Absolutely. Every product on PawParadise is reviewed and approved by our in-house veterinary team before it is listed on our website. We evaluate products based on ingredient quality, safety, nutritional value, durability, and overall suitability for pets.',
      },
      {
        question: 'How do you select the brands you carry?',
        answer: 'We have a rigorous vetting process for all brands. We evaluate ingredient sourcing, manufacturing practices, safety certifications, customer reviews, and overall brand reputation. Only brands that meet our strict quality standards make it onto our shelves.',
      },
      {
        question: 'What if a product is out of stock?',
        answer: 'If a product is currently out of stock, you can sign up for a restock notification on the product page. We will email you as soon as the item becomes available again. Most popular items are restocked within 1-2 weeks.',
      },
      {
        question: 'Do you have products for pets with allergies?',
        answer: 'Yes, we carry a wide range of hypoallergenic and limited-ingredient products for pets with food sensitivities or allergies. Use our catalog filters to browse grain-free, limited-ingredient, and allergy-friendly options. Our support team can also help recommend products.',
      },
    ],
  },
  {
    title: 'Account & Payment',
    items: [
      {
        question: 'Do I need an account to place an order?',
        answer: 'No, you can check out as a guest. However, creating an account allows you to track orders, save your shipping information for faster checkout, access your order history, and receive personalized product recommendations.',
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover), debit cards, and PayPal. All transactions are processed through secure, PCI-compliant payment gateways to protect your financial information.',
      },
      {
        question: 'Is my payment information secure?',
        answer: 'Yes. We use industry-standard SSL/TLS encryption and PCI-compliant payment processing. We never store your full credit card number on our servers. All payment data is handled by our trusted payment processors with bank-level security.',
      },
      {
        question: 'How do I use a promo code?',
        answer: 'You can enter your promo code in the "Promo Code" field on the cart page or during checkout. Click "Apply" and the discount will be reflected in your order total. Only one promo code can be applied per order.',
      },
    ],
  },
];

function FAQAccordion({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
        aria-expanded={open}
      >
        <span className="font-semibold text-gray-900 text-sm pr-4">{item.question}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-4 animate-fade-in">
          <p className="text-sm text-gray-600 leading-relaxed">{item.answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-18 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 backdrop-blur rounded-2xl mb-5">
            <HelpCircle className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">Frequently Asked Questions</h1>
          <p className="text-indigo-100 max-w-lg mx-auto">
            Find answers to common questions about orders, shipping, returns, and more.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        <div className="space-y-12">
          {faqCategories.map(category => (
            <div key={category.title}>
              <h2 className="text-xl font-extrabold text-gray-900 mb-5">{category.title}</h2>
              <div className="space-y-3">
                {category.items.map(item => (
                  <FAQAccordion key={item.question} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 bg-indigo-50 border border-indigo-100 rounded-2xl p-8 text-center">
          <Headphones className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Can't Find Your Answer?</h3>
          <p className="text-gray-500 mb-5 max-w-md mx-auto">Our customer support team is ready to help with any questions you may have.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Contact Us
            </Link>
            <a
              href="tel:+18005551234"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-indigo-200 text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-colors"
            >
              <Phone className="w-4 h-4" /> 1-800-555-PAWS
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
