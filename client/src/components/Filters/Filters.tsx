import { FaSearch } from "react-icons/fa";

interface FiltersProps {
    search: string
    setSearch: React.Dispatch<React.SetStateAction<string>>
    filter: string
    setFilter: React.Dispatch<React.SetStateAction<string>>
}

function Filters({ search, setSearch, filter, setFilter }: FiltersProps) {
    const isActive = (value: string) => filter === value;

    return (
        <div className="max-w-[1200px] mx-auto mb-8 px-4">
            <label className="input mb-4 w-full">
                <FaSearch className="h-[1em] opacity-50" />
                <input type="search" placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} />
            </label>

            <div className="flex gap-[0.75rem] flex-wrap">
                <button
                    className={`btn ${isActive("") ? "btn-primary" : "btn-outline border-none bg-gray-200 hover:bg-gray-300"}`}
                    onClick={() => setFilter("")}
                >
                    All prayers
                </button>
                <button
                    className={`btn ${isActive("liked") ? "btn-primary" : "btn-outline border-none bg-gray-200 hover:bg-gray-300"}`}
                    onClick={() => setFilter("liked")}
                >
                    Liked
                </button>
                <button
                    className={`btn ${isActive("prayed") ? "btn-primary" : "btn-outline border-none bg-gray-200 hover:bg-gray-300"}`}
                    onClick={() => setFilter("prayed")}
                >
                    I&apos;m praying for
                </button>
                <button
                    className={`btn ${isActive("urgent") ? "btn-primary" : "btn-outline border-none bg-gray-200 hover:bg-gray-300"}`}
                    onClick={() => setFilter("urgent")}
                >
                    Urgent
                </button>
                <button
                    className={`btn ${isActive("unseen") ? "btn-primary" : "btn-outline border-none bg-gray-200 hover:bg-gray-300"}`}
                    onClick={() => setFilter("unseen")}
                >
                    Unseen
                </button>
            </div>
        </div>
    );
}

export default Filters;
