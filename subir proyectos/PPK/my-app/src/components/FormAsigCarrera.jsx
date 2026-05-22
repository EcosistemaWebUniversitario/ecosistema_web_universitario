import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "./Layout";
import "./css/FormAsigCarrera.css"; // Nuevo archivo CSS

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

  // Obtener información de la carrera
  useEffect(() => {
    const fetchCarreraInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/auth/carreras/${params.id}`,
        );
        setCarreraInfo(response.data[0]);
        setFormTitle(`Asignar Asignatura a ${response.data[0].nombre_carrera}`);
      } catch (error) {
        console.error("Error al obtener información de la carrera:", error);
        setErrors((prev) => ({
          ...prev,
          carrera: "No se pudo cargar la información de la carrera.",
        }));
      }
    };

    fetchCarreraInfo();
  }, [params.id]);

  // Obtener todas las asignaturas
  useEffect(() => {
    const fetchAsignaturas = async () => {
      try {
        setLoadingAsignaturas(true);
        const response = await axios.get(
          "http://localhost:3000/auth/asignaturas",
        );
        setAsignaturas(response.data);

        // Obtener asignaturas ya asignadas a esta carrera
        const asignaturasAsignadasResponse = await axios.get(
          `http://localhost:3000/auth/asignaturas/carrera/${params.id}`,
        );
        const asignaturasAsignadasIds = asignaturasAsignadasResponse.data.map(
          (a) => a.id_asignatura,
        );

        // Filtrar solo las asignaturas disponibles (no asignadas)
        const disponibles = response.data.filter(
          (a) => !asignaturasAsignadasIds.includes(a.id_asignatura),
        );
        setAsignaturasDisponibles(disponibles);

        if (disponibles.length === 0) {
          setErrors((prev) => ({
            ...prev,
            asignatura:
              "No hay asignaturas disponibles. Todas las asignaturas ya están asignadas a esta carrera.",
          }));
        }
      } catch (error) {
        console.error("Error al obtener asignaturas:", error);
        setErrors((prev) => ({
          ...prev,
          asignatura:
            "No se pudieron cargar las asignaturas. Intenta nuevamente.",
        }));
      } finally {
        setLoadingAsignaturas(false);
      }
    };

    fetchAsignaturas();
  }, [params.id]);

  // Filtrar asignaturas por búsqueda
  const asignaturasFiltradas = filtroBusqueda
    ? asignaturasDisponibles.filter((a) =>
        a.nombre_asignatura
          .toLowerCase()
          .includes(filtroBusqueda.toLowerCase()),
      )
    : asignaturasDisponibles;

  // Cuando se selecciona una asignatura
  const handleAsignaturaChange = (asignaturaId) => {
    setIdAsignatura(asignaturaId);
    const asignatura = asignaturas.find((a) => a.id_asignatura == asignaturaId);
    setAsignaturaSeleccionada(asignatura);
    if (errors.asignatura) {
      setErrors({ ...errors, asignatura: "" });
    }
  };

  // Validaciones en tiempo real
  const validateForm = () => {
    const newErrors = {};

    if (idAsignatura === 0 || idAsignatura === "0") {
      newErrors.asignatura =
        "Por favor, selecciona una asignatura para asignar.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Verificar si la asignatura ya está asignada
      const existe = await axios.get(
        `http://localhost:3000/auth/asignaturas/${params.id}/${idAsignatura}`,
      );

      if (existe.data.length > 0) {
        setErrors({
          ...errors,
          asignatura: "Esta asignatura ya está asignada a esta carrera.",
        });
        setLoading(false);
        return;
      }

      // Asignar la asignatura a la carrera
      await axios.post("http://localhost:3000/auth/asignaturas/carrera", {
        id_asignatura: idAsignatura,
        id_carrera: params.id,
      });

      setSuccessMessage("✓ Asignatura asignada exitosamente a la carrera");

      // Actualizar lista de asignaturas disponibles
      const nuevasDisponibles = asignaturasDisponibles.filter(
        (a) => a.id_asignatura != idAsignatura,
      );
      setAsignaturasDisponibles(nuevasDisponibles);

      // Resetear selección
      setIdAsignatura(0);
      setAsignaturaSeleccionada(null);

      // Esperar un momento para mostrar el mensaje de éxito
      setTimeout(() => {
        navigate(`/home/carreras/asignaturas/${params.id}`);
      }, 1500);
    } catch (err) {
      console.error("Error al asignar la asignatura:", err);
      setErrors({
        ...errors,
        submit:
          err.response?.data?.message ||
          "Error al asignar la asignatura. Intenta nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/home/carreras/asignaturas/${params.id}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleSubmit(e);
    }
  };

  // Obtener color para la asignatura
  const getAsignaturaColor = () => {
    const colors = [
      "#3b82f6",
      "#10b981",
      "#f59e0b",
      "#8b5cf6",
      "#ec4899",
      "#ef4444",
    ];
    const index = asignaturasDisponibles.findIndex(
      (a) => a.id_asignatura == idAsignatura,
    );
    return index !== -1 ? colors[index % colors.length] : "#6b7280";
  };

  // Obtener información de la asignatura
  const getAsignaturaInfo = () => {
    if (!asignaturaSeleccionada) return null;

    return {
      nombre: asignaturaSeleccionada.nombre_asignatura,
      creditos: asignaturaSeleccionada.creditos || "No especificado",
      descripcion:
        asignaturaSeleccionada.descripcion || "Sin descripción disponible",
      año: asignaturaSeleccionada.año || "No especificado",
      semestre: asignaturaSeleccionada.semestre || "No especificado",
    };
  };

  return (
    <>
      <Layout />
      <div className="form-asig-carrera-container">
        <div className="form-card">
          {/* Header del formulario */}
          <div className="form-header">
            <div className="form-icon">➕</div>
            <div>
              <h1>{formTitle}</h1>
              <p className="form-subtitle">
                Selecciona una asignatura para agregarla al plan de estudios de
                la carrera
              </p>
            </div>
          </div>

          {/* Información de la carrera */}
          {carreraInfo && (
            <div className="info-carrera">
              <div className="info-card">
                <div className="info-header">
                  <span className="info-icon">🎓</span>
                  <h4>Información de la Carrera</h4>
                </div>
                <div className="info-content">
                  <div className="info-item">
                    <span className="info-label">Carrera:</span>
                    <span className="info-value">
                      {carreraInfo.nombre_carrera}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Duración:</span>
                    <span className="info-value">
                      {carreraInfo.años} año{carreraInfo.años !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Asignaturas asignadas:</span>
                    <span className="info-value">
                      {asignaturas.length - asignaturasDisponibles.length} de{" "}
                      {asignaturas.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Formulario */}
          <form
            onSubmit={handleSubmit}
            className="asig-carrera-form"
            onKeyPress={handleKeyPress}
          >
            {/* Campo: Búsqueda de asignatura */}
            <div className="form-group">
              <label htmlFor="busqueda" className="form-label">
                Buscar Asignatura
              </label>
              <div className="search-wrapper">
                <input
                  id="busqueda"
                  type="text"
                  className="search-input"
                  placeholder="Escribe para buscar asignaturas..."
                  value={filtroBusqueda}
                  onChange={(e) => setFiltroBusqueda(e.target.value)}
                  disabled={loading || asignaturasDisponibles.length === 0}
                />
                <span className="search-icon">🔍</span>
              </div>
              {filtroBusqueda && (
                <div className="search-results-info">
                  {asignaturasFiltradas.length} asignatura
                  {asignaturasFiltradas.length !== 1 ? "s" : ""} encontrada
                  {asignaturasFiltradas.length !== 1 ? "s" : ""}
                </div>
              )}
            </div>

            {/* Campo: Selección de asignatura */}
            <div className="form-group">
              <label htmlFor="asignatura" className="form-label">
                Asignatura a Asignar
                <span className="required">*</span>
              </label>
              <div
                className={`select-wrapper ${errors.asignatura ? "input-error" : ""}`}
              >
                {loadingAsignaturas ? (
                  <div className="loading-select">
                    <span className="loading-spinner-small"></span>
                    Cargando asignaturas disponibles...
                  </div>
                ) : asignaturasDisponibles.length === 0 ? (
                  <div className="empty-select">
                    <span className="empty-icon">📚</span>
                    No hay asignaturas disponibles
                  </div>
                ) : (
                  <>
                    <select
                      id="asignatura"
                      className="form-select"
                      value={idAsignatura}
                      onChange={(e) => handleAsignaturaChange(e.target.value)}
                      disabled={loading || asignaturasDisponibles.length === 0}
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
                    <div className="select-arrow">▼</div>
                  </>
                )}
              </div>

              {asignaturasDisponibles.length > 0 && !loadingAsignaturas && (
                <div className="disponibles-info">
                  <span className="info-icon">📊</span>
                  {asignaturasDisponibles.length} asignatura
                  {asignaturasDisponibles.length !== 1 ? "s" : ""} disponible
                  {asignaturasDisponibles.length !== 1 ? "s" : ""} de{" "}
                  {asignaturas.length}
                </div>
              )}

              {errors.asignatura && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {errors.asignatura}
                </div>
              )}
            </div>

            {/* Previsualización de asignatura seleccionada */}
            {asignaturaSeleccionada && (
              <div className="preview-section">
                <h4>👁️ Información de la Asignatura:</h4>
                <div className="preview-card">
                  <div
                    className="preview-avatar"
                    style={{
                      backgroundColor: getAsignaturaColor() + "20",
                      color: getAsignaturaColor(),
                    }}
                  >
                    {asignaturaSeleccionada.nombre_asignatura.charAt(0)}
                  </div>
                  <div className="preview-content">
                    <h5>{asignaturaSeleccionada.nombre_asignatura}</h5>
                    <div className="preview-details">
                      {asignaturaSeleccionada.creditos && (
                        <span className="preview-detail">
                          <strong>Créditos:</strong>{" "}
                          {asignaturaSeleccionada.creditos}
                        </span>
                      )}
                      {asignaturaSeleccionada.año && (
                        <span className="preview-detail">
                          <strong>Año:</strong> {asignaturaSeleccionada.año}
                        </span>
                      )}
                      {asignaturaSeleccionada.semestre && (
                        <span className="preview-detail">
                          <strong>Semestre:</strong>{" "}
                          {asignaturaSeleccionada.semestre}
                        </span>
                      )}
                      {asignaturaSeleccionada.descripcion && (
                        <span className="preview-detail full-width">
                          <strong>Descripción:</strong>{" "}
                          {asignaturaSeleccionada.descripcion}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Información de la operación */}
            {idAsignatura != 0 && (
              <div className="operation-info">
                <div className="info-card">
                  <div className="info-header">
                    <span className="info-icon">🔄</span>
                    <h4>Acción a Realizar</h4>
                  </div>
                  <div className="info-content">
                    <p>
                      Al confirmar, la asignatura{" "}
                      <strong>
                        {asignaturaSeleccionada?.nombre_asignatura}
                      </strong>{" "}
                      será asignada a la carrera{" "}
                      <strong>{carreraInfo?.nombre_carrera}</strong>.
                    </p>
                    <div className="info-note">
                      <span className="note-icon">💡</span>
                      Esta acción puede ser revertida eliminando la asignatura
                      de la carrera más tarde.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mensaje de éxito */}
            {successMessage && (
              <div className="success-message">
                <span className="success-icon">✅</span>
                {successMessage}
              </div>
            )}

            {/* Error general */}
            {errors.submit && (
              <div className="error-message general">
                <span className="error-icon">❌</span>
                {errors.submit}
              </div>
            )}

            {/* Botones de acción */}
            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={handleCancel}
                disabled={loading}
              >
                <span className="btn-icon">↩️</span>
                Cancelar
              </button>
              <button
                type="submit"
                className={`btn-primary ${loading ? "loading" : ""}`}
                disabled={
                  loading ||
                  idAsignatura == 0 ||
                  asignaturasDisponibles.length === 0
                }
              >
                {loading ? (
                  <>
                    <span className="loading-spinner-small"></span>
                    Asignando...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">➕</span>
                    Asignar a Carrera
                  </>
                )}
              </button>
            </div>

            {/* Información adicional */}
            <div className="form-info">
              <div className="info-item">
                <span className="info-icon">💡</span>
                <div>
                  <strong>Consejo:</strong> Usa la búsqueda para encontrar
                  rápidamente asignaturas específicas.
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">📚</span>
                <div>
                  <strong>Nota:</strong> Solo se muestran las asignaturas que
                  aún no están asignadas a esta carrera.
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">🔄</span>
                <div>
                  <strong>Actualización:</strong> La lista se actualiza
                  automáticamente después de cada asignación.
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default FormAsigCarrera;
