import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Loader2 } from "lucide-react";
import { useAccount } from "../context/AccountContext";
import { createUser } from "../services/api";

export default function CreateAccountPage() {
  const navigate = useNavigate();
  const { account, saveAccount } = useAccount();
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  // If an account already exists on this device, skip straight to
  // reporting — the user should never see this page twice.
  useEffect(() => {
    if (account) navigate("/report", { replace: true });
  }, [account, navigate]);

  function validate() {
    const next = {};
    if (!name.trim()) next.name = "Name is required";
    if (!mobileNumber.trim()) {
      next.mobileNumber = "Mobile number is required";
    } else if (!/^[0-9+\-\s]{7,15}$/.test(mobileNumber.trim())) {
      next.mobileNumber = "Enter a valid mobile number";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setApiError("");
    try {
      // Best-effort sync to the backend; account still works offline-first
      // since it's saved locally regardless of network state.
      await createUser({ name: name.trim(), mobileNumber: mobileNumber.trim() }).catch(() => null);
      saveAccount({ name: name.trim(), mobileNumber: mobileNumber.trim() });
      navigate("/report");
    } catch (err) {
      setApiError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <div className="card p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-600">
            <UserPlus className="h-7 w-7 text-white" />
          </span>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="mt-2 text-sm text-gray-400">
            Just your name and number — no password, no login required. We'll
            remember you on this device.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-300">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="e.g. Priya Sharma"
            />
            {errors.name && <p className="mt-1 text-xs text-accent-400">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="mobile" className="mb-1.5 block text-sm font-medium text-gray-300">
              Mobile Number
            </label>
            <input
              id="mobile"
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="input-field"
              placeholder="e.g. +91 98765 43210"
            />
            {errors.mobileNumber && (
              <p className="mt-1 text-xs text-accent-400">{errors.mobileNumber}</p>
            )}
          </div>

          {apiError && <p className="text-xs text-accent-400">{apiError}</p>}

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Continue"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
