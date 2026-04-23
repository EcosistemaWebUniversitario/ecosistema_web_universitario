export const permissionsByRole: Record<string, string[]> = {
  super_admin: [
    'auth.read',
    'auth.write',
    'practicas.read',
    'practicas.write',
    'admin.all'
  ],
  admin_practicas: [
    'auth.read',
    'practicas.read',
    'practicas.write'
  ],
  admin_prelocalizacion: [
    'auth.read',
    'practicas.read',
    'practicas.write'
  ],
  estudiante: [
    'auth.read',
    'practicas.read'
  ],
  empresa: [
    'auth.read',
    'practicas.read',
    'practicas.write'
  ]
};

export const getPermissionsByRole = (roleName: string): string[] => {
  return permissionsByRole[roleName] ?? [];
};