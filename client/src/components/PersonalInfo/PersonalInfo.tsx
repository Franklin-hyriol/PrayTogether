import "./PersonalInfo.scss";
import StatCard from '../StatCard/StatCard';
import HistoryItem from '../HistoryItem/HistoryItem';
import BadgeItem from '../BadgeItem/BadgeItem';


// Icons
import { LiaPrayingHandsSolid } from "react-icons/lia";
import { FaHeart } from "react-icons/fa";
import { FaHands } from "react-icons/fa";
import { FaHeartCirclePlus } from "react-icons/fa6";
import { useAuth } from "@/context/AuthContext";





type PersonalInfoProps = {
    className?: string
}

function PersonalInfo({ className }: PersonalInfoProps) {
    const { user } = useAuth()

    return (
        <div className={'form-section w-full flex-col' + " " + className}>

            <div className="mb-8 p-6 bg-white shadow-md rounded-xl">
                <h2 className="text-xl mb-6 font-medium">Prayer Statistics</h2>
                <div className="w-full flex flex-wrap gap-4">
                    <StatCard
                        icon={<LiaPrayingHandsSolid />}
                        value={user?.totalPrayersReceived || 0}
                        label="Prayers Received"
                        className="received"
                    /> {/* totalPrayersReceived */}
                    <StatCard
                        icon={<FaHeart />}
                        value={user?.totalHeartsReceived || 0}
                        label="Hearts Received"
                        className="likes"
                    /> {/*totalHeartsReceived */}
                    <StatCard
                        icon={<FaHands />}
                        value={user?.totalPrayersMade || 0}
                        label="Prayers Made"
                        className="given"
                    /> {/* totalPrayersMade */}
                    <StatCard
                        icon={<FaHeartCirclePlus />}
                        value={user?.totalHeartsGiven || 0}
                        label="Hearts Given"
                        className="hearts"
                    /> {/* totalHeartsGiven */}
                </div>
            </div>


            <div className="mb-8 p-6 bg-white shadow-md rounded-xl">
                <h2 className="text-xl mb-6 font-medium">Prayer History</h2>
                <div className="w-full flex flex-col gap-4">
                    <HistoryItem />
                    <HistoryItem />
                    <HistoryItem />
                </div>
            </div>


            <div className="mb-8 p-6 bg-white shadow-md rounded-xl">
                <h2 className="text-xl mb-6 font-medium">Mes Badges</h2>
                <div className="w-full flex flex-col gap-4 max-h-80 overflow-y-auto">
                    <BadgeItem />
                    <BadgeItem />
                    <BadgeItem />
                    <BadgeItem />
                </div>
            </div>

            <div className="bg-gradient-to-br from-[#eff6ff] to-[#dbeafe] rounded-lg p-8">
                <div className="text-center max-w-[600px] mx-auto">
                    <p className="text-[#4b5563] leading-6 mb-6">Like this app? You can support it by making a donation - every little helps!</p>
                    <button className="btn btn-primary">
                        <span>💝</span>
                        Make a donation
                    </button>
                </div>
            </div>

        </div>
    )
}

export default PersonalInfo