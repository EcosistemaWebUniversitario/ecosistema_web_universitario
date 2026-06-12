import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";

const AsignarEstudiante = () => {
  const [todos, setTodos] = useState([]);
  const [enBrigada, setEnBrigada] = useState([]);
  const [brigada, setBrigada] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const cargar = async () => {
    try {
      const [brigRes, todosRes, enRes] = await Promise.all([
        api.get(`/brigadas/${id}`),
        api.get("/estudiantes"),
        api.get(`/estudiantes/brigada/${id}`),
      ]);
      setBrigada(brigRes.data[0]);
      setTodos(todosRes.data);
      setEnBrigada((enRes.data || []).map((e) => e.id_estudiante));
    } catch (e) {
      console.error("Error al cargar:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, [id]);

  const asignar = async (idEst) => {
    setProcesando(idEst);
    try {
      await api.post(`/estudiantes/${idEst}/brigada`, { id_brigada: parseInt(id) });
      setEnBrigada((prev) => [...prev, idEst]);
      setMensaje("✓ Estudiante asignado a la brigada");
      setTimeout(() => setMensaje(""), 3000);
    } catch (e) {
      setMensaje("Error al asignar estudiante");
    } finally {
      setProcesando(null);
    }
  };

  const quitar = async (idEst) => {
    setProcesando(idEst);
    try {
      await api.post(`/estudiantes/${idEst}/brigada`, { id_brigada: null });
      setEnBrigada((prev) => prev.filter((i) => i !== idEst));
      setMensaje("✓ Estudiante quitado de la brigada");
      setTimeout(() => setMensaje(""), 3000);
    } catch (e) {
      setMensaje("Error al quitar estudiante");
    } finally {
      setProcesando(null);
    }
  };

  const filtrados = todos.filter(
    (e) =>
      e.nombre_estudiante.toLowerCase().includes(busqueda.toLowerCase()) ||
      (e.carnet && e.carnet.includes(busqueda))
  );

  const enBrigadaList = filtrados.filter((e) => enBrigada.includes(e.id_estudiante));
  const disponibles = filtrados.filter((e) => !enBrigada.includes(e.id_estudiante));

  return (
    <Layout
      title={`Gestionar estudiantes — ${brigada?.nombre_brigada || "Brigada"}`}
      subtitle={`${enBrigada.length} estudiante${enBrigada.length !== 1 ? "s" : ""} asignado${enBrigada.length !== 1 ? "s" : ""}`}
      backTo="/brigadas"
      extra={
        <button
          onClick={() => navigate("/estudiantes/new")}
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          <i className="fas fa-plus mr-1"></i> Nuevo estudiante
        </button>
      }
    >
      <div className="max-w-3xl mx-auto">
        {mensaje && (
          <div
            className={`rounded-xl p-4 text-sm mb-4 ${
              mensaje.startsWith("Error")
                ? "bg-red-50 text-red-800 border border-red-200"
                : "bg-emerald-50 text-emerald-800 border border-emerald-200"
            }`}
          >
            <i
              className={`fas ${
                mensaje.startsWith("Error") ? "fa-exclamation-triangle" : "fa-check-circle"
              } mr-1`}
            ></i>
            {mensaje}
          </div>
        )}

        <div className="relative mb-6">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
          <input
            type="text"
            placeholder="Buscar por nombre o carnet..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border-slate-200 bg-white text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400">
            <i className="fas fa-spinner fa-pulse text-3xl mb-3"></i>
            <p>Cargando...</p>
          </div>
        ) : (
          <>
            {enBrigadaList.length > 0 && (
              <>
                <h3 className="font-bold text-emerald-700 mb-3">
                  <i className="fas fa-check-circle mr-1"></i> En esta brigada
                </h3>
                <div className="space-y-2 mb-8">
                  {enBrigadaList.map((est) => (
                    <div
                      key={est.id_estudiante}
                      className="flex justify-between items-center bg-emerald-50 border border-emerald-200 rounded-xl p-4"
                    >
                      <div>
                        <div className="font-semibold text-slate-800">{est.nombre_estudiante}</div>
                        {est.carnet && <div className="text-xs text-slate-500">Carnet: {est.carnet}</div>}
                      </div>
                      <button
                        onClick={() => quitar(est.id_estudiante)}
                        disabled={procesando === est.id_estudiante}
                        className="rounded-lg bg-red-100 text-red-700 px-3 py-1.5 text-xs font-semibold hover:bg-red-200 transition disabled:opacity-50"
                      >
                        {procesando === est.id_estudiante ? "..." : "Quitar"}
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {disponibles.length > 0 && (
              <>
                <h3 className="font-bold text-slate-700 mb-3">Disponibles</h3>
                <div className="space-y-2 mb-8">
                  {disponibles.map((est) => (
                    <div
                      key={est.id_estudiante}
                      className="flex justify-between items-center bg-white border border-slate-200 rounded-xl p-4"
                    >
                      <div>
                        <div className="font-semibold text-slate-800">{est.nombre_estudiante}</div>
                        {est.carnet && <div className="text-xs text-slate-500">Carnet: {est.carnet}</div>}
                      </div>
                      <button
                        onClick={() => asignar(est.id_estudiante)}
                        disabled={procesando === est.id_estudiante}
                        className="rounded-lg bg-blue-100 text-blue-700 px-3 py-1.5 text-xs font-semibold hover:bg-blue-200 transition disabled:opacity-50"
                      >
                        {procesando === est.id_estudiante ? "..." : "Asignar"}
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {filtrados.length === 0 && (
              <p className="text-center py-12 text-slate-400">No se encontraron estudiantes</p>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default AsignarEstudiante;