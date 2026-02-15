// ============================================
// src/app/(auth)/register/page.tsx - COMPLETE REGISTER PAGE
// ============================================
"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, UserPlus, AlertCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { Input } from "@/components/ui/input";
import LabelInputContainer from "@/components/ui/label-input-container";
import { Label } from "@/components/ui/label";
import BottomGradient from "@/components/ui/bottom-gradient";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOnlyfans,
} from "@tabler/icons-react";
import { Spotlight } from "@/components/ui/spotlight-new";
import { LoaderFive } from "@/components/ui/loader";
import { NavbarLogo } from "@/components/ui/resizable-navbar";

export default function RegisterPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      if (session.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (formData.name.length < 2) {
      setError("Name must be at least 2 characters long");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      // Register the user
      const registerResponse = await axios.post("/api/register", {
        name: formData.name.trim(),
        email: formData.email.toLowerCase(),
        password: formData.password,
      });

      if (registerResponse.status === 201) {
        toast.success("Account created successfully!");

        // Automatically sign in the user
        const signInResult = await signIn("credentials", {
          email: formData.email.toLowerCase(),
          password: formData.password,
          redirect: false,
        });

        if (signInResult?.error) {
          setError(
            "Account created but sign-in failed. Please try logging in.",
          );
          toast.error("Please try logging in manually");
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        } else if (signInResult?.ok) {
          toast.success("Logged in successfully!");
          // The useEffect will handle the redirect
        }
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      const errorMessage =
        error.response?.data?.error || "Registration failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setIsGoogleLoading(true);

    try {
      await signIn("google", {
        redirect: false,
      });
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError("Failed to sign in with Google");
      toast.error("Failed to sign in with Google");
      setIsGoogleLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 overflow-hidden relative">
      <Spotlight />

      <div className="shadow-input mx-auto w-full max-w-md rounded-none  p-4 md:rounded-2xl md:p-8 bg-black">
        <div className="flex items-center justify-center">
          <NavbarLogo />
        </div>
        <p className="text-lg font-semibold text-center mt-2 max-w-sm  text-neutral-600 dark:text-neutral-300">
          Create Your Account
        </p>

        <form onSubmit={handleSubmit} className="my-8 space-y-5">
          <LabelInputContainer>
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              placeholder="Full name"
              type="text"
              name="name"
              required
              autoComplete="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={isLoading || isGoogleLoading}
            />
          </LabelInputContainer>

          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="username@domain.com"
              type="email"
              name="email"
              required
              autoComplete="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading || isGoogleLoading}
            />
          </LabelInputContainer>

          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              name="password"
              required
              autoComplete="new-password"
              value={formData.password}
              onChange={handleInputChange}
              disabled={isLoading || isGoogleLoading}
            />
          </LabelInputContainer>

          <LabelInputContainer className="mb-4">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              placeholder="••••••••"
              name="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              disabled={isLoading || isGoogleLoading}
            />
          </LabelInputContainer>

          <button
            className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
            type="submit"
          >
            {isLoading ? (
              <>
                <LoaderFive text="Creating account..." />
              </>
            ) : (
              <p>Create Account &rarr;</p>
            )}

            <BottomGradient />
          </button>

          <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

          <div className="flex flex-col space-y-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading || isGoogleLoading}
              className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
              type="submit"
            >
              <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                Google
              </span>
              <BottomGradient />
            </button>
          </div>
        </form>

        {/* <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading || isGoogleLoading}
          className="mt-4 w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGoogleLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign up with Google
            </>
          )}
        </button>
      </div> */}

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
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
