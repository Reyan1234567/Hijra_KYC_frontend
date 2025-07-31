import "./App.css";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MessagesPage from "./pages/MessagesPage";
import MessagesView from "./components/MessagesView";
import MakeFormTable from "./components/MakeFormTable";
import CheckerTable from "./components/CheckerTable";
import Search from "./components/Search";
import Distribute from "./components/Distribute";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import KycManagerTable from "./components/kycManagerTable";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/message" element={<MessagesPage />}></Route>
      <Route path="/messageChat" element={<MessagesView />}></Route>
      <Route path="/makeForm" element={<MakeFormTable />}></Route>
      <Route path="/checkForm" element={<CheckerTable />}></Route>
      <Route path="/search" element={<Search />}></Route>
      <Route path="/distribute" element={<Distribute />}></Route>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/kycManager" element={<KycManagerTable />} />
    </Routes>
  );
}

export default App;
