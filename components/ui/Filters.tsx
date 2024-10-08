import { Download } from 'lucide-react';
import { useState } from 'react';

const Filters = ({
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filterStatus,
    setFilterStatus,
    filterDate,
    setFilterDate,
    resetFilters,
    reports, // Añadimos reports como prop para obtener las sugerencias
}: any) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleSearchChange = (e: any) => {
        const value = e.target.value;
        setSearchTerm(value);

        // Mostrar sugerencias si hay texto
        if (value) {
            const filteredSuggestions = reports.filter((report: any) =>
                report.name.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion: any) => {
        setSearchTerm(suggestion.name);
        setShowSuggestions(false); // Ocultamos las sugerencias al seleccionar una
    };

    return (
        <div className="relative flex items-center justify-between p-4 rounded-md">
            <div className="flex items-center space-x-4 relative">
                <div className="relative">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Buscar reportes..."
                        className="p-2 w-full md:w-64 rounded-md border"
                    />

                    {/* Dropdown de sugerencias */}
                    {showSuggestions && suggestions.length > 0 && (
                        <ul className="absolute z-10 bg-gray-700 mt-1 rounded-md shadow-lg w-full max-h-40 overflow-y-auto">
                            {suggestions.map((suggestion: any) => (
                                <li
                                    key={suggestion.id}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-white"
                                >
                                    {suggestion.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2  rounded-md"
                >
                    <option value="">Tipos de Reporte</option>
                    <option value="Financiero">Financiero</option>
                    <option value="Logística">Logística</option>
                    <option value="Marketing">Marketing</option>
                    <option value="RRHH">RRHH</option>
                </select>

                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2  rounded-md"
                >
                    <option value="">Estados</option>
                    <option value="Completado">Completado</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="En Progreso">En Progreso</option>
                    <option value="En Revisión">En Revisión</option>
                </select>

                <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="px-4 py-2  rounded-md"
                />
            </div>

            <div className="flex space-x-4">
                <button
                    onClick={resetFilters}
                    className="px-4 py-2  rounded-md"
                >
                    Limpiar filtros
                </button>
                <button className="px-4 py-2 bg-blue-600 rounded-md"
                    /*
                    !ajustar funcionalidad download
                    onClick={exportarCSV} startContent={<Download size={18} />} 
                    */>
                    Exportar CSV
                </button>
            </div>
        </div>
    );
};

export default Filters;
