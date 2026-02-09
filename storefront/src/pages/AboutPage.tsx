import { Link } from 'react-router-dom';
import { Heart, Users, Award, Globe, Package, ShieldCheck, Headphones, ArrowRight } from 'lucide-react';

const stats = [
  { label: 'Products Sold', value: '150,000+', icon: Package },
  { label: 'Happy Customers', value: '50,000+', icon: Users },
  { label: 'Years in Business', value: '6+', icon: Award },
  { label: 'Cities Served', value: '500+', icon: Globe },
];

const team = [
  { name: 'Dr. Sarah Mitchell', role: 'Founder & CEO', img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face' },
  { name: 'James Rodriguez', role: 'Head of Operations', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face' },
  { name: 'Emily Chen', role: 'Product Director', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face' },
  { name: 'Michael Brown', role: 'Customer Experience Lead', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face' },
];

const timeline = [
  { year: '2020', title: 'PawParadise Founded', desc: 'Started as a small local pet supply shop with a mission to provide only vet-approved products.' },
  { year: '2021', title: 'Launched Online Store', desc: 'Expanded beyond our physical location to serve pet parents nationwide with same-week shipping.' },
  { year: '2023', title: '25,000 Customers', desc: 'Milestone reached with 25K+ happy pet parents and an average 4.9-star rating across all products.' },
  { year: '2025', title: '2,000+ Products', desc: 'Grew our catalog to over 2,000 vet-approved products across food, toys, beds, grooming, and health.' },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
          <p className="text-sm font-semibold text-indigo-200 uppercase tracking-widest mb-4">About PawParadise</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-5 text-balance leading-tight">
            We're on a Mission to Make Pet Care <span className="text-amber-300">Better</span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl mx-auto leading-relaxed">
            Every product we sell is chosen with one goal: helping your pet live a healthier, happier life. No compromises, no shortcuts — just the best for your best friend.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-2">Our Story</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6">Founded by Pet Lovers, for Pet Lovers</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                PawParadise was founded in 2020 by Dr. Sarah Mitchell, a veterinarian with over 15 years of clinical experience. Frustrated by the low-quality products flooding the pet market, she set out to build a curated store that pet parents could truly trust.
              </p>
              <p>
                Starting as a small storefront, PawParadise has grown into a thriving online destination serving tens of thousands of customers. Our in-house veterinary team reviews every product before it reaches our shelves — from the ingredients in our pet food to the materials in our toys and beds.
              </p>
              <p>
                Today, we carry over 2,000 products from trusted brands, and we continue to uphold the same standard we started with: if we wouldn't use it for our own pets, we won't sell it to you.
              </p>
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=450&fit=crop"
              alt="Happy dogs playing"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-50 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(stat => (
              <div key={stat.label} className="text-center">
                <div className="mx-auto w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-3">
                  <stat.icon className="w-7 h-7 text-indigo-600" />
                </div>
                <p className="text-3xl sm:text-4xl font-extrabold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Our Journey</h2>
          <p className="mt-3 text-gray-500">Key milestones that shaped PawParadise</p>
        </div>
        <div className="max-w-3xl mx-auto relative">
          <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-0.5 bg-indigo-100 -translate-x-1/2" />
          {timeline.map((item, i) => (
            <div key={item.year} className={`relative flex items-start gap-6 sm:gap-10 mb-10 last:mb-0 ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}>
              <div className="hidden sm:block flex-1" />
              <div className="relative z-10 shrink-0">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-xs font-extrabold shadow-md shadow-indigo-200">
                  {item.year}
                </div>
              </div>
              <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-gray-50 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Meet Our Team</h2>
            <p className="mt-3 text-gray-500">The passionate people behind PawParadise</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map(member => (
              <div key={member.name} className="text-center group">
                <div className="w-40 h-40 mx-auto rounded-2xl overflow-hidden mb-4 shadow-md group-hover:shadow-lg transition-all ring-4 ring-white">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <h3 className="font-bold text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Our Values</h2>
          <p className="mt-3 text-gray-500">The principles that guide everything we do</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: 'Vet-Approved Quality', desc: 'Every product is reviewed and approved by our in-house veterinary team. We only stock brands and products that meet our strict quality standards for safety, nutrition, and durability.', icon: ShieldCheck },
            { title: 'Customer First', desc: 'Free shipping on orders over $49, hassle-free 30-day returns, and a dedicated support team available 7 days a week. Your satisfaction is our top priority, always.', icon: Headphones },
            { title: 'Community Impact', desc: 'We donate 5% of every purchase to local animal shelters and rescue organizations. When you shop with us, you\'re helping pets in need find loving homes.', icon: Heart },
          ].map(v => (
            <div key={v.title} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-5">
                <v.icon className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg">{v.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">Ready to Give Your Pet the Best?</h2>
          <p className="text-indigo-100 max-w-lg mx-auto mb-8">Browse our full catalog of vet-approved products and find everything your pet needs.</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
          >
            Shop Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
