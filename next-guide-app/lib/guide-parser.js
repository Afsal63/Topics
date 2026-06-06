import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { GUIDE_CONFIG } from "./guide-config.js";

function guidePath(fileName) {
  return path.join(process.cwd(), "..", fileName);
}

function readGuideHtml(fileName) {
  return fs.readFileSync(guidePath(fileName), "utf8");
}

function matchOrFallback(html, regex, fallback = "") {
  const matched = html.match(regex);
  return matched ? matched[1].trim() : fallback;
}

function extractArraySource(html, variableName) {
  const start = html.indexOf(`const ${variableName} = [`);
  if (start === -1) {
    return null;
  }

  const arrayStart = html.indexOf("[", start);
  if (arrayStart === -1) {
    return null;
  }

  let depth = 0;
  let mode = "code";

  for (let i = arrayStart; i < html.length; i += 1) {
    const char = html[i];
    const next = html[i + 1];
    const prev = html[i - 1];

    if (mode === "line-comment") {
      if (char === "\n") mode = "code";
      continue;
    }

    if (mode === "block-comment") {
      if (prev === "*" && char === "/") mode = "code";
      continue;
    }

    if (mode === "single") {
      if (char === "'" && prev !== "\\") mode = "code";
      continue;
    }

    if (mode === "double") {
      if (char === '"' && prev !== "\\") mode = "code";
      continue;
    }

    if (mode === "template") {
      if (char === "`" && prev !== "\\") mode = "code";
      continue;
    }

    if (char === "/" && next === "/") {
      mode = "line-comment";
      continue;
    }

    if (char === "/" && next === "*") {
      mode = "block-comment";
      continue;
    }

    if (char === "'") {
      mode = "single";
      continue;
    }

    if (char === '"') {
      mode = "double";
      continue;
    }

    if (char === "`") {
      mode = "template";
      continue;
    }

    if (char === "[") {
      depth += 1;
    } else if (char === "]") {
      depth -= 1;
      if (depth === 0) {
        return html.slice(arrayStart, i + 1);
      }
    }
  }

  return null;
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeQuestions(items) {
  return items.map((item, index) => ({
    id: item.id || slugify(item.section || item.c || `item-${index}`),
    section: item.section || item.c || "General",
    icon: item.icon || "",
    level: item.level || "",
    q: item.q || item.t || "",
    a: item.a || item.b || "",
    index,
  }));
}

function extractQuestions(html) {
  const qaSource = extractArraySource(html, "QA");
  if (qaSource) {
    const questions = vm.runInNewContext(qaSource, {}, { timeout: 1000 });
    return normalizeQuestions(questions);
  }

  const topicsSource = extractArraySource(html, "topics");
  if (topicsSource) {
    const topics = vm.runInNewContext(topicsSource, {}, { timeout: 1000 });
    return normalizeQuestions(topics);
  }

  return [];
}

function extractTips(html) {
  const tips = [];
  const regex =
    /<div class="tip-item">[\s\S]*?<div class="tip-num">([\s\S]*?)<\/div>[\s\S]*?<div class="tip-text">([\s\S]*?)<\/div>[\s\S]*?<\/div>/g;

  let match = regex.exec(html);
  while (match) {
    tips.push({
      number: match[1].trim(),
      html: match[2].trim(),
    });
    match = regex.exec(html);
  }

  return tips;
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function parseGuide(config) {
  const html = readGuideHtml(config.fileName);
  const questions = extractQuestions(html);
  const categories = [...new Set(questions.map((item) => item.section))];
  const levels = [...new Set(questions.map((item) => item.level).filter(Boolean))];
  const categoryCounts = questions.reduce((acc, item) => {
    acc[item.section] = (acc[item.section] || 0) + 1;
    return acc;
  }, {});

  const headerTag = matchOrFallback(
    html,
    /<div class="header-tag">([\s\S]*?)<\/div>/,
    "Interview Prep System",
  );
  const headerTitleHtml = matchOrFallback(
    html,
    /<h1>([\s\S]*?)<\/h1>/,
    config.navLabel,
  );
  const headerSubHtml = matchOrFallback(
    html,
    /<p class="header-sub">([\s\S]*?)<\/p>/,
    "",
  );

  return {
    ...config,
    headerTag: stripHtml(headerTag),
    headerTitleHtml,
    titleText: stripHtml(headerTitleHtml),
    headerSubHtml,
    headerSubText: stripHtml(headerSubHtml),
    questions,
    totalQuestions: questions.length,
    categories,
    levels,
    categoryCounts,
    tips: extractTips(html),
  };
}

export function getAllGuides() {
  return GUIDE_CONFIG.map(parseGuide);
}

export function getGuideBySlug(slug) {
  const config = GUIDE_CONFIG.find((item) => item.slug === slug);
  return config ? parseGuide(config) : null;
}
