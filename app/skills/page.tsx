"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

type Skill = {
  name: string;
  score: number;
  description: string;
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
          score: data.technical_score,
          description:
            "Understanding of programming concepts and technical interview topics.",
        },
        {
          name: "Communication",
          score: data.communication_score,
          description:
            "Ability to explain ideas clearly and communicate answers effectively.",
        },
        {
          name: "Problem Solving",
          score: data.problem_solving_score,
          description:
            "Ability to analyze problems and develop logical solutions.",
        },
        {
          name: "Answer Structure",
          score: data.answer_structure_score,
          description:
            "How clearly and logically your interview answers are organized.",
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
              My Skills
            </h1>

            <p className="mt-2 text-gray-400">
              Understand your current interview skill levels.
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
              Loading your skills...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-900 bg-red-950/30 p-6 text-red-300">
            {error}
          </div>
        )}

        {/* No Results */}
        {!loading && !error && skills.length === 0 && (
          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-10 text-center">
            <h2 className="text-2xl font-semibold">
              No skill data yet
            </h2>

            <p className="mt-2 text-gray-500">
              Complete an AI interview to generate your skill scores.
            </p>

            <Link
              href="/assessment"
              className="mt-6 inline-block rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:bg-cyan-400"
            >
              Start Interview
            </Link>
          </div>
        )}

        {/* Skills */}
        {!loading && !error && skills.length > 0 && (
          <>
            <section className="grid gap-6 md:grid-cols-2">

              {skills.map((skill) => (
                <div
                  key={skill.name}
                  className="rounded-2xl border border-gray-800 bg-gray-950 p-7"
                >

                  <div className="flex items-center justify-between">

                    <div>
                      <h2 className="text-xl font-semibold">
                        {skill.name}
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-gray-500">
                        {skill.description}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-3xl font-bold text-cyan-400">
                        {skill.score}
                      </p>

                      <p className="text-xs text-gray-500">
                        {getScoreLabel(skill.score)}
                      </p>
                    </div>

                  </div>

                  {/* Progress Bar */}
                  <div className="mt-6">

                    <div className="mb-2 flex justify-between text-xs text-gray-500">
                      <span>Skill Level</span>
                      <span>{skill.score}%</span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-gray-800">
                      <div
                        className="h-full rounded-full bg-cyan-500 transition-all"
                        style={{
                          width: `${skill.score}%`,
                        }}
                      />
                    </div>

                  </div>

                </div>
              ))}

            </section>

            {/* Improvement Note */}
            <section className="mt-8 rounded-2xl border border-cyan-900/50 bg-gray-950 p-7">

              <p className="text-sm font-medium text-cyan-400">
                AI SKILL INSIGHT
              </p>

              <h2 className="mt-1 text-2xl font-semibold">
                Keep Improving
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-gray-400">
                Your skill scores are based on your latest AI interview
                evaluation. Take more interviews to track how your skills
                change over time.
              </p>

              <Link
                href="/analytics"
                className="mt-6 inline-block rounded-xl border border-gray-700 px-6 py-3 font-semibold transition hover:border-cyan-400 hover:text-cyan-400"
              >
                View Progress Analytics →
              </Link>

            </section>

          </>
        )}

      </div>
    </main>
  );
}