"use client"; // Los Error Handlers SIEMPRE deben ser Client Components

import { useEffect } from "react";
import Link from "next/link";
import { IoWarning, IoReload, IoHome } from "react-icons/io5";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PokemonError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Registrar el error en consola (aquí podría ir un servicio de logs)
    console.error("Error en la Pokédex:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center p-8 min-h-[80vh]">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-2xl overflow-hidden text-center">
        <div className="bg-linear-to-r from-red-600 to-orange-500 p-8">
          <IoWarning size={80} className="mx-auto text-white animate-pulse" />
          <h1 className="text-3xl font-bold text-white mt-4">
            ¡Un Pokémon salvaje rompió la página!
          </h1>
        </div>

        <div className="p-8 text-gray-700">
          <p className="text-lg mb-2">Ocurrió un error al cargar la Pokédex.</p>
          <p className="text-sm bg-gray-100 rounded-lg p-3 font-mono text-red-600 break-words">
            {error.message || "Error desconocido"}
          </p>
          {error.digest && (
            <p className="text-xs text-gray-400 mt-2">Código: {error.digest}</p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button
              onClick={() => reset()}
              className="flex items-center justify-center gap-2 bg-black hover:bg-purple-900 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              <IoReload size={20} /> Intentar de nuevo
            </button>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition"
            >
              <IoHome size={20} /> Ir al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
