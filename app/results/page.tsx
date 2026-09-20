
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
    const storedAnswers = sessionStorage.getItem("interviewAnswers");

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
      // Send all answers to Gemini API
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

      // Parse AI evaluation
      const parsedEvaluation: Evaluation =
        typeof data.evaluation === "string"
          ? JSON.parse(data.evaluation)
          : data.evaluation;

      // Display evaluation on the page
      setEvaluation(parsedEvaluation);

      // Get logged-in user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // Get assessment type
      const assessmentType =
        sessionStorage.getItem("assessmentType") || "initial";

      // Save result to Supabase
      const { error: saveError } = await supabase
        .from("interview_results")
        .insert({
          user_id: user.id,
          assessment_type: assessmentType,
          overall_score: parsedEvaluation.overallScore,
          technical_score: parsedEvaluation.technicalScore,
          communication_score: parsedEvaluation.communicationScore,
          problem_solving_score: parsedEvaluation.problemSolvingScore,
          answer_structure_score:
            parsedEvaluation.answerStructureScore,
          strengths: parsedEvaluation.strengths,
          weaknesses: parsedEvaluation.weaknesses,
          question_feedback: parsedEvaluation.questionFeedback,
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
      <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-700 border-t-cyan-400" />

          <p className="text-gray-400">
            Checking authentication...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-6 py-8 text-white">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <header className="mb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium tracking-wider text-cyan-400">
              AI INTERVIEW ANALYZER
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              Interview Results
            </h1>

            <p className="mt-2 text-gray-400">
              Review your answers and discover how you can improve.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="rounded-xl border border-gray-700 px-5 py-3 text-center text-sm font-medium transition hover:border-cyan-400 hover:text-cyan-400"
          >
            Dashboard
          </Link>
        </header>

        {/* Interview Summary */}
        <section className="mb-8 rounded-2xl border border-gray-800 bg-gray-950 p-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-cyan-400">
                INTERVIEW SUMMARY
              </p>

              <h2 className="mt-1 text-2xl font-semibold">
                Your Interview Answers
              </h2>

              <p className="mt-2 text-sm text-gray-400">
                You answered {answers.length} question
                {answers.length === 1 ? "" : "s"}.
              </p>
            </div>

            <div className="rounded-xl bg-gray-900 px-5 py-4 text-center">
              <p className="text-2xl font-bold text-cyan-400">
                {answers.length}
              </p>

              <p className="text-xs text-gray-400">
                Answers Collected
              </p>
            </div>
          </div>
        </section>

        {/* Score Cards */}
        <section className="mb-8">
          <div className="mb-5">
            <p className="text-sm font-medium text-cyan-400">
              PERFORMANCE
            </p>

            <h2 className="mt-1 text-2xl font-semibold">
              Your Skill Scores
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">

            {/* Overall Score */}
            <div className="rounded-2xl border border-cyan-900/50 bg-gray-950 p-6">
              <p className="text-sm text-gray-400">
                Overall
              </p>

              <p className="mt-3 text-4xl font-bold text-cyan-400">
                {evaluation
                  ? `${evaluation.overallScore}%`
                  : "--"}
              </p>

              <p className="mt-2 text-xs text-gray-500">
                Overall performance
              </p>
            </div>

            {/* Technical Score */}
            <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
              <p className="text-sm text-gray-400">
                Technical
              </p>

              <p className="mt-3 text-4xl font-bold">
                {evaluation
                  ? `${evaluation.technicalScore}%`
                  : "--"}
              </p>

              <p className="mt-2 text-xs text-gray-500">
                Technical knowledge
              </p>
            </div>

            {/* Communication Score */}
            <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
              <p className="text-sm text-gray-400">
                Communication
              </p>

              <p className="mt-3 text-4xl font-bold">
                {evaluation
                  ? `${evaluation.communicationScore}%`
                  : "--"}
              </p>

              <p className="mt-2 text-xs text-gray-500">
                Clarity and explanation
              </p>
            </div>

            {/* Problem Solving Score */}
            <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
              <p className="text-sm text-gray-400">
                Problem Solving
              </p>

              <p className="mt-3 text-4xl font-bold">
                {evaluation
                  ? `${evaluation.problemSolvingScore}%`
                  : "--"}
              </p>

              <p className="mt-2 text-xs text-gray-500">
                Logical thinking
              </p>
            </div>

            {/* Answer Structure Score */}
            <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
              <p className="text-sm text-gray-400">
                Answer Structure
              </p>

              <p className="mt-3 text-4xl font-bold">
                {evaluation
                  ? `${evaluation.answerStructureScore}%`
                  : "--"}
              </p>

              <p className="mt-2 text-xs text-gray-500">
                Organization of answers
              </p>
            </div>

          </div>
        </section>

        {/* AI Analysis */}
        <section className="mb-8 rounded-2xl border border-cyan-900/50 bg-gray-950 p-7">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="text-sm font-medium text-cyan-400">
                GEMINI AI
              </p>

              <h2 className="mt-1 text-2xl font-semibold">
                AI Interview Analysis
              </h2>

              <p className="mt-2 text-sm text-gray-400">
                Analyze all your interview answers using Gemini AI.
              </p>
            </div>

            <button
              type="button"
              onClick={evaluateAnswer}
              disabled={loading || answers.length === 0}
              className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Analyzing..."
                : "Analyze My Interview"}
            </button>

          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-5 rounded-xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Question Feedback */}
          {evaluation && (
            <div className="mt-6 rounded-xl border border-gray-800 bg-black p-6">

              <h3 className="mb-6 text-lg font-semibold text-cyan-400">
                AI Question-by-Question Feedback
              </h3>

              <div className="space-y-4">

                {evaluation.questionFeedback?.map(
                  (item, index) => (
                    <div
                      key={`${item.questionNumber}-${index}`}
                      className="rounded-xl bg-gray-900 p-5"
                    >
                      <p className="text-sm font-medium text-cyan-400">
                        Question {item.questionNumber}
                      </p>

                      <p className="mt-2 leading-7 text-gray-300">
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
          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-7">

            <p className="text-sm font-medium text-cyan-400">
              POSITIVE AREAS
            </p>

            <h2 className="mt-1 text-2xl font-semibold">
              Your Strengths
            </h2>

            <div className="mt-5 space-y-4">

              {evaluation?.strengths?.map(
                (strength, index) => (
                  <div
                    key={index}
                    className="rounded-xl bg-gray-900 p-4"
                  >
                    <p className="font-medium text-gray-200">
                      {strength}
                    </p>
                  </div>
                )
              )}

              {!evaluation && (
                <div className="rounded-xl bg-gray-900 p-4">
                  <p className="text-sm text-gray-500">
                    Analyze your interview to see your AI-generated
                    strengths.
                  </p>
                </div>
              )}

            </div>
          </div>

          {/* Weaknesses */}
          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-7">

            <p className="text-sm font-medium text-cyan-400">
              IMPROVEMENT AREAS
            </p>

            <h2 className="mt-1 text-2xl font-semibold">
              Areas to Improve
            </h2>

            <div className="mt-5 space-y-4">

              {evaluation?.weaknesses?.map(
                (weakness, index) => (
                  <div
                    key={index}
                    className="rounded-xl bg-gray-900 p-4"
                  >
                    <p className="font-medium text-gray-200">
                      {weakness}
                    </p>
                  </div>
                )
              )}

              {!evaluation && (
                <div className="rounded-xl bg-gray-900 p-4">
                  <p className="text-sm text-gray-500">
                    Analyze your interview to see your AI-generated
                    improvement areas.
                  </p>
                </div>
              )}

            </div>
          </div>

        </section>

        {/* Suggestions */}
        <section className="mb-8 rounded-2xl border border-gray-800 bg-gray-950 p-7">

          <p className="text-sm font-medium text-cyan-400">
            AI RECOMMENDATIONS
          </p>

          <h2 className="mt-1 text-2xl font-semibold">
            Personalized Suggestions
          </h2>

          <div className="mt-5 space-y-4">

            {evaluation?.suggestions?.map(
              (suggestion, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-gray-900 p-4"
                >
                  <p className="text-gray-200">
                    {suggestion}
                  </p>
                </div>
              )
            )}

            {!evaluation && (
              <div className="rounded-xl bg-gray-900 p-4">
                <p className="text-sm text-gray-500">
                  Your AI-generated recommendations will appear here
                  after analysis.
                </p>
              </div>
            )}

          </div>
        </section>

        {/* Interview Answers */}
        <section className="mb-8 rounded-2xl border border-gray-800 bg-gray-950 p-7">

          <p className="text-sm font-medium text-cyan-400">
            INTERVIEW REVIEW
          </p>

          <h2 className="mt-1 text-2xl font-semibold">
            Your Interview Answers
          </h2>

          <div className="mt-6 space-y-5">

            {answers.length === 0 && (
              <div className="rounded-xl bg-gray-900 p-5">
                <p className="text-gray-400">
                  No interview answers available.
                </p>
              </div>
            )}

            {answers.map((item, index) => (
              <div
                key={`${item.questionId}-${index}`}
                className="rounded-xl border border-gray-800 bg-black p-5"
              >

                <p className="text-sm font-medium text-cyan-400">
                  Question {index + 1}
                </p>

                <h3 className="mt-2 text-lg font-semibold leading-7">
                  {item.question}
                </h3>

                <div className="mt-4 rounded-lg bg-gray-900 p-4">

                  <p className="text-sm text-gray-400">
                    Your Answer
                  </p>

                  <p className="mt-2 leading-7 text-gray-300">
                    {item.answer || "No answer provided."}
                  </p>

                </div>
              </div>
            ))}

          </div>
        </section>

        {/* Improvement Plan */}
        <section className="mb-8 rounded-2xl border border-gray-800 bg-gray-950 p-7">

          <p className="text-sm font-medium text-cyan-400">
            PERSONALIZED PLAN
          </p>

          <h2 className="mt-1 text-2xl font-semibold">
            3-Day Improvement Plan
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-3">

            {/* Day 1 */}
            <div className="rounded-xl bg-gray-900 p-5">

              <p className="text-sm text-cyan-400">
                DAY 01
              </p>

              <h3 className="mt-2 font-semibold">
                Strengthen Fundamentals
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                {evaluation?.improvementPlan?.day1 ||
                  "Analyze your interview to generate a personalized plan."}
              </p>

            </div>

            {/* Day 2 */}
            <div className="rounded-xl bg-gray-900 p-5">

              <p className="text-sm text-cyan-400">
                DAY 02
              </p>

              <h3 className="mt-2 font-semibold">
                Practice Answers
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                {evaluation?.improvementPlan?.day2 ||
                  "Your AI-generated practice activities will appear here."}
              </p>

            </div>

            {/* Day 3 */}
            <div className="rounded-xl bg-gray-900 p-5">

              <p className="text-sm text-cyan-400">
                DAY 03
              </p>

              <h3 className="mt-2 font-semibold">
                Reassess Yourself
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                {evaluation?.improvementPlan?.day3 ||
                  "Your AI-generated reassessment activities will appear here."}
              </p>

            </div>

          </div>
        </section>

        {/* Bottom Actions */}
        <section className="flex flex-col gap-4 pb-10 sm:flex-row">

          <Link
            href="/assessment"
            className="rounded-xl bg-cyan-500 px-6 py-3 text-center font-semibold text-black transition hover:bg-cyan-400"
          >
            Take Another Interview
          </Link>

          <Link
            href="/dashboard"
            className="rounded-xl border border-gray-700 px-6 py-3 text-center font-semibold transition hover:border-cyan-400 hover:text-cyan-400"
          >
            Back to Dashboard
          </Link>

        </section>

      </div>
    </main>
  );
}