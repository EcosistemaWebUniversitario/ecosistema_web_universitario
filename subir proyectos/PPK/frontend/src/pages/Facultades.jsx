import { useEffect, useState } from "react";
import api from "../api";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import "./css/Facultades.css"; // Nuevo archivo CSS

const Facultades = () => {
  const [facultades, setFacultades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [facultadToDelete, setFacultadToDelete] = useState(null);
  const navigate = useNavigate();

  // Función para obtener las facultades
  const fetchFacultades = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/auth/facultades");
      setFacultades(response.data);
    } catch (error) {
      console.error("Error al obtener facultades:", error);
      setError("No se pudieron cargar las facultades. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // Función para confirmar eliminación
  const confirmarEliminarFacultad = (facultad) => {
    setFacultadToDelete(facultad);
    setShowDeleteModal(true);
  };

  // Función para eliminar una facultad
  const eliminarFacultad = async () => {
    try {
      await api.delete(
        `/auth/facultades/${facultadToDelete.id_facultad}`,
      );
      setFacultades(
        facultades.filter(
          (facul) => facul.id_facultad !== facultadToDelete.id_facultad,
        ),
      );
      setShowDeleteModal(false);
      setFacultadToDelete(null);
    } catch (error) {
      console.error("Error al eliminar facultad:", error);
      setError("No se pudo eliminar la facultad. Intenta nuevamente.");
    }
  };

  // Efecto para cargar las facultades al montar el componente
  useEffect(() => {
    fetchFacultades();
  }, []);

  return (
    <>
      <Layout />

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmar Eliminación</h3>
            <p>
              ¿Estás seguro de que deseas eliminar la facultad{" "}
              <strong>{facultadToDelete?.nombre_facultad}</strong>?
            </p>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </button>
              <button className="btn-danger" onClick={eliminarFacultad}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="facultades-container">
        <div className="page-header">
          <div className="header-content">
            <h1>Facultades</h1>
            <p className="subtitle">
              Administra las facultades de la universidad. {facultades.length}{" "}
              facultad(es) registradas
            </p>
          </div>
          <button
            className="btn-primary btn-add"
            onClick={() => navigate("/home/facultades/new")}
          >
            <span className="btn-icon">+</span>
            Nueva Facultad
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>⚠️</span>
            <p>{error}</p>
            <button onClick={fetchFacultades}>Reintentar</button>
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando facultades...</p>
          </div>
        ) : facultades.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏛️</div>
            <h3>No hay facultades registradas</h3>
            <p>Comienza agregando una nueva facultad al sistema.</p>
            <button
              className="btn-primary"
              onClick={() => navigate("/home/facultades/new")}
            >
              Agregar Primera Facultad
            </button>
          </div>
        ) : (
          <div className="table-container">
            <div className="table-responsive">
              <table className="facultades-table">
                <thead>
                  <tr>
                    <th>Nombre de la Facultad</th>
                    <th>ID</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {facultades.map((facultad) => (
                    <tr key={facultad.id_facultad}>
                      <td className="facultad-name">
                        <div className="facultad-info">
                          <span className="facultad-icon">🏛️</span>
                          <div>
                            <div className="facultad-title">
                              {facultad.nombre_facultad}
                            </div>
                            <div className="facultad-subtitle">
                              Facultad {facultad.id_facultad}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge">
                          ID: {facultad.id_facultad}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-action btn-edit"
                            onClick={() =>
                              navigate(
                                `/home/facultades/${facultad.id_facultad}/editar`,
                              )
                            }
                            title="Editar"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                            >
                              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                            </svg>
                            <span>Editar</span>
                          </button>
                          <button
                            className="btn-action btn-delete"
                            onClick={() => confirmarEliminarFacultad(facultad)}
                            title="Eliminar"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                            >
                              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
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
          </div>
        )}

        <div className="page-footer">
          <div className="footer-info">
            <p>
              Mostrando <strong>{facultades.length}</strong> de{" "}
              <strong>{facultades.length}</strong> facultades
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Facultades;
