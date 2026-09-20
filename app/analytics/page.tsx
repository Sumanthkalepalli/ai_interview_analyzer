"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { supabase } from "../../lib/supabase";

type InterviewResult = {
  id: string;
  overall_score: number;
  technical_score: number;
  communication_score: number;
  problem_solving_score: number;
  answer_structure_score: number;
  assessment_type: string;
  created_at: string;
};

type ChartData = {
  attempt: string;
  overall: number;
  technical: number;
  communication: number;
  problemSolving: number;
  answerStructure: number;
};

export default function AnalyticsPage() {
  const [results, setResults] = useState<InterviewResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
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
          "id, overall_score, technical_score, communication_score, problem_solving_score, answer_structure_score, assessment_type, created_at"
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (fetchError) {
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      setResults(data || []);
      setLoading(false);
    };

    loadAnalytics();
  }, []);

  const chartData: ChartData[] = results.map((result, index) => ({
    attempt: `Attempt ${index + 1}`,
    overall: result.overall_score,
    technical: result.technical_score,
    communication: result.communication_score,
    problemSolving: result.problem_solving_score,
    answerStructure: result.answer_structure_score,
  }));

  const latestResult = results[results.length - 1];
  const initialResult = results.find(
    (result) => result.assessment_type === "initial"
  );

  const reassessmentResult = results.find(
    (result) => result.assessment_type === "reassessment"
  );
  const overallImprovement =
    initialResult && reassessmentResult
      ? reassessmentResult.overall_score - initialResult.overall_score
      : null;
  const technicalImprovement =
    initialResult && reassessmentResult
      ? reassessmentResult.technical_score - initialResult.technical_score
      : null;
  const communicationImprovement =
    initialResult && reassessmentResult
      ? reassessmentResult.communication_score -
      initialResult.communication_score
      : null;
  const problemSolvingImprovement =
    initialResult && reassessmentResult
      ? reassessmentResult.problem_solving_score -
      initialResult.problem_solving_score
      : null;
  const answerStructureImprovement =
    initialResult && reassessmentResult
      ? reassessmentResult.answer_structure_score -
      initialResult.answer_structure_score
      : null;

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
              Progress Analytics
            </h1>

            <p className="mt-2 text-gray-400">
              Track how your interview performance changes over time.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/dashboard"
              className="rounded-xl border border-gray-700 px-4 py-3 text-sm font-medium transition hover:border-cyan-400 hover:text-cyan-400"
            >
              Dashboard
            </Link>

            <Link
              href="/skills"
              className="rounded-xl border border-gray-700 px-4 py-3 text-sm font-medium transition hover:border-cyan-400 hover:text-cyan-400"
            >
              Skills
            </Link>

            <Link
              href="/improvement"
              className="rounded-xl border border-gray-700 px-4 py-3 text-sm font-medium transition hover:border-cyan-400 hover:text-cyan-400"
            >
              Improvement
            </Link>

            <Link
              href="/history"
              className="rounded-xl border border-gray-700 px-4 py-3 text-sm font-medium transition hover:border-cyan-400 hover:text-cyan-400"
            >
              History
            </Link>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-10 text-center">
            <p className="text-gray-400">
              Loading your progress...
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
        {!loading && !error && results.length === 0 && (
          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-10 text-center">
            <h2 className="text-2xl font-semibold">
              No analytics available yet
            </h2>

            <p className="mt-2 text-gray-500">
              Complete an interview to start tracking your progress.
            </p>

            <Link
              href="/assessment"
              className="mt-6 inline-block rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:bg-cyan-400"
            >
              Start Interview
            </Link>
          </div>
        )}

        {/* Analytics */}
        {!loading && !error && results.length > 0 && (
          <>
            {/* Latest Scores */}
            <section className="mb-8 grid gap-5 md:grid-cols-6">

              <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
                <p className="text-sm text-gray-400">
                  Latest Overall
                </p>

                <p className="mt-2 text-4xl font-bold text-cyan-400">
                  {latestResult.overall_score}
                </p>

                <p className="text-sm text-gray-500">
                  / 100
                </p>
              </div>

              <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
                <p className="text-sm text-gray-400">
                  Technical
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {latestResult.technical_score}%
                </p>
              </div>

              <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
                <p className="text-sm text-gray-400">
                  Communication
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {latestResult.communication_score}%
                </p>
              </div>

              <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
                <p className="text-sm text-gray-400">
                  Problem Solving
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {latestResult.problem_solving_score}%
                </p>
              </div>

              <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
                <p className="text-sm text-gray-400">
                  Answer Structure
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {latestResult.answer_structure_score}%
                </p>
              </div>
              <div className="rounded-2xl border border-cyan-900/50 bg-gray-950 p-6">
                <p className="text-sm text-gray-400">
                  Improvement
                </p>

                <p className="mt-2 text-3xl font-bold text-cyan-400">
                  {overallImprovement !== null
                    ? `${overallImprovement > 0 ? "+" : ""}${overallImprovement}`
                    : "—"}
                </p>

                <p className="text-sm text-gray-500">
                  Overall score change
                </p>
              </div>

            </section>
            {/* Reassessment Comparison */}
            {initialResult && reassessmentResult && (
              <section className="mb-8 rounded-2xl border border-cyan-900/50 bg-gray-950 p-7">
                <p className="text-sm font-medium text-cyan-400">
                  REASSESSMENT
                </p>

                <h2 className="mt-1 text-2xl font-semibold">
                  Initial vs Reassessment
                </h2>

                <div className="mt-6 grid gap-3 md:grid-cols-7">
                  <div className="rounded-xl bg-gray-900 p-6">
                    <p className="text-sm text-gray-400">
                      Initial Assessment
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      {initialResult.overall_score}/100
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-900 p-6">
                    <p className="text-sm text-gray-400">
                      Reassessment
                    </p>

                    <p className="mt-2 text-3xl font-bold text-cyan-400">
                      {reassessmentResult.overall_score}/100
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-900 p-6">
                    <p className="text-sm text-gray-400">
                      Improvement
                    </p>

                    <p className="mt-2 text-3xl font-bold text-cyan-400">
                      {overallImprovement !== null && overallImprovement > 0
                        ? `+${overallImprovement}`
                        : overallImprovement}
                    </p>
                  </div>
                  <div className="rounded-xl bg-gray-900 p-6">
                    <p className="text-sm text-gray-400">
                      Technical Improvement
                    </p>

                    <p className="mt-2 text-3xl font-bold text-cyan-400">
                      {technicalImprovement !== null && technicalImprovement > 0
                        ? `+${technicalImprovement}`
                        : technicalImprovement}
                    </p>
                  </div>
                  <div className="rounded-xl bg-gray-900 p-6">
                    <p className="text-sm text-gray-400">
                      Communication Improvement
                    </p>

                    <p className="mt-2 text-3xl font-bold text-cyan-400">
                      {communicationImprovement !== null &&
                        communicationImprovement > 0
                        ? `+${communicationImprovement}`
                        : communicationImprovement}
                    </p>
                  </div>
                  <div className="rounded-xl bg-gray-900 p-6">
                    <p className="text-sm text-gray-400">
                      Problem Solving Improvement
                    </p>

                    <p className="mt-2 text-3xl font-bold text-cyan-400">
                      {problemSolvingImprovement !== null &&
                        problemSolvingImprovement > 0
                        ? `+${problemSolvingImprovement}`
                        : problemSolvingImprovement}
                    </p>
                  </div>
                  <div className="rounded-xl bg-gray-900 p-6">
                    <p className="text-sm text-gray-400">
                      Answer Structure Improvement
                    </p>

                    <p className="mt-2 text-3xl font-bold text-cyan-400">
                      {answerStructureImprovement !== null &&
                        answerStructureImprovement > 0
                        ? `+${answerStructureImprovement}`
                        : answerStructureImprovement}
                    </p>
                  </div>

                </div>
              </section>
            )}
            {/* Overall Progress */}
            <section className="mb-8 rounded-2xl border border-gray-800 bg-gray-950 p-7">

              <p className="text-sm font-medium text-cyan-400">
                PERFORMANCE
              </p>

              <h2 className="mt-1 text-2xl font-semibold">
                Overall Score Progress
              </h2>

              <div className="mt-6 h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="attempt" />

                    <YAxis domain={[0, 100]} />

                    <Tooltip />

                    <Line
                      type="monotone"
                      dataKey="overall"
                      strokeWidth={3}
                      name="Overall"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

            </section>

            {/* Skill Progress */}
            <section className="mb-8 rounded-2xl border border-gray-800 bg-gray-950 p-7">

              <p className="text-sm font-medium text-cyan-400">
                SKILL PROGRESS
              </p>

              <h2 className="mt-1 text-2xl font-semibold">
                Skill Improvement
              </h2>

              <div className="mt-6 h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="attempt" />

                    <YAxis domain={[0, 100]} />

                    <Tooltip />

                    <Line
                      type="monotone"
                      dataKey="technical"
                      strokeWidth={2}
                      name="Technical"
                    />

                    <Line
                      type="monotone"
                      dataKey="communication"
                      strokeWidth={2}
                      name="Communication"
                    />

                    <Line
                      type="monotone"
                      dataKey="problemSolving"
                      strokeWidth={2}
                      name="Problem Solving"
                    />

                    <Line
                      type="monotone"
                      dataKey="answerStructure"
                      strokeWidth={2}
                      name="Answer Structure"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

            </section>

            {/* Attempts */}
            <section className="mb-8 rounded-2xl border border-gray-800 bg-gray-950 p-7">

              <p className="text-sm font-medium text-cyan-400">
                INTERVIEW ATTEMPTS
              </p>

              <h2 className="mt-1 text-2xl font-semibold">
                Your Progress
              </h2>

              <div className="mt-6 space-y-4">

                {results.map((result, index) => (
                  <div
                    key={result.id}
                    className="flex flex-col gap-4 rounded-xl bg-gray-900 p-5 md:flex-row md:items-center md:justify-between"
                  >

                    <div>
                      <p className="font-semibold">
                        {result.assessment_type === "reassessment"
                          ? "Reassessment"
                          : "Initial Assessment"}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {new Date(result.created_at).toLocaleString()}
                      </p>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-sm text-gray-400">
                        Overall Score
                      </p>

                      <p className="text-2xl font-bold text-cyan-400">
                        {result.overall_score}/100
                      </p>
                    </div>

                  </div>
                ))}

              </div>

            </section>

            <div className="pb-10">
              <Link
                href="/assessment"
                className="inline-block rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:bg-cyan-400"
              >
                Take Another Interview
              </Link>
            </div>
          </>
        )}

      </div>
    </main>
  );
}