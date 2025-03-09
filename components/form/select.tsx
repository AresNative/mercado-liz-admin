import { useEffect, useRef, useState } from "react";
import { SearchableSelectProps } from "@/utils/constants/interfaces";
import { ChevronDown, Star, X } from 'lucide-react';
import Badge from "../badge";
import { triggerFormSubmit } from "@/utils/functions/form-active";
import { useAppDispatch } from "@/hooks/selector";
import { dataFilter } from "@/hooks/reducers/filter";

export function SelectComponent(props: SearchableSelectProps) {
    const { cuestion } = props;
    const dispatch = useAppDispatch();
    const skillsRef = useRef<HTMLDivElement>(null);

    const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState<{
        skills: string[]
    }>({
        skills: []
    });

    const handleSkillToggle = (skill: string) => {
        if (cuestion.multi === false) {
            setFormData({ skills: [skill] });
            setShowSkillsDropdown(false);
        } else {
            setFormData(prev => ({
                ...prev,
                skills: prev.skills.includes(skill)
                    ? prev.skills.filter(s => s !== skill)
                    : [...prev.skills, skill]
            }));
        }
        if (cuestion.name === "columnas") {
            dispatch(dataFilter({ key: "key", value: skill, type: "form" }));
            triggerFormSubmit();
        }
    };

    const handleRemoveSkill = (skill: string) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(s => s !== skill)
        }));
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (skillsRef.current && !skillsRef.current.contains(e.target as Node)) {
                setShowSkillsDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        props.setValue(cuestion.name, cuestion.multi ? formData.skills.join(', ') : formData.skills[0] || '');
    }, [formData.skills, cuestion.multi, cuestion.name, props]);

    useEffect(() => {
        // Prepara el valor a setear: si es multi, lo junta en un string, de lo contrario toma el primer elemento
        const value = cuestion.multi
            ? formData.skills.join(", ")
            : formData.skills[0] || "";
        props.setValue(cuestion.name, value);

        // Valida el campo. Si se definió que es requerido y el valor está vacío,
        // se dispara el setError. De lo contrario se limpian los errores.
        if (cuestion.require && !value) {
            props.setError(cuestion.name, {
                type: "required",
                message: "Este campo es obligatorio.",
            });
        } else {
            props.clearErrors(cuestion.name);
        }
    }, [
        formData.skills,
    ]);
    return (
        <div className="flex flex-col" ref={skillsRef}>
            <label className="leading-loose flex items-center gap-2">
                <Star className="w-4 h-4" />
                {cuestion.label}
            </label>
            <div className="relative bg-white">
                <div
                    className="px-4 py-2 border focus:ring-purple-500 focus:border-purple-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600 cursor-pointer flex items-center justify-between"
                    onClick={() => setShowSkillsDropdown(!showSkillsDropdown)}
                >
                    <span>
                        {formData.skills.length
                            ? (cuestion.multi
                                ? `${formData.skills.length} seleccionadas`
                                : formData.skills[0])
                            : `Seleccionar ${cuestion.name}`}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                </div>
                {showSkillsDropdown && (
                    <div className="absolute z-30 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg">
                        <div className="p-2">
                            <input
                                type="text"
                                className="w-full px-3 py-2 border rounded-md"
                                placeholder={`Buscar ${cuestion.name}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <ul className="max-h-60 overflow-y-auto">
                            {cuestion.options && cuestion.options
                                .filter((skill: any) => {
                                    const searchText = typeof skill === 'object' && skill !== null
                                        ? skill.label
                                        : skill.toString();
                                    return searchText.toLowerCase().includes(searchTerm.toLowerCase());
                                })
                                .map((skill: any) => {
                                    const isObject = typeof skill === 'object' && skill !== null;
                                    const value = isObject ? skill.value.toString() : skill.toString();
                                    const label = isObject ? skill.label : skill.toString();

                                    return (
                                        <li
                                            key={value}
                                            className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.skills.includes(value) ? 'bg-blue-100' : ''
                                                }`}
                                            onClick={() => handleSkillToggle(value)}
                                        >
                                            {label}
                                        </li>
                                    );
                                })}
                        </ul>
                    </div>
                )}
            </div>
            {cuestion.multi && (
                <div className="flex flex-wrap gap-2 mt-2 ">
                    {formData.skills.map(skill => (
                        <div key={skill}>
                            <Badge text={skill} color="purple" />
                            <button
                                type="button"
                                onClick={() => handleRemoveSkill(skill)}
                                className="ml-1 text-blue-600 hover:text-blue-800"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
            {props.errors[cuestion.name] && props.errors[cuestion.name]?.message && (
                <span className="text-red-400 p-1">
                    {props.errors[cuestion.name]?.message}
                </span>
            )}
        </div>
    );
}

