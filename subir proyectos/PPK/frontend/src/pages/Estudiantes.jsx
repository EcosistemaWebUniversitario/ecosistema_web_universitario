import { useEffect, useState } from "react";
import api from "../api";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import "./css/Estudiantes.css"; // Nuevo archivo CSS

const Estudiantes = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [brigadas, setBrigadas] = useState([]);
  const [selectedBrigada, setSelectedBrigada] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingBrigadas, setLoadingBrigadas] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    porBrigada: {}
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBrigadas = async () => {
      try {
        setLoadingBrigadas(true);
        const response = await api.get("/auth/brigadas");
        setBrigadas(response.data);
      } catch (err) {
        console.error("Error al obtener brigadas:", err);
        setError("No se pudieron cargar las brigadas. Intenta nuevamente.");
      } finally {
        setLoadingBrigadas(false);
      }
    };

    fetchBrigadas();
  }, []);

  useEffect(() => {
    const fetchEstudiantes = async () => {
      try {
        setLoading(true);
        setError("");
        const url = selectedBrigada
          ? `/auth/estudiantes/brigada/${selectedBrigada}`
          : "/auth/estudiantes";
        const response = await api.get(url);
        setEstudiantes(response.data);
        
        // Calcular estadísticas
        calcularEstadisticas(response.data);
      } catch (err) {
        console.error("Error al obtener estudiantes:", err);
        setError("No se pudieron cargar los estudiantes. Intenta nuevamente.");
        setEstudiantes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEstudiantes();
  }, [selectedBrigada]);

  const calcularEstadisticas = (data) => {
    const stats = {
      total: data.length,
      porBrigada: {}
    };

    data.forEach(estudiante => {
      const brigadaId = estudiante.id_brigada;
      stats.porBrigada[brigadaId] = (stats.porBrigada[brigadaId] || 0) + 1;
    });

    setEstadisticas(stats);
  };

  const eliminarEstudiante = async (id, nombre) => {
    if (!window.confirm(`¿Estás seguro de eliminar al estudiante ${nombre}?`)) {
      return;
    }

    try {
      await api.delete(`/auth/estudiantes/${id}`);
      setEstudiantes(estudiantes.filter((e) => e.id_estudiante !== id));
      setSuccessMessage(`✓ Estudiante eliminado exitosamente`);
      
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error("Error al eliminar estudiante:", err);
      setError("No se pudo eliminar el estudiante. Intenta nuevamente.");
    }
  };

  // Obtener nombre de brigada
  const getBrigadaNombre = (idBrigada) => {
    const brigada = brigadas.find(b => b.id_brigada === idBrigada);
    return brigada ? brigada.nombre_brigada : "Sin brigada asignada";
  };

  // Obtener color de brigada
  const getBrigadaColor = (idBrigada) => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    const index = brigadas.findIndex(b => b.id_brigada === idBrigada);
    return index !== -1 ? colors[index % colors.length] : '#6b7280';
  };

  return (
    <>
      <Layout />
      <div className="estudiantes-container">
        <div className="estudiantes-card">
          {/* Header */}
          <div className="estudiantes-header">
            <div className="header-content">
              <div className="header-icon">👨‍🎓</div>
              <div>
                <h1>Gestión de Estudiantes</h1>
                <p className="header-subtitle">
                  Administra y gestiona los estudiantes del sistema
                </p>
              </div>
            </div>
            <button
              className="estudiantes-add-btn"
              onClick={() => navigate("/home/estudiantes/new")}
              disabled={loading}
            >
              <span className="btn-icon">➕</span>
              Nuevo Estudiante
            </button>
          </div>

          {/* Filtros y Estadísticas */}
          <div className="filtros-section">
            <div className="filtro-brigada">
              <label className="filtro-label">
                <span className="filtro-icon">🎓</span>
                Filtrar por Brigada
              </label>
              <div className="select-wrapper">
                <select
                  onChange={(e) => setSelectedBrigada(e.target.value)}
                  value={selectedBrigada}
                  className="filtro-select"
                  disabled={loadingBrigadas}
                >
                  <option value="">Todas las Brigadas</option>
                  {brigadas.map((b) => (
                    <option key={b.id_brigada} value={b.id_brigada}>
                      {b.nombre_brigada}
                    </option>
                  ))}
                </select>
                <div className="select-arrow">▼</div>
              </div>
              {loadingBrigadas && (
                <div className="loading-small">
                  <span className="loading-spinner-small"></span>
                  Cargando brigadas...
                </div>
              )}
            </div>

            {/* Estadísticas */}
            <div className="estadisticas-grid">
              <div className="estadistica-card">
                <div className="estadistica-icon total">👥</div>
                <div className="estadistica-content">
                  <h3>{estadisticas.total}</h3>
                  <p>Total Estudiantes</p>
                </div>
              </div>
              {selectedBrigada && (
                <div className="estadistica-card">
                  <div className="estadistica-icon brigada">🎯</div>
                  <div className="estadistica-content">
                    <h3>{estudiantes.length}</h3>
                    <p>En esta brigada</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mensajes */}
          {successMessage && (
            <div className="success-message">
              <span className="success-icon">✅</span>
              {successMessage}
            </div>
          )}

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {/* Contenido Principal */}
          <div className="estudiantes-content">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Cargando estudiantes...</p>
              </div>
            ) : estudiantes.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📚</div>
                <h3>No hay estudiantes registrados</h3>
                <p>
                  {selectedBrigada
                    ? "No hay estudiantes en esta brigada. Intenta con otra brigada."
                    : "Comienza agregando nuevos estudiantes al sistema."}
                </p>
                <button
                  className="empty-btn"
                  onClick={() => navigate("/home/estudiantes/new")}
                >
                  <span className="btn-icon">➕</span>
                  Agregar Primer Estudiante
                </button>
              </div>
            ) : (
              <>
                {/* Lista de Estudiantes */}
                <div className="estudiantes-grid">
                  {estudiantes.map((e) => (
                    <div key={e.id_estudiante} className="estudiante-card">
                      <div className="estudiante-header">
                        <div className="estudiante-avatar">
                          {e.nombre_estudiante.charAt(0)}
                        </div>
                        <div className="estudiante-info">
                          <h4>{e.nombre_estudiante}</h4>
                          <div className="estudiante-meta">
                            <span className="carnet-badge">{e.carnet}</span>
                            <span 
                              className="brigada-badge"
                              style={{ 
                                backgroundColor: getBrigadaColor(e.id_brigada) + '20',
                                color: getBrigadaColor(e.id_brigada)
                              }}
                            >
                              {getBrigadaNombre(e.id_brigada)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="estudiante-body">
                        <div className="estudiante-detail">
                          <span className="detail-icon">📧</span>
                          <a href={`mailto:${e.correo}`} className="estudiante-email">
                            {e.correo}
                          </a>
                        </div>
                        
                        <div className="estudiante-actions">
                          <button
                            className="action-btn notas"
                            onClick={() =>
                              navigate(
                                `/home/estudiantes/notas/${e.id_brigada}/${e.id_estudiante}`
                              )
                            }
                            title="Ver y gestionar notas"
                          >
                            <span className="action-icon">📝</span>
                            Notas
                          </button>
                          
                          <button
                            className="action-btn editar"
                            onClick={() =>
                              navigate(`/home/estudiantes/${e.id_estudiante}/editar`)
                            }
                            title="Editar estudiante"
                          >
                            <span className="action-icon">✏️</span>
                            Editar
                          </button>
                          
                          <button
                            className="action-btn eliminar"
                            onClick={() => eliminarEstudiante(e.id_estudiante, e.nombre_estudiante)}
                            title="Eliminar estudiante"
                          >
                            <span className="action-icon">🗑️</span>
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pie de página con resumen */}
                <div className="estudiantes-footer">
                  <div className="resumen">
                    <span className="resumen-icon">📊</span>
                    <div>
                      <strong>Resumen:</strong> Mostrando {estudiantes.length} estudiante{estudiantes.length !== 1 ? 's' : ''}
                      {selectedBrigada && ` de la brigada seleccionada`}
                    </div>
                  </div>
                  <div className="export-options">
                    <button className="export-btn" title="Exportar a Excel">
                      <span className="export-icon">📥</span>
                      Exportar
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Información Adicional */}
          <div className="info-section">
            <div className="info-item">
              <span className="info-icon">💡</span>
              <div>
                <strong>Consejo:</strong> Usa los filtros para encontrar rápidamente a los estudiantes.
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">⚡</span>
              <div>
                <strong>Acción rápida:</strong> Haz clic en el correo de un estudiante para enviarle un email.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Estudiantes;