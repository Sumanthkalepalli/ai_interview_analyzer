"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

type InterviewResult = {
  id: string;
  overall_score: number;
  technical_score: number;
  communication_score: number;
  problem_solving_score: number;
  answer_structure_score: number;
  created_at: string;
};

export default function HistoryPage() {
  const [results, setResults] = useState<InterviewResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHistory = async () => {
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
          "id, overall_score, technical_score, communication_score, problem_solving_score, answer_structure_score, created_at"
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      setResults(data || []);
      setLoading(false);
    };

    loadHistory();
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
              Interview History
            </h1>

            <p className="mt-2 text-gray-400">
              Review your previous interview performances.
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
          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-8 text-center">
            <p className="text-gray-400">
              Loading your interview history...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-900 bg-red-950/30 p-6 text-red-300">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && results.length === 0 && (
          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-10 text-center">
            <h2 className="text-2xl font-semibold">
              No interviews yet
            </h2>

            <p className="mt-2 text-gray-500">
              Complete your first AI interview to see your results here.
            </p>

            <Link
              href="/assessment"
              className="mt-6 inline-block rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:bg-cyan-400"
            >
              Start Interview
            </Link>
          </div>
        )}

        {/* History */}
        {!loading && !error && results.length > 0 && (
          <div className="space-y-5">

            {results.map((result, index) => (
              <div
                key={result.id}
                className="rounded-2xl border border-gray-800 bg-gray-950 p-7"
              >

                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                  <div>
                    <p className="text-sm text-cyan-400">
                      INTERVIEW #{results.length - index}
                    </p>

                    <h2 className="mt-1 text-xl font-semibold">
                      AI Interview Assessment
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                      {new Date(result.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-sm text-gray-400">
                      Overall Score
                    </p>

                    <p className="mt-1 text-4xl font-bold text-cyan-400">
                      {result.overall_score}
                    </p>

                    <p className="text-sm text-gray-500">
                      / 100
                    </p>
                  </div>

                </div>

                {/* Score Cards */}
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                  <div className="rounded-xl bg-gray-900 p-4">
                    <p className="text-sm text-gray-500">
                      Technical
                    </p>

                    <p className="mt-1 text-2xl font-semibold">
                      {result.technical_score}%
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-900 p-4">
                    <p className="text-sm text-gray-500">
                      Communication
                    </p>

                    <p className="mt-1 text-2xl font-semibold">
                      {result.communication_score}%
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-900 p-4">
                    <p className="text-sm text-gray-500">
                      Problem Solving
                    </p>

                    <p className="mt-1 text-2xl font-semibold">
                      {result.problem_solving_score}%
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-900 p-4">
                    <p className="text-sm text-gray-500">
                      Answer Structure
                    </p>

                    <p className="mt-1 text-2xl font-semibold">
                      {result.answer_structure_score}%
                    </p>
                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

        {/* Bottom Action */}
        {!loading && (
          <div className="mt-8 pb-10">
            <Link
              href="/assessment"
              className="inline-block rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:bg-cyan-400"
            >
              Take Another Interview
            </Link>
          </div>
        )}

      </div>
    </main>
  );
}