import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import type { CompanyReadiness } from "../types/report";
import { CompanyReadinessItem } from "./CompanyReadinessItem";

export const COMPANY_CATEGORIES = [
  "All",
  "Big Tech",
  "Product / SaaS",
  "Trading / Finance",
  "Indian Product Companies",
] as const;

type CategoryFilter = (typeof COMPANY_CATEGORIES)[number];

interface CompanyBrowserModalProps {
  companies: CompanyReadiness[];
  isOpen: boolean;
  onClose: () => void;
}

export function CompanyBrowserModal({
  companies,
  isOpen,
  onClose,
}: CompanyBrowserModalProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("All");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return companies
      .filter((company) => {
        const matchesCategory =
          category === "All" || company.category === category;
        const matchesSearch =
          query.length === 0 ||
          company.company.toLowerCase().includes(query) ||
          company.category.toLowerCase().includes(query);
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => b.score - a.score || a.company.localeCompare(b.company));
  }, [companies, search, category]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="company-browser-overlay" role="dialog" aria-modal="true">
      <button
        type="button"
        className="company-browser-overlay__backdrop"
        aria-label="Close company browser"
        onClick={onClose}
      />
      <div className="company-browser-modal">
        <div className="company-browser-modal__header">
          <div>
            <h2>Company Browser</h2>
            <p>Explore interview tracks across {companies.length} companies</p>
          </div>
          <button
            type="button"
            className="company-browser-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="company-browser-controls">
          <label className="company-browser-search">
            <Search size={16} />
            <input
              type="search"
              placeholder="Search companies..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <div className="company-browser-filters" role="tablist" aria-label="Category filters">
            {COMPANY_CATEGORIES.map((option) => (
              <button
                key={option}
                type="button"
                role="tab"
                aria-selected={category === option}
                className={`company-browser-filter${
                  category === option ? " company-browser-filter--active" : ""
                }`}
                onClick={() => setCategory(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <p className="company-browser-count">
          Showing {filtered.length} of {companies.length} · sorted by readiness score
        </p>

        {filtered.length === 0 ? (
          <p className="empty-chip">No companies match your search.</p>
        ) : (
          <ul className="company-browser-list">
            {filtered.map((item, index) => (
              <CompanyReadinessItem
                key={item.company}
                item={item}
                index={index}
                compact
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
