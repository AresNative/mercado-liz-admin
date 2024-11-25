import { ChevronUp, EllipsisVertical } from "lucide-react";

// Componente `Dropdown`
export function Dropdown({ label, children }) {
  return (
    <li>
      <details className="group">
        <summary className="flex items-center p-2 text-gray-900 rounded-lg cursor-pointer dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
            <EllipsisVertical strokeWidth={1.30}/>
            <span className="flex-1 ms-3 whitespace-nowrap">{label}</span>
            <ChevronUp className="ml-auto group-open:rotate-180 transition-transform" strokeWidth={1.30} />
        </summary>
        <ul className="pl-5 space-y-2">
          {children}
        </ul>
      </details>
    </li>
  );
}