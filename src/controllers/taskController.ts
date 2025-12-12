import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const getTasks = async (req: Request, res: Response) => {
  const playerId = parseInt(req.query.playerId as string);

  if (isNaN(playerId)) {
    return res.status(400).json({ error: 'playerId inválido o no provisto' });
  }
  
  const tasks = await prisma.tASKS.findMany({
    where: {
      player_id: playerId,
      eliminated_flag: false 
    }
  });
  
  res.json(tasks);
};

export const createTask = async (req: Request, res: Response) => {
  const { titulo, tipo, playerId, deadline } = req.body;

  if (!playerId || !titulo || !tipo) {
    return res.status(400).json({ error: 'Faltan datos (titulo, tipo o playerId)' });
  }
  
  const newTask = await prisma.tASKS.create({
    data: {
      player_id: Number(playerId),
      titulo: titulo,
      tipo: tipo,
      completed_flag: false,
      eliminated_flag: false,
      failed_flag: false,
      deadline: deadline ? new Date(deadline) : null
    }
  });
  
  res.json(newTask);
};

export const deleteTask = async (req: Request, res: Response) => {
  const taskId = parseInt(req.params.id);

  if (isNaN(taskId)) {
    return res.status(400).json({ error: 'ID de tarea inválido' });
  }

  try {
    const updatedTask = await prisma.tASKS.update({
      where: { task_id: taskId },
      data: { eliminated_flag: true },
    });
    res.status(200).json({ success: true, task: updatedTask });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la tarea' });
  }
};

export const completeTask = async (req: Request, res: Response) => {
  const taskId = parseInt(req.params.id);

  if (isNaN(taskId)) {
    return res.status(400).json({ error: 'ID de tarea inválido' });
  }

  try {
    const updatedTask = await prisma.tASKS.update({
      where: { task_id: taskId },
      data: { 
        completed_flag: true,
        completed_at: new Date(),
        eliminated_flag: true
      },
    });
    res.status(200).json({ success: true, task: updatedTask });
  } catch (error) {
    console.error('Error al completar tarea:', error);
    res.status(500).json({ error: 'Error al completar la tarea' });
  }
};

export const checkOverdueTasks = async (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerId);

  if (isNaN(playerId)) {
    return res.status(400).json({ error: 'playerId inválido' });
  }

  try {
    const now = new Date();
    
    // Encontrar tareas vencidas
    const overdueTasks = await prisma.tASKS.findMany({
      where: {
        player_id: playerId,
        deadline: { lt: now },
        completed_flag: false,
        eliminated_flag: false,
        failed_flag: false
      }
    });

    if (overdueTasks.length === 0) {
      return res.json({ overdueTasks: [], penaltyApplied: false });
    }

    // Marcar tareas como fallidas
    await prisma.tASKS.updateMany({
      where: {
        task_id: { in: overdueTasks.map(t => t.task_id) }
      },
      data: {
        failed_flag: true,
        eliminated_flag: true
      }
    });

    // Obtener el jardín actual del jugador
    const player = await prisma.pLAYER.findUnique({
      where: { player_id: playerId },
      include: { 
        current_garden: true,
        GardenProgress: {
          where: { player_id: playerId }
        }
      }
    });

    if (!player || !player.current_garden_id) {
      return res.json({ 
        overdueTasks,
        penaltyApplied: false,
        message: 'No se aplicó penalización (sin jardín activo)'
      });
    }

    // Obtener progreso actual
    const currentProgress = player.GardenProgress.find(
      gp => gp.garden_id === player.current_garden_id
    );

    if (!currentProgress) {
      return res.json({ 
        overdueTasks,
        penaltyApplied: false,
        message: 'No se aplicó penalización (sin progreso)'
      });
    }

    // PENALIZACIÓN SIMPLIFICADA: Bajar 1 nivel por cada tarea vencida
    const levelsToReduce = overdueTasks.length;
    let newLevel = Math.max(1, currentProgress.level - levelsToReduce);
    let newProgress = currentProgress.progress;
    
    // Si ya está en nivel 1, resetear progreso a 0
    if (currentProgress.level === 1) {
      newLevel = 1;
      newProgress = 0;
    } else if (newLevel < currentProgress.level) {
      // Si bajó de nivel, resetear progreso a 0
      newProgress = 0;
    }

    // Aplicar penalización
    await prisma.gardenProgress.update({
      where: {
        player_id_garden_id: {
          player_id: playerId,
          garden_id: player.current_garden_id
        }
      },
      data: {
        progress: newProgress,
        level: newLevel
      }
    });

    // Obtener jugador actualizado
    const updatedPlayer = await prisma.pLAYER.findUnique({
      where: { player_id: playerId },
      include: {
        current_garden: true,
        GardenProgress: {
          where: { 
            player_id: playerId,
            garden_id: player.current_garden_id
          }
        },
        INVENTORYs: {
          include: {
            CONSUMABLES: true
          }
        }
      }
    });

    res.json({
      overdueTasks,
      penaltyApplied: true,
      previousLevel: currentProgress.level,
      newLevel: newLevel,
      player: updatedPlayer
    });

  } catch (error) {
    console.error('Error al verificar tareas vencidas:', error);
    res.status(500).json({ error: 'Error al verificar tareas vencidas' });
  }
};

export const checkSingleTaskOverdue = async (req: Request, res: Response) => {
  const taskId = parseInt(req.params.taskId);

  if (isNaN(taskId)) {
    return res.status(400).json({ error: 'taskId inválido' });
  }

  try {
    const task = await prisma.tASKS.findUnique({
      where: { task_id: taskId }
    });

    if (!task) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    if (!task.deadline) {
      return res.json({ isOverdue: false });
    }

    const now = new Date();
    const isOverdue = new Date(task.deadline) < now;

    res.json({ isOverdue, task });
  } catch (error) {
    console.error('Error al verificar tarea:', error);
    res.status(500).json({ error: 'Error al verificar tarea' });
  }
};