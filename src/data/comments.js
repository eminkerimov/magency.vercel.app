export const recentCommentsByArticleId = {
  1: [
    {
      id: "seed-comment-1-1",
      articleId: 1,
      author: "Maya Chen",
      body: "The separation between URL state and server state is the part teams skip most often. Shareable filters remove a surprising amount of synchronization code.",
      createdAt: "2026-06-10T09:24:00.000Z",
      viewerOwned: false,
    },
  ],
  2: [
    {
      id: "seed-comment-2-1",
      articleId: 2,
      author: "Nina Patel",
      body: "Persisting an idempotency key with the job result was more reliable for us than trying to infer duplicate work later.",
      createdAt: "2026-06-03T11:16:00.000Z",
      viewerOwned: false,
    },
  ],
  3: [
    {
      id: "seed-comment-3-1",
      articleId: 3,
      author: "Elena Rossi",
      body: "Performance budgets became easier to defend once each threshold was connected to a user-visible interaction.",
      createdAt: "2026-05-28T08:48:00.000Z",
      viewerOwned: false,
    },
  ],
  4: [
    {
      id: "seed-comment-4-1",
      articleId: 4,
      author: "Sam Rivera",
      body: "Release markers on the same timeline as latency and error rate often shorten an investigation immediately.",
      createdAt: "2026-05-21T10:12:00.000Z",
      viewerOwned: false,
    },
  ],
  5: [
    {
      id: "seed-comment-5-1",
      articleId: 5,
      author: "Theo Grant",
      body: "Testing the serialized result instead of framework internals kept our suite stable through several React upgrades.",
      createdAt: "2026-05-14T12:03:00.000Z",
      viewerOwned: false,
    },
  ],
  6: [
    {
      id: "seed-comment-6-1",
      articleId: 6,
      author: "Daniel Brooks",
      body: "Separating contributing conditions from individual actions changed the tone and quality of our incident reviews.",
      createdAt: "2026-05-07T14:18:00.000Z",
      viewerOwned: false,
    },
  ],
  7: [
    {
      id: "seed-comment-7-1",
      articleId: 7,
      author: "Victor Chen",
      body: "Keeping the runtime schema beside the inferred TypeScript type eliminated an entire category of API drift.",
      createdAt: "2026-04-30T07:56:00.000Z",
      viewerOwned: false,
    },
  ],
  8: [
    {
      id: "seed-comment-8-1",
      articleId: 8,
      author: "Noah Williams",
      body: "A boring pipeline everyone understands has been more valuable than a sophisticated one only one person can repair.",
      createdAt: "2026-04-23T10:44:00.000Z",
      viewerOwned: false,
    },
  ],
  9: [
    {
      id: "seed-comment-9-1",
      articleId: 9,
      author: "Hugo Martin",
      body: "Comparing estimated and actual rows has pointed us to stale statistics more often than missing indexes.",
      createdAt: "2026-04-16T09:11:00.000Z",
      viewerOwned: false,
    },
  ],
  10: [
    {
      id: "seed-comment-10-1",
      articleId: 10,
      author: "Iris Walker",
      body: "We now treat schema changes as a sequence of compatible releases rather than one migration event.",
      createdAt: "2026-04-09T11:28:00.000Z",
      viewerOwned: false,
    },
  ],
  11: [
    {
      id: "seed-comment-11-1",
      articleId: 11,
      author: "Clara Evans",
      body: "Cascade layers gave our design system an escape hatch without turning every component rule into a specificity contest.",
      createdAt: "2026-04-02T08:35:00.000Z",
      viewerOwned: false,
    },
  ],
  12: [
    {
      id: "seed-comment-12-1",
      articleId: 12,
      author: "Sofia Turner",
      body: "Improving the decision process instead of simply providing answers is the clearest description of this transition.",
      createdAt: "2026-03-26T10:51:00.000Z",
      viewerOwned: false,
    },
  ],
};

export const getRecentComments = (articleId) =>
  (recentCommentsByArticleId[Number(articleId)] || []).map((comment) => ({
    ...comment,
  }));
