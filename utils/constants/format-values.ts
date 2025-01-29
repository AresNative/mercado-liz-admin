export const formatValue = (value: number, format?: string): string => {
  switch (format) {
    case "currency":
      return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
    case "percentage":
      return `${value.toFixed(2)}%`;
    case "number":
      return value.toLocaleString("en-US");
    default:
      return value.toString();
  }
};

export function formatJSON(inputJSON: any) {
  // Si el input es un string, lo parsea, de lo contrario, lo toma directamente
  const data =
    typeof inputJSON === "string" ? JSON.parse(inputJSON) : inputJSON;

  // Si ya es un array, se devuelve tal cual
  if (Array.isArray(data)) {
    return data;
  }

  // Si es un objeto, convierte sus valores en un array
  return Object.values(data);
}
