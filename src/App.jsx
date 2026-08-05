import { useEffect } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  Outlet,
  useLocation,
} from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Blog from "./pages/Blog";
import InnerBlog from "./pages/InnerBlog";
import Categories from "./pages/Categories";

const ScrollToLocation = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      requestAnimationFrame(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView();
      });
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
};

const Layout = () => (
  <>
    <ScrollToLocation />
    <Header />
    <Outlet />
    <Footer />
  </>
);

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
        element: <InnerBlog />,
      },
      {
        path: "categories",
        element: <Categories />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
