import { useNavigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export const ProtectedRoute = (rol, { children }) => {
  const [token, setToken] = useState("");
  const [id, setId] = useState("");
  const [rolUsuario, setRolUsuario] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        setToken(localStorage.getItem("token"));
        const response = await axios.get(
          "http://localhost:3000/auth/verificacion",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status !== 201) {
          navigate("/");
        }
        const usuario = response.data;
        setRolUsuario(usuario[0].rol);
        if (rolUsuario === "estudiante") {
          const estudiante = await axios.get(
            `http://localhost:3000/auth/estudiante/usuario/${usuario[0].id_usuario}`
          );
          const data = estudiante.data;
          setId(data[0].id_estudiante);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchDatos();
  }, [navigate, rolUsuario, token]);

  if (rolUsuario !== rol) {
    const url = rolUsuario === "administrador" ? "/home" : `/home/${id}`;
    navigate(url);
  } else {
    return children ? children : <Outlet />;
  }
};
