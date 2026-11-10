const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);

    const contentType = response.headers.get("content-type");

    const data = contentType?.includes("application/json")
      ? await response.json()
      : null;

    if (!response.ok) {
      throw new Error(
        data?.error || `Request failed with status ${response.status}.`
      );
    }

    return data;
  } catch (error) {
    throw new Error(error.message || "Unable to connect to the server.");
  }
}