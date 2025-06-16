import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all"); // all | users | observations | objects
  const [results, setResults] = useState({ users: [], observations: [] });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (query, filter) => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/search?q=${query}&filter=${filter}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Search failed:", err);
      alert("Something went wrong while searching.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-10 py-16 font-serif">
      <h1 className="text-3xl font-semibold mb-6">Search</h1>

      <SearchBar onSearch={handleSearch} query={query} setQuery={setQuery} filter={filter} setFilter={setFilter} />

      {/* Search results */}
      <div className="space-y-10">
        {(filter === "all" || filter === "users") && results.users.length > 0 && (
          <div>
            <h2 className="text-xl mb-3">Users</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {results.users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => navigate(`/users/${user.id}`)}
                  className="bg-zinc-900 p-4 rounded-lg cursor-pointer hover:shadow-lg transition"
                >
                  <h3 className="text-lg font-semibold">{user.username}</h3>
                  <p className="text-white/60 text-sm">{user.bio}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {(filter === "all" || filter === "observations") && results.observations.length > 0 && (
          <div>
            <h2 className="text-xl mb-3">Observations</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {results.observations.map((obs) => (
                <div
                  key={obs.id}
                  onClick={() => navigate(`/users/${obs.user_id}`)}
                  className="bg-zinc-900 p-4 rounded-lg cursor-pointer hover:shadow-lg transition"
                >
                  <img
                    src={obs.image_url}
                    alt={obs.title}
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                  <h4 className="text-lg font-semibold">{obs.title}</h4>
                  <p className="text-white/60 text-sm truncate">{obs.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && results.users.length === 0 && results.observations.length === 0 && (
          <p className="text-white/40">No results found.</p>
        )}
      </div>
    </div>
  );
}
