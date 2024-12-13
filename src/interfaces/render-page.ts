export interface UserRoleRendererProps {
  user: React.ReactNode; // Renderizado cuando el rol es "user"
  admin: React.ReactNode; // Renderizado cuando el rol es "admin"
  fallback: React.ReactNode; // Renderizado cuando el rol no es reconocido
  role: string | null; // El rol del usuario, puede ser "admin", "user", "none", o null
  loadingRole: boolean; // Indicador de si se está cargando el rol
  error: string | null; // Error al obtener el rol
}
export interface DashboardLayoutProps {
  admin: React.ReactNode;
  user: React.ReactNode;
}
