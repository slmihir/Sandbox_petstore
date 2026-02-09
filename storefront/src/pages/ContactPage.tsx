import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, Phone, Mail, Clock, Check, MessageCircle, Headphones, ArrowRight } from 'lucide-react';
import { isValidEmail, isRequired } from '@/utils/validators';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    const req = isRequired(form.name, 'Name');
    if (!req.valid) errs.name = req.message;
    if (!isValidEmail(form.email)) errs.email = 'Valid email is required.';
    const subReq = isRequired(form.subject, 'Subject');
    if (!subReq.valid) errs.subject = subReq.message;
    const msgReq = isRequired(form.message, 'Message');
    if (!msgReq.valid) errs.message = msgReq.message;
    setErrors(errs);
    if (Object.keys(errs).length === 0) setSubmitted(true);
  };

  const contactMethods = [
    { icon: Mail, label: 'Email Us', value: 'support@pawparadise.com', desc: 'We respond within 24 hours' },
    { icon: Phone, label: 'Call Us', value: '1-800-555-PAWS', desc: 'Mon-Sat 9am to 7pm ET' },
    { icon: MessageCircle, label: 'Live Chat', value: 'Start a conversation', desc: 'Available during business hours' },
    { icon: Clock, label: 'Business Hours', value: 'Mon-Sat 9AM-7PM ET', desc: 'Sunday 10AM-5PM ET' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 text-center">
          <p className="text-sm font-semibold text-indigo-200 uppercase tracking-widest mb-3">Get in Touch</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">We'd Love to Hear From You</h1>
          <p className="text-lg text-indigo-100 max-w-lg mx-auto leading-relaxed">
            Product questions, order issues, or just want to say hi? Our team is here to help.
          </p>
        </div>
      </section>

      {/* Contact Methods Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactMethods.map(m => (
            <div key={m.label} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                <m.icon className="w-6 h-6 text-indigo-600" />
              </div>
              <p className="font-bold text-gray-900 text-sm">{m.label}</p>
              <p className="text-sm text-indigo-600 font-medium mt-1">{m.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-12 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Message Sent!</h2>
                <p className="text-gray-500 max-w-sm mx-auto mb-6">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                  className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Send Us a Message</h2>
                <p className="text-gray-500 mb-6">Fill out the form below and we'll get back to you as soon as possible.</p>
                <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl p-6 lg:p-8 shadow-sm space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                      <input
                        id="contact-name"
                        type="text"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                        placeholder="Your full name"
                      />
                      {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                      <input
                        id="contact-email"
                        type="email"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                        placeholder="you@example.com"
                      />
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-700 mb-1.5">What can we help with?</label>
                    <select
                      id="contact-subject"
                      value={form.subject}
                      onChange={e => setForm({ ...form, subject: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm ${errors.subject ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                    >
                      <option value="">Select a topic...</option>
                      <option value="product-question">Product Question</option>
                      <option value="order-issue">Order Issue</option>
                      <option value="return-exchange">Return / Exchange</option>
                      <option value="recommendation">Product Recommendation</option>
                      <option value="partnership">Business Partnership</option>
                      <option value="feedback">Feedback / Suggestion</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm ${errors.message ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                      placeholder="Tell us more about your inquiry..."
                    />
                    {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                  </div>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
                  >
                    <Send className="w-5 h-5" /> Send Message
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* FAQ Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                {[
                  { q: 'How long does shipping take?', a: 'Standard shipping takes 3-5 business days. Free on orders over $49.' },
                  { q: 'What is your return policy?', a: 'You can return any unopened item within 30 days for a full refund. No questions asked.' },
                  { q: 'Do you ship internationally?', a: 'Currently we ship within the United States. International shipping is coming soon.' },
                  { q: 'Are your products vet-approved?', a: 'Yes! Every product is reviewed by our in-house veterinary team before it reaches our shelves.' },
                  { q: 'How do I track my order?', a: 'Once your order ships, you\'ll receive an email with a tracking link. You can also check your account.' },
                ].map(faq => (
                  <div key={faq.q} className="bg-white border border-gray-100 rounded-xl p-4">
                    <p className="font-semibold text-gray-900 text-sm">{faq.q}</p>
                    <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
              <Link
                to="/faq"
                className="mt-4 inline-flex items-center gap-1 text-sm text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
              >
                View All FAQs <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 text-center">
              <Headphones className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
              <h4 className="font-bold text-gray-900 mb-1">Need Immediate Help?</h4>
              <p className="text-sm text-gray-500 mb-4">Our support team is just a call away</p>
              <a href="tel:+18005551234" className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors text-sm">
                <Phone className="w-4 h-4" /> 1-800-555-PAWS
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
