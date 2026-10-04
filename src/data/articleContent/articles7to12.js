export const articleContent7To12 = {
  7: {
    sections: [
      {
        id: "overview",
        label: "Overview",
        showTitle: false,
        blocks: [
          {
            type: "lead",
            text: "A type-safe API is a chain of explicit contracts, not a collection of TypeScript interfaces around untrusted data.",
          },
          {
            type: "paragraph",
            text: "TypeScript protects code during development, but its types disappear at runtime. A reliable Node.js API validates input at the transport boundary, converts it into domain values, and returns a response whose public shape is deliberate and stable.",
          },
        ],
      },
      {
        id: "contract-boundaries",
        label: "Contract Boundaries",
        title: "Define Contracts at the Boundaries",
        blocks: [
          {
            type: "paragraph",
            text: "Keep transport schemas, domain models, persistence records, and response DTOs separate. They may look similar initially, but each changes for a different reason. Mapping between them prevents a database rename or nullable column from silently becoming an API change.",
          },
          {
            type: "list",
            items: [
              "Validate path parameters, query values, headers, and request bodies before business logic runs.",
              "Represent domain invariants with constructors or parsing functions instead of unchecked casts.",
              "Map domain results into explicit response DTOs rather than serializing database rows.",
              "Generate documentation from the runtime contract when the schema library supports it.",
            ],
          },
        ],
      },
      {
        id: "runtime-validation",
        label: "Runtime Validation",
        title: "Parse Once, Then Trust the Result",
        blocks: [
          {
            type: "paragraph",
            text: "A route should turn unknown input into a typed value exactly once. The service layer then receives valid data and stays independent of HTTP details. Return validation failures in one consistent error envelope so every client can handle them predictably.",
          },
          {
            type: "code",
            language: "typescript",
            code: `const createUserSchema = z.object({
  email: z.string().email(),
  displayName: z.string().trim().min(2).max(60),
});

const input = createUserSchema.parse(request.body);
const user = await users.create(input);

return reply.code(201).send(toUserResponse(user));`,
          },
        ],
      },
      {
        id: "typed-errors",
        label: "Typed Errors",
        title: "Make Failures Part of the Contract",
        blocks: [
          {
            type: "paragraph",
            text: "Model expected failures such as conflicts, missing resources, and authorization denials as a small discriminated set. Translate that set to HTTP in one adapter. Unexpected exceptions should remain unexpected: log them with a request identifier and return a generic server error without leaking internals.",
          },
          {
            type: "quote",
            text: "A predictable error contract is as important to a client as a successful response shape.",
          },
        ],
      },
      {
        id: "conclusion",
        label: "Conclusion",
        title: "Conclusion",
        blocks: [
          {
            type: "paragraph",
            text: "Type safety becomes dependable when runtime validation, domain invariants, persistence mapping, and response contracts reinforce one another. Start at the boundaries, remove unchecked assertions, and test successful and failed contracts as public behavior.",
          },
        ],
      },
    ],
  },
  8: {
    sections: [
      {
        id: "overview",
        label: "Overview",
        showTitle: false,
        blocks: [
          {
            type: "lead",
            text: "A small team needs a delivery pipeline that is boring to operate, quick to diagnose, and strict about the few checks that protect production.",
          },
          {
            type: "paragraph",
            text: "The goal is not to reproduce a large platform team's tooling. It is to create one visible path from commit to deployment, automate repeatable decisions, and keep recovery simple enough that any engineer can use it under pressure.",
          },
        ],
      },
      {
        id: "pipeline-baseline",
        label: "Pipeline Baseline",
        title: "Build the Smallest Reliable Pipeline",
        blocks: [
          {
            type: "paragraph",
            text: "Begin with a single workflow that installs from a lockfile, checks formatting and types, runs tests, and creates one immutable artifact. Promote that same artifact between environments so release confidence does not depend on rebuilding different code later.",
          },
          {
            type: "list",
            items: [
              "Fail fast on dependency, type, and unit-test errors.",
              "Run slower integration checks after the fast feedback stage.",
              "Attach the commit identifier and build metadata to every artifact.",
              "Cancel superseded runs for the same branch to protect queue time.",
            ],
          },
        ],
      },
      {
        id: "release-safety",
        label: "Release Safety",
        title: "Add Guardrails Around Deployment",
        blocks: [
          {
            type: "paragraph",
            text: "Protect production with an explicit environment, narrow credentials, a concurrency lock, and a post-deploy health check. A deployment should either finish with evidence that the service is healthy or provide a documented path to restore the previous artifact.",
          },
          {
            type: "code",
            language: "yaml",
            code: `deploy:
  needs: verify
  environment: production
  concurrency:
    group: production
    cancel-in-progress: false
  steps:
    - run: ./scripts/deploy.sh $ARTIFACT_ID
    - run: ./scripts/check-health.sh`,
          },
        ],
      },
      {
        id: "feedback-ownership",
        label: "Feedback and Ownership",
        title: "Keep Failures Easy to Understand",
        blocks: [
          {
            type: "paragraph",
            text: "Every failed run should identify the failing stage, preserve useful logs, and link to the deployed revision. Keep workflow logic close to the repository and assign ownership for flaky tests, expired secrets, and slow stages instead of allowing pipeline debt to become normal.",
          },
          {
            type: "quote",
            text: "Pipeline speed matters, but predictable recovery is what makes frequent delivery sustainable.",
          },
        ],
      },
      {
        id: "conclusion",
        label: "Conclusion",
        title: "Conclusion",
        blocks: [
          {
            type: "paragraph",
            text: "For a small team, strong CI/CD means one understandable workflow, immutable artifacts, focused deployment controls, and rehearsed recovery. Add complexity only when a measured constraint justifies the operational cost.",
          },
        ],
      },
    ],
  },
  9: {
    sections: [
      {
        id: "overview",
        label: "Overview",
        showTitle: false,
        blocks: [
          {
            type: "lead",
            text: "PostgreSQL query tuning starts with evidence from the real workload, then narrows the problem through plans, statistics, and controlled changes.",
          },
          {
            type: "paragraph",
            text: "A slow query is often a symptom of interacting choices: data distribution, access patterns, stale estimates, locking, memory, or an index that does not match the predicate. Tuning is safer when each change follows a baseline and is verified with representative parameters.",
          },
        ],
      },
      {
        id: "measure-first",
        label: "Measure First",
        title: "Capture the Query in Context",
        blocks: [
          {
            type: "paragraph",
            text: "Collect the normalized statement, latency distribution, call rate, rows returned, and the parameter shapes that produce poor behavior. Check whether time is spent executing, waiting on locks, reading storage, or transferring an unnecessarily large result before changing SQL.",
          },
          {
            type: "list",
            items: [
              "Confirm the database, schema, and query version being measured.",
              "Compare typical and worst-case parameter values.",
              "Inspect lock waits, temporary files, and buffer activity.",
              "Record a baseline that can be repeated after every change.",
            ],
          },
        ],
      },
      {
        id: "plan-reading",
        label: "Plan Reading",
        title: "Read Estimates Beside Actual Work",
        blocks: [
          {
            type: "paragraph",
            text: "Use an execution plan to find the first large mismatch between estimated and actual rows, not merely the node with the largest displayed cost. Loops, rows removed by filters, heap fetches, spills, and buffer reads often explain why an apparently reasonable plan performs poorly.",
          },
          {
            type: "code",
            language: "sql",
            code: `EXPLAIN (ANALYZE, BUFFERS, WAL, SETTINGS)
SELECT id, created_at, total
FROM orders
WHERE account_id = $1
  AND status = $2
ORDER BY created_at DESC
LIMIT 50;`,
          },
        ],
      },
      {
        id: "index-validation",
        label: "Index Validation",
        title: "Design and Verify the Fix",
        blocks: [
          {
            type: "paragraph",
            text: "Match index columns to equality filters, range conditions, and ordering instead of indexing every referenced field independently. Consider partial or covering indexes only when the workload supports them, then measure write overhead and index size alongside read latency. Refresh statistics when estimates are stale and rewrite queries that fetch more data than callers need.",
          },
          {
            type: "quote",
            text: "An index is a workload tradeoff, not a universal certificate of query speed.",
          },
        ],
      },
      {
        id: "conclusion",
        label: "Conclusion",
        title: "Conclusion",
        blocks: [
          {
            type: "paragraph",
            text: "Treat query tuning as a repeatable diagnostic loop: measure, inspect the actual plan, change one relevant constraint, and compare the result. The best fix improves the target workload without hiding a new cost in writes, storage, or neighboring queries.",
          },
        ],
      },
    ],
  },
  10: {
    sections: [
      {
        id: "overview",
        label: "Overview",
        showTitle: false,
        blocks: [
          {
            type: "lead",
            text: "A zero-downtime migration is a compatibility sequence in which old and new application versions can safely share the database.",
          },
          {
            type: "paragraph",
            text: "Schema changes and application deployments do not become active everywhere at the same instant. The safe approach is to expand the schema, move data and traffic while observing both paths, and remove the old contract only after every dependent process has crossed the compatibility window.",
          },
        ],
      },
      {
        id: "compatibility-window",
        label: "Compatibility Window",
        title: "Plan for Mixed Application Versions",
        blocks: [
          {
            type: "paragraph",
            text: "List every reader and writer, including workers, scheduled jobs, analytics exports, and rollback versions. A migration is ready only when each step has a forward action, a verification signal, and a recovery choice that does not require an immediate destructive reversal.",
          },
          {
            type: "list",
            items: [
              "Expand with additive, nullable, or otherwise backward-compatible schema changes.",
              "Deploy code that can read both shapes and writes data needed by the new path.",
              "Backfill in bounded batches with progress and failure visibility.",
              "Switch reads, verify behavior, and contract only after the rollback window closes.",
            ],
          },
        ],
      },
      {
        id: "backfill-observe",
        label: "Backfill and Observe",
        title: "Move Data Without Surprising Production",
        blocks: [
          {
            type: "paragraph",
            text: "Throttle backfills by database pressure rather than by a fixed optimistic rate. Use stable key ranges, short transactions, retryable batches, and a stored checkpoint. Compare old and new representations continuously so completion means correctness, not merely that a job reached the last row.",
          },
          {
            type: "code",
            language: "sql",
            code: `SELECT count(*) AS rows_remaining
FROM customers
WHERE display_name IS NULL
  AND legacy_name IS NOT NULL;

SELECT id
FROM customers
WHERE display_name IS DISTINCT FROM legacy_name
ORDER BY id
LIMIT 100;`,
          },
        ],
      },
      {
        id: "contract-cleanup",
        label: "Contract Cleanup",
        title: "Remove the Old Path Deliberately",
        blocks: [
          {
            type: "paragraph",
            text: "Before dropping a column or constraint, prove that no supported release reads or writes it and that rollback no longer depends on it. Schedule destructive changes separately, inspect lock behavior on production-like volume, and keep cleanup observable instead of treating it as harmless housekeeping.",
          },
          {
            type: "quote",
            text: "The safest destructive migration is the final step of a compatibility plan, never the first.",
          },
        ],
      },
      {
        id: "conclusion",
        label: "Conclusion",
        title: "Conclusion",
        blocks: [
          {
            type: "paragraph",
            text: "Downtime is avoided by sequencing change, not by compressing it into one deployment. Expand, backfill, switch, verify, and contract with explicit compatibility and observability at every boundary.",
          },
        ],
      },
    ],
  },
  11: {
    sections: [
      {
        id: "overview",
        label: "Overview",
        showTitle: false,
        blocks: [
          {
            type: "lead",
            text: "Modern CSS architecture should make the cascade predictable while preserving the language's strengths instead of replacing every design decision with a utility class.",
          },
          {
            type: "paragraph",
            text: "A maintainable system gives tokens, foundations, components, and intentional overrides clear ownership. Teams can then change visual rules at the right level, understand why a declaration wins, and avoid copying long class recipes across the interface.",
          },
        ],
      },
      {
        id: "cascade-foundation",
        label: "Cascade Foundation",
        title: "Order the Cascade Explicitly",
        blocks: [
          {
            type: "paragraph",
            text: "Use cascade layers to state precedence once, then keep selectors shallow inside each layer. Design tokens express shared decisions, while semantic HTML and low-specificity defaults provide a stable base that components can extend without defensive selector escalation.",
          },
          {
            type: "code",
            language: "css",
            code: `@layer reset, tokens, base, components, utilities;

@layer tokens {
  :root {
    --color-accent: oklch(62% 0.18 255);
    --space-control: 0.75rem;
  }
}

@layer components {
  .button { padding: var(--space-control) 1rem; }
}`,
          },
        ],
      },
      {
        id: "component-ownership",
        label: "Component Ownership",
        title: "Let Components Own Their Internal Layout",
        blocks: [
          {
            type: "paragraph",
            text: "A component should own its variants, states, and internal spacing; its parent should own placement in the surrounding layout. Prefer data attributes, native state selectors, container queries, and documented custom properties over selectors that reach through several component boundaries.",
          },
          {
            type: "list",
            items: [
              "Keep tokens global only when they represent a shared design decision.",
              "Co-locate component styles with the component that defines their contract.",
              "Expose a small set of variants instead of arbitrary styling escape hatches.",
              "Test focus, disabled, error, loading, and forced-color states as first-class behavior.",
            ],
          },
        ],
      },
      {
        id: "utilities-with-limits",
        label: "Utilities with Limits",
        title: "Use Utilities for Composition, Not Every Detail",
        blocks: [
          {
            type: "paragraph",
            text: "Utilities work well for recurring composition primitives such as stack, cluster, grid, and visually hidden content. Keep the set small and token-driven. When a pattern has a name, variants, and state, promote it to a component rather than repeating a fragile sequence of utilities at every call site.",
          },
          {
            type: "quote",
            text: "The right abstraction is the one that makes the next design change local and understandable.",
          },
        ],
      },
      {
        id: "conclusion",
        label: "Conclusion",
        title: "Conclusion",
        blocks: [
          {
            type: "paragraph",
            text: "A durable CSS architecture combines explicit cascade layers, meaningful tokens, component ownership, and a restrained utility vocabulary. It reduces accidental coupling without forcing every styling decision into markup.",
          },
        ],
      },
    ],
  },
  12: {
    sections: [
      {
        id: "overview",
        label: "Overview",
        showTitle: false,
        blocks: [
          {
            type: "lead",
            text: "Moving from senior engineer to technical lead is a shift from maximizing personal output to improving the quality and reach of a team's decisions.",
          },
          {
            type: "paragraph",
            text: "The role still requires technical judgment, but its highest leverage comes from clarifying direction, exposing tradeoffs, creating ownership, and helping others deliver independently. Leadership is visible in the system around the work, not in being the person who touches every critical change.",
          },
        ],
      },
      {
        id: "operating-scope",
        label: "Operating Scope",
        title: "Expand the Unit of Responsibility",
        blocks: [
          {
            type: "paragraph",
            text: "A senior engineer can own a difficult implementation. A technical lead also owns whether the problem is framed correctly, dependencies are visible, risk is reduced early, and the team can maintain the result. This means spending time on context and coordination before code becomes expensive to change.",
          },
          {
            type: "list",
            items: [
              "Turn broad goals into explicit technical outcomes and constraints.",
              "Identify decisions that need input, ownership, or an escalation date.",
              "Split work so multiple engineers can move without hidden dependencies.",
              "Protect time for maintenance, operability, and follow-through after launch.",
            ],
          },
        ],
      },
      {
        id: "decision-alignment",
        label: "Decision Alignment",
        title: "Make Decisions Legible",
        blocks: [
          {
            type: "paragraph",
            text: "Write down the problem, constraints, considered options, chosen direction, and conditions that would change the decision. Invite disagreement while the choice is still reversible, then communicate the outcome in the language each stakeholder needs. Clear records reduce repeated debate without pretending uncertainty has disappeared.",
          },
          {
            type: "quote",
            text: "Technical leadership creates clarity early enough for the whole team to act on it.",
          },
        ],
      },
      {
        id: "leverage-feedback",
        label: "Leverage and Feedback",
        title: "Grow Capability Instead of Dependency",
        blocks: [
          {
            type: "paragraph",
            text: "Delegate outcomes with context, boundaries, and decision rights rather than handing out isolated tasks. Review important reasoning as well as code, give specific feedback close to the event, and create opportunities for others to lead design or delivery. Track whether work flows without you; constant rescue is a signal to improve the system, not proof of value.",
          },
          {
            type: "paragraph",
            text: "Maintain enough hands-on depth to test assumptions and unblock hard problems, but avoid becoming the approval queue for routine choices. The aim is a team that makes sound decisions faster because your leadership is present, even when you are not in the room.",
          },
        ],
      },
      {
        id: "conclusion",
        label: "Conclusion",
        title: "Conclusion",
        blocks: [
          {
            type: "paragraph",
            text: "The transition to technical lead is measured by broader outcomes: clearer decisions, distributed ownership, lower coordination risk, and stronger engineers. Keep technical credibility, but apply it through direction, communication, and leverage rather than personal control.",
          },
        ],
      },
    ],
  },
};
