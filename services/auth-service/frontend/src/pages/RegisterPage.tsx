import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/base/Button';
import { Input } from '../components/base/Input';
import { Select } from '../components/base/Select';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [accountType, setAccountType] = useState<'estudiante' | 'empresa'>('estudiante');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      await register({
        full_name: fullName,
        email,
        password,
        account_type: accountType,
      });
      navigate('/complete-profile', { replace: true });
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'No se pudo registrar la cuenta.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Estilo local para forzar etiquetas y campos legibles */}
      <style>{`
        #register-form-container label {
          color: white !important;
        }
        #register-form-container input,
        #register-form-container select {
          background-color: rgba(15, 23, 42, 0.8) !important;
          color: white !important;
          border-color: rgba(255, 255, 255, 0.15) !important;
        }
        #register-form-container input::placeholder {
          color: rgba(255, 255, 255, 0.4) !important;
        }
      `}</style>

      <div className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* Logo y título */}
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-lg font-black text-white">
                  U
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                    Universidad de Las Tunas
                  </p>
                  <h1 className="text-lg font-bold text-white">
                    Ecosistema Web Universitario
                  </h1>
                </div>
              </div>
              <h2 className="mt-6 text-3xl font-black tracking-tight text-white">
                Crear cuenta
              </h2>
              <p className="mt-2 text-white/70">
                Regístrate para acceder al ecosistema universitario
              </p>
            </div>

            {/* Tarjeta de registro con estilo glassmorphism */}
            <div
              id="register-form-container"
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-red-500/5" />

              <div className="relative">
                {error && (
                  <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200 backdrop-blur">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="Nombre completo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej: Juan Pérez"
                    required
                    className="bg-slate-900/50 border-white/10 text-white placeholder:text-white/40 focus:border-emerald-500 focus:ring-emerald-500/20"
                  />

                  <Input
                    label="Correo electrónico"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@dominio.com"
                    required
                    className="bg-slate-900/50 border-white/10 text-white placeholder:text-white/40 focus:border-emerald-500 focus:ring-emerald-500/20"
                  />

                  <Select
                    label="Tipo de cuenta"
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value as 'estudiante' | 'empresa')}
                    options={[
                      { value: 'estudiante', label: 'Estudiante' },
                      { value: 'empresa', label: 'Empresa' },
                    ]}
                    className="bg-slate-900/50 border-white/10 text-white focus:border-emerald-500 focus:ring-emerald-500/20"
                  />

                  <Input
                    label="Contraseña"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="bg-slate-900/50 border-white/10 text-white placeholder:text-white/40 focus:border-emerald-500 focus:ring-emerald-500/20"
                  />

                  <Input
                    label="Confirmar contraseña"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="bg-slate-900/50 border-white/10 text-white placeholder:text-white/40 focus:border-emerald-500 focus:ring-emerald-500/20"
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                    className="w-full rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400"
                  >
                    {loading ? 'Registrando...' : 'Crear cuenta'}
                  </Button>
                </form>

                <div className="mt-6 text-center text-sm text-white/60">
                  ¿Ya tienes cuenta?{' '}
                  <Link
                    to="/login"
                    className="font-semibold text-emerald-400 transition hover:text-emerald-300"
                  >
                    Inicia sesión aquí
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}