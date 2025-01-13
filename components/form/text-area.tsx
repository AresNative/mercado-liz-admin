import { InputFormProps } from "@/utils/constants/interfaces";
import { Briefcase } from "lucide-react";

export function TextAreaComponent(props: InputFormProps) {
    const { cuestion } = props;
    const currentValue = props.watch(cuestion.name) || "";

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { value } = e.target;

        props.setValue(cuestion.name, value);
    };
    return (
        <div className="flex flex-col">
            <label className="leading-loose flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                {cuestion.label}
            </label>
            <div className="relative">
                <textarea
                    name="experience"
                    onChange={handleInputChange}
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    placeholder={cuestion.placeholder}
                    rows={3}
                    maxLength={cuestion.maxLength}
                    {...props.register(cuestion.name,
                        cuestion.require
                            ? { required: "El campo es obligatorio." }
                            : {}
                    )}
                />
                {cuestion.maxLength && (<span className="absolute right-2 bottom-2 text-xs text-gray-400">
                    {currentValue.length}/{cuestion.maxLength}
                </span>)}
            </div>
            {props.errors[cuestion.name] && props.errors[cuestion.name]?.message && (
                <span className="text-red-400 p-1">
                    {props.errors[cuestion.name]?.message}
                </span>
            )}
        </div>
    )
}