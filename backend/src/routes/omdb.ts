import { Router } from "express";
import { requireAuth } from "../middleware/auth";

const router = Router();

// GET /api/omdb/search?q=matrix
// Proxies OMDb so the API key never reaches the browser.
router.get("/search", requireAuth, async (req, res) => {
  const q = req.query.q as string;
  if (!q) {
    return res.status(400).json({ error: "Query param 'q' is required" });
  }

  const url = `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&s=${encodeURIComponent(q)}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.Response === "False") {
    return res.json({ results: [] });
  }

  res.json({ results: data.Search });
});

export default router;
