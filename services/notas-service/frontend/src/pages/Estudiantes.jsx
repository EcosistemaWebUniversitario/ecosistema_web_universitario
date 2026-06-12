import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const Estudiantes = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [brigadas, setBrigadas] = useState([]);
  const [selectedBrigada, setSelectedBrigada] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBrigadas = async () => {
      try {
        const res = await api.get("/brigadas");
        setBrigadas(res.data || []);
      } catch (err) {
        setError("No se pudieron cargar las brigadas.");
      }
    };
    fetchBrigadas();
  }, []);

  useEffect(() => {
    const fetchEstudiantes = async () => {
      setLoading(true);
      try {
        const url = selectedBrigada
          ? `/estudiantes/brigada/${selectedBrigada}`
          : "/estudiantes";
        const res = await api.get(url);
        setEstudiantes(res.data || []);
      } catch (err) {
        setError("No se pudieron cargar los estudiantes.");
      } finally {
        setLoading(false);
      }
    };
    fetchEstudiantes();
  }, [selectedBrigada]);

  const eliminarEstudiante = async (id, nombre) => {
    if (!window.confirm(`¿Eliminar al estudiante ${nombre}?`)) return;
    try {
      await api.delete(`/estudiantes/${id}`);
      setEstudiantes(estudiantes.filter((e) => e.id_estudiante !== id));
      setSuccessMessage("Estudiante eliminado");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("No se pudo eliminar el estudiante.");
    }
  };

  const getBrigadaNombre = (idBrigada) => {
    const b = brigadas.find((x) => x.id_brigada === idBrigada);
    return b ? b.nombre_brigada : "Sin brigada";
  };

  return (
    <Layout
      title="Estudiantes"
      subtitle={`${estudiantes.length} estudiante(s) registrados`}
      backTo="/"
      extra={
        <button onClick={() => navigate("/estudiantes/new")} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
          <i className="fas fa-plus mr-1"></i> Nuevo Estudiante
        </button>
      }
    >
      {error && <div className="bg-red-50 text-red-800 rounded-xl p-4 text-sm mb-4">{error}</div>}
      {successMessage && <div className="bg-emerald-50 text-emerald-800 rounded-xl p-4 text-sm mb-4">{successMessage}</div>}

      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-4 mb-6">
        <label className="text-sm font-semibold text-slate-600 mr-2">Filtrar por Brigada:</label>
        <select
          value={selectedBrigada}
          onChange={(e) => setSelectedBrigada(e.target.value)}
          className="rounded-xl border-slate-200 bg-slate-50 px-3 py-2 text-sm"
        >
          <option value="">Todas las Brigadas</option>
          {brigadas.map((b) => (
            <option key={b.id_brigada} value={b.id_brigada}>{b.nombre_brigada}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400"><i className="fas fa-spinner fa-pulse text-3xl mb-3"></i><p>Cargando...</p></div>
      ) : estudiantes.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-8 text-center">
          <i className="fas fa-user-graduate text-4xl text-slate-300 mb-3"></i>
          <h3 className="font-bold text-slate-700">No hay estudiantes registrados</h3>
          <button onClick={() => navigate("/estudiantes/new")} className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
            Agregar Primer Estudiante
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {estudiantes.map((e) => (
            <div key={e.id_estudiante} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm">
                  {e.nombre_estudiante?.charAt(0) || "E"}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{e.nombre_estudiante}</h3>
                  <p className="text-xs text-slate-500">{e.carnet}</p>
                  <p className="text-xs text-slate-400">{getBrigadaNombre(e.id_brigada)}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => navigate(`/estudiantes/notas/${e.id_brigada || 0}/${e.id_estudiante}`)}
                  className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <i className="fas fa-clipboard-list"></i> Notas
                </button>
                <button
                  onClick={() => navigate(`/estudiantes/${e.id_estudiante}/editar`)}
                  className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  onClick={() => eliminarEstudiante(e.id_estudiante, e.nombre_estudiante)}
                  className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Estudiantes;