import "./PersonalInfo.scss";
import StatCard from '../StatCard/StatCard';
import HistoryItem from '../HistoryItem/HistoryItem';
import BadgeItem from '../BadgeItem/BadgeItem';

type PersonalInfoProps = {
    className?: string
}

function PersonalInfo({ className }: PersonalInfoProps) {
    return (
        <form id='personal-info' className={'form-section' + " " + className}>
            <div className="user-info">
                <div className="info-item">
                    <label>Nom complet</label>
                    <p className="static-value">Marie Laurent</p>
                </div>
                <div className="info-item">
                    <label>Adresse email</label>
                    <p className="static-value">marie.laurent@email.com</p>
                </div>
            </div>


            <div className="stats-section">
                <h2>Statistiques de Prière</h2>
                <div className="stats-grid">
                    <StatCard />
                    <StatCard />
                    <StatCard />
                </div>
            </div>


            <div className="prayer-history">
                <h2>Historique des Prières</h2>
                <div className="history-list">
                    <HistoryItem />
                    <HistoryItem />
                    <HistoryItem />
                </div>
            </div>


            <div className="badges-section">
                <h2>Mes Badges</h2>
                <p className="section-description">Gérez la visibilité de vos badges sur votre profil public</p>
                <div className="badges-list">
                    <BadgeItem />
                    <BadgeItem />
                    <BadgeItem />
                    <BadgeItem />
                </div>
            </div>

            <div className="donation-section">
                <div className="donation-content">
                    <h2>Soutenir la Communauté</h2>
                    <p>Bien que notre mission principale soit de faciliter la prière et non de générer des
                        profits, vos dons nous aident à maintenir et améliorer la plateforme pour tous. Chaque
                        contribution, même modeste, fait une différence.</p>
                    <button className="donate-btn">
                        <span className="donate-icon">💝</span>
                        Faire un don
                    </button>
                </div>
            </div>

            <div className="form-buttons">
                <button type="button" className="btn-cancel">Annuler</button>
                <button type="submit" className="btn-save">Enregistrer les modifications</button>
            </div>


        </form>
    )
}

export default PersonalInfo