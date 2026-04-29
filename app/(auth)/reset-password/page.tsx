"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [invalidLink, setInvalidLink] = useState(false);

  useEffect(() => {
    if (!token || !email) setInvalidLink(true);
  }, [token, email]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post("/api/auth/reset-password", {
        token,
        email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      toast.success("Password updated! Please sign in.");
      router.push("/login");
    } catch (err: any) {
      const message =
        err.response?.data?.error ?? "Something went wrong. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (invalidLink) {
    return (
      <div className="mt-8 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-neutral-800 flex items-center justify-center mx-auto">
          <svg
            className="w-7 h-7 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white">Invalid reset link</h2>
        <p className="text-sm text-neutral-400">
          This link is missing required parameters. Please request a new one.
        </p>
        <Link
          href="/forgot-password"
          className="inline-block mt-2 text-sm text-white font-semibold hover:text-purple-400"
        >
          Request new link &rarr;
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="text-lg font-semibold text-center mt-2 text-neutral-600 dark:text-neutral-300">
        Choose a new password
      </p>
      <p className="text-sm text-center text-neutral-500 mt-1">
        Make it at least 6 characters.
      </p>

      <form onSubmit={handleSubmit} className="my-8 space-y-5">
        <LabelInputContainer>
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            name="password"
            required
            autoComplete="new-password"
            value={formData.password}
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input
            id="confirmPassword"
            placeholder="••••••••"
            type="password"
            name="confirmPassword"
            required
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
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
            <LoaderFive text="Updating password..." />
          ) : (
            <p>Update Password &rarr;</p>
          )}
          <BottomGradient />
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 overflow-hidden relative">
      <Spotlight />

      <div className="shadow-input mx-auto w-full max-w-md rounded-none p-4 md:rounded-2xl md:p-8 bg-black">
        <div className="flex items-center justify-center">
          <NavbarLogo />
        </div>

        <Suspense fallback={null}>
          <ResetPasswordForm />
        </Suspense>

        <p className="mt-6 text-center text-sm text-gray-600">
          Back to{" "}
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
