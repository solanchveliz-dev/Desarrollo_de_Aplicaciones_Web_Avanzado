// Página SOLO para probar el Error Handler (error.tsx).
// Visitar /pokemon/error-demo para ver el componente de error personalizado.

// Se renderiza en cada petición, no en el build (si no, el build falla)
export const dynamic = "force-dynamic";

async function getPokemonRoto(): Promise<unknown> {
  // URL inválida a propósito: la PokeAPI responde 404
  const res = await fetch("https://pokeapi.co/api/v2/pokemon/pokemon-que-no-existe");

  if (!res.ok) throw new Error("No se pudo cargar el Pokémon (prueba de error.tsx)");
  return res.json();
}

export default async function ErrorDemo() {
  await getPokemonRoto();
  return null;
}