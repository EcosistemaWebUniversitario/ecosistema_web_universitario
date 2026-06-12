import { Route, Routes, HashRouter, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import HomeEst from "./pages/HomeEst";
import Notas from "./pages/Notas";
import FormNotas from "./components/FormNotas";
import Facultades from "./pages/Facultades";
import Asignaturas from "./pages/Asignaturas";
import FormAsignatura from "./components/FormAsignatura";
import FormFacultad from "./components/FormFacultad";
import FormCarrera from "./components/FormCarrera";
import Carreras from "./pages/Carreras";
import Brigadas from "./pages/Brigadas";
import FormBrigadas from "./components/FormBrigadas";
import Estudiantes from "./pages/Estudiantes";
import FormEstudiantes from "./components/FormEstudiantes";
import AsigCarrera from "./pages/AsigCarrera";
import FormAsigCarrera from "./components/FormAsigCarrera";
import AsignarEstudiante from "./components/AsignarEstudiante";

// Componente para proteger rutas según token y rol
const ProtectedRoute = ({ children, rol }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("rol");

  // Si no hay token, redirigir al login central
  if (!token) {
    window.location.href = "/auth";
    return null;
  }

  // Si no se requiere rol específico, permite el acceso
  if (!rol) return children;

  // Si el rol no coincide, redirigir automáticamente a la sección correcta
  if (userRole !== rol) {
    // Si el usuario es estudiante, redirigir a la sección de estudiante
    if (userRole === "estudiante") {
      return <Navigate to="/estudiante" replace />;
    }
    // Si el usuario es administrador, redirigir al panel de administrador
    if (userRole === "admin_notas") {
      return <Navigate to="/" replace />;
    }
    // Para cualquier otro rol desconocido, mostrar acceso denegado
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a, #1e293b)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", textAlign: "center", padding: "20px" }}>
        <div>
          <div style={{ width: 80, height: 80, borderRadius: "50%", backgroundColor: "#dc2626", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 40, marginBottom: 20 }}>🔒</div>
          <h1 style={{ color: "#f87171", margin: "0 0 10px" }}>Acceso denegado</h1>
          <p style={{ color: "#cbd5e1" }}>No tienes permisos para acceder a esta sección.</p>
          <button onClick={() => { window.location.href = "/notas/"; }} style={{ marginTop: 20, padding: "12px 24px", borderRadius: 12, backgroundColor: "#10b981", color: "white", border: "none", fontWeight: "bold", cursor: "pointer" }}>Volver al inicio</button>
        </div>
      </div>
    );
  }

  return children;
};

function App() {
  const [roleReady, setRoleReady] = useState(false);

  useEffect(() => {
    const fetchRole = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            const data = await response.json();
            const rol = data.role;
            if (rol) {
              localStorage.setItem("rol", rol);
            }
          } else {
            console.warn("No se pudo obtener el rol del servidor");
          }
        } catch (error) {
          console.error("Error al obtener el rol:", error);
        }
      }
      setRoleReady(true);
    };

    fetchRole();
  }, []);

  if (!roleReady) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a, #1e293b)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "white", fontFamily: "sans-serif" }}>Cargando...</p>
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        {/* Panel de administrador */}
        <Route
          path="/"
          element={
            <ProtectedRoute rol="admin_notas">
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/facultades" element={<ProtectedRoute rol="admin_notas"><Facultades /></ProtectedRoute>} />
        <Route path="/facultades/new" element={<ProtectedRoute rol="admin_notas"><FormFacultad /></ProtectedRoute>} />
        <Route path="/facultades/:id/editar" element={<ProtectedRoute rol="admin_notas"><FormFacultad /></ProtectedRoute>} />
        <Route path="/asignaturas" element={<ProtectedRoute rol="admin_notas"><Asignaturas /></ProtectedRoute>} />
        <Route path="/asignaturas/new" element={<ProtectedRoute rol="admin_notas"><FormAsignatura /></ProtectedRoute>} />
        <Route path="/asignaturas/:id/editar" element={<ProtectedRoute rol="admin_notas"><FormAsignatura /></ProtectedRoute>} />
        <Route path="/carreras" element={<ProtectedRoute rol="admin_notas"><Carreras /></ProtectedRoute>} />
        <Route path="/carreras/new" element={<ProtectedRoute rol="admin_notas"><FormCarrera /></ProtectedRoute>} />
        <Route path="/carreras/:id/editar" element={<ProtectedRoute rol="admin_notas"><FormCarrera /></ProtectedRoute>} />
        <Route path="/brigadas" element={<ProtectedRoute rol="admin_notas"><Brigadas /></ProtectedRoute>} />
        <Route path="/brigadas/new" element={<ProtectedRoute rol="admin_notas"><FormBrigadas /></ProtectedRoute>} />
        <Route path="/brigadas/:id/editar" element={<ProtectedRoute rol="admin_notas"><FormBrigadas /></ProtectedRoute>} />
        <Route path="/brigadas/:id/estudiantes" element={<ProtectedRoute rol="admin_notas"><AsignarEstudiante /></ProtectedRoute>} />
        <Route path="/estudiantes" element={<ProtectedRoute rol="admin_notas"><Estudiantes /></ProtectedRoute>} />
        <Route path="/estudiantes/new" element={<ProtectedRoute rol="admin_notas"><FormEstudiantes /></ProtectedRoute>} />
        <Route path="/estudiantes/:id/editar" element={<ProtectedRoute rol="admin_notas"><FormEstudiantes /></ProtectedRoute>} />
        <Route path="/estudiantes/notas/:idBrigada/:idEstudiante" element={<ProtectedRoute rol="admin_notas"><Notas /></ProtectedRoute>} />
        <Route path="/estudiantes/notas/:idBrigada/:idEstudiante/new" element={<ProtectedRoute rol="admin_notas"><FormNotas /></ProtectedRoute>} />
        <Route path="/estudiantes/notas/:idBrigada/:idEstudiante/:idNota/editar" element={<ProtectedRoute rol="admin_notas"><FormNotas /></ProtectedRoute>} />
        <Route path="/carreras/asignaturas/:id" element={<ProtectedRoute rol="admin_notas"><AsigCarrera /></ProtectedRoute>} />
        <Route path="/carreras/asignaturas/:id/new" element={<ProtectedRoute rol="admin_notas"><FormAsigCarrera /></ProtectedRoute>} />
        <Route path="/carreras/asignaturas/:id/:idAsig/editar" element={<ProtectedRoute rol="admin_notas"><FormAsigCarrera /></ProtectedRoute>} />

        {/* Panel del estudiante */}
        <Route
          path="/estudiante"
          element={
            <ProtectedRoute rol="estudiante">
              <HomeEst />
            </ProtectedRoute>
          }
        />

        {/* Redirigir automáticamente según el rol al entrar a /notas */}
        <Route
          path="*"
          element={
            !localStorage.getItem("token") ? null : (
              localStorage.getItem("rol") === "admin_notas" ? (
                <Navigate to="/" replace />
              ) : (
                <Navigate to="/estudiante" replace />
              )
            )
          }
        />
      </Routes>
    </HashRouter>
  );
}

export default App;