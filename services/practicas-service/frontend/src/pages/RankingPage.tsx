import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { api } from '../api/client';

type Student = {
  id: number;
  firstName: string;
  lastName: string;
  career?: { name: string };
};

type RankingItem = {
  id: number;
  position: number;
  student: Student;
};

type RankingData = {
  call: {
    id: number;
    academicYear: number;
    status: string;
    career: { id: number; name: string };
    creator: { id: number; full_name: string };
  };
  students: Student[];
  ranking: RankingItem[];
};

export default function RankingPage() {
  const queryClient = useQueryClient();
  const params = useParams();
  const callId = Number(params.callId);

  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [position, setPosition] = useState<number>(1);
  const [message, setMessage] = useState('');

  const rankingQuery = useQuery<RankingData>({
    queryKey: ['ranking', callId],
    queryFn: async () => {
      const res = await api.get(`/prelocalization/calls/${callId}/ranking`);
      return res.data.data;
    },
    enabled: !!callId,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      await api.post(`/prelocalization/calls/${callId}/ranking`, {
        studentId: selectedStudent,
        position,
      });
    },
    onSuccess: async () => {
      setMessage('Estudiante agregado al ranking.');
      await queryClient.invalidateQueries({ queryKey: ['ranking', callId] });
    },
    onError: () => {
      setMessage('Error al agregar al ranking.');
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/prelocalization/calls/${callId}/ranking/${id}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['ranking', callId] });
    },
  });

  const data = rankingQuery.data;
  const students = useMemo(() => data?.students ?? [], [data]);
  const ranking = useMemo(() => data?.ranking ?? [], [data]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    setMessage('');
    await createMutation.mutateAsync();
  };

  if (!callId || Number.isNaN(callId)) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm text-slate-600">
          No se recibió una convocatoria válida.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-8 shadow">
        <h1 className="text-2xl font-bold">Ranking</h1>
        <p className="mt-2 text-sm text-gray-600">
          Gestión del orden de estudiantes para asignación.
        </p>
      </section>

      <section className="rounded-xl bg-white p-6 shadow">
        <p className="text-sm text-slate-600">
          Convocatoria seleccionada: <strong>#{callId}</strong>
        </p>
      </section>

      {rankingQuery.isLoading ? (
        <p>Cargando...</p>
      ) : (
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Columna izquierda: estudiantes disponibles */}
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-4 font-bold">Estudiantes disponibles</h2>

            <form onSubmit={handleAdd} className="mb-4 space-y-3">
              <select
                className="w-full rounded border px-3 py-2"
                value={selectedStudent ?? ''}
                onChange={(e) => setSelectedStudent(Number(e.target.value))}
              >
                <option value="">Seleccionar estudiante</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.firstName} {s.lastName}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min={1}
                placeholder="Posición"
                className="w-full rounded border px-3 py-2"
                value={position}
                onChange={(e) => setPosition(Number(e.target.value))}
              />

              <button
                type="submit"
                className="w-full rounded bg-emerald-600 py-2 text-white"
              >
                Agregar al ranking
              </button>

              {message && <p className="text-sm">{message}</p>}
            </form>

            <div className="space-y-2">
              {students.length ? (
                students.map((s) => (
                  <div key={s.id} className="text-sm text-gray-600">
                    {s.firstName} {s.lastName}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  No hay estudiantes disponibles.
                </p>
              )}
            </div>
          </div>

          {/* Columna derecha: ranking actual */}
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-4 font-bold">Ranking actual</h2>

            <div className="space-y-3">
              {ranking.length ? (
                ranking.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between rounded border p-3"
                  >
                    <div>
                      <span className="mr-2 font-bold">#{r.position}</span>
                      {r.student.firstName} {r.student.lastName}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeMutation.mutate(r.id)}
                      className="text-sm text-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No hay ranking aún.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}