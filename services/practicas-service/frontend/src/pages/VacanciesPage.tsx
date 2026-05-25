import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { practicasAPI } from '../api/practicas.api';
import { useAuth } from '../context/AuthContext';

type Agreement = {
  id: number;
  title: string;
  type: 'PRACTICE' | 'PRELOCATION' | 'BOTH';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  specialty: string;
};

type Vacancy = {
  id: number;
  title: string;
  specialty: string;
  slots: number;
  status: 'OPEN' | 'CLOSED';
  agreement: {
    id: number;
    title: string;
    type: string;
    status: string;
    company: {
      id: number;
      name: string;
    };
  };
  _count?: {
    requests: number;
    prelocalizationAssignments?: number;
  };
};

function extractArray<T>(payload: any): T[] {
  if (Array.isArray(payload)) return payload;
  if (payload?.data && Array.isArray(payload.data)) return payload.data;
  return [];
}

export default function VacanciesPage() {
  const { role } = useAuth();
  const queryClient = useQueryClient();

  const isCompany = role === 'empresa';
  const isAdmin =
    role === 'admin_practicas' ||
    role === 'admin_prelocalizacion' ||
    role === 'super_admin';

  const [agreementId, setAgreementId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [slots, setSlots] = useState(1);
  const [message, setMessage] = useState('');
  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);

  const agreementsQuery = useQuery<Agreement[]>({
    queryKey: ['company-agreements'],
    queryFn: async () => {
      const res = await practicasAPI.getMyAgreements();
      return extractArray<Agreement>(res.data.data);
    },
    enabled: isCompany,
  });

  const vacanciesQuery = useQuery<Vacancy[]>({
    queryKey: ['vacancies', agreementId, role],
    queryFn: async () => {
      if (isCompany) {
        if (!agreementId) return [];
        const res = await practicasAPI.getVacanciesByAgreement(agreementId);
        return extractArray<Vacancy>(res.data.data);
      }
      const res = await practicasAPI.getVacancies();
      return extractArray<Vacancy>(res.data.data);
    },
    enabled: isAdmin || (isCompany && agreementId !== null),
  });

  useEffect(() => {
    if (isCompany && agreementsQuery.data && agreementsQuery.data.length > 0) {
      const approved = agreementsQuery.data.find(
        (agreement) => agreement.status === 'APPROVED',
      );
      if (approved && agreementId === null) {
        setAgreementId(approved.id);
      }
    }
  }, [agreementsQuery.data, isCompany, agreementId]);

  const approvedAgreements = useMemo(() => {
    return agreementsQuery.data?.filter(
      (agreement) => agreement.status === 'APPROVED',
    ) ?? [];
  }, [agreementsQuery.data]);

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!agreementId) throw new Error('Debes seleccionar un convenio aprobado.');
      return await practicasAPI.createVacancy(agreementId, {
        title,
        specialty,
        slots,
      });
    },
    onSuccess: async () => {
      setTitle('');
      setSpecialty('');
      setSlots(1);
      setMessage('Vacante creada correctamente.');
      await queryClient.invalidateQueries({ queryKey: ['vacancies'] });
      await queryClient.invalidateQueries({ queryKey: ['company-agreements'] });
    },
    onError: () => {
      setMessage('No se pudo crear la vacante.');
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async (vacancyId: number) => {
      return await practicasAPI.toggleVacancyStatus(vacancyId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['vacancies'] });
    },
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    await createMutation.mutateAsync();
  };

  const handleViewDetails = (vacancy: Vacancy) => {
    setSelectedVacancy(vacancy);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="rounded-3xl bg-gradient-to-r from-emerald-700 to-emerald-600 p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold">Vacantes</h1>
        <p className="mt-2 text-sm text-emerald-50">
          {isCompany
            ? 'Crea y administra las plazas disponibles para tus convenios aprobados.'
            : 'Visualiza y gestiona todas las vacantes del sistema.'}
        </p>
      </section>

      {/* Panel de creación (solo empresas) */}
      {isCompany && (
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Crear nueva vacante</h2>
          {approvedAgreements.length === 0 ? (
            <div className="mt-4 rounded-lg bg-amber-50 p-4 text-sm text-amber-700">
              No tienes convenios aprobados todavía. Solicita o espera la aprobación de un convenio para crear vacantes.
            </div>
          ) : (
            <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleCreate}>
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Convenio aprobado
                </label>
                <select
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  value={agreementId ?? ''}
                  onChange={(e) => setAgreementId(Number(e.target.value))}
                >
                  {approvedAgreements.map((agreement) => (
                    <option key={agreement.id} value={agreement.id}>
                      #{agreement.id} - {agreement.title} ({agreement.type})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Título</label>
                <input
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Desarrollador Backend"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Especialidad</label>
                <input
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder="Ej: Informática"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Cupos disponibles</label>
                <input
                  type="number"
                  min={1}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  value={slots}
                  onChange={(e) => setSlots(Number(e.target.value))}
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                >
                  {createMutation.isPending ? 'Creando...' : 'Crear vacante'}
                </button>
              </div>
              {message && (
                <div className="md:col-span-2 text-sm text-slate-600">{message}</div>
              )}
            </form>
          )}
        </section>
      )}

      {/* Listado de vacantes */}
      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {isCompany ? 'Mis vacantes' : 'Todas las vacantes'}
          </h2>
          {isCompany && approvedAgreements.length > 1 && (
            <select
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
              value={agreementId ?? ''}
              onChange={(e) => setAgreementId(Number(e.target.value))}
            >
              {approvedAgreements.map((ag) => (
                <option key={ag.id} value={ag.id}>
                  {ag.title}
                </option>
              ))}
            </select>
          )}
        </div>

        {vacanciesQuery.isLoading ? (
          <div className="py-12 text-center text-slate-500">Cargando vacantes...</div>
        ) : vacanciesQuery.data?.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {vacanciesQuery.data.map((vacancy) => (
              <VacancyCard
                key={vacancy.id}
                vacancy={vacancy}
                isAdmin={isAdmin}
                onToggleStatus={() => toggleStatusMutation.mutate(vacancy.id)}
                onViewDetails={() => handleViewDetails(vacancy)}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500">
            No hay vacantes disponibles.
          </div>
        )}
      </section>

      {/* Modal de detalles (opcional, mejora la experiencia) */}
      {selectedVacancy && (
        <VacancyDetailsModal
          vacancy={selectedVacancy}
          onClose={() => setSelectedVacancy(null)}
          isAdmin={isAdmin}
          onToggleStatus={() => {
            toggleStatusMutation.mutate(selectedVacancy.id);
            setSelectedVacancy(null);
          }}
        />
      )}
    </div>
  );
}

// Componente de tarjeta de vacante más completo
function VacancyCard({
  vacancy,
  isAdmin,
  onToggleStatus,
  //onViewDetails,
}: {
  vacancy: Vacancy;
  isAdmin: boolean;
  onToggleStatus: () => void;
  onViewDetails: () => void;
}) {
  const statusColor =
    vacancy.status === 'OPEN'
      ? 'bg-emerald-100 text-emerald-700'
      : 'bg-slate-100 text-slate-700';

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div className="absolute right-2 top-2">
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColor}`}>
          {vacancy.status === 'OPEN' ? 'Abierta' : 'Cerrada'}
        </span>
      </div>
      <div className="mb-3">
        <h3 className="pr-20 text-lg font-semibold text-slate-900">{vacancy.title}</h3>
        <p className="text-sm font-medium text-emerald-700">{vacancy.specialty}</p>
      </div>
      <div className="space-y-2 text-sm text-slate-600">
        <div className="flex items-center justify-between">
          <span>Cupos:</span>
          <span className="font-medium">{vacancy.slots}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Convenio:</span>
          <span className="font-medium">{vacancy.agreement.title}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Empresa:</span>
          <span className="font-medium">{vacancy.agreement.company.name}</span>
        </div>
        {vacancy._count?.requests !== undefined && (
          <div className="flex items-center justify-between">
            <span>Solicitudes:</span>
            <span className="font-medium">{vacancy._count.requests}</span>
          </div>
        )}
      </div>
      <div className="mt-4 flex gap-2">
        
        {isAdmin && (
          <button
            onClick={onToggleStatus}
            className="flex-1 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            {vacancy.status === 'OPEN' ? 'Cerrar' : 'Abrir'}
          </button>
        )}
      </div>
    </div>
  );
}

// Modal para mostrar información detallada (mejora la experiencia)
function VacancyDetailsModal({
  vacancy,
  onClose,
  isAdmin,
  onToggleStatus,
}: {
  vacancy: Vacancy;
  onClose: () => void;
  isAdmin: boolean;
  onToggleStatus: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{vacancy.title}</h2>
            <p className="text-emerald-700">{vacancy.specialty}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-slate-100">
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-4">
            <div>
              <p className="text-sm text-slate-500">Estado</p>
              <p className="font-medium">{vacancy.status === 'OPEN' ? 'Abierta' : 'Cerrada'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Cupos</p>
              <p className="font-medium">{vacancy.slots}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-slate-500">Convenio</p>
              <p className="font-medium">{vacancy.agreement.title}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-slate-500">Empresa</p>
              <p className="font-medium">{vacancy.agreement.company.name}</p>
            </div>
          </div>
          {vacancy._count && (
            <div className="text-sm text-slate-600">
              <p>Solicitudes recibidas: {vacancy._count.requests ?? 0}</p>
              {vacancy._count.prelocalizationAssignments !== undefined && (
                <p>Asignaciones de prelocalización: {vacancy._count.prelocalizationAssignments}</p>
              )}
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end gap-3">
          {isAdmin && (
            <button
              onClick={onToggleStatus}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              {vacancy.status === 'OPEN' ? 'Cerrar vacante' : 'Abrir vacante'}
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}