import { Field } from "@/utils/constants/interfaces";

export function SprintField(): Field[] {
  return [
    {
      type: "SELECT",
      name: "sprint",
      label: "Sprints del proyecto...",
      require: true,
      multi: false,
      options: ["11", "13"],
    },
  ];
}
