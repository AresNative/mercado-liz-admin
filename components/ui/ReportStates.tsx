const ReportStates = ({ reportStatus }: any) => {
    return (
        <div className="card p-4 rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4">Estados de Reportes</h2>
            <ul className="flex items-center space-x-4 relative">
                <li>Completado: {reportStatus.completado}</li>
                <li>En Progreso: {reportStatus.enProgreso}</li>
                <li>Pendiente: {reportStatus.pendiente}</li>
                <li>En Revisión: {reportStatus.enRevision}</li>
            </ul>
        </div>
    );
};

export default ReportStates;
