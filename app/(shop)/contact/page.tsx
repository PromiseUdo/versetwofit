'use client';

import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Loader2, Mail, Clock, ArrowRight, Instagram } from 'lucide-react';
import MaxWidthWrapper from '@/components/max-width-wrapper';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import LabelInputContainer from '@/components/ui/label-input-container';
import { Label } from '@/components/ui/label';

const SUBJECTS = ['General Inquiry', 'Order Support', 'Product Question'];

const INFO_CARDS = [
  {
    icon: Mail,
    title: 'Email us',
    body: "Drop us a line and we'll get back to you within 1–2 business days.",
    action: {
      label: 'hello@versetwofit.com',
      href: 'mailto:hello@versetwofit.com',
    },
  },
  {
    icon: Clock,
    title: 'Business hours',
    body: 'Our team is available Monday – Friday, 9 am – 6 pm EST.',
    action: null,
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setError('');
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.subject ||
      !formData.message.trim()
    ) {
      setError('Please fill in all fields.');
      return;
    }
    if (formData.message.trim().length < 10) {
      setError('Your message must be at least 10 characters.');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('/api/contact', formData);
      setSubmitted(true);
      toast.success('Message sent!');
    } catch (err: any) {
      const msg =
        err.response?.data?.error ?? 'Something went wrong. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <section className="bg-[#303d32] pt-28 pb-20">
        <MaxWidthWrapper>
          <p className="text-xs tracking-[0.2em] text-green-300/80 uppercase mb-4 font-medium">
            Reach Out
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
            We&apos;re here
            <br />
            to help
          </h1>
          <p className="text-base text-white/55 max-w-sm leading-relaxed">
            Questions about your order, sizing advice, or just want to say hi,
            we&apos;d love to hear from you.
          </p>
        </MaxWidthWrapper>
      </section>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <MaxWidthWrapper>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 xl:gap-20">
            {/* ── Left column: contact info ── */}
            <aside className="lg:col-span-2 space-y-5">
              {/* Info cards */}
              {INFO_CARDS.map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl bg-gray-50 p-6 border border-gray-100"
                >
                  <div className="w-10 h-10 rounded-full bg-[#303d32] flex items-center justify-center mb-4">
                    <card.icon
                      className="w-4.5 h-4.5 text-white"
                      strokeWidth={1.75}
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-3">
                    {card.body}
                  </p>
                  {card.action && (
                    <a
                      href={card.action.href}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-[#303d32] hover:underline underline-offset-2"
                    >
                      {card.action.label}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}

              {/* Social card */}
              <div className="rounded-2xl bg-gray-50 p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3">Follow us</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  Stay in the loop with new drops, restocks, and
                  behind-the-scenes content.
                </p>
                <div className="flex gap-3">
                  <a
                    href="https://instagram.com/versetwofit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-400 hover:text-gray-900 transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </a>
                  <a
                    href="https://tiktok.com/@versetwofit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-400 hover:text-gray-900 transition-colors"
                  >
                    {/* TikTok icon */}
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.75a4.85 4.85 0 01-1.02-.06z" />
                    </svg>
                    TikTok
                  </a>
                </div>
              </div>

              {/* Order tip */}
              {/* <div className="rounded-2xl border border-amber-100 bg-amber-50 p-6">
                <p className="text-sm text-amber-900 leading-relaxed">
                  <span className="font-semibold">Checking on an order?</span>{' '}
                  You can track and manage orders directly from your{' '}
                  <Link
                    href="/orders"
                    className="font-semibold underline underline-offset-2 hover:text-amber-700"
                  >
                    orders page
                  </Link>
                  .
                </p>
              </div> */}
            </aside>

            {/* ── Right column: form ── */}
            <div className="lg:col-span-3">
              {submitted ? (
                <SuccessState
                  onReset={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      subject: '',
                      message: '',
                    });
                  }}
                />
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      Send us a message
                    </h2>
                    <p className="text-sm text-gray-500">
                      Fill in the form below and we&apos;ll be in touch.
                    </p>
                  </div>

                  {/* Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <LabelInputContainer>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Jane Doe"
                        type="text"
                        required
                        className="dark:bg-white"
                        autoComplete="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </LabelInputContainer>

                    <LabelInputContainer>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        placeholder="you@example.com"
                        type="email"
                        className="dark:bg-white"
                        required
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </LabelInputContainer>
                  </div>

                  {/* Subject */}
                  <LabelInputContainer>
                    <Label htmlFor="subject">Subject</Label>
                    <div className="rounded-lg p-[2px] transition duration-300 bg-transparent group/select">
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="dark:bg-white shadow-input flex w-full rounded-md border-none bg-gray-50 px-3 py-2 text-sm text-black transition duration-400 placeholder:text-neutral-400 focus-visible:ring-[2px] focus-visible:ring-neutral-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50  dark:text-black dark:shadow-[0px_0px_1px_1px_#404040] dark:focus-visible:ring-neutral-600 appearance-none cursor-pointer"
                      >
                        <option value="" disabled>
                          Select a topic…
                        </option>
                        {SUBJECTS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </LabelInputContainer>

                  {/* Message */}
                  <LabelInputContainer>
                    <div className="flex items-center justify-between mb-1">
                      <Label htmlFor="message">Message</Label>
                      <span className="text-xs text-gray-400 tabular-nums">
                        {formData.message.length} chars
                      </span>
                    </div>
                    <Textarea
                      id="message"
                      name="message"
                      // className="dark:bg-white"
                      placeholder="Tell us how we can help…"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="resize-none dark:bg-white dark:text-black"
                    />
                  </LabelInputContainer>

                  {/* Error */}
                  {error && (
                    <p className="text-sm text-red-500 font-medium">{error}</p>
                  )}

                  {/* Submit */}
                  <div className="flex items-center gap-4 pt-1">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex items-center justify-center gap-2 h-11 px-8 rounded-md bg-[#303d32] text-white text-sm font-semibold hover:bg-[#26342a] active:bg-[#1e2a22] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          Send Message
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    <p className="text-xs text-gray-400">
                      We typically reply within 1–2 business days.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </MaxWidthWrapper>
      </section>

      {/* ── FAQ strip ───────────────────────────────────────────────────── */}
      {/* <section className="bg-gray-50 border-t border-gray-100 py-16">
        <MaxWidthWrapper>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Looking for quick answers?
              </h2>
              <p className="text-sm text-gray-500 max-w-md leading-relaxed">
                Browse our common questions about shipping, sizing, returns, and
                more before reaching out.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="/shipping"
                className="inline-flex items-center justify-center gap-2 h-10 px-6 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:border-gray-500 hover:text-gray-900 transition-colors"
              >
                Shipping Info
              </Link>
              <Link
                href="/orders"
                className="inline-flex items-center justify-center gap-2 h-10 px-6 rounded-md bg-[#303d32] text-white text-sm font-semibold hover:bg-[#26342a] transition-colors"
              >
                Track My Order
              </Link>
            </div>
          </div>
        </MaxWidthWrapper>
      </section> */}
    </>
  );
}

// ── Success state ──────────────────────────────────────────────────────────
function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-start justify-center py-8 space-y-5">
      <div className="w-16 h-16 rounded-full bg-[#303d32] flex items-center justify-center">
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.75}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Message sent!</h2>
        <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
          Thanks for reaching out. We&apos;ve also sent a confirmation to your
          inbox. Our team will get back to you within{' '}
          <strong className="text-gray-900">1–2 business days</strong>.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Link
          href="/products"
          className="inline-flex items-center justify-center gap-2 h-10 px-6 rounded-md bg-[#303d32] text-white text-sm font-semibold hover:bg-[#26342a] transition-colors"
        >
          Browse Products
          <ArrowRight className="w-4 h-4" />
        </Link>
        <button
          onClick={onReset}
          className="inline-flex items-center justify-center h-10 px-6 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:border-gray-500 hover:text-gray-900 transition-colors"
        >
          Send another message
        </button>
      </div>
    </div>
  );
}
