"use client"
import { SearchableSelectProps } from "@/utils/constants/interfaces";
import { Search, Star, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Badge from "../badge";
import { searchData } from "@/hooks/reducers/filter";
import { useAppDispatch } from "@/hooks/selector";
import { triggerFormSubmit } from "@/utils/functions/form-active";

export function SearchComponent(props: SearchableSelectProps) {
    const { cuestion } = props;

    const dispatch = useAppDispatch();
    const skillsRef = useRef<HTMLDivElement>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);
    const [formData, setFormData] = useState<{
        skills: string[]
    }>({
        skills: []
    });

    // Ajuste en la función para simular "Enter" al seleccionar un elemento
    const handleSkillToggle = (skill: string) => {
        if (cuestion.saveData) {
            if (skill.trim() !== "") {
                setFormData(prev => ({
                    ...prev,
                    skills: [...prev.skills, skill.trim()]
                }));
                setSearchTerm('');
            }
        } else {
            setSearchTerm(skill);
        };
        setShowSkillsDropdown(false);
        if (cuestion.options) dispatch(searchData(formData.skills.join(', ')));
        triggerFormSubmit();
    };
    const handleRemoveSkill = (skill: string) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(s => s !== skill)
        }));
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            if (cuestion.saveData && searchTerm.trim() !== "") {
                setFormData(prev => ({
                    ...prev,
                    skills: [...prev.skills, searchTerm.trim()]
                }));
                setSearchTerm("");
            }
            setShowSkillsDropdown(false);
            triggerFormSubmit();
        }
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
        if (cuestion.saveData && formData.skills.length) {
            props.setValue(cuestion.name, formData.skills.join(', '));
            return;
        }
        props.setValue(cuestion.name, searchTerm);
    }, [cuestion.multi, cuestion.name, props, searchTerm, cuestion.saveData, formData, formData.skills]);

    return (
        <div className="flex flex-col relative" ref={skillsRef}>
            <label className="leading-loose flex items-center gap-2">
                <Star className="w-4 h-4" />
                {cuestion.label}
            </label>
            <div className="relative flex-1">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                    type="text"
                    placeholder={cuestion.placeholder}
                    value={searchTerm}
                    className="py-2 pl-10 w-full rounded-md focus:outline-none border focus:ring-purple-500 focus:border-purple-900 border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500"
                    onClick={() => setShowSkillsDropdown(true)}
                    onChange={(e) => {
                        if (cuestion.options) dispatch(searchData(e.target.value));
                        setSearchTerm(e.target.value);
                        setShowSkillsDropdown(true);
                    }}
                    onKeyDown={handleKeyDown}
                />
            </div>
            {cuestion.options && showSkillsDropdown && (
                <div className="absolute z-30 top-[4.6rem] w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg">
                    <div className="p-2">
                        <ul className="max-h-60 overflow-y-auto">
                            {cuestion.options
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
                                            className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${searchTerm ? 'bg-blue-100' : ''}`}
                                            onClick={() => handleSkillToggle(value)}
                                        >
                                            {label}
                                        </li>
                                    );
                                })}
                        </ul>
                    </div>
                </div>
            )}

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
        </div>
    );
}
