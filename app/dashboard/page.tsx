
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function DashboardPage() {
  const router = useRouter();
  const [scores, setScores] = useState({
    overall: 0,
    technical: 0,
    communication: 0,
    problemSolving: 0,
    answerStructure: 0,
  });

  const [loadingScores, setLoadingScores] = useState(true);
  const [totalInterviews, setTotalInterviews] = useState(0);
  const [latestInterviewDate, setLatestInterviewDate] = useState("");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };
  useEffect(() => {
    const loadScores = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("interview_results")
        .select(
          "overall_score, technical_score, communication_score, problem_solving_score, answer_structure_score"
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error loading dashboard scores:", error.message);
        setLoadingScores(false);
        return;
      }

      if (data) {
        setScores({
          overall: data.overall_score ?? 0,
          technical: data.technical_score ?? 0,
          communication: data.communication_score ?? 0,
          problemSolving: data.problem_solving_score ?? 0,
          answerStructure: data.answer_structure_score ?? 0,
        });
      }
      const { count, error: countError } = await supabase
        .from("interview_results")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (!countError) {
        setTotalInterviews(count ?? 0);
      }

      const { data: latestInterview, error: latestError } = await supabase
        .from("interview_results")
        .select("created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!latestError && latestInterview) {
        setLatestInterviewDate(
          new Date(latestInterview.created_at).toLocaleDateString()
        );
      }
      setLoadingScores(false);

    };

    loadScores();
  }, [router]);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">

          <h1 className="text-xl font-bold">
            AI Interview Analyzer
          </h1>

          <div className="flex flex-wrap items-center gap-2">

            <a
              href="/dashboard"
              className="rounded-xl border border-cyan-400 px-4 py-2 text-sm font-medium text-cyan-400"
            >
              Dashboard
            </a>

            <a
              href="/skills"
              className="rounded-xl border border-gray-700 px-4 py-2 text-sm font-medium transition hover:border-cyan-400 hover:text-cyan-400"
            >
              Skills
            </a>

            <a
              href="/improvement"
              className="rounded-xl border border-gray-700 px-4 py-2 text-sm font-medium transition hover:border-cyan-400 hover:text-cyan-400"
            >
              Improvement
            </a>

            <a
              href="/analytics"
              className="rounded-xl border border-gray-700 px-4 py-2 text-sm font-medium transition hover:border-cyan-400 hover:text-cyan-400"
            >
              Analytics
            </a>

            <a
              href="/history"
              className="rounded-xl border border-gray-700 px-4 py-2 text-sm font-medium transition hover:border-cyan-400 hover:text-cyan-400"
            >
              History
            </a>

            {/* Student Profile */}
            <div className="ml-2 flex items-center gap-3 border-l border-gray-800 pl-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800">
                S
              </div>

              <span className="text-sm text-gray-300">
                Student
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="rounded-xl border border-red-900 px-4 py-2 text-sm font-medium text-red-400 transition hover:border-red-400 hover:text-red-300"
            >
              Logout
            </button>

          </div>
        </div>
      </header>

      {/* Dashboard */}
      <section className="mx-auto max-w-7xl px-6 py-10">

        <div>
          <p className="text-sm text-gray-500">
            Welcome back 👋
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            Your Interview Dashboard
          </h2>

          <p className="mt-3 text-gray-400">
            Understand your strengths, identify skill gaps,
            and improve with AI-powered feedback.
          </p>
        </div>

        {/* Interview Statistics */}
        <div className="mt-10 grid gap-5 md:grid-cols-2">

          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
            <p className="text-sm text-gray-500">
              Total Interviews
            </p>

            <p className="mt-3 text-4xl font-bold">
              {loadingScores ? "..." : totalInterviews}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Completed assessments
            </p>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
            <p className="text-sm text-gray-500">
              Latest Interview
            </p>

            <p className="mt-3 text-2xl font-bold">
              {loadingScores
                ? "..."
                : latestInterviewDate || "No interviews yet"}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Most recent assessment date
            </p>
          </div>

        </div>
        {/* Score Cards */}
        <div className="mt-10 grid gap-5 md:grid-cols-3 lg:grid-cols-5">

          {/* Overall Score */}
          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
            <p className="text-sm text-gray-500">
              Overall Score
            </p>

            <p className="mt-3 text-4xl font-bold">
              {loadingScores ? "..." : `${scores.overall}%`}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Current performance
            </p>
          </div>

          {/* Technical Score */}
          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
            <p className="text-sm text-gray-500">
              Technical
            </p>

            <p className="mt-3 text-4xl font-bold">
              {loadingScores ? "..." : `${scores.technical}%`}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Technical knowledge
            </p>
          </div>

          {/* Communication Score */}
          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
            <p className="text-sm text-gray-500">
              Communication
            </p>

            <p className="mt-3 text-4xl font-bold">
              {loadingScores ? "..." : `${scores.communication}%`}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Answer clarity
            </p>
          </div>

          {/* Problem Solving Score */}
          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
            <p className="text-sm text-gray-500">
              Problem Solving
            </p>

            <p className="mt-3 text-4xl font-bold">
              {loadingScores ? "..." : `${scores.problemSolving}%`}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Reasoning ability
            </p>
          </div>
          
          {/* Answer Structure Score */}
          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
            <p className="text-sm text-gray-500">
              Answer Structure
            </p>

            <p className="mt-3 text-4xl font-bold">
              {loadingScores ? "..." : `${scores.answerStructure}%`}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Answer organization
            </p>
          </div>

        </div>

        {/* Main Content */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">

          {/* Skill Overview */}
          <div className="rounded-3xl border border-gray-800 bg-gray-950 p-8 lg:col-span-2">

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  SKILL PROFILE
                </p>

                <h3 className="mt-1 text-2xl font-semibold">
                  Your Current Skills
                </h3>
              </div>

              <a
                href="/skills"
                className="text-sm text-gray-400 hover:text-white"
              >
                View details →
              </a>
            </div>

            <div className="mt-8 space-y-6">

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span>Technical Knowledge</span>
                  <span>
                    {loadingScores ? "..." : `${scores.technical}%`}
                  </span>
                </div>

                <div className="h-2 rounded-full bg-gray-800">
                  <div
                    className="h-2 rounded-full bg-white"
                    style={{ width: `${scores.technical}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span>Communication</span>
                  <span>
                    {loadingScores ? "..." : `${scores.communication}%`}
                  </span>
                </div>

                <div className="h-2 rounded-full bg-gray-800">
                  <div
                    className="h-2 rounded-full bg-white"
                    style={{ width: `${scores.communication}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span>Problem Solving</span>
                  <span>
                    {loadingScores ? "..." : `${scores.problemSolving}%`}
                  </span>
                </div>

                <div className="h-2 rounded-full bg-gray-800">
                  <div
                    className="h-2 rounded-full bg-white"
                    style={{ width: `${scores.problemSolving}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span>Answer Structure</span>
                  <span>
                    {loadingScores ? "..." : `${scores.answerStructure}%`}
                  </span>
                </div>

                <div className="h-2 rounded-full bg-gray-800">
                  <div
                    className="h-2 rounded-full bg-white"
                    style={{ width: `${scores.answerStructure}%` }}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Start Assessment */}
          <div className="rounded-3xl border border-gray-800 bg-gray-950 p-8">

            <p className="text-sm text-gray-500">
              READY TO PRACTICE?
            </p>

            <h3 className="mt-3 text-2xl font-bold">
              Test your skills
            </h3>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              Take an AI-powered mock interview and receive
              personalized feedback.
            </p>

            <a
              href="/assessment"
              className="mt-8 block rounded-xl bg-white py-3 text-center font-semibold text-black transition hover:bg-gray-200"
            >
              Start Assessment →
            </a>

            <a
              href="/analytics"
              className="mt-4 inline-block rounded-xl border border-gray-700 px-6 py-3 font-semibold transition hover:border-cyan-400 hover:text-cyan-400"
            >
              Progress Analytics →
            </a>

          </div>

        </div>

      </section>
    </main>
  );
}