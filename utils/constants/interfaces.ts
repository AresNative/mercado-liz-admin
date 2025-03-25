import { alertClasses } from "./colors";

export type FieldType =
  | "Flex"
  | "INPUT"
  | "PASSWORD"
  | "PHONE"
  | "TEXT_AREA"
  | "MAIL"
  | "DATE"
  | "DATE_RANGE"
  | "CHECKBOX"
  | "CHECKBOX_GROUP"
  | "SELECT"
  | "FILE"
  | "IMG"
  | "SEARCH"
  | "LINK"
  | "TAG_INPUT";

export interface SelectOption {
  value: string;
  label: string;
}

export interface BaseField {
  id?: number;
  name?: string;
  label?: string;
  placeholder?: string;
  require: boolean;
  valueDefined?: unknown;
}

export interface FlexField extends BaseField {
  type: "Flex";
  elements: Field[];
}

export interface InputField extends BaseField {
  type: "INPUT";
  maxLength?: number;
  pattern?: string;
  minLength?: number;
}

export interface PasswordField extends BaseField {
  type: "PASSWORD";
  minLength?: number;
  pattern?: string;
}

export interface PhoneField extends BaseField {
  type: "PHONE";
  pattern?: string;
}

export interface TextAreaField extends BaseField {
  type: "TEXT_AREA";
  maxLength?: number;
  minLength?: number;
  rows?: number;
}

export interface MailField extends BaseField {
  type: "MAIL";
  pattern?: string;
}

export interface DateField extends BaseField {
  type: "DATE";
  min?: string;
  max?: string;
}

export interface DateRangeField extends BaseField {
  type: "DATE_RANGE";
  multiple?: boolean;
}

export interface CheckboxField extends BaseField {
  type: "CHECKBOX";
}

export interface CheckboxGroupField extends BaseField {
  type: "CHECKBOX_GROUP";
  options: string[];
}

export interface SelectField extends BaseField {
  type: "SELECT";
  options: string[] | SelectOption[];
  multi?: boolean;
  valueDefined?: unknown;
  enableAutocomplete?: string;
}

export interface FileField extends BaseField {
  type: "FILE";
  accept?: string;
  multiple?: boolean;
}

export interface ImageField extends BaseField {
  type: "IMG";
  accept?: string;
}

export interface SearchField extends BaseField {
  type: "SEARCH";
  options?: string[];
  multi?: boolean;
  saveData?: boolean;
}

export interface LinkField extends BaseField {
  type: "LINK";
  href: string;
}

export interface TagInputField extends BaseField {
  type: "TAG_INPUT";
  suggestions?: string[];
}

export type Field =
  | FlexField
  | InputField
  | PasswordField
  | PhoneField
  | TextAreaField
  | MailField
  | DateField
  | DateRangeField
  | CheckboxField
  | CheckboxGroupField
  | SelectField
  | FileField
  | ImageField
  | SearchField
  | LinkField
  | TagInputField;

export interface FormError {
  message?: string;
}

export interface FormErrors {
  [key: string]: FormError | undefined;
}

export interface BaseFormProps {
  handleSubmit: () => void;
  setError: (name: string, error: object) => void;
  clearErrors: (name: string) => void;
  errors: FormErrors;
}

export interface MainFormProps {
  message_button: string;
  actionType: string;
  dataForm: Field[];
  aditionalData?: Record<string, unknown>;
  valueAssign?: string | string[];
  action?: (...args: any[]) => any;
  onSuccess?: (result: unknown, formData: Record<string, unknown>) => void;
}

export interface ChecboxFormProps extends BaseFormProps {
  cuestion: CheckboxGroupField;
  control: unknown;
  setValue: (name: string, value: boolean) => Promise<void>;
  register: (name: string, options: { required?: string }) => object;
  watch: (name: string) => string;
}

export interface DateRangeInputProps extends BaseFormProps {
  cuestion: DateRangeField;
  control: unknown;
  setValue: (name: string, value: string) => void;
}

export interface InputFormProps extends BaseFormProps {
  cuestion: Field;
  watch: (name: string) => string;
  getValues: (name: string) => string;
  setValue: (name: string, value: string) => void;
  register: (name: string, options: { required?: string }) => object;
}

export interface InputMediaProps extends BaseFormProps {
  cuestion: FileField | ImageField;
  setValue: (name: string, value: File | File[] | null) => void;
  register: (name: string, options: { required?: string }) => object;
}

export interface SearchableSelectProps extends BaseFormProps {
  cuestion: SearchField;
  setValue: (name: string, value: string) => void;
  register: (
    name: string,
    options: Record<string, unknown>
  ) => Record<string, unknown>;
}

export interface ButtonProps {
  type?: "button" | "submit" | "reset";
  label?: string;
  size?: "small" | "medium" | "large";
  color?: keyof typeof alertClasses;
  children?: React.ReactNode;
  disabled?: boolean;
  onClick?: (...args: unknown[]) => unknown;
}

export interface UserRoleRendererProps {
  user: React.ReactNode;
  admin: React.ReactNode;
  fallback: React.ReactNode;
  role: string | null;
  loadingRole: boolean;
  error: string | null;
}

export interface DashboardLayoutProps {
  admin: React.ReactNode;
  user: React.ReactNode;
}
