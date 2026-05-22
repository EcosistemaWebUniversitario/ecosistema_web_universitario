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
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/home/:id"
          element={
            <ProtectedRoute rol="estudiante">
              <HomeEst />
            </ProtectedRoute>
          }
        />
        <Route path="/administrador" element={<Administrador />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home/facultades" element={<Facultades />} />
        <Route path="/home/facultades/new" element={<FormFacultad />} />
        <Route path="/home/facultades/:id/editar" element={<FormFacultad />} />
        <Route path="/home/asignaturas" element={<Asignaturas />} />
        <Route path="/home/asignaturas/new" element={<FormAsignatura />} />
        <Route
          path="/home/asignaturas/:id/editar"
          element={<FormAsignatura />}
        />
        <Route path="/home/carreras" element={<Carreras />} />
        <Route path="/home/carreras/new" element={<FormCarrera />} />
        <Route path="/home/carreras/:id/editar" element={<FormCarrera />} />
        <Route path="/home/brigadas" element={<Brigadas />} />
        <Route path="/home/brigadas/new" element={<FormBrigadas />} />
        <Route path="/home/brigadas/:id/editar" element={<FormBrigadas />} />
        <Route path="/home/estudiantes" element={<Estudiantes />} />
        <Route path="/home/estudiantes/new" element={<FormEstudiantes />} />
        <Route
          path="/home/estudiantes/:id/editar"
          element={<FormEstudiantes />}
        />
        <Route
          path="/home/estudiantes/notas/:idBrigada/:idEstudiante"
          element={<Notas />}
        />
        <Route
          path="/home/estudiantes/notas/:idBrigada/:idEstudiante/new"
          element={<FormNotas />}
        />
        <Route
          path="/home/estudiantes/notas/:idBrigada/:idEstudiante/:idNota/editar"
          element={<FormNotas />}
        />
        <Route
          path="/home/carreras/asignaturas/:id"
          element={<AsigCarrera />}
        />
        <Route
          path="/home/carreras/asignaturas/:id/new"
          element={<FormAsigCarrera />}
        />
        <Route element={<ProtectedRoute rol="administrador" />}>
          <Route path="/administrador" element={<Administrador />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
