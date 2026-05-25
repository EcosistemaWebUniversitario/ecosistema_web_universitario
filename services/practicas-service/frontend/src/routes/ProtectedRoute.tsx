import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const { user, loading , role} = useAuth();
  console.log('🛡️ [ProtectedRoute] user:', user);
  console.log('🛡️ [ProtectedRoute] loading:', loading);
  console.log('🛡️ [ProtectedRoute] role:', role);

  if (loading) {
    return <div className="p-6">Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role??'')) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}