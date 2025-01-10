import { CalendarRange } from "lucide-react";
import { useState } from "react";

export function DateRangeComponent() {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        birthDate: '',
        interviewDateStart: '',
        interviewDateEnd: '',
        education: '',
        experience: '',
        skills: [] as string[]
    });


    const [showInterviewDatePicker, setShowInterviewDatePicker] = useState(false);

    return (
        <div className="flex flex-col">
            <label className="leading-loose flex items-center gap-2">
                <CalendarRange className="w-4 h-4" />
                Fechas de entrevista
            </label>
            <div className="relative">
                <input
                    type="text"
                    name="interviewDates"
                    value={formData.interviewDateStart && formData.interviewDateEnd ? `${formData.interviewDateStart} - ${formData.interviewDateEnd}` : ''}
                    onClick={() => setShowInterviewDatePicker(true)}
                    readOnly
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600 cursor-pointer"
                    placeholder="Seleccionar fechas"
                />
                {showInterviewDatePicker && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                        <div className="p-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="mb-1 font-semibold">Fecha inicial</p>
                                    <input
                                        type="date"
                                        value={formData.interviewDateStart}
                                        onChange={(e) => setFormData({ ...formData, interviewDateStart: e.target.value || '' })}
                                        className="w-full px-2 py-1 border rounded-md"
                                    />
                                </div>
                                <div>
                                    <p className="mb-1 font-semibold">Fecha final</p>
                                    <input
                                        type="date"
                                        value={formData.interviewDateEnd}
                                        onChange={(e) => setFormData({ ...formData, interviewDateEnd: e.target.value || '' })}
                                        className="w-full px-2 py-1 border rounded-md"
                                    />
                                </div>
                            </div>
                            <button
                                type="button"
                                className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                onClick={() => setShowInterviewDatePicker(false)}
                            >
                                Aceptar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}