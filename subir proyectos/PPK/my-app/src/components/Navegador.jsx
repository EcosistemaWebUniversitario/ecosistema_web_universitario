import { Link } from "react-router-dom";

const Navegador = () => {
  return (
    <nav className="navbar navbar-expand bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/home">
          Home
        </Link>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/home/facultades" className="nav-link" href="#">
                 Gestionar Facultades
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/home/asignaturas" className="nav-link" href="#">
              Gestionar Asignaturas
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/home/carreras" className="nav-link" href="#">
              Gestionar Carreras
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/home/brigadas" className="nav-link" href="#">
              Gestionar Brigadas
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/home/estudiantes" className="nav-link" href="#">
              Gestionar Estudiantes
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navegador;
