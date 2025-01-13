import { useEffect, useRef, useState } from "react";
import { InputFormProps } from "@/utils/constants/interfaces";
import { ChevronDown, Star, X } from "lucide-react";
import Badge from "../badge";
const skills = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'Ruby', 'PHP',
    'HTML', 'CSS', 'TypeScript', 'Angular', 'Vue.js', 'Django', 'Flask',
    'Express.js', 'MongoDB', 'SQL', 'Git', 'Docker', 'AWS', 'Azure', 'GraphQL',
    'REST API', 'Machine Learning', 'Data Analysis', 'Agile', 'Scrum'
];

export function SelectComponent(props: InputFormProps) {
    const { cuestion } = props;
    const skillsRef = useRef<HTMLDivElement>(null);

    const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        skills: [] as string[]
    });

    const handleSkillToggle = (skill: string) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.includes(skill)
                ? prev.skills.filter(s => s !== skill)
                : [...prev.skills, skill]
        }));
    };
    const handleRemoveSkill = (skill: string) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(s => s !== skill)
        }));
    };

    return (
        <div className="flex flex-col" ref={skillsRef}>
            <label className="leading-loose flex items-center gap-2">
                <Star className="w-4 h-4" />
                Habilidades
            </label>
            <div className="relative">
                <div
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600 cursor-pointer flex items-center justify-between"
                    onClick={() => setShowSkillsDropdown(!showSkillsDropdown)}
                >
                    <span>{formData.skills.length ? `${formData.skills.length} seleccionadas` : 'Seleccionar habilidades'}</span>
                    <ChevronDown className="w-4 h-4" />
                </div>
                {showSkillsDropdown && (
                    <div className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg">
                        <div className="p-2">
                            <input
                                type="text"
                                className="w-full px-3 py-2 border rounded-md"
                                placeholder="Buscar habilidades..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <ul className="max-h-60 overflow-y-auto">
                            {skills
                                .filter(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map(skill => (
                                    <li
                                        key={skill}
                                        className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.skills.includes(skill) ? 'bg-blue-100' : ''
                                            }`}
                                        onClick={() => handleSkillToggle(skill)}
                                    >
                                        {skill}
                                    </li>
                                ))}
                        </ul>
                    </div>
                )}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
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
