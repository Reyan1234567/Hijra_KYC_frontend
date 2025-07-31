import { createRoot } from "react-dom/client";
import { StrictMode } from 'react'
import "./index.css";
import App from "./App.tsx";
// import { AuthProvider } from "./context/AuthProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
