import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import { MainLayout } from "./component/layout/MainLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
]);

function App() {

  return (
    <RouterProvider router={router}></RouterProvider>
  )
}

export default App
