import express from 'express';
import { getTasks, createTask, deleteTask, completeTask, checkOverdueTasks, checkSingleTaskOverdue } from '../controllers/taskController';

const router = express.Router();

router.get('/tasks', getTasks);
router.post('/tasks', createTask);
router.delete('/tasks/:id', deleteTask);
router.put('/tasks/:id/complete', completeTask);
router.get('/tasks/check-overdue/:playerId', checkOverdueTasks);
router.get('/tasks/:taskId/is-overdue', checkSingleTaskOverdue); 

export default router;