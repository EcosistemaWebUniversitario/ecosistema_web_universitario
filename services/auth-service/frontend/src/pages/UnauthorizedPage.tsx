import { Link } from 'react-router-dom';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo y título (mismo estilo que las otras páginas) */}
          <div className="mb-8 text-center">
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
          </div>

          {/* Tarjeta de acceso denegado con estilo glassmorphism */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-emerald-500/5" />

            <div className="relative">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20 text-4xl">
                🔒
              </div>
              <h1 className="text-3xl font-black tracking-tight text-white">
                Acceso denegado
              </h1>
              <p className="mt-3 text-white/70">
                No tienes permisos suficientes o tu sesión no es válida. Por favor, inicia sesión nuevamente.
              </p>
              <Link
                to="/login"
                className="mt-6 inline-flex rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400"
              >
                Ir a iniciar sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}