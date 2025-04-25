import "./BadgeItem.scss";

function BadgeItem() {
    return (
        <div className="badge-item earned">
            <div className="badge-checkbox">
                <input type="checkbox" id="badge1" checked={true} />
                <label htmlFor="badge1"></label>
            </div>
            <div className="badge-icon prayer-giver">🙏</div>
            <div className="badge-info">
                <h3>Donneur de Prières</h3>
                <p>A prié pour 100+ personnes</p>
            </div>
        </div>
    )
}

export default BadgeItem