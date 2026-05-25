import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/base/Button';

type NavItem = {
  to: string;
  label: string;
};

function getNavItems(role?: string): NavItem[] {
  const base: NavItem[] = [
    { to: '/dashboard', label: 'Dashboard' },
  ];

  switch (role) {
    case 'super_admin':
      return [
        ...base,
        { to: '/agreements', label: 'Convenios' },
        { to: '/vacancies', label: 'Vacantes' },
        { to: '/prelocalization/calls', label: 'Convocatorias' },
      ];
    case 'admin_practicas':
      return [
        ...base,
        { to: '/agreements', label: 'Convenios' },
        { to: '/vacancies', label: 'Vacantes' },
        { to: '/requests', label: 'Solicitudes' },
      ];
    case 'admin_prelocalizacion':
      return [
        ...base,
        { to: '/prelocalization/calls', label: 'Convocatorias' },
        { to: '/agreements', label: 'Convenios' },
      ];
    case 'estudiante':
      return [
        ...base,
        { to: '/students', label: 'Mi perfil' },
        { to: '/requests', label: 'Solicitudes' },
        { to: '/prelocalization/results', label: 'Resultados' },
      ];
    case 'empresa':
      return [
        ...base,
        { to: '/companies', label: 'Mi empresa' },
        { to: '/agreements', label: 'Convenios' },
        { to: '/vacancies', label: 'Vacantes' },
      ];
    default:
      return base;
  }
}

export default function AppLayout() {
  const {  profile, role, logout } = useAuth();
  //const navigate = useNavigate();
  const navItems = getNavItems(role ?? undefined);

  const handleLogout = () => {
  logout();                              // Limpia el estado y el token
  // Usamos replace para evitar que el historial del navegador guarde la página actual
  window.location.replace('/auth');
};

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <aside className="hidden w-72 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="flex items-center gap-3 border-b border-slate-200 p-6">
          <img
            src="/logo.png"
            alt="Universidad de Las Tunas"
            className="h-12 w-12 rounded-xl object-contain"
          />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Universidad de Las Tunas
            </p>
            <h1 className="text-base font-bold text-slate-900">
              Gestión Universitaria
            </h1>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'block rounded-xl px-4 py-3 text-sm font-medium transition',
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100',
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-200 p-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Sesión activa
            </p>
            <p className="mt-1 font-semibold text-slate-900">{profile?.full_name}</p>
            <p className="text-sm text-slate-600">{role}</p>
          </div>

          <Button
            onClick={handleLogout}
            variant="danger"
            className="mt-4 w-full"
          >
            Cerrar sesión
          </Button>
        </div>
      </aside>

      <main className="flex-1">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex items-center justify-between px-4 py-3 lg:px-6">
            <div className="flex items-center gap-3 lg:hidden">
              <img
                src="/logo.png"
                alt="Universidad de Las Tunas"
                className="h-10 w-10 rounded-lg object-contain"
              />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                  Universidad de Las Tunas
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  Gestión Universitaria
                </p>
              </div>
            </div>

            <div className="ml-auto hidden lg:block">
              <p className="text-sm font-semibold text-slate-900">{profile?.full_name}</p>
              <p className="text-xs text-slate-500">{role}</p>
            </div>

            <Button
              onClick={handleLogout}
              variant="danger"
              size="sm"
            >
              Salir
            </Button>
          </div>

          <nav className="flex gap-2 overflow-x-auto border-t border-slate-200 px-4 py-3 lg:hidden">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition',
                    isActive
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-700',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>

        <div className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}