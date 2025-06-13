interface FiltersProps {
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}

function FiltersBadge({ filter, setFilter }: FiltersProps) {
  const isActive = (value: string) => filter === value;

  return (
    <div className="mb-6 flex flex-wrap gap-[0.75rem]">
      <button
        type="button"
        className={`btn ${isActive("") ? "btn-primary" : "btn-soft btn-primary border-none"}`}
        data-filter="all"
        onClick={() => setFilter("")}
      >
        All badges
      </button>
      <button
        type="button"
        className={`btn ${isActive("earned") ? "btn-primary" : "btn-soft btn-primary border-none"}`}
        data-filter="earned"
        onClick={() => setFilter("earned")}
      >
        Earned badges
      </button>
      <button
        type="button"
        className={`btn ${isActive("unearned") ? "btn-primary" : "btn-soft btn-primary border-none"}`}
        data-filter="unearned"
        onClick={() => setFilter("unearned")}
      >
        Badges to earn
      </button>
    </div>
  );
}

export default FiltersBadge;
