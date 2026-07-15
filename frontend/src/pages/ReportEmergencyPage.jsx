import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { useAccount } from "../context/AccountContext";
import { CATEGORIES } from "../utils/categoryStyles";
import { createReport } from "../services/api";
import ImageUpload from "../components/ImageUpload";

export default function ReportEmergencyPage() {
  const { account, updateName } = useAccount();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: account?.name || "",
    category: "",
    location: "",
    description: "",
  });
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);

  function setField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.category) next.category = "Please select a category";
    if (!form.location.trim()) next.location = "Location is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setApiError("");
    try {
      await createReport({ ...form, image });
      if (form.name.trim() !== account?.name) updateName(form.name.trim());
      setSuccess(true);
      setForm((prev) => ({ ...prev, category: "", location: "", description: "" }));
      setImage(null);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-signal-500/15">
          <CheckCircle2 className="h-8 w-8 text-signal-500" />
        </span>
        <h1 className="text-2xl font-bold text-white">Report submitted</h1>
        <p className="mt-2 text-gray-400">
          Thank you. Your report is now visible on the Live Feed to help
          coordinate community response.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={() => setSuccess(false)} className="btn-secondary">
            Report another
          </button>
          <button onClick={() => navigate("/feed")} className="btn-primary">
            View Live Feed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white">Report Emergency</h1>
        <p className="mt-2 text-gray-400">
          Share what you know — every detail helps responders and neighbors.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6 p-6 sm:p-8" noValidate>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            className="input-field"
            placeholder="Your name"
          />
          {errors.name && <p className="mt-1 text-xs text-accent-400">{errors.name}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300">Category</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setField("category", category)}
                className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
                  form.category === category
                    ? "border-accent-500 bg-accent-600/20 text-accent-400"
                    : "border-base-600 bg-base-800 text-gray-400 hover:border-base-500"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          {errors.category && <p className="mt-1 text-xs text-accent-400">{errors.category}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300">Location</label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => setField("location", e.target.value)}
            className="input-field"
            placeholder="e.g. Sector 12, near community hall"
          />
          {errors.location && <p className="mt-1 text-xs text-accent-400">{errors.location}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            Description <span className="text-gray-600">(optional)</span>
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            rows={4}
            className="input-field resize-none"
            placeholder="Describe the situation in a few sentences..."
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            Image <span className="text-gray-600">(optional)</span>
          </label>
          <ImageUpload onChange={setImage} />
        </div>

        {apiError && <p className="text-sm text-accent-400">{apiError}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Submit Report
            </>
          )}
        </button>
      </form>
    </div>
  );
}
