'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  // Función para establecer la fecha de expiración en 7 días
  const getCookieExpiration = () => {
    const date = new Date();
    date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 días en milisegundos
    return date.toUTCString();
  };

  const handleLogin = async () => {
    const expires = `expires=${getCookieExpiration()}`;

    // Simulación de autenticación
    if (email === 'admin@example.com' && password === 'admin123') {
      // Set cookies para autenticación con expiración
      document.cookie = `auth-token=your_token_value; ${expires}; path=/; SameSite=Lax`;
      document.cookie = `user-role=admin; ${expires}; path=/; SameSite=Lax`;
      router.push('/dashboard');
    } else if (email === 'user@example.com' && password === 'user123') {
      document.cookie = `auth-token=your_token_value; ${expires}; path=/; SameSite=Lax`;
      document.cookie = `user-role=user; ${expires}; path=/; SameSite=Lax`;
      router.push('/dashboard');
    } else {
      alert('Credenciales inválidas');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginPage;
