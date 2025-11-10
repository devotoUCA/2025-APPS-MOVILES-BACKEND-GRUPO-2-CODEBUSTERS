// src/routes/gardenRoutes.ts (CON RUTA PARA PROGRESO INTERMEDIO)

import express from 'express';
import { updateGardenProgress, updateGardenProgressOnly, updateInventory, updateGardenType } from '../controllers/gardenController';

const router = express.Router();

// Actualiza nivel Y progreso de un jardín
router.patch('/player/:id/progress', updateGardenProgress);

// ✅ NUEVO: Ruta para actualizar SOLO el progreso intermedio (sin cambiar nivel)
router.patch('/player/:id/progress-only', updateGardenProgressOnly);

// Actualiza inventario
router.post('/player/:id/inventory', updateInventory);

// Cambia el jardín activo
router.patch('/player/:id/garden', updateGardenType);

export default router;