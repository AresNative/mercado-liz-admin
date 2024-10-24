"use client";
import { links } from "@/constant/router";
import Link from "next/link";
import { useRouter } from "next/navigation";
function Page() {
  const router = useRouter(); // Ruta activa

  return (
    <main>
      <nav className="bg-transparent">
        <ul className="m-4 flex gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="shadow-md rounded-md bg-white hover:bg-slate-300"
            >
              <span
                className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                  router.pathname === link.href
                    ? "bg-blue-600 text-white hover:text-blue"
                    : "hover:text-blue"
                }`}
              >
                {link.label}
              </span>
            </Link>
          ))}
        </ul>
      </nav>
    </main>
  );
}

export default Page;
