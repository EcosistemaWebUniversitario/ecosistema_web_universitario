import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { practicasAPI } from '../api/practicas.api';
import { useAuth } from '../context/AuthContext';

type Agreement = {
  id: number;
  type: 'PRACTICE' | 'PRELOCATION' | 'BOTH';
  title: string;
  description: string;
  specialty: string;
  studentsNeeded: number;
  bankProblemDocument: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedByPractices: boolean;
  approvedByPrelocation: boolean;
  company: {
    id: number;
    name: string;
  };
  createdAt: string;
};

type AgreementForm = {
  type: 'PRACTICE' | 'PRELOCATION' | 'BOTH';
  title: string;
  description: string;
  specialty: string;
  studentsNeeded: number;
  bankProblemDocument: string;
};

export default function AgreementsPage() {
  const { user,role } = useAuth();
  const queryClient = useQueryClient();

  const isCompany = role === 'empresa';
  const isAdminPracticas = role === 'admin_practicas';
  const isAdminPrelocalizacion = role === 'admin_prelocalizacion';
  const isSuperAdmin = role === 'super_admin';
  const canReview =
    isAdminPracticas || isAdminPrelocalizacion || isSuperAdmin;

  const [form, setForm] = useState<AgreementForm>({
    type: 'PRACTICE',
    title: '',
    description: '',
    specialty: '',
    studentsNeeded: 1,
    bankProblemDocument: '',
  });

  const [message, setMessage] = useState('');

  const agreementsQuery = useQuery<Agreement[]>({
  queryKey: ['agreements', role],
  queryFn: async () => {
    const res = isCompany
      ? await practicasAPI.getMyAgreements()
      : await practicasAPI.getAgreements();

    console.log('📋 [AgreementsPage] Respuesta cruda del backend:', res);
    console.log('📋 [AgreementsPage] res.data:', res.data);
    console.log('📋 [AgreementsPage] res.data?.data:', res.data?.data);

    // Desempaquetamos la respuesta del backend
    const payload = res.data.data ?? res.data;
    console.log('📋 [AgreementsPage] payload (desempaquetado):', payload);
    console.log('📋 [AgreementsPage] ¿Es array?:', Array.isArray(payload));

    // Si es un arreglo (empresa), lo usamos directamente.
    // Si es un objeto paginado (admin), extraemos "data".
    const result = Array.isArray(payload) ? payload : payload?.data ?? [];
    console.log('📋 [AgreementsPage] Resultado final (agreements):', result);
    return result;
  },
  enabled: !!user,
});

  const createMutation = useMutation({
    mutationFn: async () => {
      return await practicasAPI.createAgreement({
        ...form,
        bankProblemDocument: form.bankProblemDocument || null,
      });
    },
    onSuccess: async () => {
      setMessage('Convenio creado correctamente.');
      setForm({
        type: 'PRACTICE',
        title: '',
        description: '',
        specialty: '',
        studentsNeeded: 1,
        bankProblemDocument: '',
      });
      await queryClient.invalidateQueries({ queryKey: ['agreements'] });
    },
    onError: () => {
      setMessage('No se pudo crear el convenio.');
    },
  });

  const approvePracticesMutation = useMutation({
    mutationFn: async (id: number) => {
      return await practicasAPI.approveAgreement(id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['agreements'] });
    },
  });

  const approvePrelocationMutation = useMutation({
    mutationFn: async (id: number) => {
      return await practicasAPI.approvePrelocationAgreement(id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['agreements'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: number) => {
      return await practicasAPI.rejectAgreement(id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['agreements'] });
    },
  });

  // ✅ Filtrado de convenios según rol
  const agreements = useMemo(() => {
    const rawData = agreementsQuery.data ?? [];

    // Empresa ya obtiene solo los suyos desde el backend
    if (isCompany) return rawData;

    // Super admin ve todos
    if (isSuperAdmin) return rawData;

    // Admin prácticas ve PRACTICE y BOTH
    if (isAdminPracticas) {
      return rawData.filter(
        (a) => a.type === 'PRACTICE' || a.type === 'BOTH'
      );
    }

    // Admin prelocalización ve PRELOCATION y BOTH
    if (isAdminPrelocalizacion) {
      return rawData.filter(
        (a) => a.type === 'PRELOCATION' || a.type === 'BOTH'
      );
    }

    // Fallback (no debería llegar aquí)
    return rawData;
  }, [agreementsQuery.data, isCompany, isSuperAdmin, isAdminPracticas, isAdminPrelocalizacion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    await createMutation.mutateAsync();
  };

  const canApproveByPractices = (agreement: Agreement) =>
    agreement.type === 'PRACTICE' || agreement.type === 'BOTH';

  const canApproveByPrelocation = (agreement: Agreement) =>
    agreement.type === 'PRELOCATION' || agreement.type === 'BOTH';

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">Convenios</h1>
        <p className="mt-2 text-sm text-slate-600">
          Gestión de convenios según el rol de acceso.
        </p>
      </section>

      {isCompany && (
        <section className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Crear convenio</h2>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Tipo
                </label>
                <select
                  className="w-full rounded-lg border border-slate-300 px-4 py-2"
                  value={form.type}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      type: e.target.value as AgreementForm['type'],
                    }))
                  }
                >
                  <option value="PRACTICE">PRACTICE</option>
                  <option value="PRELOCATION">PRELOCATION</option>
                  <option value="BOTH">BOTH</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Título
                </label>
                <input
                  className="w-full rounded-lg border border-slate-300 px-4 py-2"
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Descripción
                </label>
                <textarea
                  className="w-full rounded-lg border border-slate-300 px-4 py-2"
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Especialidad
                </label>
                <input
                  className="w-full rounded-lg border border-slate-300 px-4 py-2"
                  value={form.specialty}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, specialty: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Estudiantes necesarios
                </label>
                <input
                  type="number"
                  min={1}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2"
                  value={form.studentsNeeded}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      studentsNeeded: Number(e.target.value),
                    }))
                  }
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Documento del banco de problemas
                </label>
                <input
                  className="w-full rounded-lg border border-slate-300 px-4 py-2"
                  value={form.bankProblemDocument}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      bankProblemDocument: e.target.value,
                    }))
                  }
                />
              </div>

              <button
                type="submit"
                className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? 'Creando...' : 'Crear convenio'}
              </button>

              {message && <p className="text-sm text-slate-600">{message}</p>}
            </form>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Mis convenios</h2>

            {agreementsQuery.isLoading ? (
              <p className="mt-4 text-sm text-slate-600">Cargando...</p>
            ) : (
              <div className="mt-4 space-y-4">
                {agreements.length ? (
                  agreements.map((agreement) => (
                    <AgreementCard
                      key={agreement.id}
                      agreement={agreement}
                      canReview={false}
                    />
                  ))
                ) : (
                  <p className="text-sm text-slate-600">
                    No tienes convenios creados todavía.
                  </p>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {canReview && !isCompany && (
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-slate-900">
            Convenios para revisión
          </h2>

          {agreementsQuery.isLoading ? (
            <p className="mt-4 text-sm text-slate-600">Cargando...</p>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {agreements.length ? (
                agreements.map((agreement) => (
                  <AgreementCard
                    key={agreement.id}
                    agreement={agreement}
                    canReview
                    onApprovePractices={() =>
                      approvePracticesMutation.mutate(agreement.id)
                    }
                    onApprovePrelocation={() =>
                      approvePrelocationMutation.mutate(agreement.id)
                    }
                    onReject={() => rejectMutation.mutate(agreement.id)}
                    canApproveByPractices={canApproveByPractices(agreement)}
                    canApproveByPrelocation={canApproveByPrelocation(agreement)}
                  />
                ))
              ) : (
                <p className="text-sm text-slate-600">
                  No hay convenios para mostrar.
                </p>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function AgreementCard({
  agreement,
  canReview,
  onApprovePractices,
  onApprovePrelocation,
  onReject,
  canApproveByPractices = false,
  canApproveByPrelocation = false,
}: {
  agreement: Agreement;
  canReview: boolean;
  onApprovePractices?: () => void;
  onApprovePrelocation?: () => void;
  onReject?: () => void;
  canApproveByPractices?: boolean;
  canApproveByPrelocation?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-slate-900">{agreement.title}</h3>
          <p className="mt-1 text-sm text-slate-600">{agreement.description}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            agreement.status === 'APPROVED'
              ? 'bg-emerald-100 text-emerald-700'
              : agreement.status === 'REJECTED'
              ? 'bg-red-100 text-red-700'
              : 'bg-amber-100 text-amber-700'
          }`}
        >
          {agreement.status}
        </span>
      </div>

      <div className="mt-4 space-y-1 text-sm text-slate-600">
        <p><span className="font-medium">Tipo:</span> {agreement.type}</p>
        <p><span className="font-medium">Especialidad:</span> {agreement.specialty}</p>
        <p><span className="font-medium">Estudiantes:</span> {agreement.studentsNeeded}</p>
        <p><span className="font-medium">Empresa:</span> {agreement.company?.name ?? '-'}</p>
      </div>

      {canReview && (
        <div className="mt-4 flex flex-wrap gap-2">
          {canApproveByPractices && (
            <button
              onClick={onApprovePractices}
              className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white"
            >
              Aprobar prácticas
            </button>
          )}

          {canApproveByPrelocation && (
            <button
              onClick={onApprovePrelocation}
              className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white"
            >
              Aprobar prelocalización
            </button>
          )}

          <button
            onClick={onReject}
            className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white"
          >
            Rechazar
          </button>
        </div>
      )}
    </div>
  );
}