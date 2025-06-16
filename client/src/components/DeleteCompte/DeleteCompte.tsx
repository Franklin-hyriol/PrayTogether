"use client";
import { useState } from "react";
import DeleteCompteConfirmation from "./DeleteCompteConfirmation";

function DeleteCompte() {
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  return (
    <>
      <div className="settings-section danger-zone border-error rounded-box w-full border px-6 py-4">
        <h2 className="text-base-content mb-4 text-xl font-bold">
          Delete Your Account
        </h2>
        <button
          type="button"
          className="delete-account-btn btn btn-error gap-2"
          onClick={() => setShowDeletePopup(true)}
        >
          <span className="danger-icon">⚠️</span>
          Delete my account
        </button>
      </div>

      <DeleteCompteConfirmation
        showDeletePopup={showDeletePopup}
        setShowDeletePopup={setShowDeletePopup}
      />
    </>
  );
}

export default DeleteCompte;
