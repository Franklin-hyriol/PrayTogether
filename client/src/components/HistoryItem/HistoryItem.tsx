import { IPrayer } from "@/Interface/IPrayer";
import { formatRelativeTime } from "@/utils/formatDateTime";
import Image from 'next/image';

function HistoryItem({ prayer }: { prayer: IPrayer }) {
  return (
    <div
      className={`card bg-base-100 card-sm flex w-full flex-row items-center justify-center pr-3 pl-3 shadow-md transition-transform duration-300 hover:bg-blue-100`}
    >
      <div
        className={`flex h-12 w-12 flex-none items-center justify-center overflow-hidden rounded-full bg-green-100`}
      >
        <Image
          src={prayer.authorId.profilePhoto}
          alt={prayer.authorId.username}
          className="h-full w-full object-cover"
          width={48}
          height={48}
        />
      </div>

      <div className="card-body relative flex-1">
        <h3 className="card-title">{prayer.authorId.username}</h3>

        <p className="flex-1 text-base break-all">{prayer.text}</p>

        <span className="absolute top-2 right-2 flex items-center gap-2 text-xs text-gray-400">
          {prayer.isUrgent ? (
            <span className="font-semibold text-red-500">urgent</span>
          ) : null}

          <span>Il y a {formatRelativeTime(prayer.createdAt)}</span>
        </span>

        <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
          <span className="text-red-500">❤️ {prayer.likesCount}</span>
          <span>🙏 {prayer.prayersCount}</span>
        </div>
      </div>
    </div>
  );
}

export default HistoryItem;
