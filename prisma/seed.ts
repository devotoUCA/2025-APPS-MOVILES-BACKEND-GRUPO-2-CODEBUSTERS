import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Crear un jugador de prueba CON email y password
  const player = await prisma.pLAYER.create({
    data: {
      player_name: 'Jugador Test',
      email: 'test@example.com',
      password: '123456',
      current_garden_id: null,
      current_garden_level: null
    }
  });

  console.log('Jugador creado:', player);

  // Crear 2 tareas de prueba
  const task1 = await prisma.tASKS.create({
    data: {
      player_id: player.player_id,
      titulo: 'Hacer ejercicio 30 minutos',
      tipo: 'Ejercicio',
      completed_flag: false,
      eliminated_flag: false
    }
  });

  const task2 = await prisma.tASKS.create({
    data: {
      player_id: player.player_id,
      titulo: 'Meditar antes de dormir',
      tipo: 'SaludMental',
      completed_flag: false,
      eliminated_flag: false
    }
  });

  console.log('Tareas creadas:', task1, task2);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });