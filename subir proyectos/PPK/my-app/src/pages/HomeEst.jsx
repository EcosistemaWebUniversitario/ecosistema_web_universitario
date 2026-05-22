import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import NavEst from "../components/NavEst";
import LogoutButton from "../components/LogoutButton";
import "./css/HomeEst.css"; // Nuevo archivo CSS

const HomeEst = () => {
  const [notas, setNotas] = useState([]);
  const [promedio, setPromedio] = useState('');
  const [estudianteInfo, setEstudianteInfo] = useState(null);
  const [brigadaInfo, setBrigadaInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingPromedio, setLoadingPromedio] = useState(true);
  const [error, setError] = useState("");
  const [selectedAño, setSelectedAño] = useState("");
  const [añosDisponibles, setAñosDisponibles] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    totalNotas: 0,
    promedioGeneral: 0,
    notasPorAño: {},
    mejoresNotas: [],
    peoresNotas: []
  });
  const params = useParams();

  // Obtener información del estudiante
  useEffect(() => {
    const fetchEstudianteInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/auth/estudiantes/${params.id}`
        );
        setEstudianteInfo(response.data[0]);
        
        // Obtener información de la brigada
        if (response.data[0].id_brigada) {
          const brigadaResponse = await axios.get(
            `http://localhost:3000/auth/brigadas/${response.data[0].id_brigada}`
          );
          setBrigadaInfo(brigadaResponse.data[0]);
        }
      } catch (err) {
        console.error("Error al obtener información del estudiante:", err);
      }
    };

    fetchEstudianteInfo();
  }, [params.id]);

  // Obtener promedio
  useEffect(() => {
    const fetchPromedio = async () => {
      try {
        setLoadingPromedio(true);
        const response = await axios.get(
          `http://localhost:3000/auth/notas/promedio/promedio/${params.id}`
        );
        const promedioData = response.data[0];
        setPromedio(promedioData.round || 0);
        
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

    fetchPromedio();
  }, [params.id]);

  // Obtener notas
  useEffect(() => {
    const fetchNotas = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3000/auth/notas/estudiante/${params.id}`
        );
        const notasData = response.data;
        setNotas(notasData);
        
        // Calcular estadísticas
        calcularEstadisticas(notasData);
        
        // Obtener años disponibles
        const años = [...new Set(notasData.map(n => n.año))].sort();
        setAñosDisponibles(años);
        
      } catch (err) {
        console.error("Error al obtener notas:", err);
        setError("No se pudieron cargar las notas. Intenta nuevamente.");
        setNotas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotas();
  }, [params.id]);

  // Filtrar notas por año
  useEffect(() => {
    if (selectedAño) {
      const fetchNotasPorAño = async () => {
        try {
          setLoading(true);
          const response = await axios.get(
            `http://localhost:3000/auth/notas/estudiante/${params.id}/${selectedAño}`
          );
          const notasData = response.data;
          setNotas(notasData);
          calcularEstadisticas(notasData);
        } catch (err) {
          console.error("Error al filtrar notas por año:", err);
          setError("No se pudieron cargar las notas filtradas.");
        } finally {
          setLoading(false);
        }
      };
      fetchNotasPorAño();
    } else {
      // Si no hay año seleccionado, recargar todas las notas
      const fetchNotas = async () => {
        try {
          setLoading(true);
          const response = await axios.get(
            `http://localhost:3000/auth/notas/estudiante/${params.id}`
          );
          const notasData = response.data;
          setNotas(notasData);
          calcularEstadisticas(notasData);
        } catch (err) {
          console.error("Error al obtener notas:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchNotas();
    }
  }, [selectedAño, params.id]);

  const calcularEstadisticas = (notasData) => {
    if (notasData.length === 0) {
      setEstadisticas({
        totalNotas: 0,
        promedioGeneral: parseFloat(promedio) || 0,
        notasPorAño: {},
        mejoresNotas: [],
        peoresNotas: []
      });
      return;
    }

    const stats = {
      totalNotas: notasData.length,
      promedioGeneral: parseFloat(promedio) || 0,
      notasPorAño: {},
      promedioPorAño: {},
      mejoresNotas: [],
      peoresNotas: []
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

    // Encontrar mejores y peores notas
    const notasOrdenadas = [...notasData].sort((a, b) => parseFloat(b.valor) - parseFloat(a.valor));
    stats.mejoresNotas = notasOrdenadas.slice(0, Math.min(3, notasOrdenadas.length));
    stats.peoresNotas = notasOrdenadas.slice(-Math.min(3, notasOrdenadas.length)).reverse();

    setEstadisticas(stats);
  };

  // Obtener color según la nota
  const getNotaColor = (valor) => {
    const nota = parseFloat(valor);
    if (nota >= 4.5) return "#10b981"; // Excelente
    if (nota >= 3.5) return "#3b82f6"; // Buena
    if (nota >= 3.0) return "#f59e0b"; // Regular
    return "#ef4444"; // Reprobado
  };

  // Obtener icono según la nota
  const getNotaIcono = (valor) => {
    const nota = parseFloat(valor);
    if (nota >= 4.5) return "🌟";
    if (nota >= 3.5) return "✅";
    if (nota >= 3.0) return "⚠️";
    return "❌";
  };

  // Obtener texto según la nota
  const getNotaEstado = (valor) => {
    const nota = parseFloat(valor);
    if (nota >= 4.5) return "Excelente";
    if (nota >= 3.5) return "Buena";
    if (nota >= 3.0) return "Regular";
    return "Reprobado";
  };

  // Calcular promedio de un año específico
  const getPromedioAño = (año) => {
    return estadisticas.promedioPorAño[año] || "Sin datos";
  };

  // Formatear valor a escala 0-100
  const getValorEscala = (valor) => {
    const nota = parseFloat(valor);
    return Math.min(100, Math.max(0, ((nota - 2) * (100 / 3))));
  };

  return (
    <>
      <NavEst />
      <div className="home-est-container">
        <div className="home-est-card">
          {/* Header */}
          <div className="home-est-header">
            <div className="header-content">
              <div className="header-avatar">
                {estudianteInfo?.nombre_estudiante?.charAt(0) || "E"}
              </div>
              <div className="header-info">
                <h1>Panel del Estudiante</h1>
                <p className="header-subtitle">
                  {estudianteInfo 
                    ? `Bienvenido, ${estudianteInfo.nombre_estudiante}`
                    : "Cargando información..."
                  }
                  {brigadaInfo && ` | ${brigadaInfo.nombre_brigada}`}
                </p>
              </div>
            </div>
            <div className="header-actions">
              <LogoutButton />
            </div>
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
                <div className="estadistica-value">{añosDisponibles.length}</div>
                <div className="estadistica-label">Años Cursados</div>
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
                  {añosDisponibles.map((a) => (
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

          {/* Mensaje de error */}
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {/* Destacados (Mejores y Peores Notas) */}
          {!loading && estadisticas.mejoresNotas.length > 0 && (
            <div className="destacados-section">
              <div className="destacados-grid">
                <div className="destacado-card mejor">
                  <div className="destacado-header">
                    <span className="destacado-icon">🏆</span>
                    <h3>Mejores Calificaciones</h3>
                  </div>
                  <div className="destacado-list">
                    {estadisticas.mejoresNotas.map((nota, index) => (
                      <div key={nota.id_nota} className="destacado-item">
                        <span className="destacado-posicion">{index + 1}</span>
                        <span className="destacado-asignatura">{nota.nombre_asignatura}</span>
                        <span 
                          className="destacado-valor"
                          style={{ color: getNotaColor(nota.valor) }}
                        >
                          {nota.valor}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="destacado-card peor">
                  <div className="destacado-header">
                    <span className="destacado-icon">📉</span>
                    <h3>Áreas de Mejora</h3>
                  </div>
                  <div className="destacado-list">
                    {estadisticas.peoresNotas.map((nota, index) => (
                      <div key={nota.id_nota} className="destacado-item">
                        <span className="destacado-posicion">{index + 1}</span>
                        <span className="destacado-asignatura">{nota.nombre_asignatura}</span>
                        <span 
                          className="destacado-valor"
                          style={{ color: getNotaColor(nota.valor) }}
                        >
                          {nota.valor}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contenido Principal */}
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
                    : "Aún no tienes notas registradas en el sistema."}
                </p>
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
                            <span className="valor-maximo">/5.0</span>
                          </div>
                          <div className="valor-escala">
                            <span className="escala-texto">
                              Equivalente: {getValorEscala(n.valor).toFixed(0)}/100
                            </span>
                          </div>
                          <div className="nota-progreso">
                            <div 
                              className="progreso-fill"
                              style={{ 
                                width: `${Math.min(100, getValorEscala(n.valor))}%`,
                                backgroundColor: getNotaColor(n.valor)
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Resumen */}
                <div className="notas-resumen">
                  <div className="resumen-content">
                    <span className="resumen-icon">📊</span>
                    <div>
                      <strong>Resumen:</strong> Mostrando {notas.length} nota{notas.length !== 1 ? 's' : ''}
                      {selectedAño && ` del año ${selectedAño}`}
                      {estadisticas.promedioGeneral > 0 && ` | Promedio: ${estadisticas.promedioGeneral}`}
                    </div>
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
                <strong>Consejo:</strong> Mantén un seguimiento regular de tus calificaciones para identificar áreas de mejora.
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">🎯</span>
              <div>
                <strong>Meta:</strong> Intenta mantener un promedio por encima de 3.5 para un buen rendimiento académico.
              </div>
            </div>
            {estudianteInfo && (
              <div className="info-item">
                <span className="info-icon">👨‍🎓</span>
                <div>
                  <strong>Estudiante:</strong> {estudianteInfo.nombre_estudiante} - {estudianteInfo.carnet}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeEst;