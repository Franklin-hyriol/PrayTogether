import "./ChangePassword.scss";

type ChangePasswordProps = {
    className?: string
}
function ChangePassword({ className }: ChangePasswordProps) {
    return (
        <form id="password" className={"form-section" + " " + className}>
            <div className="form-group">
                <label htmlFor="current-password">Mot de passe actuel</label>
                <input type="password" id="current-password" className="form-input" required={true} />
                <span className="password-toggle">👁️</span>
            </div>

            <div className="form-group">
                <label htmlFor="new-password">Nouveau mot de passe</label>
                <input type="password" id="new-password" className="form-input" required={true} />
                <span className="password-toggle">👁️</span>
                <div className="password-strength">
                    <div className="strength-bar">
                        <div className="strength-indicator" style={{ width: "0%" }}></div>
                    </div>
                    <span className="strength-text">Force: Non définie</span>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="confirm-password">Confirmer le nouveau mot de passe</label>
                <input type="password" id="confirm-password" className="form-input" required={true} />
                <span className="password-toggle">👁️</span>
            </div>

            <div className="password-requirements">
                <p>Votre mot de passe doit contenir :</p>
                <ul>
                    <li className="requirement">Au moins 8 caractères</li>
                    <li className="requirement">Au moins 1 majuscule</li>
                    <li className="requirement">Au moins 1 chiffre</li>
                    <li className="requirement">Au moins 1 caractère spécial</li>
                </ul>
            </div>

            <div className="form-buttons">
                <button type="button" className="btn-cancel">Annuler</button>
                <button type="submit" className="btn-save">Mettre à jour le mot de passe</button>
            </div>
        </form>
    )
}

export default ChangePassword