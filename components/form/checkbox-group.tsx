import { Check } from "lucide-react";
import { useState } from "react";

export function CheckboxGroupComponent() {
    const [jobRequirements, setJobRequirements] = useState({
        education: false,
        experience: false,
        skills: false,
        availability: false,
    });
    const handleJobRequirementChange = (requirement: keyof typeof jobRequirements) => {
        setJobRequirements(prev => ({
            ...prev,
            [requirement]: !prev[requirement]
        }));
    };
    return (
        <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Requisitos de la vacante que cumples:</p>
            <div className="space-y-2">
                {Object.entries(jobRequirements).map(([key, value]) => (
                    <div key={key} className="flex items-center">
                        <div
                            className={`h-5 w-5 border rounded flex items-center justify-center ${value ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                                }`}
                            onClick={() => handleJobRequirementChange(key as keyof typeof jobRequirements)}
                        >
                            {value && <Check className="h-4 w-4 text-white" />}
                        </div>
                        <label htmlFor={`requirement-${key}`} className="ml-2 block text-sm text-gray-900">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    )
}