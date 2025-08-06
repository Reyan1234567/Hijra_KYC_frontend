import "./App.css";
import { BrowserRouter } from "react-router-dom";
import FullLayout from "./components/Layout/FullLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <FullLayout />
      </QueryClientProvider>{" "}
    </BrowserRouter>
  );
}

export default App;
