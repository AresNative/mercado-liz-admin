import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r p-6">
      <nav className="rounded-lg shadow-xl p-10 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-center mb-6">
          Bienvenido a la Aplicación
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Selecciona una opción para empezar:
        </p>

        <div className="space-y-4">
          <Link
            href="/Reports"
            className="block w-full text-center py-3 px-6 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Ver Reportes
          </Link>
          <Link
            href="/ToDo"
            className="block w-full text-center py-3 px-6 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition"
          >
            Gestionar Tareas
          </Link>
        </div>
      </nav>
    </div>
  );
}
