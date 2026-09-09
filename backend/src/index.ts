import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import itemRoutes from "./routes/items";
import omdbRoutes from "./routes/omdb";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/omdb", omdbRoutes);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
