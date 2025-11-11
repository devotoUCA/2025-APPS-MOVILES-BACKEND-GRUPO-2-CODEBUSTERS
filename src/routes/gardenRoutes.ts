import express from 'express';
import { updateGardenProgress, updateGardenProgressOnly, updateInventory, updateGardenType } from '../controllers/gardenController';

const router = express.Router();

router.patch('/player/:id/progress', updateGardenProgress);

router.patch('/player/:id/progress-only', updateGardenProgressOnly);

router.post('/player/:id/inventory', updateInventory);

router.patch('/player/:id/garden', updateGardenType);

export default router;