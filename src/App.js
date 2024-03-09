import {
  createBrowserRouter,
  RouterProvider,
  Outlet
} from "react-router-dom";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Header from './components/Header';
import Footer from './components/Footer';
import InnerBlog from "./pages/InnerBlog";

const Layout = () => {
  return (
    <div className="app">
      <Header/>
      <Outlet/>
      <Footer/>
    </div>
  )
}

const router =createBrowserRouter([
  {
    path:"/",
    element:<Layout/>,
    children:[
      {
        path:"/",
        element:<Home/>
      },
      {
        path:"/blogs",
        element:<Blog/>
      },
      {
        path:"/blog/:id",
        element:<InnerBlog/>
      },
    ]
  }
])


function App() {
  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
