import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";

const AsigCarrera = () => {
  const [asignaturas, setAsignaturas] = useState([]);
  const [carreraInfo, setCarreraInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [carreraRes, asigRes] = await Promise.all([
          api.get(`/carreras/${params.id}`),
          api.get(`/asignaturas/carrera/${params.id}`),
        ]);
        setCarreraInfo(carreraRes.data[0]);
        setAsignaturas(asigRes.data || []);
      } catch (err) {
        setError("No se pudieron cargar las asignaturas.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  const eliminarAsignatura = async (id, nombre) => {
    if (!window.confirm(`¿Eliminar la asignatura "${nombre}"?`)) return;
    try {
      await api.delete(`/asignaturas/${params.id}/${id}`);
      setAsignaturas(asignaturas.filter((a) => a.id_asignatura !== id));
      setSuccessMessage("Asignatura eliminada");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("No se pudo eliminar la asignatura.");
    }
  };

  const getAñoColor = (año) => {
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#ef4444"];
    return colors[(año - 1) % colors.length] || "#6b7280";
  };

  const asignaturasPorAño = () => {
    const agrupadas = {};
    asignaturas.forEach((a) => {
      const año = a.año || 1;
      if (!agrupadas[año]) agrupadas[año] = [];
      agrupadas[año].push(a);
    });
    return agrupadas;
  };

  return (
    <Layout
      title="Asignaturas de la Carrera"
      subtitle={
        carreraInfo
          ? `${carreraInfo.nombre_carrera} (${carreraInfo.años || 5} años)`
          : "Cargando…"
      }
      backTo="/carreras"
      extra={
        <button
          onClick={() => navigate(`/carreras/asignaturas/${params.id}/new`)}
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          <i className="fas fa-plus mr-1"></i> Nueva Asignatura
        </button>
      }
    >
      {error && <div className="bg-red-50 text-red-800 rounded-xl p-4 text-sm mb-4">{error}</div>}
      {successMessage && <div className="bg-emerald-50 text-emerald-800 rounded-xl p-4 text-sm mb-4">{successMessage}</div>}

      {loading ? (
        <div className="text-center py-12 text-slate-400"><i className="fas fa-spinner fa-pulse text-3xl mb-3"></i><p>Cargando…</p></div>
      ) : asignaturas.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-8 text-center">
          <i className="fas fa-book-open text-4xl text-slate-300 mb-3"></i>
          <h3 className="font-bold text-slate-700">No hay asignaturas registradas</h3>
          <button
            onClick={() => navigate(`/carreras/asignaturas/${params.id}/new`)}
            className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Agregar Primera Asignatura
          </button>
        </div>
      ) : (
        Object.keys(asignaturasPorAño()).sort().map((año) => (
          <div key={año} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span
                className="rounded-full px-3 py-1 text-xs font-bold text-white"
                style={{ backgroundColor: getAñoColor(parseInt(año)) }}
              >
                Año {año}
              </span>
              <span className="text-sm text-slate-500">
                {asignaturasPorAño()[año].length} asignatura{asignaturasPorAño()[año].length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {asignaturasPorAño()[año].map((a) => (
                <div key={a.id_asignatura} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition">
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg font-bold text-lg"
                      style={{ backgroundColor: getAñoColor(parseInt(año)) + "20", color: getAñoColor(parseInt(año)) }}
                    >
                      {a.nombre_asignatura.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{a.nombre_asignatura}</h3>
                      {a.año && a.semestre && (
                        <p className="text-xs text-slate-500">A{a.año} - S{a.semestre}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => navigate(`/carreras/asignaturas/${params.id}/${a.id_asignatura}/editar`)}
                      className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => eliminarAsignatura(a.id_asignatura, a.nombre_asignatura)}
                      className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </Layout>
  );
};

export default AsigCarrera;