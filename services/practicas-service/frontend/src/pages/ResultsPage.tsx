import { useQuery } from '@tanstack/react-query';
import { practicasAPI } from '../api/practicas.api';

type StudentProfile = {
  id: number;
  names: string;
  surnames: string;
  ci: string;
  academic_year: number;
  career: {
    name: string;
  };
  municipality: {
    name: string;
  };
};

type ResultsResponse = {
  student: StudentProfile;
  hasAssignment: boolean;
  assignment: null | {
    id: number;
    call: {
      id: number;
      academic_year: number;
      status: 'OPEN' | 'CLOSED';
    };
    vacancy: {
      id: number;
      title: string;
      specialty: string;
      agreement: {
        title: string;
        company: {
          name: string;
          municipality: {
            name: string;
          };
        };
      };
    };
  };
};

export default function ResultsPage() {
  const studentQuery = useQuery<StudentProfile>({
    queryKey: ['student-profile'],
    queryFn: async () => {
      const res = await practicasAPI.getMyStudent();
      return res.data.data;
    },
  });

  const isFourthYear = studentQuery.data?.academic_year === 4;

  const resultsQuery = useQuery<ResultsResponse>({
    queryKey: ['my-results'],
    queryFn: async () => {
      const res = await practicasAPI.getResults();
      return res.data.data;
    },
    enabled: isFourthYear,
  });

  if (studentQuery.isLoading) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm text-slate-600">Cargando perfil...</p>
      </div>
    );
  }

  if (!studentQuery.data) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm text-slate-600">No se pudo cargar el perfil.</p>
      </div>
    );
  }

  if (!isFourthYear) {
    return (
      <div className="space-y-8">
        <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-2xl font-bold text-slate-900">Resultados</h1>
          <p className="mt-2 text-sm text-slate-600">
            Este módulo solo está disponible para estudiantes de 4to año.
          </p>
        </section>
      </div>
    );
  }

  const assignment = resultsQuery.data?.assignment;

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">Resultados de prelocalización</h1>
        <p className="mt-2 text-sm text-slate-600">
          Consulta del resultado final de tu convocatoria.
        </p>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 space-y-2">
        <p><strong>Nombre:</strong> {studentQuery.data.names} {studentQuery.data.surnames}</p>
        <p><strong>CI:</strong> {studentQuery.data.ci}</p>
        <p><strong>Carrera:</strong> {studentQuery.data.career?.name}</p>
        <p><strong>Municipio:</strong> {studentQuery.data.municipality?.name}</p>
        <p><strong>Año académico:</strong> {studentQuery.data.academic_year}</p>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        {resultsQuery.isLoading ? (
          <p className="text-sm text-slate-600">Cargando resultados...</p>
        ) : assignment ? (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">Asignación obtenida</h2>
            <p><strong>Convocatoria:</strong> #{assignment.call.id}</p>
            <p><strong>Estado de convocatoria:</strong> {assignment.call.status}</p>
            <p><strong>Vacante:</strong> {assignment.vacancy.title}</p>
            <p><strong>Especialidad:</strong> {assignment.vacancy.specialty}</p>
            <p><strong>Empresa:</strong> {assignment.vacancy.agreement.company.name}</p>
            <p><strong>Municipio de la empresa:</strong> {assignment.vacancy.agreement.company.municipality.name}</p>
            <p><strong>Convenio:</strong> {assignment.vacancy.agreement.title}</p>
          </div>
        ) : (<p className="text-sm text-slate-600">
            Aún no tienes una asignación registrada en prelocalización.
          </p>
        )}
      </section>
    </div>
  );
}