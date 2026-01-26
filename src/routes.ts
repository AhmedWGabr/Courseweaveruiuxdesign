import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Dashboard } from "./components/Dashboard";
import { Library } from "./components/Library";
import { Studio } from "./components/Studio";
import { Classroom } from "./components/Classroom";
import { Settings } from "./components/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Dashboard },
      { path: "library", Component: Library },
      { path: "studio", Component: Studio },
      { path: "classroom/:courseId", Component: Classroom },
      { path: "settings", Component: Settings },
    ],
  },
]);