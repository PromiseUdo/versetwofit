import Link from 'next/link';
import { ShieldCheck, Database, Share2, Lock, UserCheck, Mail, ArrowRight } from 'lucide-react';
import MaxWidthWrapper from '@/components/max-width-wrapper';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Verse Two Fit',
  description:
    'How Verse Two Fit collects, uses, and protects your personal information when you shop with us.',
};

const SECTIONS = [
  {
    id: 'information-we-collect',
    icon: Database,
    number: '01',
    title: 'Information We Collect',
    content: (
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Account Information</h4>
          <p className="text-sm text-gray-500 leading-relaxed">
            When you create an account, we collect your full name, email address, and password (stored as a secure hash — we never store your password in plain text). You may also add a phone number to your profile at any time.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Order & Shipping Information</h4>
          <p className="text-sm text-gray-500 leading-relaxed">
            When you place an order, we collect your name, email address, phone number, and full shipping and billing address (street, city, province, and postal code). This information is required to fulfil and deliver your order.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Payment Information</h4>
          <p className="text-sm text-gray-500 leading-relaxed">
            We do not store your credit or debit card details. All payment information is handled directly and securely by Stripe, our payment processor. We only retain a reference ID provided by Stripe to associate a payment with your order.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Contact Messages</h4>
          <p className="text-sm text-gray-500 leading-relaxed">
            If you contact us through our contact form, we collect your name, email address, and the content of your message. This information is used solely to respond to your inquiry and is not stored in our database.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Sign In With Google</h4>
          <p className="text-sm text-gray-500 leading-relaxed">
            If you choose to sign in with Google, we receive your name, email address, and profile picture from Google. We use this to create and manage your account. We do not receive or store your Google password.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Cart Data</h4>
          <p className="text-sm text-gray-500 leading-relaxed">
            Your shopping cart is stored locally in your browser (localStorage). It contains only product details — no personal information. This data stays on your device and is cleared when you clear your browser data.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'how-we-use-information',
    icon: UserCheck,
    number: '02',
    title: 'How We Use Your Information',
    content: (
      <ul className="space-y-3 text-sm text-gray-500 leading-relaxed">
        {[
          'Process and fulfil your orders, including coordinating shipping with our carrier.',
          'Send order confirmation, shipping updates, and delivery notifications to your email.',
          'Manage your account and allow you to view your order history.',
          'Respond to messages sent through our contact form.',
          'Send a password reset email when you request one.',
          'Prevent fraud, abuse, and unauthorized access to your account.',
          'Comply with applicable legal obligations.',
        ].map((item) => (
          <li key={item} className="flex gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#303d32] shrink-0 mt-2" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: 'sharing-your-information',
    icon: Share2,
    number: '03',
    title: 'Sharing Your Information',
    content: (
      <div className="space-y-6">
        <p className="text-sm text-gray-500 leading-relaxed">
          We do not sell, rent, or trade your personal information. We share your data only with the third-party services listed below, and only to the extent necessary to operate the store.
        </p>
        <div className="space-y-3">
          {[
            {
              name: 'Stripe',
              role: 'Payment Processing',
              detail: 'Handles credit/debit card payments and Klarna buy-now-pay-later. Stripe receives your payment details, email, and billing address. Stripe is PCI-DSS compliant.',
            },
            {
              name: 'Klarna',
              role: 'Buy Now, Pay Later',
              detail: 'If you select Klarna at checkout, your email, shipping address, phone number, and order total are shared with Klarna to process your instalment plan.',
            },
            {
              name: 'UniUni',
              role: 'Shipping & Delivery',
              detail: 'Your name, phone number, email address, and shipping address are shared with UniUni to create and track your shipment.',
            },
            {
              name: 'Resend',
              role: 'Transactional Email',
              detail: 'Your email address and relevant order details are sent through Resend to deliver order confirmations, shipping updates, and password reset emails.',
            },
            {
              name: 'Google',
              role: 'Authentication (Optional)',
              detail: 'If you use "Sign in with Google", Google handles authentication and shares your basic profile with us. This is only used if you choose this sign-in option.',
            },
          ].map((p) => (
            <div key={p.name} className="rounded-xl bg-gray-50 border border-gray-100 px-6 py-5">
              <div className="flex items-start gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {p.name}{' '}
                    <span className="font-normal text-gray-400">— {p.role}</span>
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed mt-1">{p.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'data-retention',
    icon: Database,
    number: '04',
    title: 'Data Retention',
    content: (
      <div className="space-y-3">
        {[
          { label: 'Account data', value: 'Retained while your account is active. Deleted upon request.' },
          { label: 'Order records', value: 'Retained indefinitely for accounting and order history purposes.' },
          { label: 'Login sessions', value: 'Expire automatically after 30 days.' },
          { label: 'Password reset tokens', value: 'Expire 1 hour after being issued and are deleted once used.' },
          { label: 'Contact messages', value: 'Not stored in our database. Delivered to our inbox and handled like regular email.' },
          { label: 'Cart data', value: 'Stored only in your browser. We have no access to it.' },
        ].map((row) => (
          <div
            key={row.label}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 rounded-xl bg-gray-50 border border-gray-100 px-6 py-4"
          >
            <p className="text-sm font-semibold text-gray-900">{row.label}</p>
            <p className="text-sm text-gray-500 sm:text-right sm:max-w-xs">{row.value}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'security',
    icon: Lock,
    number: '05',
    title: 'Security',
    content: (
      <div className="space-y-4 text-sm text-gray-500 leading-relaxed">
        <p>
          We take reasonable steps to protect your personal information from unauthorized access, disclosure, or misuse. Measures we have in place include:
        </p>
        <ul className="space-y-3">
          {[
            'Passwords are hashed using bcrypt — we cannot see your password.',
            'Sessions are managed using secure, httpOnly JWT cookies.',
            'All webhook communications (Stripe and UniUni) are verified with HMAC-SHA256 signatures.',
            'Payment card data is never transmitted to or stored on our servers — Stripe handles it entirely.',
            'All data is transmitted over HTTPS.',
          ].map((item) => (
            <li key={item} className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#303d32] shrink-0 mt-2" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p>
          No method of transmission over the internet is 100% secure. While we strive to protect your personal information, we cannot guarantee absolute security.
        </p>
      </div>
    ),
  },
  {
    id: 'your-rights',
    icon: UserCheck,
    number: '06',
    title: 'Your Rights',
    content: (
      <div className="space-y-4 text-sm text-gray-500 leading-relaxed">
        <p>You have the following rights regarding your personal information:</p>
        <ul className="space-y-3">
          {[
            'Access — You can view your profile and order history at any time from your account page.',
            'Correction — You can update your name and phone number directly in your account settings.',
            'Password change — You can change your password at any time from your account page.',
            'Deletion — You can request that we delete your account and personal data by contacting us. Note that order records may be retained for legal and accounting purposes.',
            'Data portability — You may request a copy of the personal data we hold about you.',
          ].map((item) => (
            <li key={item} className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#303d32] shrink-0 mt-2" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p>
          To exercise any of the above rights, please contact us at{' '}
          <a
            href="mailto:hello@versetwofit.com"
            className="text-[#303d32] font-medium hover:underline"
          >
            hello@versetwofit.com
          </a>
          . We will respond within a reasonable timeframe.
        </p>
      </div>
    ),
  },
  {
    id: 'cookies',
    icon: ShieldCheck,
    number: '07',
    title: 'Cookies',
    content: (
      <div className="space-y-4 text-sm text-gray-500 leading-relaxed">
        <p>We use a small number of cookies that are necessary for the site to function:</p>
        <div className="space-y-3">
          {[
            { name: 'next-auth.session-token', purpose: 'Keeps you logged in for up to 30 days. HttpOnly — not accessible by scripts.' },
            { name: 'next-auth.csrf-token', purpose: 'Protects against cross-site request forgery attacks.' },
            { name: 'next-auth.callback-url', purpose: 'Remembers where to redirect you after logging in.' },
          ].map((c) => (
            <div key={c.name} className="rounded-xl bg-gray-50 border border-gray-100 px-6 py-4">
              <p className="text-sm font-mono font-semibold text-gray-800 mb-1">{c.name}</p>
              <p className="text-sm text-gray-500">{c.purpose}</p>
            </div>
          ))}
        </div>
        <p>
          We do not use advertising cookies, analytics cookies, or any third-party tracking cookies. No Google Analytics, Meta Pixel, or session recording tools are present on this site.
        </p>
      </div>
    ),
  },
  {
    id: 'changes',
    icon: Mail,
    number: '08',
    title: 'Changes to This Policy',
    content: (
      <p className="text-sm text-gray-500 leading-relaxed">
        We may update this Privacy Policy from time to time. When we do, we will update the effective date at the top of this page. We encourage you to review this page periodically. Continued use of the site after changes have been posted constitutes your acceptance of the updated policy.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="bg-[#303d32] py-24 md:py-32">
        <MaxWidthWrapper>
          <p className="text-xs tracking-[0.2em] text-green-300/70 uppercase mb-5 font-medium">
            Legal
          </p>
          <h1 className="text-5xl md:text-6xl font-black text-white leading-[0.92] tracking-tight mb-6 max-w-2xl">
            Privacy
            <br />
            Policy
          </h1>
          <p className="text-base text-white/60 max-w-md leading-relaxed">
            We believe in being straightforward about data. Here is exactly what we collect, why we collect it, and who we share it with.
          </p>
          <p className="text-xs text-white/30 mt-6">
            Effective date: April 30, 2025
          </p>
        </MaxWidthWrapper>
      </section>

      {/* ── Table of contents ───────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100 py-12">
        <MaxWidthWrapper>
          <p className="text-xs tracking-[0.2em] text-[#303d32] uppercase font-medium mb-6">
            Contents
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-5 py-4 text-sm font-medium text-gray-700 hover:border-[#303d32]/30 hover:text-gray-900 transition-colors group"
              >
                <span className="text-xs font-bold text-gray-300 tabular-nums group-hover:text-[#303d32] transition-colors">
                  {s.number}
                </span>
                {s.title}
              </a>
            ))}
          </div>
        </MaxWidthWrapper>
      </section>

      {/* ── Sections ────────────────────────────────────────────────────── */}
      <section className="bg-white py-16">
        <MaxWidthWrapper>
          <div className="max-w-3xl space-y-0 divide-y divide-gray-100">
            {SECTIONS.map((s) => (
              <div key={s.id} id={s.id} className="py-14 scroll-mt-24">
                <div className="flex items-start gap-5 mb-8">
                  <div className="w-11 h-11 rounded-full bg-[#303d32] flex items-center justify-center shrink-0 mt-0.5">
                    <s.icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-mono mb-1">{s.number}</p>
                    <h2 className="text-2xl font-bold text-gray-900">{s.title}</h2>
                  </div>
                </div>
                {s.content}
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
                Questions?
              </p>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-[0.95] tracking-tight max-w-md">
                We&apos;re happy
                <br />
                to explain more.
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
                Back to Shop
              </Link>
            </div>
          </div>
        </MaxWidthWrapper>
      </section>
    </>
  );
}
