import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const Facultades = () => {
  const [facultades, setFacultades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [facultadToDelete, setFacultadToDelete] = useState(null);
  const navigate = useNavigate();

  const fetchFacultades = async () => {
    try {
      setLoading(true);
      const res = await api.get("/facultades");
      setFacultades(res.data);
    } catch {
      setError("No se pudieron cargar las facultades.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFacultades(); }, []);

  const eliminarFacultad = async () => {
    try {
      await api.delete(`/facultades/${facultadToDelete.id_facultad}`);
      setFacultades(facultades.filter((f) => f.id_facultad !== facultadToDelete.id_facultad));
      setShowDeleteModal(false);
    } catch {
      setError("No se pudo eliminar la facultad.");
    }
  };

  return (
    <Layout
      title="Facultades"
      subtitle={`${facultades.length} facultad(es) registradas`}
      backTo="/"
      extra={
        <button onClick={() => navigate("/facultades/new")} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
          <i className="fas fa-plus mr-1"></i> Nueva Facultad
        </button>
      }
    >
      {error && <div className="bg-red-50 text-red-800 rounded-xl p-4 text-sm mb-4">{error}</div>}

      {loading ? (
        <div className="text-center py-12 text-slate-400"><i className="fas fa-spinner fa-pulse text-3xl mb-3"></i><p>Cargando...</p></div>
      ) : facultades.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-8 text-center">
          <i className="fas fa-university text-4xl text-slate-300 mb-3"></i>
          <h3 className="font-bold text-slate-700">No hay facultades registradas</h3>
          <button onClick={() => navigate("/facultades/new")} className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
            Agregar Primera Facultad
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {facultades.map((f) => (
            <div key={f.id_facultad} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition">
              <h3 className="font-bold text-slate-800">{f.nombre_facultad}</h3>
              <p className="text-xs text-slate-500">ID: {f.id_facultad}</p>
              <div className="flex gap-1 mt-3">
                <button onClick={() => navigate(`/facultades/${f.id_facultad}/editar`)} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                  <i className="fas fa-edit"></i>
                </button>
                <button onClick={() => { setFacultadToDelete(f); setShowDeleteModal(true); }} className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">
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
            <p className="text-sm text-slate-600 mb-4">¿Estás seguro de eliminar <strong>{facultadToDelete?.nombre_facultad}</strong>?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Cancelar</button>
              <button onClick={eliminarFacultad} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Facultades;