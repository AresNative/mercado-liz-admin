interface INavigation {
  name: string;
  href: string;
}

export const navigation: INavigation[] = [
  { name: "Tareas", href: "/scrum" },
  { name: "Reportes", href: "/report" },
  { name: "Resumen", href: "/grafic" },
  { name: "Calendario", href: "/calendar" },
  { name: "Test", href: "/model" },
];
