import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "./Layout";
import "./css/FormBrigadas.css"; // Nuevo archivo CSS

const FormBrigadas = () => {
  const [nombre, setNombre] = useState("");
  const [año, setAño] = useState(new Date().getFullYear());
  const [añoFinal, setAñoFinal] = useState(new Date().getFullYear() + 4);
  const [carreras, setCarreras] = useState([]);
  const [idCarrera, setIdCarrera] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingCarreras, setLoadingCarreras] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formTitle, setFormTitle] = useState("Nueva Brigada");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [carreraSeleccionada, setCarreraSeleccionada] = useState(null);
  const navigate = useNavigate();
  const params = useParams();

  // Años disponibles para selección (últimos 10 años y próximos 10)
  const currentYear = new Date().getFullYear();
  const añosDisponibles = Array.from({ length: 20 }, (_, i) => currentYear - 5 + i);

  // Obtener carreras al cargar el componente
  useEffect(() => {
    const fetchCarreras = async () => {
      try {
        setLoadingCarreras(true);
        const response = await axios.get("http://localhost:3000/auth/carreras");
        setCarreras(response.data);
        if (response.data.length === 0) {
          setErrors(prev => ({
            ...prev,
            carrera: "No hay carreras disponibles. Crea una carrera primero."
          }));
        }
      } catch (error) {
        console.error("Error al obtener carreras:", error);
        setErrors(prev => ({
          ...prev,
          carrera: "No se pudieron cargar las carreras. Intenta nuevamente."
        }));
      } finally {
        setLoadingCarreras(false);
      }
    };

    fetchCarreras();
  }, []);

  // Calcular año final cuando cambia la carrera o el año inicial
  useEffect(() => {
    if (carreraSeleccionada && carreraSeleccionada.años) {
      const nuevoAñoFinal = parseInt(año) + parseInt(carreraSeleccionada.años) - 1;
      setAñoFinal(nuevoAñoFinal);
    }
  }, [carreraSeleccionada, año]);

  // Cuando se selecciona una carrera
  const handleCarreraChange = (carreraId) => {
    setIdCarrera(carreraId);
    const carrera = carreras.find(c => c.id_carrera == carreraId);
    setCarreraSeleccionada(carrera);
    if (errors.carrera) {
      setErrors({...errors, carrera: ""});
    }
  };

  // Validaciones en tiempo real
  const validateForm = () => {
    const newErrors = {};

    if (nombre.trim() === "") {
      newErrors.nombre = "Por favor, ingresa el nombre de la brigada.";
    } else if (nombre.length < 3) {
      newErrors.nombre = "El nombre debe tener al menos 3 caracteres.";
    } else if (nombre.length > 100) {
      newErrors.nombre = "El nombre no puede exceder los 100 caracteres.";
    }

    if (!año || año < 2000 || año > 2100) {
      newErrors.año = "Por favor, ingresa un año válido (2000-2100).";
    }

    if (idCarrera === 0 || idCarrera === "0") {
      newErrors.carrera = "Por favor, selecciona una carrera.";
    }

    if (añoFinal && añoFinal <= año) {
      newErrors.año = "El año final debe ser mayor al año inicial.";
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
      const brigadaData = {
        id_carrera: idCarrera,
        nombre_brigada: nombre,
        año_brigada: parseInt(año),
        añoFinal_brigada: parseInt(añoFinal)
      };

      if (editing) {
        // Editar brigada existente
        await axios.put(`http://localhost:3000/auth/brigadas/${params.id}`, brigadaData);
        setSuccessMessage("✓ Brigada actualizada exitosamente");
      } else {
        // Crear nueva brigada
        const existe = await axios.get(
          `http://localhost:3000/auth/brigadas/nombre/${nombre}`
        );
        
        if (existe.data.length > 0) {
          setErrors({ ...errors, nombre: "Esta brigada ya existe en el sistema." });
          setLoading(false);
          return;
        }
        
        await axios.post("http://localhost:3000/auth/brigadas", brigadaData);
        setSuccessMessage("✓ Brigada creada exitosamente");
      }
      
      // Esperar un momento para mostrar el mensaje de éxito
      setTimeout(() => {
        navigate("/home/brigadas");
      }, 1500);
      
    } catch (err) {
      console.error("Error al guardar la brigada:", err);
      setErrors({
        ...errors,
        submit: err.response?.data?.message || "Error al guardar la brigada. Intenta nuevamente."
      });
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos de brigada si estamos editando
  const fetchBrigada = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/auth/brigadas/${id}`
      );
      const data = response.data[0];

      setNombre(data.nombre_brigada);
      setIdCarrera(data.id_carrera);
      setAño(data.año_brigada);
      setAñoFinal(data.añoFinal_brigada);
      
      // Encontrar y establecer la carrera seleccionada
      const carrera = carreras.find(c => c.id_carrera == data.id_carrera);
      setCarreraSeleccionada(carrera);
      
      setEditing(true);
      setFormTitle("Editar Brigada");
    } catch (error) {
      console.error("Error al cargar la brigada:", error);
      setErrors({
        submit: "No se pudo cargar la brigada. Intenta nuevamente."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/home/brigadas");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchBrigada(params.id);
    }
  }, [params.id, carreras]);

  // Obtener nombre de carrera seleccionada
  const getCarreraNombre = () => {
    return carreraSeleccionada ? carreraSeleccionada.nombre_carrera : "No seleccionada";
  };

  // Calcular duración de la brigada
  const getDuracion = () => {
    if (!carreraSeleccionada || !año || !añoFinal) return 0;
    return añoFinal - año + 1;
  };

  // Determinar estado de la brigada
  const getEstadoBrigada = () => {
    const currentYear = new Date().getFullYear();
    
    if (currentYear < año) {
      return { texto: "Próxima", clase: "proxima", icono: "⏳" };
    } else if (currentYear > añoFinal) {
      return { texto: "Finalizada", clase: "finalizada", icono: "✅" };
    } else {
      return { texto: "Activa", clase: "activa", icono: "🎓" };
    }
  };

  return (
    <>
      <Layout />
      <div className="form-brigadas-container">
        <div className="form-card">
          {/* Header del formulario */}
          <div className="form-header">
            <div className="form-icon">👥</div>
            <div>
              <h1>{formTitle}</h1>
              <p className="form-subtitle">
                {editing 
                  ? "Modifica los datos de la brigada existente" 
                  : "Completa el formulario para crear una nueva brigada estudiantil"}
              </p>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="brigadas-form" onKeyPress={handleKeyPress}>
            {/* Campo: Nombre de la brigada */}
            <div className="form-group">
              <label htmlFor="nombre" className="form-label">
                Nombre de la Brigada
                <span className="required">*</span>
              </label>
              <input
                id="nombre"
                type="text"
                className={`form-input ${errors.nombre ? "input-error" : ""}`}
                placeholder="Ej: Brigada 2024-1, Grupo A, Generación 2023..."
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  if (errors.nombre) {
                    setErrors({...errors, nombre: ""});
                  }
                }}
                disabled={loading}
                maxLength={100}
                autoFocus
              />
              <div className="input-meta">
                <span className={`character-count ${nombre.length > 90 ? "warning" : ""}`}>
                  {nombre.length}/100 caracteres
                </span>
              </div>
              {errors.nombre && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {errors.nombre}
                </div>
              )}
            </div>

            {/* Campos en fila para escritorio */}
            <div className="form-row">
              {/* Campo: Año Inicial */}
              <div className="form-group">
                <label htmlFor="año" className="form-label">
                  Año de Inicio
                  <span className="required">*</span>
                </label>
                <div className="select-wrapper">
                  <select
                    id="año"
                    className={`form-select ${errors.año ? "input-error" : ""}`}
                    value={año}
                    onChange={(e) => {
                      setAño(e.target.value);
                      if (errors.año) {
                        setErrors({...errors, año: ""});
                      }
                    }}
                    disabled={loading}
                  >
                    <option value="">Selecciona un año</option>
                    {añosDisponibles.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <div className="select-arrow">▼</div>
                </div>
                {errors.año && (
                  <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {errors.año}
                  </div>
                )}
              </div>

              {/* Campo: Carrera */}
              <div className="form-group">
                <label htmlFor="carrera" className="form-label">
                  Carrera
                  <span className="required">*</span>
                </label>
                <div className={`select-wrapper ${errors.carrera ? "input-error" : ""}`}>
                  {loadingCarreras ? (
                    <div className="loading-select">
                      <span className="loading-spinner-small"></span>
                      Cargando carreras...
                    </div>
                  ) : (
                    <>
                      <select
                        id="carrera"
                        className="form-select"
                        value={idCarrera}
                        onChange={(e) => handleCarreraChange(e.target.value)}
                        disabled={loading || carreras.length === 0}
                      >
                        <option value="0">Selecciona una carrera</option>
                        {carreras.map((c) => (
                          <option key={c.id_carrera} value={c.id_carrera}>
                            {c.nombre_carrera} ({c.años} años)
                          </option>
                        ))}
                      </select>
                      <div className="select-arrow">▼</div>
                    </>
                  )}
                </div>
                {carreraSeleccionada && (
                  <div className="selected-carrera-info">
                    <span className="info-icon">🎓</span>
                    <div>
                      <strong>{carreraSeleccionada.nombre_carrera}</strong>
                      <div className="carrera-details">
                        {carreraSeleccionada.años} años de duración
                      </div>
                    </div>
                  </div>
                )}
                {errors.carrera && (
                  <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {errors.carrera}
                  </div>
                )}
              </div>
            </div>

            {/* Información calculada */}
            {carreraSeleccionada && año && (
              <div className="calculated-info">
                <div className="info-card">
                  <div className="info-header">
                    <span className="info-icon">📅</span>
                    <h4>Información Calculada</h4>
                  </div>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Año de Finalización:</span>
                      <span className="info-value highlight">{añoFinal}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Duración Total:</span>
                      <span className="info-value">
                        {getDuracion()} {getDuracion() === 1 ? "año" : "años"}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Estado Estimado:</span>
                      <span className={`estado-badge ${getEstadoBrigada().clase}`}>
                        {getEstadoBrigada().icono} {getEstadoBrigada().texto}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Previsualización */}
            {nombre.length >= 3 && idCarrera != 0 && año && (
              <div className="preview-section">
                <h4>👁️ Previsualización:</h4>
                <div className="preview-card">
                  <div className="preview-icon">👥</div>
                  <div className="preview-content">
                    <h5>{nombre}</h5>
                    <div className="preview-details">
                      <span className="preview-detail">
                        <strong>Carrera:</strong> {getCarreraNombre()}
                      </span>
                      <span className="preview-detail">
                        <strong>Período:</strong> {año} - {añoFinal}
                      </span>
                      <span className="preview-detail">
                        <strong>Estado:</strong> {getEstadoBrigada().texto}
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
                disabled={loading || nombre.trim() === "" || idCarrera == 0 || !año}
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
                    {editing ? "Guardar Cambios" : "Crear Brigada"}
                  </>
                )}
              </button>
            </div>

            {/* Información adicional */}
            <div className="form-info">
              <div className="info-item">
                <span className="info-icon">💡</span>
                <div>
                  <strong>Consejo:</strong> Usa un formato consistente para los nombres de brigadas.
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">👥</span>
                <div>
                  <strong>Estudiantes:</strong> Una brigada puede tener múltiples estudiantes.
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default FormBrigadas;