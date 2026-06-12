import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";

const FormAsignatura = () => {
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formTitle, setFormTitle] = useState("Nueva Asignatura");
  const [characterCount, setCharacterCount] = useState(0);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    setCharacterCount(nombre.length);
  }, [nombre]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (nombre.trim() === "") {
      setError("Por favor, ingresa el nombre de la asignatura.");
      return;
    }

    if (nombre.length < 3) {
      setError("El nombre debe tener al menos 3 caracteres.");
      return;
    }

    if (nombre.length > 100) {
      setError("El nombre no puede exceder los 100 caracteres.");
      return;
    }

    setLoading(true);

    try {
      if (editing) {
        await api.put(`/asignaturas/${params.id}`, { nombre });
      } else {
        const existe = await api.get(`/asignaturas/nombre/${nombre}`);
        if (existe.data && existe.data.length > 0) {
          setError("Esta asignatura ya existe en el sistema.");
          setLoading(false);
          return;
        }
        await api.post("/asignaturas", { nombre });
      }
      navigate("/asignaturas");
    } catch (err) {
      console.error("Error al guardar la asignatura:", err);
      setError(
        err.response?.data?.message ||
          "Error al guardar la asignatura. Intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchAsignatura = async (id) => {
    try {
      setLoading(true);
      const response = await api.get(`/asignaturas/${id}`);
      const data = response.data;
      if (data && data.length > 0) {
        setNombre(data[0].nombre_asignatura);
      }
      setEditing(true);
      setFormTitle("Editar Asignatura");
    } catch (error) {
      console.error("Error al cargar la asignatura:", error);
      setError("No se pudo cargar la asignatura. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchAsignatura(params.id);
    }
  }, [params.id]);

  return (
    <Layout
      title={formTitle}
      subtitle={
        editing
          ? "Modifica los datos de la asignatura existente"
          : "Completa el formulario para agregar una nueva asignatura"
      }
      backTo="/asignaturas"
    >
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="nombre"
                className="block text-sm font-semibold text-slate-700 mb-1"
              >
                Nombre de la Asignatura <span className="text-red-500">*</span>
              </label>
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  setError("");
                }}
                placeholder="Ej: Matemáticas, Historia, Programación..."
                disabled={loading}
                maxLength={100}
                autoFocus
                className="w-full rounded-xl border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              <div className="flex justify-between mt-1">
                <span
                  className={`text-xs ${
                    characterCount > 90
                      ? "text-amber-600"
                      : characterCount === 100
                      ? "text-red-600"
                      : "text-slate-400"
                  }`}
                >
                  {characterCount}/100 caracteres
                </span>
              </div>

              {error && (
                <div className="mt-2 rounded-lg bg-red-50 p-3 text-sm text-red-800">
                  <i className="fas fa-exclamation-triangle mr-1"></i> {error}
                </div>
              )}

              <div className="mt-4 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
                <p className="font-semibold mb-2">📝 Formato recomendado:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Usa nombres descriptivos y específicos</li>
                  <li>Incluye el área de conocimiento cuando sea necesario</li>
                  <li>Evita abreviaturas poco comunes</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/asignaturas")}
                disabled={loading}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || nombre.trim() === "" || nombre.length < 3}
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
                    {editing ? "Guardar Cambios" : "Crear Asignatura"}
                  </span>
                )}
              </button>
            </div>

            {nombre.trim().length >= 3 && !error && (
              <div className="rounded-xl bg-slate-50 p-4">
                <h4 className="font-semibold text-slate-800 mb-2">👁️ Previsualización:</h4>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 font-bold text-lg">
                    📚
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-800">{nombre}</h5>
                    <p className="text-xs text-slate-500">Asignatura {editing ? "editada" : "nueva"}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800 mt-4">
              <p><i className="fas fa-info-circle mr-1"></i> <strong>Consejo:</strong> Las asignaturas se pueden asociar a múltiples carreras.</p>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default FormAsignatura;