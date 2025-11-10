// src/routes/gardenRoutes.ts (CÓDIGO COMPLETO Y CORREGIDO)

import express from 'express';
import { updateGardenProgress, updateInventory, updateGardenType } from '../controllers/gardenController';

const router = express.Router();

// ✅ Cambiado 'level' por 'progress' para que sea más claro
router.patch('/player/:id/progress', updateGardenProgress);
router.post('/player/:id/inventory', updateInventory);
router.patch('/player/:id/garden', updateGardenType);

export default router;