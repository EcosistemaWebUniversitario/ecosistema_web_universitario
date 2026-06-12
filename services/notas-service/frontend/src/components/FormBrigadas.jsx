import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";

const FormBrigadas = () => {
  const [nombre, setNombre] = useState("");
  const [año, setAño] = useState(new Date().getFullYear());
  const [añoFinal, setAñoFinal] = useState(new Date().getFullYear() + 4);
  const [carreras, setCarreras] = useState([]);
  const [idCarrera, setIdCarrera] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingCarreras, setLoadingCarreras] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formTitle, setFormTitle] = useState("Nueva Brigada");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [carreraSeleccionada, setCarreraSeleccionada] = useState(null);
  const navigate = useNavigate();
  const params = useParams();

  const currentYear = new Date().getFullYear();
  const añosDisponibles = Array.from({ length: 20 }, (_, i) => currentYear - 5 + i);

  useEffect(() => {
    const fetchCarreras = async () => {
      try {
        setLoadingCarreras(true);
        const response = await api.get("/carreras");
        setCarreras(response.data);
        if (response.data.length === 0) {
          setErrors((prev) => ({
            ...prev,
            carrera: "No hay carreras disponibles. Crea una carrera primero.",
          }));
        }
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          carrera: "No se pudieron cargar las carreras.",
        }));
      } finally {
        setLoadingCarreras(false);
      }
    };
    fetchCarreras();
  }, []);

  useEffect(() => {
    if (carreraSeleccionada && carreraSeleccionada.años) {
      setAñoFinal(parseInt(año) + parseInt(carreraSeleccionada.años) - 1);
    }
  }, [carreraSeleccionada, año]);

  const handleCarreraChange = (carreraId) => {
    setIdCarrera(carreraId);
    const carrera = carreras.find((c) => c.id_carrera == carreraId);
    setCarreraSeleccionada(carrera);
    if (errors.carrera) {
      setErrors({ ...errors, carrera: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (nombre.trim() === "") newErrors.nombre = "Por favor, ingresa el nombre de la brigada.";
    else if (nombre.length < 3) newErrors.nombre = "El nombre debe tener al menos 3 caracteres.";
    if (!año || año < 2000 || año > 2100) newErrors.año = "Ingresa un año válido (2000-2100).";
    if (idCarrera === 0 || idCarrera === "0") newErrors.carrera = "Selecciona una carrera.";
    if (añoFinal && añoFinal <= año) newErrors.año = "El año final debe ser mayor al año inicial.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    if (!validateForm()) return;
    setLoading(true);
    try {
      const brigadaData = {
        id_carrera: idCarrera,
        nombre_brigada: nombre,
        año_brigada: parseInt(año),
        añoFinal_brigada: parseInt(añoFinal),
      };
      if (editing) {
        await api.put(`/brigadas/${params.id}`, brigadaData);
        setSuccessMessage("✓ Brigada actualizada exitosamente");
      } else {
        const existe = await api.get(`/brigadas/nombre/${nombre}`);
        if (existe.data && existe.data.length > 0) {
          setErrors({ ...errors, nombre: "Esta brigada ya existe." });
          setLoading(false);
          return;
        }
        await api.post("/brigadas", brigadaData);
        setSuccessMessage("✓ Brigada creada exitosamente");
      }
      setTimeout(() => navigate("/brigadas"), 1500);
    } catch (err) {
      setErrors({ ...errors, submit: err.response?.data?.message || "Error al guardar." });
    } finally {
      setLoading(false);
    }
  };

  const fetchBrigada = async (id) => {
    try {
      setLoading(true);
      const response = await api.get(`/brigadas/${id}`);
      const data = response.data[0];
      setNombre(data.nombre_brigada);
      setIdCarrera(data.id_carrera);
      setAño(data.año_brigada);
      setAñoFinal(data.añoFinal_brigada);
      const carrera = carreras.find((c) => c.id_carrera == data.id_carrera);
      setCarreraSeleccionada(carrera);
      setEditing(true);
      setFormTitle("Editar Brigada");
    } catch (error) {
      setErrors({ submit: "No se pudo cargar la brigada." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) fetchBrigada(params.id);
  }, [params.id, carreras]);

  const getDuracion = () => (carreraSeleccionada && año && añoFinal ? añoFinal - año + 1 : 0);
  const getEstadoBrigada = () => {
    const cy = new Date().getFullYear();
    if (cy < año) return { texto: "Próxima", color: "text-amber-600 bg-amber-100" };
    if (cy > añoFinal) return { texto: "Finalizada", color: "text-emerald-600 bg-emerald-100" };
    return { texto: "Activa", color: "text-blue-600 bg-blue-100" };
  };

  return (
    <Layout
      title={formTitle}
      subtitle={
        editing
          ? "Modifica los datos de la brigada"
          : "Completa el formulario para crear una nueva brigada"
      }
      backTo="/brigadas"
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre de la Brigada <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="Ej: Brigada 2024-1, Grupo A"
                value={nombre}
                onChange={(e) => { setNombre(e.target.value); if (errors.nombre) setErrors({ ...errors, nombre: "" }); }}
                disabled={loading}
                maxLength={100}
                className="w-full rounded-xl border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              <p className="text-xs text-slate-400 mt-1">{nombre.length}/100 caracteres</p>
              {errors.nombre && <div className="mt-2 rounded-lg bg-red-50 p-3 text-sm text-red-800"><i className="fas fa-exclamation-triangle mr-1"></i> {errors.nombre}</div>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Año de Inicio <span className="text-red-500">*</span></label>
                <select
                  value={año}
                  onChange={(e) => { setAño(e.target.value); if (errors.año) setErrors({ ...errors, año: "" }); }}
                  disabled={loading}
                  className="w-full rounded-xl border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="">Selecciona un año</option>
                  {añosDisponibles.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                {errors.año && <p className="mt-1 text-xs text-red-600">{errors.año}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Carrera <span className="text-red-500">*</span></label>
                {loadingCarreras ? (
                  <p className="text-sm text-slate-400 py-2"><i className="fas fa-spinner fa-pulse mr-1"></i> Cargando carreras...</p>
                ) : (
                  <select
                    value={idCarrera}
                    onChange={(e) => handleCarreraChange(e.target.value)}
                    disabled={loading || carreras.length === 0}
                    className="w-full rounded-xl border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="0">Selecciona una carrera</option>
                    {carreras.map((c) => (
                      <option key={c.id_carrera} value={c.id_carrera}>{c.nombre_carrera} ({c.años} años)</option>
                    ))}
                  </select>
                )}
                {errors.carrera && <p className="mt-1 text-xs text-red-600">{errors.carrera}</p>}
              </div>
            </div>

            {carreraSeleccionada && año && (
              <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
                <p className="font-semibold mb-2">📅 Información Calculada</p>
                <div className="grid grid-cols-2 gap-2">
                  <p><strong>Año de Finalización:</strong> {añoFinal}</p>
                  <p><strong>Duración Total:</strong> {getDuracion()} {getDuracion() === 1 ? "año" : "años"}</p>
                  <p>
                    <strong>Estado Estimado:</strong>{" "}
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${getEstadoBrigada().color}`}>
                      {getEstadoBrigada().texto}
                    </span>
                  </p>
                </div>
              </div>
            )}

            {nombre.length >= 3 && idCarrera != 0 && año && (
              <div className="rounded-xl bg-slate-50 p-4">
                <h4 className="font-semibold text-slate-800 mb-2">👁️ Previsualización:</h4>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 font-bold text-lg">👥</div>
                  <div>
                    <h5 className="font-semibold text-slate-800">{nombre}</h5>
                    <p className="text-xs text-slate-500">
                      {carreraSeleccionada?.nombre_carrera} · {año} – {añoFinal} · {getEstadoBrigada().texto}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {successMessage && (
              <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
                <i className="fas fa-check-circle mr-1"></i> {successMessage}
              </div>
            )}

            {errors.submit && (
              <div className="rounded-xl bg-red-50 p-4 text-sm text-red-800">
                <i className="fas fa-exclamation-triangle mr-1"></i> {errors.submit}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={() => navigate("/brigadas")} disabled={loading}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition">
                Cancelar
              </button>
              <button type="submit"
                disabled={loading || nombre.trim() === "" || idCarrera == 0 || !año}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition disabled:opacity-50">
                {loading ? (
                  <span><i className="fas fa-spinner fa-pulse mr-1"></i> {editing ? "Guardando..." : "Creando..."}</span>
                ) : (
                  <span><i className={`fas ${editing ? "fa-save" : "fa-plus"} mr-1`}></i> {editing ? "Guardar Cambios" : "Crear Brigada"}</span>
                )}
              </button>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800 mt-4">
              <p><i className="fas fa-info-circle mr-1"></i> <strong>Consejo:</strong> Usa un formato consistente para los nombres de brigadas.</p>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default FormBrigadas;