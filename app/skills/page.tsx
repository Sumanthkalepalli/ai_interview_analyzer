
"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  ChevronRight,
  Code2,
  Lightbulb,
  LoaderCircle,
  MessageCircle,
  Target,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

type Skill = {
  name: string;
  score: number;
  description: string;
  icon: ReactNode;
};

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSkills = async () => {
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
          "technical_score, communication_score, problem_solving_score, answer_structure_score"
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
        setSkills([]);
        setLoading(false);
        return;
      }

      const skillData: Skill[] = [
        {
          name: "Technical Knowledge",
          score: Number(data.technical_score) || 0,
          description:
            "Understanding of programming concepts and technical interview topics.",
          icon: <Code2 size={23} />,
        },
        {
          name: "Communication",
          score: Number(data.communication_score) || 0,
          description:
            "Ability to explain ideas clearly and communicate answers effectively.",
          icon: <Users size={23} />,
        },
        {
          name: "Problem Solving",
          score: Number(data.problem_solving_score) || 0,
          description:
            "Ability to analyze problems and develop logical solutions.",
          icon: <Brain size={23} />,
        },
        {
          name: "Answer Structure",
          score: Number(data.answer_structure_score) || 0,
          description:
            "How clearly and logically your interview answers are organized.",
          icon: <MessageCircle size={23} />,
        },
      ];

      setSkills(skillData);
      setLoading(false);
    };

    loadSkills();
  }, []);

  const getScoreLabel = (score: number) => {
    if (score >= 80) {
      return "Strong";
    }

    if (score >= 60) {
      return "Developing";
    }

    return "Needs Practice";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) {
      return {
        text: "text-[#2b887d]",
        background: "bg-[#e9f6f2]",
        bar: "bg-[#2b887d]",
        badge: "bg-[#e9f6f2] text-[#2b887d]",
      };
    }

    if (score >= 60) {
      return {
        text: "text-[#bd8738]",
        background: "bg-[#fff5e8]",
        bar: "bg-[#d9a04d]",
        badge: "bg-[#fff5e8] text-[#bd8738]",
      };
    }

    return {
      text: "text-[#c56b62]",
      background: "bg-[#fff0ee]",
      bar: "bg-[#d98278]",
      badge: "bg-[#fff0ee] text-[#c56b62]",
    };
  };

  const getScoreWidth = (score: number) => {
    return Math.max(0, Math.min(100, score));
  };

  const averageScore =
    skills.length > 0
      ? Math.round(
          skills.reduce((total, skill) => total + skill.score, 0) /
            skills.length
        )
      : 0;

  const strongSkills = skills.filter((skill) => skill.score >= 80).length;
  const skillsToImprove = skills.filter((skill) => skill.score < 60).length;

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
                My Skills
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-[#71818a] sm:text-base">
                Understand your current interview skill levels and identify
                areas where you can improve.
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
                href="/assessment"
                className="inline-flex items-center gap-2 rounded-xl bg-[#2b887d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#236f66]"
              >
                New Interview
                <ArrowRight size={16} />
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
              Loading your skills...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            <p className="font-semibold">Unable to load your skills</p>
            <p className="mt-2">{error}</p>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && skills.length === 0 && (
          <div className="rounded-3xl border border-[#e1eae7] bg-white p-10 text-center shadow-sm sm:p-16">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e9f6f2] text-[#2b887d]">
              <Target size={30} />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-[#183b4d]">
              No skill data yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#71818a]">
              Complete an AI interview to generate your skill scores and
              understand your current performance.
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

        {/* Skills */}
        {!loading && !error && skills.length > 0 && (
          <>
            {/* Summary Cards */}
            <section className="mb-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#e1eae7] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold tracking-[0.08em] text-[#84929a]">
                    AVERAGE SCORE
                  </p>

                  <div className="rounded-xl bg-[#e9f6f2] p-2 text-[#2b887d]">
                    <TrendingUp size={18} />
                  </div>
                </div>

                <div className="mt-4 flex items-end gap-2">
                  <p className="text-3xl font-bold text-[#183b4d]">
                    {averageScore}
                  </p>

                  <p className="mb-1 text-sm text-[#84929a]">/ 100</p>
                </div>

                <p className="mt-2 text-xs text-[#71818a]">
                  Across your evaluated skills
                </p>
              </div>

              <div className="rounded-2xl border border-[#e1eae7] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold tracking-[0.08em] text-[#84929a]">
                    STRONG SKILLS
                  </p>

                  <div className="rounded-xl bg-[#e9f6f2] p-2 text-[#2b887d]">
                    <CheckCircle2 size={18} />
                  </div>
                </div>

                <p className="mt-4 text-3xl font-bold text-[#183b4d]">
                  {strongSkills}
                </p>

                <p className="mt-2 text-xs text-[#71818a]">
                  Skills scoring 80 or above
                </p>
              </div>

              <div className="rounded-2xl border border-[#e1eae7] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold tracking-[0.08em] text-[#84929a]">
                    NEEDS PRACTICE
                  </p>

                  <div className="rounded-xl bg-[#fff5e8] p-2 text-[#bd8738]">
                    <Wrench size={18} />
                  </div>
                </div>

                <p className="mt-4 text-3xl font-bold text-[#183b4d]">
                  {skillsToImprove}
                </p>

                <p className="mt-2 text-xs text-[#71818a]">
                  Skills scoring below 60
                </p>
              </div>
            </section>

            {/* Skill Cards */}
            <section className="mb-8">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-bold tracking-[0.16em] text-[#2b887d]">
                    SKILL BREAKDOWN
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    Your Interview Skills
                  </h2>
                </div>

                <p className="text-sm text-[#84929a]">
                  Based on your latest evaluation
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {skills.map((skill) => {
                  const colors = getScoreColor(skill.score);
                  const scoreWidth = getScoreWidth(skill.score);

                  return (
                    <div
                      key={skill.name}
                      className="rounded-3xl border border-[#e1eae7] bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md sm:p-7"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-start gap-4">
                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colors.background} ${colors.text}`}
                          >
                            {skill.icon}
                          </div>

                          <div>
                            <h3 className="text-lg font-bold text-[#183b4d]">
                              {skill.name}
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-[#71818a]">
                              {skill.description}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <p className={`text-3xl font-bold ${colors.text}`}>
                            {skill.score}
                          </p>

                          <span
                            className={`mt-1 inline-block rounded-full px-2 py-1 text-[10px] font-bold ${colors.badge}`}
                          >
                            {getScoreLabel(skill.score)}
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-7">
                        <div className="mb-2 flex items-center justify-between text-xs font-medium text-[#84929a]">
                          <span>Skill Level</span>
                          <span>{skill.score}%</span>
                        </div>

                        <div className="h-3 overflow-hidden rounded-full bg-[#edf2f0]">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${colors.bar}`}
                            style={{
                              width: `${scoreWidth}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Skill Insight */}
            <section className="mb-8 rounded-3xl border border-[#cfe5df] bg-[#f1faf7] p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#2b887d]">
                    <Lightbulb size={23} />
                  </div>

                  <div>
                    <p className="text-xs font-bold tracking-[0.16em] text-[#2b887d]">
                      AI SKILL INSIGHT
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-[#183b4d]">
                      Keep Improving
                    </h2>

                    <p className="mt-3 max-w-3xl text-sm leading-7 text-[#71818a]">
                      Your skill scores are based on your latest AI interview
                      evaluation. Continue practicing and take more interviews
                      to track how your skills change over time.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/analytics"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2b887d] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#236f66]"
                >
                  View Progress Analytics
                  <ArrowRight size={17} />
                </Link>

                <Link
                  href="/improvement"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#dce7e4] bg-white px-6 py-3 text-sm font-bold text-[#49616d] transition hover:border-[#2b887d] hover:text-[#2b887d]"
                >
                  Improvement Plan
                  <ChevronRight size={17} />
                </Link>
              </div>
            </section>

            {/* Bottom Actions */}
            <section className="mb-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/assessment"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2b887d] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#236f66]"
              >
                Take Another Interview
                <ArrowRight size={17} />
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