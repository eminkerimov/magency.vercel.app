import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { queryClient } from "./api/queryClient";
import { articleQueryKeys } from "./features/articles/queries";
import {
  BOOKMARKS_STORAGE_KEY,
  bookmarkQueryKeys,
} from "./features/bookmarks/queries";
import {
  COMMENTS_STORAGE_KEY,
  commentQueryKeys,
} from "./features/comments/queries";
import {
  HELPFULNESS_STORAGE_KEY,
  helpfulnessQueryKeys,
} from "./features/helpfulness/queries";
import "./assets/scss/style.scss";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

window.addEventListener("storage", (event) => {
  if (event.key === BOOKMARKS_STORAGE_KEY || event.key === null) {
    queryClient.invalidateQueries({ queryKey: bookmarkQueryKeys.all });
  }

  if (event.key === COMMENTS_STORAGE_KEY || event.key === null) {
    queryClient.invalidateQueries({ queryKey: commentQueryKeys.all });
    queryClient.invalidateQueries({ queryKey: articleQueryKeys.all });
    queryClient.invalidateQueries({ queryKey: bookmarkQueryKeys.all });
  }

  if (event.key === HELPFULNESS_STORAGE_KEY || event.key === null) {
    queryClient.invalidateQueries({
      queryKey: helpfulnessQueryKeys.all,
    });
  }
});

const renderApp = () => {
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </React.StrictMode>
  );
};

root.render(
  <div className="app-bootstrap" role="status" aria-live="polite" aria-busy="true">
    <span className="app-bootstrap__mark" aria-hidden="true">M</span>
    <div>
      <strong>Preparing M-Agency</strong>
      <span>Loading the product experience...</span>
    </div>
  </div>
);

const enableMockApi = async () => {
  const apiMode = import.meta.env.VITE_API_MODE || "mock";

  if (apiMode !== "mock") {
    return;
  }

  const { worker } = await import("./mocks/browser");

  await worker.start({
    onUnhandledRequest: "bypass",
    quiet: true,
    serviceWorker: {
      url: "/mockServiceWorker.js",
    },
  });
};

enableMockApi()
  .catch((error) => {
    console.error("Mock API initialization failed.", error);
  })
  .finally(renderApp);
