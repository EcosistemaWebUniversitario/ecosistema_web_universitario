import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Layout from "../components/Layout";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/auth';
    }
  }, []);

  const modules = [
    { to: "/facultades", icon: "fas fa-university", title: "Facultades", desc: "Gestiona las facultades" },
    { to: "/asignaturas", icon: "fas fa-book", title: "Asignaturas", desc: "Administra las asignaturas" },
    { to: "/carreras", icon: "fas fa-graduation-cap", title: "Carreras", desc: "Gestiona las carreras" },
    { to: "/brigadas", icon: "fas fa-users", title: "Brigadas", desc: "Administra las brigadas" },
    { to: "/estudiantes", icon: "fas fa-user-graduate", title: "Estudiantes", desc: "Gestiona los estudiantes" },
  ];

  return (
    <Layout title="Gestión de Notas" subtitle="Panel de Administración">
      <h2 className="text-2xl font-black text-slate-900 mb-6">Panel de Administración</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod) => (
          <Link
            key={mod.to}
            to={mod.to}
            className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-6 hover:shadow-md hover:-translate-y-1 transition duration-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <i className={mod.icon}></i>
              </div>
              <h3 className="text-lg font-bold text-slate-800">{mod.title}</h3>
            </div>
            <p className="text-sm text-slate-600">{mod.desc}</p>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default Home;