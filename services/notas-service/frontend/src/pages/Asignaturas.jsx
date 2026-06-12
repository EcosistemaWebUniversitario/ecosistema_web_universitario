import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const Asignaturas = () => {
  const [asignaturas, setAsignaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [asignaturaToDelete, setAsignaturaToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchAsignaturas = async () => {
    setLoading(true);
    try {
      const res = await api.get("/asignaturas");
      setAsignaturas(res.data || []);
    } catch (err) {
      setError("No se pudieron cargar las asignaturas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsignaturas();
  }, []);

  const eliminarAsignatura = async () => {
    try {
      await api.delete(`/asignaturas/${asignaturaToDelete.id_asignatura}`);
      setAsignaturas(asignaturas.filter((a) => a.id_asignatura !== asignaturaToDelete.id_asignatura));
      setShowDeleteModal(false);
    } catch (err) {
      setError("No se pudo eliminar la asignatura.");
    }
  };

  const filtered = asignaturas.filter((a) =>
    a.nombre_asignatura.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout
      title="Asignaturas"
      subtitle={`${asignaturas.length} asignatura(s) registradas`}
      backTo="/"
      extra={
        <button onClick={() => navigate("/asignaturas/new")} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
          <i className="fas fa-plus mr-1"></i> Nueva Asignatura
        </button>
      }
    >
      {error && <div className="bg-red-50 text-red-800 rounded-xl p-4 text-sm mb-4">{error}</div>}

      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-4 mb-6">
        <div className="relative max-w-sm">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
          <input
            type="text"
            placeholder="Buscar asignaturas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border-slate-200 bg-slate-50 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400"><i className="fas fa-spinner fa-pulse text-3xl mb-3"></i><p>Cargando...</p></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-8 text-center">
          <i className="fas fa-book text-4xl text-slate-300 mb-3"></i>
          <h3 className="font-bold text-slate-700">
            {searchTerm ? "No se encontraron asignaturas" : "No hay asignaturas registradas"}
          </h3>
          {!searchTerm && (
            <button onClick={() => navigate("/asignaturas/new")} className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
              Agregar Primera Asignatura
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((a) => (
            <div key={a.id_asignatura} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition">
              <h3 className="font-bold text-slate-800">{a.nombre_asignatura}</h3>
              <p className="text-xs text-slate-500">ID: {a.id_asignatura}</p>
              <div className="flex gap-1 mt-3">
                <button
                  onClick={() => navigate(`/asignaturas/${a.id_asignatura}/editar`)}
                  className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  onClick={() => { setAsignaturaToDelete(a); setShowDeleteModal(true); }}
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
              ¿Estás seguro de eliminar <strong>{asignaturaToDelete?.nombre_asignatura}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Cancelar</button>
              <button onClick={eliminarAsignatura} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Asignaturas;