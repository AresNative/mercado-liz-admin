import { Field } from "@/utils/constants/interfaces";

export function SprintField(data: any): Field[] {
  return [
    {
      type: "SELECT",
      name: "sprint",
      label: "Sprints del proyecto...",
      require: true,
      multi: false,
      options: data.map((row: any) => row.id),
    },
  ];
}
