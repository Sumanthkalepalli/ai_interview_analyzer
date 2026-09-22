
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileText,
  Lightbulb,
  LoaderCircle,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  XCircle,
} from "lucide-react";

import { supabase } from "../../lib/supabase";

type Answer = {
  questionId: number;
  question: string;
  answer: string;
};

type Evaluation = {
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  answerStructureScore: number;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  questionFeedback: {
    questionNumber: number;
    feedback: string;
  }[];
  suggestions: string[];
  improvementPlan: {
    day1: string;
    day2: string;
    day3: string;
  };
};

type ScoreCardProps = {
  title: string;
  score: number | undefined;
  description: string;
  icon: React.ReactNode;
  highlight?: boolean;
};

function ScoreCard({
  title,
  score,
  description,
  icon,
  highlight = false,
}: ScoreCardProps) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        highlight
          ? "border-[#b9e1d7] bg-[#eaf7f2]"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            highlight
              ? "bg-[#d3eee5] text-[#2b887d]"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {icon}
        </div>

        {score !== undefined && (
          <span className="text-xs font-semibold text-slate-400">
            / 100
          </span>
        )}
      </div>

      <p className="mt-5 text-sm font-semibold text-slate-500">
        {title}
      </p>

      <p
        className={`mt-2 text-3xl font-bold ${
          highlight ? "text-[#2b887d]" : "text-[#183b4d]"
        }`}
      >
        {score !== undefined ? score : "--"}
        {score !== undefined && (
          <span className="ml-1 text-base font-semibold">%</span>
        )}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-400">
        {description}
      </p>

      {score !== undefined && (
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full ${
              highlight ? "bg-[#2b887d]" : "bg-[#8dbeb3]"
            }`}
            style={{
              width: `${Math.max(0, Math.min(100, score))}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}

export default function ResultsPage() {
  const router = useRouter();

  const [answers, setAnswers] = useState<Answer[]>([]);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingUser, setCheckingUser] = useState(true);
  const [error, setError] = useState("");

  // Protect Results page
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setCheckingUser(false);
    };

    checkUser();
  }, [router]);

  // Load interview answers from sessionStorage
  useEffect(() => {
    const storedAnswers = sessionStorage.getItem(
      "interviewAnswers"
    );

    if (!storedAnswers) {
      return;
    }

    try {
      const parsedAnswers: Answer[] = JSON.parse(storedAnswers);
      setAnswers(parsedAnswers);
    } catch (err) {
      console.error("Error loading interview answers:", err);
      setError("Unable to load interview answers.");
    }
  }, []);

  // Evaluate interview answers using Gemini AI
  const evaluateAnswer = async () => {
    if (answers.length === 0) {
      setError("No interview answers found.");
      return;
    }

    setLoading(true);
    setError("");
    setEvaluation(null);

    try {
      const response = await fetch("/api/interview/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers: answers,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Evaluation failed.");
      }

      const parsedEvaluation: Evaluation =
        typeof data.evaluation === "string"
          ? JSON.parse(data.evaluation)
          : data.evaluation;

      setEvaluation(parsedEvaluation);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const assessmentType =
        sessionStorage.getItem("assessmentType") || "initial";

      const { error: saveError } = await supabase
        .from("interview_results")
        .insert({
          user_id: user.id,
          assessment_type: assessmentType,
          overall_score: parsedEvaluation.overallScore,
          technical_score: parsedEvaluation.technicalScore,
          communication_score:
            parsedEvaluation.communicationScore,
          problem_solving_score:
            parsedEvaluation.problemSolvingScore,
          answer_structure_score:
            parsedEvaluation.answerStructureScore,
          strengths: parsedEvaluation.strengths,
          weaknesses: parsedEvaluation.weaknesses,
          question_feedback:
            parsedEvaluation.questionFeedback,
          suggestions: parsedEvaluation.suggestions,
          improvement_plan: parsedEvaluation.improvementPlan,
        });

      if (saveError) {
        throw new Error(saveError.message);
      }
    } catch (err) {
      console.error("Interview evaluation error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to analyze the interview. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (checkingUser) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f9f8] px-6">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e1f2ee] text-[#2b887d]">
            <ShieldCheck size={30} />
          </div>

          <p className="mt-5 text-sm font-semibold text-[#183b4d]">
            Checking authentication...
          </p>

          <div className="mt-5 h-1.5 w-40 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-[#2b887d]" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f9f8] px-4 py-6 text-[#183b4d] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <header className="mb-9 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#e1f2ee] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#2b887d]">
              <Sparkles size={14} />
              AI Interview Analyzer
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#183b4d] sm:text-4xl">
              Interview Results
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Review your performance, understand your strengths,
              and identify opportunities for improvement.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-[#2b887d] hover:text-[#2b887d]"
          >
            <BarChart3 size={17} />
            Dashboard
          </Link>
        </header>

        {/* Interview Summary */}
        <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2b887d]">
                <ClipboardCheck size={15} />
                Interview Summary
              </div>

              <h2 className="mt-2 text-2xl font-bold text-[#183b4d]">
                Your Interview Answers
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Your responses are ready for AI-powered evaluation.
              </p>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-[#d9eee8] bg-[#f2faf7] px-5 py-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#d9eee8] text-[#2b887d]">
                <FileText size={23} />
              </div>

              <div>
                <p className="text-2xl font-bold text-[#2b887d]">
                  {answers.length}
                </p>

                <p className="text-xs font-medium text-slate-500">
                  Answers Collected
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Performance */}
        <section className="mb-8">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-wider text-[#2b887d]">
              Performance Overview
            </p>

            <h2 className="mt-2 text-2xl font-bold text-[#183b4d]">
              Your Skill Scores
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Scores will appear after you complete AI analysis.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <ScoreCard
              title="Overall"
              score={evaluation?.overallScore}
              description="Overall performance"
              icon={<Trophy size={21} />}
              highlight
            />

            <ScoreCard
              title="Technical"
              score={evaluation?.technicalScore}
              description="Technical knowledge"
              icon={<Brain size={21} />}
            />

            <ScoreCard
              title="Communication"
              score={evaluation?.communicationScore}
              description="Clarity and explanation"
              icon={<MessageSquare size={21} />}
            />

            <ScoreCard
              title="Problem Solving"
              score={evaluation?.problemSolvingScore}
              description="Logical thinking"
              icon={<Target size={21} />}
            />

            <ScoreCard
              title="Answer Structure"
              score={evaluation?.answerStructureScore}
              description="Organization of answers"
              icon={<TrendingUp size={21} />}
            />
          </div>
        </section>

        {/* AI Analysis */}
        <section className="mb-8 rounded-3xl border border-[#cde8df] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2b887d]">
                <Sparkles size={15} />
                Gemini AI
              </div>

              <h2 className="mt-2 text-2xl font-bold text-[#183b4d]">
                AI Interview Analysis
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Analyze your interview answers to receive detailed
                feedback, scores, and a personalized improvement plan.
              </p>
            </div>

            <button
              type="button"
              onClick={evaluateAnswer}
              disabled={loading || answers.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2b887d] px-6 py-3.5 font-bold text-white shadow-sm transition hover:bg-[#236f66] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Analyze My Interview
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-600">
              <XCircle size={19} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {loading && (
            <div className="mt-7 rounded-2xl border border-[#d9eee8] bg-[#f2faf7] p-7">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#d9eee8] text-[#2b887d]">
                  <Brain size={27} />
                </div>

                <h3 className="mt-4 text-lg font-bold text-[#183b4d]">
                  AI is analyzing your answers
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Please wait while your personalized feedback is prepared.
                </p>

                <div className="mt-5 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-white">
                  <div className="h-full w-2/3 animate-pulse rounded-full bg-[#2b887d]" />
                </div>
              </div>
            </div>
          )}

          {evaluation && !loading && (
            <div className="mt-7 rounded-2xl border border-slate-200 bg-[#f8fbfa] p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={20} className="text-[#2b887d]" />

                <h3 className="text-lg font-bold text-[#183b4d]">
                  Question-by-Question Feedback
                </h3>
              </div>

              <div className="mt-5 space-y-4">
                {evaluation.questionFeedback?.map(
                  (item, index) => (
                    <div
                      key={`${item.questionNumber}-${index}`}
                      className="rounded-2xl border border-slate-200 bg-white p-5"
                    >
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2b887d]">
                        <MessageSquare size={14} />
                        Question {item.questionNumber}
                      </div>

                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        {item.feedback}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </section>

        {/* Strengths and Weaknesses */}
        <section className="mb-8 grid gap-6 md:grid-cols-2">

          {/* Strengths */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e1f2ee] text-[#2b887d]">
                <CheckCircle2 size={22} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#2b887d]">
                  Positive Areas
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#183b4d]">
                  Your Strengths
                </h2>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {evaluation?.strengths?.map(
                (strength, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-xl border border-[#d9eee8] bg-[#f2faf7] p-4"
                  >
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-[#2b887d]"
                    />

                    <p className="text-sm leading-6 text-slate-600">
                      {strength}
                    </p>
                  </div>
                )
              )}

              {!evaluation && (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm leading-6 text-slate-400">
                    Analyze your interview to see your AI-generated
                    strengths.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Weaknesses */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Target size={22} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-600">
                  Improvement Areas
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#183b4d]">
                  Areas to Improve
                </h2>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {evaluation?.weaknesses?.map(
                (weakness, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50/60 p-4"
                  >
                    <Target
                      size={18}
                      className="mt-0.5 shrink-0 text-amber-600"
                    />

                    <p className="text-sm leading-6 text-slate-600">
                      {weakness}
                    </p>
                  </div>
                )
              )}

              {!evaluation && (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm leading-6 text-slate-400">
                    Analyze your interview to see your AI-generated
                    improvement areas.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Suggestions */}
        <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e1f2ee] text-[#2b887d]">
              <Lightbulb size={22} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#2b887d]">
                AI Recommendations
              </p>

              <h2 className="mt-1 text-2xl font-bold text-[#183b4d]">
                Personalized Suggestions
              </h2>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {evaluation?.suggestions?.map(
              (suggestion, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 bg-[#f8fbfa] p-4"
                >
                  <ChevronRight
                    size={18}
                    className="mt-0.5 shrink-0 text-[#2b887d]"
                  />

                  <p className="text-sm leading-6 text-slate-600">
                    {suggestion}
                  </p>
                </div>
              )
            )}

            {!evaluation && (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5">
                <p className="text-sm leading-6 text-slate-400">
                  Your AI-generated recommendations will appear here
                  after analysis.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Interview Answers */}
        <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e1f2ee] text-[#2b887d]">
              <FileText size={22} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#2b887d]">
                Interview Review
              </p>

              <h2 className="mt-1 text-2xl font-bold text-[#183b4d]">
                Your Interview Answers
              </h2>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            {answers.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-400">
                  No interview answers available.
                </p>
              </div>
            )}

            {answers.map((item, index) => (
              <div
                key={`${item.questionId}-${index}`}
                className="rounded-2xl border border-slate-200 bg-[#f8fbfa] p-5 sm:p-6"
              >
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2b887d]">
                  <ClipboardCheck size={15} />
                  Question {index + 1}
                </div>

                <h3 className="mt-3 text-base font-bold leading-7 text-[#183b4d] sm:text-lg">
                  {item.question}
                </h3>

                <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Your Answer
                  </p>

                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {item.answer || "No answer provided."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Improvement Plan */}
        <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e1f2ee] text-[#2b887d]">
              <TrendingUp size={22} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#2b887d]">
                Personalized Plan
              </p>

              <h2 className="mt-1 text-2xl font-bold text-[#183b4d]">
                3-Day Improvement Plan
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">

            {/* Day 1 */}
            <div className="rounded-2xl border border-slate-200 bg-[#f8fbfa] p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2b887d]">
                  Day 01
                </span>

                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e1f2ee] text-sm font-bold text-[#2b887d]">
                  1
                </span>
              </div>

              <h3 className="mt-4 font-bold text-[#183b4d]">
                Strengthen Fundamentals
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {evaluation?.improvementPlan?.day1 ||
                  "Analyze your interview to generate a personalized plan."}
              </p>
            </div>

            {/* Day 2 */}
            <div className="rounded-2xl border border-slate-200 bg-[#f8fbfa] p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2b887d]">
                  Day 02
                </span>

                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e1f2ee] text-sm font-bold text-[#2b887d]">
                  2
                </span>
              </div>

              <h3 className="mt-4 font-bold text-[#183b4d]">
                Practice Answers
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {evaluation?.improvementPlan?.day2 ||
                  "Your AI-generated practice activities will appear here."}
              </p>
            </div>

            {/* Day 3 */}
            <div className="rounded-2xl border border-slate-200 bg-[#f8fbfa] p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2b887d]">
                  Day 03
                </span>

                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e1f2ee] text-sm font-bold text-[#2b887d]">
                  3
                </span>
              </div>

              <h3 className="mt-4 font-bold text-[#183b4d]">
                Reassess Yourself
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {evaluation?.improvementPlan?.day3 ||
                  "Your AI-generated reassessment activities will appear here."}
              </p>
            </div>
          </div>
        </section>

        {/* Bottom Actions */}
        <section className="flex flex-col gap-3 pb-10 sm:flex-row">
          <Link
            href="/assessment"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2b887d] px-6 py-3.5 text-center font-bold text-white shadow-sm transition hover:bg-[#236f66]"
          >
            Take Another Interview
            <ArrowRight size={18} />
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-center font-bold text-slate-600 shadow-sm transition hover:border-[#2b887d] hover:text-[#2b887d]"
          >
            <BarChart3 size={18} />
            Back to Dashboard
          </Link>
        </section>

        {/* Footer */}
        <footer className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pb-5 text-center text-xs text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={14} />
            Secure session
          </span>

          <span>•</span>

          <span>AI-powered interview analysis</span>

          <span>•</span>

          <span>Personalized feedback</span>
        </footer>
      </div>
    </main>
  );
}