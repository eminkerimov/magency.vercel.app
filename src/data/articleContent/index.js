import { articleContent1To6 } from "./articles1to6";
import { articleContent7To12 } from "./articles7to12";

export const articleContentById = {
  ...articleContent1To6,
  ...articleContent7To12,
};

export const getArticleContent = (articleId) =>
  articleContentById[Number(articleId)] || null;

const countWords = (value) =>
  String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

export const getArticleReadingTime = (articleId, fallback = 1) => {
  const sections = getArticleContent(articleId)?.sections;

  if (!Array.isArray(sections) || sections.length === 0) {
    return fallback;
  }

  let words = 0;
  let complexityMinutes = 0;

  sections.forEach((section) => {
    (section.blocks || []).forEach((block) => {
      words += countWords(block.text);

      if (block.type === "list") {
        words += (block.items || []).reduce(
          (total, item) => total + countWords(item),
          0
        );
        complexityMinutes += 0.5;
      }

      if (block.type === "code") {
        complexityMinutes += 0.75;
      }

      if (block.type === "quote") {
        complexityMinutes += 0.25;
      }
    });
  });

  return Math.max(1, Math.ceil(words / 130 + complexityMinutes));
};
