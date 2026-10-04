import { apiRequest } from "./client";

export const getCaseStudies = (signal) =>
  apiRequest("/api/case-studies", {
    method: "GET",
    signal,
  });
