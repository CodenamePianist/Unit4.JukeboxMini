const express = require("express");
const router = express.Router();
module.exports = router;

const prisma = require("../prisma");

router.get("/", async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: +id },
      include: { playlists: true },
    });
    if (user) {
      res.json(user);
    } else {
      next({ status: 404, message: `User with id ${id} not found.` });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/:id/playlists", async (req, res, next) => {
  const { id } = req.params;
  const { name, description, user } = req.body;
  if (!name) {
    return next({
      status: 404,
      message: "New playlist needs a name.",
    });
  }
  try {
    const playlist = await prisma.playlist.create({
      data: { name, description, ownerId: +id },
    });
    res.status(201).json(playlist);
  } catch (error) {
    next(error);
  }
});
