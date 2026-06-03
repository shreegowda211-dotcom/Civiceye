import { createFileRoute } from "@tanstack/react-router";
import App from "../App.jsx";

// Splat: every URL renders the JSX app; react-router-dom handles routing.
export const Route = createFileRoute("/$")({
  component: App,
});
