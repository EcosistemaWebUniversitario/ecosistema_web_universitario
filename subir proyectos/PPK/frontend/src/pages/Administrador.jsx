import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
import "./css/Administrador.css"; // Importa el mismo CSS o crea uno específico

const Administrador = () => {
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
      setErrorCorreo("Por favor, ingresa el correo del administrador.");
      return;
    }

    if (password.trim() === "") {
      setErrorContraseña("Por favor, ingresa la contraseña del administrador.");
      return;
    }

    if (!validateEmail(email)) {
      setErrorCorreo("Por favor ingrese un correo válido.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:4006/auth/loginAdm", {
        email,
        password,
      });

      if (response.status === 200 || response.status === 201) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("rol", response.data.rol);
        navigate("/home");
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
        <h2 className="login-title">Iniciar Sesión Administrador</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              type="email"
              className={`login-input ${errorCorreo ? "input-error" : ""}`}
              placeholder="Correo del administrador"
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
      </div>
    </div>
  );
};

export default Administrador;
