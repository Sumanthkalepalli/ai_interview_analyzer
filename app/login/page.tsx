"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="w-full max-w-md">

        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold">
            AI Interview Analyzer
          </h1>

          <p className="mt-3 text-gray-400">
            Sign in to continue your skill journey
          </p>
        </div>

        <div className="rounded-3xl border border-gray-800 bg-gray-950 p-8">

          <h2 className="text-2xl font-semibold">
            Welcome back
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Enter your details to access your dashboard.
          </p>

          <div className="mt-8 space-y-5">

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Email
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-800 bg-black px-4 py-3 outline-none transition focus:border-gray-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Password
              </label>

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-800 bg-black px-4 py-3 outline-none transition focus:border-gray-500"
              />
              <p className="mt-2 text-right text-sm">
                <Link
                  href="/forgot-password"
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  Forgot password?
                </Link>
              </p>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full rounded-xl bg-white py-3 font-semibold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            {message && (
              <p className="rounded-xl border border-gray-800 bg-black p-4 text-center text-sm text-gray-300">
                {message}
              </p>
            )}

          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-white hover:underline"
            >
              Create one
            </Link>
          </p>

        </div>
      </div>
    </main>
  );
}