/*
 * HIJRA KYC FRONTEND - MAIN ENTRY POINT
 * 
 * FILE TYPE: Application Entry Point
 * PURPOSE: Root application initialization and rendering
 * 
 * FUNCTIONALITY:
 * - Initializes React application with StrictMode
 * - Renders the main App component into the DOM
 * - Entry point for the entire Hijra KYC frontend application
 * 
 * DEPENDENCIES:
 * - React DOM for rendering
 * - App.tsx as the main application component
 * - index.css for global styles
 * 
 * LIFECYCLE:
 * 1. Creates React root from DOM element with id "root"
 * 2. Renders App component wrapped in StrictMode
 * 3. StrictMode enables additional development checks and warnings
 */

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
