import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/base/Button';
import { Input } from '../components/base/Input';
import { Select } from '../components/base/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

type Career = { id: number; name: string };
type Municipality = { id: number; name: string };

const gateway = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

gateway.interceptors.request.use((config) => {
  const token =
    localStorage.getItem('token') ||
    localStorage.getItem('access_token') ||
    localStorage.getItem('authToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default function CompleteProfilePage() {
  const { user, role, setUserFromToken } = useAuth();
  const navigate = useNavigate();

  const isStudent = role === 'estudiante';
  const isCompany = role === 'empresa';

  const careersQuery = useQuery<Career[]>({
    queryKey: ['careers'],
    queryFn: async () => {
      const res = await gateway.get('/careers');
      return res.data.data ?? res.data;
    },
    enabled: isStudent,
  });

  const municipalitiesQuery = useQuery<Municipality[]>({
    queryKey: ['municipalities'],
    queryFn: async () => {
      const res = await gateway.get('/municipalities');
      return res.data.data ?? res.data;
    },
    enabled: isStudent || isCompany,
  });

  const [studentForm, setStudentForm] = useState({
    firstName: '',    // ← cambiado
    lastName: '',     // ← cambiado
    ci: '',
    academicYear: 3,
    careerId: 0,
    municipalityId: 0,
    studyMode: 'REGULAR_DIURNO',
  });

  const [companyForm, setCompanyForm] = useState({
    name: '',
    phone: '',
    address: '',
    municipalityId: 0,
  });

  useEffect(() => {
    if (isStudent && careersQuery.data?.length && municipalitiesQuery.data?.length) {
      setStudentForm((prev) => ({
        ...prev,
        careerId: careersQuery.data[0].id,
        municipalityId: municipalitiesQuery.data[0].id,
      }));
    }
    if (isCompany && municipalitiesQuery.data?.length) {
      setCompanyForm((prev) => ({
        ...prev,
        municipalityId: municipalitiesQuery.data[0].id,
      }));
    }
  }, [isStudent, isCompany, careersQuery.data, municipalitiesQuery.data]);

  const studentMutation = useMutation({
    mutationFn: async () => {
      // studentForm ya tiene firstName, lastName, etc.
      const res = await gateway.post('/students/profile', studentForm);
      return res.data.data ?? res.data;
    },
    onSuccess: async () => {
      await setUserFromToken();
      navigate('/dashboard');
    },
  });

  const companyMutation = useMutation({
    mutationFn: async () => {
      const res = await gateway.post('/companies/profile', companyForm);
      return res.data.data ?? res.data;
    },
    onSuccess: async () => {
      await setUserFromToken();
      navigate('/dashboard');
    },
  });

  if (!user || careersQuery.isLoading || municipalitiesQuery.isLoading) {
    return <div className="p-6 text-center">Cargando perfil...</div>;
  }

  if (!isStudent && !isCompany) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-xl font-bold text-slate-900">Perfil no identificado</h1>
          <p className="mt-2 text-slate-600">
            No se pudo determinar el tipo de cuenta. Por favor, contacta al administrador.
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Rol detectado: {role ?? 'ninguno'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-600">
            <img
              src="/logo.png"
              alt="Universidad de Las Tunas"
              className="h-12 w-12 rounded-xl object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Universidad de Las Tunas
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Gestión de Prácticas Estudiantiles y Prelocalización Laboral
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Completar Perfil</CardTitle>
            <p className="text-sm text-slate-600">
              Completa la información para activar todas las funciones de la plataforma
            </p>
          </CardHeader>
          <CardContent>
            {isStudent && (
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  studentMutation.mutate();
                }}
              >
                <div className="grid gap-6 md:grid-cols-2">
                  <Input
                    label="Nombres"
                    value={studentForm.firstName}
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, firstName: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="Apellidos"
                    value={studentForm.lastName}
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, lastName: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="CI"
                    value={studentForm.ci}
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, ci: e.target.value })
                    }
                    required
                  />
                  <Select
                    label="Año académico"
                    value={studentForm.academicYear.toString()}
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, academicYear: Number(e.target.value) })
                    }
                    options={[
                     { value: '1', label: '1er año' },
                     { value: '2', label: '2do año' },
                     { value: '3', label: '3er año' },
                     {value: '4', label: '4to año' },
                     { value: '5', label: '5to año' },
                    ]}
                  />
                  <Select
                    label="Carrera"
                    value={studentForm.careerId.toString()}
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, careerId: Number(e.target.value) })
                    }
                    options={careersQuery.data?.map((c) => ({ value: c.id.toString(), label: c.name })) || []}
                  />
                  <Select
                    label="Municipio"
                    value={studentForm.municipalityId.toString()}
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, municipalityId: Number(e.target.value) })
                    }
                    options={municipalitiesQuery.data?.map((m) => ({ value: m.id.toString(), label: m.name })) || []}
                  />
                  <Select
                    label="Modalidad de estudio"
                    value={studentForm.studyMode}
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, studyMode: e.target.value })
                    }
                    options={[
                      { value: 'REGULAR_DIURNO', label: 'Regular Diurno' },
                      { value: 'CURSO_POR_ENCUENTRO', label: 'Curso por Encuentro' },
                    ]}
                  />
                </div>
                <Button type="submit" variant="primary" className="w-full" loading={studentMutation.isPending}>
                  {studentMutation.isPending ? 'Guardando...' : 'Guardar perfil'}
                </Button>
              </form>
            )}

            {isCompany && (
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  companyMutation.mutate();
                }}
              >
                <Input label="Nombre de la empresa" value={companyForm.name} onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })} required />
                <Input label="Teléfono" value={companyForm.phone} onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })} required />
                <Input label="Dirección" value={companyForm.address} onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })} required />
                <Select
                  label="Municipio"
                  value={companyForm.municipalityId.toString()}
                  onChange={(e) => setCompanyForm({ ...companyForm, municipalityId: Number(e.target.value) })}
                  options={municipalitiesQuery.data?.map((m) => ({ value: m.id.toString(), label: m.name })) || []}
                />
                <Button type="submit" variant="primary" className="w-full" loading={companyMutation.isPending}>
                  {companyMutation.isPending ? 'Guardando...' : 'Guardar perfil'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}