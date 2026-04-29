"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import LabelInputContainer from "@/components/ui/label-input-container";
import { Label } from "@/components/ui/label";
import BottomGradient from "@/components/ui/bottom-gradient";
import { Spotlight } from "@/components/ui/spotlight-new";
import { LoaderFive } from "@/components/ui/loader";
import { NavbarLogo } from "@/components/ui/resizable-navbar";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post("/api/auth/forgot-password", {
        email: email.toLowerCase().trim(),
      });
      setSubmitted(true);
      toast.success("Check your inbox!");
    } catch {
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 overflow-hidden relative">
      <Spotlight />

      <div className="shadow-input mx-auto w-full max-w-md rounded-none p-4 md:rounded-2xl md:p-8 bg-black">
        <div className="flex items-center justify-center">
          <NavbarLogo />
        </div>

        {submitted ? (
          <div className="mt-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-neutral-800 flex items-center justify-center mx-auto">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0L12 13.5 2.25 6.75"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white">Check your email</h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              If <span className="text-white">{email}</span> is registered,
              you&apos;ll receive a password reset link shortly. The link
              expires in 1 hour.
            </p>
            <p className="text-xs text-neutral-600 pt-2">
              Didn&apos;t receive it? Check your spam folder or{" "}
              <button
                onClick={() => {
                  setSubmitted(false);
                  setEmail("");
                }}
                className="text-white underline underline-offset-2 hover:text-purple-400"
              >
                try again
              </button>
              .
            </p>
          </div>
        ) : (
          <>
            <p className="text-lg font-semibold text-center mt-2 text-neutral-600 dark:text-neutral-300">
              Forgot your password?
            </p>
            <p className="text-sm text-center text-neutral-500 mt-1">
              Enter your email and we&apos;ll send you a reset link.
            </p>

            <form onSubmit={handleSubmit} className="my-8 space-y-5">
              <LabelInputContainer>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  placeholder="username@domain.com"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setError("");
                    setEmail(e.target.value);
                  }}
                  disabled={isLoading}
                />
              </LabelInputContainer>

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <LoaderFive text="Sending link..." />
                ) : (
                  <p>Send Reset Link &rarr;</p>
                )}
                <BottomGradient />
              </button>
            </form>
          </>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-white font-semibold hover:text-purple-700"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
