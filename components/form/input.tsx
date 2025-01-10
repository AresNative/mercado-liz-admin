import { useEffect, useState } from "react";
import { InputFormProps } from "@/utils/constants/interfaces";
import { User } from "lucide-react";

export function InputComponent(props: InputFormProps) {
  const { cuestion } = props;

  useEffect(() => {
    if (cuestion.valueDefined) {
      props.setValue(cuestion.name, cuestion.valueDefined);
    }
  }, [cuestion.valueDefined, cuestion.name, props]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    props.setError(cuestion.name, {});
    props.setValue(cuestion.name, value);
    setFormData({ ...formData, [cuestion.name]: value });
  };

  const [formData, setFormData] = useState({
    name: '',
  });

  return (
    <div className="flex flex-col">
      <label className="leading-loose flex items-center gap-2">
        <User className="w-4 h-4" />
        Nombre completo
      </label>
      <div className="relative">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
          placeholder="Juan Pérez"
          maxLength={50}
        />
        <span className="absolute right-2 top-2 text-xs text-gray-400">
          {formData.name.length}/50
        </span>
      </div>
    </div>
  );
}
