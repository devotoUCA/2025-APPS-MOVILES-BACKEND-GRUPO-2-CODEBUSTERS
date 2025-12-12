import express from 'express';
import { getTasks, createTask, deleteTask, completeTask } from '../controllers/taskController';

const router = express.Router();

router.get('/tasks', getTasks);
router.post('/tasks', createTask);
router.delete('/tasks/:id', deleteTask);
router.put('/tasks/:id/complete', completeTask);

export default router;