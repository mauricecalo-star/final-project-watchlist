import { useState } from "react";
import type { FormEvent } from "react";
import { api } from "../api";
import type { OmdbResult } from "../api";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<OmdbResult[]>([]);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setError("");
    setLoading(true);
    try {
      const data = await api.searchOmdb(query);
      setResults(data.results || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(result: OmdbResult) {
    try {
      await api.addItem({
        imdbId: result.imdbID,
        title: result.Title,
        poster: result.Poster !== "N/A" ? result.Poster : undefined,
        year: result.Year,
        type: result.Type,
      });
      setAddedIds((prev) => new Set(prev).add(result.imdbID));
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="page">
      <h1>Search movies &amp; shows</h1>
      <form onSubmit={handleSearch} className="search-form">
        <input placeholder="e.g. The Matrix" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      {error && <p className="error">{error}</p>}

      <div className="results-grid">
        {results.map((r) => (
          <div key={r.imdbID} className="card">
            {r.Poster !== "N/A" && <img src={r.Poster} alt={r.Title} />}
            <h3>{r.Title}</h3>
            <p>
              {r.Year} · {r.Type}
            </p>
            <button onClick={() => handleAdd(r)} disabled={addedIds.has(r.imdbID)}>
              {addedIds.has(r.imdbID) ? "Added ✓" : "Add to my list"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
