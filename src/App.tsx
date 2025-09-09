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
