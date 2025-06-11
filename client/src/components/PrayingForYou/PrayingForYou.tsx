import { useEffect, useRef, useState } from "react";
import "./PrayingForYou.scss";
import PrayerPerson from "../PrayerPerson/PrayerPerson";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPeopleWhoPrayedEndpoint, getPeopleWhoLikedEndpoint } from "@/endpoint/Prayer";
import useFetch from "@/hook/useFetch";
import { IPrayingForYou } from "@/Interface/IPrayingForYou";
import { Data } from "@/Interface/Data";
import { useInView } from "react-intersection-observer";
import ComponentsLoader from "../ComponentsLoader/ComponentsLoader";

interface PrayingForYouProps {
  selectedPrayerId: string | null;
  showPeoplePrayingPopup: boolean;
  setShowPeoplePrayingPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

function PrayingForYou({
  selectedPrayerId,
  showPeoplePrayingPopup,
  setShowPeoplePrayingPopup,
}: PrayingForYouProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrollPeopleRef = useRef<HTMLDivElement>(null);

  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<0 | 1>(0); // 0 = prayed, 1 = liked

  const { fetchData } = useFetch(true);

  // Références pour l'infinite scroll
  const { ref: refPeople, inView: inViewPeople } = useInView();

  const commonQueryConfig = {
    initialPageParam: 1,
    getNextPageParam: (lastPage: Data<IPrayingForYou[]>, allPages: Data<IPrayingForYou[]>[]) => {
      const nextPage = allPages.length + 1;
      return lastPage.pagination?.hasNextPage ? nextPage : undefined;
    },
    enabled: !!selectedPrayerId && showPeoplePrayingPopup,
  };

  // 🔍 Query pour les "prayed"
  const {
    data: peopleWhoPrayed,
    fetchNextPage: fetchNextPrayedPage,
    hasNextPage: hasNextPrayedPage,
    isFetchingNextPage: isFetchingNextPrayedPage,
    error: peopleWhoPrayedError,
    isLoading: isPeopleWhoPrayedLoading,
  } = useInfiniteQuery({
    queryKey: ["peopleWhoPrayed", selectedPrayerId],
    queryFn: ({ pageParam = 1 }) =>
      fetchData<Data<IPrayingForYou[]>>(
        getPeopleWhoPrayedEndpoint(selectedPrayerId as string, pageParam, 4)
      ),
    ...commonQueryConfig,
  });

  // 🔍 Query pour les "liked"
  const {
    data: peopleWhoLiked,
    fetchNextPage: fetchNextLikedPage,
    hasNextPage: hasNextLikedPage,
    isFetchingNextPage: isFetchingNextLikedPage,
    error: peopleWhoLikedError,
    isLoading: isPeopleWhoLikedLoading,
  } = useInfiniteQuery({
    queryKey: ["peopleWhoLiked", selectedPrayerId],
    queryFn: ({ pageParam = 1 }) =>
      fetchData<Data<IPrayingForYou[]>>(
        getPeopleWhoLikedEndpoint(selectedPrayerId as string, pageParam, 4)
      ),
    ...commonQueryConfig,
  });

  // Infinite scroll par onglet actif
  useEffect(() => {
    if (!inViewPeople) return;

    if (activeTab === 0 && hasNextPrayedPage && !isFetchingNextPrayedPage) {
      fetchNextPrayedPage();
    } else if (activeTab === 1 && hasNextLikedPage && !isFetchingNextLikedPage) {
      fetchNextLikedPage();
    }
  }, [
    inViewPeople,
    activeTab,
    hasNextPrayedPage,
    isFetchingNextPrayedPage,
    hasNextLikedPage,
    isFetchingNextLikedPage,
    fetchNextPrayedPage,
    fetchNextLikedPage,
  ]);

  // Affichage progressif
  useEffect(() => {
    if (showPeoplePrayingPopup) {
      setVisible(true);
    } else {
      const timeout = setTimeout(() => setVisible(false), 100);
      return () => clearTimeout(timeout);
    }
  }, [showPeoplePrayingPopup]);

  // Fermeture au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const overlay = overlayRef.current;
      const content = contentRef.current;
      if (
        overlay?.classList.contains("active") &&
        content &&
        !content.contains(event.target as Node)
      ) {
        setShowPeoplePrayingPopup(false);
      }
    };

    if (showPeoplePrayingPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPeoplePrayingPopup, setShowPeoplePrayingPopup]);

  if (!visible) return null;

  // 💡 Données selon l'onglet actif
  const activeData = activeTab === 0 ? peopleWhoPrayed : peopleWhoLiked;
  const activeError = activeTab === 0 ? peopleWhoPrayedError : peopleWhoLikedError;
  const activeIsLoading = activeTab === 0 ? isPeopleWhoPrayedLoading : isPeopleWhoLikedLoading;

  return (
    <>
      <div
        ref={overlayRef}
        className={`popup-overlay ${showPeoplePrayingPopup ? "active" : ""}`}
        id="prayingForYou"
      >
        <div
          className="card bg-base-100 card-md w-96 shadow-sm"
          ref={contentRef}
        >
          <div className="card-body">
            <h2 className="card-title">Interactions Statistics</h2>

            <div className="flex gap-2 mb-4">
              <button
                className={`btn btn-sm ${activeTab === 0 ? "btn-primary" : "btn-outline"}`}
                onClick={() => setActiveTab(0)}
              >
                People who prayed
              </button>
              <button
                className={`btn btn-sm ${activeTab === 1 ? "btn-primary" : "btn-outline"}`}
                onClick={() => setActiveTab(1)}
              >
                People who liked
              </button>
            </div>

            <div
              className="relative flex max-h-[310px] min-h-fit w-full flex-col gap-2 overflow-y-auto p-1"
              ref={scrollPeopleRef}
            >
              {activeError ? (
                <p className="text-error text-center py-4">
                  {activeError.message}
                </p>
              ) : activeIsLoading ? (
                <ComponentsLoader className="absolute top-1/2 left-1/2" />
              ) : activeData?.pages.flatMap((page) => page.data).length === 0 ? (
                <p className="flex items-center justify-center gap-2 py-4 text-sm text-gray-500 italic">
                  <span role="img" aria-label="Praying hands">
                    🙏
                  </span>
                  No interactions yet.
                </p>
              ) : (
                activeData?.pages.map((page) =>
                  page.data.map((person) => (
                    <PrayerPerson key={person.user._id} PeoplePraying={person} action={activeTab === 0 ? "Prayed" : "Liked"} />
                  ))
                )
              )}

              {/* Infinite Loader */}
              {(activeTab === 0 ? hasNextPrayedPage : hasNextLikedPage) && (
                <div ref={refPeople} className="mx-auto my-4">
                  <ComponentsLoader />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PrayingForYou;
