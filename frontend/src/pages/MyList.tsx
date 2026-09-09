import { useEffect, useState } from "react";
import { api } from "../api";
import type { Item } from "../api";

export default function MyList() {
  const [items, setItems] = useState<Item[]>([]);
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try {
      const data = await api.getItems(status || undefined, query || undefined);
      setItems(data.items);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, query]);

  async function toggleStatus(item: Item) {
    const next = item.status === "watched" ? "want" : "watched";
    await api.updateItem(item.id, { status: next });
    load();
  }

  async function setRating(item: Item, rating: number) {
    await api.updateItem(item.id, { rating });
    load();
  }

  async function remove(item: Item) {
    await api.deleteItem(item.id);
    load();
  }

  return (
    <div className="page">
      <h1>My list</h1>

      <div className="filters">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="want">Want to watch</option>
          <option value="watched">Watched</option>
        </select>
        <input placeholder="Filter by title..." value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      {error && <p className="error">{error}</p>}

      <div className="results-grid">
        {items.map((item) => (
          <div key={item.id} className="card">
            {item.poster && <img src={item.poster} alt={item.title} />}
            <h3>{item.title}</h3>
            <p>
              {item.year} · {item.type}
            </p>
            <p className={`status status-${item.status}`}>{item.status === "watched" ? "Watched" : "Want to watch"}</p>
            <div className="rating">
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  className={n <= (item.rating || 0) ? "star filled" : "star"}
                  onClick={() => setRating(item, n)}
                >
                  ★
                </span>
              ))}
            </div>
            <div className="card-actions">
              <button onClick={() => toggleStatus(item)}>
                Mark as {item.status === "watched" ? "want to watch" : "watched"}
              </button>
              <button onClick={() => remove(item)} className="danger">
                Remove
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p>Nothing here yet — search for a title and add it to your list.</p>}
      </div>
    </div>
  );
}
