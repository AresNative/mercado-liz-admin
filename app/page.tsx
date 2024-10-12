'use client'
import ReportesScreenCompras from '@/components/func/TableCompras';
import Filters from '@/components/ui/Filters';
import Pagination from '@/components/ui/Pagination';
import ReportStates from '@/components/ui/ReportStates';
import ReportTable from '@/components/ui/ReportTable';
import Summary from '@/components/ui/Summary';
import TableExample from '@/components/ui/TableExample';
import ReportesScreen from '@/components/ui/TestTable';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

const ReportManagement = () => {
  const [reports, setReports] = useState([
    { id: 1, name: 'Reporte de Ventas Q1', date: '2023-05-15', type: 'Financiero', status: 'Completado' },
    { id: 2, name: 'Reporte de Inventario', date: '2023-05-16', type: 'Logística', status: 'En Progreso' },
    { id: 3, name: 'Campaña de Marketing Digital', date: '2023-05-17', type: 'Marketing', status: 'Pendiente' },
    { id: 4, name: 'Evaluación de Desempeño', date: '2023-05-18', type: 'RRHH', status: 'Completado' },
    { id: 5, name: 'Análisis de Gastos Operativos', date: '2023-05-19', type: 'Financiero', status: 'En Revisión' },
    // Otros reportes...
  ]);

  const [filteredReports, setFilteredReports] = useState(reports);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);


  useEffect(() => {
    let result = reports;

    if (searchTerm) {
      result = result.filter((report) =>
        report.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType) {
      result = result.filter((report) => report.type === filterType);
    }

    if (filterStatus) {
      result = result.filter((report) => report.status === filterStatus);
    }

    if (filterDate) {
      result = result.filter((report) => report.date === filterDate);
    }

    setFilteredReports(result);
  }, [searchTerm, filterType, filterStatus, filterDate, reports]);

  const summary = {
    total: reports.length,
    financiero: reports.filter((r) => r.type === 'Financiero').length,
    logistica: reports.filter((r) => r.type === 'Logística').length,
    marketing: reports.filter((r) => r.type === 'Marketing').length,
    rrhh: reports.filter((r) => r.type === 'RRHH').length,
  };

  const reportStatus = {
    completado: reports.filter((r) => r.status === 'Completado').length,
    enProgreso: reports.filter((r) => r.status === 'En Progreso').length,
    pendiente: reports.filter((r) => r.status === 'Pendiente').length,
    enRevision: reports.filter((r) => r.status === 'En Revisión').length,
  };
  // Asegurarse de que el componente se monta correctamente para evitar errores de SSR
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  return (
    <div className="p-6 min-h-screen bg-background text-text">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Reportes</h1>

        {/* Switch de Tema */}
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="bg-gray-700 text-white px-4 py-2 rounded-md"
        >
          {theme === 'light' ? '🌙 Modo Oscuro' : '☀️ Modo Claro'}
        </button>
      </div>

      {/*  <Filters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterType={filterType}
        setFilterType={setFilterType}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterDate={filterDate}
        setFilterDate={setFilterDate}
        resetFilters={() => {
          setSearchTerm('');
          setFilterType('');
          setFilterStatus('');
          setFilterDate('');
        }}
        reports={reports} // Aquí pasamos los reportes como prop
      />

      <div className="grid grid-cols-2 gap-6 mt-6 m-5">
        <Summary summary={summary} />
        <ReportStates reportStatus={reportStatus} />
      </div>
 */}
      {/* <ReportTable reports={filteredReports} /> */}
      <ReportesScreen />

      <ReportesScreenCompras />
      {/* <Pagination /> */}
    </div>
  );
};

export default ReportManagement;