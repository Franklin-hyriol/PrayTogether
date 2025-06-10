import { IPrayingForYou } from "@/Interface/IPrayingForYou";
import { formatRelativeTime } from "@/utils/formatDateTime";
import Image from "next/image";
import { FaRegUserCircle } from "react-icons/fa";

function PrayerPerson({ PeoplePraying }: { PeoplePraying: IPrayingForYou }) {
  return (
    <div className="border-base-300 flex items-center gap-4 border-b pt-1 pb-2 last:border-b-0">
      <div className="h-12 w-12 rounded-full object-cover">
        {PeoplePraying.user.profilePhoto ? (
          <Image
            src={PeoplePraying.user.profilePhoto}
            width={50}
            height={50}
            alt={PeoplePraying.user.username}
            className="h-full w-full rounded-full"
          />
        ) : (
          <FaRegUserCircle className="h-full w-full" />
        )}
      </div>
      <div className="flex-1">
        <h3 className="text-base-content mb-1 font-semibold">
          {PeoplePraying.user.username}
        </h3>
        <span className="text-base-content/60 text-sm">
          Prayed {formatRelativeTime(PeoplePraying.prayedAt.toString())}
        </span>
      </div>
    </div>
  );
}

export default PrayerPerson;
