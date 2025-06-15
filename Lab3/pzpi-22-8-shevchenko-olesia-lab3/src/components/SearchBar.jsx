import React from "react";
import { useTranslation } from "react-i18next";

export default function SearchBar({ query, setQuery, filter, setFilter, onSearch }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <input
        type="text"
        placeholder={t("searchBar.placeholder")}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none flex-1"
      />
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="px-4 py-2 bg-white text-black rounded-lg"
      >
        <option value="all">{t("searchBar.all")}</option>
        <option value="users">{t("searchBar.users")}</option>
        <option value="observations">{t("searchBar.observations")}</option>
        <option value="objects">{t("searchBar.objects")}</option>
      </select>
      <button
        onClick={() => onSearch(query, filter)}
        className="px-6 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition"
      >
        {t("searchBar.button")}
      </button>
    </div>
  );
}
