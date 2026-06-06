"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import GuideSidebar from "./GuideSidebar.js";
import GuideFilters from "./GuideFilters.js";
import QuestionSection from "./QuestionSection.js";
import TipsSection from "./TipsSection.js";

function viewedKey(slug) {
  return `guide-viewed:${slug}`;
}

export default function GuidePageClient({ guide, guides }) {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeLevel, setActiveLevel] = useState("all");
  const [search, setSearch] = useState("");
  const [viewed, setViewed] = useState([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(viewedKey(guide.slug));
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) {
        setViewed(parsed.filter((value) => Number.isInteger(value)));
      }
    } catch {
      setViewed([]);
    }
  }, [guide.slug]);

  useEffect(() => {
    try {
      window.localStorage.setItem(viewedKey(guide.slug), JSON.stringify(viewed));
    } catch {
      // Ignore storage failures in restricted environments.
    }
  }, [guide.slug, viewed]);

  const viewedSet = useMemo(() => new Set(viewed), [viewed]);

  const filteredQuestions = useMemo(() => {
    const q = search.toLowerCase().trim();
    return guide.questions.filter((item) => {
      const plainAnswer = item.a.replace(/<[^>]+>/g, " ");
      const matchCategory = !activeCategory || item.section === activeCategory;
      const matchLevel = activeLevel === "all" || item.level === activeLevel;
      const matchSearch =
        !q ||
        item.q.toLowerCase().includes(q) ||
        item.section.toLowerCase().includes(q) ||
        plainAnswer.toLowerCase().includes(q);

      return matchCategory && matchLevel && matchSearch;
    });
  }, [activeCategory, activeLevel, guide.questions, search]);

  const visibleSections = useMemo(() => {
    const order = activeCategory ? [activeCategory] : guide.categories;
    return order
      .map((category) => ({
        category,
        items: filteredQuestions.filter((item) => item.section === category),
      }))
      .filter((section) => section.items.length);
  }, [activeCategory, filteredQuestions, guide.categories]);

  const viewedCount = viewedSet.size;
  const progress = guide.totalQuestions
    ? Math.round((viewedCount / guide.totalQuestions) * 100)
    : 0;

  function markViewed(index) {
    setViewed((current) => (current.includes(index) ? current : [...current, index]));
  }

  return (
    <div
      className="guide-page"
      style={{
        "--accent": guide.theme.accent,
        "--accent-soft": guide.theme.accentSoft,
        "--accent-border": guide.theme.accentBorder,
        "--accent-bg": guide.theme.accentBackground,
      }}
    >
      <header className="guide-header">
        <div className="guide-header-inner">
          <nav className="top-nav" aria-label="Guide navigation">
            <Link href="/" className="top-nav-link">
              Hub
            </Link>
            {guides.map((item) => (
              <Link
                key={item.slug}
                href={`/guides/${item.slug}`}
                className={`top-nav-link ${item.slug === guide.slug ? "active" : ""}`}
              >
                {item.navLabel}
              </Link>
            ))}
          </nav>

          <p className="eyebrow">{guide.headerTag}</p>
          <h1
            className="guide-title"
            dangerouslySetInnerHTML={{ __html: guide.headerTitleHtml }}
          />
          <p className="guide-copy">{guide.headerSubText}</p>

          <div className="stats-row">
            <div className="stat-chip">
              <strong>{guide.totalQuestions}</strong> questions
            </div>
            <div className="stat-chip">
              <strong>{viewedCount}</strong> viewed
            </div>
            <div className="stat-chip">
              <strong>{guide.categories.length}</strong> topics
            </div>
            <div className="stat-chip">
              <strong>{progress}%</strong> progress
            </div>
          </div>
        </div>
      </header>

      <div className="guide-layout">
        <GuideSidebar
          categories={guide.categories}
          counts={guide.categoryCounts}
          activeCategory={activeCategory}
          progress={progress}
          onSelectCategory={setActiveCategory}
          onJumpToTips={() => {
            setActiveCategory(null);
            document.getElementById("tips-section")?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }}
        />

        <main className="guide-main">
          <GuideFilters
            levels={guide.levels}
            search={search}
            activeLevel={activeLevel}
            onSearchChange={setSearch}
            onLevelChange={setActiveLevel}
          />

          {visibleSections.length ? (
            <div className="sections-stack">
              {visibleSections.map((section) => (
                <QuestionSection
                  key={section.category}
                  category={section.category}
                  items={section.items}
                  viewedSet={viewedSet}
                  onViewed={markViewed}
                />
              ))}
            </div>
          ) : (
            <div className="no-results">
              No questions matching <span>{search || activeLevel}</span>
            </div>
          )}

          <TipsSection tips={guide.tips} />
        </main>
      </div>
    </div>
  );
}
