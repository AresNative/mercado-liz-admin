const formatValue = (value) => {
    if (!isNaN(value) && /^\d+\.\d+$/.test(value)) {
      return new Intl.NumberFormat(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    }

    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(value)) {
      return new Date(value).toLocaleDateString();
    }

    return value;
  };

const renderTableCell = (column, row, rowIndex, colIndex) => {
    const key = column.id;
    const value = row[key];

    if (key === "TypoImpuestos") {
      return value.split(",").map((impuesto, idx) => (
        <td
          key={`${key}-${rowIndex}-${idx}`}
          className="px-1 py-2 text-sm whitespace-nowrap p-2"
        >
          {impuesto.trim()}
        </td>
      ));
    }

    return (
      <td
        key={`${key}-${rowIndex}-${colIndex}`}
        className="px-1 py-2 text-sm whitespace-nowrap p-2"
      >
        {formatValue(value)}
      </td>
    );
};
  
export default renderTableCell