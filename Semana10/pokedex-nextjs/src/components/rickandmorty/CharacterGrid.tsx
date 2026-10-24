import type { Character } from "@/types/character";
import CharacterCard from "@/components/rickandmorty/CharacterCard";

interface CharacterGridProps {
  characters: Character[];
}

export default function CharacterGrid({ characters }: CharacterGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {characters.map((character, index) => (
        <CharacterCard
          key={character.id}
          character={character}
          index={index}
        />
      ))}
    </div>
  );
}
