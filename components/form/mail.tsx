import { useEffect, useState } from "react";
import { InputFormProps } from "@/utils/constants/interfaces";
import { AtSign } from "lucide-react";

export function MailComponent(props: InputFormProps) {
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
    };


    return (
        <div className="flex flex-col">
            <label className="leading-loose flex items-center gap-2">
                <AtSign className="w-4 h-4" />
                Email
            </label>
            <div className="relative">
                <input
                    type="email"
                    name="email"
                    onChange={handleInputChange}
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    placeholder="ejemplo@correo.com"
                    {
                    ...props.register(cuestion.name,
                        cuestion.require
                            ? { required: "The field is required." }
                            : {}
                    )
                    }
                />
                {props.errors[cuestion.name] && !props.getValues?.(cuestion.name).includes('@') && (
                    <span className="absolute right-2 top-2 text-xs text-red-500">
                        Falta @
                    </span>
                )}
            </div>
        </div>
    );
}
