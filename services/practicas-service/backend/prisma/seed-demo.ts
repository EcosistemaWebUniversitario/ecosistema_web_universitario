import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

const demoUsers = [
  {
    email: 'admin@practicas.com',
    password: 'admin123',
    full_name: 'Admin Prácticas',
    role_name: 'admin_practicas',
    account_type: 'admin' as const,
  },
  {
    email: 'admin@prelocalizacion.com',
    password: 'admin123',
    full_name: 'Admin Prelocalización',
    role_name: 'admin_prelocalizacion',
    account_type: 'admin' as const,
  },
  {
    email: 'empresa@demo.com',
    password: 'empresa123',
    full_name: 'Empresa Demo',
    role_name: 'empresa',
    account_type: 'empresa' as const,
  },
  {
    email: 'estudiante1@demo.com',
    password: 'estudiante123',
    full_name: 'Rafael Cruz',
    role_name: 'estudiante',
    account_type: 'estudiante' as const,
  },
  {
    email: 'estudiante2@demo.com',
    password: 'estudiante123',
    full_name: 'María García',
    role_name: 'estudiante',
    account_type: 'estudiante' as const,
  },
];

async function seedSupabaseUsers() {
  console.log('👤 Creando usuarios en Supabase Auth...');

  const createdUsers: Array<{
    id: string;
    email: string;
    password: string;
    full_name: string;
    role_name: string;
    account_type: 'estudiante' | 'empresa'| 'admin';
  }> = [];

  for (const userData of demoUsers) {
    try {
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existingUser = existingUsers.users.find(u => u.email === userData.email);

      if (existingUser) {
        console.log(`⚠️ Usuario ${userData.email} ya existe, reutilizando...`);
        createdUsers.push({ ...userData, id: existingUser.id });
        continue;
      }

      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: { full_name: userData.full_name },
      });

      if (authError) {
        console.error(`❌ Error creando usuario ${userData.email}:`, authError.message);
        continue;
      }

      console.log(`✔ Usuario creado en Supabase Auth: ${userData.email}`);
      createdUsers.push({ ...userData, id: authUser.user.id });
    } catch (error) {
      console.error(`❌ Error procesando usuario ${userData.email}:`, error);
    }
  }

  return createdUsers;
}

async function seedProfiles(createdUsers: any[]) {
  console.log('👤 Creando perfiles...');

  for (const user of createdUsers) {
    try {
      const role = await prisma.roles.findFirst({
        where: { name: user.role_name },
      });

      if (!role) {
        console.error(`❌ Rol no encontrado: ${user.role_name}`);
        continue;
      }

      await prisma.profiles.upsert({
        where: { id: user.id },
        update: {
          full_name: user.full_name,
          role_id: role.id,
          account_type: user.account_type,
        },
        create: {
          id: user.id,
          full_name: user.full_name,
          role_id: role.id,
          account_type: user.account_type,
        },
      });

      console.log(`✔ Perfil creado/actualizado: ${user.full_name} (${user.account_type})`);
    } catch (error) {
      console.error(`❌ Error creando perfil para ${user.email}:`, error);
    }
  }
}

async function seedBaseCatalogs() {
  console.log('📚 Creando catálogos base...');

  // Municipio: usar name único
  const municipality = await prisma.municipality.upsert({
    where: { name: 'Tunas' },
    update: {},
    create: { name: 'Tunas' },
  });

  console.log('✔ Municipio creado:', municipality.name);

  // Carrera: buscar por nombre y facultad (nombre no es único, pero combinación nombre+facultad sí lo es en la práctica)
  const career = await prisma.career.upsert({
    where: { id: 1 }, // Se asume que el seed-base ya creó esta carrera con ID 1
    update: {},
    create: {
      name: 'Ingeniería Informática',
      faculty_id: 5,
    },
  });

  console.log('✔ Carrera creada:', career.name);

  return { municipality, career };
}

async function seedBusinessData(createdUsers: any[], catalogs: any) {
  console.log('🏢 Creando datos de negocio...');

  const { municipality, career } = catalogs;

  const companyUser = createdUsers.find(u => u.account_type === 'empresa');
  if (companyUser) {
    const company = await prisma.company.upsert({
      where: { profile_id: companyUser.id },
      update: {},
      create: {
        profile_id: companyUser.id,
        name: 'Empresa Demo',
        phone: '5551234567',
        address: 'Calle 1 entre A y B',
        municipality_id: municipality.id,
      },
    });

    console.log('✔ Empresa creada:', company.name);

    const agreement = await prisma.agreement.upsert({
      where: { id: 1 },
      update: {},
      create: {
        company_id: company.id,
        type: 'PRACTICE',
        title: 'Convenio de Prácticas Informática',
        description: 'Convenio para prácticas profesionales en TI',
        specialty: 'Informática',
        students_needed: 2,
        status: 'APPROVED',
        approved_by_practices: true,
        approved_by_prelocation: false,
      },
    });

    console.log('✔ Acuerdo creado:', agreement.title);

    const vacancy = await prisma.vacancy.upsert({
      where: { id: 1 },
      update: {},
      create: {
        agreement_id: agreement.id,
        title: 'Desarrollador Backend',
        specialty: 'Informática',
        slots: 1,
        status: 'OPEN',
      },
    });

    console.log('✔ Vacante creada:', vacancy.title);
  }

  const studentUsers = createdUsers.filter(u => u.account_type === 'estudiante');
  for (let i = 0; i < studentUsers.length; i++) {
    const studentUser = studentUsers[i];
    const student = await prisma.student.upsert({
      where: { profile_id: studentUser.id },
      update: {},
      create: {
        profile_id: studentUser.id,
        names: studentUser.full_name.split(' ')[0],
        surnames: studentUser.full_name.split(' ').slice(1).join(' '),
        ci: `1234567890${i + 1}`,
        academic_year: 3,
        career_id: career.id,
        municipality_id: municipality.id,
      },
    });

    console.log('✔ Estudiante creado:', student.names, student.surnames);
  }
}

async function main() {
  console.log('🌱 Iniciando seed-demo completo...');

  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ Variables de entorno requeridas: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
      return;
    }

    const adminRole = await prisma.roles.findFirst({ where: { name: 'admin_practicas' } });
    if (!adminRole) {
      console.error('❌ Datos base no encontrados. Ejecuta primero: npm run seed:base');
      return;
    }

    const createdUsers = await seedSupabaseUsers();
    await seedProfiles(createdUsers);
    const catalogs = await seedBaseCatalogs();
    await seedBusinessData(createdUsers, catalogs);

    console.log('✅ Seed-demo completado exitosamente!');
    console.log('\n📋 Usuarios de demo creados:');
    createdUsers.forEach(user => {
      console.log(`   ${user.email} - ${user.full_name} (${user.account_type})`);
    });
  } catch (error) {
    console.error('❌ Error en seed-demo:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();