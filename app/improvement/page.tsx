
"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Lightbulb,
  LoaderCircle,
  MessageCircle,
  Target,
  TrendingUp,
  Trophy,
  Wrench,
} from "lucide-react";
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

type DayPlanProps = {
  day: string;
  title: string;
  description: string;
  icon: ReactNode;
  step: string;
};

function DayPlanCard({
  day,
  title,
  description,
  icon,
  step,
}: DayPlanProps) {
  return (
    <div className="group rounded-2xl border border-[#e2ebe8] bg-[#f9fcfb] p-6 transition duration-200 hover:-translate-y-1 hover:border-[#b8dcd5] hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e9f6f2] text-[#2b887d]">
          {icon}
        </div>

        <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold tracking-[0.12em] text-[#71818a]">
          {day}
        </span>
      </div>

      <p className="mt-6 text-xs font-bold tracking-[0.14em] text-[#2b887d]">
        {step}
      </p>

      <h3 className="mt-1 text-xl font-bold text-[#183b4d]">{title}</h3>

      <p className="mt-3 text-sm leading-7 text-[#71818a]">{description}</p>
    </div>
  );
}

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
    <main className="min-h-screen bg-[#f6f9f8] px-4 py-6 text-[#183b4d] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-8 rounded-3xl border border-[#e1eae7] bg-white px-5 py-6 shadow-sm sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-lg bg-[#e9f6f2] p-2 text-[#2b887d]">
                  <TrendingUp size={18} />
                </div>

                <p className="text-xs font-bold tracking-[0.18em] text-[#2b887d]">
                  AI INTERVIEW ANALYZER
                </p>
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Personalized Improvement
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-[#71818a] sm:text-base">
                Follow your AI-generated improvement plan to strengthen your
                interview performance.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl border border-[#dce7e4] px-5 py-3 text-sm font-semibold text-[#49616d] transition hover:border-[#2b887d] hover:text-[#2b887d]"
              >
                Dashboard
                <ChevronRight size={16} />
              </Link>

              <Link
                href="/analytics"
                className="inline-flex items-center gap-2 rounded-xl bg-[#2b887d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#236f66]"
              >
                Analytics
                <TrendingUp size={16} />
              </Link>
            </div>
          </div>
        </header>

        {/* Loading */}
        {loading && (
          <div className="rounded-3xl border border-[#e1eae7] bg-white p-12 text-center shadow-sm">
            <LoaderCircle
              className="mx-auto animate-spin text-[#2b887d]"
              size={32}
            />

            <p className="mt-4 text-sm font-medium text-[#71818a]">
              Loading your improvement plan...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            <p className="font-semibold">
              Unable to load your improvement plan
            </p>

            <p className="mt-2">{error}</p>
          </div>
        )}

        {/* No Data */}
        {!loading && !error && !result && (
          <div className="rounded-3xl border border-[#e1eae7] bg-white p-10 text-center shadow-sm sm:p-16">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e9f6f2] text-[#2b887d]">
              <Brain size={30} />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-[#183b4d]">
              No improvement plan yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#71818a]">
              Complete an AI interview to generate your personalized
              recommendations and improvement roadmap.
            </p>

            <Link
              href="/assessment"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#2b887d] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#236f66]"
            >
              Start Interview
              <ArrowRight size={17} />
            </Link>
          </div>
        )}

        {/* Improvement Plan */}
        {!loading && !error && result && (
          <>
            {/* Plan Introduction */}
            <section className="mb-8 rounded-3xl bg-[#183b4d] p-6 text-white shadow-sm sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold tracking-[0.16em] text-[#9ddbd1]">
                    YOUR DEVELOPMENT PLAN
                  </p>

                  <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                    Improve one step at a time
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[#c4d3d9]">
                    Review the areas identified by the AI evaluator and follow
                    the three-day roadmap to prepare for your next interview.
                  </p>
                </div>

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#2b887d] text-white">
                  <Trophy size={27} />
                </div>
              </div>
            </section>

            {/* Weaknesses */}
            <section className="mb-8 rounded-3xl border border-[#e1eae7] bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold tracking-[0.16em] text-[#2b887d]">
                    IDENTIFIED GAPS
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    Areas to Improve
                  </h2>

                  <p className="mt-2 text-sm text-[#71818a]">
                    Focus on these areas based on your latest interview
                    evaluation.
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff5e8] text-[#c28a3c]">
                  <Target size={21} />
                </div>
              </div>

              {result.weaknesses && result.weaknesses.length > 0 ? (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {result.weaknesses.map((weakness, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-[#e6eeeb] bg-[#f8fbfa] p-5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fff0dc] text-xs font-bold text-[#b77b2e]">
                          {index + 1}
                        </span>

                        <p className="text-xs font-bold tracking-[0.08em] text-[#84929a]">
                          AREA {index + 1}
                        </p>
                      </div>

                      <p className="mt-4 text-sm font-semibold leading-6 text-[#183b4d]">
                        {weakness}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-6 rounded-2xl bg-[#f8fbfa] p-5 text-sm text-[#71818a]">
                  No specific weaknesses were recorded in this evaluation.
                </p>
              )}
            </section>

            {/* Three-Day Plan */}
            <section className="mb-8 rounded-3xl border border-[#e1eae7] bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold tracking-[0.16em] text-[#2b887d]">
                    PERSONALIZED PLAN
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    3-Day Improvement Roadmap
                  </h2>

                  <p className="mt-2 text-sm text-[#71818a]">
                    Use this structured plan to prepare for your next
                    assessment.
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e9f6f2] text-[#2b887d]">
                  <CalendarCheck size={21} />
                </div>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-3">
                <DayPlanCard
                  day="DAY 01"
                  step="STEP 01"
                  title="Learn"
                  description={
                    result.improvement_plan?.day1 ||
                    "Review your identified weaknesses and study the relevant concepts."
                  }
                  icon={<BookOpen size={23} />}
                />

                <DayPlanCard
                  day="DAY 02"
                  step="STEP 02"
                  title="Practice"
                  description={
                    result.improvement_plan?.day2 ||
                    "Practice interview questions and apply the concepts you reviewed."
                  }
                  icon={<Wrench size={23} />}
                />

                <DayPlanCard
                  day="DAY 03"
                  step="STEP 03"
                  title="Reassess"
                  description={
                    result.improvement_plan?.day3 ||
                    "Complete another interview and compare your performance with the previous attempt."
                  }
                  icon={<ClipboardCheck size={23} />}
                />
              </div>
            </section>

            {/* AI Suggestions */}
            <section className="mb-8 rounded-3xl border border-[#cfe5df] bg-[#f1faf7] p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold tracking-[0.16em] text-[#2b887d]">
                    AI RECOMMENDATIONS
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    Recommended Actions
                  </h2>

                  <p className="mt-2 text-sm text-[#71818a]">
                    Practical actions you can follow to improve your next
                    interview performance.
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#2b887d]">
                  <Lightbulb size={21} />
                </div>
              </div>

              {result.suggestions && result.suggestions.length > 0 ? (
                <div className="mt-6 space-y-3">
                  {result.suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 rounded-2xl border border-[#dcece6] bg-white p-5"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e9f6f2] text-sm font-bold text-[#2b887d]">
                        {index + 1}
                      </div>

                      <p className="text-sm leading-7 text-[#49616d]">
                        {suggestion}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-6 rounded-2xl bg-white p-5 text-sm text-[#71818a]">
                  No additional recommendations were recorded in this
                  evaluation.
                </p>
              )}
            </section>

            {/* Reminder */}
            <section className="mb-8 rounded-3xl border border-[#e1eae7] bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e9f6f2] text-[#2b887d]">
                  <MessageCircle size={21} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#183b4d]">
                    Keep practicing consistently
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#71818a]">
                    Use the recommendations above during your preparation,
                    then complete another interview to evaluate your progress.
                  </p>
                </div>
              </div>
            </section>

            {/* Actions */}
            <section className="mb-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/assessment"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2b887d] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#236f66]"
              >
                Take Another Interview
                <ArrowRight size={17} />
              </Link>

              <Link
                href="/analytics"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#dce7e4] bg-white px-6 py-3 text-sm font-bold text-[#49616d] transition hover:border-[#2b887d] hover:text-[#2b887d]"
              >
                View Progress
                <TrendingUp size={17} />
              </Link>

              <Link
                href="/history"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#dce7e4] bg-white px-6 py-3 text-sm font-bold text-[#49616d] transition hover:border-[#2b887d] hover:text-[#2b887d]"
              >
                Interview History
                <ChevronRight size={17} />
              </Link>
            </section>
          </>
        )}
      </div>
    </main>
  );
}