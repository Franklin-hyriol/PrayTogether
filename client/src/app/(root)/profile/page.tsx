"use client";
import "./profile.scss";
import ProfileAvatar from "@/components/ProfileAvatar/ProfileAvatar";
import PersonalInfo from "@/components/PersonalInfo/PersonalInfo";
import ChangePassword from "@/components/ChangePassword/ChangePassword";
import { useState } from "react";

function Profile() {

    const [tab, setTab] = useState(1)

    return (
        <section className="profile">
            <div className="profile-header">
                <div className="profile-cover"></div>
                <ProfileAvatar />
            </div>

            <div className="edit-profile-content">
                <h1 className="form-title">Modifier votre profil</h1>

                <div className="form-tabs">
                    <button className={`tab-btn ${tab === 1 ? "active" : ""}`} data-tab="personal-info" onClick={() => setTab(1)}>Informations personnelles</button>
                    <button className={`tab-btn ${tab === 2 ? "active" : ""}`} data-tab="password" onClick={() => setTab(2)}>Mot de passe</button>
                </div>

                <div className="form-container">
                    <PersonalInfo className={tab === 1 ? "active" : ""} />
                    <ChangePassword className={tab === 2 ? "active" : ""} />
                </div>
            </div>
        </section>
    )
}

export default Profile;