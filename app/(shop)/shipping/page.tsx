import Link from 'next/link';
import { Truck, Clock, MapPin, Package, AlertCircle, ArrowRight } from 'lucide-react';
import MaxWidthWrapper from '@/components/max-width-wrapper';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping & Delivery | Verse Two Fit',
  description:
    'Everything you need to know about how we ship your order — processing times, delivery estimates, tracking, and coverage areas.',
};

const STEPS = [
  {
    number: '01',
    icon: Package,
    title: 'Order Placed',
    body: 'You place your order and receive a confirmation email immediately.',
  },
  {
    number: '02',
    icon: Clock,
    title: 'Processing',
    body: 'We pick, pack, and prepare your order within 1–2 business days.',
  },
  {
    number: '03',
    icon: Truck,
    title: 'Shipped',
    body: 'Your order is handed off to UniUni and a tracking number is emailed to you.',
  },
  {
    number: '04',
    icon: MapPin,
    title: 'Delivered',
    body: 'UniUni delivers to your door within the estimated window.',
  },
];

const FAQ = [
  {
    q: 'When will my order ship?',
    a: 'Orders are processed within 1–2 business days (Monday – Friday, excluding holidays). Once shipped, you will receive a tracking number by email.',
  },
  {
    q: 'How do I track my package?',
    a: 'A tracking link is included in your shipping confirmation email. You can also visit the UniUni website and enter your tracking number directly.',
  },
  {
    q: 'What if my package is delayed?',
    a: 'Delivery estimates are not guaranteed. Delays can occur due to high volume periods, weather, or courier backlogs. If your order is significantly delayed, reach out to us at hello@versetwofit.com and we will help.',
  },
  {
    q: 'What if my address is outside UniUni coverage?',
    a: 'If your address falls outside UniUni\'s delivery area, we will contact you to arrange an alternative shipping method at no extra cost.',
  },
  {
    q: 'Can I change my shipping address after ordering?',
    a: 'Address changes can only be made before your order is shipped. Contact us as soon as possible at hello@versetwofit.com.',
  },
];

export default function ShippingPage() {
  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="bg-[#303d32] py-24 md:py-32">
        <MaxWidthWrapper>
          <p className="text-xs tracking-[0.2em] text-green-300/70 uppercase mb-5 font-medium">
            Shipping & Delivery
          </p>
          <h1 className="text-5xl md:text-6xl font-black text-white leading-[0.92] tracking-tight mb-6 max-w-2xl">
            Fast shipping,
            <br />
            right to your door.
          </h1>
          <p className="text-base md:text-lg text-white/60 max-w-md leading-relaxed">
            We partner with UniUni to deliver your order quickly and reliably across Canada.
          </p>
        </MaxWidthWrapper>
      </section>

      {/* ── How it works ────────────────────────────────────────────────── */}
      <section className="bg-white py-24 md:py-32">
        <MaxWidthWrapper>
          <div className="mb-16">
            <p className="text-xs tracking-[0.2em] text-[#303d32] uppercase font-medium mb-3">
              How It Works
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 max-w-xl leading-tight">
              From checkout to your door
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {STEPS.map((step) => (
              <div key={step.number} className="rounded-2xl bg-gray-50 border border-gray-100 p-8 flex flex-col">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-11 h-11 rounded-full bg-[#303d32] flex items-center justify-center shrink-0">
                    <step.icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                  </div>
                  <span className="text-4xl font-black text-gray-100 leading-none select-none tabular-nums">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </MaxWidthWrapper>
      </section>

      {/* ── Rates & times ────────────────────────────────────────────────── */}
      <section className="bg-gray-50 border-y border-gray-100 py-24 md:py-32">
        <MaxWidthWrapper>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">
            {/* Rates */}
            <div>
              <p className="text-xs tracking-[0.2em] text-[#303d32] uppercase font-medium mb-3">
                Shipping Rates
              </p>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 leading-tight">
                Calculated at checkout
              </h2>
              <div className="rounded-xl bg-white border border-gray-100 px-6 py-5">
                <p className="text-sm text-gray-600 leading-relaxed">
                  Shipping costs are calculated based on your location and order details at checkout. You will see the exact rate before completing your purchase.
                </p>
              </div>
            </div>

            {/* Delivery times */}
            <div>
              <p className="text-xs tracking-[0.2em] text-[#303d32] uppercase font-medium mb-3">
                Delivery Times
              </p>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 leading-tight">
                Estimated windows
              </h2>
              <div className="space-y-3">
                {[
                  { label: 'Processing Time', detail: 'Before shipment', value: '1–2 business days' },
                  { label: 'Standard Delivery', detail: 'After shipment via UniUni', value: '3–7 business days' },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between rounded-xl bg-white border border-gray-100 px-6 py-4"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{row.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{row.detail}</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-800 text-right max-w-[140px]">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-3 rounded-xl bg-amber-50 border border-amber-100 px-5 py-4">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" strokeWidth={2} />
                <p className="text-xs text-amber-700 leading-relaxed">
                  Delivery estimates are not guaranteed. Delays may occur during peak periods, holidays, or due to courier conditions beyond our control.
                </p>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </section>

      {/* ── Coverage band ────────────────────────────────────────────────── */}
      <section className="bg-[#303d32] py-16 md:py-20">
        <MaxWidthWrapper>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <p className="text-xs tracking-[0.2em] text-green-300/70 uppercase font-medium mb-3">
                Coverage
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                Shipping across Canada
              </h2>
              <p className="text-white/60 mt-3 max-w-md text-sm leading-relaxed">
                UniUni covers major cities and surrounding areas. If your address is outside their network, we will reach out to arrange an alternative at no extra charge.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" strokeWidth={1.5} />
              </div>
              <p className="text-white font-semibold text-sm">Canada-wide delivery</p>
            </div>
          </div>
        </MaxWidthWrapper>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="bg-white py-24 md:py-32">
        <MaxWidthWrapper>
          <div className="mb-16">
            <p className="text-xs tracking-[0.2em] text-[#303d32] uppercase font-medium mb-3">
              FAQ
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 max-w-xl leading-tight">
              Common shipping questions
            </h2>
          </div>

          <div className="divide-y divide-gray-100 max-w-3xl">
            {FAQ.map((item) => (
              <div key={item.q} className="py-7">
                <h3 className="text-base font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </MaxWidthWrapper>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="bg-gray-50 border-t border-gray-100 py-24 md:py-32">
        <MaxWidthWrapper>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div>
              <p className="text-xs tracking-[0.2em] text-[#303d32] uppercase font-medium mb-4">
                Still have questions?
              </p>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-[0.95] tracking-tight max-w-md">
                We&apos;re here
                <br />
                to help.
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-md bg-[#303d32] text-white text-sm font-semibold hover:bg-[#26342a] active:bg-[#1e2a22] transition-colors"
              >
                Contact Us
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:border-gray-500 hover:text-gray-900 transition-colors"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </MaxWidthWrapper>
      </section>
    </>
  );
}
