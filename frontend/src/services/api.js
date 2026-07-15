import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://silent-earth-3.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Extracts a friendly error message from an Axios error.
function extractErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}

export async function createUser({ name, mobileNumber }) {
  try {
    const { data } = await api.post("/users", { name, mobileNumber });
    return data.data;
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
}

export async function createReport(formValues) {
  try {
    const formData = new FormData();
    formData.append("name", formValues.name);
    formData.append("category", formValues.category);
    formData.append("location", formValues.location);
    formData.append("description", formValues.description || "");
    if (formValues.image) {
      formData.append("image", formValues.image);
    }

    const { data } = await api.post("/reports", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data;
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
}

export async function getReports({ category, search } = {}) {
  try {
    const { data } = await api.get("/reports", { params: { category, search } });
    return data.data;
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
}

export async function getCategoryCounts() {
  try {
    const { data } = await api.get("/reports/category-counts");
    return data.data;
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
}

export async function generateSummary(reportId) {
  try {
    const { data } = await api.post(`/reports/${reportId}/summary`);
    return data.data;
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
}
