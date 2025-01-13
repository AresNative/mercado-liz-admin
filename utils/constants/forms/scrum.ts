import { Field } from "../interfaces";

export function ScrumField(): Field[] {
  return [
    {
      type: "Flex",
      require: false,
      elements: [
        {
          name: "name_sprint",
          type: "INPUT",
          label: "Nombre del Sprint",
          placeholder: "Sprint 1",
          require: true,
        },
        {
          name: "perdiodo",
          type: "DATE_RANGE",
          label: "Periodo",
          require: true,
        },
      ],
    },
    {
      type: "SELECT",
      name: "usuarios",
      label: "Usuarios Relacionados",
      require: true,
      options: [
        "JavaScript",
        "React",
        "Node.js",
        "Python",
        "Java",
        "C++",
        "Ruby",
        "PHP",
        "HTML",
        "CSS",
        "TypeScript",
        "Angular",
        "Vue.js",
        "Django",
        "Flask",
        "Express.js",
        "MongoDB",
        "SQL",
        "Git",
        "Docker",
        "AWS",
        "Azure",
        "GraphQL",
        "REST API",
        "Machine Learning",
        "Data Analysis",
        "Agile",
        "Scrum",
      ],
    },
  ];
}
