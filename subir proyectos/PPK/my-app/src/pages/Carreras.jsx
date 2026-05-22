import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import "./css/Carreras.css"; // Nuevo archivo CSS

const Carreras = () => {
  const [carreras, setCarreras] = useState([]);
  const [facultades, setFacultades] = useState([]);
  const [selectedFacultad, setSelectedFacultad] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [carreraToDelete, setCarreraToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({ total: 0, porFacultad: {} });
  const navigate = useNavigate();

  // Función para obtener facultades
  const fetchFacultades = async () => {
    try {
      const response = await axios.get("http://localhost:3000/auth/facultades");
      setFacultades(response.data);
    } catch (error) {
      console.error("Error al obtener facultades:", error);
    }
  };

  // Función para obtener carreras
  const fetchCarreras = async () => {
    try {
      setLoading(true);
      setError(null);
      const url = selectedFacultad
        ? `http://localhost:3000/auth/carreras/facultad/${selectedFacultad}`
        : "http://localhost:3000/auth/carreras";
      const response = await axios.get(url);
      setCarreras(response.data);
      
      // Calcular estadísticas
      if (!selectedFacultad) {
        const statsObj = {};
        response.data.forEach(carrera => {
          if (!statsObj[carrera.id_facultad]) {
            statsObj[carrera.id_facultad] = 0;
          }
          statsObj[carrera.id_facultad]++;
        });
        setStats({
          total: response.data.length,
          porFacultad: statsObj
        });
      }
    } catch (error) {
      console.error("Error al obtener carreras:", error);
      setError("No se pudieron cargar las carreras. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // Función para confirmar eliminación
  const confirmarEliminarCarrera = (carrera) => {
    setCarreraToDelete(carrera);
    setShowDeleteModal(true);
  };

  // Función para eliminar una carrera
  const eliminarCarrera = async () => {
    try {
      await axios.delete(`http://localhost:3000/auth/carreras/${carreraToDelete.id_carrera}`);
      setCarreras(carreras.filter((c) => c.id_carrera !== carreraToDelete.id_carrera));
      setShowDeleteModal(false);
      setCarreraToDelete(null);
    } catch (error) {
      console.error("Error al eliminar carrera:", error);
      setError("No se pudo eliminar la carrera. Intenta nuevamente.");
    }
  };

  // Filtrar carreras por término de búsqueda
  const filteredCarreras = carreras.filter((carrera) =>
    carrera.nombre_carrera.toLowerCase().includes(searchTerm.toLowerCase()) ||
    carrera.años.toString().includes(searchTerm)
  );

  // Obtener nombre de facultad por ID
  const getFacultadNombre = (id) => {
    const facultad = facultades.find(f => f.id_facultad === id);
    return facultad ? facultad.nombre_facultad : "Sin facultad";
  };

  // Efecto para cargar datos
  useEffect(() => {
    fetchFacultades();
  }, []);

  useEffect(() => {
    fetchCarreras();
  }, [selectedFacultad]);

  return (
    <>
      <Layout />
      
      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmar Eliminación</h3>
            <p>
              ¿Estás seguro de que deseas eliminar la carrera{" "}
              <strong>{carreraToDelete?.nombre_carrera}</strong>?
            </p>
            <p className="warning-text">
              ⚠️ Esta acción también eliminará todas las brigadas y asignaturas asociadas.
            </p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Cancelar
              </button>
              <button className="btn-danger" onClick={eliminarCarrera}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="carreras-container">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <h1>Carreras Universitarias</h1>
            <p className="subtitle">
              Administra las carreras profesionales. {carreras.length} carrera(s) registradas
            </p>
          </div>
          <button
            className="btn-primary btn-add"
            onClick={() => navigate("/home/carreras/new")}
          >
            <span className="btn-icon">+</span>
            Nueva Carrera
          </button>
        </div>

        {/* Filtros y búsqueda */}
        <div className="filters-container">
          <div className="filter-row">
            <div className="filter-group">
              <label className="filter-label">
                <span className="filter-icon">🏛️</span>
                Filtrar por Facultad
              </label>
              <select
                onChange={(e) => setSelectedFacultad(e.target.value)}
                value={selectedFacultad}
                className="filter-select"
              >
                <option value="">Todas las Facultades</option>
                {facultades.map((facultad) => (
                  <option key={facultad.id_facultad} value={facultad.id_facultad}>
                    {facultad.nombre_facultad}
                  </option>
                ))}
              </select>
              {selectedFacultad && (
                <button 
                  className="clear-filter"
                  onClick={() => setSelectedFacultad("")}
                >
                  Limpiar filtro
                </button>
              )}
            </div>
            
            <div className="filter-group">
              <label className="filter-label">
                <span className="filter-icon">🔍</span>
                Buscar carrera
              </label>
              <div className="search-box">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Buscar por nombre o años..."
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
              <div className="stat-icon">🎓</div>
              <div className="stat-content">
                <div className="stat-value">{carreras.length}</div>
                <div className="stat-label">Carreras totales</div>
              </div>
            </div>
            {selectedFacultad && (
              <div className="stat-card">
                <div className="stat-icon">🏛️</div>
                <div className="stat-content">
                  <div className="stat-value">
                    {facultades.find(f => f.id_facultad == selectedFacultad)?.nombre_facultad}
                  </div>
                  <div className="stat-label">Facultad seleccionada</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>⚠️</span>
            <p>{error}</p>
            <button onClick={fetchCarreras}>Reintentar</button>
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando carreras...</p>
          </div>
        ) : filteredCarreras.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎓</div>
            <h3>
              {searchTerm || selectedFacultad 
                ? "No se encontraron carreras" 
                : "No hay carreras registradas"}
            </h3>
            <p>
              {searchTerm 
                ? "Intenta con otro término de búsqueda"
                : selectedFacultad
                ? "No hay carreras en esta facultad"
                : "Comienza agregando una nueva carrera al sistema."}
            </p>
            {!searchTerm && !selectedFacultad && (
              <button
                className="btn-primary"
                onClick={() => navigate("/home/carreras/new")}
              >
                Agregar Primera Carrera
              </button>
            )}
            {(searchTerm || selectedFacultad) && (
              <button 
                className="btn-secondary" 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedFacultad("");
                }}
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Vista de tarjetas para móviles */}
            <div className="carreras-grid-mobile">
              {filteredCarreras.map((carrera) => (
                <div key={carrera.id_carrera} className="carrera-card">
                  <div className="carrera-header">
                    <span className="carrera-icon">🎓</span>
                    <div>
                      <h3 className="carrera-title">{carrera.nombre_carrera}</h3>
                      <div className="carrera-facultad">
                        {getFacultadNombre(carrera.id_facultad)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="carrera-info">
                    <div className="info-item">
                      <span className="info-label">Duración:</span>
                      <span className="info-value">{carrera.años} años</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">ID:</span>
                      <span className="info-value badge">{carrera.id_carrera}</span>
                    </div>
                  </div>

                  <div className="carrera-actions">
                    <button
                      className="btn-action btn-subjects"
                      onClick={() =>
                        navigate(`/home/carreras/asignaturas/${carrera.id_carrera}`)
                      }
                      title="Ver asignaturas"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"/>
                        <path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8m0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/>
                      </svg>
                      Asignaturas
                    </button>
                    
                    <div className="action-group">
                      <button
                        className="btn-action btn-edit"
                        onClick={() =>
                          navigate(`/home/carreras/${carrera.id_carrera}/editar`)
                        }
                        title="Editar"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                        </svg>
                      </button>
                      <button
                        className="btn-action btn-delete"
                        onClick={() => confirmarEliminarCarrera(carrera)}
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
              ))}
            </div>

            {/* Tabla para escritorio */}
            <div className="table-container">
              <table className="carreras-table">
                <thead>
                  <tr>
                    <th>Nombre de la Carrera</th>
                    <th>Facultad</th>
                    <th>Duración</th>
                    <th>ID</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCarreras.map((carrera) => (
                    <tr key={carrera.id_carrera}>
                      <td className="carrera-name">
                        <div className="carrera-info">
                          <span className="carrera-icon">🎓</span>
                          <div>
                            <div className="carrera-title">{carrera.nombre_carrera}</div>
                            <div className="carrera-subtitle">
                              ID: {carrera.id_carrera}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="facultad-info">
                          <span className="facultad-badge">
                            {getFacultadNombre(carrera.id_facultad)}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="duration-container">
                          <span className="duration-badge">{carrera.años} años</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge">#{carrera.id_carrera}</span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-action btn-subjects"
                            onClick={() =>
                              navigate(`/home/carreras/asignaturas/${carrera.id_carrera}`)
                            }
                            title="Ver asignaturas"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"/>
                              <path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8m0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/>
                            </svg>
                            <span>Asignaturas</span>
                          </button>
                          <button
                            className="btn-action btn-edit"
                            onClick={() =>
                              navigate(`/home/carreras/${carrera.id_carrera}/editar`)
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
                            onClick={() => confirmarEliminarCarrera(carrera)}
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
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <div className="page-footer">
          <div className="footer-info">
            <p>
              Mostrando <strong>{filteredCarreras.length}</strong> de{" "}
              <strong>{carreras.length}</strong> carreras
              {selectedFacultad && ` en ${facultades.find(f => f.id_facultad == selectedFacultad)?.nombre_facultad}`}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Carreras;