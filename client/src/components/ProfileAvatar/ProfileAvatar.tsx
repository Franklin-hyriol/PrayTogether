import "./ProfileAvatar.scss";
import Image from "next/image";

function ProfileAvatar() {
    return (
        <div className="profile-avatar-wrapper">
            <Image src="/images/pexels-photo.jpeg" width={120} height={120} alt="Marie" className="profile-avatar" />
            <button className="edit-avatar-btn" title="Modifier la photo">
                <span>📷</span>
            </button>
        </div>
    )
}

export default ProfileAvatar;