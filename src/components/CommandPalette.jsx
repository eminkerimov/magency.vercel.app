import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useArticlesQuery } from "../features/articles/queries";
import { useBookmarksQuery } from "../features/bookmarks/queries";
import { useCaseStudiesQuery } from "../features/caseStudies/queries";
import { useReadingProgressSummaries } from "../features/readingProgress";

const PAGE_COMMANDS = [
  {
    id: "page-studio",
    kind: "page",
    type: "Page",
    title: "The Studio",
    description: "Our perspective, working principles, and visual journal.",
    to: "/studio",
    keywords: ["about", "studio", "gallery", "approach", "photography"],
  },
  {
    id: "page-home",
    kind: "page",
    type: "Page",
    title: "Home",
    description: "Portfolio overview and current focus.",
    to: "/",
    keywords: ["overview", "portfolio"],
  },
  {
    id: "page-services",
    kind: "page",
    type: "Page",
    title: "Services",
    description: "Product UI, frontend systems, and delivery support.",
    to: "/#services",
    keywords: ["audit", "build", "support"],
  },
  {
    id: "page-work",
    kind: "case",
    type: "Page",
    title: "Selected work",
    description: "Frontend case studies with implementation evidence.",
    to: "/work",
    keywords: ["portfolio", "projects", "case studies"],
  },
  {
    id: "page-insights",
    kind: "article",
    type: "Page",
    title: "Engineering insights",
    description: "Practical writing on product and frontend engineering.",
    to: "/blogs",
    keywords: ["articles", "writing", "blog"],
  },
  {
    id: "page-topics",
    kind: "topic",
    type: "Page",
    title: "Browse topics",
    description: "Explore insights by engineering discipline.",
    to: "/categories",
    keywords: ["categories", "collections"],
  },
  {
    id: "page-start",
    kind: "page",
    type: "Action",
    title: "Start a project",
    description: "Create a focused browser-local project brief.",
    to: "/start-project",
    keywords: ["contact", "brief", "enquiry"],
  },
];

const QUICK_COMMAND_IDS = new Set([
  "page-work",
  "page-insights",
  "page-topics",
  "page-start",
]);

const EMPTY_LIST = Object.freeze([]);

const normalizeText = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const createSearchText = (item) =>
  normalizeText(
    [
      item.title,
      item.description,
      item.type,
      ...(item.keywords || []),
    ].join(" ")
  );

const scoreCommand = (item, query, terms) => {
  const title = normalizeText(item.title);
  const searchText = createSearchText(item);

  if (!terms.every((term) => searchText.includes(term))) return -1;

  let score = 0;

  if (title === query) score += 140;
  if (title.startsWith(query)) score += 90;
  if (title.includes(query)) score += 55;

  terms.forEach((term) => {
    if (title.startsWith(term)) score += 24;
    else if (title.includes(term)) score += 14;
    else score += 5;
  });

  if (item.kind === "page") score += 3;

  return score;
};

const CommandIcon = ({ kind }) => {
  if (kind === "article") {
    return (
      <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
        <path d="M7 3.75h7l3 3v13.5H7z" />
        <path d="M14 3.75v3h3M9.5 11h5M9.5 14.5h5M9.5 18h3.2" />
      </svg>
    );
  }

  if (kind === "case") {
    return (
      <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
        <path d="M3.75 7.25h6l1.6 2h8.9v9.5H3.75z" />
        <path d="M3.75 7.25v-2h5.5l1.5 2" />
      </svg>
    );
  }

  if (kind === "topic") {
    return (
      <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
        <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
        <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
        <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" />
        <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
      </svg>
    );
  }

  if (kind === "library") {
    return (
      <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
        <path d="M6.75 4.5h10.5v15L12 16.4l-5.25 3.1z" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="7.75" />
      <path d="m14.7 9.3-1.35 4.05L9.3 14.7l1.35-4.05z" />
    </svg>
  );
};

const CommandPalette = ({ onClose, onNavigate }) => {
  const navigate = useNavigate();
  const paletteId = useId();
  const panelRef = useRef(null);
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const {
    data: articleData,
    isError: isArticlesError,
    isPending: isArticlesPending,
    refetch: refetchArticles,
  } = useArticlesQuery();
  const {
    data: caseStudyData,
    isError: isCaseStudiesError,
    isPending: isCaseStudiesPending,
    refetch: refetchCaseStudies,
  } = useCaseStudiesQuery();
  const {
    data: bookmarkData,
    isError: isBookmarksError,
    isPending: isBookmarksPending,
    refetch: refetchBookmarks,
  } = useBookmarksQuery();

  const articles = Array.isArray(articleData) ? articleData : EMPTY_LIST;
  const cases = Array.isArray(caseStudyData) ? caseStudyData : EMPTY_LIST;
  const bookmarks = Array.isArray(bookmarkData) ? bookmarkData : EMPTY_LIST;

  const articleIndex = useMemo(() => {
    const index = new Map();

    articles.forEach((article) => {
      index.set(String(article.id), article);
    });

    bookmarks.forEach((bookmark) => {
      if (bookmark.article) {
        index.set(String(bookmark.articleId), bookmark.article);
      }
    });

    return index;
  }, [articles, bookmarks]);

  const indexedArticles = useMemo(
    () => Array.from(articleIndex.values()),
    [articleIndex]
  );
  const articleIds = useMemo(
    () => indexedArticles.map((article) => article.id),
    [indexedArticles]
  );
  const readingProgress = useReadingProgressSummaries(articleIds);
  const savedArticleIds = useMemo(
    () => new Set(bookmarks.map((bookmark) => String(bookmark.articleId))),
    [bookmarks]
  );

  const articleCommands = useMemo(
    () =>
      indexedArticles.map((article) => {
        const progress = readingProgress[String(article.id)];
        const isSaved = savedArticleIds.has(String(article.id));
        let badge = "";

        if (progress?.isStarted && !progress.isComplete) {
          badge = `${progress.progress}% read`;
        } else if (progress?.isComplete) {
          badge = "Completed";
        } else if (isSaved) {
          badge = "Saved";
        }

        return {
          id: `article-${article.id}`,
          articleId: String(article.id),
          kind: "article",
          type: "Insight",
          title: article.title,
          description: `${article.category} / ${article.readingTime} min read`,
          to: `/blog/${article.id}`,
          badge,
          isSaved,
          progress: progress?.progress || 0,
          isComplete: Boolean(progress?.isComplete),
          updatedAt: progress?.updatedAt || null,
          keywords: [
            article.excerpt,
            article.author,
            article.category,
            ...(article.tags || []),
          ],
        };
      }),
    [indexedArticles, readingProgress, savedArticleIds]
  );

  const caseCommands = useMemo(
    () =>
      cases.map((study) => ({
        id: `case-${study.slug}`,
        kind: "case",
        type: "Case study",
        title: study.name,
        description: study.title,
        to: `/work/${study.slug}`,
        badge: study.type,
        visual: study.visual,
        keywords: [study.summary, study.type, ...(study.stack || [])],
      })),
    [cases]
  );

  const topicCommands = useMemo(() => {
    const counts = new Map();

    indexedArticles.forEach((article) => {
      counts.set(article.category, (counts.get(article.category) || 0) + 1);
    });

    return Array.from(counts, ([category, count]) => ({
      id: `topic-${normalizeText(category).replace(/[^a-z0-9]+/g, "-")}`,
      kind: "topic",
      type: "Topic",
      title: category,
      description: `${count} ${count === 1 ? "article" : "articles"} in this collection`,
      to: `/blogs?category=${encodeURIComponent(category)}`,
      keywords: ["topic", "collection"],
    }));
  }, [indexedArticles]);

  const libraryCommand = useMemo(
    () => ({
      id: "library-saved",
      kind: "library",
      type: "Library",
      title: "Saved insights",
      description: bookmarks.length
        ? `${bookmarks.length} saved ${bookmarks.length === 1 ? "article" : "articles"}`
        : "Open your browser-local reading list.",
      to: "/blogs?saved=1",
      badge: bookmarks.length ? String(bookmarks.length) : "",
      keywords: ["saved", "bookmarks", "reading list"],
    }),
    [bookmarks.length]
  );

  const searchableCommands = useMemo(
    () => [
      ...PAGE_COMMANDS,
      libraryCommand,
      ...caseCommands,
      ...articleCommands,
      ...topicCommands,
    ],
    [articleCommands, caseCommands, libraryCommand, topicCommands]
  );

  const continueReading = useMemo(
    () =>
      articleCommands
        .filter((item) => item.progress > 0 && !item.isComplete)
        .sort((first, second) => (second.updatedAt || 0) - (first.updatedAt || 0))
        .slice(0, 3),
    [articleCommands]
  );

  const savedForLater = useMemo(() => {
    const continueIds = new Set(
      continueReading.map((item) => item.articleId)
    );

    return bookmarks
      .slice()
      .sort(
        (first, second) =>
          new Date(second.savedAt).getTime() -
          new Date(first.savedAt).getTime()
      )
      .flatMap((bookmark) => {
        const command = articleCommands.find(
          (item) => item.articleId === String(bookmark.articleId)
        );

        return command && !continueIds.has(command.articleId)
          ? [command]
          : [];
      })
      .slice(0, 2);
  }, [articleCommands, bookmarks, continueReading]);

  const normalizedQuery = normalizeText(query);
  const queryTerms = useMemo(
    () => normalizedQuery.split(" ").filter(Boolean),
    [normalizedQuery]
  );

  const groups = useMemo(() => {
    if (normalizedQuery) {
      const results = searchableCommands
        .map((item) => ({
          item,
          score: scoreCommand(item, normalizedQuery, queryTerms),
        }))
        .filter((result) => result.score >= 0)
        .sort(
          (first, second) =>
            second.score - first.score ||
            first.item.title.localeCompare(second.item.title)
        )
        .slice(0, 10)
        .map((result) => result.item);

      return [
        {
          id: "search-results",
          label: results.length
            ? `Results for "${query.trim()}"`
            : "No matching result",
          items: results,
        },
      ];
    }

    const defaultGroups = [
      {
        id: "quick-access",
        label: "Quick access",
        items: [
          ...PAGE_COMMANDS.filter((item) =>
            QUICK_COMMAND_IDS.has(item.id)
          ),
          ...(bookmarks.length ? [libraryCommand] : []),
        ],
      },
    ];

    if (continueReading.length) {
      defaultGroups.push({
        id: "continue-reading",
        label: "Continue reading",
        items: continueReading,
      });
    }

    if (savedForLater.length) {
      defaultGroups.push({
        id: "saved-for-later",
        label: "Saved for later",
        items: savedForLater,
      });
    }

    if (caseCommands.length) {
      defaultGroups.push({
        id: "selected-work",
        label: "Selected work",
        items: caseCommands.slice(0, 3),
      });
    }

    return defaultGroups;
  }, [
    bookmarks.length,
    caseCommands,
    continueReading,
    libraryCommand,
    normalizedQuery,
    query,
    queryTerms,
    savedForLater,
    searchableCommands,
  ]);

  const indexedGroups = useMemo(() => {
    let index = 0;

    return groups.map((group) => ({
      ...group,
      items: group.items.map((item) => ({
        ...item,
        optionIndex: index++,
      })),
    }));
  }, [groups]);

  const visibleItems = useMemo(
    () => indexedGroups.flatMap((group) => group.items),
    [indexedGroups]
  );
  const safeActiveIndex = visibleItems.length
    ? Math.min(activeIndex, visibleItems.length - 1)
    : -1;
  const activeItem =
    safeActiveIndex >= 0 ? visibleItems[safeActiveIndex] : null;
  const listboxId = `${paletteId}-results`;
  const getOptionId = (index) => `${paletteId}-option-${index}`;
  const isLoading =
    isArticlesPending || isCaseStudiesPending || isBookmarksPending;
  const hasError =
    isArticlesError || isCaseStudiesError || isBookmarksError;

  const moveActive = (direction) => {
    if (!visibleItems.length) return;

    setActiveIndex((current) => {
      const normalizedCurrent = Math.min(
        Math.max(current, 0),
        visibleItems.length - 1
      );
      const nextIndex =
        (normalizedCurrent + direction + visibleItems.length) %
        visibleItems.length;

      window.requestAnimationFrame(() => {
        document
          .getElementById(getOptionId(nextIndex))
          ?.scrollIntoView({ block: "nearest" });
      });

      return nextIndex;
    });
  };

  const activateCommand = (item) => {
    if (!item) return;

    onNavigate();
    navigate(item.to, {
      viewTransition: true,
      state: {
        scrollRequest: Date.now(),
      },
    });
  };

  const handleInputKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveActive(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveActive(-1);
    } else if (event.key === "Enter" && activeItem) {
      event.preventDefault();
      activateCommand(activeItem);
    }
  };

  useEffect(() => {
    const panel = panelRef.current;
    const backgroundElements = [
      document.querySelector(".site-header"),
      document.getElementById("main-content"),
      document.querySelector(".site-footer"),
    ].filter(Boolean);
    const previousStates = backgroundElements.map((element) => ({
      element,
      inert: element.inert,
      ariaHidden: element.getAttribute("aria-hidden"),
    }));

    inputRef.current?.focus({ preventScroll: true });
    document.documentElement.classList.add("has-command-palette");
    backgroundElements.forEach((element) => {
      element.inert = true;
      element.setAttribute("aria-hidden", "true");
    });

    const handleDocumentKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose({ restoreFocus: true });
        return;
      }

      if (event.key !== "Tab" || !panel) return;

      const focusable = Array.from(
        panel.querySelectorAll(
          "a[href], button:not([disabled]), input:not([disabled]), " +
          "select:not([disabled]), textarea:not([disabled]), " +
          "[tabindex]:not([tabindex='-1'])"
        )
      ).filter((element) => element.getClientRects().length);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!first || !last) return;

      if (!panel.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleDocumentKeyDown);

    return () => {
      document.removeEventListener("keydown", handleDocumentKeyDown);
      document.documentElement.classList.remove("has-command-palette");
      previousStates.forEach(({ element, inert, ariaHidden }) => {
        element.inert = inert;

        if (ariaHidden === null) {
          element.removeAttribute("aria-hidden");
        } else {
          element.setAttribute("aria-hidden", ariaHidden);
        }
      });
    };
  }, [onClose]);

  const retryUnavailableSources = () => {
    if (isArticlesError) refetchArticles();
    if (isCaseStudiesError) refetchCaseStudies();
    if (isBookmarksError) refetchBookmarks();
  };

  const palette = (
    <div
      className="command-palette"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose({ restoreFocus: true });
        }
      }}
    >
      <section
        aria-labelledby={`${paletteId}-title`}
        aria-modal="true"
        className="command-palette__panel"
        id="site-command-palette"
        ref={panelRef}
        role="dialog"
      >
        <h2 className="sr-only" id={`${paletteId}-title`}>
          Explore M-Agency
        </h2>

        <div className="command-palette__searchbar">
          <span className="command-palette__brand" aria-hidden="true">
            M
          </span>
          <label className="command-palette__search">
            <span className="sr-only">Search pages, work, and insights</span>
            <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
              <circle cx="10.8" cy="10.8" r="6.2" />
              <path d="m15.4 15.4 4.1 4.1" />
            </svg>
            <input
              aria-activedescendant={
                activeItem ? getOptionId(safeActiveIndex) : undefined
              }
              aria-autocomplete="list"
              aria-controls={listboxId}
              aria-expanded="true"
              autoComplete="off"
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={handleInputKeyDown}
              placeholder="Search work, insights, topics..."
              ref={inputRef}
              role="combobox"
              type="search"
              value={query}
            />
          </label>
          <button
            aria-label="Close search"
            className="command-palette__close"
            onClick={() => onClose({ restoreFocus: true })}
            type="button"
          >
            <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
              <path d="m7 7 10 10M17 7 7 17" />
            </svg>
          </button>
        </div>

        <div className="command-palette__meta">
          <p aria-live="polite" role="status">
            {isLoading ? "Loading local index. " : ""}
            {normalizedQuery
              ? `${visibleItems.length} ${visibleItems.length === 1 ? "result" : "results"}`
              : "Quick routes and browser-local reading activity"}
          </p>
          {isLoading && <span aria-hidden="true">Indexing...</span>}
        </div>

        <div
          aria-label="Search results"
          aria-busy={isLoading}
          className="command-palette__results"
          id={listboxId}
          role="listbox"
        >
          {visibleItems.length ? (
            indexedGroups.map((group) => (
              <section
                aria-labelledby={`${paletteId}-group-${group.id}`}
                className={`command-palette__group command-palette__group--${group.id}`}
                key={group.id}
                role="group"
              >
                <h3 id={`${paletteId}-group-${group.id}`}>
                  {group.label}
                </h3>
                <div className="command-palette__list">
                  {group.items.map((item) => {
                    const isActive = item.optionIndex === safeActiveIndex;

                    return (
                      <button
                        aria-selected={isActive}
                        className={
                          "command-palette__result" +
                          (isActive ? " is-active" : "") +
                          (item.visual
                            ? ` command-palette__result--${item.visual}`
                            : "")
                        }
                        id={getOptionId(item.optionIndex)}
                        key={item.id}
                        onClick={() => activateCommand(item)}
                        onMouseEnter={() => setActiveIndex(item.optionIndex)}
                        role="option"
                        tabIndex={-1}
                        type="button"
                      >
                        <span
                          className={`command-palette__result-mark command-palette__result-mark--${item.kind}`}
                        >
                          <CommandIcon kind={item.kind} />
                        </span>
                        <span className="command-palette__result-copy">
                          <strong>{item.title}</strong>
                          <small>{item.description}</small>
                        </span>
                        <span className="command-palette__result-side">
                          {item.badge && <small>{item.badge}</small>}
                          <span>{item.type}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))
          ) : (
            <div className="command-palette__empty">
              <span aria-hidden="true">
                <CommandIcon kind="page" />
              </span>
              <strong>No match for "{query.trim()}".</strong>
              <p>Try a project name, engineering topic, or page.</p>
              <button
                onClick={() => {
                  setQuery("");
                  setActiveIndex(0);
                  inputRef.current?.focus();
                }}
                type="button"
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        {hasError && (
          <div className="command-palette__notice" role="status">
            <span>Some browser-demo content is temporarily unavailable.</span>
            <button onClick={retryUnavailableSources} type="button">
              Retry
            </button>
          </div>
        )}

        <footer className="command-palette__footer">
          <span><kbd>Up</kbd><kbd>Down</kbd> Navigate</span>
          <span><kbd>Enter</kbd> Open</span>
          <span><kbd>Esc</kbd> Close</span>
        </footer>
      </section>
    </div>
  );

  return createPortal(palette, document.body);
};

export default CommandPalette;
