import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "./Layout";
import "./css/FormFacultad.css"; // Nuevo archivo CSS

const FormFacultad = () => {
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formTitle, setFormTitle] = useState("Nueva Facultad");
  const navigate = useNavigate();
  const params = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validaciones
    if (nombre.trim() === "") {
      setError("Por favor, ingresa el nombre de la facultad.");
      return;
    }

    if (nombre.length < 3) {
      setError("El nombre debe tener al menos 3 caracteres.");
      return;
    }

    setLoading(true);

    try {
      if (editing) {
        // Editar facultad existente
        await api.put(`/auth/facultades/${params.id}`, {
          nombre,
        });
      } else {
        // Crear nueva facultad
        const existe = await api.get(
          `/auth/facultades/nombre/${nombre}`
        );
        
        if (existe.data.length > 0) {
          setError("Esta facultad ya existe en el sistema.");
          return;
        }
        
        await api.post("/auth/facultades", { nombre });
      }
      
      // Éxito - redirigir
      navigate("/home/facultades");
      
    } catch (err) {
      console.error("Error al guardar la facultad", err);
      setError(
        err.response?.data?.message || 
        "Error al guardar la facultad. Intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchFacultad = async (id) => {
    try {
      setLoading(true);
      const response = await api.get(
        `/auth/facultades/${id}`
      );
      const data = response.data;
      setNombre(data[0].nombre_facultad);
      setEditing(true);
      setFormTitle("Editar Facultad");
    } catch (error) {
      console.error("Error al cargar la facultad:", error);
      setError("No se pudo cargar la facultad. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/home/facultades");
  };

  useEffect(() => {
    if (params.id) {
      fetchFacultad(params.id);
    }
  }, [params.id]);

  return (
    <>
      <Layout />
      <div className="form-facultad-container">
        <div className="form-card">
          {/* Header del formulario */}
          <div className="form-header">
            <div className="form-icon">🏛️</div>
            <div>
              <h1>{formTitle}</h1>
              <p className="form-subtitle">
                {editing 
                  ? "Modifica los datos de la facultad existente" 
                  : "Completa el formulario para agregar una nueva facultad"}
              </p>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="facultad-form">
            <div className="form-group">
              <label htmlFor="nombre" className="form-label">
                Nombre de la Facultad
                <span className="required">*</span>
              </label>
              <input
                id="nombre"
                type="text"
                className={`form-input ${error ? "input-error" : ""}`}
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  setError("");
                }}
                placeholder="Ej: Facultad de Ingeniería, Facultad de Medicina..."
                disabled={loading}
                maxLength={100}
              />
              <div className="input-hint">
                Máximo 100 caracteres • {nombre.length}/100
              </div>
              
              {error && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {error}
                </div>
              )}
            </div>

            {/* Botones de acción */}
            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading || nombre.trim() === ""}
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
                    {editing ? "Guardar Cambios" : "Crear Facultad"}
                  </>
                )}
              </button>
            </div>

            {/* Información adicional */}
            <div className="form-info">
              <div className="info-item">
                <span className="info-icon">💡</span>
                <div>
                  <strong>Consejo:</strong> Usa nombres descriptivos y completos.
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">📋</span>
                <div>
                  <strong>Formato sugerido:</strong> "Facultad de [Nombre]"
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default FormFacultad;