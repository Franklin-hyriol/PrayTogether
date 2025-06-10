import React from "react";

function DeleteCompte() {
  return (
    <div className="settings-section danger-zone bg-[#fef2f2] py-4 px-6 rounded-box">
      <h2 className="text-xl font-bold mb-4">Delete Your Account</h2>
      <button className="delete-account-btn btn btn-error gap-2">
        <span className="danger-icon">⚠️</span>
           Delete my account
      </button>
    </div>
  );
}

export default DeleteCompte;
