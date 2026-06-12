import { useNavigate } from "react-router-dom";

/**
 * Props:
 *  - title      : texto principal de la cabecera
 *  - subtitle   : texto secundario (opcional)
 *  - backTo     : ruta a la que redirige el botón "Volver". Si no se pasa, el botón no aparece.
 *  - extra      : nodo React que se renderiza junto al botón "Volver" (ej. botones de acción)
 *  - children   : contenido de la página (el formulario, la tabla, etc.)
 */
const Layout = ({ title, subtitle, backTo, extra, children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/auth";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Cabecera unificada del ecosistema */}
      <header className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-900 text-white py-4 px-4 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-lg font-black text-white">U</div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">{title}</h1>
              {subtitle && <p className="text-xs text-emerald-200">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Botón Volver (solo si se pasa la ruta backTo) */}
            {backTo && (
              <button
                onClick={() => navigate(backTo)}
                className="rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/20"
              >
                <i className="fas fa-arrow-left mr-1"></i> Volver
              </button>
            )}

            {/* Botones extra (por ejemplo "Nueva Nota", "Inicio", etc.) */}
            {extra && extra}

            {/* Botón de cerrar sesión */}
            <button
              onClick={handleLogout}
              className="rounded-xl border border-red-400/30 px-3 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/20 transition"
            >
              <i className="fas fa-sign-out-alt mr-1"></i> Salir
            </button>
          </div>
        </div>
      </header>

      {/* Contenido de la página */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;