import { apiRequest } from "./client";

export const submitContact = (form, signal) =>
  apiRequest("/api/contact", {
    method: "POST",
    body: JSON.stringify(form),
    signal,
  });

export const subscribeToNewsletter = (email, signal) =>
  apiRequest("/api/newsletter", {
    method: "POST",
    body: JSON.stringify({ email }),
    signal,
  });
