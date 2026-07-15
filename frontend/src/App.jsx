import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AccountGate from "./components/AccountGate";
import LandingPage from "./pages/LandingPage";
import CreateAccountPage from "./pages/CreateAccountPage";
import ReportEmergencyPage from "./pages/ReportEmergencyPage";
import CategoriesDashboardPage from "./pages/CategoriesDashboardPage";
import LiveFeedPage from "./pages/LiveFeedPage";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-base-950">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/create-account" element={<CreateAccountPage />} />
          <Route
            path="/report"
            element={
              <AccountGate>
                <ReportEmergencyPage />
              </AccountGate>
            }
          />
          <Route path="/dashboard" element={<CategoriesDashboardPage />} />
          <Route path="/feed" element={<LiveFeedPage />} />
          <Route path="/feed/:category" element={<LiveFeedPage />} />
        </Routes>
      </main>
      <footer className="border-t border-base-700 py-6 text-center text-xs text-gray-600">
        Silent Earth — community emergency reporting. Stay safe, stay informed.
      </footer>
    </div>
  );
}
