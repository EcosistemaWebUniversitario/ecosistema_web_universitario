import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "./Layout";

const AsignarEstudiante = () => {
  const [todos, setTodos] = useState([]);
  const [enBrigada, setEnBrigada] = useState([]);
  const [brigada, setBrigada] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const cargar = async () => {
    try {
      const [brigRes, todosRes, enRes] = await Promise.all([
        api.get(`/auth/brigadas/${id}`),
        api.get("/auth/estudiantes"),
        api.get(`/auth/estudiantes/brigada/${id}`)
      ]);
      setBrigada(brigRes.data[0]);
      setTodos(todosRes.data);
      setEnBrigada((enRes.data || []).map(e => e.id_estudiante));
    } catch (e) {
      console.error("Error al cargar:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, [id]);

  const asignar = async (idEst) => {
    setProcesando(idEst);
    try {
      await api.post(`/auth/estudiantes/${idEst}/brigada`, { id_brigada: parseInt(id) });
      setEnBrigada(prev => [...prev, idEst]);
      setMensaje("✓ Estudiante asignado a la brigada");
      setTimeout(() => setMensaje(""), 3000);
    } catch (e) {
      setMensaje("Error al asignar estudiante");
    } finally {
      setProcesando(null);
    }
  };

  const quitar = async (idEst) => {
    setProcesando(idEst);
    try {
      await api.post(`/auth/estudiantes/${idEst}/brigada`, { id_brigada: null });
      setEnBrigada(prev => prev.filter(i => i !== idEst));
      setMensaje("✓ Estudiante quitado de la brigada");
      setTimeout(() => setMensaje(""), 3000);
    } catch (e) {
      setMensaje("Error al quitar estudiante");
    } finally {
      setProcesando(null);
    }
  };

  const filtrados = todos.filter(e =>
    e.nombre_estudiante.toLowerCase().includes(busqueda.toLowerCase()) ||
    (e.carnet && e.carnet.includes(busqueda))
  );

  const enBrigadaList = filtrados.filter(e => enBrigada.includes(e.id_estudiante));
  const disponibles = filtrados.filter(e => !enBrigada.includes(e.id_estudiante));

  if (loading) return <><Layout /><div style={{ padding: 40, textAlign: "center" }}>Cargando...</div></>;

  return (
    <>
      <Layout />
      <div style={{ maxWidth: 700, margin: "40px auto", padding: "0 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <button onClick={() => navigate("/home/estudiantes")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20 }}>←</button>
          <div>
            <h2 style={{ margin: 0 }}>Gestionar estudiantes — {brigada?.nombre_brigada}</h2>
            <p style={{ margin: "4px 0 0", color: "#666", fontSize: 14 }}>
              {enBrigada.length} estudiante{enBrigada.length !== 1 ? "s" : ""} asignado{enBrigada.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {mensaje && (
          <div style={{ background: mensaje.startsWith("Error") ? "#fee2e2" : "#d1fae5", border: `1px solid ${mensaje.startsWith("Error") ? "#fca5a5" : "#6ee7b7"}`, borderRadius: 8, padding: "10px 16px", marginBottom: 16, color: mensaje.startsWith("Error") ? "#991b1b" : "#065f46" }}>
            {mensaje}
          </div>
        )}

        <input
          type="text"
          placeholder="Buscar por nombre o carnet..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #ddd", marginBottom: 20, fontSize: 14, boxSizing: "border-box" }}
        />

        {enBrigadaList.length > 0 && (
          <>
            <h4 style={{ color: "#065f46", margin: "0 0 10px" }}>✓ En esta brigada</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
              {enBrigadaList.map(est => (
                <div key={est.id_estudiante} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderRadius: 8, border: "1px solid #6ee7b7", background: "#f0fdf4" }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{est.nombre_estudiante}</div>
                    {est.carnet && <div style={{ fontSize: 12, color: "#666" }}>Carnet: {est.carnet}</div>}
                  </div>
                  <button
                    onClick={() => quitar(est.id_estudiante)}
                    disabled={procesando === est.id_estudiante}
                    style={{ background: "#fee2e2", color: "#991b1b", border: "none", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontSize: 13 }}
                  >
                    {procesando === est.id_estudiante ? "..." : "Quitar"}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {disponibles.length > 0 && (
          <>
            <h4 style={{ color: "#374151", margin: "0 0 10px" }}>Disponibles</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {disponibles.map(est => (
                <div key={est.id_estudiante} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff" }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{est.nombre_estudiante}</div>
                    {est.carnet && <div style={{ fontSize: 12, color: "#666" }}>Carnet: {est.carnet}</div>}
                  </div>
                  <button
                    onClick={() => asignar(est.id_estudiante)}
                    disabled={procesando === est.id_estudiante}
                    style={{ background: "#dbeafe", color: "#1e40af", border: "none", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontSize: 13 }}
                  >
                    {procesando === est.id_estudiante ? "..." : "Asignar"}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {filtrados.length === 0 && (
          <p style={{ color: "#999", textAlign: "center", padding: 40 }}>No se encontraron estudiantes</p>
        )}

        <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
          <button onClick={() => navigate("/home/estudiantes/new")} style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontSize: 14 }}>
            + Crear nuevo estudiante
          </button>
          <button onClick={() => navigate("/home/estudiantes")} style={{ background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontSize: 14 }}>
            Volver
          </button>
        </div>
      </div>
    </>
  );
};

export default AsignarEstudiante;
