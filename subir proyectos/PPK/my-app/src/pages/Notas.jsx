import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { useNavigate, useParams } from "react-router-dom";
import "./css/Notas.css"; // Nuevo archivo CSS

const Notas = () => {
  const [añoBrigada, setAñoBrigada] = useState([]);
  const [notas, setNotas] = useState([]);
  const [promedio, setPromedio] = useState('');
  const [estudianteInfo, setEstudianteInfo] = useState(null);
  const [brigadaInfo, setBrigadaInfo] = useState(null);
  const [selectedAño, setSelectedAño] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingPromedio, setLoadingPromedio] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [estadisticas, setEstadisticas] = useState({
    totalNotas: 0,
    promedioGeneral: 0,
    notasPorAño: {}
  });
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Obtener información del estudiante
        const estudianteResponse = await axios.get(
          `http://localhost:3000/auth/estudiantes/${params.idEstudiante}`
        );
        setEstudianteInfo(estudianteResponse.data[0]);
        
        // Obtener información de la brigada
        const brigadaResponse = await axios.get(
          `http://localhost:3000/auth/brigadas/${params.idBrigada}`
        );
        const brigadaData = brigadaResponse.data[0];
        setBrigadaInfo(brigadaData);
        
        // Generar array de años de la brigada
        const arrayAños = [];
        for (let i = 1; i <= brigadaData.años; i++) {
          arrayAños.push(i);
        }
        setAñoBrigada(arrayAños);
        
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("No se pudieron cargar los datos. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.idBrigada, params.idEstudiante]);

  useEffect(() => {
    const fetchPromedio = async () => {
      try {
        setLoadingPromedio(true);
        const response = await axios.get(
          `http://localhost:3000/auth/notas/promedio/promedio/${params.idEstudiante}`
        );
        const promedioData = response.data[0];
        setPromedio(promedioData.round || 0);
        
        // Actualizar estadísticas
        setEstadisticas(prev => ({
          ...prev,
          promedioGeneral: promedioData.round || 0
        }));
      } catch (err) {
        console.error("Error al obtener promedio:", err);
        setError("No se pudo calcular el promedio.");
      } finally {
        setLoadingPromedio(false);
      }
    };

    if (params.idEstudiante) {
      fetchPromedio();
    }
  }, [params.idEstudiante]);

  useEffect(() => {
    const fetchNotas = async () => {
      try {
        setLoading(true);
        const url = selectedAño
          ? `http://localhost:3000/auth/notas/estudiante/${params.idEstudiante}/${selectedAño}`
          : `http://localhost:3000/auth/notas/estudiante/${params.idEstudiante}`;
        
        const response = await axios.get(url);
        const notasData = response.data;
        setNotas(notasData);
        
        // Calcular estadísticas
        calcularEstadisticas(notasData);
        
      } catch (err) {
        console.error("Error al obtener notas:", err);
        setError("No se pudieron cargar las notas. Intenta nuevamente.");
        setNotas([]);
      } finally {
        setLoading(false);
      }
    };

    if (params.idEstudiante) {
      fetchNotas();
    }
  }, [params.idEstudiante, selectedAño]);

  const calcularEstadisticas = (notasData) => {
    const stats = {
      totalNotas: notasData.length,
      promedioGeneral: parseFloat(promedio) || 0,
      notasPorAño: {},
      promedioPorAño: {}
    };

    // Agrupar por año
    notasData.forEach(nota => {
      const año = nota.año;
      stats.notasPorAño[año] = (stats.notasPorAño[año] || 0) + 1;
      
      if (!stats.promedioPorAño[año]) {
        stats.promedioPorAño[año] = {
          suma: 0,
          cantidad: 0
        };
      }
      stats.promedioPorAño[año].suma += parseFloat(nota.valor);
      stats.promedioPorAño[año].cantidad += 1;
    });

    // Calcular promedios por año
    Object.keys(stats.promedioPorAño).forEach(año => {
      stats.promedioPorAño[año] = 
        (stats.promedioPorAño[año].suma / stats.promedioPorAño[año].cantidad).toFixed(2);
    });

    setEstadisticas(stats);
  };

  const eliminarNota = async (id, asignatura) => {
    if (!window.confirm(`¿Estás seguro de eliminar la nota de "${asignatura}"?`)) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/auth/notas/${id}`);
      const nuevasNotas = notas.filter((n) => n.id_nota !== id);
      setNotas(nuevasNotas);
      calcularEstadisticas(nuevasNotas);
      
      setSuccessMessage(`✓ Nota eliminada exitosamente`);
      setTimeout(() => setSuccessMessage(""), 3000);
      
      // Actualizar promedio
      const response = await axios.get(
        `http://localhost:3000/auth/notas/promedio/promedio/${params.idEstudiante}`
      );
      setPromedio(response.data[0].round || 0);
      
    } catch (err) {
      console.error("Error al eliminar nota:", err);
      setError("No se pudo eliminar la nota. Intenta nuevamente.");
    }
  };

  // Obtener color según la nota
  const getNotaColor = (valor) => {
    const nota = parseFloat(valor);
    if (nota >= 90) return "#10b981"; // Excelente
    if (nota >= 70) return "#3b82f6"; // Buena
    if (nota >= 60) return "#f59e0b"; // Regular
    return "#ef4444"; // Reprobado
  };

  // Obtener icono según la nota
  const getNotaIcono = (valor) => {
    const nota = parseFloat(valor);
    if (nota >= 90) return "🌟";
    if (nota >= 70) return "✅";
    if (nota >= 60) return "⚠️";
    return "❌";
  };

  // Obtener texto según la nota
  const getNotaEstado = (valor) => {
    const nota = parseFloat(valor);
    if (nota >= 90) return "Excelente";
    if (nota >= 70) return "Buena";
    if (nota >= 60) return "Regular";
    return "Reprobado";
  };

  // Calcular promedio de un año específico
  const getPromedioAño = (año) => {
    return estadisticas.promedioPorAño[año] || "Sin datos";
  };

  return (
    <>
      <Layout />
      <div className="notas-container">
        <div className="notas-card">
          {/* Header */}
          <div className="notas-header">
            <div className="header-content">
              <div className="header-icon">📊</div>
              <div>
                <h1>Gestor de Notas</h1>
                <p className="header-subtitle">
                  {estudianteInfo 
                    ? `Notas de ${estudianteInfo.nombre_estudiante}`
                    : "Cargando información del estudiante..."
                  }
                  {brigadaInfo && ` | Brigada: ${brigadaInfo.nombre_brigada}`}
                </p>
              </div>
            </div>
            <button
              className="notas-add-btn"
              onClick={() =>
                navigate(
                  `/home/estudiantes/notas/${params.idBrigada}/${params.idEstudiante}/new`
                )
              }
              disabled={loading}
            >
              <span className="btn-icon">➕</span>
              Nueva Nota
            </button>
          </div>

          {/* Estadísticas Principales */}
          <div className="estadisticas-principales">
            <div className="estadistica-card principal">
              <div className="estadistica-icon promedio">📈</div>
              <div className="estadistica-content">
                <div className="estadistica-value">
                  {loadingPromedio ? (
                    <div className="loading-small">
                      <span className="loading-spinner-small"></span>
                    </div>
                  ) : (
                    promedio || "0.00"
                  )}
                </div>
                <div className="estadistica-label">Promedio General</div>
              </div>
            </div>
            
            <div className="estadistica-card">
              <div className="estadistica-icon total">📝</div>
              <div className="estadistica-content">
                <div className="estadistica-value">{estadisticas.totalNotas}</div>
                <div className="estadistica-label">Total de Notas</div>
              </div>
            </div>
            
            <div className="estadistica-card">
              <div className="estadistica-icon años">🎯</div>
              <div className="estadistica-content">
                <div className="estadistica-value">{añoBrigada.length}</div>
                <div className="estadistica-label">Años de Brigada</div>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="filtros-section">
            <div className="filtro-año">
              <label className="filtro-label">
                <span className="filtro-icon">📅</span>
                Filtrar por Año
              </label>
              <div className="select-wrapper">
                <select
                  onChange={(e) => setSelectedAño(e.target.value)}
                  value={selectedAño}
                  className="filtro-select"
                  disabled={loading}
                >
                  <option value="">Todos los años</option>
                  {añoBrigada.map((a) => (
                    <option key={a} value={a}>
                      Año {a}
                      {estadisticas.promedioPorAño[a] && 
                        ` (Promedio: ${getPromedioAño(a)})`
                      }
                    </option>
                  ))}
                </select>
                <div className="select-arrow">▼</div>
              </div>
            </div>
            
            {/* Estadísticas por año (si hay filtro) */}
            {selectedAño && estadisticas.promedioPorAño[selectedAño] && (
              <div className="estadistica-año">
                <div className="estadistica-año-content">
                  <span className="estadistica-año-icon">🎓</span>
                  <div>
                    <strong>Promedio Año {selectedAño}:</strong>
                    <span className="estadistica-año-valor">
                      {getPromedioAño(selectedAño)}
                    </span>
                  </div>
                </div>
              </div>
            )}
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

          {/* Lista de Notas */}
          <div className="notas-content">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Cargando notas...</p>
              </div>
            ) : notas.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📚</div>
                <h3>No hay notas registradas</h3>
                <p>
                  {selectedAño
                    ? `No hay notas registradas para el año ${selectedAño}.`
                    : "Este estudiante no tiene notas registradas aún."}
                </p>
                <button
                  className="empty-btn"
                  onClick={() =>
                    navigate(
                      `/home/estudiantes/notas/${params.idBrigada}/${params.idEstudiante}/new`
                    )
                  }
                >
                  <span className="btn-icon">➕</span>
                  Agregar Primera Nota
                </button>
              </div>
            ) : (
              <>
                {/* Lista de notas */}
                <div className="notas-grid">
                  {notas.map((n) => (
                    <div key={n.id_nota} className="nota-card">
                      <div className="nota-header">
                        <div 
                          className="nota-icon"
                          style={{ color: getNotaColor(n.valor) }}
                        >
                          {getNotaIcono(n.valor)}
                        </div>
                        <div className="nota-info">
                          <h4>{n.nombre_asignatura}</h4>
                          <div className="nota-meta">
                            <span className="año-badge">Año {n.año}</span>
                            <span 
                              className="estado-badge"
                              style={{ 
                                backgroundColor: getNotaColor(n.valor) + '20',
                                color: getNotaColor(n.valor)
                              }}
                            >
                              {getNotaEstado(n.valor)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="nota-body">
                        <div className="nota-valor-container">
                          <div className="nota-valor">
                            <span className="valor-numero" style={{ color: getNotaColor(n.valor) }}>
                              {n.valor}
                            </span>
                            <span className="valor-maximo">/100</span>
                          </div>
                          <div className="nota-progreso">
                            <div 
                              className="progreso-fill"
                              style={{ 
                                width: `${Math.min(100, parseFloat(n.valor))}%`,
                                backgroundColor: getNotaColor(n.valor)
                              }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="nota-acciones">
                          <button
                            className="accion-btn editar"
                            onClick={() =>
                              navigate(
                                `/home/estudiantes/notas/${params.idBrigada}/${params.idEstudiante}/${n.id_nota}/editar`
                              )
                            }
                            title="Editar nota"
                          >
                            <span className="accion-icon">✏️</span>
                            Editar
                          </button>
                          
                          <button
                            className="accion-btn eliminar"
                            onClick={() => eliminarNota(n.id_nota, n.nombre_asignatura)}
                            title="Eliminar nota"
                          >
                            <span className="accion-icon">🗑️</span>
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Resumen */}
                <div className="notas-resumen">
                  <div className="resumen-content">
                    <span className="resumen-icon">📋</span>
                    <div>
                      <strong>Resumen:</strong> Mostrando {notas.length} nota{notas.length !== 1 ? 's' : ''}
                      {selectedAño && ` del año ${selectedAño}`}
                    </div>
                  </div>
                  <div className="export-options">
                    <button className="export-btn" title="Exportar reporte">
                      <span className="export-icon">📥</span>
                      Exportar Reporte
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
                <strong>Consejo:</strong> Mantén un registro actualizado de todas las notas para un mejor seguimiento.
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">📈</span>
              <div>
                <strong>Estadísticas:</strong> El promedio se actualiza automáticamente al agregar o modificar notas.
              </div>
            </div>
            {brigadaInfo && (
              <div className="info-item">
                <span className="info-icon">🎓</span>
                <div>
                  <strong>Brigada:</strong> {brigadaInfo.nombre_brigada} ({brigadaInfo.años} años)
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Notas;