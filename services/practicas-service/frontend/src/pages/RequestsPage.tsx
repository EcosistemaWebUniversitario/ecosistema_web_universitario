import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { practicasAPI } from '../api/practicas.api';
import { useAuth } from '../context/AuthContext';

type StudentProfile = {
  id: number;
  academic_year: number;
  firstName?: string;
  lastName?: string;
};

type Vacancy = {
  id: number;
  title: string;
  specialty: string;
  status: 'OPEN' | 'CLOSED';
  agreement: {
    title: string;
    type: 'PRACTICE' | 'PRELOCATION' | 'BOTH';
    company: {
      name: string;
    };
  };
};

type RequestItem = {
  id: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  vacancy: Vacancy;
  student?: {
    id: number;
    firstName: string;
    lastName: string;
    ci?: string;
    academicYear?: number;
  };
};

function extractArray<T>(payload: any): T[] {
  if (Array.isArray(payload)) return payload;
  if (payload?.data && Array.isArray(payload.data)) return payload.data;
  return [];
}

export default function RequestsPage() {
  const { role } = useAuth();
  const queryClient = useQueryClient();

  const isStudent = role === 'estudiante';
  const isAdminPracticas =
    role === 'admin_practicas' || role === 'super_admin';

  const [message, setMessage] = useState('');

  // ----------------------------
  // ESTUDIANTE
  // ----------------------------
  const studentQuery = useQuery<StudentProfile>({
    queryKey: ['student-profile'],
    queryFn: async () => {
      const res = await practicasAPI.getMyStudent();
      return res.data.data;
    },
    enabled: isStudent,
  });

  const isThirdYear = studentQuery.data?.academic_year === 3;

  const studentVacanciesQuery = useQuery<Vacancy[]>({
    queryKey: ['student-vacancies'],
    queryFn: async () => {
      const res = await practicasAPI.getPublicVacancies();
      return extractArray<Vacancy>(res.data.data);
    },
    enabled: isStudent && isThirdYear,
  });

  const myRequestsQuery = useQuery<RequestItem[]>({
    queryKey: ['my-requests'],
    queryFn: async () => {
      const res = await practicasAPI.getMyRequests();
      return extractArray<RequestItem>(res.data.data);
    },
    enabled: isStudent && isThirdYear,
  });

  const applyMutation = useMutation({
    mutationFn: async (vacancyId: number) => {
      return await practicasAPI.applyVacancy(vacancyId);
    },
    onSuccess: async () => {
      setMessage('Solicitud enviada correctamente.');
      await queryClient.invalidateQueries({ queryKey: ['my-requests'] });
    },
    onError: () => {
      setMessage('No se pudo aplicar a la vacante.');
    },
  });

  // ----------------------------
  // ADMIN PRÁCTICAS
  // ----------------------------
  const adminRequestsQuery = useQuery<RequestItem[]>({
    queryKey: ['admin-requests'],
    queryFn: async () => {
      const res = await practicasAPI.getRequests();
      return extractArray<RequestItem>(res.data.data);
    },
    enabled: isAdminPracticas,
  });

  const adminVacanciesQuery = useQuery<Vacancy[]>({
    queryKey: ['admin-vacancies'],
    queryFn: async () => {
      const res = await practicasAPI.getVacancies();
      return extractArray<Vacancy>(res.data.data);
    },
    enabled: isAdminPracticas,
  });

  const approveMutation = useMutation({
    mutationFn: async (id: number) => {
      return await practicasAPI.approveRequest(id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-requests'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: number) => {
      return await practicasAPI.rejectRequest(id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-requests'] });
    },
  });

  const studentVacancies = useMemo(
    () => studentVacanciesQuery.data ?? [],
    [studentVacanciesQuery.data],
  );

  const myRequests = useMemo(
    () => myRequestsQuery.data ?? [],
    [myRequestsQuery.data],
  );

  const adminRequests = useMemo(() => adminRequestsQuery.data ?? [],
    [adminRequestsQuery.data],
  );

  const adminVacancies = useMemo(
    () => adminVacanciesQuery.data ?? [],
    [adminVacanciesQuery.data],
  );

  const alreadyApplied = (vacancyId: number) =>
    myRequests.some((r) => r.vacancy.id === vacancyId);

  // ----------------------------
  // VALIDACIONES ESTUDIANTE
  // ----------------------------
  if (isStudent && studentQuery.isLoading) {
    return (
      <div className="space-y-8">
        <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-2xl font-bold text-slate-900">Solicitudes</h1>
          <p className="mt-2 text-sm text-slate-600">Cargando perfil...</p>
        </section>
      </div>
    );
  }

  if (isStudent && !studentQuery.data) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm text-slate-600">No se pudo cargar tu perfil.</p>
      </div>
    );
  }

  if (isStudent && !isThirdYear) {
    return (
      <div className="space-y-8">
        <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-2xl font-bold text-slate-900">Solicitudes</h1>
          <p className="mt-2 text-sm text-slate-600">
            Este módulo solo está disponible para estudiantes de 3er año.
          </p>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-600">
            Tu año académico actual es{' '}
            <strong>{studentQuery.data?.academic_year ?? '-'}</strong>.
            Aquí no puedes realizar solicitudes de prácticas.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">Solicitudes</h1>
        <p className="mt-2 text-sm text-slate-600">
          {isStudent
            ? 'Aplicación a vacantes de prácticas laborales.'
            : 'Gestión de solicitudes de estudiantes.'}
        </p>
      </section>

      {/* =========================
          BLOQUE ESTUDIANTE
         ========================= */}
      {isStudent && (
        <>
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-bold text-slate-900">
              Vacantes disponibles
            </h2>

            {studentVacanciesQuery.isLoading ? (
              <p className="mt-4 text-sm text-slate-600">Cargando...</p>
            ) : studentVacancies.length ? (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {studentVacancies.map((v) => (
                  <div
                    key={v.id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <h3 className="font-semibold text-slate-900">
                      {v.title}
                    </h3>
                    <p className="text-sm text-slate-600">{v.specialty}</p>
                    <p className="text-xs text-slate-500">
                      Empresa: {v.agreement.company.name}
                    </p>

                    <button
                      onClick={() => applyMutation.mutate(v.id)}
                      disabled={alreadyApplied(v.id)}
                      className="mt-3 w-full rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white disabled:bg-slate-400"
                    >
                      {alreadyApplied(v.id) ? 'Ya aplicaste' : 'Aplicar'}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-600">
                No hay vacantes disponibles.
              </p>
            )}
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Mis solicitudes</h2>

            {myRequestsQuery.isLoading ? (
              <p className="mt-4 text-sm text-slate-600">Cargando...</p>
            ) : myRequests.length ? (
              <div className="mt-4 space-y-4">
                {myRequests.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {r.vacancy.title}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {r.vacancy.specialty} · Empresa:{' '}
                          {r.vacancy.agreement.company.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          Convenio: {r.vacancy.agreement.title}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          r.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-700'
                            : r.status === 'REJECTED'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-600">
                No has enviado solicitudes todavía.
              </p>
            )}
          </section>
        </>
      )}

      {/* =========================
          BLOQUE ADMIN PRÁCTICAS
         ========================= */}
      {isAdminPracticas && (
        <>
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-bold text-slate-900">
              Solicitudes para revisión
            </h2>

            {adminRequestsQuery.isLoading ? (
              <p className="mt-4 text-sm text-slate-600">Cargando...</p>
            ) : adminRequests.length ? (
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {adminRequests.map((request) => (
                  <div
                    key={request.id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {request.student
                            ? `${request.student.firstName} ${request.student.lastName}`
                            : 'Estudiante'}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {request.vacancy.title} · {request.vacancy.specialty}
                        </p>
                        <p className="text-xs text-slate-500">
                          Empresa: {request.vacancy.agreement.company.name}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          request.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-700'
                            : request.status === 'REJECTED'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {request.status}
                      </span>
                    </div>

                    <div className="mt-4 flex gap-2"><button
                        onClick={() => approveMutation.mutate(request.id)}
                        className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white"
                      >
                        Aprobar
                      </button>
                      <button
                        onClick={() => rejectMutation.mutate(request.id)}
                        className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white"
                      >
                        Rechazar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-600">
                No hay solicitudes para mostrar.
              </p>
            )}
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-bold text-slate-900">
              Vacantes registradas
            </h2>

            {adminVacanciesQuery.isLoading ? (
              <p className="mt-4 text-sm text-slate-600">Cargando...</p>
            ) : adminVacancies.length ? (
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {adminVacancies.map((v) => (
                  <div
                    key={v.id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <h3 className="font-semibold text-slate-900">{v.title}</h3>
                    <p className="text-sm text-slate-600">{v.specialty}</p>
                    <p className="text-xs text-slate-500">
                      Empresa: {v.agreement.company.name}
                    </p>
                    <p className="mt-2 text-xs font-medium text-slate-700">
                      {v.status}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-600">
                No hay vacantes registradas.
              </p>
            )}
          </section>
        </>
      )}

      {message && <p className="text-sm text-slate-600">{message}</p>}
    </div>
  );
}