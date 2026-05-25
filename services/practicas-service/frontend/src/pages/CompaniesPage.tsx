import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { practicasAPI } from '../api/practicas.api';
import { useAuth } from '../context/AuthContext';

type Company = {
  id: number;
  name: string;
  //institution: string;
  phone: string;
  address: string;
  municipality?: {
    name: string;
  };
  profiles?: {
    id: string;
    full_name: string;
    role_id: number;
  };
};

export default function CompaniesPage() {
  const { user, setUserFromToken } = useAuth();
  const queryClient = useQueryClient();

  const { data: companyData, isLoading } = useQuery<Company>({
    queryKey: ['company-me'],
    queryFn: async () => {
      const res = await practicasAPI.getMyCompany();
      return res.data.data;
    },
  });

  const [name, setName] = useState('');
  //const [institution, setInstitution] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (companyData) {
      setName(companyData.name || '');
      //setInstitution(companyData.institution || '');
      setPhone(companyData.phone || '');
      setAddress(companyData.address || '');
    }
  }, [companyData]);

  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      const res = await practicasAPI.updateCompanyProfile({
        name,
        //institution,
        phone,
        address,
      });
      return res.data.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['company-me'] });
      await setUserFromToken();
    },
  });

  if (isLoading) {
    return <p className="p-6">Cargando...</p>;
  }

  if (!companyData || !user) {
    return <p className="p-6">No se pudo cargar el perfil.</p>;
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">Mi empresa</h1>
        <p className="mt-2 text-sm text-slate-600">
          Aquí puedes revisar y actualizar los datos de tu empresa.
        </p>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        {/* Columna izquierda: Datos de la empresa */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Datos de la empresa</h2>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Nombre de la empresa</label>
            <input
              className="w-full rounded-lg border border-slate-300 px-4 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Teléfono</label>
            <input
              className="w-full rounded-lg border border-slate-300 px-4 py-2"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Dirección</label>
            <input
              className="w-full rounded-lg border border-slate-300 px-4 py-2"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="space-y-2 text-sm text-slate-600">
            <p><strong>Municipio:</strong> {companyData.municipality?.name || '-'}</p>
          </div>

          <button
            onClick={() => updateProfileMutation.mutate()}
            className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white"
          >
            Guardar cambios
          </button>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Información de autenticación</h2>
          <p className="text-sm text-slate-600">
            La contraseña y los datos de cuenta se gestionan en el servicio central de autenticación.
          </p>
        </div>
      </section>
    </div>
  );
}