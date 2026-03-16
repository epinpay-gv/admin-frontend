"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

interface CategoryFormGenresProps {
  genres: string[];
  onChange: (genres: string[]) => void;
}

const SUGGESTED_GENRES = [
  "Action", "Adventure", "Battle Royale", "Card Game",
  "Casino", "Fighting", "FPS", "Horror", "MOBA",
  "MMO", "Puzzle", "Racing", "RPG", "Shooter",
  "Simulation", "Sports", "Strategy", "Survival",
  "Tactical", "Football", "Basketball",
];

export default function CategoryFormGenres({
  genres,
  onChange,
}: CategoryFormGenresProps) {
  const [input, setInput] = useState("");

  const addGenre = (genre: string) => {
    const trimmed = genre.trim();
    if (!trimmed || genres.includes(trimmed)) return;
    onChange([...genres, trimmed]);
    setInput("");
  };

  const removeGenre = (genre: string) => {
    onChange(genres.filter((g) => g !== genre));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addGenre(input);
    }
    if (e.key === "Backspace" && !input && genres.length > 0) {
      removeGenre(genres[genres.length - 1]);
    }
  };

  const availableSuggestions = SUGGESTED_GENRES.filter(
    (g) => !genres.includes(g)
  );

  return (
    <div className="space-y-4">
      {/* Seçili genre'lar */}
      <div
        className="min-h-[44px] flex flex-wrap gap-2 items-center px-3 py-2 rounded-lg border transition-all"
        style={{
          background: "var(--background-card)",
          borderColor: "var(--border)",
        }}
      >
        {genres.map((genre) => (
          <span
            key={genre}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg font-mono"
            style={{
              background: "rgba(0,198,162,0.1)",
              color: "#00C6A2",
              border: "1px solid rgba(0,198,162,0.2)",
            }}
          >
            {genre}
            <button
              type="button"
              onClick={() => removeGenre(genre)}
              className="hover:opacity-70 transition-opacity"
            >
              <X size={11} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={genres.length === 0 ? "Genre ekle..." : ""}
          className="flex-1 min-w-[120px] text-sm outline-none bg-transparent"
          style={{ color: "var(--text-primary)" }}
        />
        {input && (
          <button
            type="button"
            onClick={() => addGenre(input)}
            className="w-6 h-6 rounded flex items-center justify-center transition-all"
            style={{
              background: "rgba(0,198,162,0.1)",
              color: "#00C6A2",
            }}
          >
            <Plus size={12} />
          </button>
        )}
      </div>

      <p
        className="text-[11px] font-mono"
        style={{ color: "var(--text-muted)" }}
      >
        Enter veya virgül ile ekle. Ürünler genre bilgisini bu kategoriden otomatik alır.
      </p>

      {/* Önerilen genre'lar */}
      {availableSuggestions.length > 0 && (
        <div>
          <p
            className="text-[11px] font-semibold uppercase tracking-widest font-mono mb-2"
            style={{ color: "var(--text-muted)" }}
          >
            Önerilen Genre&apos;lar
          </p>
          <div className="flex flex-wrap gap-2">
            {availableSuggestions.map((genre) => (
              <button
                key={genre}
                type="button"
                onClick={() => addGenre(genre)}
                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-mono border transition-all"
                style={{
                  background: "var(--background-secondary)",
                  borderColor: "var(--border)",
                  color: "var(--text-muted)",
                }}
              >
                <Plus size={10} />
                {genre}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}