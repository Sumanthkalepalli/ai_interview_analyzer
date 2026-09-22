
"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      setMessage("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage(
      "Account created successfully. Please check your email to verify your account."
    );

    setLoading(false);
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f8f7] px-5 py-10 text-[#183b4d] sm:px-6">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[#dcefeb] opacity-70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-[#e4f1ee] opacity-80 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2b887d] text-lg font-bold text-white shadow-sm">
              AI
            </div>

            <span className="text-xl font-bold tracking-tight text-[#183b4d]">
              Interview Analyzer
            </span>
          </Link>

          <p className="mt-4 text-sm leading-6 text-[#71818a]">
            Create your account and begin your skill journey.
          </p>
        </div>

        {/* Register Card */}
        <div className="rounded-3xl border border-[#e4eae8] bg-white p-6 shadow-[0_18px_55px_rgba(24,59,77,0.08)] sm:p-8">
          <div className="mb-8">
            <div className="mb-4 inline-flex rounded-full bg-[#eaf5f2] px-3 py-1 text-xs font-semibold text-[#2b887d]">
              Get started
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#183b4d]">
              Create your account
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#71818a]">
              Set up your profile to start practicing and improving your
              interview skills.
            </p>
          </div>

          <div className="space-y-5">
            {/* Full Name Field */}
            <div>
              <label
                htmlFor="fullName"
                className="mb-2 block text-sm font-semibold text-[#304f5e]"
              >
                Full name
              </label>

              <input
                id="fullName"
                type="text"
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                className="w-full rounded-xl border border-[#dce5e2] bg-[#fbfcfc] px-4 py-3 text-sm text-[#183b4d] outline-none transition placeholder:text-[#a2afb4] focus:border-[#2b887d] focus:bg-white focus:ring-4 focus:ring-[#2b887d]/10"
              />
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-[#304f5e]"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full rounded-xl border border-[#dce5e2] bg-[#fbfcfc] px-4 py-3 text-sm text-[#183b4d] outline-none transition placeholder:text-[#a2afb4] focus:border-[#2b887d] focus:bg-white focus:ring-4 focus:ring-[#2b887d]/10"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-[#304f5e]"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) {
                    handleRegister();
                  }
                }}
                className="w-full rounded-xl border border-[#dce5e2] bg-[#fbfcfc] px-4 py-3 text-sm text-[#183b4d] outline-none transition placeholder:text-[#a2afb4] focus:border-[#2b887d] focus:bg-white focus:ring-4 focus:ring-[#2b887d]/10"
              />

              <p className="mt-2 text-xs leading-5 text-[#8a999f]">
                Use a secure password that you can remember.
              </p>
            </div>

            {/* Register Button */}
            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full rounded-xl bg-[#2b887d] px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#216d64] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

            {/* Status Message */}
            {message && (
              <div
                role="alert"
                className="rounded-xl border border-[#dce5e2] bg-[#f4faf8] p-4 text-center text-sm leading-5 text-[#2b887d]"
              >
                {message}
              </div>
            )}

            {/* Login Link */}
            <div className="border-t border-[#edf1ef] pt-6 text-center">
              <p className="text-sm text-[#71818a]">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-[#2b887d] transition hover:text-[#216d64] hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-[#71818a] transition hover:text-[#2b887d]"
          >
            ← Back to home
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-[#9aa8ad]">
          AI Interview Analyzer • Practice. Improve. Succeed.
        </p>
      </div>
    </main>
  );
}