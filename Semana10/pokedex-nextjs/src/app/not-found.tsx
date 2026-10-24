import Link from "next/link";
import { IoSearch, IoGameController } from "react-icons/io5";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-purple-900 flex items-center justify-center p-8">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-2xl overflow-hidden text-center">
        <div className="bg-linear-to-r from-black to-purple-700 p-8">
          <h1 className="text-8xl font-extrabold text-white tracking-widest">404</h1>
          <IoSearch size={50} className="mx-auto text-yellow-300 mt-2" />
        </div>

        <div className="p-8 text-gray-700">
          <h2 className="text-2xl font-bold mb-2">¡Este Pokémon se escapó!</h2>
          <p className="mb-8">
            La página que buscas no existe o fue movida a otra ruta.
          </p>

          <Link
            href="/pokemon"
            className="inline-flex items-center gap-2 bg-black hover:bg-purple-900 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            <IoGameController size={22} /> Volver a la Pokédex
          </Link>
        </div>
      </div>
    </div>
  );
}
