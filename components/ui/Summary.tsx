const Summary = ({ summary }: any) => {
    return (
        <div className="card p-4 rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4">Resumen</h2>
            <p>Total de Reportes: {summary.total}</p>
            <ul className="flex items-center space-x-4 relative">
                <li>Financiero: {summary.financiero}</li>
                <li>Logística: {summary.logistica}</li>
                <li>Marketing: {summary.marketing}</li>
                <li>RRHH: {summary.rrhh}</li>
            </ul>
        </div>
    );
};

export default Summary;
