import { Router } from "express";
import { prisma } from "../db";
import { AuthRequest, requireAuth } from "../middleware/auth";

const router = Router();
router.use(requireAuth);

// GET /api/items?status=watched&q=matrix
router.get("/", async (req: AuthRequest, res) => {
  const { status, q } = req.query as { status?: string; q?: string };

  const items = await prisma.item.findMany({
    where: {
      userId: req.userId,
      ...(status ? { status } : {}),
      ...(q ? { title: { contains: q } } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  res.json({ items });
});

// POST /api/items  — add a title (from an OMDb search result) to the user's list
router.post("/", async (req: AuthRequest, res) => {
  const { imdbId, title, poster, year, type } = req.body;

  if (!imdbId || !title) {
    return res.status(400).json({ error: "imdbId and title are required" });
  }

  try {
    const item = await prisma.item.create({
      data: { imdbId, title, poster, year, type, userId: req.userId! },
    });
    res.status(201).json({ item });
  } catch {
    res.status(409).json({ error: "This title is already on your list" });
  }
});

// PATCH /api/items/:id  — update status, rating, or notes
router.patch("/:id", async (req: AuthRequest, res) => {
  const { status, rating, notes } = req.body;

  const existing = await prisma.item.findFirst({
    where: { id: req.params.id, userId: req.userId },
  });
  if (!existing) {
    return res.status(404).json({ error: "Item not found" });
  }

  const item = await prisma.item.update({
    where: { id: existing.id },
    data: { status, rating, notes },
  });
  res.json({ item });
});

// DELETE /api/items/:id
router.delete("/:id", async (req: AuthRequest, res) => {
  const existing = await prisma.item.findFirst({
    where: { id: req.params.id, userId: req.userId },
  });
  if (!existing) {
    return res.status(404).json({ error: "Item not found" });
  }

  await prisma.item.delete({ where: { id: existing.id } });
  res.status(204).send();
});

export default router;
