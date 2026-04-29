import Image from 'next/image';
import Link from 'next/link';
import { Gem, Target, Users, ArrowRight, Package, Truck } from 'lucide-react';
import MaxWidthWrapper from '@/components/max-width-wrapper';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Verse Two Fit',
  description:
    'Fashion for those who move with purpose. Learn the story behind Verse Two Fit — who we are, what we stand for, and why we make what we make.',
};

const VALUES = [
  {
    number: '01',
    icon: Gem,
    title: 'Quality First',
    body: 'Every piece in our catalogue is chosen with intention. We care about the weight of the fabric, the precision of the stitching, and the way a garment moves with you. No filler. No fast fashion. Just clothing that earns its place in your wardrobe.',
  },
  {
    number: '02',
    icon: Target,
    title: 'Purposeful Design',
    body: "Clean lines, deliberate silhouettes, timeless appeal. We strip away what doesn't belong and keep only what matters. Our pieces are built to work harder, last longer, and look sharper, season after season.",
  },
  {
    number: '03',
    icon: Users,
    title: 'Community Driven',
    body: "Our customers shape what we carry. Every drop, every restock, and every new category is guided by the people who wear our clothes. You're not just a customer, you're part of what Verse Two Fit is becoming.",
  },
];

const STATS = [
  { value: '2023', label: 'Est.' },
  { value: '500+', label: 'Styles' },
  { value: '3–5', label: 'Day delivery' },
  { value: 'CA', label: 'Based in Canada' },
];

export default function AboutPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative h-[90vh] min-h-[560px] flex items-end overflow-hidden">
        <Image
          src="/hero3.jpg"
          alt="Verse Two Fit lookbook"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Layered gradient: heavier at bottom for text legibility, light at top */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

        <MaxWidthWrapper className="relative z-10 pb-20 md:pb-28">
          <p className="text-xs tracking-[0.2em] text-green-300/80 uppercase mb-5 font-medium">
            Our Story
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.92] tracking-tight mb-6 max-w-3xl">
            Built for those
            <br />
            who move with
            <br />
            purpose.
          </h1>
          <p className="text-base md:text-lg text-white/60 max-w-md leading-relaxed">
            Verse Two Fit is more than clothing, it&apos;s a standard.
          </p>
        </MaxWidthWrapper>
      </section>

      {/* ── Brand story ───────────────────────────────────────────────────── */}
      <section className="bg-white py-24 md:py-32">
        <MaxWidthWrapper>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-start">
            {/* Pull quote */}
            <div className="lg:sticky lg:top-28">
              <div className="w-10 h-1 bg-[#303d32] mb-8 rounded-full" />
              <p className="text-3xl md:text-4xl font-bold text-gray-900 leading-[1.15] tracking-tight">
                &ldquo;We started with one belief: that what you wear should
                reflect how you live.&rdquo;
              </p>
            </div>

            {/* Story body */}
            <div className="space-y-6 text-[15px] md:text-base text-gray-600 leading-[1.8]">
              <p>
                Verse Two Fit was born from a love of fashion. We wanted
                something in between — clothes that looked sharp, felt right,
                and were made to last.
              </p>
              <p>
                So we built it ourselves. Every item we carry is selected with
                intention. We spend time with the fabric, the fit, and the
                finish before anything makes it into the store. If we
                wouldn&apos;t wear it ourselves, it doesn&apos;t make the cut.
              </p>
              <p>
                We&apos;re proud to be a Canadian brand shipping to every corner
                of the country and beyond. Whether you&apos;re building a
                capsule wardrobe or hunting for your next standout piece,
                we&apos;re here for it.
              </p>
              <p className="font-semibold text-gray-900">
                Fashion for those who move with purpose. Quality pieces,
                thoughtfully made.
              </p>
            </div>
          </div>
        </MaxWidthWrapper>
      </section>

      {/* ── Values ────────────────────────────────────────────────────────── */}
      <section className="bg-gray-50 border-y border-gray-100 py-24 md:py-32">
        <MaxWidthWrapper>
          {/* Section label */}
          <div className="mb-16">
            <p className="text-xs tracking-[0.2em] text-[#303d32] uppercase font-medium mb-3">
              What We Stand For
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 max-w-xl leading-tight">
              Three principles behind everything we do
            </h2>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {VALUES.map((v) => (
              <div key={v.number} className="group">
                <div className="rounded-2xl bg-white border border-gray-100 p-8 h-full flex flex-col transition-shadow duration-300 hover:shadow-md">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-11 h-11 rounded-full bg-[#303d32] flex items-center justify-center shrink-0">
                      <v.icon
                        className="w-5 h-5 text-white"
                        strokeWidth={1.5}
                      />
                    </div>
                    <span className="text-4xl font-black text-gray-100 leading-none select-none tabular-nums">
                      {v.number}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {v.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed flex-1">
                    {v.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </MaxWidthWrapper>
      </section>

      {/* ── Stats band ────────────────────────────────────────────────────── */}
      <section className="bg-[#303d32] py-16 md:py-20">
        <MaxWidthWrapper>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-0 md:divide-x md:divide-white/10">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center text-center md:px-8"
              >
                <span className="text-4xl md:text-5xl font-black text-white tracking-tight mb-1">
                  {s.value}
                </span>
                <span className="text-xs text-white/50 uppercase tracking-[0.15em] font-medium">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </MaxWidthWrapper>
      </section>

      {/* ── Full-bleed image + mission ─────────────────────────────────────── */}
      <section className="relative h-[70vh] min-h-[420px] flex items-center overflow-hidden">
        <Image
          src="/hero1.jpg"
          alt="Verse Two Fit collection"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#303d32]/75" />
        <MaxWidthWrapper className="relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs tracking-[0.2em] text-green-300/80 uppercase mb-6 font-medium">
              Our Mission
            </p>
            <p className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-[1.1] tracking-tight">
              &ldquo;Fashion for those who move with purpose. Quality pieces,
              thoughtfully made.&rdquo;
            </p>
          </div>
        </MaxWidthWrapper>
      </section>

      {/* ── Promises strip ────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100 py-14">
        <MaxWidthWrapper>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                icon: Package,
                title: 'Curated Selection',
                body: 'Every product is hand-picked for quality and fit.',
              },
              {
                icon: Truck,
                title: 'Canada-Wide Shipping',
                body: 'Fast, reliable delivery to every province.',
              },
              {
                icon: Gem,
                title: 'Premium Materials',
                body: 'We source only what meets our quality standard.',
              },
              {
                icon: Users,
                title: 'Real People, Real Fit',
                body: 'Built for how people actually dress and move.',
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 items-start">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                  <item.icon
                    className="w-4 h-4 text-[#303d32]"
                    strokeWidth={1.75}
                  />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </MaxWidthWrapper>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="bg-white py-24 md:py-32">
        <MaxWidthWrapper>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div>
              <p className="text-xs tracking-[0.2em] text-[#303d32] uppercase font-medium mb-4">
                Ready to shop?
              </p>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-[0.95] tracking-tight max-w-md">
                See the latest
                <br />
                drops.
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-md bg-[#303d32] text-white text-sm font-semibold hover:bg-[#26342a] active:bg-[#1e2a22] transition-colors"
              >
                Shop All Products
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:border-gray-500 hover:text-gray-900 transition-colors"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </MaxWidthWrapper>
      </section>
    </>
  );
}
