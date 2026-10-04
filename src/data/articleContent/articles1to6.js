export const articleContent1To6 = {
  1: {
    sections: [
      {
        id: "overview",
        label: "Overview",
        showTitle: false,
        blocks: [
          {
            type: "lead",
            text: "Large React applications become easier to reason about when state is classified before it is stored.",
          },
          {
            type: "paragraph",
            text: "The important decision is not which library wins. It is which part of the product owns a value, how long that value should live, and which events are allowed to change it. Clear boundaries reduce synchronization code and make each feature safer to evolve.",
          },
        ],
      },
      {
        id: "state-domains",
        label: "State domains",
        title: "Separate State by Responsibility",
        blocks: [
          {
            type: "paragraph",
            text: "Start by separating remote data from navigation, form drafts, and transient interface state. Each domain has different consistency rules. A request cache should understand freshness and retries, while an open menu usually needs only local component state.",
          },
          {
            type: "list",
            items: [
              "Keep server state in a request cache that owns loading, errors, freshness, and invalidation.",
              "Put shareable filters, sorting, and pagination in the URL.",
              "Keep unsaved form values close to the form and validate them at its boundary.",
              "Use a client store only for durable cross-feature state with several independent consumers.",
            ],
          },
        ],
      },
      {
        id: "ownership-contracts",
        label: "Ownership",
        title: "Give Every Value One Owner",
        blocks: [
          {
            type: "paragraph",
            text: "Duplicate writable copies are the main source of drift. Prefer one canonical value and derive presentation data from it. Expose a narrow feature API so consumers request an outcome instead of reaching into another feature's storage model.",
          },
          {
            type: "code",
            language: "typescript",
            code: "type CartState = { itemIds: string[] };\n\nexport function getCartCount(state: CartState) {\n  return state.itemIds.length;\n}\n\nexport function addItem(itemId: string) {\n  cartStore.update((state) => ({\n    ...state,\n    itemIds: [...state.itemIds, itemId],\n  }));\n}",
          },
        ],
      },
      {
        id: "incremental-migration",
        label: "Migration",
        title: "Move Boundaries Incrementally",
        blocks: [
          {
            type: "paragraph",
            text: "When an existing store contains everything, migrate one behavior at a time. Document current readers and writers, move the canonical value, adapt consumers behind a compatibility function, and remove the old path only after tests prove there is a single source of truth.",
          },
          {
            type: "quote",
            text: "A useful state boundary makes invalid transitions difficult, not merely inconvenient.",
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
            text: "Choose state tools after ownership, lifetime, and synchronization requirements are explicit. The result is less global state, fewer effects, and feature boundaries that remain understandable as the React application grows.",
          },
        ],
      },
    ],
  },
  2: {
    sections: [
      {
        id: "overview",
        label: "Overview",
        showTitle: false,
        blocks: [
          {
            type: "lead",
            text: "A background job is reliable when duplicate delivery, partial failure, and delayed execution are normal operating conditions.",
          },
          {
            type: "paragraph",
            text: "Node.js workers should be designed around explicit delivery semantics rather than optimistic success paths. The producer, queue, worker, and downstream service each need a clear contract so retries recover work without creating duplicate side effects.",
          },
        ],
      },
      {
        id: "delivery-contract",
        label: "Delivery contract",
        title: "Define the Job Lifecycle",
        blocks: [
          {
            type: "paragraph",
            text: "Treat a queued message as a durable request with identity, version, attempt count, and trace context. A worker should acknowledge it only after the intended outcome is durable. Failures must be classified so transient errors retry and permanent errors stop consuming capacity.",
          },
          {
            type: "list",
            items: [
              "Use exponential backoff with jitter for transient dependencies.",
              "Cap attempts and move exhausted jobs to a reviewable dead-letter queue.",
              "Set timeouts shorter than the queue visibility or lease duration.",
              "Version payloads so workers can handle deployments with mixed message formats.",
            ],
          },
        ],
      },
      {
        id: "idempotent-effects",
        label: "Idempotency",
        title: "Make Repeated Delivery Safe",
        blocks: [
          {
            type: "paragraph",
            text: "At-least-once delivery means the same job can run more than once. Use a stable idempotency key and record the completed operation in the same transactional boundary as the business change whenever possible. Process-local locks are insufficient because workers restart and scale horizontally.",
          },
          {
            type: "code",
            language: "typescript",
            code: "async function processJob(job: Job) {\n  return database.transaction(async (tx) => {\n    if (await tx.processedJobs.exists(job.id)) return;\n\n    await applyBusinessChange(tx, job.payload);\n    await tx.processedJobs.insert({ id: job.id });\n  });\n}",
          },
        ],
      },
      {
        id: "worker-operations",
        label: "Operations",
        title: "Operate Workers as a Service",
        blocks: [
          {
            type: "paragraph",
            text: "Monitor queue age, throughput, retry rate, terminal failures, and processing latency by job type. Graceful shutdown should stop new leases, finish bounded in-flight work, and release anything unfinished. During incidents, pause a failing job class without blocking unrelated work.",
          },
          {
            type: "quote",
            text: "Queue depth shows how much work exists; oldest-job age shows whether users are still waiting.",
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
            text: "Reliable Node.js jobs combine durable messages, idempotent effects, bounded retries, and actionable telemetry. Designing these properties before traffic grows is far cheaper than repairing duplicated work after a failure.",
          },
        ],
      },
    ],
  },
  3: {
    sections: [
      {
        id: "overview",
        label: "Overview",
        showTitle: false,
        blocks: [
          {
            type: "lead",
            text: "A performance budget turns speed from a late optimization request into an engineering constraint.",
          },
          {
            type: "paragraph",
            text: "Useful budgets connect technical limits to the experience of a specific page and device class. They define what is measured, where it is measured, and what happens when a proposed change exceeds the limit.",
          },
        ],
      },
      {
        id: "budget-model",
        label: "Budget model",
        title: "Budget the User Journey",
        blocks: [
          {
            type: "paragraph",
            text: "Begin with the routes that represent acquisition, search, and conversion. Set separate limits for initial transfer, main-thread work, visual stability, and interaction latency. A single site-wide bundle number can hide a slow critical route or penalize an intentionally rich secondary tool.",
          },
          {
            type: "list",
            items: [
              "Limit route-level JavaScript after compression and track third-party code separately.",
              "Define image bytes and dimensions for each responsive breakpoint.",
              "Set lab thresholds for regression detection and field thresholds for user impact.",
              "Choose a representative mobile device, network profile, and cache state.",
            ],
          },
        ],
      },
      {
        id: "continuous-enforcement",
        label: "Enforcement",
        title: "Enforce Budgets in Delivery",
        blocks: [
          {
            type: "paragraph",
            text: "Run repeatable checks in continuous integration and report the delta on each pull request. Fail only on stable signals with an agreed tolerance; noisy measurements should warn and collect evidence. Ownership matters more than dashboards, so each breached route needs a team that can act.",
          },
          {
            type: "code",
            language: "json",
            code: "{\n  \"route\": \"/checkout\",\n  \"javascriptKb\": 180,\n  \"largestContentfulPaintMs\": 2500,\n  \"cumulativeLayoutShift\": 0.1,\n  \"interactionToNextPaintMs\": 200\n}",
          },
        ],
      },
      {
        id: "field-feedback",
        label: "Field feedback",
        title: "Compare Lab and Real-User Data",
        blocks: [
          {
            type: "paragraph",
            text: "Lab tests make regressions reproducible, while real-user monitoring reveals slow devices, geographic variance, and long-tail interactions. Segment field data by route and release, then use percentiles and sample size before attributing a change to one deployment.",
          },
          {
            type: "quote",
            text: "A budget is effective only when exceeding it changes a delivery decision.",
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
            text: "Keep performance budgets small, route-specific, and visible in the pull request workflow. Review them as the product changes, but require evidence before trading away the responsiveness users already have.",
          },
        ],
      },
    ],
  },
  4: {
    sections: [
      {
        id: "overview",
        label: "Overview",
        showTitle: false,
        blocks: [
          {
            type: "lead",
            text: "Container health cannot be understood from CPU and memory charts alone.",
          },
          {
            type: "paragraph",
            text: "A useful observability strategy connects user-facing symptoms to requests, container lifecycle events, deployments, and dependencies. Resource metrics remain valuable, but they become diagnostic evidence only when they share context with logs and traces.",
          },
        ],
      },
      {
        id: "service-signals",
        label: "Service signals",
        title: "Start with Service Behavior",
        blocks: [
          {
            type: "paragraph",
            text: "Measure whether the service is accepting and completing useful work before inspecting a pod. Request rate, errors, duration, and saturation should be segmented by service operation rather than raw container identity, because containers are short-lived implementation details.",
          },
          {
            type: "list",
            items: [
              "Track restarts, termination reasons, throttling, and out-of-memory events.",
              "Measure queue delay, connection-pool pressure, and dependency latency.",
              "Attach workload, cluster, region, version, and deployment identifiers.",
              "Control label cardinality so telemetry remains affordable and queryable.",
            ],
          },
        ],
      },
      {
        id: "correlation-context",
        label: "Correlation",
        title: "Carry Context Across Signals",
        blocks: [
          {
            type: "paragraph",
            text: "Propagate trace context through ingress, services, queues, and outbound calls. Include trace identifiers and normalized service metadata in structured logs. Deployment annotations then let an operator move from a latency alert to the affected release and its representative traces.",
          },
          {
            type: "code",
            language: "yaml",
            code: "resource:\n  service.name: payments-api\n  service.version: 2026.05.16\n  deployment.environment: production\n  cloud.region: eu-central\nattributes:\n  trace_id: 4f12b8\n  container.restart_count: 2",
          },
        ],
      },
      {
        id: "actionable-detection",
        label: "Detection",
        title: "Alert on Impact, Diagnose with Detail",
        blocks: [
          {
            type: "paragraph",
            text: "Page on sustained user impact or exhaustion of a real capacity limit. Use dashboards, logs, and high-cardinality traces for investigation rather than turning every internal anomaly into an alert. Each page should identify the affected service, scope, and first diagnostic view.",
          },
          {
            type: "quote",
            text: "Metrics reveal the shape of a failure; correlated context explains which change and request produced it.",
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
            text: "Observe containers through the services they run and the user outcomes those services support. Consistent metadata, trace propagation, deployment context, and impact-based alerts create a system that helps engineers decide what to do next.",
          },
        ],
      },
    ],
  },
  5: {
    sections: [
      {
        id: "overview",
        label: "Overview",
        showTitle: false,
        blocks: [
          {
            type: "lead",
            text: "React Server Component tests stay durable when they validate boundaries and rendered behavior instead of framework internals.",
          },
          {
            type: "paragraph",
            text: "Server Components combine asynchronous rendering, data access, and serialization constraints. Tests should provide confidence at the smallest stable boundary while leaving React and the application framework free to change their internal execution details.",
          },
        ],
      },
      {
        id: "test-boundaries",
        label: "Boundaries",
        title: "Choose the Smallest Useful Boundary",
        blocks: [
          {
            type: "paragraph",
            text: "Keep domain rules in plain functions and test them directly. Test data adapters against their public contract, then render a route or server component with controlled dependencies to verify visible output. Reserve end-to-end tests for navigation, streaming, caching, and client hydration.",
          },
          {
            type: "list",
            items: [
              "Unit-test pure transformation and authorization rules without React.",
              "Contract-test data adapters using representative success and failure responses.",
              "Render server output to assert headings, links, and accessible states.",
              "Use browser tests for transitions between server and client components.",
            ],
          },
        ],
      },
      {
        id: "dependency-control",
        label: "Test harness",
        title: "Control Dependencies Explicitly",
        blocks: [
          {
            type: "paragraph",
            text: "Inject a small repository or service interface instead of mocking global fetch behavior in every test. The test then describes the scenario with stable domain data, and production code remains responsible for transport, caching, and authentication integration.",
          },
          {
            type: "code",
            language: "typescript",
            code: "const products = {\n  findFeatured: async () => [{ id: \"p1\", name: \"Desk lamp\" }],\n};\n\nconst view = await FeaturedProducts({ products });\nrender(view);\n\nexpect(screen.getByRole(\"heading\", { name: \"Desk lamp\" })).toBeVisible();",
          },
        ],
      },
      {
        id: "behavior-assertions",
        label: "Assertions",
        title: "Assert Outcomes, Not Flight Details",
        blocks: [
          {
            type: "paragraph",
            text: "Prefer accessible queries and domain-visible states over serialized payload snapshots, function call order, or framework cache keys. Include empty, unauthorized, rejected, and delayed cases. A focused integration test can verify that an error boundary appears without reproducing the rendering protocol.",
          },
          {
            type: "quote",
            text: "Mock the boundary your application owns, not the machinery the framework owns.",
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
            text: "Build a testing pyramid around pure domain logic, explicit data contracts, rendered server behavior, and a small number of browser journeys. That balance catches meaningful regressions without coupling the suite to React Server Component internals.",
          },
        ],
      },
    ],
  },
  6: {
    sections: [
      {
        id: "overview",
        label: "Overview",
        showTitle: false,
        blocks: [
          {
            type: "lead",
            text: "An incident review is valuable when it changes the system that made failure likely.",
          },
          {
            type: "paragraph",
            text: "The document should explain what happened, how users and operators experienced it, why safeguards did not contain it, and which improvements will reduce future risk. Its purpose is organizational learning, not a polished defense of individual decisions.",
          },
        ],
      },
      {
        id: "evidence-timeline",
        label: "Timeline",
        title: "Build a Shared Factual Record",
        blocks: [
          {
            type: "paragraph",
            text: "Create the timeline from alerts, deployments, logs, support reports, and incident-channel decisions. Use one time zone and distinguish verified facts from hypotheses. Include detection, escalation, mitigation, recovery, and validation so operational delays are visible.",
          },
          {
            type: "list",
            items: [
              "State user impact with duration and affected capabilities.",
              "Record what responders knew at each decision point.",
              "Explain which signals were missing, late, or misleading.",
              "Capture successful safeguards as well as failed defenses.",
            ],
          },
        ],
      },
      {
        id: "systemic-analysis",
        label: "Analysis",
        title: "Explain Conditions, Not Culprits",
        blocks: [
          {
            type: "paragraph",
            text: "Move beyond a single root cause. Examine technical faults, change controls, workload, documentation, ownership, and incentives that combined to produce the outcome. Ask why the action made sense with the information available and where the system relied on perfect human execution.",
          },
          {
            type: "quote",
            text: "Blameless analysis is rigorous about decisions while refusing to treat punishment as a reliability control.",
          },
        ],
      },
      {
        id: "durable-actions",
        label: "Follow-through",
        title: "Turn Findings into Durable Work",
        blocks: [
          {
            type: "paragraph",
            text: "Prefer actions that improve detection, reduce blast radius, remove unsafe defaults, or automate recovery. Every action needs an owner, priority, due date, and verifiable completion condition. Track the work with normal planning systems and review overdue risk explicitly.",
          },
          {
            type: "paragraph",
            text: "Close the loop by sharing completed changes with responders and affected teams. Periodically group reviews by recurring contributing factors; repeated manual fixes often indicate a platform, process, or ownership problem that one incident cannot solve.",
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
            text: "A strong incident review combines an evidence-based narrative, systemic analysis, and owned improvements. When teams can examine failure without fear and still demand precise follow-through, incidents become inputs to better engineering rather than recurring surprises.",
          },
        ],
      },
    ],
  },
};
