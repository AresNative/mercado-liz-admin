import { useEffect } from "react";
import { InputFormProps } from "@/utils/constants/interfaces";
import { Phone } from "lucide-react";

export function PhoneComponent(props: InputFormProps) {
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

    const formatPhoneNumber = (value: string) => {
        if (!value) return '';
        const cleaned = value.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
        if (match) {
            return match[1] + (match[1] && match[2] ? '-' : '') + match[2] + (match[2] && match[3] ? '-' : '') + match[3];
        }
        return value;
    };

    return (
        <div className="flex flex-col">
            <label className="leading-loose flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Teléfono
            </label>
            <div className="relative flex gap-2">
                <select
                    name="countryCode"
                    className="px-2 py-2 border focus:ring-gray-500 focus:border-gray-900 sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    defaultValue="+52"
                >
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+34">+34</option>
                    <option value="+52">+52</option>
                    <option value="+81">+81</option>
                </select>
                <input
                    type="tel"
                    name="phone"
                    value={formatPhoneNumber(props.getValues?.(cuestion.name))}
                    onChange={handleInputChange}
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    placeholder="123-456-7890"
                    maxLength={12}
                    {
                    ...props.register(cuestion.name,
                        cuestion.require
                            ? { required: "The field is required." }
                            : {}
                    )
                    }
                />
            </div>
        </div>
    );
}
