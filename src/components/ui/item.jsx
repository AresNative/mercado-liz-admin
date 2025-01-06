import Link from "next/link";

// Componente `Item`
export function Item({ icon: Icon, label, href, badge, onClick }) {
  const colorClasses = {
    fuchsia:
      "text-fuchsia-800 bg-fuchsia-100 dark:bg-fuchsia-900 dark:text-fuchsia-300",
    indigo:
      "text-indigo-800 bg-indigo-100 dark:bg-indigo-900 dark:text-indigo-300",
    purple:
      "text-purple-800 bg-purple-100 dark:bg-purple-900 dark:text-purple-300",
    // Agregar más colores si es necesario
  };

  const badgeClasses =
    badge && colorClasses[badge.color] ? colorClasses[badge.color] : "";

  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group ${
          !label ? "justify-center" : ""
        }`}
      >
        {Icon &&(<div className={`${!label ? "flex items-center justify-center w-full" : "flex-shrink-0"}`}>
          <Icon strokeWidth={1.3} />
        </div>)}
        {label && (
          <span className="flex-1 ms-3 whitespace-nowrap">{label}</span>
        )}
        {badge && (<BadgeText text={badge.text} color={badge.color}/>)}
      </Link>
    </li>
  );
}


export function BadgeText({ text, color }) {
  const colorClasses = {
    fuchsia:
      "text-fuchsia-800 bg-fuchsia-100 dark:bg-fuchsia-900 dark:text-fuchsia-300", 
    indigo:
      "text-indigo-800 bg-indigo-100 dark:bg-indigo-900 dark:text-indigo-300",
    purple:
      "text-purple-800 bg-purple-100 dark:bg-purple-900 dark:text-purple-300",
// Agregar más colores si es necesario
  };  
  const badgeClasses =
    color && colorClasses[color] ? colorClasses[color] : "";
  return ( 
    
    <span
      className={`inline-flex items-center justify-center px-2 ms-3 text-sm font-medium rounded-full ${badgeClasses}`}
    >
      {text}
    </span>
  );
}