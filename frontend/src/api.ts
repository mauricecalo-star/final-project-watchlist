const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

function getToken() {
  return localStorage.getItem("token");
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export interface OmdbResult {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
}

export interface Item {
  id: string;
  imdbId: string;
  title: string;
  poster?: string;
  year?: string;
  type: string;
  status: string;
  rating?: number;
  notes?: string;
}

export const api = {
  signup: (email: string, password: string) =>
    request("/api/auth/signup", { method: "POST", body: JSON.stringify({ email, password }) }),

  login: (email: string, password: string) =>
    request("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),

  searchOmdb: (q: string): Promise<{ results: OmdbResult[] }> =>
    request(`/api/omdb/search?q=${encodeURIComponent(q)}`),

  getItems: (status?: string, q?: string): Promise<{ items: Item[] }> => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (q) params.set("q", q);
    const qs = params.toString();
    return request(`/api/items${qs ? `?${qs}` : ""}`);
  },

  addItem: (item: Pick<Item, "imdbId" | "title" | "poster" | "year" | "type">) =>
    request("/api/items", { method: "POST", body: JSON.stringify(item) }),

  updateItem: (id: string, data: Partial<Pick<Item, "status" | "rating" | "notes">>) =>
    request(`/api/items/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

  deleteItem: (id: string) => request(`/api/items/${id}`, { method: "DELETE" }),
};
