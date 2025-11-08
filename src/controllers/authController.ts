import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const register = async (req: Request, res: Response) => {
  const { email, password, player_name } = req.body;
  
  // Verificar si el usuario ya existe
  const existingPlayer = await prisma.pLAYER.findUnique({
    where: { email }
  });
  
  if (existingPlayer) {
    return res.status(400).json({ error: 'El email ya está registrado' });
  }
  
  // Crear nuevo jugador
  const newPlayer = await prisma.pLAYER.create({
    data: {
      email,
      password, // usarías bcrypt para hashear
      player_name,
      current_garden_id: null,
      current_garden_level: null
    }
  });
  
  // No devolver el password
  const { password: _, ...playerData } = newPlayer;
  
  res.json({ 
    success: true, 
    player: playerData 
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  const player = await prisma.pLAYER.findUnique({
    where: { email }
  });
  
  if (!player || player.password !== password) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  
  // No devolver el password
  const { password: _, ...playerData } = player;
  
  res.json({ 
    success: true, 
    player: playerData 
  });
};