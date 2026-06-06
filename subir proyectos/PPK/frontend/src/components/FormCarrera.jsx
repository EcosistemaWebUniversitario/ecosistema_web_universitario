import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "./Layout";
import "./css/FormCarrera.css"; // Nuevo archivo CSS

const FormCarrera = () => {
  const [nombreCarrera, setNombreCarrera] = useState("");
  const [años, setAños] = useState(0);
  const [facultades, setFacultades] = useState([]);
  const [idFacultad, setIdFacultad] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingFacultades, setLoadingFacultades] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formTitle, setFormTitle] = useState("Nueva Carrera");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const params = useParams();

  // Obtener facultades al cargar el componente
  useEffect(() => {
    const fetchFacultades = async () => {
      try {
        setLoadingFacultades(true);
        const response = await api.get("/auth/facultades");
        setFacultades(response.data);
        if (response.data.length === 0) {
          setErrors(prev => ({
            ...prev,
            facultad: "No hay facultades disponibles. Crea una facultad primero."
          }));
        }
      } catch (error) {
        console.error("Error al obtener facultades:", error);
        setErrors(prev => ({
          ...prev,
          facultad: "No se pudieron cargar las facultades. Intenta nuevamente."
        }));
      } finally {
        setLoadingFacultades(false);
      }
    };

    fetchFacultades();
  }, []);

  // Validaciones en tiempo real
  const validateForm = () => {
    const newErrors = {};

    if (nombreCarrera.trim() === "") {
      newErrors.nombreCarrera = "Por favor, ingresa el nombre de la carrera.";
    } else if (nombreCarrera.length < 3) {
      newErrors.nombreCarrera = "El nombre debe tener al menos 3 caracteres.";
    } else if (nombreCarrera.length > 100) {
      newErrors.nombreCarrera = "El nombre no puede exceder los 100 caracteres.";
    }

    if (años <= 0 || años > 5 || isNaN(años)) {
      newErrors.años = "Por favor, ingresa una duración válida (1-5 años).";
    }

    if (idFacultad === 0 || idFacultad === "0") {
      newErrors.facultad = "Por favor, selecciona una facultad.";
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
      const carreraData = {
        id_facultad: idFacultad,
        nombre_carrera: nombreCarrera,
        años: parseInt(años)
      };

      if (editing) {
        // Editar carrera existente
        await api.put(`/auth/carreras/${params.id}`, carreraData);
        setSuccessMessage("✓ Carrera actualizada exitosamente");
      } else {
        // Crear nueva carrera
        const existe = await api.get(
          `/auth/carreras/nombre/${nombreCarrera}`
        );
        
        if (existe.data.length > 0) {
          setErrors({ ...errors, nombreCarrera: "Esta carrera ya existe en el sistema." });
          setLoading(false);
          return;
        }
        
        await api.post("/auth/carreras", carreraData);
        setSuccessMessage("✓ Carrera creada exitosamente");
      }
      
      // Esperar un momento para mostrar el mensaje de éxito
      setTimeout(() => {
        navigate("/home/carreras");
      }, 1500);
      
    } catch (err) {
      console.error("Error al guardar la carrera:", err);
      setErrors({
        ...errors,
        submit: err.response?.data?.message || "Error al guardar la carrera. Intenta nuevamente."
      });
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos de carrera si estamos editando
  const fetchCarrera = async (id) => {
    try {
      setLoading(true);
      const response = await api.get(
        `/auth/carreras/${id}`
      );
      const data = response.data[0];

      setNombreCarrera(data.nombre_carrera);
      setIdFacultad(data.id_facultad);
      setAños(data.años);
      setEditing(true);
      setFormTitle("Editar Carrera");
    } catch (error) {
      console.error("Error al cargar la carrera:", error);
      setErrors({
        submit: "No se pudo cargar la carrera. Intenta nuevamente."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/home/carreras");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchCarrera(params.id);
    }
  }, [params.id]);

  // Obtener nombre de facultad seleccionada
  const getFacultadNombre = () => {
    const facultad = facultades.find(f => f.id_facultad == idFacultad);
    return facultad ? facultad.nombre_facultad : "No seleccionada";
  };

  return (
    <>
      <Layout />
      <div className="form-carrera-container">
        <div className="form-card">
          {/* Header del formulario */}
          <div className="form-header">
            <div className="form-icon">🎓</div>
            <div>
              <h1>{formTitle}</h1>
              <p className="form-subtitle">
                {editing 
                  ? "Modifica los datos de la carrera existente" 
                  : "Completa el formulario para crear una nueva carrera"}
              </p>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="carrera-form" onKeyPress={handleKeyPress}>
            {/* Campo: Nombre de la carrera */}
            <div className="form-group">
              <label htmlFor="nombreCarrera" className="form-label">
                Nombre de la Carrera
                <span className="required">*</span>
              </label>
              <input
                id="nombreCarrera"
                type="text"
                className={`form-input ${errors.nombreCarrera ? "input-error" : ""}`}
                placeholder="Ej: Ingeniería en Sistemas, Medicina, Derecho..."
                value={nombreCarrera}
                onChange={(e) => {
                  setNombreCarrera(e.target.value);
                  if (errors.nombreCarrera) {
                    setErrors({...errors, nombreCarrera: ""});
                  }
                }}
                disabled={loading}
                maxLength={100}
                autoFocus
              />
              <div className="input-meta">
                <span className={`character-count ${nombreCarrera.length > 90 ? "warning" : ""}`}>
                  {nombreCarrera.length}/100 caracteres
                </span>
              </div>
              {errors.nombreCarrera && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {errors.nombreCarrera}
                </div>
              )}
            </div>

            {/* Campos en fila para escritorio */}
            <div className="form-row">
              {/* Campo: Duración */}
              <div className="form-group">
                <label htmlFor="años" className="form-label">
                  Duración (años)
                  <span className="required">*</span>
                </label>
                <div className="duration-selector">
                  {[1, 2, 3, 4, 5].map((year) => (
                    <button
                      key={year}
                      type="button"
                      className={`duration-option ${años == year ? "selected" : ""}`}
                      onClick={() => {
                        setAños(year);
                        if (errors.años) {
                          setErrors({...errors, años: ""});
                        }
                      }}
                      disabled={loading}
                    >
                      {year} {year === 1 ? "año" : "años"}
                    </button>
                  ))}
                </div>
                <div className="duration-hint">
                  Selecciona la duración total de la carrera
                </div>
                {errors.años && (
                  <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {errors.años}
                  </div>
                )}
              </div>

              {/* Campo: Facultad */}
              <div className="form-group">
                <label htmlFor="facultad" className="form-label">
                  Facultad
                  <span className="required">*</span>
                </label>
                <div className={`select-wrapper ${errors.facultad ? "input-error" : ""}`}>
                  {loadingFacultades ? (
                    <div className="loading-select">
                      <span className="loading-spinner-small"></span>
                      Cargando facultades...
                    </div>
                  ) : (
                    <>
                      <select
                        id="facultad"
                        className="form-select"
                        value={idFacultad}
                        onChange={(e) => {
                          setIdFacultad(e.target.value);
                          if (errors.facultad) {
                            setErrors({...errors, facultad: ""});
                          }
                        }}
                        disabled={loading || facultades.length === 0}
                      >
                        <option value="0">Selecciona una facultad</option>
                        {facultades.map((facultad) => (
                          <option key={facultad.id_facultad} value={facultad.id_facultad}>
                            {facultad.nombre_facultad}
                          </option>
                        ))}
                      </select>
                      <div className="select-arrow">▼</div>
                    </>
                  )}
                </div>
                {idFacultad != 0 && (
                  <div className="selected-facultad-info">
                    <span className="info-icon">🏛️</span>
                    {getFacultadNombre()}
                  </div>
                )}
                {errors.facultad && (
                  <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {errors.facultad}
                  </div>
                )}
              </div>
            </div>

            {/* Previsualización */}
            {nombreCarrera.length >= 3 && idFacultad != 0 && años > 0 && (
              <div className="preview-section">
                <h4>👁️ Previsualización:</h4>
                <div className="preview-card">
                  <div className="preview-icon">🎓</div>
                  <div className="preview-content">
                    <h5>{nombreCarrera}</h5>
                    <div className="preview-details">
                      <span className="preview-detail">
                        <strong>Facultad:</strong> {getFacultadNombre()}
                      </span>
                      <span className="preview-detail">
                        <strong>Duración:</strong> {años} {años === 1 ? "año" : "años"}
                      </span>
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
                disabled={loading || nombreCarrera.trim() === "" || idFacultad == 0 || años === 0}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner-small"></span>
                    {editing ? "Guardando..." : "Creando..."}
                  </>
                ) : (
                  <>
                    <span className="btn-icon">
                      {editing ? "💾" : "➕"}
                    </span>
                    {editing ? "Guardar Cambios" : "Crear Carrera"}
                  </>
                )}
              </button>
            </div>

            {/* Información adicional */}
            <div className="form-info">
              <div className="info-item">
                <span className="info-icon">💡</span>
                <div>
                  <strong>Consejo:</strong> Usa nombres completos y descriptivos para las carreras.
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">🔗</span>
                <div>
                  <strong>Relaciones:</strong> Las carreras pueden tener múltiples brigadas y asignaturas.
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default FormCarrera;