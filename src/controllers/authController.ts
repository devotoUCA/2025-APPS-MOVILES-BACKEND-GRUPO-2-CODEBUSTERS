// src/controllers/authController.ts (CÓDIGO COMPLETO Y CORREGIDO)

import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const register = async (req: Request, res: Response) => {
  // 1. ✅ ¡ESTA ES LA LÍNEA QUE FALTABA!
  const { email, password, player_name } = req.body; 
  
  const existingPlayer = await prisma.pLAYER.findUnique({
    where: { email }
  });
  
  if (existingPlayer) {
    return res.status(400).json({ error: 'El email ya está registrado' });
  }
  
  // 2. Crea el jugador (ahora 'email', 'password', etc. están definidos)
  const newPlayer = await prisma.pLAYER.create({
    data: {
      email,
      password,
      player_name,
      current_garden: { connect: { garden_name: 'jungle' } } // Asigna 'jungle' por defecto
    },
  });

  // 3. Crea su progreso inicial para 'jungle'
  await prisma.gardenProgress.create({
    data: {
      player_id: newPlayer.player_id,
      garden_id: 1, // Asumimos que 'jungle' es ID 1 (del seed)
      level: 1
    }
  });

  // 4. Busca al jugador final (CON el progreso) para devolverlo
  const finalPlayer = await prisma.pLAYER.findUnique({
    where: { player_id: newPlayer.player_id },
    include: {
        INVENTORYs: { include: { CONSUMABLES: true } },
        current_garden: true,
        GardenProgress: true // Incluye el progreso de TODOS los jardines
    }
  });

  const { password: _, ...playerData } = finalPlayer!;
  res.json({ success: true, player: playerData });
};

export const login = async (req: Request, res: Response) => {
  // 5. ✅ ¡ESTA LÍNEA TAMBIÉN FALTABA AQUÍ!
  const { email, password } = req.body;
  
  const player = await prisma.pLAYER.findUnique({
    where: { email },
    include: {
        INVENTORYs: { include: { CONSUMABLES: true } },
        current_garden: true,
        GardenProgress: true // Incluye el progreso de TODOS los jardines
    }
  });
  
  if (!player || player.password !== password) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  
  const { password: _, ...playerData } = player;
  res.json({ success: true, player: playerData });
};