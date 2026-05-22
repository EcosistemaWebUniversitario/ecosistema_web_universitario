import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./css/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [errorCorreo, setErrorCorreo] = useState("");
  const [errorContraseña, setErrorContraseña] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorCorreo("");
    setErrorContraseña("");

    if (email.trim() === "") {
      setErrorCorreo("Por favor, ingresa el correo del estudiante.");
      return;
    }

    if (password.trim() === "") {
      setErrorContraseña("Por favor, ingresa la contraseña del estudiante.");
      return;
    }

    if (!validateEmail(email)) {
      setErrorCorreo("Por favor ingrese un correo válido.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });

      if (response.status === 201) {
        localStorage.setItem("token", response.data.token);
        const decodedToken = jwtDecode(response.data.token);
        const id = decodedToken.id;
        const estudiante = await axios.get(
          `http://localhost:3000/auth/estudiante/usuario/${id}`,
        );
        const data = estudiante.data;
        navigate(`/home/${data[0].id_estudiante}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              type="email"
              className={`login-input ${errorCorreo ? "input-error" : ""}`}
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errorCorreo && <div className="error-text">{errorCorreo}</div>}
          </div>
          <div className="input-group">
            <input
              type="password"
              className={`login-input ${errorContraseña ? "input-error" : ""}`}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errorContraseña && (
              <div className="error-text">{errorContraseña}</div>
            )}
          </div>
          <button className="login-button" type="submit">
            Iniciar Sesión
          </button>
          {error && <div className="error-message">{error}</div>}
        </form>
        <Link to="/administrador" className="admin-link">
          Acceso administrador
        </Link>
      </div>
    </div>
  );
};

export default Login;
