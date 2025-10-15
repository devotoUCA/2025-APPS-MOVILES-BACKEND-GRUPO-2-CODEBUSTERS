import express from "express";
import multer from "multer";
import fs from "fs-extra";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// storage dinámico para consumables
const storageConsumable = multer.diskStorage({
  destination: async (req, file, cb) => {
    const dest = path.join("public", "uploads", "Consumables");
    await fs.ensureDir(dest);
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    // guarda con nombre original (o podés normalizar)
    cb(null, file.originalname);
  }
});

const storageGarden = multer.diskStorage({
  destination: async (req, file, cb) => {
    const gardenName = req.body.gardenName;
    const dest = path.join("public", "uploads", "Gardens", gardenName);
    await fs.ensureDir(dest);
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const level = req.body.level; // ej "1", "2"
    const gardenName = req.body.gardenName;
    // guardamos usando la nomenclatura: <gardenName>_<level>.<ext>
    const ext = path.extname(file.originalname);
    cb(null, `${gardenName}_${level}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype && file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Solo imágenes permitidas"), false);
};

const uploadConsumable = multer({ storage: storageConsumable, fileFilter }).single("file");
const uploadGarden = multer({ storage: storageGarden, fileFilter }).single("file");

// POST /upload/consumable
// body: form-data { name: consumableName, file: <image> }
router.post("/consumable", (req, res) => {
  uploadConsumable(req, res, async err => {
    if (err) return res.status(400).json({ error: err.message });
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file" });

    const name = req.body.name || path.parse(file.originalname).name;
    const publicPath = `/uploads/Consumables/${file.filename}`;

    try {
      const c = await prisma.cONSUMABLES.upsert({
        where: { consumable_name: name },
        update: { consumable_img: publicPath },
        create: { consumable_name: name, consumable_img: publicPath }
      });
      res.json({ ok: true, consumable: c });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
});

// POST /upload/garden
// body: form-data { gardenName: "Oasis", level: "1", file: <image> }
router.post("/garden", (req, res) => {
  uploadGarden(req, res, async err => {
    if (err) return res.status(400).json({ error: err.message });
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file" });

    const gardenName = req.body.gardenName;
    const level = parseInt(req.body.level, 10);
    if (!gardenName || Number.isNaN(level)) {
      return res.status(400).json({ error: "gardenName and level required" });
    }

    const publicPath = `/uploads/Gardens/${gardenName}/${file.filename}`;
    const field = `level_${level}_img`;

    try {
      const g = await prisma.gARDENS.upsert({
        where: { garden_name: gardenName },
        update: { [field]: publicPath },
        create: { garden_name: gardenName, [field]: publicPath }
      });
      res.json({ ok: true, garden: g });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
});

export default router;
