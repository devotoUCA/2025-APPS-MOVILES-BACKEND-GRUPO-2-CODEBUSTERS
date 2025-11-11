
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  
  const garden1 = await prisma.gARDENS.upsert({
    where: { garden_name: 'jungle' }, update: {}, create: { garden_name: 'jungle' }, 
  });
  const garden2 = await prisma.gARDENS.upsert({
    where: { garden_name: 'peach' }, update: {}, create: { garden_name: 'peach' }, 
  });
  const garden3 = await prisma.gARDENS.upsert({
    where: { garden_name: 'valley' }, update: {}, create: { garden_name: 'valley' }, 
  });

  await prisma.cONSUMABLES.upsert({ where: { consumable_name: 'agua' }, update: {}, create: { consumable_name: 'agua' } });
  await prisma.cONSUMABLES.upsert({ where: { consumable_name: 'polvo' }, update: {}, create: { consumable_name: 'polvo' } });
  await prisma.cONSUMABLES.upsert({ where: { consumable_name: 'fertilizante' }, update: {}, create: { consumable_name: 'fertilizante' } });

  const player = await prisma.pLAYER.upsert({
    where: { email: 'test@example.com' },
    update: {}, 
    create: {
      player_name: 'Jugador Test',
      email: 'test@example.com',
      password: '123456',
      current_garden: {
        connect: { garden_name: 'jungle' } 
      }
    }
  });

  await prisma.gardenProgress.upsert({
    where: { 
      player_id_garden_id: {
        player_id: player.player_id,
        garden_id: garden1.garden_id 
      }
    },
    update: {},
    create: {
      player_id: player.player_id,
      garden_id: garden1.garden_id,
      level: 1
    }
  });

  const task1Title = 'Hacer ejercicio 30 minutos';
  const task1 = await prisma.tASKS.findFirst({
    where: { player_id: player.player_id, titulo: task1Title }
  });
  if (!task1) {
    await prisma.tASKS.create({ data: { player_id: player.player_id, titulo: task1Title, tipo: 'Ejercicio' } });
  }
  
  const task2Title = 'Meditar antes de dormir';
  const task2 = await prisma.tASKS.findFirst({
    where: { player_id: player.player_id, titulo: task2Title }
  });
  if (!task2) {
    await prisma.tASKS.create({ data: { player_id: player.player_id, titulo: task2Title, tipo: 'SaludMental' } });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });