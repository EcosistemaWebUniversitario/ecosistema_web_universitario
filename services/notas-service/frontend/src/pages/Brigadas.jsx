import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const Brigadas = () => {
  const [brigadas, setBrigadas] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [selectedCarrera, setSelectedCarrera] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [brigadaToDelete, setBrigadaToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCarreras = async () => {
      try {
        const res = await api.get("/carreras");
        setCarreras(res.data || []);
      } catch (err) {
        setError("No se pudieron cargar las carreras.");
      }
    };
    fetchCarreras();
  }, []);

  useEffect(() => {
    const fetchBrigadas = async () => {
      setLoading(true);
      try {
        const url = selectedCarrera
          ? `/brigadas/carrera/${selectedCarrera}`
          : "/brigadas";
        const res = await api.get(url);
        setBrigadas(res.data || []);
      } catch (err) {
        setError("No se pudieron cargar las brigadas.");
      } finally {
        setLoading(false);
      }
    };
    fetchBrigadas();
  }, [selectedCarrera]);

  const eliminarBrigada = async () => {
    try {
      await api.delete(`/brigadas/${brigadaToDelete.id_brigada}`);
      setBrigadas(brigadas.filter((b) => b.id_brigada !== brigadaToDelete.id_brigada));
      setShowDeleteModal(false);
    } catch (err) {
      setError("No se pudo eliminar la brigada.");
    }
  };

  const getCarreraNombre = (id) => {
    const c = carreras.find((x) => x.id_carrera === id);
    return c ? c.nombre_carrera : "Sin carrera";
  };

  return (
    <Layout
      title="Brigadas"
      subtitle={`${brigadas.length} brigada(s) registradas`}
      backTo="/"
      extra={
        <button onClick={() => navigate("/brigadas/new")} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
          <i className="fas fa-plus mr-1"></i> Nueva Brigada
        </button>
      }
    >
      {error && <div className="bg-red-50 text-red-800 rounded-xl p-4 text-sm mb-4">{error}</div>}

      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-4 mb-6 flex flex-wrap gap-3 items-center">
        <label className="text-sm font-semibold text-slate-600">Filtrar por Carrera:</label>
        <select
          value={selectedCarrera}
          onChange={(e) => setSelectedCarrera(e.target.value)}
          className="rounded-xl border-slate-200 bg-slate-50 px-3 py-2 text-sm"
        >
          <option value="">Todas las Carreras</option>
          {carreras.map((c) => (
            <option key={c.id_carrera} value={c.id_carrera}>{c.nombre_carrera}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400"><i className="fas fa-spinner fa-pulse text-3xl mb-3"></i><p>Cargando...</p></div>
      ) : brigadas.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-8 text-center">
          <i className="fas fa-users text-4xl text-slate-300 mb-3"></i>
          <h3 className="font-bold text-slate-700">No hay brigadas registradas</h3>
          <button onClick={() => navigate("/brigadas/new")} className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
            Agregar Primera Brigada
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {brigadas.map((b) => (
            <div key={b.id_brigada} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition">
              <h3 className="font-bold text-slate-800">{b.nombre_brigada}</h3>
              <p className="text-xs text-slate-500">{getCarreraNombre(b.id_carrera)}</p>
              <p className="text-xs text-slate-400 mt-1">{b.año_brigada} – {b.añoFinal_brigada}</p>
              <div className="flex gap-1 mt-3">
                <button
                  onClick={() => navigate(`/brigadas/${b.id_brigada}/estudiantes`)}
                  className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <i className="fas fa-user-graduate"></i> Estudiantes
                </button>
                <button
                  onClick={() => navigate(`/brigadas/${b.id_brigada}/editar`)}
                  className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  onClick={() => { setBrigadaToDelete(b); setShowDeleteModal(true); }}
                  className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl ring-1 ring-slate-200">
            <h3 className="font-bold text-slate-900 mb-2">Confirmar Eliminación</h3>
            <p className="text-sm text-slate-600 mb-4">
              ¿Estás seguro de eliminar <strong>{brigadaToDelete?.nombre_brigada}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Cancelar</button>
              <button onClick={eliminarBrigada} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Brigadas;