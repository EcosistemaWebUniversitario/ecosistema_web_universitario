import Layout from "../components/Layout";
import LogoutButton from "../components/LogoutButton";
import { Link } from "react-router-dom";
import "./css/Home.css"; // Importamos el CSS

const Home = () => {
  return (
    <>
      <Layout />
      <div className="home-container">
        <div className="home-header">
          <h1>Panel de Administración</h1>
          <LogoutButton />
        </div>
        
        <div className="dashboard-grid">
          {/* Tarjeta Facultades */}
          <Link to="/home/facultades" className="dashboard-card">
            <div className="card-icon">🏛️</div>
            <h3>Facultades</h3>
            <p>Gestiona las facultades universitarias</p>
            <div className="card-footer">Administrar →</div>
          </Link>

          {/* Tarjeta Asignaturas */}
          <Link to="/home/asignaturas" className="dashboard-card">
            <div className="card-icon">📚</div>
            <h3>Asignaturas</h3>
            <p>Administra las asignaturas académicas</p>
            <div className="card-footer">Administrar →</div>
          </Link>

          {/* Tarjeta Carreras */}
          <Link to="/home/carreras" className="dashboard-card">
            <div className="card-icon">🎓</div>
            <h3>Carreras</h3>
            <p>Gestiona las carreras profesionales</p>
            <div className="card-footer">Administrar →</div>
          </Link>

          {/* Tarjeta Brigadas */}
          <Link to="/home/brigadas" className="dashboard-card">
            <div className="card-icon">👥</div>
            <h3>Brigadas</h3>
            <p>Administra las brigadas estudiantiles</p>
            <div className="card-footer">Administrar →</div>
          </Link>

          {/* Tarjeta Estudiantes */}
          <Link to="/home/estudiantes" className="dashboard-card">
            <div className="card-icon">👨‍🎓</div>
            <h3>Estudiantes</h3>
            <p>Gestiona el registro de estudiantes</p>
            <div className="card-footer">Administrar →</div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;