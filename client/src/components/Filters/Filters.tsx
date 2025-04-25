import "./Filters.scss";

function Filters() {
    return (
        <div className="filters-section">
            <div className="search-bar">
                <input type="text" placeholder="Rechercher des prières..." className="search-input" />
            </div>
            <div className="filter-tags">
                <button className="filter-tag active">Toutes les prières</button>
                <button className="filter-tag">Mes prières</button>
                <button className="filter-tag">Je prie pour</button>
                <button className="filter-tag">Non répondues</button>
                <button className="filter-tag">Urgentes</button>
            </div>
        </div>
    )
}

export default Filters;