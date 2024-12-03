'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Tabs, Tab } from '@nextui-org/react';
import { Eye, EyeOff, LogIn, UserRoundPlus } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<any>();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const router = useRouter();

  const getCookieExpiration = (): string => {
    const date = new Date();
    date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000);
    return date.toUTCString();
  };

  const handleAuth = async () => {
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

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (!/[A-Z]/.test(password)) errors.push('Debe contener al menos una letra mayúscula.');
    if (!/[a-z]/.test(password)) errors.push('Debe contener al menos una letra minúscula.');
    if (!/[0-9]/.test(password)) errors.push('Debe contener al menos un número.');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('Debe contener al menos un carácter especial.');
    if (password.length < 4 || password.length > 8) errors.push('Debe tener entre 4 y 8 caracteres.');
    return errors;
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (activeTab === 'register') {
      setPasswordErrors(validatePassword(value));
    }
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md bg-gray-200 p-6 rounded-lg shadow-md flex flex-col gap-4">
        <Tabs
          aria-label="Options" key="login" onSelectionChange={setActiveTab} variant="solid">
          <Tab key="login" title={
            <div className="flex items-center space-x-2">
              <LogIn />
              <span>Iniciar sesion</span>
            </div>
          } />
          <Tab key="register" title={
            <div className="flex items-center space-x-2">
              <UserRoundPlus />
              <span>Registrar</span>
            </div>
          } />
        </Tabs>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type={isVisible ? 'text' : 'password'}
          placeholder="Password"
          value={password}
          onChange={(e) => handlePasswordChange(e.target.value)}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
              aria-label="toggle password visibility"
            >
              {isVisible ? (
                <EyeOff className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <Eye className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
        />
        {activeTab === 'register' && passwordErrors.length > 0 && (
          <ul className="text-sm text-red-500 list-disc ml-5">
            {passwordErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        )}
        {activeTab === 'register' && (
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
        <Button onClick={handleAuth} color="secondary">
          {activeTab === 'login' ? 'Login' : 'Register'}
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
