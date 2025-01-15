import { Field } from "@/utils/constants/interfaces";

export function TasksField(): Field[] {
  return [
    {
      type: "Flex",
      require: false,
      elements: [
        {
          type: "INPUT",
          require: true,
          label: "Titulo",
          name: "titulo",
          placeholder: "Titulo de la tarea:",
        },
        {
          type: "SELECT",
          name: "prioridad",
          label: "Prioridad de la tarea...",
          require: true,
          multi: false,
          options: ["alta", "media", "baja"],
        },
      ],
    },

    {
      type: "INPUT",
      require: true,
      label: "Descripcion",
      name: "descripcion",
      placeholder: "Explica en breves palabras que es la tarea...",
      maxLength: 50,
    },
  ];
}
