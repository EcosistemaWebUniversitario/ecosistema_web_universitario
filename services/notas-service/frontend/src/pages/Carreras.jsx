import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const Carreras = () => {
  const [carreras, setCarreras] = useState([]);
  const [facultades, setFacultades] = useState([]);
  const [selectedFacultad, setSelectedFacultad] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [carreraToDelete, setCarreraToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFacultades = async () => {
      try {
        const res = await api.get("/facultades");
        setFacultades(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFacultades();
  }, []);

  useEffect(() => {
    const fetchCarreras = async () => {
      setLoading(true);
      try {
        const url = selectedFacultad
          ? `/carreras/facultad/${selectedFacultad}`
          : "/carreras";
        const res = await api.get(url);
        setCarreras(res.data || []);
      } catch (err) {
        setError("No se pudieron cargar las carreras.");
      } finally {
        setLoading(false);
      }
    };
    fetchCarreras();
  }, [selectedFacultad]);

  const eliminarCarrera = async () => {
    try {
      await api.delete(`/carreras/${carreraToDelete.id_carrera}`);
      setCarreras(carreras.filter((c) => c.id_carrera !== carreraToDelete.id_carrera));
      setShowDeleteModal(false);
    } catch (err) {
      setError("No se pudo eliminar la carrera.");
    }
  };

  const getFacultadNombre = (id) => {
    const f = facultades.find((x) => x.id_facultad === id);
    return f ? f.nombre_facultad : "Sin facultad";
  };

  return (
    <Layout
      title="Carreras"
      subtitle={`${carreras.length} carrera(s) registradas`}
      backTo="/"
      extra={
        <button onClick={() => navigate("/carreras/new")} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
          <i className="fas fa-plus mr-1"></i> Nueva Carrera
        </button>
      }
    >
      {error && <div className="bg-red-50 text-red-800 rounded-xl p-4 text-sm mb-4">{error}</div>}

      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-4 mb-6">
        <label className="text-sm font-semibold text-slate-600 mr-2">Filtrar por Facultad:</label>
        <select
          value={selectedFacultad}
          onChange={(e) => setSelectedFacultad(e.target.value)}
          className="rounded-xl border-slate-200 bg-slate-50 px-3 py-2 text-sm"
        >
          <option value="">Todas las Facultades</option>
          {facultades.map((f) => (
            <option key={f.id_facultad} value={f.id_facultad}>{f.nombre_facultad}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400"><i className="fas fa-spinner fa-pulse text-3xl mb-3"></i><p>Cargando...</p></div>
      ) : carreras.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-8 text-center">
          <i className="fas fa-graduation-cap text-4xl text-slate-300 mb-3"></i>
          <h3 className="font-bold text-slate-700">No hay carreras registradas</h3>
          <button onClick={() => navigate("/carreras/new")} className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
            Agregar Primera Carrera
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {carreras.map((c) => (
            <div key={c.id_carrera} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition">
              <h3 className="font-bold text-slate-800">{c.nombre_carrera}</h3>
              <p className="text-xs text-slate-500">{getFacultadNombre(c.id_facultad)}</p>
              <p className="text-xs text-slate-400 mt-1">{c.años} años</p>
              <div className="flex gap-1 mt-3">
                <button
                  onClick={() => navigate(`/carreras/asignaturas/${c.id_carrera}`)}
                  className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <i className="fas fa-book"></i> Asignaturas
                </button>
                <button
                  onClick={() => navigate(`/carreras/${c.id_carrera}/editar`)}
                  className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  onClick={() => { setCarreraToDelete(c); setShowDeleteModal(true); }}
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
              ¿Estás seguro de eliminar <strong>{carreraToDelete?.nombre_carrera}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Cancelar</button>
              <button onClick={eliminarCarrera} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Carreras;