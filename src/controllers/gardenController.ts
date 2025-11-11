import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const updateGardenProgress = async (req: Request, res: Response) => {
  const playerId = parseInt(req.params.id);
  const { level, gardenId, progress } = req.body;

  if (isNaN(playerId) || level === undefined || gardenId === undefined) {
    return res.status(400).json({ error: 'Falta playerId, level o gardenId' });
  }

  try {
    await prisma.gardenProgress.upsert({
      where: { 
        player_id_garden_id: {
          player_id: playerId,
          garden_id: gardenId
        }
      },
      update: { 
        level: level,
        progress: progress !== undefined ? progress : 0
      },
      create: {
        player_id: playerId,
        garden_id: gardenId,
        level: level,
        progress: progress !== undefined ? progress : 0
      }
    });

    const updatedPlayer = await prisma.pLAYER.findUnique({
      where: { player_id: playerId },
      include: {
        INVENTORYs: { include: { CONSUMABLES: true } },
        current_garden: true,
        GardenProgress: true
      }
    });
    res.json({ success: true, player: updatedPlayer });

  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el nivel' });
  }
};

export const updateGardenProgressOnly = async (req: Request, res: Response) => {
  const playerId = parseInt(req.params.id);
  const { gardenId, progress } = req.body;

  if (isNaN(playerId) || gardenId === undefined || progress === undefined) {
    return res.status(400).json({ error: 'Falta playerId, gardenId o progress' });
  }

  try {
    await prisma.gardenProgress.upsert({
      where: { 
        player_id_garden_id: {
          player_id: playerId,
          garden_id: gardenId
        }
      },
      update: { progress: progress },
      create: {
        player_id: playerId,
        garden_id: gardenId,
        level: 1,
        progress: progress
      }
    });

    const updatedPlayer = await prisma.pLAYER.findUnique({
      where: { player_id: playerId },
      include: {
        INVENTORYs: { include: { CONSUMABLES: true } },
        current_garden: true,
        GardenProgress: true
      }
    });

    res.json({ success: true, player: updatedPlayer });
  } catch (error) {
    console.error("Error en updateGardenProgressOnly:", error);
    res.status(500).json({ error: 'Error al actualizar el progreso' });
  }
};

export const updateInventory = async (req: Request, res: Response) => {
  const playerId = parseInt(req.params.id);
  const { consumableId, quantity } = req.body;

  if (isNaN(playerId) || !consumableId || !quantity) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  try {
    const existingItem = await prisma.iNVENTORY.findUnique({
      where: {
        player_id_consumable_id: {
          player_id: playerId,
          consumable_id: consumableId,
        },
      },
    });

    let newQuantity = 0;
    if (existingItem) {
      newQuantity = existingItem.quantity + quantity;
    } else {
      newQuantity = quantity;
    }

    await prisma.iNVENTORY.upsert({
      where: {
        player_id_consumable_id: {
          player_id: playerId,
          consumable_id: consumableId,
        },
      },
      update: { quantity: newQuantity },
      create: {
        quantity: newQuantity,
        PLAYER: {
          connect: { player_id: playerId }
        },
        CONSUMABLES: {
          connect: { consumable_id: consumableId }
        }
      },
    });

    const updatedPlayer = await prisma.pLAYER.findUnique({
      where: { player_id: playerId },
      include: {
        INVENTORYs: { include: { CONSUMABLES: true } },
        current_garden: true,
        GardenProgress: true
      }
    });

    res.json({ success: true, player: updatedPlayer });
  } catch (error) {
    console.error("Error en updateInventory:", error); 
    res.status(500).json({ error: 'Error al actualizar inventario' });
  }
};

export const updateGardenType = async (req: Request, res: Response) => {
  const playerId = parseInt(req.params.id);
  const { gardenName } = req.body; 

  if (isNaN(playerId) || !gardenName) {
    return res.status(400).json({ error: 'Falta playerId o gardenName' });
  }

  try {
    const garden = await prisma.gARDENS.findUnique({
      where: { garden_name: gardenName }
    });
    if (!garden) {
      return res.status(404).json({ error: 'Jardín no encontrado' });
    }

    await prisma.gardenProgress.upsert({
      where: { 
        player_id_garden_id: {
          player_id: playerId,
          garden_id: garden.garden_id
        }
      },
      update: { 
        level: 1,      
        progress: 0    
      },
      create: {
        player_id: playerId,
        garden_id: garden.garden_id,
        level: 1,
        progress: 0
      }
    });

    const updatedPlayer = await prisma.pLAYER.update({
      where: { player_id: playerId },
      data: { 
        current_garden_id: garden.garden_id,
      },
      include: {
        INVENTORYs: { include: { CONSUMABLES: true } },
        current_garden: true,
        GardenProgress: true
      }
    });
    
    res.json({ success: true, player: updatedPlayer });

  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el jardín' });
  }
};