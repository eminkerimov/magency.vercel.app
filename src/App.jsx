import { lazy, Suspense, useEffect, useRef } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLocation,
  useParams,
} from "react-router-dom";

import ContentState from "./components/ContentState";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MotionEffects from "./components/MotionEffects";
import NotFound from "./components/NotFound";

import Home from "./pages/Home";

const Blog = lazy(() => import("./pages/Blog"));
const InnerBlog = lazy(() => import("./pages/InnerBlog"));
const Categories = lazy(() => import("./pages/Categories"));
const Work = lazy(() => import("./pages/Work"));
const WorkDetail = lazy(() => import("./pages/WorkDetail"));
const StartProject = lazy(() => import("./pages/StartProject"));

const ScrollToLocation = () => {
  const { pathname, hash, state } = useLocation();
  const preserveScroll = state?.preserveScroll;
  const scrollRequest = state?.scrollRequest;
  const previousPathname = useRef(pathname);

  useEffect(() => {
    const routeChanged = previousPathname.current !== pathname;
    previousPathname.current = pathname;

    if (preserveScroll) {
      return;
    }

    let animationFrame;
    let observer;

    const focus = (element) => {
      if (!element) return false;

      if (!element.hasAttribute("tabindex")) {
        element.setAttribute("tabindex", "-1");
      }

      element.focus({ preventScroll: true });
      return true;
    };

    const findAndFocus = () => {
      const target = hash
        ? document.getElementById(hash.slice(1))
        : document.querySelector(
            "#main-content h1, #main-content [role=\"alert\"] h2"
          );

      if (!target) return false;

      if (hash) {
        target.scrollIntoView();
      }

      return focus(target);
    };

    const shouldMoveFocus =
      Boolean(hash) || routeChanged || Boolean(scrollRequest);

    animationFrame = requestAnimationFrame(() => {
      if (!hash) {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }

      if (!shouldMoveFocus || findAndFocus()) return;

      observer = new MutationObserver(() => {
        if (findAndFocus()) {
          observer.disconnect();
        }
      });
      const mainContent = document.getElementById("main-content");

      if (!mainContent) return;

      observer.observe(mainContent, {
        childList: true,
        subtree: true,
      });
    });

    return () => {
      cancelAnimationFrame(animationFrame);
      observer?.disconnect();
    };
  }, [pathname, hash, preserveScroll, scrollRequest]);

  return null;
};

const Layout = () => (
    <>
      <ScrollToLocation />
      <MotionEffects />
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header />
      <div id="main-content" tabIndex={-1}>
        <Suspense
          fallback={
            <main className="route-loading">
              <div className="container">
                <ContentState count={3} label="Loading page" />
              </div>
            </main>
          }
        >
          <Outlet />
        </Suspense>
      </div>
      <Footer />
    </>
);

const ArticleRoute = () => {
  const { id } = useParams();

  return <InnerBlog key={id} />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "blogs",
        element: <Blog />,
      },
      {
        path: "blog/:id",
        element: <ArticleRoute />,
      },
      {
        path: "categories",
        element: <Categories />,
      },
      {
        path: "work",
        element: <Work />,
      },
      {
        path: "work/:slug",
        element: <WorkDetail />,
      },
      {
        path: "start-project",
        element: <StartProject />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
