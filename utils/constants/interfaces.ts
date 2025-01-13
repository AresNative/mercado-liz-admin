export interface Field {
  type: string;
  name: string;
  labell?: string;
  placeholder?: string;
  label?: string;
  // Puedes agregar otros campos según tu necesidad
}

export interface MainFormProps {
  message_button: string;
  dataForm: Field[];
  actionType: "add-project" | "add-sprints" | "add-task";
}

export interface ChecboxFormProps {
  cuestion: {
    name: string;
    placeholder?: string;
    label?: string;
    require: boolean;
    options: string[];
  };
  control: any;
  setValue: (name: string, value: boolean) => Promise<void>;
  register: (name: string, options: { required?: string }) => void;
  setError: (name: string, error: object) => void;
  watch: (name: string) => string;
  errors: Record<string, { message?: string } | undefined>;
}

export interface DateRangeInputProps {
  cuestion: {
    name: string;
    placeholder?: string;
    label?: string;
    require: boolean;
  };
  control: any; // Replace with the actual type from react-hook-form
  setValue: (name: string, value: string) => void;
  setError: (name: string, error: object) => void;
  errors: Record<string, { message?: string } | undefined>;
}

export interface InputFormProps {
  cuestion: {
    name: string;
    placeholder?: string;
    label?: string;
    valueDefined?: string | any;
    require: boolean;
    type: "password" | "number" | "email" | "phone" | "text";
    icon?: React.ElementType<any>;
    maxLength?: number;
  };
  watch: (name: string) => string;
  getValues: (name: string) => string;
  setValue: (name: string, value: string) => void;
  setError: (name: string, error: object) => void;
  register: (name: string, options: { required?: string }) => object;
  errors: Record<string, { message?: string } | undefined>;
}

export interface InputMediaProps {
  cuestion: {
    name: string;
    placeholder?: string;
    label?: string;
    require?: boolean;
    accept?: string; // Allowed file types
    multiple?: boolean;
  };
  setValue: (name: string, value: File | File[] | null) => void;
  register: (name: string, options: { required?: string }) => object;
  errors: Record<string, { message?: string } | undefined>;
}

export interface SearchableSelectProps {
  cuestion: {
    name: string;
    placeholder?: string;
    label?: string;
    require?: boolean;
    options: { value: string; labell: string }[];
    valueDefined?: { name: string };
    enableAutocomplete?: boolean;
  };
  setValue: (name: string, value: string) => void;
  register: (
    name: string,
    options: Record<string, unknown>
  ) => Record<string, unknown>;
  errors: Record<string, { message?: string } | undefined>;
}

export interface ButtonProps {
  type?: "button" | "submit" | "reset";
  label?: string;
  size?: string;
  color?: "success" | "error" | "warning" | "completed" | "info";
}

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
