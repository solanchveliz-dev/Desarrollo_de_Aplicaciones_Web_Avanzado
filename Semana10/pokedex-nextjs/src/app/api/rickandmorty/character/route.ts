const API_URL = "https://rickandmortyapi.com/api/character";
const ALLOWED_FILTERS = ["name", "status", "type", "gender"] as const;

export async function GET(request: Request) {
  const incomingUrl = new URL(request.url);
  const query = new URLSearchParams();

  for (const filter of ALLOWED_FILTERS) {
    const value = incomingUrl.searchParams.get(filter)?.trim();
    if (value) query.set(filter, value);
  }

  try {
    const response = await fetch(`${API_URL}?${query.toString()}`, {
      cache: "no-store",
      signal: request.signal,
    });
    const retryAfter = response.headers.get("Retry-After");

    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") ?? "application/json",
        ...(retryAfter ? { "Retry-After": retryAfter } : {}),
      },
    });
  } catch (error: unknown) {
    if (request.signal.aborted) {
      return new Response(null, { status: 499 });
    }

    console.error("No se pudo consultar la API de Rick and Morty:", error);
    return Response.json(
      { error: "No se pudo conectar con el archivo del multiverso." },
      { status: 502 },
    );
  }
}
