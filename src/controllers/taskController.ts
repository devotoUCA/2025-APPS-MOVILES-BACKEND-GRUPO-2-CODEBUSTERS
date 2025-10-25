import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const getTasks = async (req: Request, res: Response) => {
  const playerId = 1;
  
  const tasks = await prisma.tASKS.findMany({
    where: {
      player_id: playerId,
      eliminated_flag: false
    }
  });
  
  res.json(tasks);
};

export const createTask = async (req: Request, res: Response) => {
  const playerId = 1;
  const { titulo, tipo } = req.body;
  
  const newTask = await prisma.tASKS.create({
    data: {
      player_id: playerId,
      titulo: titulo || '',
      tipo: tipo || 'Productividad',
      completed_flag: false,
      eliminated_flag: false
    }
  });
  
  res.json(newTask);
};