import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";

const FormAsigCarrera = () => {
  const [idAsignatura, setIdAsignatura] = useState(0);
  const [asignaturas, setAsignaturas] = useState([]);
  const [carreraInfo, setCarreraInfo] = useState(null);
  const [asignaturasDisponibles, setAsignaturasDisponibles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAsignaturas, setLoadingAsignaturas] = useState(true);
  const [formTitle, setFormTitle] = useState("Asignar Asignatura a Carrera");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState(null);
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const fetchCarreraInfo = async () => {
      try {
        const response = await api.get(`/carreras/${params.id}`);
        const carrera = response.data[0];
        setCarreraInfo(carrera);
        setFormTitle(`Asignar Asignatura a ${carrera.nombre_carrera}`);
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          carrera: "No se pudo cargar la información de la carrera.",
        }));
      }
    };
    fetchCarreraInfo();
  }, [params.id]);

  useEffect(() => {
    const fetchAsignaturas = async () => {
      try {
        setLoadingAsignaturas(true);
        const [todasRes, asignadasRes] = await Promise.all([
          api.get("/asignaturas"),
          api.get(`/asignaturas/carrera/${params.id}`),
        ]);
        const todas = todasRes.data || [];
        const asignadasIds = (asignadasRes.data || []).map((a) => a.id_asignatura);
        const disponibles = todas.filter((a) => !asignadasIds.includes(a.id_asignatura));
        setAsignaturas(todas);
        setAsignaturasDisponibles(disponibles);
        if (disponibles.length === 0) {
          setErrors((prev) => ({
            ...prev,
            asignatura: "No hay asignaturas disponibles. Todas ya están asignadas a esta carrera.",
          }));
        }
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          asignatura: "No se pudieron cargar las asignaturas.",
        }));
      } finally {
        setLoadingAsignaturas(false);
      }
    };
    fetchAsignaturas();
  }, [params.id]);

  const asignaturasFiltradas = filtroBusqueda
    ? asignaturasDisponibles.filter((a) =>
        a.nombre_asignatura.toLowerCase().includes(filtroBusqueda.toLowerCase())
      )
    : asignaturasDisponibles;

  const handleAsignaturaChange = (asignaturaId) => {
    setIdAsignatura(asignaturaId);
    const asignatura = asignaturas.find((a) => a.id_asignatura == asignaturaId);
    setAsignaturaSeleccionada(asignatura);
    if (errors.asignatura) {
      setErrors({ ...errors, asignatura: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (idAsignatura === 0 || idAsignatura === "0") {
      newErrors.asignatura = "Selecciona una asignatura para asignar.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    if (!validateForm()) return;
    setLoading(true);
    try {
      const existe = await api.get(`/asignaturas/${params.id}/${idAsignatura}`);
      if (existe.data && existe.data.length > 0) {
        setErrors({ ...errors, asignatura: "Esta asignatura ya está asignada a esta carrera." });
        setLoading(false);
        return;
      }
      await api.post("/asignaturas/carrera", {
        id_asignatura: idAsignatura,
        id_carrera: params.id,
      });
      setSuccessMessage("✓ Asignatura asignada exitosamente a la carrera");
      setAsignaturasDisponibles((prev) => prev.filter((a) => a.id_asignatura != idAsignatura));
      setIdAsignatura(0);
      setAsignaturaSeleccionada(null);
      setTimeout(() => {
        navigate(`/carreras/asignaturas/${params.id}`);
      }, 1500);
    } catch (err) {
      setErrors({
        ...errors,
        submit: err.response?.data?.message || "Error al asignar la asignatura.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title={formTitle}
      subtitle={
        carreraInfo
          ? `${carreraInfo.nombre_carrera} (${carreraInfo.años || 5} años)`
          : "Cargando carrera..."
      }
      backTo={`/carreras/asignaturas/${params.id}`}
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-6">
          {/* Información de la carrera */}
          {carreraInfo && (
            <div className="mb-6 bg-blue-50 rounded-xl p-4 text-sm text-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <i className="fas fa-graduation-cap text-blue-600"></i>
                <h4 className="font-semibold">Información de la Carrera</h4>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p><span className="font-semibold">Carrera:</span> {carreraInfo.nombre_carrera}</p>
                <p><span className="font-semibold">Duración:</span> {carreraInfo.años} año{carreraInfo.años !== 1 ? "s" : ""}</p>
                <p><span className="font-semibold">Asignaturas asignadas:</span> {asignaturas.length - asignaturasDisponibles.length} de {asignaturas.length}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Búsqueda de asignatura */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Buscar Asignatura</label>
              <div className="relative">
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                <input
                  type="text"
                  placeholder="Escribe para buscar asignaturas..."
                  value={filtroBusqueda}
                  onChange={(e) => setFiltroBusqueda(e.target.value)}
                  disabled={loading || asignaturasDisponibles.length === 0}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border-slate-200 bg-slate-50 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              {filtroBusqueda && (
                <p className="text-xs text-slate-500 mt-1">{asignaturasFiltradas.length} asignatura{asignaturasFiltradas.length !== 1 ? "s" : ""} encontrada{asignaturasFiltradas.length !== 1 ? "s" : ""}</p>
              )}
            </div>

            {/* Selección de asignatura */}
            <div>
              <label htmlFor="asignatura" className="block text-sm font-semibold text-slate-700 mb-1">
                Asignatura a Asignar <span className="text-red-500">*</span>
              </label>
              {loadingAsignaturas ? (
                <div className="text-sm text-slate-400 py-2"><i className="fas fa-spinner fa-pulse mr-1"></i> Cargando asignaturas disponibles...</div>
              ) : asignaturasDisponibles.length === 0 ? (
                <div className="text-sm text-slate-400 py-2">No hay asignaturas disponibles</div>
              ) : (
                <>
                  <select
                    id="asignatura"
                    value={idAsignatura}
                    onChange={(e) => handleAsignaturaChange(e.target.value)}
                    disabled={loading || asignaturasDisponibles.length === 0}
                    className="w-full rounded-xl border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="0">
                      {asignaturasFiltradas.length === 0 && filtroBusqueda
                        ? "No hay resultados para tu búsqueda"
                        : "Selecciona una asignatura"}
                    </option>
                    {asignaturasFiltradas.map((a) => (
                      <option key={a.id_asignatura} value={a.id_asignatura}>
                        {a.nombre_asignatura}
                        {a.creditos && ` (${a.creditos} créditos)`}
                        {a.año && ` - Año ${a.año}`}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-1">
                    {asignaturasDisponibles.length} asignatura{asignaturasDisponibles.length !== 1 ? "s" : ""} disponible{asignaturasDisponibles.length !== 1 ? "s" : ""} de {asignaturas.length}
                  </p>
                </>
              )}
              {errors.asignatura && (
                <div className="mt-2 rounded-lg bg-red-50 p-3 text-sm text-red-800">
                  <i className="fas fa-exclamation-triangle mr-1"></i> {errors.asignatura}
                </div>
              )}
            </div>

            {/* Previsualización de asignatura seleccionada */}
            {asignaturaSeleccionada && (
              <div className="bg-slate-50 rounded-xl p-4">
                <h4 className="font-semibold text-slate-800 mb-2">👁️ Información de la Asignatura:</h4>
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg font-bold text-lg"
                    style={{
                      backgroundColor: (() => {
                        const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#ef4444"];
                        const index = asignaturasDisponibles.findIndex((a) => a.id_asignatura == idAsignatura);
                        return (colors[index % colors.length] || "#6b7280") + "20";
                      })(),
                      color: (() => {
                        const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#ef4444"];
                        const index = asignaturasDisponibles.findIndex((a) => a.id_asignatura == idAsignatura);
                        return colors[index % colors.length] || "#6b7280";
                      })(),
                    }}
                  >
                    {asignaturaSeleccionada.nombre_asignatura.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-800">{asignaturaSeleccionada.nombre_asignatura}</h5>
                    <div className="text-xs text-slate-500 space-y-0.5 mt-1">
                      {asignaturaSeleccionada.creditos && <p><strong>Créditos:</strong> {asignaturaSeleccionada.creditos}</p>}
                      {asignaturaSeleccionada.año && <p><strong>Año:</strong> {asignaturaSeleccionada.año}</p>}
                      {asignaturaSeleccionada.semestre && <p><strong>Semestre:</strong> {asignaturaSeleccionada.semestre}</p>}
                      {asignaturaSeleccionada.descripcion && <p><strong>Descripción:</strong> {asignaturaSeleccionada.descripcion}</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mensaje de éxito */}
            {successMessage && (
              <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
                <i className="fas fa-check-circle mr-1"></i> {successMessage}
              </div>
            )}

            {/* Error general */}
            {errors.submit && (
              <div className="rounded-xl bg-red-50 p-4 text-sm text-red-800">
                <i className="fas fa-exclamation-triangle mr-1"></i> {errors.submit}
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate(`/carreras/asignaturas/${params.id}`)}
                disabled={loading}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || idAsignatura == 0 || asignaturasDisponibles.length === 0}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition disabled:opacity-50"
              >
                {loading ? (
                  <span><i className="fas fa-spinner fa-pulse mr-1"></i> Asignando...</span>
                ) : (
                  <span><i className="fas fa-plus mr-1"></i> Asignar a Carrera</span>
                )}
              </button>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800 mt-4">
              <p><i className="fas fa-info-circle mr-1"></i> <strong>Nota:</strong> Solo se muestran asignaturas que aún no pertenecen a esta carrera.</p>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default FormAsigCarrera;