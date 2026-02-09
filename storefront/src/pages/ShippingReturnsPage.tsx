import { Link } from 'react-router-dom';
import { Truck, RotateCcw, ArrowLeft, Package, Clock, MapPin, Check, X as XIcon, AlertCircle } from 'lucide-react';

const shippingOptions = [
  {
    name: 'Standard Shipping',
    time: '3-5 Business Days',
    cost: 'Free on orders over $49',
    costBelow: '$5.99 for orders under $49',
    icon: Truck,
  },
  {
    name: 'Expedited Shipping',
    time: '2-3 Business Days',
    cost: '$9.99',
    costBelow: 'Available on all orders',
    icon: Clock,
  },
  {
    name: 'Overnight Shipping',
    time: '1 Business Day',
    cost: '$19.99',
    costBelow: 'Order by 2PM ET for next-day delivery',
    icon: Package,
  },
];

const returnEligible = [
  'Unopened food and treats within 30 days',
  'Unused toys and accessories within 30 days',
  'Beds and bedding in original packaging within 30 days',
  'Defective or damaged items at any time',
  'Incorrect items shipped by us',
];

const returnNotEligible = [
  'Opened or partially used food and treats',
  'Used toys, beds, or accessories (unless defective)',
  'Items without original packaging or tags',
  'Items purchased more than 30 days ago (unless defective)',
  'Gift cards and promotional items',
];

export default function ShippingReturnsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-18 text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-14 h-14 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center">
              <Truck className="w-7 h-7 text-white" />
            </div>
            <div className="w-14 h-14 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center">
              <RotateCcw className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">Shipping & Returns</h1>
          <p className="text-indigo-100 max-w-lg mx-auto">
            Fast, reliable delivery and hassle-free returns. We make shopping for your pet easy.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        {/* Shipping Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Shipping Information</h2>
          <p className="text-gray-500 mb-8">We ship to all 50 US states. Orders are processed within 1 business day.</p>

          <div className="grid md:grid-cols-3 gap-5 mb-10">
            {shippingOptions.map(option => (
              <div key={option.name} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
                  <option.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{option.name}</h3>
                <p className="text-sm text-indigo-600 font-semibold mb-2">{option.time}</p>
                <p className="text-sm text-gray-600">{option.cost}</p>
                <p className="text-xs text-gray-400 mt-1">{option.costBelow}</p>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-gray-900">Shipping Details</h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                  <p>We currently ship within the United States only. International shipping will be available soon.</p>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                  <p>Orders placed before 2PM ET on business days are processed the same day. Weekend orders are processed the next business day.</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Package className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                  <p>You will receive a shipping confirmation email with a tracking number once your order ships.</p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                  <p>Delivery times are estimates and may be affected by carrier delays, weather, or high-volume periods such as holidays.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Returns Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Return Policy</h2>
          <p className="text-gray-500 mb-8">We offer a 30-day return window on most items. Your satisfaction is our priority.</p>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
              <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                <Check className="w-5 h-5" /> Eligible for Return
              </h3>
              <ul className="space-y-2.5">
                {returnEligible.map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-green-700">
                    <Check className="w-4 h-4 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
              <h3 className="font-bold text-red-800 mb-4 flex items-center gap-2">
                <XIcon className="w-5 h-5" /> Not Eligible for Return
              </h3>
              <ul className="space-y-2.5">
                {returnNotEligible.map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-red-700">
                    <XIcon className="w-4 h-4 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Return Process */}
        <div className="mb-16">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6">How to Return an Item</h2>
          <div className="space-y-4">
            {[
              { step: '1', title: 'Contact Us', desc: 'Email support@pawparadise.com or call 1-800-555-PAWS to initiate your return. Our team will provide a Return Merchandise Authorization (RMA) number.' },
              { step: '2', title: 'Pack Your Item', desc: 'Place the item in its original packaging (if possible) and include the RMA number on the outside of the package. Ensure the item is securely packed to prevent damage during transit.' },
              { step: '3', title: 'Ship It Back', desc: 'Send the package to the return address provided by our support team. We recommend using a trackable shipping method for your protection.' },
              { step: '4', title: 'Receive Your Refund', desc: 'Once we receive and inspect the returned item, your refund will be processed within 5-7 business days. Refunds are issued to the original payment method.' },
            ].map(item => (
              <div key={item.step} className="flex gap-4 bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-sm">{item.step}</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Still Have Questions?</h3>
          <p className="text-gray-500 mb-5">Our customer support team is happy to help with any shipping or return inquiries.</p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
