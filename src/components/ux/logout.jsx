'use client';
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';

const Logout = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Eliminar cookies estableciendo fechas de expiración pasadas
    document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'user-role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    // Redirigir al usuario a la página de inicio de sesión u otra página
    router.push('/');
  };

  return (
    <Button onClick={handleLogout}>Cerrar Sesión</Button>
  );
};

export default Logout;
