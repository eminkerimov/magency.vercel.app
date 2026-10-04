export const engagements = [
  {
    id: "product-audit",
    type: "Focused review",
    title: "Product Audit",
    bestFor: "Existing web products that need a clear, evidence-based next step.",
    outcome:
      "A prioritized improvement plan grounded in the current product and codebase.",
    format: "1–2 weeks · kickoff, async review, findings session",
    features: [
      "Product and interface review",
      "Frontend architecture assessment",
      "Accessibility and performance checks",
      "Actionable, prioritized recommendations",
    ],
    cta: "Request a product audit",
  },
  {
    id: "focused-build",
    type: "Milestone delivery",
    title: "Focused Build",
    badge: "Core engagement",
    bestFor:
      "A defined feature, workflow, dashboard, or frontend modernization milestone.",
    outcome: "A tested, documented product increment prepared for release.",
    format: "Typically 3–6 weeks · weekly working demos",
    features: [
      "Focused scope and technical plan",
      "UI engineering and API integration",
      "Responsive and accessibility QA",
      "Release handoff and documentation",
    ],
    cta: "Discuss a focused build",
  },
  {
    id: "ongoing-support",
    type: "Flexible partnership",
    title: "Ongoing Product Support",
    bestFor:
      "Teams that need senior frontend support after launch or across an active roadmap.",
    outcome: "Steady improvements with visible priorities and regular review points.",
    format: "Monthly engagement · weekly planning and review",
    features: [
      "Feature and interface improvements",
      "Design-system maintenance",
      "Performance and accessibility follow-up",
      "Technical guidance and code reviews",
    ],
    cta: "Plan ongoing support",
  },
];

export const getEngagement = (engagementId) =>
  engagements.find((engagement) => engagement.id === engagementId);
