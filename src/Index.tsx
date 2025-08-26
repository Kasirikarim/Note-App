import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { applyTheme, getDefaultSettings } from "./theme/themes";

// Apply default theme before rendering
applyTheme(getDefaultSettings());

const container = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
