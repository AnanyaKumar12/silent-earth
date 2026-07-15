import { Navigate } from "react-router-dom";
import { useAccount } from "../context/AccountContext";
import Loader from "./Loader";

// Ensures pages that require a name/mobile (like Report Emergency)
// redirect to Create Account if no local account exists yet.
// This is NOT authentication — it's just making sure we have a name
// to attach to the report.
export default function AccountGate({ children }) {
  const { account, isLoaded } = useAccount();

  if (!isLoaded) return <Loader label="Loading your account..." />;
  if (!account) return <Navigate to="/create-account" replace />;

  return children;
}
