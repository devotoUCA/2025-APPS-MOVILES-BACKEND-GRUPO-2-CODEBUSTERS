import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Obtener todas las tareas completadas
  const completedTasks = await prisma.tASKS.findMany({
    where: { completed_flag: true },
    orderBy: { task_id: 'asc' }
  });

  console.log(`\n📊 Encontradas ${completedTasks.length} tareas completadas`);

  if (completedTasks.length === 0) {
    console.log('❌ No hay tareas completadas para modificar');
    console.log('💡 Completa algunas tareas primero y luego vuelve a ejecutar este script\n');
    return;
  }

  // Distribuir las tareas en los últimos 7 días
  const today = new Date();
  const daysToDistribute = Math.min(7, completedTasks.length);
  
  console.log(`\n🔄 Distribuyendo tareas en los últimos ${daysToDistribute} días...\n`);
  
  for (let i = 0; i < completedTasks.length; i++) {
    const task = completedTasks[i];
    
    // Distribuir tareas en los últimos 7 días
    const daysAgo = i % daysToDistribute;
    const completedDate = new Date(today);
    completedDate.setDate(today.getDate() - daysAgo);
    
    // Variar las horas para que se vea más natural
    completedDate.setHours(8 + (i % 12));
    completedDate.setMinutes((i * 15) % 60);
    
    await prisma.tASKS.update({
      where: { task_id: task.task_id },
      data: { completed_at: completedDate }
    });
    
    const dateStr = completedDate.toLocaleDateString('es-ES');
    const timeStr = completedDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    console.log(`✅ Tarea ${task.task_id}: "${task.titulo}" → ${dateStr} ${timeStr}`);
  }

  console.log('\n🎉 ¡Fechas actualizadas correctamente!');
  console.log('🔄 Refresca la app para ver el gráfico con datos de varios días\n');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });