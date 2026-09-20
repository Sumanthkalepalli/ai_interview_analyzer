
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function AssessmentPage() {
  const router = useRouter();

  const [selectedMode, setSelectedMode] = useState("text");
  const [assessmentType, setAssessmentType] = useState("initial");

  // Check user authentication
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
      }
    };

    checkUser();
  }, [router]);

  const startInterview = () => {
    sessionStorage.setItem("interviewMode", selectedMode);
    sessionStorage.setItem("assessmentType", assessmentType);

    window.location.href = "/interview";
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-gray-800">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <h1 className="text-xl font-bold">
            AI Interview Analyzer
          </h1>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="text-center">
          <p className="text-sm uppercase tracking-widest text-gray-500">
            New Assessment
          </p>

          <h2 className="mt-3 text-4xl font-bold md:text-5xl">
            Choose Your Interview
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-400">
            Select a role and difficulty level. AI Interview Analyzer
            will create an assessment based on your choices.
          </p>
        </div>

        {/* Assessment Type */}
        <div className="mt-12">
          <label className="mb-3 block text-sm font-medium">
            Assessment Type
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <button
              type="button"
              onClick={() => setAssessmentType("initial")}
              className={`rounded-2xl border p-6 text-left transition ${
                assessmentType === "initial"
                  ? "border-cyan-400 bg-cyan-400/10"
                  : "border-gray-800 bg-gray-950"
              }`}
            >
              <div className="text-3xl">🆕</div>

              <h3 className="mt-4 font-semibold">
                Initial Assessment
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Take your first interview and get your AI skill analysis.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setAssessmentType("reassessment")}
              className={`rounded-2xl border p-6 text-left transition ${
                assessmentType === "reassessment"
                  ? "border-cyan-400 bg-cyan-400/10"
                  : "border-gray-800 bg-gray-950"
              }`}
            >
              <div className="text-3xl">🔄</div>

              <h3 className="mt-4 font-semibold">
                Reassessment
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Retake the interview and compare your improvement.
              </p>
            </button>
          </div>
        </div>

        {/* Career Role */}
        <div className="mt-10">
          <label className="mb-3 block text-sm font-medium">
            Select Career Role
          </label>

          <div className="grid gap-4 md:grid-cols-3">
            <button
              type="button"
              className="rounded-2xl border border-gray-800 bg-gray-950 p-6 text-left transition hover:border-gray-500"
            >
              <div className="text-3xl">💻</div>

              <h3 className="mt-4 font-semibold">
                Software Developer
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Programming, DSA, OOP and development concepts
              </p>
            </button>

            <button
              type="button"
              className="rounded-2xl border border-gray-800 bg-gray-950 p-6 text-left transition hover:border-gray-500"
            >
              <div className="text-3xl">📊</div>

              <h3 className="mt-4 font-semibold">
                Data Analyst
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                SQL, statistics, data analysis and reasoning
              </p>
            </button>

            <button
              type="button"
              className="rounded-2xl border border-gray-800 bg-gray-950 p-6 text-left transition hover:border-gray-500"
            >
              <div className="text-3xl">🌐</div>

              <h3 className="mt-4 font-semibold">
                Full Stack Developer
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Frontend, backend, APIs and databases
              </p>
            </button>
          </div>
        </div>

        {/* Difficulty */}
        <div className="mt-10">
          <label className="mb-3 block text-sm font-medium">
            Difficulty Level
          </label>

          <div className="grid gap-4 md:grid-cols-3">
            <button
              type="button"
              className="rounded-xl border border-gray-800 bg-gray-950 px-5 py-4 text-left hover:border-gray-500"
            >
              <span className="font-medium">Beginner</span>

              <span className="mt-1 block text-sm text-gray-500">
                Fundamentals
              </span>
            </button>

            <button
              type="button"
              className="rounded-xl border border-gray-800 bg-gray-950 px-5 py-4 text-left hover:border-gray-500"
            >
              <span className="font-medium">Intermediate</span>

              <span className="mt-1 block text-sm text-gray-500">
                Interview level
              </span>
            </button>

            <button
              type="button"
              className="rounded-xl border border-gray-800 bg-gray-950 px-5 py-4 text-left hover:border-gray-500"
            >
              <span className="font-medium">Advanced</span>

              <span className="mt-1 block text-sm text-gray-500">
                Challenging questions
              </span>
            </button>
          </div>
        </div>

        {/* Interview Mode */}
        <div className="mt-10">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Choose Interview Mode
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            <div
              onClick={() => setSelectedMode("text")}
              className={`cursor-pointer rounded-xl border p-5 transition ${
                selectedMode === "text"
                  ? "border-cyan-400 bg-cyan-400/10"
                  : "border-gray-800 bg-gray-950"
              }`}
            >
              <div className="text-3xl">⌨️</div>

              <h3 className="mt-3 font-semibold text-white">
                Text Interview
              </h3>

              <p className="mt-2 text-sm text-gray-400">
                Type your answers and receive AI evaluation.
              </p>
            </div>

            <div
              onClick={() => setSelectedMode("voice")}
              className={`cursor-pointer rounded-xl border p-5 transition ${
                selectedMode === "voice"
                  ? "border-cyan-400 bg-cyan-400/10"
                  : "border-gray-800 bg-gray-950"
              }`}
            >
              <div className="text-3xl">🎤</div>

              <h3 className="mt-3 font-semibold text-white">
                Voice Interview
              </h3>

              <p className="mt-2 text-sm text-gray-400">
                Answer interview questions using your voice.
              </p>
            </div>

            <div
              onClick={() => setSelectedMode("video")}
              className={`cursor-pointer rounded-xl border p-5 transition ${
                selectedMode === "video"
                  ? "border-cyan-400 bg-cyan-400/10"
                  : "border-gray-800 bg-gray-950"
              }`}
            >
              <div className="text-3xl">🎥</div>

              <h3 className="mt-3 font-semibold text-white">
                Video Interview
              </h3>

              <p className="mt-2 text-sm text-gray-400">
                Record your interview and analyze your presentation.
              </p>
            </div>
          </div>
        </div>

        {/* Selected Mode */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Selected Mode:{" "}
          <span className="font-semibold text-cyan-400">
            {selectedMode}
          </span>
        </p>

        {/* Start Interview */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={startInterview}
            className="inline-block rounded-xl bg-white px-10 py-4 font-semibold text-black transition hover:bg-gray-200"
          >
            Start AI Interview →
          </button>
        </div>
      </section>
    </main>
  );
}