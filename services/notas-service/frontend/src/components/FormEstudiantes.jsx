import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";

const FormEstudiantes = () => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [carnet, setCarnet] = useState("");
  const [brigadas, setBrigadas] = useState([]);
  const [idBrigada, setIdBrigada] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingBrigadas, setLoadingBrigadas] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profileId, setProfileId] = useState(null);
  const [formTitle, setFormTitle] = useState("Nuevo Estudiante");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [brigadaSeleccionada, setBrigadaSeleccionada] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const fetchBrigadas = async () => {
      try {
        setLoadingBrigadas(true);
        const response = await api.get("/brigadas");
        setBrigadas(response.data);
        if (response.data.length === 0) {
          setErrors((prev) => ({ ...prev, brigada: "No hay brigadas disponibles. Crea una brigada primero." }));
        }
      } catch (error) {
        setErrors((prev) => ({ ...prev, brigada: "No se pudieron cargar las brigadas." }));
      } finally {
        setLoadingBrigadas(false);
      }
    };
    fetchBrigadas();
  }, []);

  const handleBrigadaChange = (brigadaId) => {
    setIdBrigada(brigadaId);
    const brigada = brigadas.find((b) => b.id_brigada == brigadaId);
    setBrigadaSeleccionada(brigada);
    if (errors.brigada) setErrors({ ...errors, brigada: "" });
  };

  useEffect(() => {
    if (contraseña.length === 0) { setStrength(0); return; }
    let score = 0;
    if (contraseña.length >= 8) score++;
    if (/[A-Z]/.test(contraseña)) score++;
    if (/[0-9]/.test(contraseña)) score++;
    if (/[^A-Za-z0-9]/.test(contraseña)) score++;
    setStrength(score);
  }, [contraseña]);

  const validateForm = () => {
    const newErrors = {};
    if (nombre.trim() === "") newErrors.nombre = "Ingresa el nombre del estudiante.";
    else if (nombre.length < 3) newErrors.nombre = "El nombre debe tener al menos 3 caracteres.";
    if (carnet.trim() === "") newErrors.carnet = "Ingresa el carnet del estudiante.";
    else if (!/^\d{11}$/.test(carnet)) newErrors.carnet = "El carnet debe tener 11 dígitos numéricos.";
    if (idBrigada === 0 || idBrigada === "0") newErrors.brigada = "Selecciona una brigada.";
    if (correo.trim() === "") newErrors.correo = "Ingresa el correo del estudiante.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) newErrors.correo = "Ingresa un correo válido.";
    if (!editing && contraseña.trim() === "") newErrors.contraseña = "Ingresa la contraseña del estudiante.";
    else if (contraseña.length > 0 && contraseña.length < 6) newErrors.contraseña = "La contraseña debe tener al menos 6 caracteres.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    if (!validateForm()) return;
    setLoading(true);
    try {
      const estudianteData = { correo, contraseña, id_brigada: idBrigada, nombre_estudiante: nombre, carnet };
      if (editing) {
        await api.put(`/estudiantes/${profileId || params.id}`, estudianteData);
        setSuccessMessage("✓ Estudiante actualizado exitosamente");
      } else {
        const existe = await api.get(`/estudiantes/correo/${correo}`);
        if (existe.data && existe.data.length > 0) {
          setErrors({ ...errors, correo: "Este correo ya está en uso." });
          setLoading(false);
          return;
        }
        await api.post("/estudiantes", estudianteData);
        setSuccessMessage("✓ Estudiante creado exitosamente");
      }
      setTimeout(() => navigate("/estudiantes"), 1500);
    } catch (err) {
      setErrors({ ...errors, submit: err.response?.data?.message || "Error al guardar." });
    } finally {
      setLoading(false);
    }
  };

  const fetchEstudiante = async (id) => {
    try {
      setLoading(true);
      const response = await api.get(`/estudiantes/${id}`);
      const data = response.data[0];
      setNombre(data.nombre_estudiante);
      setCorreo(data.correo);
      setContraseña("");
      setCarnet(data.carnet);
      setIdBrigada(data.id_brigada);
      const brigada = brigadas.find((b) => b.id_brigada == data.id_brigada);
      setBrigadaSeleccionada(brigada);
      setProfileId(data.profile_id || params.id);
      setEditing(true);
      setFormTitle("Editar Estudiante");
    } catch (error) {
      setErrors({ submit: "No se pudo cargar el estudiante." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (params.id) fetchEstudiante(params.id); }, [params.id, brigadas]);

  const getPasswordStrengthColor = () => ["#ef4444", "#f59e0b", "#fbbf24", "#10b981", "#059669"][strength] || "#6b7280";
  const getPasswordStrengthText = () => ["Muy débil", "Débil", "Aceptable", "Buena", "Excelente"][strength] || "No evaluada";

  return (
    <Layout
      title={formTitle}
      subtitle={
        editing
          ? "Modifica los datos del estudiante"
          : "Completa el formulario para crear un nuevo estudiante"
      }
      backTo="/estudiantes"
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre Completo <span className="text-red-500">*</span></label>
              <input type="text" placeholder="Ej: Juan Pérez González" value={nombre}
                onChange={(e) => { setNombre(e.target.value); if (errors.nombre) setErrors({ ...errors, nombre: "" }); }}
                disabled={loading} maxLength={100}
                className="w-full rounded-xl border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
              <p className="text-xs text-slate-400 mt-1">{nombre.length}/100 caracteres</p>
              {errors.nombre && <div className="mt-2 rounded-lg bg-red-50 p-3 text-sm text-red-800"><i className="fas fa-exclamation-triangle mr-1"></i> {errors.nombre}</div>}
            </div>

            {/* Carnet y Brigada */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Carnet <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Ej: 20201012345 (11 dígitos)" value={carnet}
                  onChange={(e) => { const v = e.target.value.replace(/\D/g, ''); setCarnet(v); if (errors.carnet) setErrors({ ...errors, carnet: "" }); }}
                  disabled={loading} maxLength={11}
                  className="w-full rounded-xl border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                {carnet.length > 0 && <p className={`text-xs mt-1 ${carnet.length !== 11 ? "text-amber-600" : "text-emerald-600"}`}>{carnet.length}/11 dígitos</p>}
                {errors.carnet && <p className="mt-1 text-xs text-red-600">{errors.carnet}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Brigada <span className="text-red-500">*</span></label>
                {loadingBrigadas ? (
                  <p className="text-sm text-slate-400 py-2"><i className="fas fa-spinner fa-pulse mr-1"></i> Cargando brigadas...</p>
                ) : (
                  <select value={idBrigada} onChange={(e) => handleBrigadaChange(e.target.value)}
                    disabled={loading || brigadas.length === 0}
                    className="w-full rounded-xl border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
                    <option value="0">Selecciona una brigada</option>
                    {brigadas.map((b) => <option key={b.id_brigada} value={b.id_brigada}>{b.nombre_brigada}</option>)}
                  </select>
                )}
                {errors.brigada && <p className="mt-1 text-xs text-red-600">{errors.brigada}</p>}
              </div>
            </div>

            {/* Correo */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Correo Electrónico <span className="text-red-500">*</span></label>
              <input type="email" placeholder="Ej: estudiante@universidad.edu" value={correo}
                onChange={(e) => { setCorreo(e.target.value); if (errors.correo) setErrors({ ...errors, correo: "" }); }}
                disabled={loading}
                className="w-full rounded-xl border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
              {errors.correo && <p className="mt-1 text-xs text-red-600">{errors.correo}</p>}
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Contraseña {!editing && <span className="text-red-500">*</span>}</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} placeholder={editing ? "Dejar vacío para mantener la actual" : "Mínimo 6 caracteres"} value={contraseña}
                  onChange={(e) => { setContraseña(e.target.value); if (errors.contraseña) setErrors({ ...errors, contraseña: "" }); }}
                  disabled={loading}
                  className="w-full rounded-xl border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
              {contraseña.length > 0 && (
                <div className="mt-2">
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${strength * 25}%`, backgroundColor: getPasswordStrengthColor() }}></div>
                  </div>
                  <p className="text-xs mt-1" style={{ color: getPasswordStrengthColor() }}>Fortaleza: {getPasswordStrengthText()}</p>
                </div>
              )}
              {errors.contraseña && <p className="mt-1 text-xs text-red-600">{errors.contraseña}</p>}
              {editing && contraseña.length === 0 && (
                <p className="text-xs text-slate-400 mt-1"><i className="fas fa-info-circle mr-1"></i> Deja este campo vacío si no deseas cambiar la contraseña.</p>
              )}
            </div>

            {/* Previsualización */}
            {nombre.length >= 3 && idBrigada != 0 && (
              <div className="rounded-xl bg-slate-50 p-4">
                <h4 className="font-semibold text-slate-800 mb-2">👁️ Previsualización:</h4>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-lg">{nombre.charAt(0).toUpperCase()}</div>
                  <div>
                    <h5 className="font-semibold text-slate-800">{nombre}</h5>
                    <p className="text-xs text-slate-500">Carnet: {carnet || "Sin carnet"} · Correo: {correo || "Sin correo"} · {brigadaSeleccionada?.nombre_brigada || "Sin brigada"}</p>
                  </div>
                </div>
              </div>
            )}

            {successMessage && <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800"><i className="fas fa-check-circle mr-1"></i> {successMessage}</div>}
            {errors.submit && <div className="rounded-xl bg-red-50 p-4 text-sm text-red-800"><i className="fas fa-exclamation-triangle mr-1"></i> {errors.submit}</div>}

            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={() => navigate("/estudiantes")} disabled={loading}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition">Cancelar</button>
              <button type="submit"
                disabled={loading || nombre.trim() === "" || idBrigada == 0 || (!editing && contraseña.trim() === "") || carnet.trim() === "" || correo.trim() === ""}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition disabled:opacity-50">
                {loading ? <span><i className="fas fa-spinner fa-pulse mr-1"></i> {editing ? "Guardando..." : "Creando..."}</span>
                  : <span><i className={`fas ${editing ? "fa-save" : "fa-plus"} mr-1`}></i> {editing ? "Guardar Cambios" : "Crear Estudiante"}</span>}
              </button>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800 mt-4">
              <p><i className="fas fa-info-circle mr-1"></i> <strong>Consejo:</strong> Usa un correo institucional si es posible. La contraseña se almacena de forma segura.</p>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default FormEstudiantes;