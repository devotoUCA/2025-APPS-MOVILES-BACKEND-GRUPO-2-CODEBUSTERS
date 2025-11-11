import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const register = async (req: Request, res: Response) => {
  const { email, password, player_name } = req.body; 
  
  const existingPlayer = await prisma.pLAYER.findUnique({
    where: { email }
  });
  
  if (existingPlayer) {
    return res.status(400).json({ error: 'El email ya está registrado' });
  }
  
  const newPlayer = await prisma.pLAYER.create({
    data: {
      email,
      password,
      player_name,
      current_garden: { connect: { garden_name: 'jungle' } } 
    },
  });

  await prisma.gardenProgress.create({
    data: {
      player_id: newPlayer.player_id,
      garden_id: 1, 
      level: 1
    }
  });

  const finalPlayer = await prisma.pLAYER.findUnique({
    where: { player_id: newPlayer.player_id },
    include: {
        INVENTORYs: { include: { CONSUMABLES: true } },
        current_garden: true,
        GardenProgress: true 
    }
  });

  const { password: _, ...playerData } = finalPlayer!;
  res.json({ success: true, player: playerData });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  const player = await prisma.pLAYER.findUnique({
    where: { email },
    include: {
        INVENTORYs: { include: { CONSUMABLES: true } },
        current_garden: true,
        GardenProgress: true 
    }
  });
  
  if (!player || player.password !== password) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  
  const { password: _, ...playerData } = player;
  res.json({ success: true, player: playerData });
};