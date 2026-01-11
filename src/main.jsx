import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Home from "./routes/Home";
import App from "./routes/App";
import { createBrowserRouter, RouterProvider } from "react-router";
import RealtimeTodo from "./routes/RealtimeTodo";
import ProtectedRoutes from "./routes/ProtectedRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RealtimeTodo />
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <>
    <RouterProvider router={router} />
  </>
);
