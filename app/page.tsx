
import Link from "next/link";

const features = [
  {
    icon: "◉",
    title: "Real Interview Practice",
    description:
      "Practice realistic, role-based interviews with an AI interviewer in a professional environment.",
  },
  {
    icon: "✦",
    title: "Intelligent AI Feedback",
    description:
      "Receive insights into technical knowledge, communication, problem solving, and answer structure.",
  },
  {
    icon: "↗",
    title: "Personalized Improvement",
    description:
      "Identify skill gaps and follow a personalized roadmap to improve your interview performance.",
  },
];

const steps = [
  {
    number: "01",
    title: "Start an Interview",
    description:
      "Choose your role and answer AI-generated interview questions.",
  },
  {
    number: "02",
    title: "Get Your Analysis",
    description:
      "Receive detailed feedback about your interview performance.",
  },
  {
    number: "03",
    title: "Improve Your Skills",
    description:
      "Use your feedback to improve and track your progress over time.",
  },
];

const skills = [
  { name: "Technical Knowledge", score: 82, color: "#287f75" },
  { name: "Communication", score: 76, color: "#65a99e" },
  { name: "Problem Solving", score: 69, color: "#9bcabb" },
  { name: "Answer Structure", score: 74, color: "#4b9389" },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f8f7] text-[#183b4d]">
      {/* Top Browser-Style Accent */}
      <div className="h-2 bg-[#dfe9e5]" />

      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-[#e5e9e7] bg-white/95 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 lg:px-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e4f0eb] text-2xl font-bold text-[#287f75]">
              W
            </div>

            <div>
              <p className="text-base font-bold tracking-tight text-[#183b4d]">
                AI Interview
              </p>

              <p className="text-xs font-medium tracking-wide text-[#73918b]">
                ANALYZER
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 text-sm font-medium text-[#81949a] lg:flex">
            <a
              href="#features"
              className="transition hover:text-[#287f75]"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="transition hover:text-[#287f75]"
            >
              How It Works
            </a>

            <a
              href="#insights"
              className="transition hover:text-[#287f75]"
            >
              AI Insights
            </a>

            <a
              href="#roadmap"
              className="transition hover:text-[#287f75]"
            >
              Roadmap
            </a>
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-lg px-4 py-2.5 text-sm font-semibold text-[#66818a] transition hover:bg-[#eef5f1] hover:text-[#287f75] sm:block"
            >
              Sign In
            </Link>

            <Link
              href="/register"
              className="rounded-lg bg-[#2b887d] px-5 py-3 text-sm font-semibold text-white shadow-[0_5px_18px_rgba(43,136,125,0.20)] transition hover:bg-[#236f67] hover:shadow-[0_7px_22px_rgba(43,136,125,0.30)]"
            >
              Get Started
              <span className="ml-2">→</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 pb-16 pt-16 lg:px-12 lg:pb-24 lg:pt-24">
        {/* Soft Background Shapes */}
        <div className="pointer-events-none absolute left-[-200px] top-[-150px] h-[450px] w-[450px] rounded-full bg-[#e2f0eb] blur-3xl" />

        <div className="pointer-events-none absolute right-[-180px] top-[120px] h-[400px] w-[400px] rounded-full bg-[#edf2f5] blur-3xl" />

        <div className="relative mx-auto grid max-w-[1250px] items-center gap-14 lg:grid-cols-[1fr_1fr]">
          {/* Hero Text */}
          <div>
            <div className="mb-6 flex w-fit items-center gap-3 rounded-full border border-[#cfe2db] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#39877b]">
              <span className="h-2 w-2 rounded-full bg-[#2b887d]" />
              AI-Powered Interview Intelligence
            </div>

            <h1 className="max-w-xl text-4xl font-bold leading-[1.12] tracking-[-0.04em] text-[#173d51] sm:text-5xl lg:text-6xl">
              Practice with confidence.
              <span className="mt-2 block text-[#2b887d]">
                Interview better.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-[#71858d] sm:text-lg">
              Prepare for your next interview with AI-powered practice,
              personalized feedback, and performance analysis designed to
              help you become interview ready.
            </p>

            {/* CTA Buttons */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="rounded-lg bg-[#2b887d] px-7 py-4 text-center text-sm font-semibold text-white shadow-[0_5px_18px_rgba(43,136,125,0.18)] transition hover:bg-[#236f67]"
              >
                Start Your Interview
                <span className="ml-3">→</span>
              </Link>

              <a
                href="#how-it-works"
                className="rounded-lg border border-[#c6d9d3] bg-white px-7 py-4 text-center text-sm font-semibold text-[#47736e] transition hover:border-[#2b887d] hover:bg-[#eef6f2]"
              >
                Explore Platform
              </a>
            </div>

            {/* Trust Information */}
            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-[#81949a]">
              <div className="flex items-center gap-2">
                <span className="text-[#2b887d]">✓</span>
                AI-based feedback
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[#2b887d]">✓</span>
                Skill analysis
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[#2b887d]">✓</span>
                Progress tracking
              </div>
            </div>
          </div>

          {/* Hero Dashboard Preview */}
          <div className="relative">
            <div className="absolute -inset-5 rounded-[2rem] bg-[#dcebe5] opacity-70 blur-2xl" />

            <div className="relative overflow-hidden rounded-2xl border border-[#e0e7e3] bg-white shadow-[0_18px_60px_rgba(44,75,71,0.12)]">
              {/* Preview Header */}
              <div className="flex items-center justify-between border-b border-[#edf0ef] px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e5f1ec] font-bold text-[#2b887d]">
                    W
                  </div>

                  <span className="text-xs font-bold text-[#284c5d]">
                    InterviewAI
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[#8da3a6]">
                  <span className="text-sm">?</span>
                  <span className="text-sm">♧</span>
                  <div className="h-7 w-7 rounded-full bg-[#dcebe5]" />
                </div>
              </div>

              {/* Preview Body */}
              <div className="grid grid-cols-[112px_1fr]">
                {/* Preview Sidebar */}
                <div className="border-r border-[#edf0ef] bg-[#fbfcfb] p-3">
                  <div className="mb-5 rounded-md bg-[#2b887d] px-2 py-2 text-center text-[9px] font-semibold text-white">
                    + New Interview
                  </div>

                  <div className="space-y-4 text-[10px] text-[#8ba0a4]">
                    <p className="rounded-md bg-[#e2f0e9] px-2 py-2 font-semibold text-[#2b887d]">
                      ▣ Dashboard
                    </p>

                    <p>▧ Interviews</p>
                    <p>▥ Analytics</p>
                    <p>♧ Skills</p>
                    <p>⚙ Settings</p>
                  </div>

                  <div className="mt-24 rounded-md bg-[#e6f1ed] px-2 py-2 text-center text-[9px] font-semibold text-[#287f75]">
                    Premium User
                  </div>
                </div>

                {/* Preview Content */}
                <div className="min-w-0 bg-[#f8f9f8] p-4">
                  <p className="text-[9px] font-medium uppercase tracking-widest text-[#9aa9ac]">
                    Your Dashboard
                  </p>

                  <h3 className="mt-2 text-sm font-bold text-[#284c5d]">
                    Welcome back, Sumanth
                  </h3>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="rounded-lg border border-[#e8edeb] bg-white p-3">
                      <p className="text-[9px] text-[#9aa9ac]">
                        Interviews
                      </p>

                      <p className="mt-2 text-xl font-bold text-[#2b887d]">
                        15
                      </p>

                      <p className="mt-1 text-[8px] text-[#94a6a8]">
                        Completed
                      </p>
                    </div>

                    <div className="rounded-lg border border-[#e8edeb] bg-white p-3">
                      <p className="text-[9px] text-[#9aa9ac]">
                        Average Score
                      </p>

                      <p className="mt-2 text-xl font-bold text-[#2b887d]">
                        90
                      </p>

                      <p className="mt-1 text-[8px] text-[#94a6a8]">
                        Performance
                      </p>
                    </div>
                  </div>

                  {/* Interview Card */}
                  <div className="mt-3 rounded-lg border border-[#e8edeb] bg-white p-4">
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-[#9aa9ac]">
                      Most Recent
                    </p>

                    <h4 className="mt-2 text-xs font-bold text-[#284c5d]">
                      Technical Interview
                    </h4>

                    <p className="mt-2 text-[9px] text-[#94a6a8]">
                      15 minutes · 9 questions
                    </p>

                    <div className="mt-4 inline-block rounded-md bg-[#2b887d] px-4 py-2 text-[9px] font-semibold text-white">
                      Start Interview
                    </div>
                  </div>

                  {/* Progress Card */}
                  <div className="mt-3 rounded-lg border border-[#e8edeb] bg-white p-4">
                    <h4 className="text-xs font-bold text-[#284c5d]">
                      Your Progress
                    </h4>

                    <div className="mt-5 flex h-24 items-end justify-around gap-2">
                      <div className="h-[38%] w-6 rounded-t-sm bg-[#b5d9cc]" />
                      <div className="h-[55%] w-6 rounded-t-sm bg-[#8fc5b6]" />
                      <div className="h-[73%] w-6 rounded-t-sm bg-[#5da99a]" />
                      <div className="h-[90%] w-6 rounded-t-sm bg-[#2b887d]" />
                    </div>

                    <div className="mt-2 flex justify-around text-[8px] text-[#a1b0b2]">
                      <span>Week 1</span>
                      <span>Week 2</span>
                      <span>Week 3</span>
                      <span>Week 4</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section
        id="features"
        className="border-y border-[#e5ebe7] bg-white px-6 py-20 lg:px-12"
      >
        <div className="mx-auto max-w-[1250px]">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#39877b]">
              Platform Features
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#183b4d] sm:text-4xl">
              Everything you need to prepare.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#84979c]">
              Build confidence through realistic practice, meaningful
              feedback, and continuous improvement.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-[#e3ebe7] bg-[#fbfcfb] p-7 transition hover:-translate-y-1 hover:border-[#9dc9bc] hover:shadow-[0_12px_35px_rgba(44,110,95,0.08)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e2f0e9] text-2xl text-[#2b887d]">
                  {feature.icon}
                </div>

                <h3 className="mt-6 text-lg font-bold text-[#284c5d]">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#83979c]">
                  {feature.description}
                </p>

                <div className="mt-5 text-lg font-semibold text-[#2b887d]">
                  →
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Insights Section */}
      <section
        id="insights"
        className="bg-[#f7f9f7] px-6 py-20 lg:px-12"
      >
        <div className="mx-auto grid max-w-[1100px] items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#39877b]">
              Intelligent Feedback
            </p>

            <h2 className="mt-4 text-3xl font-bold leading-tight text-[#183b4d] sm:text-4xl">
              Understand your performance with AI.
            </h2>

            <p className="mt-5 text-sm leading-8 text-[#81959b]">
              Analyze your interview responses and understand the areas where
              you are performing well and where you can improve.
            </p>

            <div className="mt-7 space-y-4 text-sm text-[#52717a]">
              {[
                "Technical knowledge evaluation",
                "Communication and clarity analysis",
                "Problem-solving assessment",
                "Personalized improvement suggestions",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#dceee7] text-xs font-bold text-[#2b887d]">
                    ✓
                  </span>

                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Score Breakdown Card */}
          <div className="rounded-2xl border border-[#e0e9e4] bg-white p-7 shadow-[0_12px_45px_rgba(40,80,70,0.06)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-[#9aaeb0]">
                  Performance Report
                </p>

                <h3 className="mt-2 text-xl font-bold text-[#284c5d]">
                  Skill Breakdown
                </h3>
              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-full border-[6px] border-[#2b887d] text-lg font-bold text-[#2b887d]">
                78
              </div>
            </div>

            <div className="mt-8 space-y-6">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-[#52717a]">
                      {skill.name}
                    </span>

                    <span className="font-bold text-[#2b887d]">
                      {skill.score}%
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-[#edf1ef]">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${skill.score}%`,
                        backgroundColor: skill.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-xl bg-[#f0f7f3] p-4">
              <p className="text-xs font-bold text-[#2b887d]">
                ✦ AI Recommendation
              </p>

              <p className="mt-2 text-xs leading-6 text-[#78918e]">
                Practice structured answers to improve clarity, confidence,
                and overall interview performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="bg-white px-6 py-20 lg:px-12"
      >
        <div className="mx-auto max-w-[1250px]">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#39877b]">
              Simple Process
            </p>

            <h2 className="mt-4 text-3xl font-bold text-[#183b4d] sm:text-4xl">
              Your journey to interview confidence.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#84979c]">
              Follow a simple three-step process to practice, analyze, and
              improve.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-[#e2eae6] bg-[#fbfcfb] p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-bold text-[#c6dfd5]">
                    {step.number}
                  </span>

                  <span className="text-xl text-[#2b887d]">↗</span>
                </div>

                <h3 className="mt-7 text-xl font-bold text-[#284c5d]">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#83979c]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section
        id="roadmap"
        className="bg-[#f3f7f4] px-6 py-20 lg:px-12"
      >
        <div className="mx-auto max-w-[1050px] text-center">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#39877b]">
            Personalized Growth
          </p>

          <h2 className="mt-4 text-3xl font-bold text-[#183b4d] sm:text-4xl">
            Turn feedback into progress.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#84979c]">
            Identify your weak areas, follow targeted recommendations, and
            measure your improvement through future interviews.
          </p>

          <div className="mt-10">
            <Link
              href="/register"
              className="inline-block rounded-lg bg-[#2b887d] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#236f67]"
            >
              Build Your Improvement Roadmap →
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-white px-6 py-24 lg:px-12">
        <div className="mx-auto max-w-[1000px] rounded-3xl bg-[#e7f1eb] px-7 py-14 text-center sm:px-12">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#39877b]">
            Start Today
          </p>

          <h2 className="mt-5 text-3xl font-bold leading-tight text-[#183b4d] sm:text-4xl">
            Your next interview starts with practice.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#718d8c]">
            Build confidence, understand your performance, and prepare for
            your next opportunity with AI Interview Analyzer.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="rounded-lg bg-[#2b887d] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#236f67]"
            >
              Get Started Free →
            </Link>

            <Link
              href="/login"
              className="rounded-lg border border-[#b8d2c7] bg-white px-8 py-4 text-sm font-semibold text-[#47736e] transition hover:border-[#2b887d]"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e3eae6] bg-white px-6 py-8 lg:px-12">
        <div className="mx-auto flex max-w-[1250px] flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div>
            <p className="text-sm font-bold text-[#284c5d]">
              AI Interview Analyzer
            </p>

            <p className="mt-1 text-xs text-[#92a4a8]">
              AI-powered interview practice and skill evaluation.
            </p>
          </div>

          <p className="text-xs text-[#92a4a8]">
            © 2026 AI Interview Analyzer
          </p>
        </div>
      </footer>
    </main>
  );
}