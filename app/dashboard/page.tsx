
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

  const scoreCards = [
    {
      title: "Overall Score",
      value: scores.overall,
      description: "Current performance",
    },
    {
      title: "Technical",
      value: scores.technical,
      description: "Technical knowledge",
    },
    {
      title: "Communication",
      value: scores.communication,
      description: "Answer clarity",
    },
    {
      title: "Problem Solving",
      value: scores.problemSolving,
      description: "Reasoning ability",
    },
    {
      title: "Answer Structure",
      value: scores.answerStructure,
      description: "Answer organization",
    },
  ];

  const skillBars = [
    {
      title: "Technical Knowledge",
      value: scores.technical,
    },
    {
      title: "Communication",
      value: scores.communication,
    },
    {
      title: "Problem Solving",
      value: scores.problemSolving,
    },
    {
      title: "Answer Structure",
      value: scores.answerStructure,
    },
  ];

  return (
    <main className="min-h-screen bg-[#f7f8f7] text-[#183b4d]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[#e4eae8] bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2b887d] text-sm font-bold text-white shadow-sm">
              AI
            </div>

            <span className="text-base font-bold tracking-tight text-[#183b4d] sm:text-lg">
              Interview Analyzer
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex flex-wrap items-center gap-2">
            <Link
              href="/dashboard"
              className="rounded-xl bg-[#eaf5f2] px-3 py-2 text-sm font-semibold text-[#2b887d]"
            >
              Dashboard
            </Link>

            {[
              { href: "/skills", label: "Skills" },
              { href: "/improvement", label: "Improvement" },
              { href: "/analytics", label: "Analytics" },
              { href: "/history", label: "History" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-2 text-sm font-medium text-[#71818a] transition hover:bg-[#f0f6f4] hover:text-[#2b887d]"
              >
                {item.label}
              </Link>
            ))}

            {/* Profile */}
            <div className="ml-1 flex items-center gap-2 border-l border-[#e4eae8] pl-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eaf5f2] text-sm font-semibold text-[#2b887d]">
                S
              </div>

              <span className="hidden text-sm font-medium text-[#526b77] sm:block">
                Student
              </span>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="rounded-xl border border-[#f0dada] bg-[#fff7f7] px-3 py-2 text-sm font-semibold text-[#b15a5a] transition hover:border-[#e5bcbc] hover:bg-[#fff0f0]"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Dashboard Content */}
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-10 lg:px-8">
        {/* Page Heading */}
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#2b887d]">
              Welcome back 👋
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#183b4d] sm:text-4xl">
              Your Interview Dashboard
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#71818a] sm:text-base">
              Understand your strengths, identify skill gaps, and improve with
              AI-powered interview feedback.
            </p>
          </div>

          <Link
            href="/assessment"
            className="inline-flex items-center justify-center rounded-xl bg-[#2b887d] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#216d64] hover:shadow-md"
          >
            Start Assessment →
          </Link>
        </div>

        {/* Interview Statistics */}
        <div className="mt-9 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#e4eae8] bg-white p-6 shadow-[0_10px_35px_rgba(24,59,77,0.05)]">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[#71818a]">
                Total Interviews
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf5f2] text-[#2b887d]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
            </div>

            <p className="mt-5 text-4xl font-bold tracking-tight text-[#183b4d]">
              {loadingScores ? "..." : totalInterviews}
            </p>

            <p className="mt-2 text-sm text-[#8a999f]">
              Completed assessments
            </p>
          </div>

          <div className="rounded-2xl border border-[#e4eae8] bg-white p-6 shadow-[0_10px_35px_rgba(24,59,77,0.05)]">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[#71818a]">
                Latest Interview
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf5f2] text-[#2b887d]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" />
                  <path d="M16 2v4" />
                  <path d="M8 2v4" />
                  <path d="M3 10h18" />
                  <path d="m9 16 2 2 4-4" />
                </svg>
              </div>
            </div>

            <p className="mt-5 text-2xl font-bold tracking-tight text-[#183b4d]">
              {loadingScores
                ? "..."
                : latestInterviewDate || "No interviews yet"}
            </p>

            <p className="mt-2 text-sm text-[#8a999f]">
              Most recent assessment date
            </p>
          </div>
        </div>

        {/* Section Heading */}
        <div className="mt-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2b887d]">
            Performance overview
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#183b4d]">
            Your Interview Scores
          </h2>
        </div>

        {/* Score Cards */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {scoreCards.map((card, index) => (
            <div
              key={card.title}
              className="rounded-2xl border border-[#e4eae8] bg-white p-5 shadow-[0_10px_35px_rgba(24,59,77,0.04)] transition hover:-translate-y-1 hover:border-[#b9dcd5] hover:shadow-[0_14px_35px_rgba(43,136,125,0.08)]"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[#71818a]">
                  {card.title}
                </p>

                <span className="text-xs font-semibold text-[#a2afb4]">
                  0{index + 1}
                </span>
              </div>

              <p className="mt-5 text-3xl font-bold tracking-tight text-[#183b4d]">
                {loadingScores ? "..." : `${card.value}%`}
              </p>

              <p className="mt-2 text-xs leading-5 text-[#8a999f]">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Skill Overview */}
          <div className="rounded-3xl border border-[#e4eae8] bg-white p-6 shadow-[0_10px_35px_rgba(24,59,77,0.05)] sm:p-8 lg:col-span-2">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2b887d]">
                  Skill profile
                </p>

                <h3 className="mt-2 text-2xl font-bold tracking-tight text-[#183b4d]">
                  Your Current Skills
                </h3>

                <p className="mt-2 text-sm text-[#8a999f]">
                  Your latest interview performance by skill.
                </p>
              </div>

              <Link
                href="/skills"
                className="text-sm font-semibold text-[#2b887d] transition hover:text-[#216d64]"
              >
                View details →
              </Link>
            </div>

            <div className="mt-8 space-y-7">
              {skillBars.map((skill) => (
                <div key={skill.title}>
                  <div className="mb-3 flex items-center justify-between gap-4 text-sm">
                    <span className="font-medium text-[#526b77]">
                      {skill.title}
                    </span>

                    <span className="font-bold text-[#183b4d]">
                      {loadingScores ? "..." : `${skill.value}%`}
                    </span>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-[#edf3f1]">
                    <div
                      className="h-2.5 rounded-full bg-[#2b887d] transition-all duration-700"
                      style={{
                        width: `${Math.min(
                          Math.max(skill.value, 0),
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Start Assessment Card */}
          <div className="relative overflow-hidden rounded-3xl bg-[#183b4d] p-6 text-white shadow-[0_14px_40px_rgba(24,59,77,0.12)] sm:p-8">
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#2b887d]/30 blur-3xl" />

            <div className="relative z-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#a8e3da]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
                </svg>
              </div>

              <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-[#a8e3da]">
                Ready to practice?
              </p>

              <h3 className="mt-3 text-2xl font-bold tracking-tight">
                Test your skills
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#c1d1d7]">
                Take an AI-powered mock interview and receive personalized
                feedback to improve your performance.
              </p>

              <Link
                href="/assessment"
                className="mt-8 block rounded-xl bg-[#2b887d] px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-[#3a9b90]"
              >
                Start Assessment →
              </Link>

              <Link
                href="/analytics"
                className="mt-3 block rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-center text-sm font-semibold text-white transition hover:border-[#8ad5ca] hover:bg-white/10"
              >
                Progress Analytics →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Quick Actions */}
        <div className="mt-8 rounded-3xl border border-[#e4eae8] bg-white p-6 shadow-[0_10px_35px_rgba(24,59,77,0.04)] sm:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-xl font-bold text-[#183b4d]">
                Continue your improvement journey
              </h3>

              <p className="mt-2 text-sm text-[#71818a]">
                Review your past interviews or explore ways to improve your
                performance.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/history"
                className="rounded-xl border border-[#dce5e2] px-4 py-3 text-sm font-semibold text-[#526b77] transition hover:border-[#2b887d] hover:text-[#2b887d]"
              >
                View History
              </Link>

              <Link
                href="/improvement"
                className="rounded-xl bg-[#eaf5f2] px-4 py-3 text-sm font-semibold text-[#2b887d] transition hover:bg-[#dcefeb]"
              >
                Improve Skills
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}