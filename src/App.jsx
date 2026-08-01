import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Blog from "./pages/Blog";
import InnerBlog from "./pages/InnerBlog";
import Categories from "./pages/Categories";

const Layout = () => (
  <>
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
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}