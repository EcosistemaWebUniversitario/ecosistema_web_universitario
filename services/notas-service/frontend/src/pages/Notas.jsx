import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";

const Notas = () => {
  const [notas, setNotas] = useState([]);
  const [promedio, setPromedio] = useState(null);
  const [estudianteInfo, setEstudianteInfo] = useState(null);
  const [brigadaInfo, setBrigadaInfo] = useState(null);
  const [selectedAño, setSelectedAño] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [estRes, brigRes] = await Promise.all([
          api.get(`/estudiantes/${params.idEstudiante}`),
          api.get(`/brigadas/${params.idBrigada}`),
        ]);
        setEstudianteInfo(estRes.data[0]);
        setBrigadaInfo(brigRes.data[0]);
      } catch (err) {
        setError("No se pudieron cargar los datos.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.idBrigada, params.idEstudiante]);

  useEffect(() => {
    const fetchPromedio = async () => {
      try {
        const res = await api.get(`/notas/promedio/promedio/${params.idEstudiante}`);
        setPromedio(res.data[0]?.round || null);
      } catch (err) {
        // Silencioso
      }
    };
    if (params.idEstudiante) fetchPromedio();
  }, [params.idEstudiante]);

  useEffect(() => {
    const fetchNotas = async () => {
      setLoading(true);
      try {
        const url = selectedAño
          ? `/notas/estudiante/${params.idEstudiante}/${selectedAño}`
          : `/notas/estudiante/${params.idEstudiante}`;
        const res = await api.get(url);
        setNotas(res.data || []);
      } catch (err) {
        setError("No se pudieron cargar las notas.");
      } finally {
        setLoading(false);
      }
    };
    if (params.idEstudiante) fetchNotas();
  }, [params.idEstudiante, selectedAño]);

  const eliminarNota = async (id) => {
    if (!confirm("¿Eliminar esta nota?")) return;
    try {
      await api.delete(`/notas/${id}`);
      setNotas(notas.filter((n) => n.id_nota !== id));
      setSuccessMessage("Nota eliminada");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("No se pudo eliminar la nota.");
    }
  };

  const getNotaColor = (v) => {
    const n = parseFloat(v);
    if (n >= 4.5) return "text-emerald-600";
    if (n >= 3.5) return "text-blue-600";
    if (n >= 3.0) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <Layout
      title="Gestor de Notas"
      subtitle={
        estudianteInfo
          ? `Notas de ${estudianteInfo.nombre_estudiante}`
          : "Cargando..."
      }
      backTo="/estudiantes"   // ← al hacer clic en Volver, va a la lista de estudiantes
      extra={
        <>
          <button
            onClick={() => navigate("/")}
            className="rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/20"
          >
            <i className="fas fa-home mr-1"></i> Inicio
          </button>
          <button
            onClick={() =>
              navigate(`/estudiantes/notas/${params.idBrigada}/${params.idEstudiante}/new`)
            }
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <i className="fas fa-plus mr-1"></i> Nueva Nota
          </button>
        </>
      }
    >
      {error && (
        <div className="bg-red-50 text-red-800 rounded-xl p-4 text-sm mb-4">{error}</div>
      )}
      {successMessage && (
        <div className="bg-emerald-50 text-emerald-800 rounded-xl p-4 text-sm mb-4">
          {successMessage}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-slate-400">
          <i className="fas fa-spinner fa-pulse text-3xl mb-3"></i>
          <p>Cargando...</p>
        </div>
      ) : notas.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-8 text-center">
          <i className="fas fa-book-open text-4xl text-slate-300 mb-3"></i>
          <h3 className="font-bold text-slate-700">No hay notas registradas</h3>
          <button
            onClick={() =>
              navigate(`/estudiantes/notas/${params.idBrigada}/${params.idEstudiante}/new`)
            }
            className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <i className="fas fa-plus mr-1"></i> Agregar Nota
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notas.map((n) => (
            <div
              key={n.id_nota}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-slate-800">{n.nombre_asignatura}</h3>
                <span className={`font-black text-lg ${getNotaColor(n.valor)}`}>
                  {n.valor}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Año {n.año}</p>
              <div className="flex gap-1 mt-3">
                <button
                  onClick={() =>
                    navigate(
                      `/estudiantes/notas/${params.idBrigada}/${params.idEstudiante}/${n.id_nota}/editar`
                    )
                  }
                  className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  onClick={() => eliminarNota(n.id_nota)}
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

export default Notas;