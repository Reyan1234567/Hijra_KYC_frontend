/*
 * HIJRA KYC FRONTEND - MAIN APPLICATION COMPONENT
 * 
 * FILE TYPE: Root Application Component
 * PURPOSE: Main application wrapper that handles authentication routing and global providers
 * 
 * FUNCTIONALITY:
 * - Manages authentication state based on localStorage login status
 * - Provides React Query client for data fetching across the app
 * - Routes between LoginForm and FullLayout based on authentication
 * - Wraps entire app with AuthProvider for authentication context
 * - Sets up BrowserRouter with /app basename for routing
 * 
 * AUTHENTICATION FLOW:
 * - Checks localStorage "loginStatus" key
 * - If "1": Shows authenticated app (FullLayout) 
 * - If not "1": Clears localStorage and shows LoginForm
 * 
 * PROVIDERS:
 * - BrowserRouter: Handles client-side routing
 * - QueryClientProvider: Manages server state with React Query
 * - AuthProvider: Provides authentication context throughout app
 * 
 * COMPONENTS RENDERED:
 * - LoginForm: When user is not authenticated
 * - FullLayout: When user is authenticated (contains main app)
 */

import "./App.css";
import { BrowserRouter } from "react-router-dom";
import FullLayout from "./components/Layout/FullLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthProvider";
import LoginForm from "./components/LoginForm.tsx";

const queryClient = new QueryClient();

function App() {

    let login = localStorage.getItem("loginStatus");

  return (
    <BrowserRouter basename="/app">
      <QueryClientProvider client={queryClient}>
          {
              login === "1" ? (

                  <AuthProvider child={<FullLayout />} />

              ) : (
                  <>
                      {localStorage.clear()}
                  <AuthProvider child={<LoginForm />} />
                  </>
              )
          }
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
