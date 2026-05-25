export default function UnauthorizedPage() {
  return (
    <div className="rounded-2xl bg-white p-8 shadow">
      <h1 className="text-2xl font-bold text-red-600">Acceso no autorizado</h1>
      <p className="mt-2 text-slate-600">
        No tienes permiso para ver esta sección.
      </p>
    </div>
  );
}