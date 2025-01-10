import { validateName, validatePhone, validateEmail } from "@/utils/functions/valid-inputs";
import { Briefcase } from "lucide-react";
import { useState } from "react";

export function TextAreaComponent() {

    const [formData, setFormData] = useState({
        experience: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        // Validation checks
        if (name === 'name' && !validateName(value)) return;
        if (name === 'phone' && !validatePhone(value)) return;
        if (name === 'email' && !validateEmail(value)) return;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    return (
        <div className="flex flex-col">
            <label className="leading-loose flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Experiencia laboral
            </label>
            <div className="relative">
                <textarea
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    placeholder="Experiencia laboral"
                    rows={3}
                    maxLength={1000}
                />
                <span className="absolute right-2 bottom-2 text-xs text-gray-400">
                    {formData.experience.length}/1000
                </span>
            </div>
        </div>
    )
}