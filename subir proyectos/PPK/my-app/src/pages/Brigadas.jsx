import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import "./css/Brigadas.css"; // Nuevo archivo CSS

const Brigadas = () => {
  const [brigadas, setBrigadas] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [selectedCarrera, setSelectedCarrera] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingCarreras, setLoadingCarreras] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [brigadaToDelete, setBrigadaToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({ total: 0, activas: 0, finalizadas: 0 });
  const navigate = useNavigate();

  // Función para obtener carreras
  const fetchCarreras = async () => {
    try {
      setLoadingCarreras(true);
      const response = await axios.get("http://localhost:3000/auth/carreras");
      setCarreras(response.data);
    } catch (error) {
      console.error("Error al obtener carreras:", error);
      setError("No se pudieron cargar las carreras. Intenta nuevamente.");
    } finally {
      setLoadingCarreras(false);
    }
  };

  // Función para obtener brigadas
  const fetchBrigadas = async () => {
    try {
      setLoading(true);
      setError(null);
      const url = selectedCarrera
        ? `http://localhost:3000/auth/brigadas/carrera/${selectedCarrera}`
        : "http://localhost:3000/auth/brigadas";
      const response = await axios.get(url);
      setBrigadas(response.data);
      
      // Calcular estadísticas
      const currentYear = new Date().getFullYear();
      const activas = response.data.filter(b => b.año_brigada === currentYear).length;
      const finalizadas = response.data.filter(b => b.añoFinal_brigada < currentYear).length;
      
      setStats({
        total: response.data.length,
        activas,
        finalizadas
      });
    } catch (error) {
      console.error("Error al obtener brigadas:", error);
      setError("No se pudieron cargar las brigadas. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // Función para confirmar eliminación
  const confirmarEliminarBrigada = (brigada) => {
    setBrigadaToDelete(brigada);
    setShowDeleteModal(true);
  };

  // Función para eliminar una brigada
  const eliminarBrigada = async () => {
    try {
      await axios.delete(`http://localhost:3000/auth/brigadas/${brigadaToDelete.id_brigada}`);
      setBrigadas(brigadas.filter((brig) => brig.id_brigada !== brigadaToDelete.id_brigada));
      setShowDeleteModal(false);
      setBrigadaToDelete(null);
    } catch (error) {
      console.error("Error al eliminar brigada:", error);
      setError("No se pudo eliminar la brigada. Intenta nuevamente.");
    }
  };

  // Filtrar brigadas por término de búsqueda
  const filteredBrigadas = brigadas.filter((brigada) =>
    brigada.nombre_brigada.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brigada.año_brigada.toString().includes(searchTerm) ||
    brigada.añoFinal_brigada.toString().includes(searchTerm)
  );

  // Obtener nombre de carrera por ID
  const getCarreraNombre = (id) => {
    const carrera = carreras.find(c => c.id_carrera === id);
    return carrera ? carrera.nombre_carrera : "Carrera no encontrada";
  };

  // Determinar estado de la brigada
  const getEstadoBrigada = (añoInicio, añoFinal) => {
    const currentYear = new Date().getFullYear();
    
    if (currentYear < añoInicio) {
      return { texto: "Próxima", clase: "proxima", icono: "⏳" };
    } else if (currentYear > añoFinal) {
      return { texto: "Finalizada", clase: "finalizada", icono: "✅" };
    } else {
      return { texto: "Activa", clase: "activa", icono: "🎓" };
    }
  };

  // Efecto para cargar carreras al montar
  useEffect(() => {
    fetchCarreras();
  }, []);

  // Efecto para cargar brigadas cuando cambia la carrera seleccionada
  useEffect(() => {
    fetchBrigadas();
  }, [selectedCarrera]);

  return (
    <>
      <Layout />
      
      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmar Eliminación</h3>
            <p>
              ¿Estás seguro de que deseas eliminar la brigada{" "}
              <strong>{brigadaToDelete?.nombre_brigada}</strong>?
            </p>
            <p className="warning-text">
              ⚠️ Esta acción eliminará todos los estudiantes asociados a esta brigada.
            </p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Cancelar
              </button>
              <button className="btn-danger" onClick={eliminarBrigada}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="brigadas-container">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <h1>Brigadas Estudiantiles</h1>
            <p className="subtitle">
              Administra los grupos estudiantiles. {brigadas.length} brigada(s) registradas
            </p>
          </div>
          <button
            className="btn-primary btn-add"
            onClick={() => navigate("/home/brigadas/new")}
          >
            <span className="btn-icon">+</span>
            Nueva Brigada
          </button>
        </div>

        {/* Filtros y búsqueda */}
        <div className="filters-container">
          <div className="filter-row">
            <div className="filter-group">
              <label className="filter-label">
                <span className="filter-icon">🎓</span>
                Filtrar por Carrera
              </label>
              <div className="select-wrapper">
                {loadingCarreras ? (
                  <div className="loading-select">
                    <span className="loading-spinner-small"></span>
                    Cargando carreras...
                  </div>
                ) : (
                  <>
                    <select
                      onChange={(e) => setSelectedCarrera(e.target.value)}
                      value={selectedCarrera}
                      className="filter-select"
                    >
                      <option value="">Todas las Carreras</option>
                      {carreras.map((c) => (
                        <option key={c.id_carrera} value={c.id_carrera}>
                          {c.nombre_carrera}
                        </option>
                      ))}
                    </select>
                    <div className="select-arrow">▼</div>
                  </>
                )}
              </div>
              {selectedCarrera && (
                <button 
                  className="clear-filter"
                  onClick={() => setSelectedCarrera("")}
                >
                  Limpiar filtro
                </button>
              )}
            </div>
            
            <div className="filter-group">
              <label className="filter-label">
                <span className="filter-icon">🔍</span>
                Buscar brigada
              </label>
              <div className="search-box">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Buscar por nombre o año..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button className="clear-search" onClick={() => setSearchTerm("")}>
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Estadísticas */}
          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <div className="stat-value">{stats.total}</div>
                <div className="stat-label">Total brigadas</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎓</div>
              <div className="stat-content">
                <div className="stat-value">{stats.activas}</div>
                <div className="stat-label">Brigadas activas</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <div className="stat-value">{stats.finalizadas}</div>
                <div className="stat-label">Brigadas finalizadas</div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>⚠️</span>
            <p>{error}</p>
            <button onClick={fetchBrigadas}>Reintentar</button>
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando brigadas...</p>
          </div>
        ) : filteredBrigadas.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>
              {searchTerm || selectedCarrera 
                ? "No se encontraron brigadas" 
                : "No hay brigadas registradas"}
            </h3>
            <p>
              {searchTerm 
                ? "Intenta con otro término de búsqueda"
                : selectedCarrera
                ? "No hay brigadas en esta carrera"
                : "Comienza agregando una nueva brigada al sistema."}
            </p>
            {!searchTerm && !selectedCarrera && (
              <button
                className="btn-primary"
                onClick={() => navigate("/home/brigadas/new")}
              >
                Agregar Primera Brigada
              </button>
            )}
            {(searchTerm || selectedCarrera) && (
              <button 
                className="btn-secondary" 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCarrera("");
                }}
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Vista de tarjetas para móviles */}
            <div className="brigadas-grid-mobile">
              {filteredBrigadas.map((brigada) => {
                const estado = getEstadoBrigada(brigada.año_brigada, brigada.añoFinal_brigada);
                return (
                  <div key={brigada.id_brigada} className="brigada-card">
                    <div className="brigada-header">
                      <div className={`estado-badge ${estado.clase}`}>
                        {estado.icono} {estado.texto}
                      </div>
                      <h3 className="brigada-title">{brigada.nombre_brigada}</h3>
                      <div className="brigada-carrera">
                        {getCarreraNombre(brigada.id_carrera)}
                      </div>
                    </div>
                    
                    <div className="brigada-info">
                      <div className="info-row">
                        <div className="info-item">
                          <span className="info-label">Año inicio:</span>
                          <span className="info-value">{brigada.año_brigada}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Año final:</span>
                          <span className="info-value">{brigada.añoFinal_brigada}</span>
                        </div>
                      </div>
                      <div className="info-item">
                        <span className="info-label">ID:</span>
                        <span className="info-value badge">{brigada.id_brigada}</span>
                      </div>
                    </div>

                    <div className="brigada-actions">
                      <button
                        className="btn-action btn-students"
                        onClick={() => {
                          // Navegar a estudiantes de esta brigada
                          navigate(`/home/estudiantes?brigada=${brigada.id_brigada}`);
                        }}
                        title="Ver estudiantes"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
                        </svg>
                        Estudiantes
                      </button>
                      
                      <div className="action-group">
                        <button
                          className="btn-action btn-edit"
                          onClick={() =>
                            navigate(`/home/brigadas/${brigada.id_brigada}/editar`)
                          }
                          title="Editar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                          </svg>
                        </button>
                        <button
                          className="btn-action btn-delete"
                          onClick={() => confirmarEliminarBrigada(brigada)}
                          title="Eliminar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tabla para escritorio */}
            <div className="table-container">
              <table className="brigadas-table">
                <thead>
                  <tr>
                    <th>Brigada</th>
                    <th>Carrera</th>
                    <th>Período</th>
                    <th>Estado</th>
                    <th>ID</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBrigadas.map((brigada) => {
                    const estado = getEstadoBrigada(brigada.año_brigada, brigada.añoFinal_brigada);
                    return (
                      <tr key={brigada.id_brigada}>
                        <td className="brigada-name">
                          <div className="brigada-info">
                            <span className="brigada-icon">👥</span>
                            <div>
                              <div className="brigada-title">{brigada.nombre_brigada}</div>
                              <div className="brigada-subtitle">
                                ID: {brigada.id_brigada}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="carrera-info">
                            <span className="carrera-badge">
                              {getCarreraNombre(brigada.id_carrera)}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="periodo-container">
                            <div className="periodo-range">
                              {brigada.año_brigada} - {brigada.añoFinal_brigada}
                            </div>
                            <div className="periodo-duration">
                              {brigada.añoFinal_brigada - brigada.año_brigada + 1} años
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className={`estado-badge-table ${estado.clase}`}>
                            {estado.icono} {estado.texto}
                          </div>
                        </td>
                        <td>
                          <span className="badge">#{brigada.id_brigada}</span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-action btn-students"
                              onClick={() => {
                                navigate(`/home/estudiantes?brigada=${brigada.id_brigada}`);
                              }}
                              title="Ver estudiantes"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
                              </svg>
                              <span>Estudiantes</span>
                            </button>
                            <button
                              className="btn-action btn-edit"
                              onClick={() =>
                                navigate(`/home/brigadas/${brigada.id_brigada}/editar`)
                              }
                              title="Editar"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                              </svg>
                              <span>Editar</span>
                            </button>
                            <button
                              className="btn-action btn-delete"
                              onClick={() => confirmarEliminarBrigada(brigada)}
                              title="Eliminar"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
                              </svg>
                              <span>Eliminar</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        <div className="page-footer">
          <div className="footer-info">
            <p>
              Mostrando <strong>{filteredBrigadas.length}</strong> de{" "}
              <strong>{brigadas.length}</strong> brigadas
              {selectedCarrera && ` en ${carreras.find(c => c.id_carrera == selectedCarrera)?.nombre_carrera}`}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Brigadas;