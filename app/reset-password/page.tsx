
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpdatePassword = async () => {
    if (!password || !confirmPassword) {
      setMessage("Please fill in both password fields.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage(
      "Password updated successfully. Redirecting to login..."
    );

    setTimeout(() => {
      router.push("/login");
    }, 2000);
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
            Secure your account with a new password.
          </p>
        </div>

        {/* Reset Password Card */}
        <div className="rounded-3xl border border-[#e4eae8] bg-white p-6 shadow-[0_18px_55px_rgba(24,59,77,0.08)] sm:p-8">
          {/* Icon */}
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf5f2] text-[#2b887d]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              <circle cx="12" cy="16" r="1" />
            </svg>
          </div>

          <div className="mb-8">
            <div className="mb-4 inline-flex rounded-full bg-[#eaf5f2] px-3 py-1 text-xs font-semibold text-[#2b887d]">
              Account security
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#183b4d]">
              Create a new password
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#71818a]">
              Enter and confirm your new password to secure your account.
            </p>
          </div>

          <div className="space-y-5">
            {/* New Password Field */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-[#304f5e]"
              >
                New password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full rounded-xl border border-[#dce5e2] bg-[#fbfcfc] px-4 py-3 text-sm text-[#183b4d] outline-none transition placeholder:text-[#a2afb4] focus:border-[#2b887d] focus:bg-white focus:ring-4 focus:ring-[#2b887d]/10"
              />

              <p className="mt-2 text-xs leading-5 text-[#8a999f]">
                Your password must contain at least 6 characters.
              </p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-semibold text-[#304f5e]"
              >
                Confirm password
              </label>

              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) {
                    handleUpdatePassword();
                  }
                }}
                className="w-full rounded-xl border border-[#dce5e2] bg-[#fbfcfc] px-4 py-3 text-sm text-[#183b4d] outline-none transition placeholder:text-[#a2afb4] focus:border-[#2b887d] focus:bg-white focus:ring-4 focus:ring-[#2b887d]/10"
              />
            </div>

            {/* Update Password Button */}
            <button
              onClick={handleUpdatePassword}
              disabled={loading}
              className="w-full rounded-xl bg-[#2b887d] px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#216d64] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Updating..." : "Update password"}
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
          </div>

          {/* Login Link */}
          <div className="mt-7 border-t border-[#edf1ef] pt-6 text-center">
            <p className="text-sm text-[#71818a]">
              Remember your password?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#2b887d] transition hover:text-[#216d64] hover:underline"
              >
                Sign in
              </Link>
            </p>
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