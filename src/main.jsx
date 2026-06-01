import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom"; // <--- IMPORTANT
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>        {/* <- tout App doit être ici */}
    <App />
  </BrowserRouter>
);