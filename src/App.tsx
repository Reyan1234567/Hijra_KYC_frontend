import "./App.css";
import { BrowserRouter } from "react-router-dom";
import FullLayout from "./components/Layout/FullLayout";

function App() {
  return (
    <BrowserRouter>
      <FullLayout />
    </BrowserRouter>
  );
}

export default App;
