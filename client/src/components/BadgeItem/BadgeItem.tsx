import "./BadgeItem.scss";

function BadgeItem() {
    return (
        <div className="badge-item earned">
            <div className="badge-icon prayer-giver">🙏</div>
            <div className="badge-info">
                <h3>Donneur de Prières</h3>
                <p>A prié pour 100+ personnes</p>
            </div>
        </div>
    )
}

export default BadgeItem