import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "./Layout";
import "./css/FormAsignatura.css"; // Nuevo archivo CSS

const FormAsignatura = () => {
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formTitle, setFormTitle] = useState("Nueva Asignatura");
  const [characterCount, setCharacterCount] = useState(0);
  const navigate = useNavigate();
  const params = useParams();

  // Actualizar contador de caracteres
  useEffect(() => {
    setCharacterCount(nombre.length);
  }, [nombre]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validaciones
    if (nombre.trim() === "") {
      setError("Por favor, ingresa el nombre de la asignatura.");
      return;
    }

    if (nombre.length < 3) {
      setError("El nombre debe tener al menos 3 caracteres.");
      return;
    }

    if (nombre.length > 100) {
      setError("El nombre no puede exceder los 100 caracteres.");
      return;
    }

    setLoading(true);

    try {
      if (editing) {
        // Editar asignatura existente
        await api.put(`/auth/asignaturas/${params.id}`, {
          nombre,
        });
      } else {
        // Crear nueva asignatura
        const existe = await api.get(
          `/auth/asignaturas/nombre/${nombre}`
        );
        
        if (existe.data.length > 0) {
          setError("Esta asignatura ya existe en el sistema.");
          return;
        }
        
        await api.post("/auth/asignaturas", { nombre });
      }
      
      // Éxito - redirigir
      navigate("/home/asignaturas");
      
    } catch (err) {
      console.error("Error al guardar la asignatura:", err);
      setError(
        err.response?.data?.message || 
        "Error al guardar la asignatura. Intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchAsignatura = async (id) => {
    try {
      setLoading(true);
      const response = await api.get(
        `/auth/asignaturas/${id}`
      );
      const data = response.data;
      setNombre(data[0].nombre_asignatura);
      setEditing(true);
      setFormTitle("Editar Asignatura");
    } catch (error) {
      console.error("Error al cargar la asignatura:", error);
      setError("No se pudo cargar la asignatura. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/home/asignaturas");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchAsignatura(params.id);
    }
  }, [params.id]);

  return (
    <>
      <Layout />
      <div className="form-asignatura-container">
        <div className="form-card">
          {/* Header del formulario */}
          <div className="form-header">
            <div className="form-icon">📚</div>
            <div>
              <h1>{formTitle}</h1>
              <p className="form-subtitle">
                {editing 
                  ? "Modifica los datos de la asignatura existente" 
                  : "Completa el formulario para agregar una nueva asignatura"}
              </p>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="asignatura-form">
            <div className="form-group">
              <label htmlFor="nombre" className="form-label">
                Nombre de la Asignatura
                <span className="required">*</span>
              </label>
              <input
                id="nombre"
                type="text"
                className={`form-input ${error ? "input-error" : ""} ${characterCount > 0 ? "has-content" : ""}`}
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  setError("");
                }}
                onKeyPress={handleKeyPress}
                placeholder="Ej: Matemáticas, Historia, Programación..."
                disabled={loading}
                maxLength={100}
                autoFocus
              />
              <div className="input-meta">
                <span className={`character-count ${characterCount > 90 ? "warning" : ""} ${characterCount === 100 ? "error" : ""}`}>
                  {characterCount}/100 caracteres
                </span>
              </div>
              
              {error && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  <div className="error-content">
                    <strong>Error:</strong> {error}
                  </div>
                </div>
              )}

              {/* Consejos de formato */}
              <div className="format-tips">
                <h4>📝 Formato recomendado:</h4>
                <ul>
                  <li>Usa nombres descriptivos y específicos</li>
                  <li>Incluye el área de conocimiento cuando sea necesario</li>
                  <li>Evita abreviaturas poco comunes</li>
                </ul>
              </div>
            </div>

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
                disabled={loading || nombre.trim() === "" || nombre.length < 3}
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
                    {editing ? "Guardar Cambios" : "Crear Asignatura"}
                  </>
                )}
              </button>
            </div>

            {/* Información adicional */}
            <div className="form-info">
              <div className="info-item">
                <span className="info-icon">💡</span>
                <div>
                  <strong>Consejo:</strong> Las asignaturas se pueden asociar a múltiples carreras.
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">🔗</span>
                <div>
                  <strong>Relaciones:</strong> Cada asignatura puede pertenecer a varias carreras.
                </div>
              </div>
            </div>

            {/* Previsualización */}
            {nombre.trim().length >= 3 && !error && (
              <div className="preview-section">
                <h4>👁️ Previsualización:</h4>
                <div className="preview-card">
                  <div className="preview-icon">📚</div>
                  <div className="preview-content">
                    <h5>{nombre}</h5>
                    <p>Asignatura {editing ? "editada" : "nueva"}</p>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default FormAsignatura;