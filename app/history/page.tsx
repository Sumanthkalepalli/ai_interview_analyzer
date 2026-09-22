
"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  History as HistoryIcon,
  LoaderCircle,
  MessageCircle,
  Target,
  Trophy,
  Users,
} from "lucide-react";
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

type ScoreItemProps = {
  title: string;
  score: number;
  icon: ReactNode;
};

function ScoreItem({ title, score, icon }: ScoreItemProps) {
  return (
    <div className="rounded-2xl border border-[#e4ece9] bg-[#f8fbfa] p-4 transition hover:border-[#b9dcd5]">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-[#71818a]">{title}</p>

        <span className="text-[#2b887d]">{icon}</span>
      </div>

      <p className="mt-2 text-2xl font-bold text-[#183b4d]">{score}%</p>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e1ebe7]">
        <div
          className="h-full rounded-full bg-[#2b887d]"
          style={{ width: `${Math.min(Math.max(score, 0), 100)}%` }}
        />
      </div>
    </div>
  );
}

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
    <main className="min-h-screen bg-[#f6f9f8] px-4 py-6 text-[#183b4d] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-8 rounded-3xl border border-[#e1eae7] bg-white px-5 py-6 shadow-sm sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-lg bg-[#e9f6f2] p-2 text-[#2b887d]">
                  <HistoryIcon size={18} />
                </div>

                <p className="text-xs font-bold tracking-[0.18em] text-[#2b887d]">
                  AI INTERVIEW ANALYZER
                </p>
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Interview History
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-[#71818a] sm:text-base">
                Review your previous interview performances and track your
                development over time.
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
                <BarChart3 size={16} />
              </Link>
            </div>
          </div>
        </header>

        {/* Summary */}
        {!loading && !error && results.length > 0 && (
          <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-[#e1eae7] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-[#71818a]">
                  Total Interviews
                </p>

                <div className="rounded-xl bg-[#e9f6f2] p-3 text-[#2b887d]">
                  <ClipboardList size={20} />
                </div>
              </div>

              <p className="mt-3 text-3xl font-bold text-[#183b4d]">
                {results.length}
              </p>

              <p className="mt-1 text-xs text-[#84929a]">
                Completed interview attempts
              </p>
            </div>

            <div className="rounded-2xl border border-[#e1eae7] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-[#71818a]">
                  Latest Score
                </p>

                <div className="rounded-xl bg-[#e9f6f2] p-3 text-[#2b887d]">
                  <Trophy size={20} />
                </div>
              </div>

              <p className="mt-3 text-3xl font-bold text-[#2b887d]">
                {results[0].overall_score}/100
              </p>

              <p className="mt-1 text-xs text-[#84929a]">
                Score from your latest interview
              </p>
            </div>

            <div className="rounded-2xl border border-[#e1eae7] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-[#71818a]">
                  Latest Interview
                </p>

                <div className="rounded-xl bg-[#e9f6f2] p-3 text-[#2b887d]">
                  <CalendarDays size={20} />
                </div>
              </div>

              <p className="mt-3 text-lg font-bold text-[#183b4d]">
                {new Date(results[0].created_at).toLocaleDateString()}
              </p>

              <p className="mt-1 text-xs text-[#84929a]">
                Date of your most recent attempt
              </p>
            </div>
          </section>
        )}

        {/* Loading */}
        {loading && (
          <div className="rounded-3xl border border-[#e1eae7] bg-white p-12 text-center shadow-sm">
            <LoaderCircle
              className="mx-auto animate-spin text-[#2b887d]"
              size={32}
            />

            <p className="mt-4 text-sm font-medium text-[#71818a]">
              Loading your interview history...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            <p className="font-semibold">Unable to load interview history</p>

            <p className="mt-2">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && results.length === 0 && (
          <div className="rounded-3xl border border-[#e1eae7] bg-white p-10 text-center shadow-sm sm:p-16">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e9f6f2] text-[#2b887d]">
              <HistoryIcon size={30} />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-[#183b4d]">
              No interviews yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#71818a]">
              Complete your first AI interview to see your scores and
              performance history here.
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

        {/* History */}
        {!loading && !error && results.length > 0 && (
          <section>
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold tracking-[0.16em] text-[#2b887d]">
                  PERFORMANCE RECORDS
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  Previous Interviews
                </h2>

                <p className="mt-2 text-sm text-[#71818a]">
                  Your latest interview appears first.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-[#84929a]">
                <CheckCircle2 size={15} className="text-[#2b887d]" />
                {results.length} recorded{" "}
                {results.length === 1 ? "attempt" : "attempts"}
              </div>
            </div>

            <div className="space-y-5">
              {results.map((result, index) => (
                <article
                  key={result.id}
                  className="rounded-3xl border border-[#e1eae7] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-7"
                >
                  {/* Interview Header */}
                  <div className="flex flex-col gap-5 border-b border-[#e8efed] pb-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="rounded-2xl bg-[#e9f6f2] p-3 text-[#2b887d]">
                        <ClipboardList size={22} />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-xs font-bold tracking-[0.12em] text-[#2b887d]">
                            INTERVIEW #{results.length - index}
                          </p>

                          {index === 0 && (
                            <span className="rounded-full bg-[#e9f6f2] px-2.5 py-1 text-[10px] font-bold text-[#2b887d]">
                              LATEST
                            </span>
                          )}
                        </div>

                        <h3 className="mt-1 text-xl font-bold text-[#183b4d]">
                          AI Interview Assessment
                        </h3>

                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#84929a]">
                          <CalendarDays size={14} />

                          {new Date(result.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-[#edf8f5] px-5 py-4 md:min-w-[150px] md:text-right">
                      <p className="text-xs font-semibold text-[#71818a]">
                        Overall Score
                      </p>

                      <p className="mt-1 text-4xl font-bold text-[#2b887d]">
                        {result.overall_score}
                      </p>

                      <p className="text-xs text-[#84929a]">out of 100</p>
                    </div>
                  </div>

                  {/* Score Cards */}
                  <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <ScoreItem
                      title="Technical"
                      score={result.technical_score}
                      icon={<Target size={16} />}
                    />

                    <ScoreItem
                      title="Communication"
                      score={result.communication_score}
                      icon={<MessageCircle size={16} />}
                    />

                    <ScoreItem
                      title="Problem Solving"
                      score={result.problem_solving_score}
                      icon={<LightbulbIcon />}
                    />

                    <ScoreItem
                      title="Answer Structure"
                      score={result.answer_structure_score}
                      icon={<ClipboardList size={16} />}
                    />
                  </div>

                  {/* Footer */}
                  <div className="mt-6 flex flex-col gap-3 border-t border-[#e8efed] pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2 text-xs text-[#84929a]">
                      <CheckCircle2 size={15} className="text-[#2b887d]" />
                      Interview result saved
                    </div>

                    <Link
                      href="/analytics"
                      className="inline-flex items-center justify-center gap-2 text-sm font-bold text-[#2b887d] transition hover:text-[#236f66]"
                    >
                      View Analytics
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Bottom Action */}
        {!loading && (
          <section className="mt-8 pb-10">
            <div className="rounded-3xl bg-[#183b4d] p-6 text-white shadow-sm sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold tracking-[0.16em] text-[#9ddbd1]">
                    KEEP PRACTICING
                  </p>

                  <h2 className="mt-2 text-2xl font-bold">
                    Ready for another interview?
                  </h2>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-[#c4d3d9]">
                    Continue practicing to improve your interview confidence
                    and strengthen your performance.
                  </p>
                </div>

                <Link
                  href="/assessment"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#2b887d] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#3b9b8f]"
                >
                  Take Another Interview
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function LightbulbIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M15.09 14c.18-.72.63-1.34 1.15-1.85A6 6 0 1 0 7.76 12.1c.56.53 1.02 1.16 1.18 1.9L9 16h6Z" />
    </svg>
  );
}