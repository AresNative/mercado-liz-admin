import * as XLSX from 'xlsx';

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
export const exportToExcel = (data: any[], fileName: string = 'data.xlsx') => {
  // 1. Crear una hoja de trabajo a partir de los datos
  const worksheet = XLSX.utils.json_to_sheet(data);

  // 2. Crear un libro de trabajo y agregar la hoja
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // 3. Generar archivo Excel y descargarlo
  XLSX.writeFile(workbook, fileName);
};

export const exportToPDF = (columns: string[], data: any[]) => {
  const doc = new jsPDF();

  // Título del PDF
  doc.text('Reporte de Tabla Dinámica', 20, 20);

  // Generar la tabla usando autoTable
  autoTable(doc, {
    head: [columns],
    body: data,
    startY: 30,
  });

  // Guardar el archivo PDF
  doc.save('tabla_dinamica.pdf');
};
