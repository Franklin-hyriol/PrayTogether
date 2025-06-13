import React from "react";

function DeleteCompte() {
  return (
    <div className="settings-section w-full danger-zone border border-error py-4 px-6 rounded-box">
      <h2 className="text-xl font-bold mb-4 text-base-content">Delete Your Account</h2>
      <button type="button" className="delete-account-btn btn btn-error gap-2">
        <span className="danger-icon">⚠️</span>
           Delete my account
      </button>
    </div>
  );
}

export default DeleteCompte;
