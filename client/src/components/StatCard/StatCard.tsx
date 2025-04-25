import "./StatCard.scss";

function StatCard() {
    return (
        <div className="stat-card">
            <div className="stat-icon received">📥</div>
            <div className="stat-value">247</div>
            <div className="stat-label">Prières Reçues</div>
        </div>
    )
}

export default StatCard