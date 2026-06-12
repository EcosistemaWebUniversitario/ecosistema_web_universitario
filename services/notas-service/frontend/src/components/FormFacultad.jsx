import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";

const FormFacultad = () => {
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formTitle, setFormTitle] = useState("Nueva Facultad");
  const navigate = useNavigate();
  const params = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (nombre.trim() === "") {
      setError("Por favor, ingresa el nombre de la facultad.");
      return;
    }

    if (nombre.length < 3) {
      setError("El nombre debe tener al menos 3 caracteres.");
      return;
    }

    setLoading(true);

    try {
      if (editing) {
        await api.put(`/facultades/${params.id}`, { nombre });
      } else {
        const existe = await api.get(`/facultades/nombre/${nombre}`);
        if (existe.data && existe.data.length > 0) {
          setError("Esta facultad ya existe en el sistema.");
          setLoading(false);
          return;
        }
        await api.post("/facultades", { nombre });
      }

      navigate("/facultades");
    } catch (err) {
      console.error("Error al guardar la facultad", err);
      setError(
        err.response?.data?.message ||
          "Error al guardar la facultad. Intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchFacultad = async (id) => {
    try {
      setLoading(true);
      const response = await api.get(`/facultades/${id}`);
      const data = response.data;
      if (data && data.length > 0) {
        setNombre(data[0].nombre_facultad);
      }
      setEditing(true);
      setFormTitle("Editar Facultad");
    } catch (error) {
      console.error("Error al cargar la facultad:", error);
      setError("No se pudo cargar la facultad. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchFacultad(params.id);
    }
  }, [params.id]);

  return (
    <Layout
      title={formTitle}
      subtitle={
        editing
          ? "Modifica los datos de la facultad"
          : "Completa el formulario para agregar una nueva facultad"
      }
      backTo="/facultades"
    >
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="nombre"
                className="block text-sm font-semibold text-slate-700 mb-1"
              >
                Nombre de la Facultad <span className="text-red-500">*</span>
              </label>
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  setError("");
                }}
                placeholder="Ej: Facultad de Ingeniería"
                disabled={loading}
                maxLength={100}
                className="w-full rounded-xl border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              <p className="text-xs text-slate-400 mt-1">
                Máximo 100 caracteres • {nombre.length}/100
              </p>
              {error && (
                <div className="mt-2 rounded-lg bg-red-50 p-3 text-sm text-red-800">
                  <i className="fas fa-exclamation-triangle mr-1"></i> {error}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/facultades")}
                disabled={loading}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || nombre.trim() === ""}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition disabled:opacity-50"
              >
                {loading ? (
                  <span>
                    <i className="fas fa-spinner fa-pulse mr-1"></i>
                    {editing ? "Guardando..." : "Creando..."}
                  </span>
                ) : (
                  <span>
                    <i className={`fas ${editing ? "fa-save" : "fa-plus"} mr-1`}></i>
                    {editing ? "Guardar Cambios" : "Crear Facultad"}
                  </span>
                )}
              </button>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800 mt-4">
              <p><i className="fas fa-info-circle mr-1"></i> <strong>Consejo:</strong> Usa nombres descriptivos como "Facultad de Ingeniería".</p>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default FormFacultad;