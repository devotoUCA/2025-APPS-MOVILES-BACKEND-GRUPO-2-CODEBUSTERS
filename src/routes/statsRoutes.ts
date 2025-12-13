import express from 'express';
import { getTaskHistory } from '../controllers/statsController';

const router = express.Router();

router.get('/stats/history/:playerId', getTaskHistory);

export default router;