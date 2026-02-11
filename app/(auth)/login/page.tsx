"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import LabelInputContainer from "@/components/ui/label-input-container";
import { Label } from "@/components/ui/label";
import BottomGradient from "@/components/ui/bottom-gradient";
import { IconBrandGoogle } from "@tabler/icons-react";
import { Spotlight } from "@/components/ui/spotlight-new";
import { LoaderFive } from "@/components/ui/loader";
import { NavbarLogo } from "@/components/ui/resizable-navbar";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle redirect after login based on role
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const callbackUrl = searchParams.get("callbackUrl");

      if (callbackUrl) {
        router.push(callbackUrl);
      } else if (session.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
  }, [status, session, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        email: formData.email.toLowerCase(),
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        toast.error("Invalid email or password");
      } else if (result?.ok) {
        toast.success("Login successful!");
        // The useEffect will handle the redirect
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.");
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
          Welcome Back
        </p>

        <form onSubmit={handleSubmit} className="my-8 space-y-5">
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
              autoComplete="current-password"
              value={formData.password}
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
                <LoaderFive text="Signing in..." />
              </>
            ) : (
              <p>Sign In &rarr;</p>
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

        <p className="mt-8 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-white font-semibold hover:text-purple-700"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
