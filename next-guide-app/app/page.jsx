import Link from "next/link";
import { getAllGuides } from "../lib/guide-parser.js";

export const dynamic = "force-static";

export default function HomePage() {
  const guides = getAllGuides();
  const totalQuestions = guides.reduce(
    (sum, guide) => sum + guide.totalQuestions,
    0,
  );
  const totalTopics = guides.reduce(
    (sum, guide) => sum + guide.categories.length,
    0,
  );
  const deepestGuide = guides.reduce(
    (largest, guide) =>
      !largest || guide.totalQuestions > largest.totalQuestions
        ? guide
        : largest,
    null,
  );
  const spotlightGuides = guides.slice(0, 4);

  return (
    <main className="min-h-screen overflow-hidden bg-[#09080f] text-[#f4f4f5]">
      {/* HERO */}

      <section className="relative px-6 pb-24 pt-16 lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(74,222,128,0.14),transparent_28%),radial-gradient(circle_at_top_right,rgba(167,139,250,0.08),transparent_24%)]" />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          {/* LEFT */}

          <div>
            <span className="inline-flex items-center rounded-full border border-[#2b2b42] bg-[#171726]/80 px-4 py-2 text-sm text-[#a1a1b5] backdrop-blur">
              🚀 Interview Prep Workspace
            </span>

            <h1 className="mt-8 text-5xl lg:text-7xl font-black leading-tight">
              Master
              <span className="block bg-gradient-to-r from-[#4ade80] via-[#86efac] to-[#a7f3d0] bg-clip-text text-transparent">
                Technical Interviews
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#a1a1b5]">
              A modern reusable guide system for JavaScript, React, Node.js,
              MongoDB, and System Design — designed for serious developers who
              want structured interview preparation.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href={`/guides/${deepestGuide?.slug}`}
                className="rounded-2xl bg-gradient-to-r from-[#4ade80] to-[#22c55e] px-7 py-4 font-semibold text-[#07190c] transition hover:scale-105"
              >
                Start Learning
              </Link>

              <a
                href="#catalog"
                className="rounded-2xl border border-[#2b2b42] bg-[#171726]/80 px-7 py-4 text-[#ede9fe] backdrop-blur transition hover:bg-[#201e33]"
              >
                Explore Guides
              </a>
            </div>

            {/* STATS */}

            <div className="mt-14 grid grid-cols-3 gap-4">
              <div className="rounded-3xl border border-[#2b2b42] bg-[#171726]/80 p-5 backdrop-blur">
                <h3 className="text-3xl font-bold">{guides.length}</h3>

                <p className="mt-1 text-[#72728d]">Guides</p>
              </div>

              <div className="rounded-3xl border border-[#2b2b42] bg-[#171726]/80 p-5 backdrop-blur">
                <h3 className="text-3xl font-bold">{totalQuestions}</h3>

                <p className="mt-1 text-[#72728d]">Questions</p>
              </div>

              <div className="rounded-3xl border border-[#2b2b42] bg-[#171726]/80 p-5 backdrop-blur">
                <h3 className="text-3xl font-bold">{totalTopics}</h3>

                <p className="mt-1 text-[#72728d]">Topics</p>
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div className="relative">
            <div className="rounded-[32px] border border-[#2b2b42] bg-[linear-gradient(180deg,rgba(74,222,128,0.08),rgba(23,23,38,0.92))] p-8 shadow-2xl shadow-black/30 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#4ade80]">
                    Featured Guide
                  </p>

                  <h2 className="mt-3 text-3xl font-bold">
                    {deepestGuide?.navLabel}
                  </h2>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4ade80] to-[#15803d] text-2xl text-[#07190c]">
                  ⚡
                </div>
              </div>

              <p className="mt-6 leading-relaxed text-[#a1a1b5]">
                The largest and most complete guide in the workspace with
                extensive interview questions and structured topic coverage.
              </p>

              <div className="mt-10 grid grid-cols-3 gap-4">
                <div className="rounded-2xl border border-[#2b2b42] bg-[#11111a]/80 p-4">
                  <h3 className="text-2xl font-bold">
                    {deepestGuide?.totalQuestions}
                  </h3>

                  <p className="text-sm text-[#72728d]">Questions</p>
                </div>

                <div className="rounded-2xl border border-[#2b2b42] bg-[#11111a]/80 p-4">
                  <h3 className="text-2xl font-bold">
                    {deepestGuide?.categories.length}
                  </h3>

                  <p className="text-sm text-[#72728d]">Topics</p>
                </div>

                <div className="rounded-2xl border border-[#2b2b42] bg-[#11111a]/80 p-4">
                  <h3 className="text-2xl font-bold">
                    {deepestGuide?.levels.length || 1}
                  </h3>

                  <p className="text-sm text-[#72728d]">Levels</p>
                </div>
              </div>

              <Link
                href={`/guides/${deepestGuide?.slug}`}
                className="mt-8 inline-flex w-full justify-center rounded-2xl bg-gradient-to-r from-[#4ade80] to-[#22c55e] py-4 font-semibold text-[#07190c] transition hover:scale-[1.02]"
              >
                Open Guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}

      <section className="px-6 py-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          {[
            {
              title: "Reusable Architecture",

              desc: "One scalable guide system with shared layouts and components.",

              icon: "🧩",
            },

            {
              title: "Focused Revision",

              desc: "Quickly jump into topics and practice interview questions.",

              icon: "🎯",
            },

            {
              title: "Modern Learning Flow",

              desc: "Built for repeated study and structured preparation.",

              icon: "⚡",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-[#2b2b42] bg-[#171726]/80 p-8 backdrop-blur"
            >
              <div className="text-4xl">{item.icon}</div>

              <h3 className="mt-6 text-2xl font-bold">{item.title}</h3>

              <p className="mt-3 leading-relaxed text-[#a1a1b5]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* GUIDE CATALOG */}

      <section id="catalog" className="px-6 py-20 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14">
            <p className="font-medium text-[#4ade80]">Full Library</p>

            <h2 className="mt-3 text-5xl font-black">Explore Guides</h2>

            <p className="mt-4 max-w-2xl text-[#a1a1b5]">
              Browse all interview preparation tracks with beautifully organized
              study structures and reusable layouts.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {guides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group relative overflow-hidden rounded-[28px] border border-[#2b2b42] bg-[#171726]/80 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[#4ade80]/30"
              >
                <div
                  className="absolute inset-0 opacity-0 transition group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(circle at top left, ${guide.theme.accent}1f, transparent 60%)`,
                  }}
                />

                <div className="relative z-10">
                  <div
                    className="h-3 w-24 rounded-full"
                    style={{
                      background: guide.theme.accent,
                    }}
                  />

                  <h3 className="mt-6 text-3xl font-bold">{guide.navLabel}</h3>

                  <p className="mt-4 leading-relaxed text-[#a1a1b5]">
                    {guide.headerSubText}
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <span className="rounded-full border border-[#2b2b42] bg-[#11111a]/80 px-4 py-2 text-sm text-[#72728d]">
                      {guide.totalQuestions} Questions
                    </span>

                    <span className="rounded-full border border-[#2b2b42] bg-[#11111a]/80 px-4 py-2 text-sm text-[#72728d]">
                      {guide.categories.length} Topics
                    </span>
                  </div>

                  <div className="mt-10 flex items-center justify-between">
                    <span className="text-sm text-[#72728d]">Open Guide</span>

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#201e33] text-[#f4f4f5] transition group-hover:translate-x-1">
                      ↗
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
