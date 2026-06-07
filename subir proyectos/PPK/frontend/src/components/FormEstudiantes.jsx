import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "./Layout";
import "./css/FormEstudiantes.css"; // Nuevo archivo CSS

const FormEstudiantes = () => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [carnet, setCarnet] = useState("");
  const [brigadas, setBrigadas] = useState([]);
  const [idBrigada, setIdBrigada] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingBrigadas, setLoadingBrigadas] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profileId, setProfileId] = useState(null);
  const [formTitle, setFormTitle] = useState("Nuevo Estudiante");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [brigadaSeleccionada, setBrigadaSeleccionada] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const navigate = useNavigate();
  const params = useParams();

  // Obtener brigadas al cargar el componente
  useEffect(() => {
    const fetchBrigadas = async () => {
      try {
        setLoadingBrigadas(true);
        const response = await api.get("/auth/brigadas");
        setBrigadas(response.data);
        if (response.data.length === 0) {
          setErrors(prev => ({
            ...prev,
            brigada: "No hay brigadas disponibles. Crea una brigada primero."
          }));
        }
      } catch (error) {
        console.error("Error al obtener brigadas:", error);
        setErrors(prev => ({
          ...prev,
          brigada: "No se pudieron cargar las brigadas. Intenta nuevamente."
        }));
      } finally {
        setLoadingBrigadas(false);
      }
    };

    fetchBrigadas();
  }, []);

  // Cuando se selecciona una brigada
  const handleBrigadaChange = (brigadaId) => {
    setIdBrigada(brigadaId);
    const brigada = brigadas.find(b => b.id_brigada == brigadaId);
    setBrigadaSeleccionada(brigada);
    if (errors.brigada) {
      setErrors({...errors, brigada: ""});
    }
  };

  // Validar fortaleza de contraseña
  useEffect(() => {
    if (contraseña.length === 0) {
      setStrength(0);
      return;
    }

    let score = 0;
    if (contraseña.length >= 8) score++;
    if (/[A-Z]/.test(contraseña)) score++;
    if (/[0-9]/.test(contraseña)) score++;
    if (/[^A-Za-z0-9]/.test(contraseña)) score++;

    setStrength(score);
  }, [contraseña]);

  // Validar carnet
  const validateCarnet = (carnet) => {
    // Ajusta esta validación según el formato de tu carnet
    return /^\d{11}$/.test(carnet);
  };

  // Validaciones en tiempo real
  const validateForm = () => {
    const newErrors = {};

    if (nombre.trim() === "") {
      newErrors.nombre = "Por favor, ingresa el nombre del estudiante.";
    } else if (nombre.length < 3) {
      newErrors.nombre = "El nombre debe tener al menos 3 caracteres.";
    } else if (nombre.length > 100) {
      newErrors.nombre = "El nombre no puede exceder los 100 caracteres.";
    }

    if (carnet.trim() === "") {
      newErrors.carnet = "Por favor, ingresa el carnet del estudiante.";
    } else if (!validateCarnet(carnet)) {
      newErrors.carnet = "El carnet debe tener exactamente 11 dígitos numéricos.";
    }

    if (idBrigada === 0 || idBrigada === "0") {
      newErrors.brigada = "Por favor, selecciona una brigada.";
    }

    if (correo.trim() === "") {
      newErrors.correo = "Por favor, ingresa el correo del estudiante.";
    } else if (!validateEmail(correo)) {
      newErrors.correo = "Por favor ingresa un correo válido.";
    }

    if (contraseña.trim() === "") {
      newErrors.contraseña = "Por favor, ingresa la contraseña del estudiante.";
    } else if (contraseña.length < 6) {
      newErrors.contraseña = "La contraseña debe tener al menos 6 caracteres.";
    } else if (strength < 2) {
      newErrors.contraseña = "La contraseña es demasiado débil. Añade mayúsculas, números o símbolos.";
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
      const estudianteData = {
        correo,
        contraseña,
        id_brigada: idBrigada,
        nombre_estudiante: nombre,
        carnet,
      };

      if (editing) {
        // Editar estudiante existente
        await api.put(`/auth/estudiantes/${profileId || params.id}`, estudianteData);
        setSuccessMessage("✓ Estudiante actualizado exitosamente");
      } else {
        // Crear nuevo estudiante
        try {
          const existe = await api.get(
            `/auth/estudiantes/correo/${correo}`
          );
          
          if (existe.data.length > 0) {
            setErrors({ ...errors, correo: "Este correo ya está en uso." });
            setLoading(false);
            return;
          }
          
          await api.post("/auth/estudiantes", estudianteData);
          setSuccessMessage("✓ Estudiante creado exitosamente");
        } catch (err) {
          console.error("Error al verificar correo:", err);
          setErrors({
            ...errors,
            submit: "Error al verificar el correo. Intenta nuevamente."
          });
          setLoading(false);
          return;
        }
      }
      
      // Esperar un momento para mostrar el mensaje de éxito
      setTimeout(() => {
        navigate("/home/estudiantes");
      }, 1500);
      
    } catch (err) {
      console.error("Error al guardar el estudiante:", err);
      setErrors({
        ...errors,
        submit: err.response?.data?.message || "Error al guardar el estudiante. Intenta nuevamente."
      });
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Cargar datos del estudiante si estamos editando
  const fetchEstudiante = async (id) => {
    try {
      setLoading(true);
      const response = await api.get(
        `/auth/estudiantes/${id}`
      );
      const data = response.data[0];

      setNombre(data.nombre_estudiante);
      setCorreo(data.correo);
      setContraseña(""); // No cargamos la contraseña por seguridad
      setCarnet(data.carnet);
      setIdBrigada(data.id_brigada);
      
      // Encontrar y establecer la brigada seleccionada
      const brigada = brigadas.find(b => b.id_brigada == data.id_brigada);
      setBrigadaSeleccionada(brigada);
      
      setProfileId(data.profile_id || params.id);
      setEditing(true);
      setFormTitle("Editar Estudiante");
    } catch (error) {
      console.error("Error al cargar el estudiante:", error);
      setErrors({
        submit: "No se pudo cargar el estudiante. Intenta nuevamente."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/home/estudiantes");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchEstudiante(params.id);
    }
  }, [params.id, brigadas]);

  // Obtener nombre de brigada seleccionada
  const getBrigadaNombre = () => {
    return brigadaSeleccionada ? brigadaSeleccionada.nombre_brigada : "No seleccionada";
  };

  // Obtener color para la fortaleza de contraseña
  const getPasswordStrengthColor = () => {
    switch(strength) {
      case 0: return "#ef4444";
      case 1: return "#f59e0b";
      case 2: return "#fbbf24";
      case 3: return "#10b981";
      case 4: return "#059669";
      default: return "#6b7280";
    }
  };

  // Obtener texto para la fortaleza de contraseña
  const getPasswordStrengthText = () => {
    switch(strength) {
      case 0: return "Muy débil";
      case 1: return "Débil";
      case 2: return "Aceptable";
      case 3: return "Buena";
      case 4: return "Excelente";
      default: return "No evaluada";
    }
  };

  return (
    <>
      <Layout />
      <div className="form-estudiantes-container">
        <div className="form-card">
          {/* Header del formulario */}
          <div className="form-header">
            <div className="form-icon">👨‍🎓</div>
            <div>
              <h1>{formTitle}</h1>
              <p className="form-subtitle">
                {editing 
                  ? "Modifica los datos del estudiante existente" 
                  : "Completa el formulario para crear un nuevo estudiante"}
              </p>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="estudiantes-form" onKeyPress={handleKeyPress}>
            {/* Campo: Nombre del estudiante */}
            <div className="form-group">
              <label htmlFor="nombre" className="form-label">
                Nombre Completo
                <span className="required">*</span>
              </label>
              <input
                id="nombre"
                type="text"
                className={`form-input ${errors.nombre ? "input-error" : ""}`}
                placeholder="Ej: Juan Pérez González, María López..."
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
              {/* Campo: Carnet */}
              <div className="form-group">
                <label htmlFor="carnet" className="form-label">
                  Carnet
                  <span className="required">*</span>
                </label>
                <input
                  id="carnet"
                  type="text"
                  className={`form-input ${errors.carnet ? "input-error" : ""}`}
                  placeholder="Ej: 20201012345 (11 dígitos)"
                  value={carnet}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ''); // Solo números
                    setCarnet(value);
                    if (errors.carnet) {
                      setErrors({...errors, carnet: ""});
                    }
                  }}
                  disabled={loading}
                  maxLength={11}
                />
                {errors.carnet && (
                  <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {errors.carnet}
                  </div>
                )}
                {carnet.length > 0 && (
                  <div className="input-meta">
                    <span className={`character-count ${carnet.length !== 11 ? "warning" : "success"}`}>
                      {carnet.length}/11 dígitos
                    </span>
                  </div>
                )}
              </div>

              {/* Campo: Brigada */}
              <div className="form-group">
                <label htmlFor="brigada" className="form-label">
                  Brigada
                  <span className="required">*</span>
                </label>
                <div className={`select-wrapper ${errors.brigada ? "input-error" : ""}`}>
                  {loadingBrigadas ? (
                    <div className="loading-select">
                      <span className="loading-spinner-small"></span>
                      Cargando brigadas...
                    </div>
                  ) : (
                    <>
                      <select
                        id="brigada"
                        className="form-select"
                        value={idBrigada}
                        onChange={(e) => handleBrigadaChange(e.target.value)}
                        disabled={loading || brigadas.length === 0}
                      >
                        <option value="0">Selecciona una brigada</option>
                        {brigadas.map((b) => (
                          <option key={b.id_brigada} value={b.id_brigada}>
                            {b.nombre_brigada}
                          </option>
                        ))}
                      </select>
                      <div className="select-arrow">▼</div>
                    </>
                  )}
                </div>
                {brigadaSeleccionada && (
                  <div className="selected-brigada-info">
                    <span className="info-icon">🎓</span>
                    <div>
                      <strong>{brigadaSeleccionada.nombre_brigada}</strong>
                      <div className="brigada-details">
                        Año: {brigadaSeleccionada.año_brigada}
                      </div>
                    </div>
                  </div>
                )}
                {errors.brigada && (
                  <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {errors.brigada}
                  </div>
                )}
              </div>
            </div>

            {/* Campo: Correo */}
            <div className="form-group">
              <label htmlFor="correo" className="form-label">
                Correo Electrónico
                <span className="required">*</span>
              </label>
              <input
                id="correo"
                type="email"
                className={`form-input ${errors.correo ? "input-error" : ""}`}
                placeholder="Ej: estudiante@universidad.edu"
                value={correo}
                onChange={(e) => {
                  setCorreo(e.target.value);
                  if (errors.correo) {
                    setErrors({...errors, correo: ""});
                  }
                }}
                disabled={loading}
              />
              {errors.correo && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {errors.correo}
                </div>
              )}
            </div>

            {/* Campo: Contraseña */}
            <div className="form-group">
              <label htmlFor="contraseña" className="form-label">
                Contraseña
                <span className="required">*</span>
              </label>
              <div className="password-wrapper">
                <input
                  id="contraseña"
                  type={showPassword ? "text" : "password"}
                  className={`form-input ${errors.contraseña ? "input-error" : ""}`}
                  placeholder={editing ? "Dejar vacío para mantener la actual" : "Mínimo 6 caracteres"}
                  value={contraseña}
                  onChange={(e) => {
                    setContraseña(e.target.value);
                    if (errors.contraseña) {
                      setErrors({...errors, contraseña: ""});
                    }
                  }}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              
              {/* Indicador de fortaleza de contraseña */}
              {contraseña.length > 0 && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div 
                      className="strength-fill"
                      style={{
                        width: `${strength * 25}%`,
                        backgroundColor: getPasswordStrengthColor()
                      }}
                    ></div>
                  </div>
                  <div className="strength-info">
                    <span style={{ color: getPasswordStrengthColor() }}>
                      Fortaleza: {getPasswordStrengthText()}
                    </span>
                    <span className="strength-tips">
                      {strength < 4 && (
                        <>
                          {contraseña.length < 8 && " • Mínimo 8 caracteres"}
                          {!/[A-Z]/.test(contraseña) && " • Incluye mayúsculas"}
                          {!/[0-9]/.test(contraseña) && " • Incluye números"}
                          {!/[^A-Za-z0-9]/.test(contraseña) && " • Incluye símbolos"}
                        </>
                      )}
                    </span>
                  </div>
                </div>
              )}
              
              {errors.contraseña && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {errors.contraseña}
                </div>
              )}
              
              {editing && contraseña.length === 0 && (
                <div className="password-note">
                  <span className="info-icon">💡</span>
                  Deja este campo vacío si no deseas cambiar la contraseña actual.
                </div>
              )}
            </div>

            {/* Previsualización */}
            {nombre.length >= 3 && idBrigada != 0 && (
              <div className="preview-section">
                <h4>👁️ Previsualización:</h4>
                <div className="preview-card">
                  <div className="preview-avatar">{nombre.charAt(0).toUpperCase()}</div>
                  <div className="preview-content">
                    <h5>{nombre}</h5>
                    <div className="preview-details">
                      <span className="preview-detail">
                        <strong>Carnet:</strong> {carnet || "Sin carnet"}
                      </span>
                      <span className="preview-detail">
                        <strong>Correo:</strong> {correo || "Sin correo"}
                      </span>
                      <span className="preview-detail">
                        <strong>Brigada:</strong> {getBrigadaNombre()}
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
                disabled={loading || nombre.trim() === "" || idBrigada == 0 || (!editing && contraseña.trim() === "") || carnet.trim() === "" || correo.trim() === ""}
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
                    {editing ? "Guardar Cambios" : "Crear Estudiante"}
                  </>
                )}
              </button>
            </div>

            {/* Información adicional */}
            <div className="form-info">
              <div className="info-item">
                <span className="info-icon">💡</span>
                <div>
                  <strong>Consejo:</strong> Usa un correo institucional si es posible.
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">🔒</span>
                <div>
                  <strong>Seguridad:</strong> La contraseña se almacena de forma segura.
                </div>
              </div>
              {!editing && (
                <div className="info-item">
                  <span className="info-icon">📧</span>
                  <div>
                    <strong>Correo:</strong> El correo debe ser único para cada estudiante.
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default FormEstudiantes;