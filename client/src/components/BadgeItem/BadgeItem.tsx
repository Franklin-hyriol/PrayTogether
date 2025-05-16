import { IBadge } from "@/Interface/IBadge";

const badgeTypeClassMap: Record<string, string> = {
  totalPrayersCreated: "bg-purple-100 text-purple-700",
  totalPrayersMade: "bg-blue-100 text-blue-700",
  totalPrayersReceived: "bg-green-100 text-green-700",
  totalHeartsGiven: "bg-pink-100 text-pink-700",
  totalHeartsReceived: "bg-red-100 text-red-700",
  isBenefactor: "bg-yellow-100 text-yellow-800",
};

function BadgeItem({ badge }: { badge: IBadge }) {
  const badgeClass = badgeTypeClassMap[badge.condition.type] || "bg-gray-100 text-gray-700";
  return (
    <div className={`card bg-base-100 card-sm flex w-full flex-row items-center justify-center pr-3 pl-3 shadow-md transition-transform duration-300 hover:bg-blue-100`}>
      <div className={`flex h-12 w-12 items-center justify-center rounded-full text-xl ${badgeClass}`}>
        {badge.icon}
      </div>
      <div className="card-body">
        <h3 className="card-title">{badge.name}</h3>
        <p className="text-base">{badge.description}</p>
      </div>
    </div>
  );
}

export default BadgeItem;
