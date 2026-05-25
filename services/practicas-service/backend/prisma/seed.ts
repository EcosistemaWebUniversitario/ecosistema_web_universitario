import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // 🎭 Roles
 const roles = [
  { name: 'super_admin', description: 'Super administrador del ecosistema' },
  { name: 'admin_practicas', description: 'Administrador del servicio de prácticas' },
  { name: 'admin_prelocalizacion', description: 'Administrador del servicio de preubicación laboral' },
  { name: 'estudiante', description: 'Usuario estudiante' },
  { name: 'empresa', description: 'Entidad externa vinculada a la universidad' },
  { name: 'admin_horarios', description: 'Administrador del servicio de horarios' },
  { name: 'admin_votaciones', description: 'Administrador del servicio de votaciones' },
  { name: 'admin_notas', description: 'Administrador del servicio de notas' },
  { name: 'profesor', description: 'Profesor de la universidad' },
  { name: 'admin_laboratorio', description: 'Administrador del servicio de laboratorio' },
  { name: 'tecnico_laboratorio', description: 'Técnico de laboratorio' },
];

for (const role of roles) {
  await prisma.roles.upsert({
    where: { name: role.name },
    update: { description: role.description },
    create: role,
  });
}

  console.log('✔ Roles insertados');

  // 🏫 Facultades
  const faculties = await prisma.faculty.createMany({
    data: [
      { name: 'Facultad de Ciencias Económicas' },
      { name: 'Facultad de Ciencias Sociales y Humanísticas' },
      { name: 'Facultad de Cultura Física' },
      { name: 'Facultad de Ciencias de la Educación' },
      { name: 'Facultad de Ciencias Técnicas y Agropecuarias' },
    ],
    skipDuplicates: true,
  });

  console.log('✔ Facultades insertadas');

  // 🎓 Carreras
  await prisma.career.createMany({
    data: [
      // Económicas (1)
      { name: 'Licenciatura en Contabilidad y Finanzas', faculty_id: 1 },
      { name: 'Licenciatura en Economía', faculty_id: 1 },
      { name: 'Licenciatura en Educación Economía', faculty_id: 1 },

      // Sociales (2)
      { name: 'Licenciatura en Comunicación Social', faculty_id: 2 },
      { name: 'Licenciatura en Derecho', faculty_id: 2 },
      { name: 'Licenciatura en Lenguas Extranjeras', faculty_id: 2 },

      // Cultura Física (3)
      { name: 'Licenciatura en Cultura Física', faculty_id: 3 },

      // Educación (4)
      { name: 'Licenciatura en Pedagogía-Psicología', faculty_id: 4 },
      { name: 'Licenciatura en Educación Primaria', faculty_id: 4 },
      { name: 'Licenciatura en Logopedia', faculty_id: 4 },

      // Técnicas (5)
      { name: 'Ingeniería Informática', faculty_id: 5 },
      { name: 'Ingeniería Agrónoma', faculty_id: 5 },
      { name: 'Ingeniería Industrial', faculty_id: 5 },
    ],
    skipDuplicates: true,
  });

  console.log('✔ Carreras insertadas');

  // 📍 Municipios
  await prisma.municipality.createMany({
    data: [
      { name: 'Tunas' },
      { name: 'Manati' },
      { name: 'Puerto Padre' },
      { name: 'Majibacoa' },
      { name: 'Amancio' },
      { name: 'Menendez' },
      { name: 'Jobabo' },
    ],
    skipDuplicates: true,
  });

  console.log('✔ Municipios insertados');

  console.log('🌱 Seed completado');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });