// src/routes/taskRoutes.ts (EN TU BACKEND)

import express from 'express';
// 1. Importa la nueva función
import { getTasks, createTask, deleteTask } from '../controllers/taskController';

const router = express.Router();

router.get('/tasks', getTasks);
router.post('/tasks', createTask);

// 2. ¡NUEVA RUTA!
//    Usamos :id para pasar el ID de la tarea en la URL
router.delete('/tasks/:id', deleteTask);

export default router;