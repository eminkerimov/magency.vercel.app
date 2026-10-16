export const services = [
  {
    id: "product-frontend",
    name: "Product & Frontend",
    icon: "frontend",
    scope: "Interface systems",
    desc: "Accessible, high-performance product interfaces shaped around real user and business goals",
    deliverables: ["Design systems", "Complex workflows", "Accessibility & performance"],
    engagement: "focused-build",
  },
  {
    id: "backend-apis",
    name: "Backend & APIs",
    icon: "backend",
    scope: "Connected products",
    desc: "Reliable APIs, data flows, and integrations designed to grow with the product",
    deliverables: ["API contracts", "Data integration", "Resilient async states"],
    engagement: "focused-build",
  },
  {
    id: "cloud-devops",
    name: "Cloud & DevOps",
    icon: "cloud",
    scope: "Delivery foundations",
    desc: "Practical cloud infrastructure, automated delivery, and observability for dependable releases",
    deliverables: ["CI/CD pipelines", "Release confidence", "Observability"],
    engagement: "ongoing-support",
  },
  {
    id: "technical-strategy",
    name: "Technical Strategy",
    icon: "strategy",
    scope: "Clear decisions",
    desc: "Clear technical direction, architecture reviews, and focused plans for complex product decisions",
    deliverables: ["Architecture reviews", "Migration plans", "Technical roadmaps"],
    engagement: "product-audit",
  },
];

export const getService = (serviceId) =>
  services.find((service) => service.id === serviceId);
