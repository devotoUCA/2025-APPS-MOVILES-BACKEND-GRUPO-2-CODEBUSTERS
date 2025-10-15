// scripts/import_images.js
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import mime from "mime-types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function ensureDir(p) {
  await fs.ensureDir(p);
}

function isImage(filename) {
  const mimeType = mime.lookup(filename);
  return mimeType && mimeType.startsWith("image/");
}

async function importConsumables(sourceDir) {
  const destBase = path.join(__dirname, "..", "public", "uploads", "Consumables");
  await ensureDir(destBase);

  const files = await fs.readdir(sourceDir);
  for (const file of files) {
    const src = path.join(sourceDir, file);
    const stat = await fs.stat(src);
    if (!stat.isFile()) continue;
    if (!isImage(file)) continue;

    const destPath = path.join(destBase, file);
    await fs.copy(src, destPath, { overwrite: true });

    const publicPath = `/uploads/Consumables/${file}`;

    // upsert consumable by name (without extension) or by filename
    const name = path.parse(file).name;

    await prisma.cONSUMABLES.upsert({
      where: { consumable_name: name },
      update: { consumable_img: publicPath, consumable_name: name },
      create: { consumable_name: name, consumable_img: publicPath }
    });

    console.log(`Consumable imported: ${file} -> ${publicPath}`);
  }
}

async function importGardens(sourceDir) {
  const destBase = path.join(__dirname, "..", "public", "uploads", "Gardens");
  await ensureDir(destBase);

  const gardenNames = await fs.readdir(sourceDir);
  for (const gardenName of gardenNames) {
    const gardenPath = path.join(sourceDir, gardenName);
    const stat = await fs.stat(gardenPath);
    if (!stat.isDirectory()) continue;

    const destGardenDir = path.join(destBase, gardenName);
    await ensureDir(destGardenDir);

    const files = await fs.readdir(gardenPath);
    for (const file of files) {
      if (!isImage(file)) continue;

      const src = path.join(gardenPath, file);
      const dest = path.join(destGardenDir, file);
      await fs.copy(src, dest, { overwrite: true });

      // parse filename like oasis_1.png or Oasis_2.jpg
      const parsed = path.parse(file).name; // "oasis_1"
      const parts = parsed.split("_");
      if (parts.length < 2) {
        console.warn(`Skipping file with unexpected name (expected <garden>_<level>): ${file}`);
        continue;
      }
      const level = parts[parts.length - 1]; // last part
      // normalize level to number if possible
      const levelNum = parseInt(level, 10);
      if (Number.isNaN(levelNum) || levelNum < 1 || levelNum > 5) {
        console.warn(`Skipping file with invalid level (1-5 expected): ${file}`);
        continue;
      }

      const publicPath = `/uploads/Gardens/${gardenName}/${file}`;

      // ensure garden exists (upsert)
      // we set garden_name to the folder name
      // and update the appropriate level_N_img field
      const levelField = `level_${levelNum}_img`;

      // build update/create objects dynamically
      const updateObj = {};
      updateObj[levelField] = publicPath;

      const createObj = {
        garden_name: gardenName,
        // set the detected level field
        [levelField]: publicPath
      };

      // Prisma model name in client: GARDENS -> prisma.gARDENS (based on your schema usage)
      await prisma.gARDENS.upsert({
        where: { garden_name: gardenName },
        update: updateObj,
        create: createObj
      });

      console.log(`Garden image imported: ${gardenName}/${file} -> ${publicPath}`);
    }
  }
}

async function main() {
  try {
    // --- MODIFY THESE PATHS to match donde tenés las carpetas en tu PC ---
    // ejemplos Windows:
    // const consumablesSource = "C:\\Users\\Mateo\\Desktop\\Consumables";
    // const gardensSource = "C:\\Users\\Mateo\\Desktop\\Gardens";
    const consumablesSource = path.resolve(process.argv[2] || "C:\\Users\\afcap\\Desktop\\Archivos\\UCA\\Ingeniería Informática\\Quinto Anio\\Segundo Cuatrimestre\\Programacion de Aplicaciones Moviles\\APP\\Consumables");
    const gardensSource = path.resolve(process.argv[3] || "C:\\Users\\afcap\\Desktop\\Archivos\\UCA\\Ingeniería Informática\\Quinto Anio\\Segundo Cuatrimestre\\Programacion de Aplicaciones Moviles\\APP\\Gardens");
    // --------------------------------------------------------------------

    if (!(await fs.pathExists(consumablesSource))) {
      console.error("Consumables source no existe:", consumablesSource);
    } else {
      console.log("Importando consumables desde:", consumablesSource);
      await importConsumables(consumablesSource);
    }

    if (!(await fs.pathExists(gardensSource))) {
      console.error("Gardens source no existe:", gardensSource);
    } else {
      console.log("Importando gardens desde:", gardensSource);
      await importGardens(gardensSource);
    }

    console.log("Import terminado.");
  } catch (e) {
    console.error("Error en import:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
