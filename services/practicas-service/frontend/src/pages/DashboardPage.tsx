import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { practicasAPI } from '../api/practicas.api';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardTitle } from '../components/ui/Card';

type DashboardSummary = {
  activeUsers: number;
  openCalls: number;
  closedCalls: number;
  studentsWithoutAssignment: number;
  openVacancies: number;
  assignedStudents: number;
};

type StudentProfile = {
  id: number;
  academic_year: number;
  career: {
    name: string;
  };
};

function StatCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string | number;
  description?: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="mt-2 text-3xl font-bold text-emerald-700">{value}</h3>
        {description && (
          <p className="mt-2 text-sm text-slate-500">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

function QuickLink({
  to,
  title,
  description,
}: {
  to: string;
  title: string;
  description: string;
}) {
  return (
    <Link to={to} className="block">
      <Card className="transition hover:-translate-y-0.5 hover:shadow-md">
        <CardContent className="p-5">
          <CardTitle className="text-lg">{title}</CardTitle>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function DashboardPage() {
  const { role, profile} = useAuth();

  const isSuperAdmin = role === 'super_admin';
  const isAdminPracticas = role === 'admin_practicas';
  const isAdminPrelocalizacion = role === 'admin_prelocalizacion';
  const isEstudiante = role === 'estudiante';
  const isEmpresa = role === 'empresa';

  const { data: studentData, isLoading: studentLoading } = useQuery<StudentProfile>({
    queryKey: ['student-profile'],
    queryFn: async () => {
      const res = await practicasAPI.getMyStudent();
      return res.data.data;
    },
    enabled: isEstudiante,
  });

  const { data: dashboardData, isLoading: dashboardLoading } = useQuery<DashboardSummary>({
    queryKey: ['dashboard-summary'],
    queryFn: async () => {
      const res = await practicasAPI.getDashboardSummary();
      return res.data.data;
    },
    enabled: isSuperAdmin,
  });

  const academicYear = studentData?.academic_year;
  const isThirdYear = academicYear === 3;
  const isFourthYear = academicYear === 4;

  const quickLinks = useMemo(() => {
    if (isSuperAdmin) {
      return [
        { to: '/agreements', title: 'Convenios', description: 'Revisar convenios y aprobaciones.' },
        { to: '/vacancies', title: 'Vacantes', description: 'Controlar plazas disponibles.' },
        { to: '/prelocalization/calls', title: 'Convocatorias', description: 'Administrar procesos de prelocalización.' },
      ];
    }

    if (isAdminPracticas) {
      return [
        { to: '/agreements', title: 'Convenios', description: 'Aprobar convenios de prácticas.' },
        { to: '/vacancies', title: 'Vacantes', description: 'Ver y controlar vacantes.' },
        { to: '/requests', title: 'Solicitudes', description: 'Revisar solicitudes de estudiantes.' },
      ];
    }

    if (isAdminPrelocalizacion) {
      return [
        { to: '/prelocalization/calls', title: 'Convocatorias', description: 'Crear, cerrar y gestionar convocatorias.' },
      ];
    }

    if (isEstudiante) {
      const links = [
        {
          to: '/students',
          title: 'Mi perfil',
          description: 'Ver mis datos académicos.',
        },
      ];

      if (isThirdYear) {
        links.push({
          to: '/requests',
          title: 'Mis solicitudes',
          description: 'Consultar mis solicitudes de prácticas.',
        });
      }

      if (isFourthYear) {
        links.push({
          to: '/prelocalization/results',
          title: 'Resultados',
          description: 'Ver resultados de prelocalización.',
        });
      }

      return links;
    }

    if (isEmpresa) {
      return [
        { to: '/companies', title: 'Mi perfil', description: 'Ver datos de la empresa.' },
        { to: '/agreements', title: 'Mis convenios', description: 'Administrar convenios solicitados.' },
        { to: '/vacancies', title: 'Mis vacantes', description: 'Ver vacantes creadas por convenio.' },
      ];
    }

    return [];
  }, [isSuperAdmin, isAdminPracticas, isAdminPrelocalizacion, isEstudiante, isEmpresa, isThirdYear, isFourthYear]);

  if (isEstudiante && studentLoading) {
    return (
      <div className="space-y-8">
        <section className="rounded-3xl bg-gradient-to-r from-emerald-700 to-red-600 p-8 text-white shadow-lg">
          <p className="text-sm font-medium opacity-90">Cargando...</p>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-r from-emerald-700 to-red-600 p-8 text-white shadow-lg">
        <p className="text-sm font-medium opacity-90">
          Gestión de Prácticas Universitarias
        </p>
        <h1 className="mt-2 text-3xl font-bold">
          Bienvenido, {profile?.full_name}
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-emerald-50">
          {isSuperAdmin && 'Panel general del sistema para supervisión institucional.'}
          {isAdminPracticas && 'Panel de control para convenios, vacantes y solicitudes de prácticas.'}
          {isAdminPrelocalizacion && 'Panel operativo para convocatorias, ranking y asignaciones.'}
          {isEstudiante && (
            <>
              Panel del estudiante para seguimiento de su proceso académico.
              {isThirdYear && ' Puedes realizar solicitudes de prácticas.'}
              {isFourthYear && ' Puedes ver los resultados de prelocalización.'}
            </>
          )}
          {isEmpresa && 'Panel de la empresa para convenios y vacantes.'}
        </p>
      </section>

      {isSuperAdmin ? (
        <>
          <section className="grid gap-6 md:grid-cols-3">
            <StatCard
              title="Usuarios activos"
              value={dashboardLoading ? '...' : dashboardData?.activeUsers ?? 0}
            />
            <StatCard
              title="Convocatorias abiertas"
              value={dashboardLoading ? '...' : dashboardData?.openCalls ?? 0}
            />
            <StatCard
              title="Convocatorias cerradas"
              value={dashboardLoading ? '...' : dashboardData?.closedCalls ?? 0}
            />
            <StatCard
              title="Estudiantes sin asignación"
              value={dashboardLoading ? '...' : dashboardData?.studentsWithoutAssignment ?? 0}
            />
            <StatCard
              title="Vacantes abiertas"
              value={dashboardLoading ? '...' : dashboardData?.openVacancies ?? 0}
            />
            <StatCard
              title="Asignaciones realizadas"
              value={dashboardLoading ? '...' : dashboardData?.assignedStudents ?? 0}
            />
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              Accesos rápidos
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {quickLinks.map((item) => (
                <QuickLink
                  key={item.to}
                  to={item.to}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>
          </section>
        </>
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatCard
              title="Rol"
              value={role ?? '-'}
              description="Acceso según permisos."
            />
            {isEstudiante && academicYear && (<StatCard
                title="Año académico"
                value={`${academicYear}° año`}
                description={
                  isThirdYear
                    ? 'Puede solicitar prácticas'
                    : isFourthYear
                    ? 'Puede ver resultados'
                    : 'Acceso limitado'
                }
              />
            )}
            <StatCard
              title="Módulos visibles"
              value={quickLinks.length}
              description="Secciones habilitadas para tu perfil."
            />
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              Accesos rápidos
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {quickLinks.map((item) => (
                <QuickLink
                  key={item.to}
                  to={item.to}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}