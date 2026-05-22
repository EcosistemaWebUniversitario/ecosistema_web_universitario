import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="d-flex justify-content-end">
      <button className="btn btn-primary btn-sm " onClick={handleLogout}>
        Cerrar Sesión
      </button>
    </div>
  );
};

export default LogoutButton;
