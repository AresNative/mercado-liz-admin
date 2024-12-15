import { navItems } from "@/constants/aside";
import { Item } from "./item";

export default function Navbar() {
  return (
    <nav className="z-10 fixed w-full overflow-y-auto bg-slate-50 dark:bg-gray-800">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white md:ml-14">
            
          </span>
        </a>
        <div className="hidden w-full md:block md:w-auto">
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 ">
            {navItems.map((item, index) => (
                <Item 
                    key={index} 
                    icon={item.icon} 
                    label={item.label} 
                    href={item.href} 
                    badge={item.badge} 
                    onClick={item.onClick}
                />
                ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}