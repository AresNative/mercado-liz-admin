interface INavigation {
  name: string;
  href: string;
}

export const navigation: INavigation[] = [
  { name: "Mermas", href: "/mermas" },
  { name: "Scrum", href: "/scrum" },
  { name: "Reportes", href: "/report" },
  { name: "Graficas", href: "/grafic" },
];
