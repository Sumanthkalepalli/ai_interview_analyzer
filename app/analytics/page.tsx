
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  History,
  Lightbulb,
  LoaderCircle,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { supabase } from "../../lib/supabase";

type InterviewResult = {
  id: string;
  overall_score: number;
  technical_score: number;
  communication_score: number;
  problem_solving_score: number;
  answer_structure_score: number;
  assessment_type: string;
  created_at: string;
};

type ChartData = {
  attempt: string;
  overall: number;
  technical: number;
  communication: number;
  problemSolving: number;
  answerStructure: number;
};

type ScoreCardProps = {
  title: string;
  score: number | string;
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
      className={`rounded-2xl border p-5 transition duration-200 hover:-translate-y-1 hover:shadow-md ${
        highlight
          ? "border-[#b9dfd8] bg-[#edf8f5]"
          : "border-[#e2e9e7] bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#71818a]">{title}</p>

          <p
            className={`mt-3 text-3xl font-bold ${
              highlight ? "text-[#2b887d]" : "text-[#183b4d]"
            }`}
          >
            {score}
          </p>
        </div>

        <div
          className={`rounded-xl p-3 ${
            highlight
              ? "bg-white text-[#2b887d]"
              : "bg-[#f1f6f5] text-[#2b887d]"
          }`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-2 text-xs text-[#84929a]">{description}</p>
    </div>
  );
}

function ImprovementValue({ value }: { value: number | null }) {
  if (value === null) {
    return <span className="text-[#9aa8ae]">—</span>;
  }

  return (
    <span className={value > 0 ? "text-[#2b887d]" : "text-[#183b4d]"}>
      {value > 0 ? "+" : ""}
      {value}
    </span>
  );
}

export default function AnalyticsPage() {
  const [results, setResults] = useState<InterviewResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
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
          "id, overall_score, technical_score, communication_score, problem_solving_score, answer_structure_score, assessment_type, created_at"
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (fetchError) {
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      setResults(data || []);
      setLoading(false);
    };

    loadAnalytics();
  }, []);

  const chartData: ChartData[] = results.map((result, index) => ({
    attempt: `Attempt ${index + 1}`,
    overall: result.overall_score,
    technical: result.technical_score,
    communication: result.communication_score,
    problemSolving: result.problem_solving_score,
    answerStructure: result.answer_structure_score,
  }));

  const latestResult = results[results.length - 1];

  const initialResult = results.find(
    (result) => result.assessment_type === "initial"
  );

  const reassessmentResult = results.find(
    (result) => result.assessment_type === "reassessment"
  );

  const overallImprovement =
    initialResult && reassessmentResult
      ? reassessmentResult.overall_score - initialResult.overall_score
      : null;

  const technicalImprovement =
    initialResult && reassessmentResult
      ? reassessmentResult.technical_score - initialResult.technical_score
      : null;

  const communicationImprovement =
    initialResult && reassessmentResult
      ? reassessmentResult.communication_score -
        initialResult.communication_score
      : null;

  const problemSolvingImprovement =
    initialResult && reassessmentResult
      ? reassessmentResult.problem_solving_score -
        initialResult.problem_solving_score
      : null;

  const answerStructureImprovement =
    initialResult && reassessmentResult
      ? reassessmentResult.answer_structure_score -
        initialResult.answer_structure_score
      : null;

  return (
    <main className="min-h-screen bg-[#f6f9f8] px-4 py-6 text-[#183b4d] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-8 rounded-3xl border border-[#e1eae7] bg-white px-5 py-6 shadow-sm sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-lg bg-[#e9f6f2] p-2 text-[#2b887d]">
                  <BarChart3 size={18} />
                </div>

                <p className="text-xs font-bold tracking-[0.18em] text-[#2b887d]">
                  AI INTERVIEW ANALYZER
                </p>
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Progress Analytics
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-[#71818a] sm:text-base">
                Track your interview performance, understand your strengths,
                and measure your improvement over time.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/dashboard"
                className="rounded-xl border border-[#dce7e4] px-4 py-2.5 text-sm font-semibold text-[#49616d] transition hover:border-[#2b887d] hover:text-[#2b887d]"
              >
                Dashboard
              </Link>

              <Link
                href="/skills"
                className="rounded-xl border border-[#dce7e4] px-4 py-2.5 text-sm font-semibold text-[#49616d] transition hover:border-[#2b887d] hover:text-[#2b887d]"
              >
                Skills
              </Link>

              <Link
                href="/improvement"
                className="rounded-xl border border-[#dce7e4] px-4 py-2.5 text-sm font-semibold text-[#49616d] transition hover:border-[#2b887d] hover:text-[#2b887d]"
              >
                Improvement
              </Link>

              <Link
                href="/history"
                className="rounded-xl border border-[#dce7e4] px-4 py-2.5 text-sm font-semibold text-[#49616d] transition hover:border-[#2b887d] hover:text-[#2b887d]"
              >
                History
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
              Loading your progress...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            <p className="font-semibold">Unable to load analytics</p>
            <p className="mt-2">{error}</p>
          </div>
        )}

        {/* No Data */}
        {!loading && !error && results.length === 0 && (
          <div className="rounded-3xl border border-[#e1eae7] bg-white p-10 text-center shadow-sm sm:p-16">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e9f6f2] text-[#2b887d]">
              <BarChart3 size={30} />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-[#183b4d]">
              No analytics available yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#71818a]">
              Complete your first interview to start tracking your performance
              and viewing your progress analytics.
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

        {/* Analytics */}
        {!loading && !error && results.length > 0 && (
          <>
            {/* Overview */}
            <section className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold tracking-[0.16em] text-[#2b887d]">
                    OVERVIEW
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    Latest Performance
                  </h2>
                </div>

                <div className="hidden items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#71818a] shadow-sm sm:flex">
                  <CheckCircle2 size={15} className="text-[#2b887d]" />
                  Updated from your latest interview
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                <ScoreCard
                  title="Latest Overall"
                  score={`${latestResult.overall_score}/100`}
                  description="Overall interview score"
                  icon={<Trophy size={21} />}
                  highlight
                />

                <ScoreCard
                  title="Technical"
                  score={`${latestResult.technical_score}%`}
                  description="Technical knowledge"
                  icon={<BookOpen size={21} />}
                />

                <ScoreCard
                  title="Communication"
                  score={`${latestResult.communication_score}%`}
                  description="Communication ability"
                  icon={<Users size={21} />}
                />

                <ScoreCard
                  title="Problem Solving"
                  score={`${latestResult.problem_solving_score}%`}
                  description="Reasoning and solutions"
                  icon={<Lightbulb size={21} />}
                />

                <ScoreCard
                  title="Answer Structure"
                  score={`${latestResult.answer_structure_score}%`}
                  description="Answer organization"
                  icon={<ClipboardList size={21} />}
                />

                <ScoreCard
                  title="Improvement"
                  score={
                    overallImprovement !== null
                      ? `${overallImprovement > 0 ? "+" : ""}${overallImprovement}`
                      : "—"
                  }
                  description="Overall score change"
                  icon={<TrendingUp size={21} />}
                  highlight
                />
              </div>
            </section>

            {/* Reassessment Comparison */}
            {initialResult && reassessmentResult && (
              <section className="mb-8 rounded-3xl border border-[#d9e9e5] bg-white p-6 shadow-sm sm:p-8">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-bold tracking-[0.16em] text-[#2b887d]">
                      REASSESSMENT
                    </p>

                    <h2 className="mt-1 text-2xl font-bold">
                      Initial vs Reassessment
                    </h2>

                    <p className="mt-2 text-sm text-[#71818a]">
                      Compare your initial interview with your reassessment.
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e9f6f2] text-[#2b887d]">
                    <TrendingUp size={21} />
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
                  <div className="rounded-2xl bg-[#f6f9f8] p-4">
                    <p className="text-xs font-medium text-[#71818a]">
                      Initial Assessment
                    </p>

                    <p className="mt-2 text-2xl font-bold text-[#183b4d]">
                      {initialResult.overall_score}/100
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#edf8f5] p-4">
                    <p className="text-xs font-medium text-[#71818a]">
                      Reassessment
                    </p>

                    <p className="mt-2 text-2xl font-bold text-[#2b887d]">
                      {reassessmentResult.overall_score}/100
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#e5ecea] p-4">
                    <p className="text-xs font-medium text-[#71818a]">
                      Overall
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                      <ImprovementValue value={overallImprovement} />
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#e5ecea] p-4">
                    <p className="text-xs font-medium text-[#71818a]">
                      Technical
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                      <ImprovementValue value={technicalImprovement} />
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#e5ecea] p-4">
                    <p className="text-xs font-medium text-[#71818a]">
                      Communication
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                      <ImprovementValue value={communicationImprovement} />
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#e5ecea] p-4">
                    <p className="text-xs font-medium text-[#71818a]">
                      Problem Solving
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                      <ImprovementValue value={problemSolvingImprovement} />
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#e5ecea] p-4">
                    <p className="text-xs font-medium text-[#71818a]">
                      Answer Structure
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                      <ImprovementValue value={answerStructureImprovement} />
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Overall Progress Chart */}
            <section className="mb-8 rounded-3xl border border-[#e1eae7] bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold tracking-[0.16em] text-[#2b887d]">
                    PERFORMANCE
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    Overall Score Progress
                  </h2>

                  <p className="mt-2 text-sm text-[#71818a]">
                    See how your overall score changes across interview
                    attempts.
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e9f6f2] text-[#2b887d]">
                  <BarChart3 size={21} />
                </div>
              </div>

              <div className="mt-8 h-72 w-full sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: -20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid
                      stroke="#e8efed"
                      strokeDasharray="4 4"
                    />

                    <XAxis
                      dataKey="attempt"
                      tick={{
                        fill: "#71818a",
                        fontSize: 12,
                      }}
                      axisLine={{ stroke: "#dce7e4" }}
                      tickLine={false}
                    />

                    <YAxis
                      domain={[0, 100]}
                      tick={{
                        fill: "#71818a",
                        fontSize: 12,
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip
                      contentStyle={{
                        borderRadius: "14px",
                        border: "1px solid #dce7e4",
                        backgroundColor: "#ffffff",
                        color: "#183b4d",
                        boxShadow: "0 8px 24px rgba(24, 59, 77, 0.08)",
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey="overall"
                      stroke="#2b887d"
                      strokeWidth={3}
                      dot={{
                        r: 4,
                        fill: "#2b887d",
                        strokeWidth: 2,
                        stroke: "#ffffff",
                      }}
                      activeDot={{ r: 6 }}
                      name="Overall"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Skill Progress Chart */}
            <section className="mb-8 rounded-3xl border border-[#e1eae7] bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold tracking-[0.16em] text-[#2b887d]">
                    SKILL PROGRESS
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    Skill Improvement
                  </h2>

                  <p className="mt-2 text-sm text-[#71818a]">
                    Compare your performance across individual evaluation
                    categories.
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e9f6f2] text-[#2b887d]">
                  <TrendingUp size={21} />
                </div>
              </div>

              <div className="mt-8 h-80 w-full sm:h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: -20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid
                      stroke="#e8efed"
                      strokeDasharray="4 4"
                    />

                    <XAxis
                      dataKey="attempt"
                      tick={{
                        fill: "#71818a",
                        fontSize: 12,
                      }}
                      axisLine={{ stroke: "#dce7e4" }}
                      tickLine={false}
                    />

                    <YAxis
                      domain={[0, 100]}
                      tick={{
                        fill: "#71818a",
                        fontSize: 12,
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip
                      contentStyle={{
                        borderRadius: "14px",
                        border: "1px solid #dce7e4",
                        backgroundColor: "#ffffff",
                        color: "#183b4d",
                        boxShadow: "0 8px 24px rgba(24, 59, 77, 0.08)",
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey="technical"
                      stroke="#2b887d"
                      strokeWidth={2.5}
                      dot={false}
                      name="Technical"
                    />

                    <Line
                      type="monotone"
                      dataKey="communication"
                      stroke="#4f8fb5"
                      strokeWidth={2.5}
                      dot={false}
                      name="Communication"
                    />

                    <Line
                      type="monotone"
                      dataKey="problemSolving"
                      stroke="#d19b52"
                      strokeWidth={2.5}
                      dot={false}
                      name="Problem Solving"
                    />

                    <Line
                      type="monotone"
                      dataKey="answerStructure"
                      stroke="#9478b8"
                      strokeWidth={2.5}
                      dot={false}
                      name="Answer Structure"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-xs font-medium text-[#71818a]">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#2b887d]" />
                  Technical
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#4f8fb5]" />
                  Communication
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#d19b52]" />
                  Problem Solving
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#9478b8]" />
                  Answer Structure
                </div>
              </div>
            </section>

            {/* Attempts */}
            <section className="mb-8 rounded-3xl border border-[#e1eae7] bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold tracking-[0.16em] text-[#2b887d]">
                    INTERVIEW ATTEMPTS
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    Your Progress History
                  </h2>

                  <p className="mt-2 text-sm text-[#71818a]">
                    Review the scores recorded from your previous interviews.
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e9f6f2] text-[#2b887d]">
                  <History size={21} />
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {results.map((result, index) => (
                  <div
                    key={result.id}
                    className="flex flex-col gap-4 rounded-2xl border border-[#e6eeeb] bg-[#fbfdfc] p-5 transition hover:border-[#b9dcd5] sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-xl bg-[#e9f6f2] p-3 text-[#2b887d]">
                        <CalendarDays size={18} />
                      </div>

                      <div>
                        <p className="font-bold text-[#183b4d]">
                          {result.assessment_type === "reassessment"
                            ? "Reassessment"
                            : "Initial Assessment"}
                        </p>

                        <p className="mt-1 text-xs text-[#84929a]">
                          Attempt {index + 1}
                        </p>

                        <p className="mt-1 text-xs text-[#84929a]">
                          {new Date(result.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-5 sm:justify-end">
                      <div className="text-left sm:text-right">
                        <p className="text-xs font-medium text-[#84929a]">
                          Overall Score
                        </p>

                        <p className="mt-1 text-2xl font-bold text-[#2b887d]">
                          {result.overall_score}/100
                        </p>
                      </div>

                      <ChevronRight size={19} className="text-[#9aabae]" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Bottom Action */}
            <section className="mb-8 rounded-3xl bg-[#183b4d] p-6 text-white shadow-sm sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold tracking-[0.16em] text-[#9ddbd1]">
                    KEEP IMPROVING
                  </p>

                  <h2 className="mt-2 text-2xl font-bold">
                    Ready for another interview?
                  </h2>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-[#c4d3d9]">
                    Practice again to improve your scores and build stronger
                    interview confidence.
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
            </section>
          </>
        )}
      </div>
    </main>
  );
}