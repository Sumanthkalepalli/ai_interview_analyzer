import Link from "next/link";
export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6">
        <div className="text-2xl font-bold">
          AI Interview Analyzer
        </div>

        <div className="flex gap-4">
          <Link
            href="/login"
            className="rounded-lg px-5 py-2 text-gray-300 hover:text-white"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-lg bg-white px-5 py-2 font-semibold text-black hover:bg-gray-200"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 rounded-full border border-gray-700 px-4 py-2 text-sm text-gray-300">
          AI-Powered Skill Assessment
        </div>

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight md:text-7xl">
          Discover Your
          <span className="block text-gray-400">
            Interview Potential
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-400">
          Practice interviews, analyze your performance with AI,
          identify your skill gaps, and receive a personalized
          improvement plan.
        </p>

        <button className="mt-10 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-black transition hover:scale-105 hover:bg-gray-200">
          Start AI Interview →
        </button>
      </section>
            {/* How It Works */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-gray-500">
              How It Works
            </p>

            <h2 className="mt-3 text-4xl font-bold md:text-5xl">
              From Interview to Improvement
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-gray-400">
              AI Interview Analyzer evaluates your performance,
              discovers your skill gaps, and helps you improve.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">

            <div className="rounded-2xl border border-gray-800 bg-gray-950 p-8">
              <div className="text-3xl">🎤</div>

              <h3 className="mt-6 text-xl font-semibold">
                01. Take Interview
              </h3>

              <p className="mt-3 text-gray-400">
                Answer AI-generated interview questions based on
                your selected role and skill level.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-950 p-8">
              <div className="text-3xl">🧠</div>

              <h3 className="mt-6 text-xl font-semibold">
                02. AI Analysis
              </h3>

              <p className="mt-3 text-gray-400">
                AI analyzes your answers for technical knowledge,
                communication, problem solving, and answer quality.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-950 p-8">
              <div className="text-3xl">📈</div>

              <h3 className="mt-6 text-xl font-semibold">
                03. Improve
              </h3>

              <p className="mt-3 text-gray-400">
                Receive personalized recommendations and track
                your improvement through future assessments.
              </p>
            </div>

          </div>
        </div>
      </section>
            {/* AI Skill Analysis Preview */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">

          <div className="grid items-center gap-12 md:grid-cols-2">

            {/* Left Content */}
            <div>
              <p className="text-sm font-medium uppercase tracking-widest text-gray-500">
                AI Skill Intelligence
              </p>

              <h2 className="mt-4 text-4xl font-bold md:text-5xl">
                See what your answers reveal.
              </h2>

              <p className="mt-6 leading-7 text-gray-400">
                AI Interview Analyzer goes beyond right or wrong answers.
                It analyzes how you think, communicate, and solve problems
                to create a detailed picture of your current abilities.
              </p>

              <div className="mt-8 space-y-4">

                <div className="flex items-center gap-4">
                  <span className="text-xl">✓</span>
                  <span className="text-gray-300">
                    Technical knowledge analysis
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xl">✓</span>
                  <span className="text-gray-300">
                    Communication and answer structure
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xl">✓</span>
                  <span className="text-gray-300">
                    Personalized skill-gap detection
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xl">✓</span>
                  <span className="text-gray-300">
                    AI-generated improvement roadmap
                  </span>
                </div>

              </div>
            </div>

            {/* Analysis Card */}
            <div className="rounded-3xl border border-gray-800 bg-gray-950 p-8 shadow-2xl">

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    SKILL ANALYSIS
                  </p>

                  <h3 className="mt-1 text-2xl font-bold">
                    Your Performance
                  </h3>
                </div>

                <div className="rounded-full border border-gray-700 px-4 py-2 text-sm text-gray-300">
                  AI Report
                </div>
              </div>

              {/* Overall Score */}
              <div className="mt-8 rounded-2xl border border-gray-800 p-6">
                <p className="text-sm text-gray-500">
                  Overall Skill Score
                </p>

                <div className="mt-2 flex items-end gap-2">
                  <span className="text-5xl font-bold">
                    78
                  </span>

                  <span className="mb-2 text-gray-500">
                    / 100
                  </span>
                </div>
              </div>

              {/* Skills */}
              <div className="mt-6 space-y-5">

                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span>Technical Knowledge</span>
                    <span>82%</span>
                  </div>

                  <div className="h-2 rounded-full bg-gray-800">
                    <div className="h-2 w-[82%] rounded-full bg-white" />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span>Communication</span>
                    <span>76%</span>
                  </div>

                  <div className="h-2 rounded-full bg-gray-800">
                    <div className="h-2 w-[76%] rounded-full bg-white" />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span>Problem Solving</span>
                    <span>69%</span>
                  </div>

                  <div className="h-2 rounded-full bg-gray-800">
                    <div className="h-2 w-[69%] rounded-full bg-white" />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span>Answer Structure</span>
                    <span>74%</span>
                  </div>

                  <div className="h-2 rounded-full bg-gray-800">
                    <div className="h-2 w-[74%] rounded-full bg-white" />
                  </div>
                </div>

              </div>

              {/* AI Insight */}
              <div className="mt-8 rounded-2xl border border-gray-800 bg-black p-5">
                <p className="text-sm font-medium">
                  🧠 AI Insight
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-400">
                  Strong technical foundation. Focus on structured
                  explanations and problem-solving practice to improve
                  interview performance.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>
            {/* Personalized Improvement Plan */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">

          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-gray-500">
              Personalized Growth
            </p>

            <h2 className="mt-4 text-4xl font-bold md:text-5xl">
              Your next step is already clear.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-gray-400">
              Instead of giving you a score and leaving you there,
              AI Interview Analyzer creates a focused improvement
              plan based on your performance.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">

            {/* Step 1 */}
            <div className="rounded-3xl border border-gray-800 bg-gray-950 p-7">
              <div className="flex items-center justify-between">
                <span className="text-3xl">🔍</span>

                <span className="text-sm text-gray-600">
                  STEP 01
                </span>
              </div>

              <h3 className="mt-8 text-xl font-semibold">
                Identify Skill Gaps
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                AI analyzes your interview responses and identifies
                the specific concepts and skills that need attention.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-3xl border border-gray-800 bg-gray-950 p-7">
              <div className="flex items-center justify-between">
                <span className="text-3xl">🧭</span>

                <span className="text-sm text-gray-600">
                  STEP 02
                </span>
              </div>

              <h3 className="mt-8 text-xl font-semibold">
                Build Your Roadmap
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                Receive a personalized learning path with topics,
                practice activities, and recommended next steps.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-3xl border border-gray-800 bg-gray-950 p-7">
              <div className="flex items-center justify-between">
                <span className="text-3xl">📈</span>

                <span className="text-sm text-gray-600">
                  STEP 03
                </span>
              </div>

              <h3 className="mt-8 text-xl font-semibold">
                Measure Improvement
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                Take another assessment and compare your performance
                to see how your skills develop over time.
              </p>
            </div>

          </div>

          {/* Example Plan */}
          <div className="mt-10 rounded-3xl border border-gray-800 bg-gray-950 p-8 md:p-10">

            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="text-sm text-gray-500">
                  SAMPLE AI ROADMAP
                </p>

                <h3 className="mt-2 text-2xl font-bold">
                  Java Developer — 7 Day Improvement Plan
                </h3>
              </div>

              <span className="w-fit rounded-full border border-gray-700 px-4 py-2 text-sm text-gray-400">
                AI Generated
              </span>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-4">

              <div className="rounded-2xl border border-gray-800 p-5">
                <p className="text-xs text-gray-500">DAY 01</p>
                <p className="mt-2 font-medium">Java Collections</p>
                <p className="mt-2 text-sm text-gray-500">
                  Review HashMap and ArrayList
                </p>
              </div>

              <div className="rounded-2xl border border-gray-800 p-5">
                <p className="text-xs text-gray-500">DAY 02</p>
                <p className="mt-2 font-medium">Time Complexity</p>
                <p className="mt-2 text-sm text-gray-500">
                  Practice Big-O analysis
                </p>
              </div>

              <div className="rounded-2xl border border-gray-800 p-5">
                <p className="text-xs text-gray-500">DAY 03</p>
                <p className="mt-2 font-medium">Problem Solving</p>
                <p className="mt-2 text-sm text-gray-500">
                  Solve coding challenges
                </p>
              </div>

              <div className="rounded-2xl border border-gray-800 p-5">
                <p className="text-xs text-gray-500">DAY 04</p>
                <p className="mt-2 font-medium">Mock Interview</p>
                <p className="mt-2 text-sm text-gray-500">
                  Practice structured answers
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>
            {/* Final Call To Action */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-gray-800 bg-gray-950 px-8 py-16 text-center md:px-16">

          <p className="text-sm font-medium uppercase tracking-widest text-gray-500">
            Start Your Journey
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-bold md:text-6xl">
            Know where you stand.
            <span className="block text-gray-500">
              Know what to improve.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-gray-400">
            Take your first AI-powered interview assessment and
            discover the skills that can take you further.
          </p>

          <button className="mt-10 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-black transition hover:scale-105 hover:bg-gray-200">
            Start Your First Assessment →
          </button>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-900 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-gray-500 md:flex-row">

          <p>
            © 2026 AI Interview Analyzer
          </p>

          <p>
            AI-powered interview & skill evaluation
          </p>

        </div>
      </footer>
    </main>
  );
}