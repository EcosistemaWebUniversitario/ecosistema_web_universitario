import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { practicasAPI } from '../api/practicas.api';

type Student = {
  id: number;
  firstName: string;
  lastName: string;
  municipality?: { name: string };
};

type Vacancy = {
  id: number;
  title: string;
  slots?: number;
  agreement: {
    company: {
      name: string;
      municipality?: { name: string };
    };
  };
};

type Assignment = {
  id: number;
  student: Student;
  vacancy: Vacancy;
};

type ManageData = {
  call: {
    id: number;
    academic_year: number;
    status: 'OPEN' | 'CLOSED';
  };
  nextStudent: Student | null;
  vacancies: Vacancy[];
  byMunicipality: Vacancy[];
  assignments: Assignment[];
  ranking: unknown[];
};

export default function AssignmentsPage() {
  const queryClient = useQueryClient();
  const params = useParams();

  const callId = Number(params.callId);
  const [message, setMessage] = useState('');

  const manageQuery = useQuery<ManageData>({
    queryKey: ['assignments', callId],
    queryFn: async () => {
      const res = await practicasAPI.getAssignments(callId);
      return res.data.data;
    },
    enabled: Number.isFinite(callId) && callId > 0,
  });

  const assignMutation = useMutation({
    mutationFn: async (vacancyId: number) => {
      return await practicasAPI.assignStudent(callId, vacancyId);
    },
    onSuccess: async () => {
      setMessage('Asignación realizada correctamente.');
      await queryClient.invalidateQueries({ queryKey: ['assignments', callId] });
    },
    onError: () => {
      setMessage('Error en la asignación.');
    },
  });  const nextStudent = manageQuery.data?.nextStudent;
  const vacancies = useMemo(() => manageQuery.data?.vacancies ?? [], [manageQuery.data]);
  const byMunicipality = useMemo(() => manageQuery.data?.byMunicipality ?? [], [manageQuery.data]);
  const assignments = useMemo(() => manageQuery.data?.assignments ?? [], [manageQuery.data]);

  if (!Number.isFinite(callId) || callId <= 0) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm text-slate-600">No se recibió una convocatoria válida.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">Asignaciones</h1>
        <p className="mt-2 text-sm text-slate-600">
          Asignación de estudiantes según ranking.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Convocatoria seleccionada: #{callId}
        </p>
      </section>

      {manageQuery.isLoading ? (
        <p className="text-sm text-slate-600">Cargando...</p>
      ) : (
        <>
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="mb-2 font-bold text-slate-900">Siguiente estudiante</h2>

            {nextStudent ? (
              <div>
                <p className="font-semibold text-slate-900">
                  {nextStudent.firstName} {nextStudent.lastName}
                </p>
                <p className="text-sm text-slate-600">
                  Municipio: {nextStudent.municipality?.name ?? '-'}
                </p>
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No hay más estudiantes por asignar.
              </p>
            )}
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="mb-4 font-bold text-slate-900">
              Vacantes del mismo municipio (prioridad)
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              {byMunicipality.length ? (
                byMunicipality.map((v) => (
                  <VacancyCard
                    key={v.id}
                    vacancy={v}
                    onAssign={() => assignMutation.mutate(v.id)}
                  />
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  No hay coincidencias por municipio.
                </p>
              )}
            </div>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="mb-4 font-bold text-slate-900">Todas las vacantes</h2>

            <div className="grid gap-4 md:grid-cols-2">
              {vacancies.length ? (
                vacancies.map((v) => (
                  <VacancyCard
                    key={v.id}
                    vacancy={v}
                    onAssign={() => assignMutation.mutate(v.id)}
                  />
                ))
              ) : (
                <p className="text-sm text-slate-500">No hay vacantes disponibles.</p>
              )}
            </div>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="mb-4 font-bold text-slate-900">Asignaciones realizadas</h2>

            <div className="space-y-3">
              {assignments.length ? (
                assignments.map((a) => (
                  <div
                    key={a.id}
                    className="flex justify-between rounded border border-slate-200 p-3"
                  >
                    <span className="text-slate-900">
                      {a.student.firstName} {a.student.lastName}
                    </span>
                    <span className="text-sm text-slate-600">
                      {a.vacancy.title} - {a.vacancy.agreement.company.name}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No hay asignaciones aún.</p>
              )}
            </div>
          </section>

          {message && (
            <p className="text-sm text-slate-600">{message}</p>
          )}
        </>
      )}
    </div>
  );
}

function VacancyCard({
  vacancy,
  onAssign,
}: {
  vacancy: Vacancy;
  onAssign: () => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <h3 className="font-semibold text-slate-900">{vacancy.title}</h3>
      <p className="text-sm text-slate-600">
        Empresa: {vacancy.agreement.company.name}
      </p>
      <p className="text-xs text-slate-500">
        Municipio: {vacancy.agreement.company.municipality?.name ?? '-'}
      </p>

      <button
        onClick={onAssign}
        className="mt-3 w-full rounded bg-emerald-600 py-2 text-white"
      >
        Asignar aquí
      </button>
    </div>
  );
}