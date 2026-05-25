import { Link } from 'react-router-dom';

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 py-12">
        <div className="grid w-full gap-12 lg:grid-cols-2 lg:items-start">
          {/* Columna izquierda: presentación y acciones */}
          <section className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-lg font-black text-white">
                U
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                  Universidad de Las Tunas
                </p>
                <h1 className="text-lg font-bold text-white">
                  Ecosistema Web Universitario
                </h1>
              </div>
            </div>

            <div className="max-w-2xl">
              <h2 className="text-4xl font-black tracking-tight text-white md:text-6xl">
                Gestión universitaria
                <span className="block text-emerald-400">modular, centralizada y segura.</span>
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/70">
                Una plataforma institucional basada en microservicios independientes, que conecta prácticas, elecciones, notas, horarios e inventario.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/login"
                className="rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Registrarse
              </Link>
            </div>
          </section>

          {/* Columna derecha: microservicios y detalles */}
          <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/15 via-transparent to-red-500/10" />

            <div className="relative rounded-[1.5rem] bg-gradient-to-br from-emerald-500 to-slate-900 p-6 text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
                Arquitectura de microservicios
              </p>
              <h3 className="mt-2 text-2xl font-black md:text-3xl">
                Módulos independientes y conectados
              </h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-white/85">
                Cada servicio se desarrolla, escala y mantiene por separado, garantizando robustez y evolución continua.
              </p>
            </div>

            <div className="relative mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Servicio de Autenticación */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                <p className="text-sm font-semibold text-white">🔐 Autenticación</p>
                <p className="mt-1 text-sm text-white/65">
                  Gestión de autenticación y autorización (Auth).
                </p>
              </div>

              {/* Servicio de Prácticas */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                <p className="text-sm font-semibold text-white">💼 Prácticas</p>
                <p className="mt-1 text-sm text-white/65">
                  Control de prácticas profesionales y preubicación laboral.
                </p>
              </div>

              {/* Servicio de Elecciones */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                <p className="text-sm font-semibold text-white">🗳️ Elecciones</p>
                <p className="mt-1 text-sm text-white/65">
                  Gestión de procesos electorales estudiantiles.
                </p>
              </div>

              {/* Servicio de Notas */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                <p className="text-sm font-semibold text-white">📊 Notas</p>
                <p className="mt-1 text-sm text-white/65">
                  Gestión y control de calificaciones académicas.
                </p>
              </div>

              {/* Servicio de Horarios */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                <p className="text-sm font-semibold text-white">📅 Horarios</p>
                <p className="mt-1 text-sm text-white/65">
                  Creación y consulta de horarios de clases.
                </p>
              </div>

              {/* Servicio de Inventario */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                <p className="text-sm font-semibold text-white">🖥️ Inventario</p>
                <p className="mt-1 text-sm text-white/65">
                  Control de equipos y materiales en laboratorios.
                </p>
              </div>
            </div>

            <div className="relative mt-6 text-center text-xs text-white/50">
              Ecosistema preparado para nuevos módulos
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}