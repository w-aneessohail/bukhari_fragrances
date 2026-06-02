import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }

    navigate(`/shop?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="hidden md:block">
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search fragrances…"
        className="w-48 rounded-md border border-border bg-input px-3 py-1.5 text-sm text-text-primary lg:w-64"
        aria-label="Search fragrances"
      />
    </form>
  );
}
