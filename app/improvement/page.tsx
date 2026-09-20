"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

type ImprovementPlan = {
  day1: string;
  day2: string;
  day3: string;
};

type InterviewResult = {
  id: string;
  weaknesses: string[];
  suggestions: string[];
  improvement_plan: ImprovementPlan;
  created_at: string;
};

export default function ImprovementPage() {
  const [result, setResult] = useState<InterviewResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadImprovementPlan = async () => {
      setLoading(true);
      setError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("interview_results")
        .select(
          "id, weaknesses, suggestions, improvement_plan, created_at"
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) {
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      if (!data) {
        setResult(null);
        setLoading(false);
        return;
      }

      setResult(data as InterviewResult);
      setLoading(false);
    };

    loadImprovementPlan();
  }, []);

  return (
    <main className="min-h-screen bg-black px-6 py-8 text-white">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-cyan-400">
              AI INTERVIEW ANALYZER
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              Personalized Improvement
            </h1>

            <p className="mt-2 text-gray-400">
              Your AI-generated plan for improving interview performance.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="rounded-xl border border-gray-700 px-5 py-3 text-sm font-medium transition hover:border-cyan-400 hover:text-cyan-400"
          >
            Dashboard
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-10 text-center">
            <p className="text-gray-400">
              Loading your improvement plan...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-900 bg-red-950/30 p-6 text-red-300">
            {error}
          </div>
        )}

        {/* No Data */}
        {!loading && !error && !result && (
          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-10 text-center">
            <h2 className="text-2xl font-semibold">
              No improvement plan yet
            </h2>

            <p className="mt-2 text-gray-500">
              Complete an AI interview to generate your personalized plan.
            </p>

            <Link
              href="/assessment"
              className="mt-6 inline-block rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:bg-cyan-400"
            >
              Start Interview
            </Link>
          </div>
        )}

        {/* Improvement Plan */}
        {!loading && !error && result && (
          <>
            {/* Weaknesses */}
            <section className="mb-8 rounded-2xl border border-gray-800 bg-gray-950 p-7">

              <p className="text-sm font-medium text-cyan-400">
                IDENTIFIED GAPS
              </p>

              <h2 className="mt-1 text-2xl font-semibold">
                Areas to Improve
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-3">

                {result.weaknesses?.map(
                  (weakness, index) => (
                    <div
                      key={index}
                      className="rounded-xl bg-gray-900 p-5"
                    >
                      <p className="text-sm text-gray-500">
                        Area {index + 1}
                      </p>

                      <p className="mt-2 font-medium">
                        {weakness}
                      </p>
                    </div>
                  )
                )}

              </div>
            </section>

            {/* 3-Day Plan */}
            <section className="mb-8 rounded-2xl border border-gray-800 bg-gray-950 p-7">

              <p className="text-sm font-medium text-cyan-400">
                PERSONALIZED PLAN
              </p>

              <h2 className="mt-1 text-2xl font-semibold">
                3-Day Improvement Roadmap
              </h2>

              <div className="mt-6 grid gap-5 md:grid-cols-3">

                <div className="rounded-xl bg-gray-900 p-6">
                  <p className="text-sm font-medium text-cyan-400">
                    DAY 01
                  </p>

                  <h3 className="mt-2 text-lg font-semibold">
                    Learn
                  </h3>

                  <p className="mt-3 leading-7 text-gray-400">
                    {result.improvement_plan?.day1}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-900 p-6">
                  <p className="text-sm font-medium text-cyan-400">
                    DAY 02
                  </p>

                  <h3 className="mt-2 text-lg font-semibold">
                    Practice
                  </h3>

                  <p className="mt-3 leading-7 text-gray-400">
                    {result.improvement_plan?.day2}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-900 p-6">
                  <p className="text-sm font-medium text-cyan-400">
                    DAY 03
                  </p>

                  <h3 className="mt-2 text-lg font-semibold">
                    Reassess
                  </h3>

                  <p className="mt-3 leading-7 text-gray-400">
                    {result.improvement_plan?.day3}
                  </p>
                </div>

              </div>
            </section>

            {/* AI Suggestions */}
            <section className="mb-8 rounded-2xl border border-cyan-900/50 bg-gray-950 p-7">

              <p className="text-sm font-medium text-cyan-400">
                AI RECOMMENDATIONS
              </p>

              <h2 className="mt-1 text-2xl font-semibold">
                Recommended Actions
              </h2>

              <div className="mt-6 space-y-4">

                {result.suggestions?.map(
                  (suggestion, index) => (
                    <div
                      key={index}
                      className="flex gap-4 rounded-xl bg-gray-900 p-5"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-500 font-bold text-black">
                        {index + 1}
                      </div>

                      <p className="leading-7 text-gray-300">
                        {suggestion}
                      </p>
                    </div>
                  )
                )}

              </div>
            </section>

            {/* Actions */}
            <section className="flex flex-col gap-4 pb-10 sm:flex-row">

              <Link
                href="/assessment"
                className="rounded-xl bg-cyan-500 px-6 py-3 text-center font-semibold text-black transition hover:bg-cyan-400"
              >
                Take Another Interview
              </Link>

              <Link
                href="/analytics"
                className="rounded-xl border border-gray-700 px-6 py-3 text-center font-semibold transition hover:border-cyan-400 hover:text-cyan-400"
              >
                View Progress
              </Link>

            </section>
          </>
        )}

      </div>
    </main>
  );
}