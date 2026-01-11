import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Home from "./routes/Home";
import { createBrowserRouter, RouterProvider } from "react-router";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import PostgresChangeRealtime from '@/routes/PostgresChangeRealtime'
import BroadCast from "./routes/BroadCast";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Home/>
    )
  },
  {
    path:'/postgreschanges',
    element:(
      <PostgresChangeRealtime/>
    )
  },
  {
    path:'/broadcast',
    element:<BroadCast />
  }
]);

createRoot(document.getElementById("root")).render(
  <>
    <RouterProvider router={router} />
  </>
);
