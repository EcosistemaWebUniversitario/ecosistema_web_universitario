import { useEffect, useState } from "react";
import api from "../api";
import Layout from "../components/Layout";
import { useNavigate, useParams } from "react-router-dom";
import "./css/AsigCarrera.css"; // Nuevo archivo CSS

const AsigCarrera = () => {
  const [asignaturas, setAsignaturas] = useState([]);
  const [carreraInfo, setCarreraInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    asignaturasPorAño: {}
  });
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Obtener información de la carrera
        const carreraResponse = await api.get(
          `/auth/carreras/${params.id}`
        );
        setCarreraInfo(carreraResponse.data[0]);
        
        // Obtener asignaturas de la carrera
        const asignaturasResponse = await api.get(
          `/auth/asignaturas/carrera/${params.id}`
        );
        const asignaturasData = asignaturasResponse.data;
        setAsignaturas(asignaturasData);
        
        // Calcular estadísticas
        calcularEstadisticas(asignaturasData);
        
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("No se pudieron cargar las asignaturas. Intenta nuevamente.");
        setAsignaturas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const calcularEstadisticas = (asignaturasData) => {
    const stats = {
      total: asignaturasData.length,
      asignaturasPorAño: {},
      asignaturasPorSemestre: {}
    };

    // Agrupar por año y semestre
    asignaturasData.forEach(asignatura => {
      const año = asignatura.año || 1;
      const semestre = asignatura.semestre || 1;
      
      stats.asignaturasPorAño[año] = (stats.asignaturasPorAño[año] || 0) + 1;
      
      const claveSemestre = `A${año}-S${semestre}`;
      stats.asignaturasPorSemestre[claveSemestre] = (stats.asignaturasPorSemestre[claveSemestre] || 0) + 1;
    });

    setEstadisticas(stats);
  };

  const eliminarAsignatura = async (id, nombre) => {
    if (!window.confirm(`¿Estás seguro de eliminar la asignatura "${nombre}"?`)) {
      return;
    }

    try {
      await api.delete(
        `/auth/asignaturas/${params.id}/${id}`
      );
      const nuevasAsignaturas = asignaturas.filter((a) => a.id_asignatura !== id);
      setAsignaturas(nuevasAsignaturas);
      calcularEstadisticas(nuevasAsignaturas);
      
      setSuccessMessage(`✓ Asignatura eliminada exitosamente`);
      setTimeout(() => setSuccessMessage(""), 3000);
      
    } catch (err) {
      console.error("Error al eliminar asignatura:", err);
      setError("No se pudo eliminar la asignatura. Intenta nuevamente.");
    }
  };

  // Obtener color para el año
  const getAñoColor = (año) => {
    const colors = [
      '#3b82f6', // Año 1 - Azul
      '#10b981', // Año 2 - Verde
      '#f59e0b', // Año 3 - Amarillo
      '#8b5cf6', // Año 4 - Morado
      '#ec4899', // Año 5 - Rosa
      '#ef4444'  // Año 6 - Rojo
    ];
    return colors[(año - 1) % colors.length] || '#6b7280';
  };

  // Formatear año y semestre
  const formatearAñoSemestre = (año, semestre) => {
    return `A${año} - S${semestre}`;
  };

  // Agrupar asignaturas por año
  const asignaturasPorAño = () => {
    const agrupadas = {};
    asignaturas.forEach(asignatura => {
      const año = asignatura.año || 1;
      if (!agrupadas[año]) {
        agrupadas[año] = [];
      }
      agrupadas[año].push(asignatura);
    });
    return agrupadas;
  };

  return (
    <>
      <Layout />
      <div className="asig-carrera-container">
        <div className="asig-carrera-card">
          {/* Header */}
          <div className="asig-carrera-header">
            <div className="header-content">
              <div className="header-icon">📚</div>
              <div>
                <h1>Asignaturas de la Carrera</h1>
                <p className="header-subtitle">
                  {carreraInfo 
                    ? `Plan de estudios de ${carreraInfo.nombre_carrera} (${carreraInfo.años || 5} años)`
                    : "Cargando información de la carrera..."
                  }
                </p>
              </div>
            </div>
            <button
              className="asig-carrera-add-btn"
              onClick={() =>
                navigate(`/home/carreras/asignaturas/${params.id}/new`)
              }
              disabled={loading}
            >
              <span className="btn-icon">➕</span>
              Nueva Asignatura
            </button>
          </div>

          {/* Estadísticas */}
          <div className="estadisticas-section">
            <div className="estadistica-card principal">
              <div className="estadistica-icon total">📚</div>
              <div className="estadistica-content">
                <div className="estadistica-value">{estadisticas.total}</div>
                <div className="estadistica-label">Total de Asignaturas</div>
              </div>
            </div>
            
            {Object.keys(asignaturasPorAño()).map(año => (
              <div key={año} className="estadistica-card año">
                <div 
                  className="estadistica-icon"
                  style={{ backgroundColor: getAñoColor(parseInt(año)) }}
                >
                  {año}
                </div>
                <div className="estadistica-content">
                  <div className="estadistica-value">{asignaturasPorAño()[año].length}</div>
                  <div className="estadistica-label">Año {año}</div>
                </div>
              </div>
            ))}
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
          <div className="asig-carrera-content">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Cargando asignaturas...</p>
              </div>
            ) : asignaturas.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📖</div>
                <h3>No hay asignaturas registradas</h3>
                <p>
                  Esta carrera no tiene asignaturas registradas aún. 
                  Comienza agregando las asignaturas del plan de estudios.
                </p>
                <button
                  className="empty-btn"
                  onClick={() =>
                    navigate(`/home/carreras/asignaturas/${params.id}/new`)
                  }
                >
                  <span className="btn-icon">➕</span>
                  Agregar Primera Asignatura
                </button>
              </div>
            ) : (
              <>
                {/* Asignaturas agrupadas por año */}
                {Object.keys(asignaturasPorAño()).sort().map(año => (
                  <div key={año} className="año-section">
                    <div className="año-header">
                      <div 
                        className="año-badge"
                        style={{ backgroundColor: getAñoColor(parseInt(año)) }}
                      >
                        Año {año}
                      </div>
                      <div className="año-info">
                        <span className="año-count">
                          {asignaturasPorAño()[año].length} asignatura{asignaturasPorAño()[año].length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    
                    <div className="asignaturas-grid">
                      {asignaturasPorAño()[año].map((a) => (
                        <div key={a.id_asignatura} className="asignatura-card">
                          <div className="asignatura-header">
                            <div 
                              className="asignatura-icon"
                              style={{ 
                                backgroundColor: getAñoColor(parseInt(año)) + '20',
                                color: getAñoColor(parseInt(año))
                              }}
                            >
                              {a.nombre_asignatura.charAt(0)}
                            </div>
                            <div className="asignatura-info">
                              <h4>{a.nombre_asignatura}</h4>
                              <div className="asignatura-meta">
                                {a.año && a.semestre && (
                                  <span className="semestre-badge">
                                    {formatearAñoSemestre(a.año, a.semestre)}
                                  </span>
                                )}
                                {a.creditos && (
                                  <span className="creditos-badge">
                                    {a.creditos} crédito{a.creditos !== 1 ? 's' : ''}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="asignatura-body">
                            {a.descripcion && (
                              <div className="asignatura-descripcion">
                                <p>{a.descripcion}</p>
                              </div>
                            )}
                            
                            <div className="asignatura-acciones">
                              <button
                                className="accion-btn ver"
                                onClick={() =>
                                  navigate(`/home/carreras/asignaturas/${params.id}/${a.id_asignatura}/editar`)
                                }
                                title="Editar asignatura"
                              >
                                <span className="accion-icon">✏️</span>
                                Editar
                              </button>
                              
                              <button
                                className="accion-btn eliminar"
                                onClick={() => eliminarAsignatura(a.id_asignatura, a.nombre_asignatura)}
                                title="Eliminar asignatura"
                              >
                                <span className="accion-icon">🗑️</span>
                                Eliminar
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Resumen */}
                <div className="asignaturas-resumen">
                  <div className="resumen-content">
                    <span className="resumen-icon">📊</span>
                    <div>
                      <strong>Resumen:</strong> {asignaturas.length} asignatura{asignaturas.length !== 1 ? 's' : ''} registrada{asignaturas.length !== 1 ? 's' : ''} en {Object.keys(asignaturasPorAño()).length} año{Object.keys(asignaturasPorAño()).length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="export-options">
                    <button className="export-btn" title="Exportar plan de estudios">
                      <span className="export-icon">📥</span>
                      Exportar Plan
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
                <strong>Consejo:</strong> Organiza las asignaturas por año y semestre para un mejor seguimiento del plan de estudios.
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">🎯</span>
              <div>
                <strong>Planificación:</strong> Asegúrate de incluir todas las asignaturas necesarias para completar la carrera.
              </div>
            </div>
            {carreraInfo && (
              <div className="info-item">
                <span className="info-icon">🎓</span>
                <div>
                  <strong>Carrera:</strong> {carreraInfo.nombre_carrera} - {carreraInfo.años || 5} años de duración
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AsigCarrera;