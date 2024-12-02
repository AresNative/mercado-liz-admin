import * as XLSX from 'xlsx';

export const exportToExcel = (data: any[], fileName: string = 'data.xlsx') => {
  // 1. Crear una hoja de trabajo a partir de los datos
  const worksheet = XLSX.utils.json_to_sheet(data);

  // 2. Crear un libro de trabajo y agregar la hoja
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // 3. Generar archivo Excel y descargarlo
  XLSX.writeFile(workbook, fileName);
};

import 'jspdf-autotable';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToPDF = (columns: string[], data: any[]) => {
  const doc = new jsPDF({
    orientation: "landscape", // "portrait" o "landscape"
    unit: "mm",               // Unidad de medida: "mm", "pt", "cm", etc.
    format: "a4",             // Tamaño de página: "a4", "letter", "legal", etc.
  });
  console.log(columns, data);
  // Mapea los datos con las cabeceras correctas
  const tableData = data.map((row) =>
    columns.map((header) => row[header] || "")
  );
  // Título del PDF
  doc.text('Reporte de Tabla Dinámica', 10, 10);

  // Generar la tabla usando autoTable
  autoTable(doc, {
    head: [columns],
    body: tableData,
    startY: 20, // Define la posición vertical inicial
    margin: { top: 20, left: 10, right: 10, bottom: 20 }, // Márgenes personalizados
    theme: "grid", // Opciones: "striped", "grid", "plain"
    styles: {
      fontSize: 10,    // Tamaño de fuente
      cellPadding: 2,  // Espaciado en celdas
    },
    pageBreak: "auto", // Define cómo manejar saltos de página
  });

  // Guardar el archivo PDF
  doc.save('tabla_dinamica.pdf');
};

export const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      if (typeof data === 'string') {
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        console.log(json);
      }
    };
    reader.readAsBinaryString(file);

  }
};
