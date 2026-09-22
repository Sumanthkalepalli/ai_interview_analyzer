"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Check,
  Code2,
  Database,
  FileText,
  Gauge,
  Keyboard,
  Mic,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Video,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

type AssessmentType = "initial" | "reassessment";

type InterviewMode = "text" | "voice" | "video";

type CareerRole =
  | "software-developer"
  | "data-analyst"
  | "full-stack-developer";

type Difficulty = "beginner" | "intermediate" | "advanced";

const roles = [
  {
    id: "software-developer" as CareerRole,
    icon: Code2,
    title: "Software Developer",
    description: "Programming, DSA, OOP and development concepts",
  },
  {
    id: "data-analyst" as CareerRole,
    icon: BarChart3,
    title: "Data Analyst",
    description: "SQL, statistics, data analysis and reasoning",
  },
  {
    id: "full-stack-developer" as CareerRole,
    icon: Database,
    title: "Full Stack Developer",
    description: "Frontend, backend, APIs and databases",
  },
];

const difficulties = [
  {
    id: "beginner" as Difficulty,
    icon: Gauge,
    title: "Beginner",
    description: "Fundamentals",
  },
  {
    id: "intermediate" as Difficulty,
    icon: ShieldCheck,
    title: "Intermediate",
    description: "Interview level",
  },
  {
    id: "advanced" as Difficulty,
    icon: Sparkles,
    title: "Advanced",
    description: "Challenging questions",
  },
];

const modes = [
  {
    id: "text" as InterviewMode,
    icon: Keyboard,
    title: "Text Interview",
    description: "Type your answers and receive AI evaluation.",
  },
  {
    id: "voice" as InterviewMode,
    icon: Mic,
    title: "Voice Interview",
    description: "Answer interview questions using your voice.",
  },
  {
    id: "video" as InterviewMode,
    icon: Video,
    title: "Video Interview",
    description: "Record your interview and analyze your presentation.",
  },
];

export default function AssessmentPage() {
  const router = useRouter();

  const [selectedMode, setSelectedMode] =
    useState<InterviewMode>("text");

  const [assessmentType, setAssessmentType] =
    useState<AssessmentType>("initial");

  const [selectedRole, setSelectedRole] =
    useState<CareerRole>("software-developer");

  const [difficulty, setDifficulty] =
    useState<Difficulty>("beginner");

  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.push("/login");
      }
    };

    checkUser();
  }, [router]);

  const startInterview = () => {
    setIsStarting(true);

    sessionStorage.setItem("interviewMode", selectedMode);
    sessionStorage.setItem("assessmentType", assessmentType);
    sessionStorage.setItem("careerRole", selectedRole);
    sessionStorage.setItem("difficulty", difficulty);

    window.location.href = "/interview";
  };

  return (
    <main className="min-h-screen bg-[#f7f8f7] text-[#183b4d]">
      {/* Header */}
      <header className="border-b border-[#e4e9e7] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2b887d] text-lg font-bold text-white">
              AI
            </div>

            <div className="text-left">
              <h1 className="text-base font-bold text-[#183b4d] sm:text-lg">
                AI Interview Analyzer
              </h1>

              <p className="text-xs text-[#78908d]">
                Smart interview preparation
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 rounded-xl border border-[#dce5e1] px-4 py-2 text-sm font-medium text-[#49635f] transition hover:border-[#2b887d] hover:text-[#2b887d]"
          >
            <ArrowLeft size={16} />
            Dashboard
          </button>
        </div>
      </header>

      {/* Main Content */}
      <section className="mx-auto max-w-6xl px-6 py-10 sm:py-14 lg:px-10">
        {/* Page Introduction */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#e5f3ef] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#2b887d]">
            <span className="h-2 w-2 rounded-full bg-[#2b887d]" />
            New Assessment
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-[#183b4d] sm:text-4xl lg:text-5xl">
            Choose Your Interview
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#718581] sm:text-base">
            Customize your interview experience by selecting an assessment
            type, career role, difficulty level, and interview mode.
          </p>
        </div>

        {/* Assessment Type */}
        <div className="mt-12">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2b887d]">
              Step 01
            </p>

            <h3 className="mt-1 text-xl font-bold text-[#183b4d]">
              Assessment Type
            </h3>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Initial Assessment */}
            <button
              type="button"
              onClick={() => setAssessmentType("initial")}
              className={`rounded-2xl border p-6 text-left transition ${
                assessmentType === "initial"
                  ? "border-[#2b887d] bg-[#edf8f5] shadow-sm"
                  : "border-[#e1e9e5] bg-white hover:border-[#a9cbc3]"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e5f3ef] text-[#2b887d]">
                  <FileText size={24} strokeWidth={1.8} />
                </div>

                {assessmentType === "initial" && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2b887d] text-xs text-white">
                    <Check size={14} />
                  </span>
                )}
              </div>

              <h4 className="mt-5 font-bold text-[#183b4d]">
                Initial Assessment
              </h4>

              <p className="mt-2 text-sm leading-6 text-[#78908d]">
                Take your first interview and receive your initial AI skill
                analysis.
              </p>
            </button>

            {/* Reassessment */}
            <button
              type="button"
              onClick={() => setAssessmentType("reassessment")}
              className={`rounded-2xl border p-6 text-left transition ${
                assessmentType === "reassessment"
                  ? "border-[#2b887d] bg-[#edf8f5] shadow-sm"
                  : "border-[#e1e9e5] bg-white hover:border-[#a9cbc3]"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e5f3ef] text-[#2b887d]">
                  <RefreshCw size={24} strokeWidth={1.8} />
                </div>

                {assessmentType === "reassessment" && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2b887d] text-xs text-white">
                    <Check size={14} />
                  </span>
                )}
              </div>

              <h4 className="mt-5 font-bold text-[#183b4d]">
                Reassessment
              </h4>

              <p className="mt-2 text-sm leading-6 text-[#78908d]">
                Retake the interview and compare your progress and
                improvement.
              </p>
            </button>
          </div>
        </div>

        {/* Career Role */}
        <div className="mt-12">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2b887d]">
              Step 02
            </p>

            <h3 className="mt-1 text-xl font-bold text-[#183b4d]">
              Select Career Role
            </h3>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {roles.map((role) => {
              const isSelected = selectedRole === role.id;
              const RoleIcon = role.icon;

              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  className={`rounded-2xl border p-6 text-left transition ${
                    isSelected
                      ? "border-[#2b887d] bg-[#edf8f5] shadow-sm"
                      : "border-[#e1e9e5] bg-white hover:border-[#a9cbc3]"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e5f3ef] text-[#2b887d]">
                      <RoleIcon size={24} strokeWidth={1.8} />
                    </div>

                    {isSelected && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2b887d] text-xs text-white">
                        <Check size={14} />
                      </span>
                    )}
                  </div>

                  <h4 className="mt-5 font-bold text-[#183b4d]">
                    {role.title}
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-[#78908d]">
                    {role.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Difficulty */}
        <div className="mt-12">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2b887d]">
              Step 03
            </p>

            <h3 className="mt-1 text-xl font-bold text-[#183b4d]">
              Difficulty Level
            </h3>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {difficulties.map((level) => {
              const isSelected = difficulty === level.id;
              const DifficultyIcon = level.icon;

              return (
                <button
                  key={level.id}
                  type="button"
                  onClick={() => setDifficulty(level.id)}
                  className={`flex items-center justify-between rounded-2xl border px-5 py-5 text-left transition ${
                    isSelected
                      ? "border-[#2b887d] bg-[#edf8f5] shadow-sm"
                      : "border-[#e1e9e5] bg-white hover:border-[#a9cbc3]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e5f3ef] text-[#2b887d]">
                      <DifficultyIcon size={21} strokeWidth={1.8} />
                    </div>

                    <div>
                      <span className="font-bold text-[#183b4d]">
                        {level.title}
                      </span>

                      <span className="mt-1 block text-sm text-[#78908d]">
                        {level.description}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs ${
                      isSelected
                        ? "border-[#2b887d] bg-[#2b887d] text-white"
                        : "border-[#d5e2dd] text-transparent"
                    }`}
                  >
                    <Check size={14} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interview Mode */}
        <div className="mt-12">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2b887d]">
              Step 04
            </p>

            <h3 className="mt-1 text-xl font-bold text-[#183b4d]">
              Choose Interview Mode
            </h3>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {modes.map((mode) => {
              const isSelected = selectedMode === mode.id;
              const ModeIcon = mode.icon;

              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setSelectedMode(mode.id)}
                  className={`rounded-2xl border p-6 text-left transition ${
                    isSelected
                      ? "border-[#2b887d] bg-[#edf8f5] shadow-sm"
                      : "border-[#e1e9e5] bg-white hover:border-[#a9cbc3]"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e5f3ef] text-[#2b887d]">
                      <ModeIcon size={24} strokeWidth={1.8} />
                    </div>

                    {isSelected && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2b887d] text-xs text-white">
                        <Check size={14} />
                      </span>
                    )}
                  </div>

                  <h4 className="mt-5 font-bold text-[#183b4d]">
                    {mode.title}
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-[#78908d]">
                    {mode.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selection Summary */}
        <div className="mt-10 rounded-2xl border border-[#dce9e4] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e5f3ef] text-[#2b887d]">
              <Check size={20} />
            </div>

            <div>
              <h3 className="font-bold text-[#183b4d]">
                Your Interview Setup
              </h3>

              <p className="text-sm text-[#78908d]">
                Review your selections before starting.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-[#f7f8f7] p-4">
              <p className="text-xs text-[#78908d]">Assessment</p>

              <p className="mt-1 font-semibold text-[#183b4d]">
                {assessmentType === "initial"
                  ? "Initial"
                  : "Reassessment"}
              </p>
            </div>

            <div className="rounded-xl bg-[#f7f8f7] p-4">
              <p className="text-xs text-[#78908d]">Career Role</p>

              <p className="mt-1 font-semibold text-[#183b4d]">
                {roles.find((role) => role.id === selectedRole)?.title}
              </p>
            </div>

            <div className="rounded-xl bg-[#f7f8f7] p-4">
              <p className="text-xs text-[#78908d]">Difficulty</p>

              <p className="mt-1 font-semibold capitalize text-[#183b4d]">
                {difficulty}
              </p>
            </div>

            <div className="rounded-xl bg-[#f7f8f7] p-4">
              <p className="text-xs text-[#78908d]">Mode</p>

              <p className="mt-1 font-semibold capitalize text-[#183b4d]">
                {selectedMode}
              </p>
            </div>
          </div>
        </div>

        {/* Start Interview */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4">
          <button
            type="button"
            onClick={startInterview}
            disabled={isStarting}
            className="inline-flex min-w-64 items-center justify-center gap-2 rounded-xl bg-[#2b887d] px-8 py-4 font-semibold text-white shadow-sm transition hover:bg-[#237267] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isStarting ? (
              "Starting Interview..."
            ) : (
              <>
                Start AI Interview
                <ArrowRight size={17} />
              </>
            )}
          </button>

          <p className="text-center text-xs text-[#8aa09b]">
            Your selections will be saved for this interview session.
          </p>
        </div>
      </section>
    </main>
  );
}