"use client";

import PrayerCard from "@/components/PrayerCard/PrayerCard";
import Pagination from "@/components/Pagination/Pagination";
import PrayerPopup from "@/components/PrayerPopup/PrayerPopup";
import { useState } from "react";
import useFetch from "@/hook/useFetch";
import { IPrayer } from "@/Interface/IPrayer";
import { Data } from "@/Interface/Data";
import ComponentsLoader from "@/components/ComponentsLoader/ComponentsLoader";
import { getMyPrayersEndpoint, getAllPrayersEndpoint } from "@/endpoint/Prayer";
import { useQuery } from "@tanstack/react-query";
import DeleteConfirmation from "@/components/DeleteConfirmation/DeleteConfirmation";

// Icons
import { MdAdd } from "react-icons/md";
import PrayerEdit from "@/components/PrayerEdit/PrayerEdit";
import { useDebounce } from "@/hook/useDebounce";
import Filters from "@/components/Filters/Filters";
import PrayingForYou from "@/components/PrayingForYou/PrayingForYou";

function PrayerRoom() {
  const [makeRequest, setMakeRequest] = useState(false);
  const [selectedPrayerId, setSelectedPrayerId] = useState<string | null>(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showPeopleWhoPrayPopup, setShowPeopleWhoPrayPopup] = useState(false);
  const [prayerToEdit, setPrayerToEdit] = useState<IPrayer | null>(null);

  // Notifications Sounds

  // Filters Buttons
  const [filters, setFilters] = useState("");

  // Search input
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400); // 400ms d'attente

  const { fetchData } = useFetch(true);
  const [currentPage, setCurrentPage] = useState(1);

  // get my prayers
  const {
    data: myPrayers,
    isLoading: isMyPrayersLoading,
    error: myPrayersError,
  } = useQuery({
    queryKey: ["myPrayers"],
    queryFn: () => fetchData<Data<IPrayer[]>>(getMyPrayersEndpoint()),
  });

  // get all prayers
  const {
    data: allPrayers,
    isLoading: isAllPrayersLoading,
    error: allPrayersError,
  } = useQuery({
    queryKey: ["allPrayers", filters, debouncedSearch, currentPage],
    queryFn: () =>
      fetchData<Data<IPrayer[]>>(
        `${getAllPrayersEndpoint}?page=${currentPage}&limit&filter=${filters}&search=${encodeURIComponent(debouncedSearch)}`,
      ),
    refetchOnWindowFocus: true,
    refetchInterval: 30000,
    refetchIntervalInBackground: false,
    staleTime: 30000,
  });

  const handleDeleteClick = (id: string) => {
    setSelectedPrayerId(id);
    setShowDeletePopup(true);
  };

  const handleEditClick = (prayer: IPrayer) => {
    setPrayerToEdit(prayer);
    setShowEditPopup(true);
  };

  const handleShowPeopleWhoPrayClick = (id: string) => {
    setSelectedPrayerId(id);
    setShowPeopleWhoPrayPopup(true);
  };

  return (
    <>
      <section className="prayer-room">
        <Filters
          search={search}
          setSearch={setSearch}
          filter={filters}
          setFilter={setFilters}
        />

        {/* Get my prayers */}
        <div className="mx-auto flex max-w-[1200px] flex-col place-items-center gap-3 p-2 sm:p-4 sm:grid sm:grid-cols-[repeat(auto-fill,minmax(376px,1fr))]">
          {!myPrayersError ? (
            isMyPrayersLoading ? (
              <ComponentsLoader />
            ) : myPrayers && myPrayers.data.length > 0 ? (
              myPrayers.data.map((prayer) => (
                <PrayerCard
                  key={prayer._id}
                  prayer={prayer}
                  currentUser
                  className="border-primary"
                  onDelete={() => handleDeleteClick(prayer._id)}
                  onEdit={() => handleEditClick(prayer)}
                  onShowPeoplePraying={() =>
                    handleShowPeopleWhoPrayClick(prayer._id)
                  }
                />
              ))
            ) : null
          ) : (
            <div className="text-red-600">Error: {myPrayersError?.message}</div>
          )}

          {/* Get all prayers */}
          {!allPrayersError ? (
            isAllPrayersLoading ? (
              <ComponentsLoader />
            ) : allPrayers && allPrayers?.data.length > 0 ? (
              allPrayers.data.map((prayer) => (
                <PrayerCard
                  key={prayer._id}
                  prayer={prayer}
                  className={prayer.isPrayed ? "praying-for" : ""}
                  prayeringFor={prayer.isPrayed}
                  likedBy={prayer.isLiked}
                />
              ))
            ) : null
          ) : (
            <div className="text-red-600">Error: {myPrayersError?.message}</div>
          )}
        </div>

        {allPrayers?.pagination && allPrayers?.pagination?.totalPages > 1 && (
          <Pagination
            pagination={allPrayers.pagination}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </section>

      {myPrayers?.data && myPrayers.data.length < 2 && (
        <button
          type="button"
          onClick={() => setMakeRequest(true)}
          className="btn btn-circle border-primary fixed right-8 bottom-16 z-50 h-12 w-12 shadow-sm transition-all duration-300 hover:scale-110 hover:shadow-lg"
        >
          <MdAdd className="text-3xl" />
        </button>
      )}

      <PrayerPopup makeRequest={makeRequest} setMakeRequest={setMakeRequest} />

      <DeleteConfirmation
        selectedPrayerId={selectedPrayerId}
        showDeletePopup={showDeletePopup}
        setShowDeletePopup={setShowDeletePopup}
      />

      <PrayerEdit
        openPopupEdit={showEditPopup}
        setOpenPopupEdit={setShowEditPopup}
        prayerToEdit={prayerToEdit}
      />

      <PrayingForYou
        selectedPrayerId={selectedPrayerId}
        showPeoplePrayingPopup={showPeopleWhoPrayPopup}
        setShowPeoplePrayingPopup={setShowPeopleWhoPrayPopup}
      />
    </>
  );
}

export default PrayerRoom;
