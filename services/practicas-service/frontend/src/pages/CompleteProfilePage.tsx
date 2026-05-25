import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/base/Button';
import { Input } from '../components/base/Input';
import { Select } from '../components/base/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

type Career = { id: number; name: string };
type Municipality = { id: number; name: string };

export default function CompleteProfilePage() {
  const { user, setUserFromToken , role } = useAuth();
  const navigate = useNavigate();

  const isStudent = role === 'estudiante';
  const isCompany = role === 'empresa';

  const careersQuery = useQuery<Career[]>({
    queryKey: ['careers'],
    queryFn: async () => {
      const res = await api.get('/careers');
      return res.data.data ?? res.data;
    },
    enabled: isStudent,
  });

  const municipalitiesQuery = useQuery<Municipality[]>({
    queryKey: ['municipalities'],
    queryFn: async () => {
      const res = await api.get('/municipalities');
      return res.data.data ?? res.data;
    },
  });

  const [studentForm, setStudentForm] = useState({
    firstName: '',
    lastName: '',
    ci: '',
    sex: 'M',
    academicYear: 3,
    careerId: 1,
    municipalityId: 1,
  });

  const [companyForm, setCompanyForm] = useState({
    name: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (role === 'estudiante') {
      setStudentForm((prev) => ({
        ...prev,
        careerId: careersQuery.data?.[0]?.id ?? 1,
        municipalityId: municipalitiesQuery.data?.[0]?.id ?? 1,
      }));
    }

    if (role === 'empresa') {
      setCompanyForm((prev) => ({
        ...prev,
      }));
    }
  }, [role, careersQuery.data, municipalitiesQuery.data]);

  const studentMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/students/profile', studentForm);
      return res.data.data ?? res.data;
    },
    onSuccess: async () => {
      await setUserFromToken();
      navigate('/dashboard');
    },
  });

  const companyMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/companies/profile', companyForm);
      return res.data.data ?? res.data;
    },
    onSuccess: async () => {
      await setUserFromToken();
      navigate('/dashboard');
    },
  });

  if (!user) {
    return <div className="p-6">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-8">
        {/* Branding Header */}
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

        {/* Complete Profile Form */}
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
                label="Nombre"
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
                label="Sexo"
                value={studentForm.sex}
                onChange={(e) =>
                  setStudentForm({ ...studentForm, sex: e.target.value })
                }
                options={[
                  { value: 'M', label: 'Masculino' },
                  { value: 'F', label: 'Femenino' },
                ]}
              />

              <Select
                label="Año académico"
                value={studentForm.academicYear.toString()}
                onChange={(e) =>
                  setStudentForm({
                    ...studentForm,
                    academicYear: Number(e.target.value),
                  })
                }
                options={[
                  { value: '3', label: '3er año' },
                  { value: '4', label: '4to año' },
                ]}
              />

              <Select
                label="Carrera"
                value={studentForm.careerId.toString()}
                onChange={(e) =>
                  setStudentForm({
                    ...studentForm,
                    careerId: Number(e.target.value),
                  })
                }
                options={careersQuery.data?.map((career) => ({
                  value: career.id.toString(),
                  label: career.name,
                })) || []}
              />

              <Select
                label="Municipio"
                value={studentForm.municipalityId.toString()}
                onChange={(e) =>
                  setStudentForm({
                    ...studentForm,
                    municipalityId: Number(e.target.value),
                  })
                }
                options={municipalitiesQuery.data?.map((m) => ({
                  value: m.id.toString(),
                  label: m.name,
                })) || []}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={studentMutation.isPending}
            >
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
            <Input
              label="Nombre de la empresa"
              value={companyForm.name}
              onChange={(e) =>
                setCompanyForm({ ...companyForm, name: e.target.value })
              }
              required
            />

            <Input
              label="Teléfono"
              value={companyForm.phone}
              onChange={(e) =>
                setCompanyForm({ ...companyForm, phone: e.target.value })
              }
              required
            />

            <Input
              label="Dirección"
              value={companyForm.address}
              onChange={(e) =>
                setCompanyForm({ ...companyForm, address: e.target.value })
              }
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={companyMutation.isPending}
            >
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