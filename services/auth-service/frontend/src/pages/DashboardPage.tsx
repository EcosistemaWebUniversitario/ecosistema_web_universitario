import { Link, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

type ModuleKey = 'practicas' | 'elecciones' | 'notas' | 'horarios' | 'inventario';

type ModuleConfig = {
  key: ModuleKey;
  title: string;
  description: string;
  path: string;
  badge: string;
  color: string;
  accent: string;
  allowedRoles: string[];
  available: boolean;
};

const roleLabels: Record<string, string> = {
  super_admin: 'Super administrador',
  admin_practicas: 'Administrador de prácticas',
  admin_prelocalizacion: 'Administrador de prelocalización',
  estudiante: 'Estudiante',
  empresa: 'Empresa',
  admin_horarios: 'Administrador de horarios',
  admin_votaciones: 'Administrador de votaciones',
  admin_notas: 'Administrador de notas',
  profesor: 'Profesor',
  admin_laboratorio: 'Administrador de laboratorio',
  tecnico_laboratorio: 'Técnico de laboratorio',
};

const moduleCatalog: ModuleConfig[] = [
  {
    key: 'practicas',
    title: 'Prácticas',
    description: 'Convenios, vacantes, solicitudes, ranking y asignaciones.',
    path: '/practicas',
    badge: 'Activo',
    color: 'from-emerald-500 to-emerald-700',
    accent: 'emerald',
    allowedRoles: ['super_admin', 'admin_practicas', 'admin_prelocalizacion', 'estudiante', 'empresa'],
    available: true,
  },
    {
    key: 'elecciones',
    title: 'Votaciones',
    description: 'Gestión de votaciones y procesos electorales universitarios.',
    path: '/votaciones',
    badge: 'Activo',
    color: 'from-indigo-500 to-indigo-700',
    accent: 'indigo',
    allowedRoles: ['super_admin', 'admin_votaciones', 'estudiante'],
    available: true,
  },
  {
    key: 'notas',
    title: 'Notas',
    description: 'Registro y consulta de evaluaciones académicas.',
    path: '/notas',
    badge: 'Próximamente',
    color: 'from-sky-500 to-sky-700',
    accent: 'sky',
    allowedRoles: ['super_admin', 'admin_notas', 'profesor', 'estudiante'],
    available: false,
  },
  {
    key: 'horarios',
    title: 'Horarios',
    description: 'Planificación, consulta y administración de horarios.',
    path: '/horarios',
    badge: 'Activo',
    color: 'from-violet-500 to-violet-700',
    accent: 'violet',
    allowedRoles: ['super_admin', 'admin_horarios', 'estudiante'],
    available: true,
  },
  {
    key: 'inventario',
    title: 'Inventario',
    description: 'Control de laboratorios, recursos y equipos técnicos.',
    path: '/inventario',
    badge: 'Próximamente',
    color: 'from-amber-500 to-amber-700',
    accent: 'amber',
    allowedRoles: ['super_admin', 'admin_laboratorio', 'tecnico_laboratorio'],
    available: false,
  },
];

function canAccessModule(role: string | null, module: ModuleConfig) {
  if (!role) return false;
  if (role === 'super_admin') return true;
  return module.allowedRoles.includes(role);
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, profile, role, permissions, logout } = useAuth();

  const currentRoleLabel = role ? roleLabels[role] ?? role : 'Sin rol';

  const visibleModules = useMemo(() => {
    return moduleCatalog.map((module) => ({
      ...module,
      canAccess: canAccessModule(role, module),
    }));
  }, [role]);

  const accessibleModules = visibleModules.filter(
    (module) => module.canAccess && module.available,
  );

  const blockedModules = visibleModules.filter(
    (module) => !module.canAccess || !module.available,
  );

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-0 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900 px-8 py-10 text-white lg:px-10">
            <div className="absolute inset-0 opacity-20"><div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-emerald-500 blur-3xl" />
              <div className="absolute bottom-0 right-0 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
            </div>

            <div className="relative flex flex-col gap-6">
              <div className="inline-flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-lg font-black text-white">
                  U
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                    Ecosistema Web Universitario
                  </p>
                  <h1 className="text-lg font-bold text-white">
                    Panel principal de acceso
                  </h1>
                </div>
              </div>

              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">
                  Bienvenido
                </p>
                <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
                  Gestiona tus módulos desde un solo lugar.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-white/75">
                  Tu acceso se adapta automáticamente según tu rol dentro del ecosistema.
                  Desde aquí podrás entrar a los servicios disponibles para tu perfil.
                </p>
              </div>

              
            </div>
          </div>

          <div className="bg-slate-50 px-8 py-10 lg:px-10">
            <div className="grid gap-4">
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Usuario
                </p>
                <p className="mt-2 text-lg font-bold text-slate-900">
                  {user?.email ?? 'No disponible'}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {profile?.full_name ?? 'Perfil sin completar'}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Rol activo
                </p>
                <p className="mt-2 text-lg font-bold text-slate-900">{currentRoleLabel}</p>
                <p className="mt-1 text-sm text-slate-600">
                  {profile?.account_type ? `Cuenta ${profile.account_type} `: 'Tipo de cuenta no disponible'}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Estado del acceso
                </p>
                <p className="mt-2 text-lg font-bold text-emerald-600">
                  Sesión activa
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {permissions.length > 0
                    ? `${permissions.length} permisos activos`
                    : 'Sin permisos cargados'}
                </p>
              </div></div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Módulos disponibles
            </p>
            <p className="mt-3 text-3xl font-black text-slate-900">{accessibleModules.length}</p>
            <p className="mt-2 text-sm text-slate-600">
              Servicios que ya puedes abrir según tu rol.
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Módulos futuros
            </p>
            <p className="mt-3 text-3xl font-black text-slate-900">{blockedModules.length}</p>
            <p className="mt-2 text-sm text-slate-600">
              Servicios previstos para integrarse más adelante.
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Permisos
            </p>
            <p className="mt-3 text-3xl font-black text-slate-900">{permissions.length}</p>
            <p className="mt-2 text-sm text-slate-600">
              Capacidades reconocidas por el sistema.
            </p>
          </CardContent>
        </Card>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Accesos por rol
            </p>
            <h3 className="mt-2 text-2xl font-black text-slate-900">
              Módulos y servicios
            </h3>
          </div>
          <p className="hidden text-sm text-slate-500 md:block">
            Los módulos se muestran según tu rol autenticado.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {visibleModules.map((module) => {
            const isActive = module.canAccess && module.available;

            return (
              <Card
                key={module.key}
                className={`overflow-hidden border-slate-200 shadow-sm transition duration-200 ${
                  isActive ? 'hover:-translate-y-1 hover:shadow-lg' : 'opacity-85'
                }`}
              >
                <div className={`h-2 w-full bg-gradient-to-r ${module.color}`} />
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-xl text-slate-900">{module.title}</CardTitle>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        isActive
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {isActive ? 'Disponible' : module.badge}
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-slate-600">{module.description}</p>
                </CardHeader>

                <CardContent className="p-6 pt-0">
                  <div className="flex flex-wrap gap-2">
                    {module.allowedRoles.map((allowedRole) => (
                      <span
                        key={allowedRole}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                      >
                        {roleLabels[allowedRole] ?? allowedRole}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6">
                    {isActive ? (<a
                      href={module.path}
                        className="inline-flex w-full items-center justify-center rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
                      >
                         Entrar
                      </a>
                    ) : (
                      <div className="inline-flex w-full items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-3 font-semibold text-slate-400">
                        Próximamente
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}