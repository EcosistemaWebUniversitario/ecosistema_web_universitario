import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { practicasAPI } from '../api/practicas.api';
import { useAuth } from '../context/AuthContext';

type Student = {
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
  profiles?: {
    id: string;
    full_name: string;
    role_id: number;
  };
};

export default function StudentsPage() {
  const { user, setUserFromToken } = useAuth();
  const queryClient = useQueryClient();

  const { data: studentData, isLoading } = useQuery<Student>({
    queryKey: ['student-me'],
    queryFn: async () => {
      const res = await practicasAPI.getMyStudent();
      return res.data.data;
    },
  });

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    if (studentData) {
      setFirstName(studentData.names);
      setLastName(studentData.surnames);
    }
  }, [studentData]);

  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      const res = await practicasAPI.updateStudentProfile({
        firstName,
        lastName,
      });
      return res.data.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['student-me'] });
      await setUserFromToken();
    },
  });

  if (isLoading) {
    return <p className="p-6">Cargando...</p>;
  }

  if (!studentData || !user) {
    return <p className="p-6">No se pudo cargar el perfil.</p>;
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">Mi perfil</h1>
        <p className="mt-2 text-sm text-slate-600">
          Aquí puedes revisar y actualizar tus datos personales.
        </p>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Datos personales</h2>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Nombres</label>
            <input
              className="w-full rounded-lg border border-slate-300 px-4 py-2"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Apellidos</label>
            <input
              className="w-full rounded-lg border border-slate-300 px-4 py-2"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="space-y-2 text-sm text-slate-600">
            <p><strong>CI:</strong> {studentData.ci}</p>
            <p><strong>Carrera:</strong> {studentData.career?.name}</p>
            <p><strong>Año académico:</strong> {studentData.academic_year}</p>
            <p><strong>Municipio:</strong> {studentData.municipality?.name}</p>
          </div>

          <button
            onClick={() => updateProfileMutation.mutate()}
            className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white"
          >
            Guardar cambios
          </button>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Autenticación centralizada</h2>
          <p className="text-sm text-slate-600">
            Las credenciales y la gestión de cuenta se realizan desde el servicio central de autenticación.
          </p>
        </div>
      </section>
    </div>
  );
}