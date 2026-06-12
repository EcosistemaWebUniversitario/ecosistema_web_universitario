import { useEffect, useState } from "react";
import api from "../api";
import Layout from "../components/Layout";

const HomeEst = () => {
  const [notas, setNotas] = useState([]);
  const [promedio, setPromedio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/auth";
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Obtener perfil del auth‑service (ruta correcta: /api/auth/me)
        const profileRes = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!profileRes.ok) {
          throw new Error("No se pudo obtener el perfil del usuario");
        }

        const profileData = await profileRes.json();
        const userId = profileData.id || profileData.user?.id;

        if (!userId) {
          throw new Error("No se pudo identificar al usuario");
        }

        // 2. Obtener notas y promedio usando el ID del usuario
        const [notasRes, promedioRes] = await Promise.all([
          api.get(`/notas/estudiante/${userId}`),
          api.get(`/notas/promedio/promedio/${userId}`),
        ]);

        setNotas(notasRes.data || []);
        setPromedio(promedioRes.data?.[0]?.round || null);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar las notas.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getNotaColor = (valor) => {
    const n = parseFloat(valor);
    if (n >= 4.5) return "text-emerald-600";
    if (n >= 3.5) return "text-blue-600";
    if (n >= 3.0) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <Layout
      title="Mis Notas"
      subtitle="Panel del Estudiante"
      // El estudiante normalmente no necesita un botón "Volver", pero si quieres puedes poner backTo="/"
    >
      {loading ? (
        <div className="text-center py-12 text-slate-400">
          <i className="fas fa-spinner fa-pulse text-3xl mb-3"></i>
          <p>Cargando notas...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-800 rounded-xl p-4 text-sm">{error}</div>
      ) : (
        <>
          {promedio !== null && (
            <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-6 mb-6 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Promedio General</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{promedio}</p>
            </div>
          )}

          {notas.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-8 text-center text-slate-500">
              <i className="fas fa-book-open text-4xl mb-3"></i>
              <p className="font-semibold">No hay notas registradas</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notas.map((nota) => (
                <div key={nota.id_nota} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-800">{nota.nombre_asignatura || 'Asignatura'}</h3>
                    <span className={`font-black text-lg ${getNotaColor(nota.valor)}`}>{nota.valor}</span>
                  </div>
                  <p className="text-xs text-slate-500">Año {nota.año}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Layout>
  );
};

export default HomeEst;