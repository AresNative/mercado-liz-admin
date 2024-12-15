const getCookieExpiration = (): string => {
  const date = new Date();
  date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000);
  return date.toUTCString();
};
export const handleAuth = async (submitData: any) => {
  console.log(submitData);

  const { email, password } = submitData;
  const expires = `expires=${getCookieExpiration()}`;
  // Simulación de autenticación
  if (email === "admin@example.com" && password === "admin123") {
    // Set cookies para autenticación con expiración
    document.cookie = `auth-token=your_token_value; ${expires}; path=/; SameSite=Lax`;
    document.cookie = `user-role=admin; ${expires}; path=/; SameSite=Lax`;
    //router.push("/dashboard");
  } else if (email === "user@example.com" && password === "user123") {
    document.cookie = `auth-token=your_token_value; ${expires}; path=/; SameSite=Lax`;
    document.cookie = `user-role=user; ${expires}; path=/; SameSite=Lax`;
    //router.push("/dashboard");
  } else {
    alert("Credenciales inválidas");
  }
};

const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  if (!/[A-Z]/.test(password))
    errors.push("Debe contener al menos una letra mayúscula.");
  if (!/[a-z]/.test(password))
    errors.push("Debe contener al menos una letra minúscula.");
  if (!/[0-9]/.test(password)) errors.push("Debe contener al menos un número.");
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
    errors.push("Debe contener al menos un carácter especial.");
  if (password.length < 4 || password.length > 8)
    errors.push("Debe tener entre 4 y 8 caracteres.");
  return errors;
};
