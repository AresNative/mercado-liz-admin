const ReportTable = ({ reports }: any) => {
    return (
        <div className="overflow-x-auto m-5">
            <table className="min-w-full text-left">
                <thead>
                    <tr className="bg-gray-700">
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2">Nombre del Reporte</th>
                        <th className="px-4 py-2">Fecha</th>
                        <th className="px-4 py-2">Tipo</th>
                        <th className="px-4 py-2">Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.length > 0 ? (
                        reports.map((report: any) => (
                            <tr key={report.id} >
                                <td className="px-4 py-2">{report.id}</td>
                                <td className="px-4 py-2">{report.name}</td>
                                <td className="px-4 py-2">{report.date}</td>
                                <td className="px-4 py-2">{report.type}</td>
                                <td className="px-4 py-2">{report.status}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} >
                                No se encontraron reportes.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ReportTable;
