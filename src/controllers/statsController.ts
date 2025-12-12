import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const getTaskHistory = async (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerId);

  if (isNaN(playerId)) {
    return res.status(400).json({ error: 'playerId inválido' });
  }

  try {
    const completedTasks = await prisma.tASKS.findMany({
      where: {
        player_id: playerId,
        completed_flag: true,
        completed_at: { not: null }
      },
      orderBy: {
        completed_at: 'desc'
      },
      select: {
        task_id: true,
        titulo: true,
        tipo: true,
        completed_at: true
      }
    });

    // Agrupar por fecha
    const tasksByDate: { [key: string]: number } = {};
    
    completedTasks.forEach(task => {
      if (task.completed_at) {
        const date = new Date(task.completed_at).toISOString().split('T')[0];
        tasksByDate[date] = (tasksByDate[date] || 0) + 1;
      }
    });

    res.json({
      tasks: completedTasks,
      summary: tasksByDate
    });
  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({ error: 'Error al obtener historial de tareas' });
  }
};