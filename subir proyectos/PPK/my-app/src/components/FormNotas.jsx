import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "./Layout";
import "./css/FormNotas.css"; // Nuevo archivo CSS

const FormNotas = () => {
  const [año, setAño] = useState(0);
  const [valor, setValor] = useState(0);
  const [valorEscala, setValorEscala] = useState(0); // Valor en escala 0-100
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

  // Obtener información de la brigada
  useEffect(() => {
    const fetchBrigadaInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/auth/brigadas/${params.idBrigada}`
        );
        setBrigadaInfo(response.data[0]);
        
        // Generar array de años disponibles (1 a años de la brigada)
        const añosArray = [];
        for (let i = 1; i <= response.data[0].años; i++) {
          añosArray.push(i);
        }
        setAñosDisponibles(añosArray);
      } catch (error) {
        console.error("Error al obtener información de la brigada:", error);
        setErrors(prev => ({
          ...prev,
          brigada: "No se pudo cargar la información de la brigada."
        }));
      }
    };

    fetchBrigadaInfo();
  }, [params.idBrigada]);

  // Obtener información del estudiante
  useEffect(() => {
    const fetchEstudianteInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/auth/estudiantes/${params.idEstudiante}`
        );
        setEstudianteInfo(response.data[0]);
      } catch (error) {
        console.error("Error al obtener información del estudiante:", error);
      }
    };

    if (params.idEstudiante) {
      fetchEstudianteInfo();
    }
  }, [params.idEstudiante]);

  // Obtener asignaturas
  useEffect(() => {
    const fetchAsignaturas = async () => {
      try {
        setLoadingAsignaturas(true);
        const response = await axios.get(
          `http://localhost:3000/auth/asignaturas/brigada/brigada/${params.idBrigada}`
        );
        setAsignaturas(response.data);
        if (response.data.length === 0) {
          setErrors(prev => ({
            ...prev,
            asignatura: "No hay asignaturas disponibles para esta brigada. Crea asignaturas primero."
          }));
        }
      } catch (error) {
        console.error("Error al obtener asignaturas:", error);
        setErrors(prev => ({
          ...prev,
          asignatura: "No se pudieron cargar las asignaturas. Intenta nuevamente."
        }));
      } finally {
        setLoadingAsignaturas(false);
      }
    };

    if (params.idBrigada) {
      fetchAsignaturas();
    }
  }, [params.idBrigada]);

  // Cuando se selecciona una asignatura
  const handleAsignaturaChange = (asignaturaId) => {
    setIdAsignatura(asignaturaId);
    const asignatura = asignaturas.find(a => a.id_asignatura == asignaturaId);
    setAsignaturaSeleccionada(asignatura);
    if (errors.asignatura) {
      setErrors({...errors, asignatura: ""});
    }
  };

  // Convertir valor de escala 2-5 a 0-100
  const convertirValorAEscala = (valor) => {
    return (valor - 2) * (100 / 3); // Mapear 2-5 a 0-100
  };

  // Convertir valor de escala 0-100 a 2-5
  const convertirValorAOriginal = (valorEscala) => {
    return 2 + (valorEscala * 3 / 100); // Mapear 0-100 a 2-5
  };

  // Actualizar valor en ambas escalas
  const handleValorChange = (newValor) => {
    setValor(newValor);
    setValorEscala(convertirValorAEscala(newValor));
    if (errors.valor) {
      setErrors({...errors, valor: ""});
    }
  };

  // Actualizar valorEscala y calcular valor original
  const handleValorEscalaChange = (newValorEscala) => {
    setValorEscala(newValorEscala);
    setValor(convertirValorAOriginal(newValorEscala).toFixed(1));
    if (errors.valor) {
      setErrors({...errors, valor: ""});
    }
  };

  // Validaciones en tiempo real
  const validateForm = () => {
    const newErrors = {};

    if (idAsignatura === 0 || idAsignatura === "0") {
      newErrors.asignatura = "Por favor, selecciona una asignatura.";
    }

    if (valor < 2 || valor > 5) {
      newErrors.valor = "La nota debe estar entre 2 y 5.";
    } else if (isNaN(valor)) {
      newErrors.valor = "La nota debe ser un número válido.";
    }

    if (año <= 0) {
      newErrors.año = "Por favor, selecciona el año de la nota.";
    } else if (!añosDisponibles.includes(parseInt(año))) {
      newErrors.año = `El año debe estar entre 1 y ${brigadaInfo?.años || 5}.`;
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
      const notaData = {
        id_asignatura: idAsignatura,
        id_estudiante: params.idEstudiante,
        valor: parseFloat(valor),
        año: parseInt(año),
      };

      if (editing) {
        // Editar nota existente
        await axios.put(`http://localhost:3000/auth/notas/${params.idNota}`, notaData);
        setSuccessMessage("✓ Nota actualizada exitosamente");
      } else {
        // Crear nueva nota
        try {
          const existe = await axios.get(
            `http://localhost:3000/auth/notas/${idAsignatura}/${params.idEstudiante}`
          );
          
          if (existe.data.length > 0) {
            setErrors({ ...errors, asignatura: "Este estudiante ya tiene una nota en esta asignatura." });
            setLoading(false);
            return;
          }
          
          await axios.post("http://localhost:3000/auth/notas", notaData);
          setSuccessMessage("✓ Nota creada exitosamente");
        } catch (err) {
          console.error("Error al verificar nota existente:", err);
          setErrors({
            ...errors,
            submit: "Error al verificar la nota existente. Intenta nuevamente."
          });
          setLoading(false);
          return;
        }
      }
      
      // Esperar un momento para mostrar el mensaje de éxito
      setTimeout(() => {
        navigate(
          `/home/estudiantes/notas/${params.idBrigada}/${params.idEstudiante}`
        );
      }, 1500);
      
    } catch (err) {
      console.error("Error al guardar la nota:", err);
      setErrors({
        ...errors,
        submit: err.response?.data?.message || "Error al guardar la nota. Intenta nuevamente."
      });
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos de la nota si estamos editando
  const fetchNota = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/auth/notas/${id}`);
      const data = response.data[0];

      setIdAsignatura(data.id_asignatura);
      handleValorChange(data.valor);
      setAño(data.año);
      
      // Encontrar y establecer la asignatura seleccionada
      const asignatura = asignaturas.find(a => a.id_asignatura == data.id_asignatura);
      setAsignaturaSeleccionada(asignatura);
      
      setEditing(true);
      setFormTitle("Editar Nota");
    } catch (error) {
      console.error("Error al cargar la nota:", error);
      setErrors({
        submit: "No se pudo cargar la nota. Intenta nuevamente."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(
      `/home/estudiantes/notas/${params.idBrigada}/${params.idEstudiante}`
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (params.idNota) {
      fetchNota(params.idNota);
    }
  }, [params.idNota, asignaturas]);

  // Obtener color según el valor
  const getValorColor = () => {
    if (valor >= 4.5) return "#10b981"; // Excelente
    if (valor >= 3.5) return "#3b82f6"; // Buena
    if (valor >= 3.0) return "#f59e0b"; // Regular
    return "#ef4444"; // Reprobado
  };

  // Obtener icono según el valor
  const getValorIcono = () => {
    if (valor >= 4.5) return "🌟";
    if (valor >= 3.5) return "✅";
    if (valor >= 3.0) return "⚠️";
    return "❌";
  };

  // Obtener texto según el valor
  const getValorEstado = () => {
    if (valor >= 4.5) return "Excelente";
    if (valor >= 3.5) return "Buena";
    if (valor >= 3.0) return "Regular";
    return "Reprobado";
  };

  // Obtener nombre de asignatura seleccionada
  const getAsignaturaNombre = () => {
    return asignaturaSeleccionada ? asignaturaSeleccionada.nombre_asignatura : "No seleccionada";
  };

  return (
    <>
      <Layout />
      <div className="form-notas-container">
        <div className="form-card">
          {/* Header del formulario */}
          <div className="form-header">
            <div className="form-icon">📝</div>
            <div>
              <h1>{formTitle}</h1>
              <p className="form-subtitle">
                {estudianteInfo 
                  ? `Registrando nota para ${estudianteInfo.nombre_estudiante}`
                  : "Cargando información del estudiante..."
                }
                {brigadaInfo && ` | Brigada: ${brigadaInfo.nombre_brigada}`}
              </p>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="notas-form" onKeyPress={handleKeyPress}>
            {/* Información del estudiante */}
            {estudianteInfo && (
              <div className="info-estudiante">
                <div className="info-card">
                  <div className="info-header">
                    <span className="info-icon">👨‍🎓</span>
                    <h4>Estudiante</h4>
                  </div>
                  <div className="info-content">
                    <div className="info-item">
                      <span className="info-label">Nombre:</span>
                      <span className="info-value">{estudianteInfo.nombre_estudiante}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Carnet:</span>
                      <span className="info-value">{estudianteInfo.carnet}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Correo:</span>
                      <span className="info-value">{estudianteInfo.correo}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Campos del formulario */}
            <div className="form-row">
              {/* Campo: Asignatura */}
              <div className="form-group">
                <label htmlFor="asignatura" className="form-label">
                  Asignatura
                  <span className="required">*</span>
                </label>
                <div className={`select-wrapper ${errors.asignatura ? "input-error" : ""}`}>
                  {loadingAsignaturas ? (
                    <div className="loading-select">
                      <span className="loading-spinner-small"></span>
                      Cargando asignaturas...
                    </div>
                  ) : (
                    <>
                      <select
                        id="asignatura"
                        className="form-select"
                        value={idAsignatura}
                        onChange={(e) => handleAsignaturaChange(e.target.value)}
                        disabled={loading || asignaturas.length === 0}
                      >
                        <option value="0">Selecciona una asignatura</option>
                        {asignaturas.map((a) => (
                          <option key={a.id_asignatura} value={a.id_asignatura}>
                            {a.nombre_asignatura}
                          </option>
                        ))}
                      </select>
                      <div className="select-arrow">▼</div>
                    </>
                  )}
                </div>
                {errors.asignatura && (
                  <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {errors.asignatura}
                  </div>
                )}
              </div>

              {/* Campo: Año */}
              <div className="form-group">
                <label htmlFor="año" className="form-label">
                  Año
                  <span className="required">*</span>
                </label>
                <div className={`select-wrapper ${errors.año ? "input-error" : ""}`}>
                  <select
                    id="año"
                    className="form-select"
                    value={año}
                    onChange={(e) => {
                      setAño(e.target.value);
                      if (errors.año) {
                        setErrors({...errors, año: ""});
                      }
                    }}
                    disabled={loading || añosDisponibles.length === 0}
                  >
                    <option value="0">Selecciona el año</option>
                    {añosDisponibles.map((a) => (
                      <option key={a} value={a}>
                        Año {a}
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
            </div>

            {/* Campo: Valor */}
            <div className="form-group">
              <label htmlFor="valor" className="form-label">
                Calificación
                <span className="required">*</span>
              </label>
              
              <div className="valor-container">
                {/* Slider para valor 0-100 */}
                <div className="valor-slider-container">
                  <input
                    id="valorEscala"
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={valorEscala}
                    onChange={(e) => handleValorEscalaChange(e.target.value)}
                    className="valor-slider"
                    style={{
                      background: `linear-gradient(to right, #ef4444 0%, #f59e0b 33%, #3b82f6 66%, #10b981 100%)`
                    }}
                  />
                  <div className="valor-ticks">
                    <span>0</span>
                    <span>33</span>
                    <span>66</span>
                    <span>100</span>
                  </div>
                </div>
                
                {/* Input numérico para valor 2-5 */}
                <div className="valor-input-container">
                  <div className="valor-input-wrapper">
                    <input
                      id="valor"
                      type="number"
                      min="2"
                      max="5"
                      step="0.1"
                      value={valor}
                      onChange={(e) => handleValorChange(e.target.value)}
                      className={`form-input valor-input ${errors.valor ? "input-error" : ""}`}
                      disabled={loading}
                    />
                    <span className="valor-input-suffix">/ 5.0</span>
                  </div>
                  
                  {/* Indicador visual */}
                  <div className="valor-indicador">
                    <div 
                      className="valor-circulo"
                      style={{ backgroundColor: getValorColor() }}
                    >
                      <span className="valor-circulo-text">{getValorIcono()}</span>
                    </div>
                    <div className="valor-info">
                      <span className="valor-texto" style={{ color: getValorColor() }}>
                        {getValorEstado()}
                      </span>
                      <span className="valor-porcentaje">
                        {valorEscala} / 100
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {errors.valor && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {errors.valor}
                </div>
              )}
            </div>

            {/* Previsualización */}
            {idAsignatura != 0 && año != 0 && valor >= 2 && (
              <div className="preview-section">
                <h4>👁️ Previsualización:</h4>
                <div className="preview-card">
                  <div className="preview-icon" style={{ color: getValorColor() }}>
                    {getValorIcono()}
                  </div>
                  <div className="preview-content">
                    <h5>{getAsignaturaNombre()}</h5>
                    <div className="preview-details">
                      <span className="preview-detail">
                        <strong>Calificación:</strong> {valor} / 5.0
                      </span>
                      <span className="preview-detail">
                        <strong>Equivalente:</strong> {valorEscala} / 100
                      </span>
                      <span className="preview-detail">
                        <strong>Año:</strong> {año}
                      </span>
                      <span className="preview-detail">
                        <strong>Estado:</strong> {getValorEstado()}
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
                disabled={loading || idAsignatura == 0 || año == 0 || valor < 2}
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
                    {editing ? "Guardar Cambios" : "Crear Nota"}
                  </>
                )}
              </button>
            </div>

            {/* Información adicional */}
            <div className="form-info">
              <div className="info-item">
                <span className="info-icon">📊</span>
                <div>
                  <strong>Escala de Calificación:</strong> 2.0 - 5.0 (equivalente a 0 - 100 puntos)
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">🎯</span>
                <div>
                  <strong>Nota Mínima:</strong> 3.0 (equivalente a 60/100) para aprobar.
                </div>
              </div>
              {brigadaInfo && (
                <div className="info-item">
                  <span className="info-icon">📅</span>
                  <div>
                    <strong>Años de Brigada:</strong> {brigadaInfo.años} años totales.
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

export default FormNotas;