"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

    setMessage("Password updated successfully. Redirecting to login...");

    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="w-full max-w-md">

        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold">
            AI Interview Analyzer
          </h1>

          <p className="mt-3 text-gray-400">
            Create a new password
          </p>
        </div>

        <div className="rounded-3xl border border-gray-800 bg-gray-950 p-8">

          <h2 className="text-2xl font-semibold">
            Reset Password
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Enter your new password below.
          </p>

          <div className="mt-8 space-y-5">

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                New Password
              </label>

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-800 bg-black px-4 py-3 outline-none transition focus:border-gray-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Confirm Password
              </label>

              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-800 bg-black px-4 py-3 outline-none transition focus:border-gray-500"
              />
            </div>

            <button
              onClick={handleUpdatePassword}
              disabled={loading}
              className="w-full rounded-xl bg-white py-3 font-semibold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>

            {message && (
              <p className="rounded-xl border border-gray-800 bg-black p-4 text-center text-sm text-gray-300">
                {message}
              </p>
            )}

          </div>

        </div>
      </div>
    </main>
  );
}