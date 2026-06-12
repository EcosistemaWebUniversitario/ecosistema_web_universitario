import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";

const FormCarrera = () => {
  const [nombreCarrera, setNombreCarrera] = useState("");
  const [años, setAños] = useState(0);
  const [facultades, setFacultades] = useState([]);
  const [idFacultad, setIdFacultad] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingFacultades, setLoadingFacultades] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formTitle, setFormTitle] = useState("Nueva Carrera");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const fetchFacultades = async () => {
      try {
        setLoadingFacultades(true);
        const response = await api.get("/facultades");
        setFacultades(response.data);
        if (response.data.length === 0) {
          setErrors((prev) => ({
            ...prev,
            facultad: "No hay facultades disponibles. Crea una facultad primero.",
          }));
        }
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          facultad: "No se pudieron cargar las facultades.",
        }));
      } finally {
        setLoadingFacultades(false);
      }
    };
    fetchFacultades();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (nombreCarrera.trim() === "") newErrors.nombreCarrera = "Por favor, ingresa el nombre de la carrera.";
    else if (nombreCarrera.length < 3) newErrors.nombreCarrera = "El nombre debe tener al menos 3 caracteres.";
    if (años <= 0 || años > 5 || isNaN(años)) newErrors.años = "Ingresa una duración válida (1-5 años).";
    if (idFacultad === 0 || idFacultad === "0") newErrors.facultad = "Selecciona una facultad.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    if (!validateForm()) return;
    setLoading(true);
    try {
      const carreraData = {
        id_facultad: idFacultad,
        nombre_carrera: nombreCarrera,
        años: parseInt(años),
      };
      if (editing) {
        await api.put(`/carreras/${params.id}`, carreraData);
        setSuccessMessage("✓ Carrera actualizada exitosamente");
      } else {
        const existe = await api.get(`/carreras/nombre/${nombreCarrera}`);
        if (existe.data && existe.data.length > 0) {
          setErrors({ ...errors, nombreCarrera: "Esta carrera ya existe." });
          setLoading(false);
          return;
        }
        await api.post("/carreras", carreraData);
        setSuccessMessage("✓ Carrera creada exitosamente");
      }
      setTimeout(() => navigate("/carreras"), 1500);
    } catch (err) {
      setErrors({ ...errors, submit: err.response?.data?.message || "Error al guardar." });
    } finally {
      setLoading(false);
    }
  };

  const fetchCarrera = async (id) => {
    try {
      setLoading(true);
      const response = await api.get(`/carreras/${id}`);
      const data = response.data[0];
      setNombreCarrera(data.nombre_carrera);
      setIdFacultad(data.id_facultad);
      setAños(data.años);
      setEditing(true);
      setFormTitle("Editar Carrera");
    } catch (error) {
      setErrors({ submit: "No se pudo cargar la carrera." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) fetchCarrera(params.id);
  }, [params.id]);

  const getFacultadNombre = () => {
    const facultad = facultades.find((f) => f.id_facultad == idFacultad);
    return facultad ? facultad.nombre_facultad : "No seleccionada";
  };

  return (
    <Layout
      title={formTitle}
      subtitle={
        editing
          ? "Modifica los datos de la carrera"
          : "Completa el formulario para crear una nueva carrera"
      }
      backTo="/carreras"
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre de la Carrera <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="Ej: Ingeniería en Sistemas, Medicina..."
                value={nombreCarrera}
                onChange={(e) => { setNombreCarrera(e.target.value); if (errors.nombreCarrera) setErrors({ ...errors, nombreCarrera: "" }); }}
                disabled={loading}
                maxLength={100}
                className="w-full rounded-xl border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              <p className="text-xs text-slate-400 mt-1">{nombreCarrera.length}/100 caracteres</p>
              {errors.nombreCarrera && <div className="mt-2 rounded-lg bg-red-50 p-3 text-sm text-red-800"><i className="fas fa-exclamation-triangle mr-1"></i> {errors.nombreCarrera}</div>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Duración (años) <span className="text-red-500">*</span></label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => { setAños(year); if (errors.años) setErrors({ ...errors, años: "" }); }}
                      disabled={loading}
                      className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                        años == year
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {year} {year === 1 ? "año" : "años"}
                    </button>
                  ))}
                </div>
                {errors.años && <p className="mt-1 text-xs text-red-600">{errors.años}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Facultad <span className="text-red-500">*</span></label>
                {loadingFacultades ? (
                  <p className="text-sm text-slate-400 py-2"><i className="fas fa-spinner fa-pulse mr-1"></i> Cargando facultades...</p>
                ) : (
                  <select
                    value={idFacultad}
                    onChange={(e) => { setIdFacultad(e.target.value); if (errors.facultad) setErrors({ ...errors, facultad: "" }); }}
                    disabled={loading || facultades.length === 0}
                    className="w-full rounded-xl border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="0">Selecciona una facultad</option>
                    {facultades.map((facultad) => (
                      <option key={facultad.id_facultad} value={facultad.id_facultad}>{facultad.nombre_facultad}</option>
                    ))}
                  </select>
                )}
                {errors.facultad && <p className="mt-1 text-xs text-red-600">{errors.facultad}</p>}
              </div>
            </div>

            {nombreCarrera.length >= 3 && idFacultad != 0 && años > 0 && (
              <div className="rounded-xl bg-slate-50 p-4">
                <h4 className="font-semibold text-slate-800 mb-2">👁️ Previsualización:</h4>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 font-bold text-lg">🎓</div>
                  <div>
                    <h5 className="font-semibold text-slate-800">{nombreCarrera}</h5>
                    <p className="text-xs text-slate-500">{getFacultadNombre()} · {años} {años === 1 ? "año" : "años"}</p>
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
              <button type="button" onClick={() => navigate("/carreras")} disabled={loading}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition">
                Cancelar
              </button>
              <button type="submit"
                disabled={loading || nombreCarrera.trim() === "" || idFacultad == 0 || años === 0}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition disabled:opacity-50">
                {loading ? (
                  <span><i className="fas fa-spinner fa-pulse mr-1"></i> {editing ? "Guardando..." : "Creando..."}</span>
                ) : (
                  <span><i className={`fas ${editing ? "fa-save" : "fa-plus"} mr-1`}></i> {editing ? "Guardar Cambios" : "Crear Carrera"}</span>
                )}
              </button>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800 mt-4">
              <p><i className="fas fa-info-circle mr-1"></i> <strong>Consejo:</strong> Usa nombres completos y descriptivos para las carreras.</p>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default FormCarrera;