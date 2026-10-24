import type {
  Character,
  CharacterResponse,
  Episode,
  EpisodeResponse,
} from "@/types/character";

const API_URL = "https://rickandmortyapi.com/api";
export const CHARACTER_REVALIDATE_SECONDS = 864000;

async function fetchWithRetry(
  url: string,
  options: RequestInit,
): Promise<Response> {
  for (let attempt = 0; ; attempt += 1) {
    const response = await fetch(url, options);
    if (response.status !== 429 || attempt >= 4) return response;

    const retryAfter = Number(response.headers.get("Retry-After"));
    const delay =
      Number.isFinite(retryAfter) && retryAfter > 0
        ? retryAfter * 1000
        : Math.min(1000 * 2 ** attempt, 8000);
    await new Promise<void>((resolve) => setTimeout(resolve, delay));
  }
}

export async function getCharacters(
  page = 1,
): Promise<CharacterResponse> {
  const response = await fetchWithRetry(
    `${API_URL}/character?page=${encodeURIComponent(String(page))}`,
    { cache: "force-cache" },
  );

  if (!response.ok) {
    throw new Error(`No se pudo cargar la lista de personajes (${response.status}).`);
  }

  return (await response.json()) as CharacterResponse;
}

export async function getCharacter(id: string): Promise<Character | null> {
  const characterId = Number(id);
  if (!Number.isSafeInteger(characterId) || characterId < 1) {
    return null;
  }

  const { info } = await getCharacters(1);
  if (characterId > info.count) return null;

  const batchStart = Math.floor((characterId - 1) / 50) * 50 + 1;
  const batchEnd = Math.min(batchStart + 49, info.count);
  const characterIds = Array.from(
    { length: batchEnd - batchStart + 1 },
    (_, index) => batchStart + index,
  );
  const response = await fetchWithRetry(
    `${API_URL}/character/${characterIds.join(",")}`,
    { next: { revalidate: CHARACTER_REVALIDATE_SECONDS } },
  );

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`No se pudo cargar el personaje (${response.status}).`);
  }

  const data: Character | Character[] = await response.json();
  return (Array.isArray(data) ? data : [data]).find(
    (character) => character.id === characterId,
  ) ?? null;
}

export async function getEpisodes(ids: number[]): Promise<Episode[]> {
  if (ids.length === 0) {
    return [];
  }

  const episodeIds = [...new Set(ids)];
  const firstPageResponse = await fetchWithRetry(`${API_URL}/episode?page=1`, {
    next: { revalidate: CHARACTER_REVALIDATE_SECONDS },
  });
  if (!firstPageResponse.ok) {
    throw new Error(
      `No se pudo consultar el catálogo de episodios (${firstPageResponse.status}).`,
    );
  }
  const firstPage: EpisodeResponse = await firstPageResponse.json();
  const allEpisodeIds = Array.from(
    { length: firstPage.info.count },
    (_, index) => index + 1,
  );
  const response = await fetchWithRetry(
    `${API_URL}/episode/${allEpisodeIds.join(",")}`,
    { next: { revalidate: CHARACTER_REVALIDATE_SECONDS } },
  );

  if (!response.ok) {
    throw new Error(`No se pudieron cargar los episodios (${response.status}).`);
  }

  const data: Episode | Episode[] = await response.json();
  const episodes = Array.isArray(data) ? data : [data];
  const requestedIds = new Set(episodeIds);
  return episodes.filter((episode) => requestedIds.has(episode.id));
}

export async function getAllCharacterIds(): Promise<string[]> {
  const firstPage = await getCharacters(1);
  const remainingPages: CharacterResponse[] = [];
  const pages = Array.from(
    { length: firstPage.info.pages - 1 },
    (_, index) => index + 2,
  );

  for (let index = 0; index < pages.length; index += 2) {
    const batch = pages.slice(index, index + 2);
    remainingPages.push(
      ...(await Promise.all(batch.map((page) => getCharacters(page)))),
    );
    if (index + 2 < pages.length) {
      await new Promise<void>((resolve) => setTimeout(resolve, 1500));
    }
  }

  return [firstPage, ...remainingPages]
    .flatMap((page) => page.results)
    .map((character) => String(character.id));
}
