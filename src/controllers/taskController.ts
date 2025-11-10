// src/controllers/taskController.ts (EN TU BACKEND)

import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const getTasks = async (req: Request, res: Response) => {
  // 1. Lee el playerId desde los "query parameters"
  const playerId = parseInt(req.query.playerId as string);

  if (isNaN(playerId)) {
    return res.status(400).json({ error: 'playerId inválido o no provisto' });
  }
  
  const tasks = await prisma.tASKS.findMany({
    where: {
      player_id: playerId,
      eliminated_flag: false // Asegúrate de no mostrar las eliminadas
    }
  });
  
  res.json(tasks);
};

export const createTask = async (req: Request, res: Response) => {
  // 2. Lee el playerId desde el "body"
  const { titulo, tipo, playerId } = req.body;

  if (!playerId || !titulo || !tipo) {
    return res.status(400).json({ error: 'Faltan datos (titulo, tipo o playerId)' });
  }
  
  const newTask = await prisma.tASKS.create({
    data: {
      player_id: Number(playerId),
      titulo: titulo,
      tipo: tipo,
      completed_flag: false,
      eliminated_flag: false
    }
  });
  
  res.json(newTask);
};

// 3. ¡NUEVA FUNCIÓN!
export const deleteTask = async (req: Request, res: Response) => {
  const taskId = parseInt(req.params.id);

  if (isNaN(taskId)) {
    return res.status(400).json({ error: 'ID de tarea inválido' });
  }

  try {
    // Marcamos la tarea como eliminada en lugar de borrarla
    const updatedTask = await prisma.tASKS.update({
      where: { task_id: taskId },
      data: { eliminated_flag: true },
    });
    // Enviamos un status 204 (No Content) o 200 (OK) para confirmar
    res.status(200).json({ success: true, task: updatedTask });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la tarea' });
  }
};