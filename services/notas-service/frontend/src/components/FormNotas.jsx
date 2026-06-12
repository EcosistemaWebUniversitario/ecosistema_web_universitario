import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";

const FormNotas = () => {
  const [año, setAño] = useState(0);
  const [valor, setValor] = useState(0);
  const [valorEscala, setValorEscala] = useState(0);
  const [idAsignatura, setIdAsignatura] = useState(0);
  const [asignaturas, setAsignaturas] = useState([]);
  const [brigadaInfo, setBrigadaInfo] = useState(null);
  const [estudianteInfo, setEstudianteInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingAsignaturas, setLoadingAsignaturas] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formTitle, setFormTitle] = useState("Nueva Nota");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState(null);
  const [añosDisponibles, setAñosDisponibles] = useState([]);
  const navigate = useNavigate();
  const params = useParams();

  // Cargar información de la brigada (o usar valores por defecto si no hay)
  useEffect(() => {
    const fetchBrigadaInfo = async () => {
      if (!params.idBrigada || params.idBrigada === "0") {
        setAñosDisponibles([1, 2, 3, 4, 5]);
        return;
      }

      try {
        const response = await api.get(`/brigadas/${params.idBrigada}`);
        const brigada = response.data[0];
        setBrigadaInfo(brigada);
        const añosArray = [];
        for (let i = 1; i <= (brigada.años || 5); i++) {
          añosArray.push(i);
        }
        setAñosDisponibles(añosArray);
      } catch (error) {
        setAñosDisponibles([1, 2, 3, 4, 5]);
      }
    };
    fetchBrigadaInfo();
  }, [params.idBrigada]);

  // Cargar información del estudiante
  useEffect(() => {
    const fetchEstudianteInfo = async () => {
      try {
        const response = await api.get(`/estudiantes/${params.idEstudiante}`);
        setEstudianteInfo(response.data[0]);
      } catch (error) {
        console.error("Error al obtener información del estudiante:", error);
      }
    };
    if (params.idEstudiante) fetchEstudianteInfo();
  }, [params.idEstudiante]);

  // Cargar asignaturas de la brigada (o no cargar si no hay brigada)
  useEffect(() => {
    const fetchAsignaturas = async () => {
      if (!params.idBrigada || params.idBrigada === "0") {
        setAsignaturas([]);
        setLoadingAsignaturas(false);
        return;
      }

      try {
        setLoadingAsignaturas(true);
        const response = await api.get(`/asignaturas/brigada/brigada/${params.idBrigada}`);
        setAsignaturas(response.data);
        if (response.data.length === 0) {
          setErrors((prev) => ({ ...prev, asignatura: "No hay asignaturas disponibles para esta brigada." }));
        }
      } catch (error) {
        setErrors((prev) => ({ ...prev, asignatura: "No se pudieron cargar las asignaturas." }));
      } finally {
        setLoadingAsignaturas(false);
      }
    };
    fetchAsignaturas();
  }, [params.idBrigada]);

  const handleAsignaturaChange = (asignaturaId) => {
    setIdAsignatura(asignaturaId);
    const asignatura = asignaturas.find((a) => a.id_asignatura == asignaturaId);
    setAsignaturaSeleccionada(asignatura);
    if (errors.asignatura) setErrors({ ...errors, asignatura: "" });
  };

  const convertirValorAEscala = (valor) => ((valor - 2) * (100 / 3));
  const convertirValorAOriginal = (valorEscala) => (2 + (valorEscala * 3 / 100));

  const handleValorChange = (newValor) => {
    setValor(newValor);
    setValorEscala(convertirValorAEscala(newValor));
    if (errors.valor) setErrors({ ...errors, valor: "" });
  };

  const handleValorEscalaChange = (newValorEscala) => {
    setValorEscala(newValorEscala);
    setValor(convertirValorAOriginal(newValorEscala).toFixed(1));
    if (errors.valor) setErrors({ ...errors, valor: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (idAsignatura === 0 || idAsignatura === "0") newErrors.asignatura = "Selecciona una asignatura.";
    if (valor < 2 || valor > 5 || isNaN(valor)) newErrors.valor = "La nota debe estar entre 2 y 5.";
    if (año <= 0 || !añosDisponibles.includes(parseInt(año))) newErrors.año = `El año debe estar entre 1 y ${brigadaInfo?.años || 5}.`;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    if (!validateForm()) return;
    setLoading(true);
    try {
      const notaData = {
        id_asignatura: idAsignatura,
        id_estudiante: params.idEstudiante,
        valor: parseFloat(valor),
        año: parseInt(año),
      };
      if (editing) {
        await api.put(`/notas/${params.idNota}`, notaData);
        setSuccessMessage("✓ Nota actualizada exitosamente");
      } else {
        const existe = await api.get(`/notas/${idAsignatura}/${params.idEstudiante}`);
        if (existe.data && existe.data.length > 0) {
          setErrors({ ...errors, asignatura: "Este estudiante ya tiene una nota en esta asignatura." });
          setLoading(false);
          return;
        }
        await api.post("/notas", notaData);
        setSuccessMessage("✓ Nota creada exitosamente");
      }
      setTimeout(() => navigate(`/estudiantes/notas/${params.idBrigada || 0}/${params.idEstudiante}`), 1500);
    } catch (err) {
      setErrors({ ...errors, submit: err.response?.data?.message || "Error al guardar." });
    } finally {
      setLoading(false);
    }
  };

  const fetchNota = async (id) => {
    try {
      setLoading(true);
      const response = await api.get(`/notas/${id}`);
      const data = response.data[0];
      setIdAsignatura(data.id_asignatura);
      handleValorChange(data.valor);
      setAño(data.año);
      const asignatura = asignaturas.find((a) => a.id_asignatura == data.id_asignatura);
      setAsignaturaSeleccionada(asignatura);
      setEditing(true);
      setFormTitle("Editar Nota");
    } catch (error) {
      setErrors({ submit: "No se pudo cargar la nota." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.idNota) fetchNota(params.idNota);
  }, [params.idNota, asignaturas]);

  const getValorColor = () => {
    if (valor >= 4.5) return "#10b981";
    if (valor >= 3.5) return "#3b82f6";
    if (valor >= 3.0) return "#f59e0b";
    return "#ef4444";
  };

  const getValorIcono = () => {
    if (valor >= 4.5) return "🌟";
    if (valor >= 3.5) return "✅";
    if (valor >= 3.0) return "⚠️";
    return "❌";
  };

  const getValorEstado = () => {
    if (valor >= 4.5) return "Excelente";
    if (valor >= 3.5) return "Buena";
    if (valor >= 3.0) return "Regular";
    return "Reprobado";
  };

  return (
    <Layout
      title={formTitle}
      subtitle={
        estudianteInfo
          ? `Registrando nota para ${estudianteInfo.nombre_estudiante}`
          : "Cargando..."
      }
      backTo={`/estudiantes/notas/${params.idBrigada || 0}/${params.idEstudiante}`}
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Información del estudiante */}
            {estudianteInfo && (
              <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-800 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <i className="fas fa-user-graduate text-blue-600"></i>
                  <h4 className="font-semibold">Estudiante</h4>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <p><span className="font-semibold">Nombre:</span> {estudianteInfo.nombre_estudiante}</p>
                  <p><span className="font-semibold">Carnet:</span> {estudianteInfo.carnet}</p>
                  <p><span className="font-semibold">Correo:</span> {estudianteInfo.correo}</p>
                </div>
              </div>
            )}

            {/* Asignatura y Año */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Asignatura <span className="text-red-500">*</span></label>
                {loadingAsignaturas ? (
                  <p className="text-sm text-slate-400 py-2"><i className="fas fa-spinner fa-pulse mr-1"></i> Cargando asignaturas...</p>
                ) : (
                  <select value={idAsignatura} onChange={(e) => handleAsignaturaChange(e.target.value)} disabled={loading || asignaturas.length === 0}
                    className="w-full rounded-xl border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
                    <option value="0">Selecciona una asignatura</option>
                    {asignaturas.map((a) => (
                      <option key={a.id_asignatura} value={a.id_asignatura}>{a.nombre_asignatura}</option>
                    ))}
                  </select>
                )}
                {errors.asignatura && <p className="mt-1 text-xs text-red-600">{errors.asignatura}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Año <span className="text-red-500">*</span></label>
                <select value={año} onChange={(e) => { setAño(e.target.value); if (errors.año) setErrors({ ...errors, año: "" }); }}
                  disabled={loading || añosDisponibles.length === 0}
                  className="w-full rounded-xl border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
                  <option value="0">Selecciona el año</option>
                  {añosDisponibles.map((a) => (
                    <option key={a} value={a}>Año {a}</option>
                  ))}
                </select>
                {errors.año && <p className="mt-1 text-xs text-red-600">{errors.año}</p>}
              </div>
            </div>

            {/* Valor / Calificación */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Calificación <span className="text-red-500">*</span></label>
              <div className="flex flex-col space-y-3">
                <input
                  type="range" min="0" max="100" step="1" value={valorEscala}
                  onChange={(e) => handleValorEscalaChange(e.target.value)}
                  className="w-full h-2 bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>0</span><span>33</span><span>66</span><span>100</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="number" min="2" max="5" step="0.1" value={valor}
                      onChange={(e) => handleValorChange(e.target.value)}
                      disabled={loading}
                      className="w-full rounded-xl border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 pr-12"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">/5.0</span>
                  </div>
                  <div className="flex items-center gap-2 min-w-[120px]">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg" style={{ backgroundColor: getValorColor() }}>
                      {getValorIcono()}
                    </div>
                    <div>
                      <p className="text-xs font-semibold" style={{ color: getValorColor() }}>{getValorEstado()}</p>
                      <p className="text-xs text-slate-500">{valorEscala}/100</p>
                    </div>
                  </div>
                </div>
              </div>
              {errors.valor && <p className="mt-1 text-xs text-red-600">{errors.valor}</p>}
            </div>

            {/* Previsualización */}
            {idAsignatura != 0 && año != 0 && valor >= 2 && (
              <div className="rounded-xl bg-slate-50 p-4">
                <h4 className="font-semibold text-slate-800 mb-2">👁️ Previsualización:</h4>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg" style={{ backgroundColor: getValorColor() + "20", color: getValorColor() }}>
                    {getValorIcono()}
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-800">{asignaturaSeleccionada?.nombre_asignatura || "Asignatura"}</h5>
                    <p className="text-xs text-slate-500">
                      Calificación: {valor}/5.0 · Equivalente: {valorEscala}/100 · Año: {año} · {getValorEstado()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {successMessage && <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800"><i className="fas fa-check-circle mr-1"></i> {successMessage}</div>}
            {errors.submit && <div className="rounded-xl bg-red-50 p-4 text-sm text-red-800"><i className="fas fa-exclamation-triangle mr-1"></i> {errors.submit}</div>}

            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={() => navigate(`/estudiantes/notas/${params.idBrigada || 0}/${params.idEstudiante}`)} disabled={loading}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition">Cancelar</button>
              <button type="submit"
                disabled={loading || idAsignatura == 0 || año == 0 || valor < 2}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition disabled:opacity-50">
                {loading ? <span><i className="fas fa-spinner fa-pulse mr-1"></i> {editing ? "Guardando..." : "Creando..."}</span>
                  : <span><i className={`fas ${editing ? "fa-save" : "fa-plus"} mr-1`}></i> {editing ? "Guardar Cambios" : "Crear Nota"}</span>}
              </button>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800 mt-4">
              <p><i className="fas fa-info-circle mr-1"></i> <strong>Escala de Calificación:</strong> 2.0 - 5.0 (equivalente a 0 - 100 puntos). Nota mínima para aprobar: 3.0 (60/100).</p>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default FormNotas;