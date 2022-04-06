import React from "react";
import type { RouteObject } from "react-router-dom";
import { useRoutes } from "react-router-dom";
import { Layout, NotFound } from "./main";
import { RepoBrowser } from "./repo-browser";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout/>,
    children: [
      {
        index: true,
        element: <RepoBrowser />
      },
    ]
  },
  { path: "*", element: <NotFound /> },
];

const App: React.FC = () => useRoutes(routes);

export default App;
