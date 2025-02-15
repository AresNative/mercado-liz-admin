import { Field } from "@/utils/constants/interfaces";

export function FiltersField(): Field[] {
  return [
    {
      type: "Flex",
      require: false,
      elements: [
        {
          name: "search",
          type: "SEARCH",
          options: ["Guadalupe", "TESTERAZO", "Palmas", "MAYOREO"],
          label: "Busca algún dato de interés",
          placeholder: "Buscar productos...",
          require: false,
        },
        {
          name: "sucursal",
          type: "SELECT",
          options: [
            { label: "Guadalupe", value: "LIZ" },
            { label: "Testerazo", value: "TESTERAZO" },
            { label: "Palmas", value: "PALMAS" },
            { label: "Mayoreo", value: "MAYOREO" },
          ],
          multi: true,
          label: "Seleccione sucursal...",
          placeholder: "Mínimo 3 días mayor a la fecha de inicio",
          require: false,
        },
      ],
    },
    {
      type: "Flex",
      require: false,
      elements: [
        {
          name: "fecha_inicial",
          type: "DATE",
          label: "Fecha de inicio",
          placeholder: "Buscar por fecha...",
          require: false,
        },
        {
          name: "fecha_final",
          type: "DATE",
          label: "Fecha final",
          placeholder: "Buscar por fecha...",
          require: false,
        },
      ],
    },
  ];
}
