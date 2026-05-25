import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { practicasAPI } from '../api/practicas.api';
import { useAuth } from '../context/AuthContext';

type CallStatus = 'OPEN' | 'CLOSED';

type Call = {
  id: number;
  academic_year: number;
  status: CallStatus;
  createdAt: string;
  career: {
    id: number;
    name: string;
  };
  creator: {
    id: number;
    email: string;
  };
};

type Career = {
  id: number;
  name: string;
};

function extractArray<T>(payload: any): T[] {
  if (Array.isArray(payload)) return payload;
  if (payload?.data && Array.isArray(payload.data)) return payload.data;
  return [];
}

export default function CallsPage() {
  const {  role } = useAuth();
  const queryClient = useQueryClient();

  const isAdmin =
    role === 'admin_prelocalizacion' ||
    role === 'super_admin';

  const [careerId, setCareerId] = useState<number | ''>('');
  const [message, setMessage] = useState('');

  const careersQuery = useQuery<Career[]>({
    queryKey: ['careers'],
    queryFn: async () => {
      const res = await practicasAPI.getCareers();
      return extractArray<Career>(res.data.data);
    },
    enabled: isAdmin,
  });

  const callsQuery = useQuery<Call[]>({
    queryKey: ['calls'],
    queryFn: async () => {
      const res = await practicasAPI.getCalls();
      return extractArray<Call>(res.data.data);
    },
    enabled: isAdmin,
  });

  useEffect(() => {
    if (careersQuery.data?.length && careerId === '') {
      setCareerId(careersQuery.data[0].id);
    }
  }, [careersQuery.data, careerId]);

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!careerId) {
        throw new Error('Debes seleccionar una carrera.');
      }

      return await practicasAPI.createCall({
        careerId,
        academic_year: 4, // ← fijo para prelocalización
      });
    },
    onSuccess: async () => {
      setMessage('Convocatoria creada correctamente.');
      await queryClient.invalidateQueries({ queryKey: ['calls'] });
    },
    onError: () => {
      setMessage('Error al crear la convocatoria.');
    },
  });

  const closeMutation = useMutation({
    mutationFn: async (id: number) => {
      return await practicasAPI.closeCall(id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['calls'] });
    },
  });

  const calls = useMemo(() => callsQuery.data ?? [], [callsQuery.data]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    await createMutation.mutateAsync();
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">Convocatorias</h1>
        <p className="mt-2 text-sm text-slate-600">
          Gestión del proceso de prelocalización (solo para 4to año).
        </p>
      </section>

      {isAdmin && (
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-slate-900">
            Crear convocatoria
          </h2>

          <form
            className="mt-6 grid gap-4 md:grid-cols-2"
            onSubmit={handleCreate}
          >
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Carrera
              </label>
              <select
                className="w-full rounded-lg border border-slate-300 px-4 py-2"
                value={careerId}
                onChange={(e) => setCareerId(Number(e.target.value))}
                disabled={careersQuery.isLoading}
              >
                <option value="">Seleccionar carrera</option>
                {careersQuery.data?.map((career) => (
                  <option key={career.id} value={career.id}>
                    {career.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-white"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? 'Creando...' : 'Crear convocatoria'}
              </button>
            </div>
          </form>

          {message && (
            <p className="mt-2 text-sm text-slate-600">{message}</p>
          )}
        </section>
      )}

      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-xl font-bold text-slate-900">
          Convocatorias registradas
        </h2>

        {callsQuery.isLoading ? (
          <p className="mt-4 text-sm text-slate-600">Cargando...</p>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {calls.length ? (
              calls.map((call) => (
                <CallCard
                  key={call.id}
                  call={call}
                  isAdmin={isAdmin}
                  onClose={() => closeMutation.mutate(call.id)}
                />
              ))
            ) : (
              <p className="text-sm text-slate-600">
                No hay convocatorias.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function CallCard({
  call,
  isAdmin,
  onClose,
}: {
  call: Call;
  isAdmin: boolean;
  onClose: () => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="flex justify-between gap-4">
        <h3 className="font-semibold">Convocatoria #{call.id}</h3>
        <span
          className={`rounded px-2 py-1 text-xs ${
            call.status === 'OPEN'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          {call.status}
        </span>
      </div>

      <div className="mt-2 space-y-1 text-sm text-gray-600">
        <p>Carrera: {call.career?.name}</p>
        <p>Año: {call.academic_year}</p>
        <p>Creador: {call.creator?.email}</p>
      </div>

      {isAdmin && (
        <div className="mt-4 space-y-2">
          {call.status === 'OPEN' && (
            <button
              onClick={onClose}
              className="w-full rounded-lg bg-red-600 px-3 py-2 text-sm text-white"
            >
              Cerrar convocatoria
            </button>
          )}

          <Link
            to={`/prelocalization/calls/${call.id}/ranking`}
            className="block w-full rounded-lg bg-slate-900 px-3 py-2 text-center text-sm text-white"
          >
            Ver ranking
          </Link>

          <Link
            to={`/prelocalization/calls/${call.id}/assignments`}
            className="block w-full rounded-lg bg-emerald-600 px-3 py-2 text-center text-sm text-white"
          >
            Ver asignaciones
          </Link>
        </div>
      )}
    </div>
  );
}