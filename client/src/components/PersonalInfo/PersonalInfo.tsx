"use client";

import StatCard from "../StatCard/StatCard";
import HistoryItem from "../HistoryItem/HistoryItem";
import BadgeItem from "../BadgeItem/BadgeItem";
import { useAuth } from "@/context/AuthContext";
import { useInView } from "react-intersection-observer";

// Icons
import { IoCreateOutline } from "react-icons/io5";
import { LiaPrayingHandsSolid } from "react-icons/lia";
import { FaHeart } from "react-icons/fa";
import { FaHands } from "react-icons/fa";
import { FaHeartCirclePlus } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import useFetch from "@/hook/useFetch";
import { useInfiniteQuery } from "@tanstack/react-query";
import { IBadge } from "@/Interface/IBadge";
import { Data } from "@/Interface/Data";
import { getAllBadgesEndpoint } from "@/endpoint/badge";
import ComponentsLoader from "../ComponentsLoader/ComponentsLoader";
import FiltersBadge from "../FiltersBadge/FiltersBadge";

type PersonalInfoProps = {
  className?: string;
};

function PersonalInfo({ className }: PersonalInfoProps) {
  const { user } = useAuth();
  const { ref, inView } = useInView();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [filtersBadges, setFiltersBadges] = useState("earned");
  const { fetchData } = useFetch(true);

  // Badges //////////////////////////////////////////////////
  const {
    data: allBadges,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error: allBadgesError,
    isLoading: isAllBadgesLoading,
  } = useInfiniteQuery({
    queryKey: ["AllBadges", filtersBadges],
    queryFn: ({ pageParam = 1 }) =>
      fetchData<Data<IBadge[]>>(
        getAllBadgesEndpoint(pageParam, 10, filtersBadges),
      ),
    initialPageParam: 1, // ✅ Nécessaire avec TanStack Query v5+
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return lastPage.pagination?.hasNextPage ? nextPage : undefined;
    },
  });

  //   Scroll infinite
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, hasNextPage, isFetchingNextPage]);

  //   Scroll to top
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [filtersBadges]);
  // Badges //////////////////////////////////////////////////

  // History //////////////////////////////////////////////////

  // History //////////////////////////////////////////////////

  return (
    <div className={"form-section w-full flex-col" + " " + className}>
      {/* Statistics */}
      <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
        <h2 className="mb-6 text-xl font-medium">Prayer Statistics</h2>
        <div className="flex w-full flex-wrap gap-4">
          <StatCard
            icon={<IoCreateOutline />}
            value={user?.totalPrayersCreated || 0}
            label="Prayers Created"
            className="given"
          />{" "}
          {/* totalPrayersCreated */}
          <StatCard
            icon={<LiaPrayingHandsSolid />}
            value={user?.totalPrayersReceived || 0}
            label="Prayers Received"
            className="received"
          />{" "}
          {/* totalPrayersReceived */}
          <StatCard
            icon={<FaHeart />}
            value={user?.totalHeartsReceived || 0}
            label="Hearts Received"
            className="likes"
          />{" "}
          {/*totalHeartsReceived */}
          <StatCard
            icon={<FaHands />}
            value={user?.totalPrayersMade || 0}
            label="Prayers Given"
            className="given"
          />{" "}
          {/* totalPrayersMade */}
          <StatCard
            icon={<FaHeartCirclePlus />}
            value={user?.totalHeartsGiven || 0}
            label="Hearts Given"
            className="hearts"
          />{" "}
          {/* totalHeartsGiven */}
        </div>
      </div>
      {/* Statistics */}

      {/* History */}
      <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
        <h2 className="mb-6 text-xl font-medium">Prayer History</h2>
        <div className="flex w-full flex-col gap-4">
          <HistoryItem />
          <HistoryItem />
          <HistoryItem />
        </div>
      </div>
      {/* History */}

      {/* Badges */}
      <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
        <h2 className="mb-6 text-xl font-medium">Mes Badges</h2>

        <FiltersBadge filter={filtersBadges} setFilter={setFiltersBadges} />

        <div
          className="relative flex max-h-80 min-h-50 w-full flex-col gap-4 overflow-y-auto p-1"
          ref={scrollContainerRef}
        >
          {allBadgesError ? (
            <p>{allBadgesError.message}</p>
          ) : isAllBadgesLoading ? (
            <ComponentsLoader className="absolute top-1/2 left-1/2" />
          ) : (
            allBadges?.pages.map((page) =>
              page.data.map((badge) => (
                <BadgeItem key={badge._id} badge={badge} />
              )),
            )
          )}

          {hasNextPage && (
            <div ref={ref} className="mx-auto my-4">
              <ComponentsLoader />
            </div>
          )}
        </div>
      </div>
      {/* Badges */}

      {/* Donations */}
      <div className="rounded-lg bg-gradient-to-br from-[#eff6ff] to-[#dbeafe] p-8">
        <div className="mx-auto max-w-[600px] text-center">
          <p className="mb-6 leading-6 text-[#4b5563]">
            Like this app? You can support it by making a donation - every
            little helps!
          </p>
          <button className="btn btn-primary">
            <span>💝</span>
            Make a donation
          </button>
        </div>
      </div>
    </div>
  );
}

export default PersonalInfo;
