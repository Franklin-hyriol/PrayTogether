import "./Pagination.scss"

function Pagination() {
    return (
        <div className="pagination">
            <button className="pagination-btn" disabled>
                <span className="pagination-icon">←</span>
                Précédent
            </button>
            <div className="pagination-numbers">
                <button className="pagination-number active">1</button>
                <button className="pagination-number">2</button>
                <button className="pagination-number">3</button>
                <span className="pagination-dots">...</span>
                <button className="pagination-number">12</button>
            </div>
            <button className="pagination-btn">
                Suivant
                <span className="pagination-icon">→</span>
            </button>
        </div>
    )
}

export default Pagination