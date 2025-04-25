import "./HistoryItem.scss";

function HistoryItem() {
    return (
        <div className="history-item">
            <div className="history-icon sent">📤</div>
            <div className="history-content">
                <div className="history-header">
                    <span className="history-title">Prière envoyée à Jean</span>
                    <span className="history-date">Il y a 2 heures</span>
                </div>
                <p className="history-text">Que Dieu vous apporte la paix et la force dont vous avez besoin en ce moment.</p>
            </div>
        </div>
    )
}

export default HistoryItem;