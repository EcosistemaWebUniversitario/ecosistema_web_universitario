import { Route, Routes, BrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Login from "./pages/Login";
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
import Administrador from "./pages/Administrador";

import AsignarEstudiante from "./components/AsignarEstudiante";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/administrador" element={<Administrador />} />

        {/* Rutas protegidas — estudiante */}
        <Route
          path="/home/:id"
          element={
            <ProtectedRoute rol="estudiante">
              <HomeEst />
            </ProtectedRoute>
          }
        />

        {/* Rutas protegidas — admin_notas */}
        <Route
          path="/home"
          element={
            <ProtectedRoute rol="admin_notas">
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/home/facultades" element={<ProtectedRoute rol="admin_notas"><Facultades /></ProtectedRoute>} />
        <Route path="/home/facultades/new" element={<ProtectedRoute rol="admin_notas"><FormFacultad /></ProtectedRoute>} />
        <Route path="/home/facultades/:id/editar" element={<ProtectedRoute rol="admin_notas"><FormFacultad /></ProtectedRoute>} />
        <Route path="/home/asignaturas" element={<ProtectedRoute rol="admin_notas"><Asignaturas /></ProtectedRoute>} />
        <Route path="/home/asignaturas/new" element={<ProtectedRoute rol="admin_notas"><FormAsignatura /></ProtectedRoute>} />
        <Route path="/home/asignaturas/:id/editar" element={<ProtectedRoute rol="admin_notas"><FormAsignatura /></ProtectedRoute>} />
        <Route path="/home/carreras" element={<ProtectedRoute rol="admin_notas"><Carreras /></ProtectedRoute>} />
        <Route path="/home/carreras/new" element={<ProtectedRoute rol="admin_notas"><FormCarrera /></ProtectedRoute>} />
        <Route path="/home/carreras/:id/editar" element={<ProtectedRoute rol="admin_notas"><FormCarrera /></ProtectedRoute>} />
        <Route path="/home/brigadas" element={<ProtectedRoute rol="admin_notas"><Brigadas /></ProtectedRoute>} />
        <Route path="/home/brigadas/new" element={<ProtectedRoute rol="admin_notas"><FormBrigadas /></ProtectedRoute>} />
        <Route path="/home/brigadas/:id/editar" element={<ProtectedRoute rol="admin_notas"><FormBrigadas /></ProtectedRoute>} />
        <Route path="/home/brigadas/:id/estudiantes" element={<ProtectedRoute rol="admin_notas"><AsignarEstudiante /></ProtectedRoute>} />
        <Route path="/home/estudiantes" element={<ProtectedRoute rol="admin_notas"><Estudiantes /></ProtectedRoute>} />
        <Route path="/home/estudiantes/new" element={<ProtectedRoute rol="admin_notas"><FormEstudiantes /></ProtectedRoute>} />
        <Route path="/home/estudiantes/:id/editar" element={<ProtectedRoute rol="admin_notas"><FormEstudiantes /></ProtectedRoute>} />
        <Route path="/home/estudiantes/notas/:idBrigada/:idEstudiante" element={<ProtectedRoute rol="admin_notas"><Notas /></ProtectedRoute>} />
        <Route path="/home/estudiantes/notas/:idBrigada/:idEstudiante/new" element={<ProtectedRoute rol="admin_notas"><FormNotas /></ProtectedRoute>} />
        <Route path="/home/estudiantes/notas/:idBrigada/:idEstudiante/:idNota/editar" element={<ProtectedRoute rol="admin_notas"><FormNotas /></ProtectedRoute>} />
        <Route path="/home/carreras/asignaturas/:id" element={<ProtectedRoute rol="admin_notas"><AsigCarrera /></ProtectedRoute>} />
        <Route path="/home/carreras/asignaturas/:id/new" element={<ProtectedRoute rol="admin_notas"><FormAsigCarrera /></ProtectedRoute>} />
        <Route path="/home/carreras/asignaturas/:id/:idAsig/editar" element={<ProtectedRoute rol="admin_notas"><FormAsigCarrera /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
